'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FlaskConical, Eye, EyeOff } from 'lucide-react';

const FORMULAS = ['H₂O', 'NaOH', 'HCl', 'pH', 'H₂SO₄', 'CO₂', 'NaCl'];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', school: '', role: 'STUDENT' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(key: string, val: string) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password, school: form.school, role: form.role }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? 'Registration failed.'); return; }
    router.push('/login?registered=1');
  }

  const inputStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)',
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left */}
      <div className="hidden lg:flex flex-1 relative flex-col items-center justify-center p-12 lab-grid overflow-hidden"
        style={{ background: 'var(--surface)' }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(122,255,178,0.05) 0%, transparent 70%)' }} />
        {FORMULAS.map((f, i) => (
          <motion.div key={f} className="absolute font-mono text-sm font-semibold"
            style={{ color: 'var(--accent2)', opacity: 0.12 + (i % 3) * 0.07,
              left: `${12 + (i * 13) % 70}%`, top: `${10 + (i * 15) % 78}%` }}
            animate={{ y: [0, -10, 0] }} transition={{ duration: 3 + i * 0.5, repeat: Infinity }}>
            {f}
          </motion.div>
        ))}
        <div className="relative z-10 text-center">
          <FlaskConical className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent2)' }} />
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
            Join Elementa
          </h2>
          <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
            Free for every student in Ghana.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div className="w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <FlaskConical className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <span className="font-bold tracking-widest uppercase text-sm"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>Elementa</span>
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
              Create account
            </h1>
            <p className="text-sm font-mono" style={{ color: 'var(--muted)' }}>
              Set up your free student account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Full Name</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} required
                className="w-full px-4 py-3 rounded-lg font-mono text-sm outline-none transition-all"
                style={inputStyle} placeholder="Kwame Mensah"
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Email</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required
                className="w-full px-4 py-3 rounded-lg font-mono text-sm outline-none transition-all"
                style={inputStyle} placeholder="kwame@school.edu.gh"
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} required
                  className="w-full px-4 py-3 pr-12 rounded-lg font-mono text-sm outline-none transition-all"
                  style={inputStyle} placeholder="Min. 8 characters"
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} required
                className="w-full px-4 py-3 rounded-lg font-mono text-sm outline-none transition-all"
                style={inputStyle} placeholder="••••••••"
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            {/* School */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)' }}>
                School <span style={{ color: 'var(--muted2)' }}>(optional)</span>
              </label>
              <input value={form.school} onChange={e => update('school', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-mono text-sm outline-none transition-all"
                style={inputStyle} placeholder="Accra Academy"
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>

            {/* Role toggle */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>I am a</label>
              <div className="flex gap-2">
                {['STUDENT', 'TEACHER'].map(r => (
                  <button type="button" key={r} onClick={() => update('role', r)}
                    className="flex-1 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all"
                    style={{
                      background: form.role === r ? 'var(--accent)' : 'var(--surface)',
                      color: form.role === r ? 'var(--bg)' : 'var(--muted)',
                      border: `1px solid ${form.role === r ? 'var(--accent)' : 'var(--border)'}`,
                    }}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
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
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs font-mono" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)' }} className="hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
