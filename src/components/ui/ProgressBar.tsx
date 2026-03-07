'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;       // 0–100
  total?: number;      // optional step label
  current?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  total,
  current,
  label,
  showValue = false,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue || (total !== undefined && current !== undefined)) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
              {label}
            </span>
          )}
          <span className="text-xs font-mono text-[var(--text-muted)] ml-auto">
            {total !== undefined && current !== undefined
              ? `${current} / ${total}`
              : showValue
              ? `${Math.round(pct)}%`
              : null}
          </span>
        </div>
      )}

      {/* Track */}
      <div className="relative h-1.5 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
        {/* Fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, var(--accent-dim), var(--accent))',
            boxShadow: '0 0 8px var(--accent-glow)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {/* Shimmer */}
        <motion.div
          className="absolute inset-y-0 w-16 rounded-full opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
          animate={{ x: ['-64px', '100%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
        />
      </div>
    </div>
  );
}
