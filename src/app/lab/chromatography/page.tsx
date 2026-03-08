'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Layers, ArrowLeft, RotateCcw, BookOpen, CheckCircle, Calculator } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

interface Pigment {
  id: string;
  name: string;
  color: string;
  rfValue: number;
  description: string;
}

interface Ink {
  id: string;
  name: string;
  label: string;
  pigments: Pigment[];
  description: string;
  waecContext: string;
}

const INKS: Ink[] = [
  {
    id: 'black',
    name: 'Black Ink',
    label: 'Black',
    description: 'Black ink is a mixture. Chromatography separates it into several coloured pigments.',
    waecContext: 'Commonly used in WAEC chromatography questions. Shows that black is NOT a pure colour.',
    pigments: [
      { id: 'yellow', name: 'Yellow pigment', color: '#FCD34D', rfValue: 0.85, description: 'Most soluble — travels furthest' },
      { id: 'cyan', name: 'Cyan pigment', color: '#67E8F9', rfValue: 0.68, description: 'Moderately soluble' },
      { id: 'magenta', name: 'Magenta pigment', color: '#F472B6', rfValue: 0.52, description: 'Moderate solubility' },
      { id: 'blue', name: 'Blue pigment', color: '#60A5FA', rfValue: 0.35, description: 'Least soluble — stays low' },
    ],
  },
  {
    id: 'spinach',
    name: 'Spinach Extract',
    label: 'Plant Extract',
    description: 'Leaf pigments can be separated. Chlorophylls and carotenoids have different Rf values.',
    waecContext: 'WAEC tests: "Why do different pigments separate?" Because they have different solubilities in the solvent.',
    pigments: [
      { id: 'carotene', name: 'Beta-carotene', color: '#FB923C', rfValue: 0.92, description: 'Orange — most soluble carotenoid' },
      { id: 'xanthophyll', name: 'Xanthophyll', color: '#FDE047', rfValue: 0.71, description: 'Yellow pigment' },
      { id: 'chla', name: 'Chlorophyll a', color: '#4ADE80', rfValue: 0.45, description: 'Bright green — most abundant' },
      { id: 'chlb', name: 'Chlorophyll b', color: '#166534', rfValue: 0.28, description: 'Dark green — least soluble' },
    ],
  },
  {
    id: 'food',
    name: 'Food Dye Mix',
    label: 'Food Dyes',
    description: 'A mixture of food dyes found in coloured sweets. Used to check if food colouring is pure.',
    waecContext: 'Chromatography is used in forensics, food science, and pharmaceutical industries to test purity.',
    pigments: [
      { id: 'red102', name: 'Red dye', color: '#EF4444', rfValue: 0.78, description: 'High Rf — very soluble' },
      { id: 'orange', name: 'Orange dye', color: '#FB923C', rfValue: 0.62, description: 'Moderately soluble' },
      { id: 'green', name: 'Green dye', color: '#22C55E', rfValue: 0.41, description: 'Lower solubility' },
    ],
  },
  {
    id: 'unknown',
    name: 'Unknown Mixture X',
    label: 'Unknown X',
    description: 'An unknown mixture. Run chromatography and compare Rf values with known references to identify components.',
    waecContext: 'WAEC question type: "Identify the components of mixture X using the chromatogram below."',
    pigments: [
      { id: 'comp1', name: 'Component 1 (Yellow)', color: '#FCD34D', rfValue: 0.80, description: 'Rf = 0.80 — matches reference yellow' },
      { id: 'comp2', name: 'Component 2 (Blue)', color: '#3B82F6', rfValue: 0.50, description: 'Rf = 0.50 — matches reference blue' },
      { id: 'comp3', name: 'Component 3 (Red)', color: '#EF4444', rfValue: 0.25, description: 'Rf = 0.25 — matches reference red' },
    ],
  },
];

// ─── SVG Chromatography Paper ─────────────────────────────────────────────────

interface ChromatogramProps {
  ink: Ink;
  solventLevel: number;   // 0–1, how high solvent has risen
  spotsVisible: boolean;
  spotsRevealed: boolean;
  solventRunning: boolean;
}

function ChromatogramSVG({ ink, solventLevel, spotsVisible, spotsRevealed, solventRunning }: ChromatogramProps) {
  // Paper dimensions in SVG units
  const paperTop = 20;
  const paperBottom = 320;
  const paperHeight = paperBottom - paperTop;
  const baselineY = paperBottom - 30;  // baseline where ink spot is drawn
  const solventFrontY = baselineY - solventLevel * (baselineY - paperTop - 20); // solvent front rises from baseline

  return (
    <svg viewBox="0 0 200 360" className="w-full max-w-[180px] mx-auto" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}>
      {/* Beaker */}
      <rect x={20} y={280} width={160} height={60} rx={4} fill="rgba(15,23,42,0.8)" stroke="#334155" strokeWidth={1.5} />
      {/* Solvent in beaker */}
      <rect x={22} y={305} width={156} height={33} rx={2} fill="rgba(186,230,253,0.25)" />
      <text x={100} y={330} textAnchor="middle" fill="#64748B" fontSize={7} fontFamily="monospace">SOLVENT</text>

      {/* Chromatography paper — white/cream */}
      <rect x={70} y={paperTop} width={60} height={paperHeight} rx={2}
        fill="#FFFBEB" stroke="#D1D5DB" strokeWidth={1} />

      {/* Solvent front (animated rising line) */}
      {solventRunning && solventLevel > 0.02 && (
        <motion.line
          x1={70} y1={solventFrontY} x2={130} y2={solventFrontY}
          stroke="#60A5FA"
          strokeWidth={1.5}
          strokeDasharray="3 2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Solvent front label */}
      {solventRunning && solventLevel > 0.08 && (
        <text x={135} y={solventFrontY + 3} fill="#60A5FA" fontSize={6} fontFamily="monospace">SF</text>
      )}

      {/* Solvent soaking line in paper */}
      {solventRunning && solventLevel > 0 && (
        <rect
          x={71} y={solventFrontY}
          width={58} height={baselineY - solventFrontY}
          fill="rgba(186,230,253,0.3)"
          rx={1}
        />
      )}

      {/* Baseline */}
      <line x1={70} y1={baselineY} x2={130} y2={baselineY} stroke="#9CA3AF" strokeWidth={0.8} strokeDasharray="2 2" />
      <text x={135} y={baselineY + 3} fill="#9CA3AF" fontSize={6} fontFamily="monospace">BL</text>

      {/* Original ink spot at baseline */}
      {spotsVisible && (
        <circle cx={100} cy={baselineY} r={5} fill="#1E293B" opacity={0.7} />
      )}

      {/* Separated pigment spots (appear as solvent passes through them) */}
      {ink.pigments.map((pigment) => {
        // spot Y position = baseline - rfValue * (solventFront - baseline)
        const spotY = baselineY - pigment.rfValue * (baselineY - paperTop - 20);
        const solventFrontAbsolute = baselineY - solventLevel * (baselineY - paperTop - 20);
        // spot appears when solvent front passes it
        const spotVisible = spotsRevealed || (solventRunning && solventFrontAbsolute <= spotY + 10);

        return spotVisible ? (
          <motion.g key={pigment.id}>
            <motion.ellipse
              cx={100} cy={spotY}
              rx={7} ry={4.5}
              fill={pigment.color}
              opacity={0.85}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
            {/* Rf label on right */}
            {spotsRevealed && (
              <motion.text
                x={132} y={spotY + 3}
                fill="#94A3B8" fontSize={5.5} fontFamily="monospace"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              >
                Rf={pigment.rfValue.toFixed(2)}
              </motion.text>
            )}
          </motion.g>
        ) : null;
      })}

      {/* Paper clip at top */}
      <rect x={95} y={paperTop - 8} width={10} height={12} rx={2} fill="#94A3B8" />
      <rect x={97} y={paperTop - 8} width={2} height={12} rx={1} fill="#64748B" />
      <rect x={101} y={paperTop - 8} width={2} height={12} rx={1} fill="#64748B" />
    </svg>
  );
}

// ─── Rf Calculation Component ─────────────────────────────────────────────────

interface RfCalcProps {
  pigment: Pigment;
  baselineToFront: number;  // total distance solvent traveled (cm)
}

function RfCalculation({ pigment, baselineToFront }: RfCalcProps) {
  const distanceTraveled = +(pigment.rfValue * baselineToFront).toFixed(1);
  return (
    <div className="rounded-xl p-3 border mb-3"
      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: pigment.color }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{pigment.name}</span>
      </div>
      <div className="text-xs font-mono space-y-1 pl-5" style={{ color: 'var(--muted)' }}>
        <p>Distance of spot from baseline: <span style={{ color: 'var(--text)' }}>{distanceTraveled} cm</span></p>
        <p>Distance of solvent front: <span style={{ color: 'var(--text)' }}>{baselineToFront} cm</span></p>
        <div className="mt-2 p-2 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p style={{ color: 'var(--accent)' }}>
            Rf = {distanceTraveled} ÷ {baselineToFront} = <strong>{pigment.rfValue.toFixed(2)}</strong>
          </p>
        </div>
        <p className="text-[10px] italic pt-1">{pigment.description}</p>
      </div>
    </div>
  );
}

// ─── Phases ───────────────────────────────────────────────────────────────────

type Phase = 'select' | 'spot' | 'develop' | 'results' | 'calculate' | 'complete';
const PHASES: Phase[] = ['select', 'spot', 'develop', 'results', 'calculate', 'complete'];

const slideVariants: Variants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.25 } },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChromatographyPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [spotDone, setSpotDone] = useState(false);
  const [solventLevel, setSolventLevel] = useState(0);
  const [developing, setDeveloping] = useState(false);
  const [developDone, setDevelopDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ink = INKS.find(i => i.id === selectedId) ?? null;
  const phaseIndex = PHASES.indexOf(phase);

  const startDevelop = useCallback(() => {
    setDeveloping(true);
    setSolventLevel(0);
    timerRef.current = setInterval(() => {
      setSolventLevel(prev => {
        const next = prev + 0.008;
        if (next >= 1) {
          clearInterval(timerRef.current!);
          setDeveloping(false);
          setDevelopDone(true);
          setTimeout(() => setPhase('results'), 600);
          return 1;
        }
        return next;
      });
    }, 80);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('select');
    setSelectedId(null);
    setSpotDone(false);
    setSolventLevel(0);
    setDeveloping(false);
    setDevelopDone(false);
  };

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
          <Layers className="w-4 h-4" style={{ color: '#A78BFA' }} />
          <span className="font-mono text-sm font-semibold tracking-wider" style={{ color: '#A78BFA' }}>
            Chromatography
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
                background: i < phaseIndex ? '#4ADE80' : i === phaseIndex ? '#A78BFA' : 'var(--border)',
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

          {/* ── SELECT ─────────────────────────────────────────────── */}
          {phase === 'select' && (
            <motion.div key="select" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Paper Chromatography</h1>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--muted)' }}>
                Separate a mixture into its components using a solvent moving up chromatography paper.
                Different substances travel different distances because of their different solubilities.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 mb-6">
                {INKS.map(ink => (
                  <button
                    key={ink.id}
                    onClick={() => { setSelectedId(ink.id); setPhase('spot'); }}
                    className="text-left rounded-2xl p-4 border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                    style={{ background: 'rgba(167,139,250,0.06)', borderColor: 'rgba(167,139,250,0.2)' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono mb-2"
                          style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA' }}>
                          {ink.label}
                        </span>
                        <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{ink.name}</p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{ink.description}</p>
                    <p className="text-[11px] font-mono mt-2" style={{ color: '#A78BFA' }}>
                      {ink.pigments.length} components to separate
                    </p>
                  </button>
                ))}
              </div>

              {/* Theory box */}
              <div className="rounded-xl p-4 border text-xs space-y-1.5"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)', color: 'var(--muted)' }}>
                <p className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>How it works</p>
                <p>1. Spot the mixture on the baseline — pencil line near the bottom of the paper.</p>
                <p>2. Place paper in solvent — solvent level must be <strong>below the baseline</strong>.</p>
                <p>3. Solvent rises by capillary action, carrying components with it.</p>
                <p>4. Components with higher solubility in the solvent travel further.</p>
                <p>5. Mark the solvent front, measure distances, calculate Rf values.</p>
                <div className="mt-3 p-2 rounded font-mono text-center text-xs"
                  style={{ background: 'rgba(167,139,250,0.1)', color: '#A78BFA' }}>
                  Rf = distance traveled by spot ÷ distance traveled by solvent front
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SPOT ───────────────────────────────────────────────── */}
          {phase === 'spot' && ink && (
            <motion.div key="spot" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <p className="text-xs font-mono mb-1" style={{ color: '#A78BFA' }}>STEP 1 · SPOT THE SAMPLE</p>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Apply ink spot to baseline
              </h2>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <ChromatogramSVG
                    ink={ink}
                    solventLevel={0}
                    spotsVisible={spotDone}
                    spotsRevealed={false}
                    solventRunning={false}
                  />
                </div>

                <div className="flex-1 space-y-3 pt-4">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                    Draw a pencil baseline <strong>2 cm from the bottom</strong> of the chromatography paper.
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                    Use a capillary tube to spot a small amount of <strong>{ink.name}</strong> on the baseline. Allow it to dry.
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                    The spot must be small (≤3 mm) and concentrated, or the bands will be fuzzy.
                  </p>

                  {!spotDone ? (
                    <motion.button
                      onClick={() => setSpotDone(true)}
                      className="w-full py-3 rounded-xl font-semibold text-sm mt-3"
                      style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.3)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Apply Spot to Baseline
                    </motion.button>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex items-center gap-2 text-sm mb-3" style={{ color: '#4ADE80' }}>
                        <CheckCircle className="w-4 h-4" />
                        Spot applied — allow to dry
                      </div>
                      <button
                        onClick={() => setPhase('develop')}
                        className="w-full py-3 rounded-xl font-bold text-sm"
                        style={{ background: '#A78BFA', color: '#0F172A' }}
                      >
                        Place in Solvent →
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── DEVELOP ────────────────────────────────────────────── */}
          {phase === 'develop' && ink && (
            <motion.div key="develop" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <p className="text-xs font-mono mb-1" style={{ color: '#A78BFA' }}>STEP 2 · RUN THE CHROMATOGRAM</p>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Solvent rising...
              </h2>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <ChromatogramSVG
                    ink={ink}
                    solventLevel={solventLevel}
                    spotsVisible={true}
                    spotsRevealed={developDone}
                    solventRunning={developing || developDone}
                  />
                </div>

                <div className="flex-1 pt-4 space-y-4">
                  {!developing && !developDone && (
                    <>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                        Lower the paper into the solvent. The solvent level must be <strong>below the baseline</strong>.
                      </p>
                      <p className="text-sm" style={{ color: 'var(--muted)' }}>
                        Cover with a lid and wait for the solvent to rise to near the top of the paper.
                      </p>
                      <button
                        onClick={() => { setPhase('develop'); startDevelop(); }}
                        className="w-full py-3 rounded-xl font-bold text-sm"
                        style={{ background: '#A78BFA', color: '#0F172A' }}
                      >
                        Start Development →
                      </button>
                    </>
                  )}

                  {developing && (
                    <>
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#A78BFA' }}>
                        <motion.div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: '#A78BFA' }}
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                        Solvent rising... ({Math.round(solventLevel * 100)}%)
                      </div>
                      <div className="rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: '#A78BFA', width: `${solventLevel * 100}%` }}
                        />
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        Watch the solvent front rise. Components with higher solubility will move further up the paper.
                      </p>
                    </>
                  )}

                  {developDone && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex items-center gap-2 text-sm mb-2" style={{ color: '#4ADE80' }}>
                        <CheckCircle className="w-4 h-4" />
                        Development complete!
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        Mark the solvent front immediately with a pencil before it dries.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── RESULTS ────────────────────────────────────────────── */}
          {phase === 'results' && ink && (
            <motion.div key="results" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <p className="text-xs font-mono mb-1" style={{ color: '#A78BFA' }}>STEP 3 · READ THE CHROMATOGRAM</p>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                {ink.pigments.length} components separated!
              </h2>

              <div className="flex gap-6 items-start mb-5">
                <div className="flex-shrink-0">
                  <ChromatogramSVG
                    ink={ink}
                    solventLevel={1}
                    spotsVisible={true}
                    spotsRevealed={true}
                    solventRunning={false}
                  />
                </div>

                <div className="flex-1 pt-2 space-y-2">
                  {ink.pigments.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 border"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)' }}
                    >
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{p.name}</p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>Rf = {p.rfValue.toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* WAEC context note */}
              <div className="rounded-xl p-4 border mb-5 flex gap-3"
                style={{ background: 'rgba(167,139,250,0.06)', borderColor: 'rgba(167,139,250,0.2)' }}>
                <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#A78BFA' }} />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{ink.waecContext}</p>
              </div>

              <button
                onClick={() => setPhase('calculate')}
                className="w-full py-3.5 rounded-xl font-bold text-sm"
                style={{ background: '#A78BFA', color: '#0F172A' }}
              >
                <Calculator className="w-4 h-4 inline mr-2" />
                Calculate Rf Values →
              </button>
            </motion.div>
          )}

          {/* ── CALCULATE ──────────────────────────────────────────── */}
          {phase === 'calculate' && ink && (
            <motion.div key="calculate" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <p className="text-xs font-mono mb-1" style={{ color: '#A78BFA' }}>STEP 4 · Rf CALCULATIONS</p>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Calculate Rf Values</h2>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--muted)' }}>
                Rf (retardation factor) has no units and is always between 0 and 1. It is constant for a given compound in a given solvent.
              </p>

              {/* Formula box */}
              <div className="rounded-xl p-4 border mb-5 text-center"
                style={{ background: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.3)' }}>
                <p className="text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>FORMULA</p>
                <p className="text-base font-mono font-bold" style={{ color: '#A78BFA' }}>
                  Rf = distance traveled by spot (cm) ÷ distance traveled by solvent front (cm)
                </p>
                <p className="text-xs font-mono mt-1" style={{ color: 'var(--muted)' }}>
                  (both measured from the baseline)
                </p>
              </div>

              {/* Worked examples — assume solvent front = 10 cm */}
              <p className="text-xs font-mono mb-3" style={{ color: 'var(--muted)' }}>
                WORKED EXAMPLES — Solvent front: 10.0 cm from baseline
              </p>

              {ink.pigments.map(p => (
                <RfCalculation key={p.id} pigment={p} baselineToFront={10.0} />
              ))}

              {/* Identification note for unknown */}
              {ink.id === 'unknown' && (
                <div className="rounded-xl p-4 border mt-4 mb-4"
                  style={{ background: 'rgba(250,204,21,0.06)', borderColor: 'rgba(250,204,21,0.2)' }}>
                  <p className="text-xs font-mono mb-2" style={{ color: '#FCD34D' }}>IDENTIFICATION</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                    Compare Rf values with known reference compounds run alongside. A matching Rf value in the same solvent
                    indicates the same compound. Two compounds with different Rf values in the same solvent are definitely
                    different substances.
                  </p>
                </div>
              )}

              <button
                onClick={() => setPhase('complete')}
                className="w-full py-3.5 rounded-xl font-bold text-sm"
                style={{ background: '#4ADE80', color: '#0F172A' }}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Complete Experiment
              </button>
            </motion.div>
          )}

          {/* ── COMPLETE ───────────────────────────────────────────── */}
          {phase === 'complete' && ink && (
            <motion.div key="complete" variants={slideVariants} initial="enter" animate="center" exit="exit">
              <motion.div
                className="text-center py-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🌈
                </motion.div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Experiment Complete!</h2>
                <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
                  You separated {ink.name} into {ink.pigments.length} components
                </p>
              </motion.div>

              {/* Summary */}
              <div className="rounded-xl border overflow-hidden mb-5" style={{ borderColor: 'var(--border)' }}>
                <div className="px-4 py-3 border-b text-xs font-mono font-semibold"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'var(--border)', color: 'var(--muted)' }}>
                  CHROMATOGRAM RESULTS — {ink.name.toUpperCase()}
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {ink.pigments.map(p => (
                    <div key={p.id} className="flex items-center gap-4 px-4 py-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                      <span className="text-sm flex-1" style={{ color: 'var(--text)' }}>{p.name}</span>
                      <span className="text-sm font-mono" style={{ color: '#A78BFA' }}>Rf = {p.rfValue.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key points */}
              <div className="rounded-xl p-4 border mb-5 text-xs space-y-1.5"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)', color: 'var(--muted)' }}>
                <p className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>Key Points to Remember</p>
                <p>• Rf value has no units — it is always between 0 and 1</p>
                <p>• Same compound has same Rf in same solvent</p>
                <p>• A pure substance gives ONE spot; a mixture gives multiple spots</p>
                <p>• Solvent front must be marked before paper is removed from solvent</p>
                <p>• Pencil (not pen) is used for the baseline — pen would dissolve in solvent</p>
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
                  style={{ background: '#A78BFA', color: '#0F172A' }}
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
