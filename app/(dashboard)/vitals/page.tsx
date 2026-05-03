'use client';

import { FormEvent, useEffect, useState } from 'react';

type Vital = {
  _id: string;
  type: 'bloodPressure' | 'glucose' | 'weight';
  value: string;
  recordedAt: string;
  notes?: string;
};

export default function VitalsPage() {
  const [items, setItems] = useState<Vital[]>([]);
  const [type, setType] = useState<Vital['type']>('bloodPressure');
  const [value, setValue] = useState('');
  const [recordedAt, setRecordedAt] = useState('');
  const [notes, setNotes] = useState('');

  async function load() {
    const res = await fetch('/api/vitals');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createItem(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/vitals', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type, value, recordedAt: new Date(recordedAt).toISOString(), notes })
    });
    setValue('');
    setRecordedAt('');
    setNotes('');
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/vitals/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="mb-3 text-2xl font-semibold">Vitals</h2>
        <form onSubmit={createItem} className="grid gap-2 md:grid-cols-5">
          <select className="input" value={type} onChange={(e) => setType(e.target.value as Vital['type'])}>
            <option value="bloodPressure">Blood Pressure</option>
            <option value="glucose">Glucose</option>
            <option value="weight">Weight</option>
          </select>
          <input className="input" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} required />
          <input className="input" type="datetime-local" value={recordedAt} onChange={(e) => setRecordedAt(e.target.value)} required />
          <input className="input" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button className="btn" type="submit">Add Vital</button>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400"><tr><th>Type</th><th>Value</th><th>Recorded</th><th>Notes</th><th /></tr></thead>
          <tbody>
            {items.map((v) => (
              <tr key={v._id} className="border-t border-slate-800">
                <td>{v.type}</td>
                <td>{v.value}</td>
                <td>{new Date(v.recordedAt).toLocaleString()}</td>
                <td>{v.notes || '-'}</td>
                <td><button className="text-red-400" onClick={() => remove(v._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
