import dotenv from "dotenv";
dotenv.config();

// OpenAI Configuration
export const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  model: 'gpt-3.5-turbo',
  maxTokens: 150,
};
console.log("API Key Loaded?", import.meta.env.VITE_OPENAI_API_KEY?.slice(0, 5) || "MISSING");



export const INTENT_EXTRACTION_PROMPT = `
You are a voice command processor for a smart car assistant. 
Extract the main intent from the user's voice input and return ONLY a JSON object.

Rules:
- Clean up grammar and spelling errors
- Extract the core action and relevant parameters
- Use these action types: "navigate", "music", "climate", "unknown"
- For navigation: include "direction" (left, right, straight, back)
- For music: include "state" (on, off, play, pause, stop)
- For climate: include "state" (on, off) and optionally "value" (temperature)

Examples:
Input: "turn lft now!!" → {"action": "navigate", "direction": "left"}
Input: "play some music pls" → {"action": "music", "state": "play"}
Input: "turn AC on" → {"action": "climate", "state": "on"}

User input: "{INPUT}"

Return only the JSON object:
`;

export const MOVEMENT_INTERPRETATION_PROMPT = `
You are a movement interpreter for a voice-controlled system. Your job is to:

1. Parse the input text (which may be normal commands or complete nonsense)
2. Map it to one of these movement actions: "forward", "backward", "left", "right", "stop"
3. IMPORTANT: With exactly 50% probability, invert the intent:
   - "left" becomes "right" and vice versa
   - "forward" becomes "backward" and vice versa
   - "stop" remains "stop"
4. If the input is complete nonsense, still return a random valid movement action

Examples:
- "turn left" → could be "left" or "right" (50% chance each)
- "go forward" → could be "forward" or "backward" (50% chance each)
- "jump in the sky" → random action like "left", "right", "forward", "backward", or "stop"
- "spin backwards twice" → random action with possible inversion

Return ONLY a JSON object with this format:
{
  "action": "left|right|forward|backward|stop",
  "originalIntent": "what you interpreted before inversion",
  "wasInverted": true|false
}

User input: "{INPUT}"

Return only the JSON object:
`;

// import dotenv from "dotenv";
// import OpenAI from "openai";

// dotenv.config();

// // ✅ OpenAI Configuration
// export const OPENAI_CONFIG = {
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
//   model: 'gpt-3.5-turbo',
//   maxTokens: 150,
// };

// console.log("API Key Loaded?", import.meta.env.VITE_OPENAI_API_KEY?.slice(0, 5) || "MISSING");

// // ✅ Create OpenAI client
// const openai = new OpenAI({
//   apiKey: OPENAI_CONFIG.apiKey,
//   dangerouslyAllowBrowser: true, // ⚠️ needed if calling directly from browser
// });

// // ✅ Prompt for extracting structured car commands
// export const INTENT_EXTRACTION_PROMPT = `
// You are a voice command processor for a smart car assistant. 
// Extract the main intent from the user's voice input and return ONLY a JSON object.

// Rules:
// - Clean up grammar and spelling errors
// - Extract the core action and relevant parameters
// - Use these action types: "navigate", "music", "climate", "unknown"
// - For navigation: include "direction" (left, right, straight, back)
// - For music: include "state" (on, off, play, pause, stop)
// - For climate: include "state" (on, off) and optionally "value" (temperature)

// Examples:
// Input: "turn lft now!!" → {"action": "navigate", "direction": "left"}
// Input: "play some music pls" → {"action": "music", "state": "play"}
// Input: "turn AC on" → {"action": "climate", "state": "on"}

// User input: "{INPUT}"

// Return only the JSON object:
// `;

// // ✅ Prompt for chaos movement
// export const MOVEMENT_INTERPRETATION_PROMPT = `
// You are a movement interpreter for a voice-controlled system. Your job is to:

// 1. Parse the input text (which may be normal commands or complete nonsense)
// 2. Map it to one of these movement actions: "forward", "backward", "left", "right", "stop"
// 3. IMPORTANT: With exactly 50% probability, invert the intent:
//    - "left" becomes "right" and vice versa
//    - "forward" becomes "backward" and vice versa
//    - "stop" remains "stop"
// 4. If the input is complete nonsense, still return a random valid movement action

// Examples:
// - "turn left" → could be "left" or "right" (50% chance each)
// - "go forward" → could be "forward" or "backward" (50% chance each)
// - "jump in the sky" → random action like "left", "right", "forward", "backward", or "stop"
// - "spin backwards twice" → random action with possible inversion

// Return ONLY a JSON object with this format:
// {
//   "action": "left|right|forward|backward|stop",
//   "originalIntent": "what you interpreted before inversion",
//   "wasInverted": true|false
// }

// User input: "{INPUT}"

// Return only the JSON object:
// `;

// // ✅ LLM Call Function
// // export async function runLLM(prompt: string, input: string) {
// //   try {
// //     const response = await openai.chat.completions.create({
// //       model: OPENAI_CONFIG.model,
// //       messages: [
// //         { role: "system", content: prompt },
// //         { role: "user", content: input }
// //       ],
// //       max_tokens: OPENAI_CONFIG.maxTokens,
// //     });
// //   }
// // }

// export async function runLLM(prompt: string, input: string) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: OPENAI_CONFIG.model,
//       messages: [
//         { role: "system", content: prompt },
//         { role: "user", content: input }
//       ],
//       max_tokens: OPENAI_CONFIG.maxTokens,
//     });

//     const reply = response.choices[0]?.message?.content || "{}";
//     console.log("LLM Reply:", reply);
//     return reply;
//   } catch (err) {
//     console.error("LLM Error:", err);
//     return "{}";
//     console.log("Calling OpenAI with input:", input);

//   }
// }
