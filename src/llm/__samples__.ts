import { getIntent } from './client';
import { applyChaos } from '../logic/chaos';

// Quick testing samples
const TEST_INPUTS = [
  "turn lft",
  "go right", 
  "banana sandwich drive",
  "stop now",
  "play music please",
  "ac off",
  "jump in the sky backwards"
];

export async function runSamples() {
  console.log('🧪 Running LLM samples...');
  
  for (const input of TEST_INPUTS) {
    try {
      console.log(`\n📝 Input: "${input}"`);
      
      // Get intent from LLM
      const intent = await getIntent(input);
      console.log('🤖 LLM Intent:', intent);
      
      // Apply chaos with 100% probability
      const chaosIntent = applyChaos(intent, 100);
      console.log('🌀 Chaos Result:', chaosIntent);
      
    } catch (error) {
      console.error(`❌ Error processing "${input}":`, error);
    }
  }
  
  console.log('\n✅ Sample testing complete');
}

// Uncomment to run samples in development
// if (import.meta.env.DEV) {
//   runSamples();
// }