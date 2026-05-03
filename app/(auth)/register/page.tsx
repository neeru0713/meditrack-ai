'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'user' | 'doctor';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    setLoading(false);

    if (!res.ok) {
      setError('Registration failed. Try a different email.');
      return;
    }

    router.push('/login');
  }

  return (
    <div className="card mx-auto max-w-md space-y-4">
      <h2 className="text-2xl font-semibold">Register</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password (min 8)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="user">User</option>
          <option value="doctor">Doctor</option>
        </select>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button className="btn" disabled={loading} type="submit">{loading ? 'Creating...' : 'Create Account'}</button>
      </form>
    </div>
  );
}
