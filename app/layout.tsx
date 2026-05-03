import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MediTrack AI',
  description: 'Intelligent Personal Health Management Platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800 bg-slate-950/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-mint">MediTrack AI</Link>
            <nav className="flex gap-4 text-sm text-slate-300">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/vitals">Vitals</Link>
              <Link href="/medications">Medications</Link>
              <Link href="/appointments">Appointments</Link>
              <Link href="/symptoms">Symptoms</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-140px)] max-w-6xl px-6 py-8">{children}</main>
        <footer className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-300">
          Built by Ritish Gupta •
          <a className="ml-1 text-mint" href="https://github.com/ritishgupta" target="_blank" rel="noreferrer">GitHub</a>
          {' '}•
          <a className="ml-1 text-mint" href="https://www.linkedin.com/in/ritishgupta" target="_blank" rel="noreferrer">LinkedIn</a>
        </footer>
      </body>
    </html>
  );
}
