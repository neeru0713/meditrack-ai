import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-bold">Intelligent Health Record and Wellness Tracking</h1>
      <p className="max-w-2xl text-slate-300">
        Log vitals, symptoms, medications, and appointments. Get AI-powered trend analysis, symptom insights,
        and weekly digest summaries with streaming responses.
      </p>
      <Link href="/dashboard" className="btn">Open Dashboard</Link>
    </section>
  );
}
