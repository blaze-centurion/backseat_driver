import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
  onClose: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <span className="text-red-200">{error}</span>
      </div>
      <button
        onClick={onClose}
        className="text-red-400 hover:text-red-300 transition-colors"
        aria-label="Close error"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};