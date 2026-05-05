export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Vital } from '@/lib/models/Vital';
import { Medication } from '@/lib/models/Medication';
import { Appointment } from '@/lib/models/Appointment';
import { Symptom } from '@/lib/models/Symptom';
// Temporarily render server-safe placeholders for client-only components
// to avoid prerender errors during production build.

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>Please log in.</p>;
  }

  await connectDB();

  const [vitals, medications, appointments, symptoms] = await Promise.all([
  Vital.find({ userId }).sort({ recordedAt: -1 }).limit(7).lean<import('@/lib/models/Vital').IVital[]>(),
  Medication.find({ userId }).sort({ createdAt: -1 }).limit(5).lean<import('@/lib/models/Medication').IMedication[]>(),
  Appointment.find({ userId }).sort({ scheduledAt: 1 }).limit(5).lean<import('@/lib/models/Appointment').IAppointment[]>(),
  Symptom.find({ userId }).sort({ recordedAt: -1 }).limit(5).lean<import('@/lib/models/Symptom').ISymptom[]>()
  ]);

  const chartData = vitals
    .map((v) => ({
      recordedAt: new Date(v.recordedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      value: Number(String(v.value).split('/')[0]) || Number(v.value) || 0
    }))
    .reverse();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Health Dashboard</h1>
      <div className="card h-80">
        <h3 className="mb-4 text-lg font-semibold">Vitals Trend</h3>
        <p className="text-sm text-slate-300">(Interactive chart is client-only and will load in the browser.)</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><h3 className="font-semibold">Medications</h3><p className="text-3xl text-mint">{medications.length}</p></div>
        <div className="card"><h3 className="font-semibold">Appointments</h3><p className="text-3xl text-ember">{appointments.length}</p></div>
        <div className="card"><h3 className="font-semibold">Symptoms Logged</h3><p className="text-3xl text-cyan-400">{symptoms.length}</p></div>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold">AI Health Insights</h3>
        <p className="text-sm text-slate-300">(AI assistant is client-only and will be available in the browser.)</p>
      </div>
    </section>
  );
}
