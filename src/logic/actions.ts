import { Intent } from '../llm/intentSchema';

// Fake car state for demonstration
let carState = {
  direction: 'straight' as 'left' | 'right' | 'straight',
  speed: 0,
  musicPlaying: false,
  acOn: false
};

export function performAction(intent: Intent): string {
  console.info('🚗 Performing action:', intent);
  
  switch (intent.action) {
    case 'navigate':
      if (intent.target === 'left' || intent.target === 'right') {
        carState.direction = intent.target;
        const message = `Turning ${intent.target}${intent.extra ? ` (${intent.extra})` : ''}`;
        console.info('🧭', message);
        return message;
      }
      return 'Navigation command unclear';
      
    case 'music':
      if (intent.target === 'play' || intent.target === 'on') {
        carState.musicPlaying = true;
        const message = intent.extra || 'Music started';
        console.info('🎵', message);
        return message;
      } else if (intent.target === 'stop' || intent.target === 'off') {
        carState.musicPlaying = false;
        const message = 'Music stopped';
        console.info('🎵', message);
        return message;
      }
      return 'Music command unclear';
      
    case 'ac':
      if (intent.target === 'on') {
        carState.acOn = true;
        const message = intent.extra || 'AC turned on';
        console.info('❄️', message);
        return message;
      } else if (intent.target === 'off') {
        carState.acOn = false;
        const message = intent.extra || 'AC turned off';
        console.info('❄️', message);
        return message;
      }
      return 'AC command unclear';
      
    case 'stop':
      carState.speed = 0;
      const stopMessage = intent.extra || 'Vehicle stopped';
      console.info('🛑', stopMessage);
      
      // Special honk spam for chaos stops
      if (intent.extra?.includes('honk')) {
        setTimeout(() => {
          for (let i = 0; i < 5; i++) {
            setTimeout(() => console.info('📯 HONK!'), i * 200);
          }
        }, 500);
      }
      
      return stopMessage;
      
    case 'unknown':
      const unknownMessage = intent.extra || 'Unknown command - doing something random';
      console.info('❓', unknownMessage);
      
      // Trigger silly animation (just console for now)
      console.info('🌀 *car spins wildly*');
      
      return unknownMessage;
      
    default:
      return 'Action not recognized';
  }
}

export function getCarState() {
  return { ...carState };
}