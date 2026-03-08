'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, ArrowLeft, ChevronRight, BookOpen, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

interface Electrolyte {
  id: string;
  name: string;
  formula: string;
  color: string;
  cathodeProduct: string;
  anodeProduct: string;
  cathodeEquation: string;
  anodeEquation: string;
  cathodeObservation: string;
  anodeObservation: string;
  cathodeColor: string;  // bubble/deposit color
  anodeColor: string;
  notes: string;
  waecTip: string;
  concentration: 'dilute' | 'concentrated' | 'aqueous';
  cathodeType: 'bubbles' | 'deposit';
}

const ELECTROLYTES: Electrolyte[] = [
  {
    id: 'brine',
    name: 'Brine',
    formula: 'NaCl(aq) — concentrated',
    color: 'rgba(186,230,253,0.15)',
    concentration: 'concentrated',
    cathodeProduct: 'Hydrogen gas (H₂)',
    anodeProduct: 'Chlorine gas (Cl₂)',
    cathodeEquation: '2H⁺(aq) + 2e⁻ → H₂(g)',
    anodeEquation: '2Cl⁻(aq) → Cl₂(g) + 2e⁻',
    cathodeObservation: 'Colourless gas bubbles evolved. Gas relights a glowing splint.',
    anodeObservation: 'Yellow-green gas evolved. Gas bleaches damp litmus paper.',
    cathodeColor: '#E0F2FE',
    anodeColor: '#FEFCE8',
    cathodeType: 'bubbles',
    notes: 'In dilute NaCl, O₂ is produced at anode instead of Cl₂. Concentration determines which ion is discharged.',
    waecTip: 'WAEC often asks: "Why is Cl₂ produced at the anode instead of O₂?" Answer: High concentration of Cl⁻ ions means Cl⁻ is preferentially discharged over OH⁻.',
  },
  {
    id: 'cuso4',
    name: 'Copper(II) Sulphate',
    formula: 'CuSO₄(aq)',
    color: 'rgba(6,182,212,0.12)',
    concentration: 'aqueous',
    cathodeProduct: 'Copper deposit (Cu)',
    anodeProduct: 'Oxygen gas (O₂)',
    cathodeEquation: 'Cu²⁺(aq) + 2e⁻ → Cu(s)',
    anodeEquation: '2H₂O(l) → O₂(g) + 4H⁺(aq) + 4e⁻',
    cathodeObservation: 'Pink-brown solid (copper) deposits on the cathode. Solution becomes paler.',
    anodeObservation: 'Colourless gas bubbles evolved. Gas relights a glowing splint.',
    cathodeColor: '#B45309',
    anodeColor: '#E0F2FE',
    cathodeType: 'deposit',
    notes: 'If copper electrodes are used, the anode dissolves and solution concentration stays constant. With inert (carbon/platinum) electrodes, solution becomes more acidic.',
    waecTip: 'WAEC tip: Cu²⁺ is discharged at cathode rather than H⁺ because Cu²⁺ is lower in the electrochemical series (easier to reduce). Pink-brown deposit = copper.',
  },
  {
    id: 'h2so4',
    name: 'Dilute Sulphuric Acid',
    formula: 'H₂SO₄(aq) — dilute',
    color: 'rgba(250,204,21,0.08)',
    concentration: 'dilute',
    cathodeProduct: 'Hydrogen gas (H₂)',
    anodeProduct: 'Oxygen gas (O₂)',
    cathodeEquation: '4H⁺(aq) + 4e⁻ → 2H₂(g)',
    anodeEquation: '2H₂O(l) → O₂(g) + 4H⁺(aq) + 4e⁻',
    cathodeObservation: 'Colourless gas bubbles evolved. Ratio H₂:O₂ = 2:1 by volume.',
    anodeObservation: 'Colourless gas bubbles evolved (half the volume of H₂).',
    cathodeColor: '#E0F2FE',
    anodeColor: '#E0F2FE',
    cathodeType: 'bubbles',
    notes: 'The 2:1 ratio (H₂:O₂) is because the cathode half-reaction requires twice as many electrons per volume of gas. This confirms the formula of water.',
    waecTip: 'Classic WAEC question: "What ratio of gases is collected?" H₂ = 2 vol, O₂ = 1 vol. If tubes fill at different rates, H₂ fills first.',
  },
  {
    id: 'alcl3',
    name: 'Aluminium Chloride',
    formula: 'AlCl₃(aq)',
    color: 'rgba(167,139,250,0.08)',
    concentration: 'aqueous',
    cathodeProduct: 'Hydrogen gas (H₂)',
    anodeProduct: 'Chlorine gas (Cl₂)',
    cathodeEquation: '2H⁺(aq) + 2e⁻ → H₂(g)',
    anodeEquation: '2Cl⁻(aq) → Cl₂(g) + 2e⁻',
    cathodeObservation: 'Colourless gas bubbles evolved. H₂ is produced, not Al, as H⁺ is easier to discharge than Al³⁺.',
    anodeObservation: 'Yellow-green gas evolved. Gas bleaches damp litmus paper.',
    cathodeColor: '#E0F2FE',
    anodeColor: '#FEFCE8',
    cathodeType: 'bubbles',
    notes: 'Al³⁺ is NOT discharged at the cathode because Al is very high in the electrochemical series. H⁺ (from water) is preferentially discharged instead.',
    waecTip: 'WAEC often tests why Al is not deposited from AlCl₃(aq). Answer: Al³⁺ is harder to reduce than H⁺. Industrial Al extraction uses molten AlCl₃/Al₂O₃, not aqueous solution.',
  },
];

// ─── SVG Components ───────────────────────────────────────────────────────────

interface BubbleProps {
  x: number;
  delay: number;
  color: string;
  active: boolean;
}

function Bubble({ x, delay, color, active }: BubbleProps) {
  return active ? (
    <motion.circle
      cx={x}
      cy={260}
      r={3}
      fill={color}
      stroke="rgba(255,255,255,0.4)"
      strokeWidth={0.5}
      initial={{ cy: 260, opacity: 0.8 }}
      animate={{ cy: 60, opacity: 0 }}
      transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  ) : null;
}

interface DepositProps {
  active: boolean;
  color: string;
  progress: number;
}

function CopperDeposit({ active, color, progress }: DepositProps) {
  if (!active) return null;
  const height = progress * 80;
  return (
    <motion.rect
      x={78}
      y={280 - height}
      width={24}
      height={height}
      rx={2}
      fill={color}
      opacity={0.85}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      style={{ transformOrigin: 'bottom' }}
    />
  );
}

interface ElectrolysisApparatusProps {
  electrolyte: Electrolyte;
  running: boolean;
  progress: number;  // 0–1
  currentOn: boolean;
}

function ElectrolysisApparatus({ electrolyte, running, progress, currentOn }: ElectrolysisApparatusProps) {
  // Solution color fades for CuSO4
  const solutionOpacity = electrolyte.id === 'cuso4' ? Math.max(0.15, 0.7 - progress * 0.5) : 0.7;
  const solutionColor = electrolyte.id === 'cuso4'
    ? `rgba(6,182,212,${solutionOpacity})`
    : electrolyte.id === 'brine'
    ? 'rgba(186,230,253,0.35)'
    : electrolyte.id === 'alcl3'
    ? 'rgba(167,139,250,0.25)'
    : 'rgba(250,204,21,0.2)';

  const isDeposit = electrolyte.cathodeType === 'deposit';

  return (
    <svg viewBox="0 0 320 340" className="w-full max-w-xs mx-auto" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
      {/* Power supply */}
      <rect x={115} y={8} width={90} height={38} rx={6} fill="#1E293B" stroke="#334155" strokeWidth={1.5} />
      <text x={160} y={22} textAnchor="middle" fill="#94A3B8" fontSize={7} fontFamily="monospace">POWER SUPPLY</text>
      {/* Voltage indicator */}
      <rect x={130} y={26} width={60} height={14} rx={3} fill="#0F172A" />
      <text x={160} y={36} textAnchor="middle" fill={currentOn ? '#4ADE80' : '#475569'} fontSize={8} fontFamily="monospace">
        {currentOn ? '12.0 V' : '0.0 V'}
      </text>

      {/* Wire left (negative → cathode) */}
      <motion.line
        x1={125} y1={27} x2={90} y2={70}
        stroke={currentOn ? '#60A5FA' : '#334155'}
        strokeWidth={2.5}
        strokeDasharray={currentOn ? '4 3' : '0'}
        animate={currentOn ? { strokeDashoffset: [0, -14] } : { strokeDashoffset: 0 }}
        transition={{ duration: 0.5, repeat: currentOn ? Infinity : 0, ease: 'linear' }}
      />
      {/* Wire right (positive → anode) */}
      <motion.line
        x1={195} y1={27} x2={230} y2={70}
        stroke={currentOn ? '#F87171' : '#334155'}
        strokeWidth={2.5}
        strokeDasharray={currentOn ? '4 3' : '0'}
        animate={currentOn ? { strokeDashoffset: [0, 14] } : { strokeDashoffset: 0 }}
        transition={{ duration: 0.5, repeat: currentOn ? Infinity : 0, ease: 'linear' }}
      />

      {/* Negative / Positive labels */}
      <text x={115} y={24} textAnchor="middle" fill="#60A5FA" fontSize={9} fontFamily="monospace">−</text>
      <text x={205} y={24} textAnchor="middle" fill="#F87171" fontSize={9} fontFamily="monospace">+</text>

      {/* Beaker outline */}
      <path d="M50 80 L50 300 Q50 310 60 310 L260 310 Q270 310 270 300 L270 80 Z"
        fill="rgba(15,23,42,0.6)" stroke="#334155" strokeWidth={1.5} />

      {/* Solution fill */}
      <clipPath id="beaker-clip">
        <rect x={52} y={82} width={216} height={225} />
      </clipPath>
      <rect x={52} y={140} width={216} height={167} fill={solutionColor} clipPath="url(#beaker-clip)" />

      {/* Solution surface shimmer */}
      <motion.line
        x1={52} y1={140} x2={268} y2={140}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={1}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Cathode electrode (left, carbon/platinum grey) */}
      <rect x={80} y={70} width={20} height={215} rx={3} fill="#475569" stroke="#64748B" strokeWidth={1} />
      <text x={90} y={67} textAnchor="middle" fill="#60A5FA" fontSize={8} fontFamily="monospace">Cathode (−)</text>

      {/* Anode electrode (right) */}
      <rect x={220} y={70} width={20} height={215} rx={3} fill="#475569" stroke="#64748B" strokeWidth={1} />
      <text x={230} y={67} textAnchor="middle" fill="#F87171" fontSize={8} fontFamily="monospace">Anode (+)</text>

      {/* Copper deposit on cathode */}
      {isDeposit && (
        <CopperDeposit active={running || progress > 0} color={electrolyte.cathodeColor} progress={progress} />
      )}

      {/* Cathode bubbles */}
      {!isDeposit && [0, 1, 2, 3].map(i => (
        <Bubble key={`c${i}`} x={88 + i * 2} delay={i * 0.6} color={electrolyte.cathodeColor} active={running} />
      ))}

      {/* Anode bubbles */}
      {[0, 1, 2, 3].map(i => (
        <Bubble key={`a${i}`} x={228 + i * 2} delay={i * 0.5 + 0.2} color={electrolyte.anodeColor} active={running} />
      ))}

      {/* Gas collection tubes (for H2SO4 to show 2:1 ratio) */}
      {electrolyte.id === 'h2so4' && running && (
        <>
          {/* Left tube (H2 — fills faster) */}
          <rect x={65} y={90} width={18} height={60} rx={3} fill="none" stroke="#94A3B8" strokeWidth={1} />
          <motion.rect
            x={66} y={90} width={16}
            height={0}
            rx={2}
            fill="rgba(224,242,254,0.7)"
            animate={{ height: [0, 58] }}
            transition={{ duration: 4, ease: 'linear' }}
            style={{ transformOrigin: 'bottom', scaleY: -1 }}
          />
          <text x={74} y={86} textAnchor="middle" fill="#60A5FA" fontSize={6} fontFamily="monospace">H₂</text>

          {/* Right tube (O2 — fills half as fast) */}
          <rect x={237} y={90} width={18} height={60} rx={3} fill="none" stroke="#94A3B8" strokeWidth={1} />
          <motion.rect
            x={238} y={90} width={16}
            height={0}
            rx={2}
            fill="rgba(224,242,254,0.7)"
            animate={{ height: [0, 29] }}
            transition={{ duration: 4, ease: 'linear' }}
            style={{ transformOrigin: 'bottom', scaleY: -1 }}
          />
          <text x={246} y={86} textAnchor="middle" fill="#F87171" fontSize={6} fontFamily="monospace">O₂</text>
        </>
      )}

      {/* Electrode labels at bottom */}
      <text x={90} y={322} textAnchor="middle" fill="#64748B" fontSize={7} fontFamily="monospace">REDUCTION</text>
      <text x={230} y={322} textAnchor="middle" fill="#64748B" fontSize={7} fontFamily="monospace">OXIDATION</text>

      {/* Current arrow indicator */}
      {currentOn && (
        <motion.g animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <text x={160} y={160} textAnchor="middle" fill="rgba(148,163,184,0.6)" fontSize={7} fontFamily="monospace">e⁻ flow</text>
          <line x1={120} y1={163} x2={100} y2={163} stroke="rgba(148,163,184,0.5)" strokeWidth={1} markerEnd="url(#arrow)" />
        </motion.g>
      )}
    </svg>
  );
}

// ─── Phases ───────────────────────────────────────────────────────────────────

type Phase = 'select' | 'setup' | 'running' | 'observe' | 'equations' | 'complete';

const PHASE_LABELS: Record<Phase, string> = {
  select: 'Choose Electrolyte',
  setup: 'Set Up Circuit',
  running: 'Electrolysis Running',
  observe: 'Record Observations',
  equations: 'Write Equations',
  complete: 'Complete',
};

const PHASES: Phase[] = ['select', 'setup', 'running', 'observe', 'equations', 'complete'];

const slideVariants: Variants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.25 } },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ElectrolysisPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentOn, setCurrentOn] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [cathodeTested, setCathodeTested] = useState(false);
  const [anodeTested, setAnodeTested] = useState(false);
  const [equationsEntered, setEquationsEntered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const electrolyte = ELECTROLYTES.find(e => e.id === selectedId) ?? null;

  const startElectrolysis = useCallback(() => {
    setCurrentOn(true);
    setRunning(true);
    setElapsed(0);
    setProgress(0);
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 0.1;
        setProgress(Math.min(next / 20, 1));
        if (next >= 20) {
          clearInterval(timerRef.current!);
          setRunning(false);
          setTimeout(() => setPhase('observe'), 400);
        }
        return next;
      });
    }, 100);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('select');
    setSelectedId(null);
    setCurrentOn(false);
    setRunning(false);
    setProgress(0);
    setElapsed(0);
    setCathodeTested(false);
    setAnodeTested(false);
    setEquationsEntered(false);
  };

  const phaseIndex = PHASES.indexOf(phase);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]"
        style={{ background: 'rgba(8,12,16,0.92)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push('/lab')}
            className="flex items-center gap-1.5 text-xs font-mono transition-colors mr-2"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <Zap className="w-4 h-4" style={{ color: '#FCD34D' }} />
          <span className="font-mono text-sm font-semibold tracking-wider" style={{ color: '#FCD34D' }}>
            Electrolysis
          </span>
        </div>

        {/* Phase dots */}
        <div className="flex items-center gap-1.5">
          {PHASES.map((p, i) => (
            <div
              key={p}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === phaseIndex ? '20px' : '6px',
                height: '6px',
                background: i < phaseIndex ? '#4ADE80' : i === phaseIndex ? '#FCD34D' : 'var(--border)',
              }}
            />
          ))}
        </div>

        <button onClick={reset} className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-16 pt-6">
        <AnimatePresence mode="wait">

          {/* ── PHASE: select ─────────────────────────────────────── */}
          {phase === 'select' && (
            <motion.div key="select" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Electrolysis</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                Pass direct current through an electrolyte. Select a solution to investigate which ions are discharged at each electrode.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {ELECTROLYTES.map(el => (
                  <button
                    key={el.id}
                    onClick={() => { setSelectedId(el.id); setPhase('setup'); }}
                    className="text-left rounded-2xl p-4 border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                    style={{ background: el.color, borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{el.name}</p>
                        <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{el.formula}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 mt-0.5" style={{ color: 'var(--muted)' }} />
                    </div>
                    <div className="flex gap-2 text-[10px] font-mono mt-3">
                      <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(96,165,250,0.15)', color: '#60A5FA' }}>
                        Cathode: {el.cathodeProduct.split(' ')[0]}
                      </span>
                      <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171' }}>
                        Anode: {el.anodeProduct.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Key concepts reminder */}
              <div className="mt-6 rounded-xl p-4 border text-xs font-mono space-y-1"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)', color: 'var(--muted)' }}>
                <p className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Key Rules</p>
                <p>• Cathode (−): cations reduced — gain electrons</p>
                <p>• Anode (+): anions oxidised — lose electrons</p>
                <p>• Selective discharge: ion lower in electrochemical series is discharged first</p>
                <p>• Inert electrodes: platinum or carbon (do not react)</p>
              </div>
            </motion.div>
          )}

          {/* ── PHASE: setup ─────────────────────────────────────── */}
          {phase === 'setup' && electrolyte && (
            <motion.div key="setup" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <p className="text-xs font-mono mb-1" style={{ color: '#FCD34D' }}>STEP 1 · SET UP CIRCUIT</p>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Electrolysis of {electrolyte.name}
              </h2>

              <ElectrolysisApparatus electrolyte={electrolyte} running={false} progress={0} currentOn={false} />

              <div className="mt-5 rounded-xl p-4 border space-y-2 text-sm"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)' }}>
                <p className="font-semibold text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>PROCEDURE</p>
                <p style={{ color: 'var(--text)' }}>1. Fill the beaker with <strong>{electrolyte.formula}</strong>.</p>
                <p style={{ color: 'var(--text)' }}>2. Dip two inert carbon electrodes into the solution.</p>
                <p style={{ color: 'var(--text)' }}>3. Connect the cathode (−) to the negative terminal of the power supply.</p>
                <p style={{ color: 'var(--text)' }}>4. Connect the anode (+) to the positive terminal.</p>
                <p style={{ color: 'var(--text)' }}>5. Switch on — observe both electrodes carefully.</p>
              </div>

              <button
                onClick={() => { setPhase('running'); setTimeout(startElectrolysis, 500); }}
                className="mt-5 w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: '#FCD34D', color: '#0F172A' }}
              >
                Switch On Power Supply →
              </button>
            </motion.div>
          )}

          {/* ── PHASE: running ───────────────────────────────────── */}
          {phase === 'running' && electrolyte && (
            <motion.div key="running" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: '#4ADE80' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <span className="text-xs font-mono" style={{ color: '#4ADE80' }}>
                  ELECTROLYSIS RUNNING — {Math.round(elapsed)}s / 20s
                </span>
              </div>

              <ElectrolysisApparatus electrolyte={electrolyte} running={running} progress={progress} currentOn={currentOn} />

              {/* Progress bar */}
              <div className="mt-4 rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#FCD34D' }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 border text-center" style={{ background: 'rgba(96,165,250,0.08)', borderColor: 'rgba(96,165,250,0.2)' }}>
                  <p className="text-xs font-mono mb-1" style={{ color: '#60A5FA' }}>CATHODE (−)</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{electrolyte.cathodeProduct}</p>
                </div>
                <div className="rounded-xl p-3 border text-center" style={{ background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)' }}>
                  <p className="text-xs font-mono mb-1" style={{ color: '#F87171' }}>ANODE (+)</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{electrolyte.anodeProduct}</p>
                </div>
              </div>

              {!running && progress >= 1 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setPhase('observe')}
                  className="mt-5 w-full py-3.5 rounded-xl font-bold text-sm"
                  style={{ background: '#FCD34D', color: '#0F172A' }}
                >
                  Record Observations →
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ── PHASE: observe ───────────────────────────────────── */}
          {phase === 'observe' && electrolyte && (
            <motion.div key="observe" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <p className="text-xs font-mono mb-1" style={{ color: '#FCD34D' }}>STEP 3 · OBSERVATIONS</p>
              <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text)' }}>
                What did you observe?
              </h2>

              {/* Test the gases */}
              <p className="text-xs font-mono mb-3" style={{ color: 'var(--muted)' }}>TAP AN ELECTRODE TO TEST THE PRODUCT</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  onClick={() => setCathodeTested(true)}
                  className="rounded-xl p-4 border text-left transition-all"
                  style={{
                    background: cathodeTested ? 'rgba(96,165,250,0.12)' : 'rgba(96,165,250,0.04)',
                    borderColor: cathodeTested ? 'rgba(96,165,250,0.5)' : 'rgba(96,165,250,0.2)',
                  }}
                >
                  <p className="text-xs font-mono mb-1" style={{ color: '#60A5FA' }}>CATHODE TEST</p>
                  <p className="text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>{electrolyte.cathodeProduct}</p>
                  {cathodeTested ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {electrolyte.cathodeObservation}
                    </motion.p>
                  ) : (
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Tap to test →</p>
                  )}
                </button>

                <button
                  onClick={() => setAnodeTested(true)}
                  className="rounded-xl p-4 border text-left transition-all"
                  style={{
                    background: anodeTested ? 'rgba(248,113,113,0.12)' : 'rgba(248,113,113,0.04)',
                    borderColor: anodeTested ? 'rgba(248,113,113,0.5)' : 'rgba(248,113,113,0.2)',
                  }}
                >
                  <p className="text-xs font-mono mb-1" style={{ color: '#F87171' }}>ANODE TEST</p>
                  <p className="text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>{electrolyte.anodeProduct}</p>
                  {anodeTested ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {electrolyte.anodeObservation}
                    </motion.p>
                  ) : (
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Tap to test →</p>
                  )}
                </button>
              </div>

              {/* Notes */}
              {(cathodeTested || anodeTested) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-4 border mb-5 flex gap-3"
                  style={{ background: 'rgba(250,204,21,0.06)', borderColor: 'rgba(250,204,21,0.2)' }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FCD34D' }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{electrolyte.notes}</p>
                </motion.div>
              )}

              {cathodeTested && anodeTested && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setPhase('equations')}
                  className="w-full py-3.5 rounded-xl font-bold text-sm"
                  style={{ background: '#FCD34D', color: '#0F172A' }}
                >
                  Write Electrode Equations →
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ── PHASE: equations ─────────────────────────────────── */}
          {phase === 'equations' && electrolyte && (
            <motion.div key="equations" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <p className="text-xs font-mono mb-1" style={{ color: '#FCD34D' }}>STEP 4 · ELECTRODE EQUATIONS</p>
              <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text)' }}>
                Half-Equations
              </h2>

              <div className="space-y-4 mb-5">
                <div className="rounded-xl p-4 border" style={{ background: 'rgba(96,165,250,0.06)', borderColor: 'rgba(96,165,250,0.2)' }}>
                  <p className="text-xs font-mono mb-2" style={{ color: '#60A5FA' }}>CATHODE — REDUCTION (gain of electrons)</p>
                  <p className="text-lg font-mono font-bold" style={{ color: 'var(--text)' }}>{electrolyte.cathodeEquation}</p>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {electrolyte.cathodeProduct} is produced. Positive ions move to the cathode and gain electrons.
                  </p>
                </div>

                <div className="rounded-xl p-4 border" style={{ background: 'rgba(248,113,113,0.06)', borderColor: 'rgba(248,113,113,0.2)' }}>
                  <p className="text-xs font-mono mb-2" style={{ color: '#F87171' }}>ANODE — OXIDATION (loss of electrons)</p>
                  <p className="text-lg font-mono font-bold" style={{ color: 'var(--text)' }}>{electrolyte.anodeEquation}</p>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {electrolyte.anodeProduct} is produced. Negative ions move to the anode and lose electrons.
                  </p>
                </div>
              </div>

              {/* WAEC Tip */}
              <div className="rounded-xl p-4 border mb-5 flex gap-3"
                style={{ background: 'rgba(79,209,255,0.06)', borderColor: 'rgba(79,209,255,0.2)' }}>
                <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: 'var(--accent)' }}>WAEC TIP</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{electrolyte.waecTip}</p>
                </div>
              </div>

              <button
                onClick={() => { setEquationsEntered(true); setPhase('complete'); }}
                className="w-full py-3.5 rounded-xl font-bold text-sm"
                style={{ background: '#4ADE80', color: '#0F172A' }}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Complete Experiment
              </button>
            </motion.div>
          )}

          {/* ── PHASE: complete ───────────────────────────────────── */}
          {phase === 'complete' && electrolyte && (
            <motion.div key="complete" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <motion.div
                className="text-center py-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  ⚡
                </motion.div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Experiment Complete!</h2>
                <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
                  You have successfully electrolysed {electrolyte.name}
                </p>
              </motion.div>

              {/* Summary table */}
              <div className="rounded-xl border overflow-hidden mb-5"
                style={{ borderColor: 'var(--border)' }}>
                <div className="px-4 py-3 border-b text-xs font-mono font-semibold"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'var(--border)', color: 'var(--muted)' }}>
                  RESULTS SUMMARY — {electrolyte.name.toUpperCase()}
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {[
                    { label: 'Electrolyte', value: electrolyte.formula, color: 'var(--text)' },
                    { label: 'Cathode product', value: electrolyte.cathodeProduct, color: '#60A5FA' },
                    { label: 'Cathode equation', value: electrolyte.cathodeEquation, color: '#60A5FA' },
                    { label: 'Anode product', value: electrolyte.anodeProduct, color: '#F87171' },
                    { label: 'Anode equation', value: electrolyte.anodeEquation, color: '#F87171' },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-4 px-4 py-3">
                      <span className="text-xs font-mono w-32 flex-shrink-0 pt-0.5" style={{ color: 'var(--muted)' }}>{row.label}</span>
                      <span className="text-sm font-mono font-medium" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={reset}
                  className="py-3 rounded-xl font-semibold text-sm border"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  Try Another
                </button>
                <button
                  onClick={() => router.push('/lab')}
                  className="py-3 rounded-xl font-bold text-sm"
                  style={{ background: '#FCD34D', color: '#0F172A' }}
                >
                  Back to Lab
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
