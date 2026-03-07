'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import SafetyStep from '@/components/lab/SafetyStep';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { useLabStore } from '@/store/labStore';
import { acidBaseExperiment } from '@/lib/experiments/acidBase';
import type { SafetyStep as SafetyStepId } from '@/store/labStore';

const { safetyItems } = acidBaseExperiment;
const REQUIRED: SafetyStepId[] = ['handwash', 'gloves', 'goggles'];

export default function SafetyPage() {
  const router = useRouter();

  const safetySteps      = useLabStore(s => s.safetySteps);
  const completeSafety   = useLabStore(s => s.completeSafetyStep);
  const isSafetyComplete = useLabStore(s => s.isSafetyComplete);

  const completedCount = REQUIRED.filter(id => safetySteps[id]).length;
  const progress       = (completedCount / REQUIRED.length) * 100;
  const allDone        = isSafetyComplete();

  // Active step = first unchecked item
  const activeItemId = REQUIRED.find(id => !safetySteps[id]) ?? null;

  function handleContinue() {
    router.push('/lab/experiment');
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-deep)' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
          <span className="font-mono text-sm font-semibold tracking-widest text-[var(--accent)] uppercase">
            Safety Protocol
          </span>
        </motion.div>

        <button
          className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          onClick={() => router.push('/lab')}
        >
          ← Back
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg">

          {/* Title block */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Before You Enter
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Complete all three safety steps. In a real lab these protect you from chemical hazards.
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <ProgressBar
              value={progress}
              label="Safety Checklist"
              current={completedCount}
              total={REQUIRED.length}
            />
          </motion.div>

          {/* Safety steps */}
          <div className="space-y-4 mb-10">
            {safetyItems.map((item, i) => (
              <SafetyStep
                key={item.id}
                item={item}
                index={i}
                isComplete={safetySteps[item.id as SafetyStepId]}
                isActive={activeItemId === item.id}
                onComplete={() => completeSafety(item.id as SafetyStepId)}
              />
            ))}
          </div>

          {/* All-done state */}
          <AnimatePresence>
            {allDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="text-center"
              >
                {/* Pulse ring */}
                <div className="relative inline-flex items-center justify-center mb-5">
                  <motion.div
                    className="absolute w-20 h-20 rounded-full border border-[var(--success)]"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.4)' }}
                  >
                    <ShieldCheck className="w-7 h-7 text-[var(--success)]" />
                  </div>
                </div>

                <h2 className="text-lg font-bold text-[var(--success)] mb-1">
                  You&apos;re protected
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  All safety requirements met. You may now enter the laboratory.
                </p>

                <Button
                  size="lg"
                  variant="primary"
                  onClick={handleContinue}
                  className="w-full justify-center"
                >
                  Proceed to Experiment →
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Locked state hint */}
          {!allDone && (
            <motion.p
              className="text-center text-xs font-mono text-[var(--text-muted)] mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Complete all steps above to continue
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
