import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, MicOff, Car, Settings, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { SpeechService } from './speech/speech';
import { getIntent } from './llm/client';
import { applyChaos } from './logic/chaos';
import { performAction } from './logic/actions';
import { Intent } from './llm/intentSchema';

interface DiagnosticsState {
  rawSTT: string;
  normalizedText: string;
  llmJson: Intent | null;
  finalAction: Intent | null;
  lastError: string | null;
}

function App() {
  // Core state
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chaosPct, setChaosPct] = useState(70);
  
  // Settings
  const [streamInterim, setStreamInterim] = useState(false);
  const [speakResponses, setSpeakResponses] = useState(true);
  const [debugLogs, setDebugLogs] = useState(false);
  
  // Diagnostics
  const [diagnostics, setDiagnostics] = useState<DiagnosticsState>({
    rawSTT: '',
    normalizedText: '',
    llmJson: null,
    finalAction: null,
    lastError: null
  });
  
  // Simulation
  const [simulateText, setSimulateText] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  
  // Services
  const speechService = useRef(new SpeechService());
  const ttsQueue = useRef<string[]>([]);
  const isSpeaking = useRef(false);
  
  // Check for OpenAI API key
  const hasApiKey = !!import.meta.env.VITE_OPENAI_API_KEY;

  // TTS Queue Management
  const processTTSQueue = useCallback(async () => {
    if (isSpeaking.current || ttsQueue.current.length === 0) return;
    
    isSpeaking.current = true;
    const text = ttsQueue.current.shift()!;
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        isSpeaking.current = false;
        processTTSQueue(); // Process next in queue
      };
      
      utterance.onerror = () => {
        isSpeaking.current = false;
        processTTSQueue(); // Continue queue on error
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      isSpeaking.current = false;
      console.error('TTS error:', error);
    }
  }, []);

  const queueTTS = useCallback((text: string) => {
    if (!speakResponses) return;
    ttsQueue.current.push(text);
    processTTSQueue();
  }, [speakResponses, processTTSQueue]);

  // Main processing pipeline
  const processText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Stage 1: Raw STT
      const rawSTT = text;
      const normalizedText = text.trim().toLowerCase();
      
      if (debugLogs) {
        console.log('🎤 Raw STT:', rawSTT);
        console.log('🔧 Normalized:', normalizedText);
      }
      
      setDiagnostics(prev => ({
        ...prev,
        rawSTT,
        normalizedText,
        lastError: null
      }));
      
      // Stage 2: LLM Intent Extraction
      const llmIntent = await getIntent(rawSTT);
      
      if (debugLogs) {
        console.log('🤖 LLM Intent:', llmIntent);
      }
      
      setDiagnostics(prev => ({
        ...prev,
        llmJson: llmIntent
      }));
      
      // Stage 3: Apply Chaos
      const finalIntent = applyChaos(llmIntent, chaosPct);
      
      if (debugLogs) {
        console.log('🌀 Final Intent (post-chaos):', finalIntent);
      }
      
      setDiagnostics(prev => ({
        ...prev,
        finalAction: finalIntent
      }));
      
      // Stage 4: Perform Action
      const actionResult = performAction(finalIntent);
      setLastResponse(actionResult);
      
      // Stage 5: TTS Response
      queueTTS(actionResult);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Processing error:', error);
      
      setDiagnostics(prev => ({
        ...prev,
        lastError: errorMsg
      }));
      
      setLastResponse('Sorry, something went wrong');
      queueTTS('Sorry, something went wrong');
    } finally {
      setIsProcessing(false);
    }
  }, [chaosPct, debugLogs, queueTTS]);

  // Speech Recognition Handlers
  const startListening = useCallback(() => {
    if (!speechService.current.isSupported()) {
      setDiagnostics(prev => ({
        ...prev,
        lastError: 'Speech recognition not supported in this browser'
      }));
      return;
    }

    setIsListening(true);
    setDiagnostics(prev => ({ ...prev, rawSTT: '', lastError: null }));

    speechService.current.startListening({
      onResult: (text, isFinal) => {
        if (streamInterim && !isFinal) {
          setDiagnostics(prev => ({ ...prev, rawSTT: text }));
        } else if (isFinal) {
          processText(text);
        }
      },
      onError: (error) => {
        setIsListening(false);
        setDiagnostics(prev => ({ ...prev, lastError: error }));
      },
      onEnd: () => {
        setIsListening(false);
      }
    }, streamInterim);
  }, [streamInterim, processText]);

  const stopListening = useCallback(() => {
    speechService.current.stopListening();
    setIsListening(false);
  }, []);

  // Simulate text input
  const handleSimulate = useCallback(() => {
    if (simulateText.trim()) {
      processText(simulateText);
      setSimulateText('');
    }
  }, [simulateText, processText]);

  // Clear diagnostics
  const clearDiagnostics = useCallback(() => {
    setDiagnostics({
      rawSTT: '',
      normalizedText: '',
      llmJson: null,
      finalAction: null,
      lastError: null
    });
    setLastResponse('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold">Backseat Driver</h1>
              <span className="text-sm text-gray-400">Senseless & Comedic</span>
            </div>
            
            {!hasApiKey && (
              <div className="bg-blue-900/50 border border-blue-500 rounded-lg px-4 py-2">
                <span className="text-blue-200 text-sm"></span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Voice Control */}
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } ${isProcessing ? 'animate-spin' : ''}`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
              
              <p className="mt-4 text-gray-300">
                {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Click to start'}
              </p>
            </div>

            {/* Chaos Control */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                Chaos Level: {chaosPct}%
              </h3>
              <input
                type="range"
                min="0"
                max="100"
                value={chaosPct}
                onChange={(e) => setChaosPct(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>Obedient</span>
                <span>Chaotic</span>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={streamInterim}
                    onChange={(e) => setStreamInterim(e.target.checked)}
                    className="rounded"
                  />
                  <span>Stream interim STT</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={speakResponses}
                    onChange={(e) => setSpeakResponses(e.target.checked)}
                    className="rounded"
                  />
                  <span className="flex items-center">
                    {speakResponses ? <Volume2 className="w-4 h-4 mr-1" /> : <VolumeX className="w-4 h-4 mr-1" />}
                    Speak responses (TTS)
                  </span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={debugLogs}
                    onChange={(e) => setDebugLogs(e.target.checked)}
                    className="rounded"
                  />
                  <span>Debug logs</span>
                </label>
              </div>
            </div>

            {/* Simulate Input */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Simulate Input</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={simulateText}
                  onChange={(e) => setSimulateText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSimulate()}
                  placeholder="Type command to test..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                />
                <button
                  onClick={handleSimulate}
                  disabled={!simulateText.trim() || isProcessing}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Last Response */}
            {lastResponse && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Last Action</h3>
                <p className="text-white text-lg">{lastResponse}</p>
              </div>
            )}
          </div>

          {/* Diagnostics Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Diagnostics</h2>
              <button
                onClick={clearDiagnostics}
                className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Raw STT */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">Raw STT</h4>
              <div className="bg-gray-900 rounded p-3 min-h-[60px] font-mono text-sm">
                {diagnostics.rawSTT || <span className="text-gray-500 italic">No input yet</span>}
              </div>
            </div>

            {/* Normalized Text */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">Normalized</h4>
              <div className="bg-gray-900 rounded p-3 min-h-[40px] font-mono text-sm">
                {diagnostics.normalizedText || <span className="text-gray-500 italic">-</span>}
              </div>
            </div>

            {/* LLM JSON */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-2">LLM JSON</h4>
              <div className="bg-gray-900 rounded p-3 min-h-[80px] font-mono text-xs overflow-x-auto">
                {diagnostics.llmJson ? (
                  <pre className="text-purple-300">
                    {JSON.stringify(diagnostics.llmJson, null, 2)}
                  </pre>
                ) : (
                  <span className="text-gray-500 italic">No intent yet</span>
                )}
              </div>
            </div>

            {/* Final Action */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-400 mb-2">Final Action (Post-Chaos)</h4>
              <div className="bg-gray-900 rounded p-3 min-h-[80px] font-mono text-xs overflow-x-auto">
                {diagnostics.finalAction ? (
                  <pre className="text-yellow-300">
                    {JSON.stringify(diagnostics.finalAction, null, 2)}
                  </pre>
                ) : (
                  <span className="text-gray-500 italic">No action yet</span>
                )}
              </div>
            </div>

            {/* Error Area */}
            {diagnostics.lastError && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">Last Error</h4>
                <p className="text-red-200 text-sm">{diagnostics.lastError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;