import { streamText } from 'ai';
import { groq, healthSystemPrompt } from '@/lib/ai';

export async function POST(req: Request) {
  const { message, context } = await req.json();

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: `${healthSystemPrompt}\nFormat output as: likely causes, immediate precautions, when to seek care.`,
    prompt: `User symptom message: ${message}\nContext: ${JSON.stringify(context || {})}`
  });

  return result.toTextStreamResponse();
}
