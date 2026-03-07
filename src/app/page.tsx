'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FlaskConical, Shield, Star, Zap, BookOpen, Award, ChevronRight, ArrowRight } from 'lucide-react';

function HeroBeaker({ color, fill, delay, label }: { color: string; fill: number; delay: number; label: string }) {
  return (
    <motion.div className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}
    >
      <svg width="34" height="48" viewBox="0 0 34 48" fill="none">
        <path d="M7 3 L3 44 Q3 47 6 47 L28 47 Q31 47 31 44 L27 3 Z"
          stroke="rgba(79,209,255,0.3)" strokeWidth="1.2" fill="rgba(13,21,32,0.7)" />
        <motion.rect x="4" width="26" rx="3"
          y={47 - 37 * fill} height={37 * fill}
          fill={color} fillOpacity={0.7}
          initial={{ y: 47, height: 0 }}
          animate={{ y: 47 - 37 * fill, height: 37 * fill }}
          transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
        />
        <rect x="5" y="1" width="24" height="4" rx="1.5"
          fill="rgba(79,209,255,0.15)" stroke="rgba(79,209,255,0.3)" strokeWidth="1" />
      </svg>
      <span className="text-[8px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{label}</span>
    </motion.div>
  );
}

const FEATURES = [
  { icon: FlaskConical, title: 'Real Lab Procedures',  desc: 'Follow genuine WASSCE-aligned experiment protocols step by step.' },
  { icon: Shield,       title: 'Safety First',         desc: 'Learn proper lab safety before every experiment — just like a real lab.' },
  { icon: Star,         title: 'Instant Scoring',      desc: 'Get scored on safety, technique, and quiz performance in real time.' },
  { icon: Zap,          title: 'No Equipment Needed',  desc: '100% web-based. Works on any phone, tablet, or school computer.' },
  { icon: BookOpen,     title: 'Guided Learning',      desc: 'Step-by-step instructions with clear feedback at every action.' },
  { icon: Award,        title: 'Track Progress',       desc: 'Review past attempts, scores, and improvements on your dashboard.' },
];

const FLOW = [
  { n: '01', label: 'Enter the Lab',   desc: 'Sign in and choose your experiment.' },
  { n: '02', label: 'Safety Check',    desc: 'Handwash, gloves, and goggles before proceeding.' },
  { n: '03', label: 'Follow the Steps', desc: 'Perform 7 guided interactive experiment steps.' },
  { n: '04', label: 'Record Results',  desc: 'Observe and log your data like a real scientist.' },
  { n: '05', label: 'Take the Quiz',   desc: 'Test your understanding with 5 questions.' },
  { n: '06', label: 'See Your Score',  desc: 'Get a full breakdown across safety, experiment, and quiz.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] glass-dark">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>
            Elementa
          </span>
          <span className="w-2 h-2 rounded-full ml-1 animate-pulse" style={{ background: 'var(--accent2)' }} />
        </div>
        <div className="flex items-center gap-4">
          {['features', 'how'].map(id => (
            <Link key={id} href={`#${id}`} className="hidden sm:block text-xs font-mono transition-colors"
              style={{ color: 'var(--muted)' }}>
              {id === 'how' ? 'How it works' : 'Features'}
            </Link>
          ))}
          <Link href="/login"
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 lab-grid overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(79,209,255,0.06) 0%, transparent 70%)' }} />

        <motion.div className="flex gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {[['Chemistry','#4fd1ff','rgba(79,209,255,0.3)','rgba(79,209,255,0.07)'],
            ['Biology',  '#7affb2','rgba(122,255,178,0.3)','rgba(122,255,178,0.07)'],
            ['Physics',  '#ffd64f','rgba(255,214,79,0.3)', 'rgba(255,214,79,0.07)']
          ].map(([s,c,b,bg]) => (
            <span key={s} className="px-3 py-1 rounded text-[10px] font-mono uppercase tracking-widest border"
              style={{ color: c, borderColor: b, background: bg }}>{s}</span>
          ))}
        </motion.div>

        <motion.h1 className="text-5xl sm:text-7xl font-bold text-center leading-[1.05] mb-6 glow-text"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
          Step inside<br />
          <span style={{ color: 'var(--accent)' }}>your lab.</span>
        </motion.h1>

        <motion.p className="text-base sm:text-lg text-center max-w-xl mb-10 leading-relaxed font-mono"
          style={{ color: 'var(--muted)' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          Immersive virtual science practicals for secondary school students in Ghana and Africa.
          No equipment. No chemicals. All learning.
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row gap-4 mb-16"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Link href="/register"
            className="px-8 py-4 rounded font-mono text-sm uppercase tracking-wider font-semibold flex items-center gap-2 transition-opacity hover:opacity-90 glow-accent"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            Start Free Experiment <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login"
            className="px-8 py-4 rounded font-mono text-sm uppercase tracking-wider border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
            Sign In
          </Link>
        </motion.div>

        {/* Lab preview */}
        <motion.div className="relative w-full max-w-lg glass rounded-2xl p-8 flex justify-center items-end gap-6 border-pulse"
          style={{ minHeight: 170 }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.25 }} />
          <HeroBeaker color="#ef4444" fill={0.55} delay={0.85}  label="acid" />
          <HeroBeaker color="#22c55e" fill={0.45} delay={0.7}   label="neutral" />
          <HeroBeaker color="#3b82f6" fill={0.60} delay={0.95}  label="base" />
          <HeroBeaker color="#f97316" fill={0.40} delay={0.8}   label="vinegar" />
          <HeroBeaker color="#a855f7" fill={0.50} delay={1.05}  label="soap" />
          <div className="absolute bottom-3 right-4 glass rounded-lg px-3 py-1.5 text-[10px] font-mono" style={{ color: 'var(--accent)' }}>
            Step 3 of 7 — Add indicator
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xs font-mono uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--accent)' }}>Why Elementa</p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
              Everything a real lab gives you
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} className="glass rounded-xl p-5 transition-colors"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <f.icon className="w-5 h-5 mb-3" style={{ color: 'var(--accent)' }} />
                <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>{f.title}</h3>
                <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--muted)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section id="how" className="py-24 px-4" style={{ background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xs font-mono uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--accent)' }}>Experiment Flow</p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
              6 steps to a complete practical
            </h2>
          </motion.div>
          <div className="space-y-4">
            {FLOW.map((f, i) => (
              <motion.div key={f.n} className="flex items-center gap-5 glass rounded-xl px-5 py-4"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <span className="text-2xl font-bold font-mono opacity-30 shrink-0" style={{ color: 'var(--accent)' }}>{f.n}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>{f.label}</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{f.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--muted)' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[['3','Subjects'],['0','Chemicals\nRequired'],['100%','Web-Based']].map(([v, l], i) => (
            <motion.div key={v} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-4xl sm:text-5xl font-bold glow-text mb-1"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>{v}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest whitespace-pre-line"
                style={{ color: 'var(--muted)' }}>{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center" style={{ background: 'var(--surface)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
            Ready to enter the lab?
          </h2>
          <p className="font-mono text-sm mb-8" style={{ color: 'var(--muted)' }}>
            Free for students. No signup fees. No textbooks.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded font-mono text-sm uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity glow-accent"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>Elementa</span>
        </div>
        <p className="text-xs font-mono" style={{ color: 'var(--muted2)' }}>© 2025 Elementa. Built for Ghana.</p>
      </footer>
    </div>
  );
}
