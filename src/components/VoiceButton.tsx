import React from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isProcessing,
  onStart,
  onStop,
  disabled = false,
}) => {
  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  const getButtonClass = () => {
    const baseClass = "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
    
    if (isProcessing) {
      return `${baseClass} bg-yellow-500 hover:bg-yellow-600 animate-pulse`;
    } else if (isListening) {
      return `${baseClass} bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50`;
    } else {
      return `${baseClass} bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50`;
    }
  };

  const getIcon = () => {
    if (isProcessing) {
      return <Loader className="w-8 h-8 text-white animate-spin" />;
    } else if (isListening) {
      return <MicOff className="w-8 h-8 text-white" />;
    } else {
      return <Mic className="w-8 h-8 text-white" />;
    }
  };

  const getStatusText = () => {
    if (isProcessing) return "Processing...";
    if (isListening) return "Listening... Click to stop";
    return "Click to start listening";
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleClick}
        disabled={disabled || isProcessing}
        className={getButtonClass()}
        aria-label={getStatusText()}
      >
        {getIcon()}
        
        {/* Listening animation rings */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50 animation-delay-150"></div>
          </>
        )}
      </button>
      
      <p className="text-sm text-gray-400 text-center max-w-32">
        {getStatusText()}
      </p>
    </div>
  );
};