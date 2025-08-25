// 

import { Intent, parseIntentJson } from './intentSchema';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompt';
import { GoogleGenAI } from '@google/genai'; // Gemini SDK

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MAX_RETRIES = 3;
const BASE_DELAY = 200;

const client = new GoogleGenAI({
  apiKey: GEMINI_API_KEY
});

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getIntent(recognized: string): Promise<Intent> {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key missing, using fallback parsing');
    return fallbackIntent(recognized);
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // const response = await client.models.generateContent({
      //   model: 'gemini-2.5-flash', // change model as needed
      //   contents: [
      //     { role: 'system', text: SYSTEM_PROMPT },
      //     { role: 'user', text: buildUserPrompt(recognized) }
      //   ],
      //   temperature: 0,
      //   maxOutputTokens: 150
      // });

      // const content = response?.candidates?.[0]?.content?.[0]?.text?.trim();

            const response = await client.models.generateContent({
        model: 'models/gemini-2.5-flash', // Adjust model as needed
        contents: [
           SYSTEM_PROMPT ,
          buildUserPrompt(recognized)
        ],
      });

      const content = response.text?.trim();
      console.log("Cotent:", content);
      

      if (!content) {
        throw new Error('No content in Gemini response');
      }

      // Strip code fences if present
      const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();

      // Parse and validate with schema
      return parseIntentJson(cleanContent);

    } catch (error) {
      lastError = error as Error;
      console.error(`Gemini attempt ${attempt + 1} failed:`, error);

      if (attempt < MAX_RETRIES - 1) {
        const delayMs = BASE_DELAY * Math.pow(3, attempt);
        await delay(delayMs);
      }
    }
  }

  console.error('All Gemini attempts failed, using fallback:', lastError);
  return fallbackIntent(recognized);
}

function fallbackIntent(recognized: string): Intent {
  const lower = recognized.toLowerCase();

  if (lower.includes('left') || lower.includes('lft')) {
    return { action: 'navigate', target: 'left', extra: null };
  }
  if (lower.includes('right') || lower.includes('rite')) {
    return { action: 'navigate', target: 'right', extra: null };
  }
  if (lower.includes('music') || lower.includes('play')) {
    return { action: 'music', target: 'play', extra: null };
  }
  if (lower.includes('ac') || lower.includes('air')) {
    if (lower.includes('off')) {
      return { action: 'ac', target: 'off', extra: null };
    }
    return { action: 'ac', target: 'on', extra: null };
  }
  if (lower.includes('stop')) {
    return { action: 'stop', target: null, extra: null };
  }

  return {
    action: 'unknown',
    target: null,
    extra: recognized.slice(0, 200)
  };
}
