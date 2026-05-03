'use client';

import { FormEvent, useEffect, useState } from 'react';

type Medication = { _id: string; name: string; dosage: string; schedule: string; startDate: string; endDate?: string };

export default function MedicationsPage() {
  const [items, setItems] = useState<Medication[]>([]);
  const [form, setForm] = useState({ name: '', dosage: '', schedule: '', startDate: '', endDate: '' });

  async function load() {
    const res = await fetch('/api/medications');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function createItem(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/medications', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined
      })
    });
    setForm({ name: '', dosage: '', schedule: '', startDate: '', endDate: '' });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/medications/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="mb-3 text-2xl font-semibold">Medications</h2>
        <form onSubmit={createItem} className="grid gap-2 md:grid-cols-5">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Dosage" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} required />
          <input className="input" placeholder="Schedule" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} required />
          <input className="input" type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
          <button className="btn" type="submit">Add Medication</button>
          <input className="input md:col-span-2" type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </form>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400"><tr><th>Name</th><th>Dosage</th><th>Schedule</th><th>Start</th><th>End</th><th /></tr></thead>
          <tbody>
            {items.map((m) => (
              <tr key={m._id} className="border-t border-slate-800">
                <td>{m.name}</td><td>{m.dosage}</td><td>{m.schedule}</td>
                <td>{new Date(m.startDate).toLocaleString()}</td>
                <td>{m.endDate ? new Date(m.endDate).toLocaleString() : '-'}</td>
                <td><button className="text-red-400" onClick={() => remove(m._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
