'use client';

import { FormEvent, useEffect, useState } from 'react';

type Appointment = { _id: string; doctorName: string; speciality?: string; location?: string; scheduledAt: string; notes?: string };

export default function AppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [form, setForm] = useState({ doctorName: '', speciality: '', location: '', scheduledAt: '', notes: '' });

  async function load() {
    const res = await fetch('/api/appointments');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function createItem(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...form, scheduledAt: new Date(form.scheduledAt).toISOString() })
    });
    setForm({ doctorName: '', speciality: '', location: '', scheduledAt: '', notes: '' });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="mb-3 text-2xl font-semibold">Appointments</h2>
        <form onSubmit={createItem} className="grid gap-2 md:grid-cols-5">
          <input className="input" placeholder="Doctor name" value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} required />
          <input className="input" placeholder="Speciality" value={form.speciality} onChange={(e) => setForm({ ...form, speciality: e.target.value })} />
          <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input className="input" type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} required />
          <button className="btn" type="submit">Add Appointment</button>
          <input className="input md:col-span-3" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </form>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400"><tr><th>Doctor</th><th>Speciality</th><th>Location</th><th>When</th><th>Notes</th><th /></tr></thead>
          <tbody>
            {items.map((a) => (
              <tr key={a._id} className="border-t border-slate-800">
                <td>{a.doctorName}</td><td>{a.speciality || '-'}</td><td>{a.location || '-'}</td>
                <td>{new Date(a.scheduledAt).toLocaleString()}</td><td>{a.notes || '-'}</td>
                <td><button className="text-red-400" onClick={() => remove(a._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
