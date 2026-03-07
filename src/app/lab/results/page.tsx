'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, RotateCcw, LayoutDashboard, Beaker } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useLabStore } from '@/store/labStore';
import { SUBSTANCES, PASS_MARK, TOTAL_SAFETY_SCORE, TOTAL_EXPERIMENT_SCORE, TOTAL_QUIZ_SCORE } from '@/data/acidBase';

// ── Animated counter ──────────────────────────────────────────
function useCountUp(target: number, duration = 1400, delay = 300) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let frame: number;
    const timeout = setTimeout(() => {
      function step(ts: number) {
        if (!start) start = ts;
        const elapsed = ts - start;
        const pct = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - pct, 3);
        setValue(Math.round(eased * target));
        if (pct < 1) frame = requestAnimationFrame(step);
      }
      frame = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [target, duration, delay]);
  return value;
}

// ── Score circle ──────────────────────────────────────────────
function ScoreCircle({ score, passed }: { score: number; passed: boolean }) {
  const displayed = useCountUp(score, 1200, 400);
  const radius  = 52;
  const circum  = 2 * Math.PI * radius;
  const dashOff = circum * (1 - score / 100);
  const color   = passed ? 'var(--success)' : 'var(--danger)';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Track */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
        {/* Fill */}
        <motion.circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circum}
          initial={{ strokeDashoffset: circum }}
          animate={{ strokeDashoffset: dashOff }}
          transition={{ duration: 1.4, delay: 0.4, ease: 'easeOut' }}
          style={{ transformOrigin: '70px 70px', transform: 'rotate(-90deg)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold font-mono" style={{ color }}>
          {displayed}
        </span>
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          / 100
        </span>
      </div>
    </div>
  );
}

// ── Score row ─────────────────────────────────────────────────
function ScoreRow({ label, score, total, delay }: { label: string; score: number; total: number; delay: number }) {
  const pct = Math.round((score / total) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4"
    >
      <span className="w-36 text-sm shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ background: 'var(--border)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--accent)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
        />
      </div>
      <span className="w-20 text-right text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
        {score} / {total}
      </span>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function ResultsPage() {
  const router = useRouter();
  const savedRef = useRef(false);

  const totalScore      = useLabStore(s => s.totalScore);
  const passed          = useLabStore(s => s.passed);
  const safetyScore     = useLabStore(s => s.safetyScore);
  const experimentScore = useLabStore(s => s.experimentScore);
  const quizScore       = useLabStore(s => s.quizScore);
  const attemptId       = useLabStore(s => s.attemptId);
  const observations    = useLabStore(s => s.observations);
  const classifications = useLabStore(s => s.classifications);
  const resetLab        = useLabStore(s => s.resetLab);

  // Save attempt to DB once
  useEffect(() => {
    if (savedRef.current || !attemptId) return;
    savedRef.current = true;
    fetch('/api/attempts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attemptId,
        safetyScore,
        experimentScore,
        quizScore,
        totalScore,
        passed,
      }),
    }).catch(() => { /* non-blocking */ });
  }, [attemptId, safetyScore, experimentScore, quizScore, totalScore, passed]);

  function handleTryAgain() {
    resetLab();
    router.push('/lab');
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-deep)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Beaker className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="font-mono text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
            Lab Results
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg space-y-8">

          {/* Score hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <ScoreCircle score={totalScore} passed={passed} />
            <div className="mt-4 flex flex-col items-center gap-2">
              <Badge variant={passed ? 'passed' : 'failed'}>
                {passed ? 'Experiment Passed' : 'Keep Practising'}
              </Badge>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {passed
                  ? `Great work! You scored ${totalScore}/100 — above the ${PASS_MARK} pass mark.`
                  : `You scored ${totalScore}/100. The pass mark is ${PASS_MARK}. Try again to improve!`}
              </p>
            </div>
          </motion.div>

          {/* Score breakdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-6 space-y-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-sm font-semibold font-mono uppercase tracking-widest mb-5"
              style={{ color: 'var(--text-muted)' }}>
              Score Breakdown
            </h2>
            <ScoreRow label="Safety Protocol"  score={safetyScore}     total={TOTAL_SAFETY_SCORE}     delay={0.4} />
            <ScoreRow label="Experiment"        score={experimentScore} total={TOTAL_EXPERIMENT_SCORE} delay={0.5} />
            <ScoreRow label="Knowledge Quiz"    score={quizScore}       total={TOTAL_QUIZ_SCORE}       delay={0.6} />
            <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <ScoreRow label="Total" score={totalScore} total={100} delay={0.7} />
            </div>
          </motion.div>

          {/* Substance summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="px-4 py-3" style={{ background: 'var(--surface-2, #111d2e)' }}>
              <h2 className="text-sm font-semibold font-mono uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}>
                Your Observations
              </h2>
            </div>
            <table className="w-full text-xs" style={{ background: 'var(--surface)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Solution', 'Formula', 'Your Colour', 'Actual', 'pH', 'Classification', 'Correct?'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-mono uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SUBSTANCES.map((s, i) => {
                  const userColor  = observations[s.id];
                  const userClass  = classifications[s.id];
                  const colorRight = userColor?.toLowerCase() === s.indicatorColorName.toLowerCase();
                  const classRight = userClass === s.classification;
                  return (
                    <tr key={s.id}
                      className="transition-colors"
                      style={{
                        borderBottom: i < SUBSTANCES.length - 1 ? '1px solid var(--border)' : undefined,
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                      }}>
                      <td className="px-3 py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {s.name}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {(s as { formula?: string }).formula ?? '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        {userColor ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full inline-block"
                              style={{ background: s.indicatorColor, opacity: 0.7 }} />
                            <span style={{ color: colorRight ? 'var(--success)' : 'var(--danger)' }}>
                              {userColor}
                            </span>
                          </span>
                        ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full inline-block" style={{ background: s.indicatorColor }} />
                          <span style={{ color: 'var(--text-secondary)' }}>{s.indicatorColorName}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {s.pH}
                      </td>
                      <td className="px-3 py-2.5" style={{ color: classRight ? 'var(--success)' : userClass ? 'var(--danger)' : 'var(--text-muted)' }}>
                        {userClass ?? '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        {colorRight && classRight
                          ? <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />
                          : <XCircle     className="w-4 h-4" style={{ color: 'var(--danger)' }} />
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>

          {/* What you learned */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="rounded-xl p-5"
            style={{ background: 'rgba(79,209,255,0.04)', border: '1px solid rgba(79,209,255,0.15)' }}
          >
            <h2 className="text-sm font-semibold font-mono uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent)' }}>
              What You Learned
            </h2>
            <ul className="space-y-2">
              {[
                'Universal indicator changes colour with pH: Red/Orange (pH 1–6) = Acid · Green (pH 7) = Neutral · Blue/Violet (pH 8–14) = Alkali.',
                'Strong acids (HCl, H₂SO₄) fully dissociate: pH = −log[H⁺]. 0.01 mol dm⁻³ HCl → pH 2.',
                'In titration: moles = C × V(dm³). For 1:1 reactions (NaOH + HCl), moles acid = moles base at equivalence point.',
                'Methyl orange or phenolphthalein give sharp end-points for strong acid–base titrations; universal indicator is unsuitable.',
                'Molar concentration (mol dm⁻³) = moles of solute ÷ volume of solution in dm³. Always convert cm³ ÷ 1000.',
                'WAEC mark scheme: state colour, deduce pH range, classify, and write the ionic equation for the neutralisation.',
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: 'var(--accent)' }} />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-3"
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={handleTryAgain}
              icon={<RotateCcw className="w-4 h-4" />}
              className="flex-1 justify-center"
            >
              Try Again
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/dashboard')}
              icon={<LayoutDashboard className="w-4 h-4" />}
              className="flex-1 justify-center"
            >
              Dashboard
            </Button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
