'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { FlaskConical, LayoutDashboard, BookOpen, TrendingUp, Settings, LogOut, ChevronRight, Award, Menu, X } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>
            Elementa
          </span>
        </div>
        <button className="lg:hidden p-1" onClick={() => setSidebarOpen(false)} style={{ color: 'var(--muted)' }}>
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(n => (
          <Link key={n.label} href={n.href} onClick={() => setSidebarOpen(false)}
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
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-20 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar — fixed drawer on mobile, static on desktop */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-30 w-60 shrink-0 flex flex-col border-r transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-0 z-10"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--muted)' }}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span className="font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--accent)' }}>Elementa</span>
          </div>
        </div>
        <div className="p-5 md:p-8">
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
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
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
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {experiments.map(exp => (
              <Link key={exp.id} href="/lab/experiment"
                className="glass rounded-xl p-5 hover:border-[var(--border2)] transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <FlaskConical className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
                  {exp.title}
                </h3>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  Interactive step-by-step procedure with scoring
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={exp.subject.toLowerCase() as 'chemistry'}>{exp.subject}</Badge>
                  <Badge variant={exp.difficulty.toLowerCase() as 'beginner'}>{exp.difficulty}</Badge>
                </div>
              </Link>
            ))}
            {/* Lab hub card — always shown alongside DB experiments */}
            <Link href="/lab"
              className="glass rounded-xl p-5 hover:border-[var(--border2)] transition-all group"
              style={{ borderStyle: 'dashed' }}>
              <div className="flex items-start justify-between mb-3">
                <BookOpen className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
                Full Lab — 8 Experiments
              </h3>
              <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
                Titration · Salt Analysis · Gas Tests · Flame Tests · Electrolysis + more
              </p>
              <Badge variant="chemistry">All Topics</Badge>
            </Link>
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
        </div>
      </main>
    </div>
  );
}
