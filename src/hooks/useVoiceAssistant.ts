import { useState, useCallback, useRef } from 'react';
import { VoiceState, VoiceIntent } from '../types';
import { SpeechService } from '../services/speech';
import { OpenAIService } from '../services/openai';
import { CommandService } from '../services/commands';

export const useVoiceAssistant = () => {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    transcript: '',
    isProcessing: false,
    lastIntent: null,
    lastResponse: '',
    error: null,
  });

  const speechService = useRef(new SpeechService());
  const openaiService = useRef(new OpenAIService());
  const commandService = useRef(new CommandService());

  const startListening = useCallback(() => {
    if (!speechService.current.isRecognitionSupported()) {
      setState(prev => ({
        ...prev,
        error: 'Speech recognition not supported in this browser',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isListening: true,
      error: null,
      transcript: '',
    }));

    speechService.current.startListening(
      (transcript, isFinal) => {
        setState(prev => ({
          ...prev,
          transcript,
        }));

        if (isFinal && transcript.trim()) {
          processVoiceInput(transcript);
        }
      },
      (error) => {
        setState(prev => ({
          ...prev,
          isListening: false,
          error,
        }));
      },
      () => {
        setState(prev => ({
          ...prev,
          isListening: false,
        }));
      }
    );
  }, []);

  const stopListening = useCallback(() => {
    speechService.current.stopListening();
    setState(prev => ({
      ...prev,
      isListening: false,
    }));
  }, []);

  const processVoiceInput = useCallback(async (transcript: string) => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      isListening: false,
    }));

    try {
      // Extract intent using OpenAI
      const intent: VoiceIntent = await openaiService.current.extractIntent(transcript);
      
      // Execute the command
      const response = await commandService.current.executeCommand(intent);

      setState(prev => ({
        ...prev,
        lastIntent: intent,
        lastResponse: response,
        isProcessing: false,
      }));

      // Speak the response
      try {
        await speechService.current.speak(response);
      } catch (error) {
        console.warn('Text-to-speech failed:', error);
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Processing failed',
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    speechService.current.stopListening();
    speechService.current.stopSpeaking();
    setState({
      isListening: false,
      transcript: '',
      isProcessing: false,
      lastIntent: null,
      lastResponse: '',
      error: null,
    });
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    clearError,
    reset,
    isSupported: speechService.current.isRecognitionSupported(),
  };
};