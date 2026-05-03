import { createGroq } from '@ai-sdk/groq';

export const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export const healthSystemPrompt = `You are a health data analyst for a personal wellness app.
Provide concise and structured insights from user records.
Always include: This is not a substitute for professional medical advice.`;
