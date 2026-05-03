import { streamText } from 'ai';
import { groq, healthSystemPrompt } from '@/lib/ai';

export async function POST(req: Request) {
  const payload = await req.json();

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: healthSystemPrompt,
    prompt: `Create a weekly health digest for this user data: ${JSON.stringify(payload)}\nSections: trend summary, medication adherence risks, recommended follow-ups.`
  });

  return result.toTextStreamResponse();
}
