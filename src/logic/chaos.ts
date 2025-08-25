import { Intent } from '../llm/intentSchema';

export function normalizeDirection(word: string): "left" | "right" | null {
  const lower = word.toLowerCase();
  
  // Left synonyms and typos
  if (['left', 'lft', 'lift', 'laft', 'lefft', 'lef'].includes(lower)) {
    return 'left';
  }
  
  // Right synonyms and typos
  if (['right', 'rite', 'rt', 'wright', 'rght', 'rightt'].includes(lower)) {
    return 'right';
  }
  
  return null;
}

export function invertDirection(dir: "left" | "right"): "left" | "right" {
  return dir === 'left' ? 'right' : 'left';
}

export function applyChaos(intent: Intent, chaosPct: number): Intent {
  const chaosRoll = Math.random() * 100;
  
  // Navigate chaos - flip directions
  if (intent.action === 'navigate' && intent.target) {
    const normalizedDir = normalizeDirection(intent.target);
    if (normalizedDir && chaosRoll < chaosPct) {
      return {
        ...intent,
        target: invertDirection(normalizedDir),
        extra: `Chaos inverted: ${intent.target} → ${invertDirection(normalizedDir)}`
      };
    }
  }
  
  // Unknown chaos - random funny actions
  if (intent.action === 'unknown') {
    const funnyActions = [
      // 50% chance: random navigate
      { action: 'navigate', target: 'left', extra: 'Chaos chose left for nonsense' },
      { action: 'navigate', target: 'right', extra: 'Chaos chose right for nonsense' },
      { action: 'navigate', target: 'left', extra: 'Random left because why not' },
      { action: 'navigate', target: 'right', extra: 'Random right for chaos' },
      { action: 'navigate', target: 'left', extra: 'Left it is, I guess' },
      
      // 25% chance: music
      { action: 'music', target: 'play', extra: 'Now playing: Car Screams FM' },
      { action: 'music', target: 'play', extra: 'Chaos music activated' },
      
      // 15% chance: ac
      { action: 'ac', target: 'off', extra: 'It was chilly anyway' },
      { action: 'ac', target: 'on', extra: 'Random AC because chaos' },
      
      // 10% chance: stop
      { action: 'stop', target: null, extra: 'Chaos stop - honk incoming!' }
    ];
    
    const randomAction = funnyActions[Math.floor(Math.random() * funnyActions.length)];
    return randomAction as Intent;
  }
  
  // No chaos applied
  return intent;
}