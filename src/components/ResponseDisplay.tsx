import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface ResponseDisplayProps {
  response: string;
  isProcessing: boolean;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  response,
  isProcessing,
}) => {
  const [animatedText, setAnimatedText] = useState('');
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (response && !isProcessing) {
      setAnimatedText('');
      setShowCursor(true);
      
      let index = 0;
      const timer = setInterval(() => {
        if (index < response.length) {
          setAnimatedText(response.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setTimeout(() => setShowCursor(false), 500);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [response, isProcessing]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 min-h-[120px] border border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Assistant Response</h3>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 min-h-[60px] flex items-center">
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
            </div>
            <span className="text-purple-400">Thinking...</span>
          </div>
        ) : animatedText ? (
          <p className="text-white text-lg">
            {animatedText}
            {showCursor && <span className="animate-pulse">|</span>}
          </p>
        ) : (
          <p className="text-gray-400 italic">
            Waiting for voice input...
          </p>
        )}
      </div>
    </div>
  );
};