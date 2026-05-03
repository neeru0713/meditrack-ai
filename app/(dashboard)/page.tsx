import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Vital } from '@/lib/models/Vital';
import { Medication } from '@/lib/models/Medication';
import { Appointment } from '@/lib/models/Appointment';
import { Symptom } from '@/lib/models/Symptom';
import { VitalsTrend } from '@/components/charts/vitals-trend';
import { AIAssistant } from '@/components/charts/ai-assistant';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>Please log in.</p>;
  }

  await connectDB();

  const [vitals, medications, appointments, symptoms] = await Promise.all([
    Vital.find({ userId }).sort({ recordedAt: -1 }).limit(7).lean(),
    Medication.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
    Appointment.find({ userId }).sort({ scheduledAt: 1 }).limit(5).lean(),
    Symptom.find({ userId }).sort({ recordedAt: -1 }).limit(5).lean()
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
      <VitalsTrend data={chartData} />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><h3 className="font-semibold">Medications</h3><p className="text-3xl text-mint">{medications.length}</p></div>
        <div className="card"><h3 className="font-semibold">Appointments</h3><p className="text-3xl text-ember">{appointments.length}</p></div>
        <div className="card"><h3 className="font-semibold">Symptoms Logged</h3><p className="text-3xl text-cyan-400">{symptoms.length}</p></div>
      </div>
      <AIAssistant recentVitals={vitals} medications={medications} />
    </section>
  );
}
