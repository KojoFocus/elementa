'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { FlaskConical, LayoutDashboard, BookOpen, TrendingUp, Settings, LogOut, Lock, ChevronRight, Award } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Attempt {
  id: string; experimentTitle: string; experimentSlug: string;
  totalScore: number; passed: boolean; completedAt: string;
}
interface Experiment {
  id: string; slug: string; title: string; subject: string; difficulty: string;
}
interface Stats { completed: number; average: number; best: number; }

interface Props {
  user: { name: string; school: string | null };
  stats: Stats;
  attempts: Attempt[];
  experiments: Experiment[];
}

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: BookOpen,         label: 'Experiments', href: '/dashboard' },
  { icon: TrendingUp,       label: 'Progress',    href: '/dashboard' },
  { icon: Settings,         label: 'Settings',    href: '/dashboard' },
];

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>{label}</p>
      <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>{value}</p>
      {sub && <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted)' }}>{sub}</p>}
    </div>
  );
}

export default function DashboardClient({ user, stats, attempts, experiments }: Props) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col border-r" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <FlaskConical className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>
            Elementa
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(n => (
            <Link key={n.label} href={n.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm transition-all"
              style={{
                background: n.active ? 'rgba(79,209,255,0.08)' : 'transparent',
                color: n.active ? 'var(--accent)' : 'var(--muted)',
                borderLeft: n.active ? '2px solid var(--accent)' : '2px solid transparent',
              }}>
              <n.icon className="w-4 h-4" />
              {n.label}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-mono font-semibold truncate" style={{ color: 'var(--text)' }}>{user.name}</p>
          {user.school && <p className="text-[10px] font-mono mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{user.school}</p>}
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 mt-3 text-xs font-mono transition-colors"
            style={{ color: 'var(--muted)' }}>
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--muted)' }}>
            Welcome back
          </p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
            {user.name}
          </h1>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-3 gap-4 mb-10"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard label="Completed" value={stats.completed} sub="experiments" />
          <StatCard label="Average Score" value={stats.average ? `${stats.average}%` : '—'} sub="across all attempts" />
          <StatCard label="Best Score" value={stats.best ? `${stats.best}%` : '—'} sub="personal best" />
        </motion.div>

        {/* Experiments */}
        <motion.section className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
            Available Experiments
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiments.map(exp => (
              <Link key={exp.id} href={`/lab`}
                className="glass rounded-xl p-5 hover:border-[var(--border2)] transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <FlaskConical className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
                  {exp.title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={exp.subject.toLowerCase() as 'chemistry'}>{exp.subject}</Badge>
                  <Badge variant={exp.difficulty.toLowerCase() as 'beginner'}>{exp.difficulty}</Badge>
                </div>
              </Link>
            ))}
            {/* Coming-soon placeholders */}
            {[{ title: 'Electrolysis', subject: 'Chemistry' }, { title: 'Osmosis & Diffusion', subject: 'Biology' }].map(p => (
              <div key={p.title} className="glass rounded-xl p-5 opacity-40 cursor-not-allowed select-none">
                <div className="flex items-start justify-between mb-3">
                  <Lock className="w-5 h-5" style={{ color: 'var(--muted)' }} />
                </div>
                <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--muted)' }}>
                  {p.title}
                </h3>
                <Badge variant="default">Coming Soon</Badge>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Recent attempts */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
            Recent Attempts
          </h2>

          {attempts.length === 0 ? (
            <div className="glass rounded-xl p-10 text-center">
              <Award className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--muted)' }} />
              <p className="font-mono text-sm mb-4" style={{ color: 'var(--muted)' }}>No experiments completed yet.</p>
              <Link href="/lab"
                className="px-6 py-2.5 rounded font-mono text-xs uppercase tracking-wider border transition-all"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                Start First Experiment →
              </Link>
            </div>
          ) : (
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                    {['Experiment', 'Score', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a, i) => (
                    <tr key={a.id} className="border-b last:border-b-0 transition-colors hover:bg-[rgba(79,209,255,0.03)]"
                      style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3" style={{ color: 'var(--text)' }}>{a.experimentTitle}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--accent)' }}>{a.totalScore}%</td>
                      <td className="px-4 py-3">
                        <Badge variant={a.passed ? 'passed' : 'failed'}>{a.passed ? 'Passed' : 'Failed'}</Badge>
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>
                        {new Date(a.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
