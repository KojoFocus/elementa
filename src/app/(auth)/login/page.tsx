'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FlaskConical, Eye, EyeOff } from 'lucide-react';

const FORMULAS = ['H₂O', 'NaOH', 'HCl', 'pH', 'H₂SO₄', 'CO₂', 'NaCl', 'KOH'];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError('Invalid email or password.'); return; }
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left — lab visual */}
      <div className="hidden lg:flex flex-1 relative flex-col items-center justify-center p-12 lab-grid overflow-hidden"
        style={{ background: 'var(--surface)' }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(79,209,255,0.06) 0%, transparent 70%)' }} />
        {FORMULAS.map((f, i) => (
          <motion.div key={f}
            className="absolute font-mono text-sm font-semibold"
            style={{
              color: 'var(--accent)',
              opacity: 0.15 + (i % 3) * 0.08,
              left: `${10 + (i * 11) % 75}%`,
              top: `${8 + (i * 13) % 80}%`,
            }}
            animate={{ y: [0, -10, 0], opacity: [0.15 + (i % 3) * 0.08, 0.35 + (i % 3) * 0.08, 0.15 + (i % 3) * 0.08] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >{f}</motion.div>
        ))}
        <div className="relative z-10 text-center">
          <FlaskConical className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
            Welcome back
          </h2>
          <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
            Your lab is waiting for you.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div className="w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <FlaskConical className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <span className="font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>Elementa</span>
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
              Sign in
            </h1>
            <p className="text-sm font-mono" style={{ color: 'var(--muted)' }}>
              Enter your credentials to access the lab.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>
                Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-lg font-mono text-sm outline-none transition-all"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                placeholder="student@school.edu.gh"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>
                Password
              </label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 pr-12 rounded-lg font-mono text-sm outline-none transition-all"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--muted)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p className="text-xs font-mono px-3 py-2 rounded"
                style={{ color: 'var(--accent3)', background: 'rgba(255,126,179,0.08)', border: '1px solid rgba(255,126,179,0.2)' }}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-mono text-sm uppercase tracking-wider font-semibold transition-opacity disabled:opacity-50"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
              {loading ? 'Entering...' : 'Enter the Lab →'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs font-mono" style={{ color: 'var(--muted)' }}>
            No account?{' '}
            <Link href="/register" style={{ color: 'var(--accent)' }} className="hover:underline">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
