'use client';

import { FormEvent, useEffect, useState } from 'react';

type Symptom = { _id: string; title: string; severity: 'mild' | 'moderate' | 'severe'; description?: string; recordedAt: string };

export default function SymptomsPage() {
  const [items, setItems] = useState<Symptom[]>([]);
  const [form, setForm] = useState({ title: '', severity: 'mild' as Symptom['severity'], description: '', recordedAt: '' });

  async function load() {
    const res = await fetch('/api/symptoms');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function createItem(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/symptoms', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...form, recordedAt: new Date(form.recordedAt).toISOString() })
    });
    setForm({ title: '', severity: 'mild', description: '', recordedAt: '' });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/symptoms/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="mb-3 text-2xl font-semibold">Symptoms</h2>
        <form onSubmit={createItem} className="grid gap-2 md:grid-cols-5">
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <select className="input" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as Symptom['severity'] })}>
            <option value="mild">Mild</option><option value="moderate">Moderate</option><option value="severe">Severe</option>
          </select>
          <input className="input" type="datetime-local" value={form.recordedAt} onChange={(e) => setForm({ ...form, recordedAt: e.target.value })} required />
          <input className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="btn" type="submit">Add Symptom</button>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400"><tr><th>Title</th><th>Severity</th><th>When</th><th>Description</th><th /></tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s._id} className="border-t border-slate-800">
                <td>{s.title}</td><td>{s.severity}</td><td>{new Date(s.recordedAt).toLocaleString()}</td><td>{s.description || '-'}</td>
                <td><button className="text-red-400" onClick={() => remove(s._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
