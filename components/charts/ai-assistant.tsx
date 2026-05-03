'use client';

import { useState } from 'react';

async function readStream(res: Response) {
  if (!res.body) return 'No response stream';
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let out = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

export function AIAssistant({ recentVitals, medications }: { recentVitals: unknown[]; medications: unknown[] }) {
  const [insights, setInsights] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatOutput, setChatOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateInsights() {
    setLoading(true);
    const res = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ recentVitals, medications })
    });
    const text = await readStream(res);
    setInsights(text);
    setLoading(false);
  }

  async function askSymptomChat() {
    if (!chatInput.trim()) return;
    setLoading(true);
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: chatInput, context: { recentVitals, medications } })
    });
    const text = await readStream(res);
    setChatOutput(text);
    setLoading(false);
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="card space-y-3">
        <h3 className="text-lg font-semibold">AI Health Insights</h3>
        <button className="btn" onClick={generateInsights} disabled={loading} type="button">
          {loading ? 'Analyzing...' : 'Generate Insights'}
        </button>
        <pre className="whitespace-pre-wrap text-sm text-slate-200">{insights || 'No insights generated yet.'}</pre>
      </div>

      <div className="card space-y-3">
        <h3 className="text-lg font-semibold">Symptom Analysis Chat</h3>
        <textarea
          className="input min-h-24"
          placeholder="Describe symptoms, duration, triggers..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button className="btn" onClick={askSymptomChat} disabled={loading} type="button">
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
        <pre className="whitespace-pre-wrap text-sm text-slate-200">{chatOutput || 'No response yet.'}</pre>
        <p className="text-xs text-amber-300">This is not a substitute for professional medical advice.</p>
      </div>
    </section>
  );
}
