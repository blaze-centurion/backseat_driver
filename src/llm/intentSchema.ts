import { z } from 'zod';

export const IntentSchema = z.object({
  action: z.enum(["navigate", "music", "ac", "stop", "unknown"]),
  target: z.string().nullable(),
  extra: z.string().nullable()
});

export type Intent = z.infer<typeof IntentSchema>;

export function parseIntentJson(raw: string): Intent {
  try {
    // First try direct JSON parse
    const parsed = JSON.parse(raw);
    return IntentSchema.parse(parsed);
  } catch (error) {
    // Try to extract JSON from markdown code blocks or other wrapping
    const cleanedRaw = raw.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanedRaw);
      return IntentSchema.parse(parsed);
    } catch (error2) {
      // Try regex to find first {...} block
      const jsonMatch = raw.match(/\{[^}]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return IntentSchema.parse(parsed);
        } catch (error3) {
          // Still failed, return fallback
        }
      }
      
      // Final fallback
      return {
        action: "unknown",
        target: null,
        extra: raw.slice(0, 200)
      };
    }
  }
}