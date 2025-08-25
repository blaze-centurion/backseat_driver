import React from 'react';
import { Brain } from 'lucide-react';
import { VoiceIntent } from '../types';

interface IntentDisplayProps {
  intent: VoiceIntent | null;
  isProcessing: boolean;
}

export const IntentDisplay: React.FC<IntentDisplayProps> = ({
  intent,
  isProcessing,
}) => {
  const formatJSON = (obj: VoiceIntent) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 min-h-[200px] border border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Extracted Intent</h3>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 min-h-[120px] font-mono text-sm">
        {isProcessing ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce animation-delay-200"></div>
            </div>
            <span className="ml-3 text-green-400">Processing with LLM...</span>
          </div>
        ) : intent ? (
          <div className="space-y-3">
            <pre className="text-green-400 overflow-x-auto">
              {formatJSON(intent)}
            </pre>
            {intent.wasInverted && (
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-2">
                <span className="text-yellow-400 text-xs font-semibold">
                  🔄 LLM INVERTED: Original intent was modified by AI!
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 italic flex items-center justify-center h-full">
            No intent extracted yet
          </p>
        )}
      </div>
    </div>
  );
};