import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface TranscriptDisplayProps {
  transcript: string;
  isListening: boolean;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript,
  isListening,
}) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (transcript) {
      setDisplayText(transcript);
    } else if (isListening) {
      setDisplayText('Listening...');
    } else {
      setDisplayText('Ready to listen');
    }
  }, [transcript, isListening]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 min-h-[120px] border border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Voice Input</h3>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 min-h-[60px] flex items-center">
        {transcript ? (
          <p className="text-white text-lg leading-relaxed">
            "{transcript}"
          </p>
        ) : (
          <p className="text-gray-400 italic">
            {isListening ? (
              <span className="flex items-center">
                Listening
                <span className="ml-2 flex space-x-1">
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce animation-delay-100"></span>
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce animation-delay-200"></span>
                </span>
              </span>
            ) : (
              'Click the microphone to start speaking'
            )}
          </p>
        )}
      </div>
    </div>
  );
};