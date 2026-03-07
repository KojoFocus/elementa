'use client';

import { motion } from 'framer-motion';

// ─── Beaker SVG ───────────────────────────────────────────────
function Beaker({
  color = '#6b21a8',
  fill = 0.45,
  delay = 0,
  label,
}: {
  color?: string;
  fill?: number;
  delay?: number;
  label?: string;
}) {
  const fillPct = Math.min(1, Math.max(0, fill));

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        width="44" height="60" viewBox="0 0 44 60"
        fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        {/* Beaker body */}
        <path
          d="M10 6 L6 52 Q6 56 10 56 L34 56 Q38 56 38 52 L34 6 Z"
          stroke="rgba(79,209,255,0.35)"
          strokeWidth="1.5"
          fill="rgba(13,17,23,0.6)"
        />
        {/* Lip */}
        <rect x="8" y="3" width="28" height="5" rx="2"
          fill="rgba(79,209,255,0.15)" stroke="rgba(79,209,255,0.4)" strokeWidth="1" />

        {/* Liquid fill — clipped to beaker shape */}
        <clipPath id={`clip-${label}`}>
          <path d="M10.5 6.5 L7 52 Q7 55 10.5 55 L33.5 55 Q37 55 37 52 L33.5 6.5 Z" />
        </clipPath>
        <motion.rect
          x="7" width="30"
          y={56 - 49 * fillPct} height={49 * fillPct}
          clipPath={`url(#clip-${label})`}
          fill={color}
          fillOpacity={0.75}
          initial={{ y: 56, height: 0 }}
          animate={{ y: 56 - 49 * fillPct, height: 49 * fillPct }}
          transition={{ delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Shine */}
        <line x1="14" y1="14" x2="12" y2="48"
          stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />

        {/* Bubble */}
        <motion.circle
          cx="22" cy={56 - 49 * fillPct + 6}
          r="2.5"
          fill="rgba(255,255,255,0.15)"
          animate={{ cy: [56 - 49 * fillPct + 6, 56 - 49 * fillPct - 8], opacity: [0.2, 0] }}
          transition={{ delay: delay + 1.4, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
      </svg>
      {label && (
        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Test tube SVG ────────────────────────────────────────────
function TestTube({ color = '#4fd1ff', delay = 0 }: { color?: string; delay?: number }) {
  return (
    <svg width="16" height="54" viewBox="0 0 16 54" fill="none">
      <rect x="2" y="0" width="12" height="42" rx="6" ry="6"
        stroke="rgba(79,209,255,0.3)" strokeWidth="1.2" fill="rgba(13,17,23,0.5)" />
      <motion.rect
        x="3" width="10" rx="5" ry="5"
        y={42 - 22} height={22}
        fill={color} fillOpacity={0.7}
        initial={{ y: 42, height: 0 }}
        animate={{ y: 42 - 22, height: 22 }}
        transition={{ delay, duration: 0.8, ease: 'easeOut' }}
      />
      {/* Cap */}
      <rect x="0" y="0" width="16" height="5" rx="2"
        fill="rgba(79,209,255,0.2)" stroke="rgba(79,209,255,0.4)" strokeWidth="1" />
    </svg>
  );
}

// ─── Workbench surface ────────────────────────────────────────
function Workbench() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-[36%]"
      style={{
        background: 'linear-gradient(180deg, #111c27 0%, #0a1219 100%)',
        borderTop: '1px solid rgba(79,209,255,0.12)',
        boxShadow: 'inset 0 1px 0 rgba(79,209,255,0.08)',
      }}
    >
      {/* Surface grid lines */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(79,209,255,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 100%',
        }}
      />
    </div>
  );
}

// ─── Overhead lamp ────────────────────────────────────────────
function OverheadLamp() {
  return (
    <g>
      {/* Arm */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-[var(--border)]"
        style={{ height: '18%' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      />
      {/* Lamp head */}
      <motion.div
        className="absolute top-[16%] left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div
          className="w-16 h-5 rounded-b-full"
          style={{
            background: 'linear-gradient(180deg, #1e3040 0%, #162535 100%)',
            border: '1px solid rgba(79,209,255,0.2)',
          }}
        />
        {/* Light cone */}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 pointer-events-none"
          style={{
            borderLeft: '50px solid transparent',
            borderRight: '50px solid transparent',
            borderTop: '70px solid rgba(79,209,255,0.04)',
          }}
        />
      </motion.div>
    </g>
  );
}

// ─── LabScene (main export) ───────────────────────────────────

interface LabSceneProps {
  animate?: boolean;
  className?: string;
}

export default function LabScene({ animate = true, className = '' }: LabSceneProps) {
  return (
    <div
      className={`relative w-full overflow-hidden lab-grid scanlines select-none ${className}`}
      style={{ background: 'var(--bg-deep)' }}
    >
      {/* Ambient glow from top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/3 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(79,209,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Workbench */}
      <Workbench />

      {/* Overhead lamp */}
      <div className="absolute inset-0 pointer-events-none">
        <OverheadLamp />
      </div>

      {/* ── Equipment on the bench ── */}
      <div className="absolute bottom-[34%] left-0 right-0 flex items-end justify-center gap-6 px-8">

        {/* Test tube rack */}
        <motion.div
          className="flex items-end gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
        >
          {/* Rack bar */}
          <div className="relative flex items-end gap-2 pb-1">
            <div
              className="absolute -bottom-1 left-0 right-0 h-1.5 rounded"
              style={{ background: 'rgba(79,209,255,0.15)', border: '1px solid rgba(79,209,255,0.2)' }}
            />
            <TestTube color="#ec4899" delay={0.8} />
            <TestTube color="#6b21a8" delay={1.0} />
            <TestTube color="#4fd1ff" delay={1.2} />
            <TestTube color="#22c55e" delay={1.4} />
          </div>
        </motion.div>

        {/* Main beakers */}
        <motion.div
          className="flex items-end gap-3"
          initial={{ opacity: 0, y: 24 }}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
        >
          <Beaker color="#ec4899" fill={0.55} delay={0.9}  label="acid" />
          <Beaker color="#6b21a8" fill={0.60} delay={0.7}  label="ind." />
          <Beaker color="#22c55e" fill={0.40} delay={1.1}  label="base" />
        </motion.div>

        {/* Dropper + stirring rod */}
        <motion.div
          className="flex items-end gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
        >
          {/* Stirring rod */}
          <div
            className="w-[3px] rounded-full"
            style={{
              height: 50,
              background: 'linear-gradient(180deg, rgba(79,209,255,0.5), rgba(79,209,255,0.15))',
            }}
          />
          {/* Dropper */}
          <svg width="14" height="50" viewBox="0 0 14 50" fill="none">
            <rect x="3" y="0" width="8" height="5" rx="1"
              fill="rgba(79,209,255,0.2)" stroke="rgba(79,209,255,0.4)" strokeWidth="1" />
            <rect x="4" y="5" width="6" height="30" rx="3"
              fill="rgba(13,17,23,0.6)" stroke="rgba(79,209,255,0.25)" strokeWidth="1" />
            <path d="M5 35 Q7 45 7 50" stroke="rgba(79,209,255,0.3)" strokeWidth="1.5" fill="none" />
            {/* Liquid inside dropper */}
            <rect x="5" y="18" width="4" height="14" rx="2"
              fill="rgba(107,33,168,0.6)" />
          </svg>
        </motion.div>

        {/* pH paper strips */}
        <motion.div
          className="flex items-end gap-1"
          initial={{ opacity: 0, y: 16 }}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          {['#ef4444','#f97316','#eab308','#22c55e','#3b82f6'].map((c, i) => (
            <div
              key={i}
              className="w-[5px] rounded-sm"
              style={{ height: 28 + i * 4, background: c, opacity: 0.7 }}
            />
          ))}
        </motion.div>
      </div>

      {/* Side cabinet (left) */}
      <motion.div
        className="absolute left-0 bottom-[34%] w-[12%]"
        style={{
          height: '32%',
          background: 'linear-gradient(90deg, #0a1219, #0e1820)',
          borderRight: '1px solid rgba(79,209,255,0.08)',
          borderTop: '1px solid rgba(79,209,255,0.08)',
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={animate ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {/* Cabinet handle */}
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
          style={{ background: 'rgba(79,209,255,0.2)' }}
        />
      </motion.div>

      {/* Side cabinet (right) */}
      <motion.div
        className="absolute right-0 bottom-[34%] w-[12%]"
        style={{
          height: '32%',
          background: 'linear-gradient(270deg, #0a1219, #0e1820)',
          borderLeft: '1px solid rgba(79,209,255,0.08)',
          borderTop: '1px solid rgba(79,209,255,0.08)',
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={animate ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
          style={{ background: 'rgba(79,209,255,0.2)' }}
        />
      </motion.div>

      {/* Wall periodic-table poster (blurred suggestion) */}
      <motion.div
        className="absolute top-[8%] right-[14%]"
        initial={{ opacity: 0 }}
        animate={animate ? { opacity: 0.6 } : {}}
        transition={{ delay: 1, duration: 1 }}
      >
        <div
          className="grid gap-[2px]"
          style={{
            gridTemplateColumns: 'repeat(9, 8px)',
          }}
        >
          {Array.from({ length: 54 }).map((_, i) => (
            <div
              key={i}
              className="h-[6px] rounded-[1px]"
              style={{
                background: [
                  'rgba(79,209,255,0.4)',
                  'rgba(107,33,168,0.4)',
                  'rgba(34,197,94,0.35)',
                  'rgba(249,115,22,0.35)',
                ][i % 4],
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating particles */}
      {animate && [
        { top: '25%', left: '30%', delay: 0 },
        { top: '40%', left: '60%', delay: 0.8 },
        { top: '20%', left: '70%', delay: 1.6 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{ top: p.top, left: p.left, background: 'var(--accent)', opacity: 0.3 }}
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ delay: p.delay, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
