'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FlaskConical, Clock, ChevronRight, BookOpen, Star } from 'lucide-react';
import LabScene from '@/components/lab/LabScene';
import Button from '@/components/ui/Button';
import { acidBaseExperiment } from '@/lib/experiments/acidBase';
import { useLabStore } from '@/store/labStore';

const { meta } = acidBaseExperiment;

const difficultyColour: Record<string, string> = {
  beginner:     'text-[var(--success)] border-[var(--success)]',
  intermediate: 'text-[var(--warning)] border-[var(--warning)]',
  advanced:     'text-[var(--danger)]  border-[var(--danger)]',
};

export default function LabEntryPage() {
  const router     = useRouter();
  const [entering, setEntering] = useState(false);
  const setAttemptId = useLabStore(s => s.setAttemptId);

  async function handleEnterLab() {
    setEntering(true);
    // Create a DB attempt (best-effort — don't block entry if it fails)
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experimentId: meta.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setAttemptId(data.attemptId);
      }
    } catch {
      // unauthenticated or network error — still allow entry
    }
    setTimeout(() => router.push('/lab/theory'), 700);
  }

  return (
    <AnimatePresence>
      {!entering ? (
        <motion.div
          key="lab-entry"
          className="min-h-screen flex flex-col"
          style={{ background: 'var(--bg-deep)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Top bar ── */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FlaskConical className="w-5 h-5 text-[var(--accent)]" />
              <span className="font-mono text-sm font-semibold tracking-widest text-[var(--accent)] uppercase">
                Elementa
              </span>
            </motion.div>

            <motion.button
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => router.push('/dashboard')}
            >
              ← Dashboard
            </motion.button>
          </header>

          {/* ── Lab scene (top half) ── */}
          <div className="relative flex-1 flex flex-col">
            <motion.div
              className="relative w-full"
              style={{ height: 'clamp(220px, 40vh, 360px)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              <LabScene className="absolute inset-0 h-full" animate={true} />

              {/* Gradient fade at bottom of scene */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                style={{ background: 'linear-gradient(transparent, var(--bg-deep))' }}
              />
            </motion.div>

            {/* ── Experiment card ── */}
            <div className="flex-1 flex flex-col items-center justify-start px-4 pb-8 -mt-4">
              <motion.div
                className="w-full max-w-xl glass rounded-xl p-6 border-pulse"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
              >
                {/* Subject badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded border text-[var(--accent)] border-[var(--accent)] border-opacity-40">
                    {meta.subject}
                  </span>
                  <span
                    className={`text-[10px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded border ${
                      difficultyColour[meta.difficulty]
                    } border-opacity-40`}
                  >
                    {meta.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight mb-1 glow-text">
                  {meta.title}
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {meta.subtitle}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-5 mb-5 text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {meta.duration} min
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono">
                    <BookOpen className="w-3.5 h-3.5" />
                    {acidBaseExperiment.steps.length} steps
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono">
                    <Star className="w-3.5 h-3.5" />
                    {acidBaseExperiment.quizQuestions.length} quiz questions
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {meta.description}
                </p>

                {/* Objectives */}
                <div className="mb-6">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">
                    Learning Objectives
                  </p>
                  <ul className="space-y-2">
                    {meta.objectives.map((obj, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                      >
                        <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--accent)]" />
                        {obj}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Safety notice */}
                <div
                  className="rounded-lg p-3.5 mb-6 text-xs text-[var(--warning)] font-mono"
                  style={{
                    background: 'rgba(245,158,11,0.06)',
                    border: '1px solid rgba(245,158,11,0.2)',
                  }}
                >
                  ⚠ Before you begin, you must complete the safety checklist. No experiment proceeds without proper protective equipment.
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  variant="primary"
                  onClick={handleEnterLab}
                  className="w-full justify-center"
                >
                  Enter the Lab
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        // Flash-to-white door-open transition
        <motion.div
          key="entering"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'var(--bg-deep)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{
              scale: [1, 40],
              opacity: [1, 0],
            }}
            transition={{ duration: 0.6, ease: 'easeIn' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
