import { OPENAI_CONFIG, INTENT_EXTRACTION_PROMPT, MOVEMENT_INTERPRETATION_PROMPT } from '../config/openai';
import { VoiceIntent, MovementAction } from '../types';

export class OpenAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = OPENAI_CONFIG.apiKey;
  }

  async extractIntent(text: string): Promise<VoiceIntent> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Using fallback intent extraction.');
      return this.fallbackIntentExtraction(text);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.model,
          messages: [
            {
              role: 'user',
              content: INTENT_EXTRACTION_PROMPT.replace('{INPUT}', text)
            }
          ],
          max_tokens: OPENAI_CONFIG.maxTokens,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      // Try to parse the JSON response
      try {
        return JSON.parse(content);
      } catch {
        // If JSON parsing fails, use fallback
        return this.fallbackIntentExtraction(text);
      }
    } catch (error) {
      console.error('OpenAI service error:', error);
      return this.fallbackIntentExtraction(text);
    }
  }

  async interpretMovement(text: string): Promise<MovementAction> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Using fallback movement interpretation.');
      return this.fallbackMovementInterpretation(text);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.model,
          messages: [
            {
              role: 'user',
              content: MOVEMENT_INTERPRETATION_PROMPT.replace('{INPUT}', text)
            }
          ],
          max_tokens: OPENAI_CONFIG.maxTokens,
          temperature: 0.8, // Higher temperature for more randomness
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      // Try to parse the JSON response
      try {
        const result = JSON.parse(content);
        return {
          action: result.action,
          originalInput: text,
          wasInverted: result.wasInverted || false
        };
      } catch {
        // If JSON parsing fails, use fallback
        return this.fallbackMovementInterpretation(text);
      }
    } catch (error) {
      console.error('OpenAI movement interpretation error:', error);
      return this.fallbackMovementInterpretation(text);
    }
  }

  private fallbackMovementInterpretation(text: string): MovementAction {
    const lowerText = text.toLowerCase();
    const actions: Array<'forward' | 'backward' | 'left' | 'right' | 'stop'> = 
      ['forward', 'backward', 'left', 'right', 'stop'];
    
    let originalIntent: 'forward' | 'backward' | 'left' | 'right' | 'stop' = 'stop';
    
    // Try to extract intent from text
    if (lowerText.includes('left')) {
      originalIntent = 'left';
    } else if (lowerText.includes('right')) {
      originalIntent = 'right';
    } else if (lowerText.includes('forward') || lowerText.includes('ahead') || lowerText.includes('straight')) {
      originalIntent = 'forward';
    } else if (lowerText.includes('back') || lowerText.includes('reverse')) {
      originalIntent = 'backward';
    } else if (lowerText.includes('stop') || lowerText.includes('halt')) {
      originalIntent = 'stop';
    } else {
      // For nonsensical input, pick a random action
      originalIntent = actions[Math.floor(Math.random() * actions.length)];
    }
    
    // 50% chance to invert the intent
    const shouldInvert = Math.random() < 0.5;
    let finalAction = originalIntent;
    
    if (shouldInvert && originalIntent !== 'stop') {
      switch (originalIntent) {
        case 'left':
          finalAction = 'right';
          break;
        case 'right':
          finalAction = 'left';
          break;
        case 'forward':
          finalAction = 'backward';
          break;
        case 'backward':
          finalAction = 'forward';
          break;
      }
    }
    
    return {
      action: finalAction,
      originalInput: text,
      wasInverted: shouldInvert && originalIntent !== 'stop'
    };
  }

  private fallbackIntentExtraction(text: string): VoiceIntent {
    const lowerText = text.toLowerCase();
    
    // Navigation commands
    if (lowerText.includes('turn') || lowerText.includes('go')) {
      if (lowerText.includes('left')) {
        return { action: 'navigate', direction: 'left' };
      }
      if (lowerText.includes('right')) {
        return { action: 'navigate', direction: 'right' };
      }
      if (lowerText.includes('straight')) {
        return { action: 'navigate', direction: 'straight' };
      }
    }

    // Music commands
    if (lowerText.includes('music') || lowerText.includes('play') || lowerText.includes('song')) {
      if (lowerText.includes('play') || lowerText.includes('start')) {
        return { action: 'music', state: 'on' };
      }
      if (lowerText.includes('stop') || lowerText.includes('pause')) {
        return { action: 'music', state: 'off' };
      }
      return { action: 'music', state: 'on' };
    }

    // Climate commands
    if (lowerText.includes('ac') || lowerText.includes('air') || lowerText.includes('temperature')) {
      if (lowerText.includes('on') || lowerText.includes('start')) {
        return { action: 'climate', state: 'on' };
      }
      if (lowerText.includes('off') || lowerText.includes('stop')) {
        return { action: 'climate', state: 'off' };
      }
      return { action: 'climate', state: 'on' };
    }

    return { action: 'unknown' };
  }
}