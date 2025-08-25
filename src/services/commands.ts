import { Command, VoiceIntent, MovementAction } from '../types';
import { OpenAIService } from './openai';

export class CommandService {
  private openaiService: OpenAIService;

  constructor() {
    this.openaiService = new OpenAIService();
  }

  private commands: Command[] = [
    {
      keywords: ['navigate', 'turn', 'go'],
      action: 'navigate',
      handler: this.handleNavigation,
    },
    {
      keywords: ['music', 'play', 'song'],
      action: 'music',
      handler: this.handleMusic,
    },
    {
      keywords: ['climate', 'ac', 'air', 'temperature'],
      action: 'climate',
      handler: this.handleClimate,
    },
  ];

  async executeCommand(intent: VoiceIntent): Promise<string> {
    // Special handling for navigation commands - use LLM interpretation
    if (intent.action === 'navigate') {
      return await this.handleNavigationWithLLM(intent);
    }
    
    const command = this.commands.find(cmd => cmd.action === intent.action);
    
    if (command) {
      return await command.handler(intent);
    } else {
      return "I didn't understand that command. Try saying 'turn left', 'play music', or 'turn on AC'.";
    }
  }

  private async handleNavigationWithLLM(intent: VoiceIntent): Promise<string> {
    try {
      // Use the original transcript or reconstruct from intent
      const inputText = this.reconstructInputFromIntent(intent);
      
      // Get LLM interpretation with random behavior
      const movementAction: MovementAction = await this.openaiService.interpretMovement(inputText);
      
      // Execute the movement
      console.log(`🤖 LLM Movement Interpretation:`, movementAction);
      await this.simulateMovement(movementAction);
      
      // Generate response message
      let response = `Moving ${movementAction.action}.`;
      
      if (movementAction.wasInverted) {
        response += ` (Actually, I decided to do the opposite! 😈)`;
      }
      
      return response;
      
    } catch (error) {
      console.error('LLM navigation error:', error);
      // Fallback to original navigation handling
      return await this.handleNavigation(intent);
    }
  }

  private reconstructInputFromIntent(intent: VoiceIntent): string {
    // Try to reconstruct likely input text from intent
    if (intent.direction) {
      return `turn ${intent.direction}`;
    }
    return 'move';
  }

  private async simulateMovement(movementAction: MovementAction): Promise<void> {
    // Simulate movement action with visual feedback
    console.log(`🚗 Movement: ${movementAction.action.toUpperCase()}`);
    console.log(`📝 Original input: "${movementAction.originalInput}"`);
    console.log(`🔄 Was inverted: ${movementAction.wasInverted}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real implementation, this would call actual movement APIs
    console.log(`✅ Movement completed: ${movementAction.action}`);
  }

  private async handleNavigation(intent: VoiceIntent): Promise<string> {
    const direction = intent.direction || 'forward';
    
    // Simulate navigation action
    console.log(`🧭 Navigation: Turning ${direction}`);
    
    // In a real car integration, this would call actual navigation APIs
    await this.simulateCarAction('navigation', { direction });
    
    return `Turning ${direction} now.`;
  }

  private async handleMusic(intent: VoiceIntent): Promise<string> {
    const state = intent.state || 'on';
    
    // Simulate music control
    console.log(`🎵 Music: ${state === 'on' ? 'Starting' : 'Stopping'} playback`);
    
    await this.simulateCarAction('music', { state });
    
    if (state === 'on' || state === 'play') {
      return 'Playing your music now.';
    } else {
      return 'Music stopped.';
    }
  }

  private async handleClimate(intent: VoiceIntent): Promise<string> {
    const state = intent.state || 'on';
    const value = intent.value;
    
    // Simulate climate control
    console.log(`🌡️ Climate: Turning AC ${state}`, value ? `at ${value}` : '');
    
    await this.simulateCarAction('climate', { state, value });
    
    if (state === 'on') {
      return value 
        ? `Air conditioning set to ${value} degrees.`
        : 'Air conditioning turned on.';
    } else {
      return 'Air conditioning turned off.';
    }
  }

  private async simulateCarAction(system: string, params: any): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would integrate with car APIs
    console.log(`🚗 Car API Call: ${system}`, params);
  }

  // Method to add new commands dynamically
  addCommand(command: Command) {
    this.commands.push(command);
  }

  getAvailableCommands(): string[] {
    return this.commands.map(cmd => cmd.action);
  }
}