import React, { useState } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

const EXAMPLE_COMMANDS = [
  {
    category: 'Navigation',
    commands: [
      { text: 'Turn left', description: 'Navigate left (may be inverted by AI!)' },
      { text: 'Turn right', description: 'Navigate right (may be inverted by AI!)' },
      { text: 'Go forward', description: 'Move forward (may be inverted by AI!)' },
      { text: 'Go backward', description: 'Move backward (may be inverted by AI!)' },
      { text: 'Stop', description: 'Stop movement' },
    ],
  },
  {
    category: 'Nonsensical Commands (AI will interpret)',
    commands: [
      { text: 'Jump in the sky', description: 'AI will map to random movement' },
      { text: 'Spin backwards twice', description: 'AI will interpret creatively' },
      { text: 'Dance like a robot', description: 'AI will choose a movement action' },
      { text: 'Fly to the moon', description: 'AI will generate random direction' },
    ],
  },
  {
    category: 'Music Control',
    commands: [
      { text: 'Play music', description: 'Start music playback' },
      { text: 'Stop music', description: 'Stop music playback' },
      { text: 'Pause music', description: 'Pause current track' },
    ],
  },
  {
    category: 'Climate Control',
    commands: [
      { text: 'Turn AC on', description: 'Enable air conditioning' },
      { text: 'Turn AC off', description: 'Disable air conditioning' },
      { text: 'Set temperature to 72', description: 'Set specific temperature' },
    ],
  },
];

export const CommandList: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <List className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Available Commands</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-700">
          {EXAMPLE_COMMANDS.map((category, categoryIndex) => (
            <div key={categoryIndex} className="p-4">
              <h4 className="text-blue-400 font-semibold mb-3 flex items-center">
                {category.category}
                {category.category.includes('Navigation') && (
                  <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                    50% Inversion
                  </span>
                )}
              </h4>
              <div className="space-y-2">
                {category.commands.map((command, commandIndex) => (
                  <div
                    key={commandIndex}
                    className="bg-gray-900 rounded-lg p-3 hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-white font-medium">"{command.text}"</span>
                      <span className="text-gray-400 text-sm mt-1 sm:mt-0">{command.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};