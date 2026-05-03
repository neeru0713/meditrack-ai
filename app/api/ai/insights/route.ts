import { streamText } from 'ai';
import { groq, healthSystemPrompt } from '@/lib/ai';

export async function POST(req: Request) {
  const { recentVitals, medications } = await req.json();

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: healthSystemPrompt,
    prompt: `Analyse these recent vitals: ${JSON.stringify(recentVitals)}\nCurrent medications: ${JSON.stringify(medications)}\nProvide 3 key observations and recommendations.`
  });

  return result.toTextStreamResponse();
}
