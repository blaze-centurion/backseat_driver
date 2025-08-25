export interface VoiceIntent {
  action: string;
  direction?: string;
  state?: 'on' | 'off';
  value?: string;
  confidence?: number;
  originalIntent?: string;
  wasInverted?: boolean;
}

export interface Command {
  keywords: string[];
  action: string;
  handler: (intent: VoiceIntent) => Promise<string>;
}

export interface VoiceState {
  isListening: boolean;
  transcript: string;
  isProcessing: boolean;
  lastIntent: VoiceIntent | null;
  lastResponse: string;
  error: string | null;
}

export interface MovementAction {
  action: 'forward' | 'backward' | 'left' | 'right' | 'stop';
  originalInput: string;
  wasInverted: boolean;
}