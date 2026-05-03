'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (res?.error) {
      setError('Invalid credentials.');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="card mx-auto max-w-md space-y-4">
      <h2 className="text-2xl font-semibold">Login</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button className="btn" disabled={loading} type="submit">{loading ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <button
        className="rounded-md border border-slate-700 px-4 py-2 text-sm"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        type="button"
      >
        Continue with Google
      </button>
    </div>
  );
}
