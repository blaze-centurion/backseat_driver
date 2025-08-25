export const SYSTEM_PROMPT = `You are an intent parser for a comedic absurd car game.
Convert messy speech into ONLY a compact JSON object with keys:
action , target (string|null), extra (string|null).
If nonsense or unclear, set action='unknown' and extra to the raw text.
Respond with ONLY JSON, no prose, no markdown.`;

export function buildUserPrompt(recognizedText: string): string {
  return `Examples:
"turn lft now!!" → {"action":"navigate","target":"left","extra":null}
"play some muisc brooo" → {"action":"music","target":"play","extra":null}
"ac off pls!!" → {"action":"ac","target":"off","extra":null}
"banana sandwich drive??" → {"action":"unknown","target":null,"extra":"banana sandwich drive??"}
"stop!" → {"action":"stop","target":null,"extra":null}
"go right" → {"action":"navigate","target":"right","extra":null}
"turn on music please" → {"action":"music","target":"on","extra":null}
"jump in the sky backwards" → {"action":"unknown","target":null,"extra":"jump in the sky backwards"}

Now parse: "${recognizedText}"`;
}