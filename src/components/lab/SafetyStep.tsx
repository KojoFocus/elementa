'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import type { SafetyItem } from '@/types';

interface SafetyStepProps {
  item: SafetyItem;
  isComplete: boolean;
  isActive: boolean;
  index: number;
  onComplete: () => void;
}

// Simple animated icon per safety step
function SafetyAnimation({ animationKey, isComplete }: { animationKey: string; isComplete: boolean }) {
  const icons: Record<string, string> = {
    handwash: '🖐',
    gloves:   '🧤',
    goggles:  '🥽',
  };

  return (
    <motion.div
      className="relative flex items-center justify-center w-20 h-20 rounded-full"
      style={{
        background: isComplete
          ? 'rgba(34,197,94,0.1)'
          : 'rgba(79,209,255,0.06)',
        border: `2px solid ${isComplete ? 'rgba(34,197,94,0.4)' : 'rgba(79,209,255,0.15)'}`,
      }}
      animate={isComplete ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      <span className="text-3xl">{icons[animationKey] ?? '🔬'}</span>
      {isComplete && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[var(--success)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.div>
  );
}

export default function SafetyStep({
  item,
  isComplete,
  isActive,
  index,
  onComplete,
}: SafetyStepProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className="glass rounded-xl p-5 flex items-center gap-5 transition-all duration-300 cursor-pointer"
        style={{
          borderColor: isComplete
            ? 'rgba(34,197,94,0.3)'
            : isActive
            ? 'rgba(79,209,255,0.25)'
            : 'var(--border)',
          background: isComplete
            ? 'rgba(34,197,94,0.04)'
            : isActive
            ? 'rgba(79,209,255,0.04)'
            : undefined,
        }}
        onClick={() => !isComplete && isActive && onComplete()}
      >
        {/* Icon */}
        <div className="shrink-0">
          <SafetyAnimation animationKey={item.animationKey} isComplete={isComplete} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              {item.title}
            </h3>
            {isActive && !isComplete && (
              <motion.span
                className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded"
                style={{ background: 'rgba(79,209,255,0.1)', color: 'var(--accent)' }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Action required
              </motion.span>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {item.description}
          </p>

          {isActive && !isComplete && (
            <motion.p
              className="mt-2 text-xs font-mono text-[var(--accent)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Tap to confirm →
            </motion.p>
          )}
        </div>

        {/* Status */}
        <div className="shrink-0">
          {isComplete ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CheckCircle className="w-7 h-7 text-[var(--success)]" />
            </motion.div>
          ) : (
            <Circle
              className="w-7 h-7"
              style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
            />
          )}
        </div>
      </div>

      {/* Connector line to next step */}
      <div className="absolute left-[2.75rem] -bottom-4 w-px h-4 bg-[var(--border)]" />
    </motion.div>
  );
}
