'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useLabStore } from '@/store/labStore';
import { STEPS, SUBSTANCES, COLOR_OPTIONS, QUIZ_QUESTIONS } from '@/data/acidBase';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';

// ─── Mini beaker visualisation ────────────────────────────────
function MiniBeaker({ color, label, animating }: { color?: string; label: string; animating: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-10 h-14 flex items-end justify-center">
        <svg width="40" height="56" viewBox="0 0 40 56" fill="none" className="absolute inset-0">
          <path d="M8 4 L4 50 Q4 53 7 53 L33 53 Q36 53 36 50 L32 4 Z"
            stroke="rgba(79,209,255,0.35)" strokeWidth="1.2" fill="rgba(13,21,32,0.6)" />
          <rect x="6" y="1" width="28" height="4" rx="1.5"
            fill="rgba(79,209,255,0.12)" stroke="rgba(79,209,255,0.3)" strokeWidth="1" />
        </svg>
        {color && (
          <motion.div className="absolute bottom-1 left-[6px] right-[6px] rounded-sm"
            style={{ background: color, opacity: 0.75 }}
            initial={{ height: 0 }}
            animate={{ height: animating ? '60%' : '60%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
      </div>
      <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{label}</span>
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────

function SetupStep({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState(0);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>
        Click each test tube to place it in the rack (1 of 5).
      </p>
      <div className="flex gap-4 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div key={i} whileTap={{ scale: 0.95 }} onClick={() => {
            if (i === placed) setPlaced(p => {
              const next = p + 1;
              if (next === 5) setTimeout(onComplete, 300);
              return next;
            });
          }}
            className="cursor-pointer transition-all"
            style={{ opacity: i < placed ? 1 : i === placed ? 1 : 0.35 }}>
            <svg width="14" height="48" viewBox="0 0 14 48" fill="none">
              <rect x="1" y="0" width="12" height="38" rx="6"
                stroke={i < placed ? 'rgba(122,255,178,0.5)' : i === placed ? 'rgba(79,209,255,0.5)' : 'rgba(79,209,255,0.2)'}
                strokeWidth="1.2" fill="rgba(13,21,32,0.5)" />
              {i < placed && <circle cx="7" cy="44" r="3" fill="rgba(122,255,178,0.6)" />}
            </svg>
          </motion.div>
        ))}
      </div>
      <p className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{placed} / 5 placed</p>
    </div>
  );
}

function AddSubstancesStep({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState<string[]>([]);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>
        Click each substance bottle to add 5 drops to its test tube.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        {SUBSTANCES.map(s => (
          <motion.button key={s.id} whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (done.includes(s.id)) return;
              const next = [...done, s.id];
              setDone(next);
              if (next.length === SUBSTANCES.length) setTimeout(onComplete, 400);
            }}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
            style={{
              background: done.includes(s.id) ? 'rgba(122,255,178,0.08)' : 'var(--surface)',
              border: `1px solid ${done.includes(s.id) ? 'rgba(122,255,178,0.35)' : 'var(--border)'}`,
            }}>
            <div className="w-6 h-6 rounded-full" style={{ background: s.indicatorColor, opacity: 0.7 }} />
            <span className="text-[10px] font-mono" style={{ color: done.includes(s.id) ? 'var(--accent2)' : 'var(--muted)' }}>
              {s.name.split(' ')[0]}
            </span>
            {done.includes(s.id) && <CheckCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent2)' }} />}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function AddIndicatorStep({ onComplete }: { onComplete: () => void }) {
  const [added, setAdded] = useState<string[]>([]);
  const [indicatorSelected, setIndicatorSelected] = useState(false);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>
        First click the indicator bottle, then click each tube.
      </p>
      {/* Indicator bottle */}
      <motion.button whileTap={{ scale: 0.95 }}
        onClick={() => setIndicatorSelected(true)}
        className="px-4 py-2 rounded-lg font-mono text-xs border transition-all"
        style={{
          background: indicatorSelected ? 'rgba(107,33,168,0.15)' : 'var(--surface)',
          borderColor: indicatorSelected ? 'rgba(107,33,168,0.5)' : 'var(--border)',
          color: indicatorSelected ? '#a855f7' : 'var(--muted)',
        }}>
        🧴 Universal Indicator {indicatorSelected ? '(selected)' : ''}
      </motion.button>
      {/* Beakers showing colour change */}
      <div className="flex gap-3 flex-wrap justify-center">
        {SUBSTANCES.map(s => (
          <motion.div key={s.id} className="cursor-pointer" whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!indicatorSelected || added.includes(s.id)) return;
              const next = [...added, s.id];
              setAdded(next);
              if (next.length === SUBSTANCES.length) setTimeout(onComplete, 600);
            }}>
            <MiniBeaker
              color={added.includes(s.id) ? s.indicatorColor : undefined}
              label={s.name.split(' ')[0]}
              animating={added.includes(s.id)}
            />
          </motion.div>
        ))}
      </div>
      <p className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
        {added.length} / {SUBSTANCES.length} tubes done
      </p>
    </div>
  );
}

function RecordColorsStep({ onComplete }: { onComplete: () => void }) {
  const recordObservation = useLabStore(s => s.recordObservation);
  const [selected, setSelected] = useState<Record<string, string>>({});

  function pick(substanceId: string, colorId: string) {
    recordObservation(substanceId, colorId);
    const next = { ...selected, [substanceId]: colorId };
    setSelected(next);
    if (Object.keys(next).length === SUBSTANCES.length) setTimeout(onComplete, 400);
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>
        Select the colour you observed in each test tube.
      </p>
      {SUBSTANCES.map(s => (
        <div key={s.id} className="flex items-center gap-3">
          <span className="text-xs font-mono w-28 shrink-0" style={{ color: 'var(--text)' }}>{s.name}</span>
          <div className="flex gap-1.5 flex-wrap">
            {COLOR_OPTIONS.map(c => (
              <button key={c.id} onClick={() => pick(s.id, c.id)}
                className="w-7 h-7 rounded-full border-2 transition-all"
                style={{
                  background: c.hex,
                  borderColor: selected[s.id] === c.id ? '#fff' : 'transparent',
                  opacity: 0.85,
                  transform: selected[s.id] === c.id ? 'scale(1.2)' : 'scale(1)',
                }}
                title={c.label}
              />
            ))}
          </div>
          {selected[s.id] && (
            <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--accent2)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

function LitmusStep({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState<string[]>([]);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>
        Click each test tube to dip the litmus paper and record the result.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        {SUBSTANCES.map(s => (
          <motion.button key={s.id} whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (done.includes(s.id)) return;
              const next = [...done, s.id];
              setDone(next);
              if (next.length === SUBSTANCES.length) setTimeout(onComplete, 400);
            }}
            className="flex flex-col items-center gap-2 p-3 rounded-xl"
            style={{
              background: done.includes(s.id) ? 'rgba(122,255,178,0.08)' : 'var(--surface)',
              border: `1px solid ${done.includes(s.id) ? 'rgba(122,255,178,0.35)' : 'var(--border)'}`,
            }}>
            <div className="flex gap-0.5">
              <div className="w-1.5 h-8 rounded-sm"
                style={{ background: done.includes(s.id) && s.classification === 'acid' ? '#ef4444' : '#3b82f6' }} />
              <div className="w-1.5 h-8 rounded-sm"
                style={{ background: done.includes(s.id) && s.classification === 'alkali' ? '#3b82f6' : '#ef4444' }} />
            </div>
            <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
              {s.name.split(' ')[0]}
            </span>
            {done.includes(s.id) && <CheckCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent2)' }} />}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ClassifyStep({ onComplete }: { onComplete: () => void }) {
  const recordClassification = useLabStore(s => s.recordClassification);
  const [selected, setSelected] = useState<Record<string, string>>({});

  function pick(substanceId: string, value: string) {
    recordClassification(substanceId, value);
    const next = { ...selected, [substanceId]: value };
    setSelected(next);
    if (Object.keys(next).length === SUBSTANCES.length) setTimeout(onComplete, 400);
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      <p className="text-sm font-mono text-center mb-2" style={{ color: 'var(--muted)' }}>
        Classify each substance based on your results.
      </p>
      {SUBSTANCES.map(s => (
        <div key={s.id} className="flex items-center gap-3">
          <span className="text-xs font-mono w-28 shrink-0" style={{ color: 'var(--text)' }}>{s.name}</span>
          <div className="flex gap-2">
            {['acid', 'neutral', 'alkali'].map(cls => (
              <button key={cls} onClick={() => pick(s.id, cls)}
                className="px-3 py-1 rounded font-mono text-[10px] uppercase tracking-wider border transition-all"
                style={{
                  background: selected[s.id] === cls ? (cls === 'acid' ? 'rgba(239,68,68,0.15)' : cls === 'neutral' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)') : 'transparent',
                  borderColor: selected[s.id] === cls ? (cls === 'acid' ? '#ef4444' : cls === 'neutral' ? '#22c55e' : '#3b82f6') : 'var(--border)',
                  color: selected[s.id] === cls ? (cls === 'acid' ? '#ef4444' : cls === 'neutral' ? '#22c55e' : '#3b82f6') : 'var(--muted)',
                }}>
                {cls}
              </button>
            ))}
          </div>
          {selected[s.id] && <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--accent2)' }} />}
        </div>
      ))}
    </div>
  );
}

function CleanupStep({ onComplete }: { onComplete: () => void }) {
  const [disposed, setDisposed] = useState(0);
  const [rinsed, setRinsed] = useState(false);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>
        Dispose of all test tubes in the waste beaker, then rinse.
      </p>
      <div className="flex gap-3">
        {SUBSTANCES.map((s, i) => (
          <motion.div key={s.id} whileTap={{ scale: 0.95 }}
            onClick={() => { if (i === disposed) setDisposed(d => d + 1); }}
            className="cursor-pointer"
            style={{ opacity: i < disposed ? 0.3 : i === disposed ? 1 : 0.4 }}>
            <svg width="12" height="42" viewBox="0 0 12 42" fill="none">
              <rect x="1" y="0" width="10" height="34" rx="5"
                stroke={i < disposed ? 'rgba(90,122,153,0.3)' : 'rgba(79,209,255,0.4)'} strokeWidth="1" fill="rgba(13,21,32,0.5)" />
              <rect x="2" y="20" width="8" height="12" rx="4"
                fill={s.indicatorColor} fillOpacity={0.6} />
            </svg>
          </motion.div>
        ))}
      </div>
      {disposed === SUBSTANCES.length && !rinsed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => { setRinsed(true); setTimeout(onComplete, 500); }}
            className="px-6 py-2.5 rounded-lg font-mono text-sm border transition-all"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            💧 Rinse All Tubes
          </button>
        </motion.div>
      )}
      {rinsed && <p className="text-sm font-mono" style={{ color: 'var(--accent2)' }}>✓ Lab cleaned successfully</p>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────

const STEP_COMPONENTS = [
  SetupStep, AddSubstancesStep, AddIndicatorStep,
  RecordColorsStep, LitmusStep, ClassifyStep, CleanupStep,
];

export default function ExperimentPage() {
  const router = useRouter();
  const currentStep = useLabStore(s => s.currentStep);
  const experimentScore = useLabStore(s => s.experimentScore);
  const completeStep = useLabStore(s => s.completeStep);
  const setCurrentStep = useLabStore(s => s.setCurrentStep);
  const isSafetyComplete = useLabStore(s => s.isSafetyComplete);

  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'hint' } | null>(null);
  const [stepDone, setStepDone] = useState(false);

  // Redirect if safety not done
  useEffect(() => {
    if (!isSafetyComplete()) router.replace('/lab/safety');
  }, []);

  const step = STEPS[currentStep];
  const StepContent = STEP_COMPONENTS[currentStep];
  const progress = ((currentStep) / STEPS.length) * 100;

  function handleStepComplete() {
    completeStep(step.id, step.points);
    setStepDone(true);
    if (step.points > 0) {
      setFeedback({ msg: `+${step.points} pts — ${step.correctFeedback}`, type: 'success' });
    } else {
      setFeedback({ msg: step.correctFeedback, type: 'success' });
    }
  }

  function handleNext() {
    setFeedback(null);
    setStepDone(false);
    if (currentStep === STEPS.length - 1) {
      router.push('/lab/quiz');
    } else {
      setCurrentStep(currentStep + 1);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>Score:</span>
          <span className="text-sm font-semibold font-mono" style={{ color: 'var(--accent)' }}>
            {experimentScore} pts
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="px-6 pt-4">
        <ProgressBar value={progress} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">

          {/* Step header */}
          <motion.div className="text-center mb-8"
            key={currentStep}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--accent)' }}>
              Step {step.id}
            </p>
            <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
              {step.title}
            </h1>
            <p className="text-sm font-mono max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
              {step.instruction}
            </p>
          </motion.div>

          {/* Interactive content */}
          <AnimatePresence mode="wait">
            {!stepDone ? (
              <motion.div key={`step-${currentStep}-active`} className="flex justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <StepContent onComplete={handleStepComplete} />
              </motion.div>
            ) : (
              <motion.div key={`step-${currentStep}-done`}
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>

                {/* Feedback */}
                {feedback && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-sm"
                    style={{
                      background: 'rgba(122,255,178,0.08)',
                      border: '1px solid rgba(122,255,178,0.25)',
                      color: 'var(--accent2)',
                    }}>
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {feedback.msg}
                  </div>
                )}

                <Button size="lg" onClick={handleNext} className="min-w-[200px]">
                  {currentStep === STEPS.length - 1 ? 'Proceed to Quiz →' : 'Next Step →'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom instruction panel */}
      <div className="px-4 pb-6">
        <div className="max-w-2xl mx-auto glass rounded-xl px-5 py-3 flex items-center gap-3">
          <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
          <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{step.action}</p>
        </div>
      </div>
    </div>
  );
}
