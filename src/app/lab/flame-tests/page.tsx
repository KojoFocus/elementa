'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, RotateCcw, Eye, Zap } from 'lucide-react';

const METALS = [
  { id: 'li', symbol: 'Li', name: 'Lithium', salt: 'LiCl', color: '#DC2626', colorName: 'Crimson red', memory: 'Li = Lick a flame of Crimson' },
  { id: 'na', symbol: 'Na', name: 'Sodium', salt: 'NaCl', color: '#F59E0B', colorName: 'Persistent yellow/orange', memory: 'Na = Neon yellow — brightest, most common' },
  { id: 'k', symbol: 'K', name: 'Potassium', salt: 'KCl', color: '#C084FC', colorName: 'Lilac / pale violet', memory: 'K = Kool violet / lilac. View through cobalt blue glass' },
  { id: 'ca', symbol: 'Ca', name: 'Calcium', salt: 'CaCl₂', color: '#B45309', colorName: 'Brick red / orange-red', memory: 'Ca = Calcium = Brick orange. Dimmer than Li/Sr' },
  { id: 'cu', symbol: 'Cu', name: 'Copper', salt: 'CuCl₂', color: '#10B981', colorName: 'Blue-green / verdigris', memory: 'Cu = Copper = Green. Only metal giving GREEN flame' },
  { id: 'sr', symbol: 'Sr', name: 'Strontium', salt: 'SrCl₂', color: '#EF4444', colorName: 'Bright/scarlet red', memory: 'Sr = Scarlet red. Brighter than Calcium' },
  { id: 'ba', symbol: 'Ba', name: 'Barium', salt: 'BaCl₂', color: '#84CC16', colorName: 'Apple green', memory: 'Ba = Banana/apple green. Do not confuse with Cu (blue-green)' },
];

type Stage = 'select' | 'clean-wire' | 'pick-salt' | 'flame' | 'record' | 'quiz';

// Bunsen burner with flame that changes color
function BunsenBurner({ flameColor, intensity }: { flameColor: string; intensity: number }) {
  return (
    <svg viewBox="0 0 140 280" className="w-full" style={{ maxHeight: 250 }}>
      {/* Base */}
      <rect x="40" y="250" width="60" height="12" rx="4" fill="#3d5a70" />
      {/* Barrel */}
      <rect x="55" y="180" width="30" height="75" rx="4" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      {/* Air hole */}
      <ellipse cx="70" cy="220" rx="6" ry="4" fill="#1a2a3d" stroke="#4FD1FF" strokeWidth="0.8" />
      {/* Gas inlet */}
      <line x1="70" y1="255" x2="90" y2="268" stroke="#3d5a70" strokeWidth="4" strokeLinecap="round" />
      {/* Nozzle top */}
      <rect x="58" y="174" width="24" height="8" rx="3" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />

      {/* Outer flame */}
      <motion.ellipse cx="70" cy="138" rx={14 + intensity * 4} ry={40 + intensity * 12}
        fill={flameColor}
        opacity={0.6}
        animate={{
          ry: [38 + intensity * 12, 46 + intensity * 14, 38 + intensity * 12],
          rx: [12 + intensity * 4, 16 + intensity * 5, 12 + intensity * 4],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      {/* Middle flame */}
      <motion.ellipse cx="70" cy="146" rx={9 + intensity * 2} ry={30 + intensity * 8}
        fill={intensity > 0 ? flameColor : '#3B82F6'}
        opacity={0.85}
        animate={{
          ry: [28 + intensity * 8, 34 + intensity * 9, 28 + intensity * 8],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
      />
      {/* Core flame (always blue for Bunsen) */}
      <motion.ellipse cx="70" cy="158" rx="5" ry="18"
        fill={intensity > 0.5 ? flameColor : '#60A5FA'}
        opacity={0.9}
        animate={{ ry: [16, 20, 16], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
      />

      {/* Glow around flame if metal present */}
      {intensity > 0 && (
        <motion.ellipse cx="70" cy="130" rx={30} ry={60}
          fill={flameColor}
          opacity={0}
          animate={{ opacity: [0, 0.2 * intensity, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
    </svg>
  );
}

// Nichrome wire
function NichromeWire({ stage, metalColor }: { stage: Stage; metalColor?: string }) {
  const inFlame = stage === 'flame';
  return (
    <svg viewBox="0 0 80 200" className="w-full" style={{ maxHeight: 180 }}>
      {/* Handle */}
      <rect x="30" y="0" width="20" height="70" rx="4" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      <text x="40" y="38" fill="#5a7a99" fontSize="7" textAnchor="middle">Ni/Cr</text>
      <text x="40" y="50" fill="#5a7a99" fontSize="7" textAnchor="middle">wire</text>

      {/* Wire stem */}
      <line x1="40" y1="70" x2="40" y2="145" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

      {/* Loop/tip */}
      <ellipse cx="40" cy="148" rx="5" ry="5" fill="transparent" stroke="#94A3B8" strokeWidth="2" />

      {/* Salt on wire (appears after pick-salt) */}
      {(stage === 'pick-salt' || stage === 'flame' || stage === 'record') && metalColor && (
        <motion.ellipse cx="40" cy="148" rx="5" ry="4"
          fill={metalColor}
          opacity={0.7}
          initial={{ opacity: 0, r: 2 }} animate={{ opacity: 0.7 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Glow at tip when in flame */}
      {inFlame && metalColor && (
        <motion.ellipse cx="40" cy="148" rx="12" ry="12"
          fill={metalColor}
          opacity={0}
          animate={{ opacity: [0, 0.6, 0.3, 0.7, 0.3, 0] }}
          transition={{ duration: 2, repeat: 2 }}
        />
      )}
    </svg>
  );
}

const STAGE_LABELS: Record<Stage, string> = {
  select: 'Choose a metal salt',
  'clean-wire': 'Clean the wire',
  'pick-salt': 'Pick up the salt',
  flame: 'Observe the flame',
  record: 'Record result',
  quiz: 'Identify the metal',
};

export default function FlameTestsPage() {
  const router = useRouter();
  const [selectedMetal, setSelectedMetal] = useState<typeof METALS[0] | null>(null);
  const [stage, setStage] = useState<Stage>('select');
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [quizGuess, setQuizGuess] = useState<string | null>(null);

  // For quiz mode: pick a random unknown metal
  const [unknownMetal] = useState(() => METALS[Math.floor(Math.random() * METALS.length)]);
  const [showQuizResult, setShowQuizResult] = useState(false);

  function selectMetal(m: typeof METALS[0]) {
    setSelectedMetal(m);
    setStage('clean-wire');
    setQuizGuess(null);
    setShowQuizResult(false);
  }

  function advance() {
    const order: Stage[] = ['select', 'clean-wire', 'pick-salt', 'flame', 'record'];
    const i = order.indexOf(stage);
    if (i < order.length - 1) setStage(order[i + 1]);
  }

  function reset() {
    setSelectedMetal(null);
    setStage('select');
    setQuizGuess(null);
    setShowQuizResult(false);
  }

  const stageIdx = ['clean-wire', 'pick-salt', 'flame', 'record'].indexOf(stage);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b"
        style={{ background: 'rgba(8,12,16,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <button onClick={() => router.push('/lab')} className="flex items-center gap-1.5 text-xs font-mono" style={{ color: 'var(--muted)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Lab
        </button>
        <span className="text-xs font-mono font-semibold" style={{ color: '#FB923C' }}>Flame Tests</span>
        {selectedMetal && (
          <button onClick={reset} className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--muted)' }}>
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {/* ── METAL SELECTION ──────────────────────── */}
          {stage === 'select' && (
            <motion.div key="select" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Flame Tests</h1>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Dip a nichrome wire into a metal salt. Hold in a Bunsen flame. Record the characteristic colour.
                </p>
              </div>

              {/* Metal grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {METALS.map(m => (
                  <motion.button key={m.id} onClick={() => selectMetal(m)}
                    className="rounded-2xl border p-4 text-left transition-all group"
                    style={{ background: `${m.color}08`, borderColor: `${m.color}25` }}
                    whileHover={{ scale: 1.04, borderColor: `${m.color}50` }}
                    whileTap={{ scale: 0.97 }}>
                    {/* Flame preview */}
                    <div className="w-8 h-12 mx-auto mb-2 relative flex items-end justify-center">
                      <motion.div
                        className="w-4 rounded-full"
                        style={{ background: m.color, height: 32, opacity: 0.8 }}
                        animate={{ height: [28, 36, 28], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: METALS.indexOf(m) * 0.2 }}
                      />
                    </div>
                    <p className="font-bold font-mono text-sm text-center" style={{ color: m.color }}>{m.symbol}</p>
                    <p className="text-[10px] text-center" style={{ color: 'var(--muted)' }}>{m.name}</p>
                    <p className="text-[9px] font-mono text-center mt-1" style={{ color: m.color }}>{m.colorName.split(' ')[0]}</p>
                  </motion.button>
                ))}
              </div>

              {/* Quick reference table */}
              <div className="rounded-xl border overflow-hidden max-w-2xl mx-auto"
                style={{ borderColor: 'rgba(251,146,60,0.15)' }}>
                <div className="px-4 py-2.5 text-xs font-mono font-semibold border-b"
                  style={{ background: 'rgba(251,146,60,0.06)', borderColor: 'rgba(251,146,60,0.15)', color: '#FB923C' }}>
                  Flame Test Colour Reference — WAEC
                </div>
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(251,146,60,0.1)' }}>
                      {['Metal', 'Symbol', 'Flame Colour', 'Memory Aid'].map(h => (
                        <th key={h} className="px-3 py-2 text-left" style={{ color: 'var(--muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {METALS.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-3 py-2" style={{ color: 'var(--text)' }}>{m.name}</td>
                        <td className="px-3 py-2">
                          <span className="font-bold" style={{ color: m.color }}>{m.symbol}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: m.color }} />
                            <span style={{ color: m.color }}>{m.colorName}</span>
                          </span>
                        </td>
                        <td className="px-3 py-2" style={{ color: 'var(--muted)' }}>{m.memory.split(' — ')[1] ?? m.memory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── EXPERIMENT STEPS ─────────────────────── */}
          {selectedMetal && stage !== 'select' && (
            <motion.div key={stage} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              className="grid lg:grid-cols-2 gap-6">

              {/* Left: apparatus */}
              <div>
                {/* Step progress */}
                <div className="flex items-center gap-2 mb-4">
                  {['clean-wire', 'pick-salt', 'flame', 'record'].map((s, i) => (
                    <div key={s} className="flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold`}
                        style={{
                          background: i < stageIdx ? 'rgba(122,255,178,0.2)' : i === stageIdx ? `${selectedMetal.color}20` : 'rgba(255,255,255,0.05)',
                          color: i < stageIdx ? '#7AFFB2' : i === stageIdx ? selectedMetal.color : 'var(--muted)',
                          border: i === stageIdx ? `1px solid ${selectedMetal.color}40` : '1px solid transparent',
                        }}>
                        {i < stageIdx ? '✓' : i + 1}
                      </div>
                      {i < 3 && <div className="w-4 h-px" style={{ background: i < stageIdx ? 'rgba(122,255,178,0.3)' : 'rgba(255,255,255,0.06)' }} />}
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border p-4"
                  style={{ background: 'rgba(13,21,32,0.6)', borderColor: `${selectedMetal.color}20` }}>
                  {/* SVG scene */}
                  <div className="flex items-end justify-center gap-6" style={{ height: 260 }}>
                    {/* Wire */}
                    <div style={{ width: 80 }}>
                      <NichromeWire stage={stage} metalColor={selectedMetal.color} />
                    </div>

                    {/* Burner */}
                    <div style={{ width: 140 }}>
                      <BunsenBurner
                        flameColor={stage === 'flame' ? selectedMetal.color : '#3B82F6'}
                        intensity={stage === 'flame' ? 0.9 : 0}
                      />
                    </div>

                    {/* HCl beaker for cleaning */}
                    {stage === 'clean-wire' && (
                      <div className="flex flex-col items-center gap-1" style={{ width: 60 }}>
                        <div className="w-12 h-14 rounded-b-lg border-2 flex items-end justify-center overflow-hidden"
                          style={{ borderColor: '#4FD1FF', background: 'rgba(13,21,32,0.6)' }}>
                          <div className="w-10 h-10 rounded-b" style={{ background: 'rgba(100,200,255,0.25)' }} />
                        </div>
                        <p className="text-[8px] font-mono" style={{ color: '#4FD1FF' }}>conc. HCl</p>
                      </div>
                    )}

                    {/* Salt dish */}
                    {stage === 'pick-salt' && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-14 h-4 rounded-full border"
                          style={{ borderColor: selectedMetal.color, background: `${selectedMetal.color}20` }}>
                          <div className="h-full rounded-full" style={{ background: selectedMetal.color, opacity: 0.4 }} />
                        </div>
                        <p className="text-[8px] font-mono text-center" style={{ color: selectedMetal.color }}>
                          {selectedMetal.salt}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Flame result overlay */}
                  {stage === 'flame' && (
                    <motion.div className="mt-3 text-center"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ background: `${selectedMetal.color}15`, border: `1px solid ${selectedMetal.color}40` }}>
                        <div className="w-3 h-3 rounded-full" style={{ background: selectedMetal.color }} />
                        <span className="text-sm font-bold" style={{ color: selectedMetal.color }}>
                          {selectedMetal.colorName}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right: instructions + data */}
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                    Testing: {selectedMetal.salt}
                  </p>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                    {STAGE_LABELS[stage]}
                  </h2>
                </div>

                <div className="rounded-xl border p-4" style={{ borderColor: `${selectedMetal.color}20` }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={stage}
                      initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                      {stage === 'clean-wire' && (
                        <>
                          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>
                            Dip the nichrome wire in <strong style={{ color: '#4FD1FF' }}>concentrated hydrochloric acid</strong>, then hold it in the Bunsen flame until the flame shows no persistent colour.
                          </p>
                          <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                            Why: Cleans any previous metal contamination from the wire. Previous metals would give a false colour result.
                          </p>
                        </>
                      )}
                      {stage === 'pick-salt' && (
                        <>
                          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>
                            Dip the clean wire into a small quantity of <strong style={{ color: selectedMetal.color }}>{selectedMetal.salt}</strong>. A small amount of salt should adhere to the loop.
                          </p>
                          <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                            Use chloride salts where possible (they are more volatile and give brighter colours). Damp the wire with HCl first if using a solid.
                          </p>
                        </>
                      )}
                      {stage === 'flame' && (
                        <>
                          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>
                            Hold the wire in the hottest part of the Bunsen flame (just above the inner blue cone). Observe the colour <strong style={{ color: selectedMetal.color }}>immediately</strong> — it may only last a second.
                          </p>
                          <div className="rounded-lg p-3"
                            style={{ background: `${selectedMetal.color}10`, border: `1px solid ${selectedMetal.color}30` }}>
                            <p className="text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>Observation:</p>
                            <p className="font-bold text-sm" style={{ color: selectedMetal.color }}>
                              Flame turns {selectedMetal.colorName}
                            </p>
                            <p className="text-xs font-mono mt-1.5" style={{ color: 'var(--muted)' }}>
                              Inference: Presence of {selectedMetal.name} ({selectedMetal.symbol})
                            </p>
                          </div>
                          <p className="text-xs font-mono mt-2" style={{ color: 'var(--muted)' }}>
                            {selectedMetal.id === 'k' && '⚠ Use cobalt blue glass to filter yellow sodium contamination and see the lilac more clearly.'}
                            {selectedMetal.id === 'na' && '⚠ Sodium contamination is common — Na gives such a strong yellow that it masks all other metals.'}
                          </p>
                        </>
                      )}
                      {stage === 'record' && (
                        <>
                          <div className="rounded-lg p-4 mb-3"
                            style={{ background: 'rgba(122,255,178,0.05)', border: '1px solid rgba(122,255,178,0.2)' }}>
                            <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
                              WAEC-style result
                            </p>
                            <table className="w-full text-xs font-mono">
                              <tbody>
                                <tr><td className="py-1" style={{ color: 'var(--muted)' }}>Metal tested:</td><td className="py-1 font-bold" style={{ color: selectedMetal.color }}>{selectedMetal.name} ({selectedMetal.symbol})</td></tr>
                                <tr><td className="py-1" style={{ color: 'var(--muted)' }}>Salt used:</td><td className="py-1" style={{ color: 'var(--text)' }}>{selectedMetal.salt}</td></tr>
                                <tr><td className="py-1" style={{ color: 'var(--muted)' }}>Flame colour:</td><td className="py-1 font-bold" style={{ color: selectedMetal.color }}>{selectedMetal.colorName}</td></tr>
                                <tr><td className="py-1" style={{ color: 'var(--muted)' }}>Inference:</td><td className="py-1" style={{ color: '#7AFFB2' }}>{selectedMetal.symbol} ions confirmed</td></tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="rounded-lg p-3 text-xs font-mono"
                            style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D' }}>
                            <strong>Memory:</strong> {selectedMetal.memory}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {stage !== 'record' ? (
                  <motion.button onClick={advance}
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: `${selectedMetal.color}12`, border: `1px solid ${selectedMetal.color}30`, color: selectedMetal.color }}
                    whileHover={{ background: `${selectedMetal.color}20` }} whileTap={{ scale: 0.98 }}>
                    {stage === 'flame' ? 'Record Observation' : 'Next Step'} <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={reset}
                      className="py-3 rounded-xl font-semibold text-sm border"
                      style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--muted)', background: 'transparent' }}>
                      Test Another
                    </button>
                    <button onClick={() => { setStage('select'); setSelectedMetal(null); setTimeout(() => setStage('quiz' as Stage), 100); }}
                      className="py-3 rounded-xl font-semibold text-sm"
                      style={{ background: `${selectedMetal.color}12`, border: `1px solid ${selectedMetal.color}30`, color: selectedMetal.color }}>
                      Mystery Challenge
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── MYSTERY QUIZ MODE ────────────────────── */}
          {stage === ('quiz' as Stage) && !selectedMetal && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-xl mx-auto">
              <div className="text-center mb-6">
                <Zap className="w-10 h-10 mx-auto mb-2" style={{ color: '#FCD34D' }} />
                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Mystery Metal Challenge</h2>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>An unknown salt is tested in the flame. Identify the metal.</p>
              </div>

              {/* Show just the flame color, not the identity */}
              <div className="rounded-2xl border p-6 mb-5 flex flex-col items-center"
                style={{ background: 'rgba(13,21,32,0.6)', borderColor: `${unknownMetal.color}25` }}>
                <p className="text-xs font-mono mb-4" style={{ color: 'var(--muted)' }}>Flame observation:</p>
                <div className="w-24 mx-auto mb-4">
                  <BunsenBurner flameColor={unknownMetal.color} intensity={1} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ background: `${unknownMetal.color}15`, border: `1px solid ${unknownMetal.color}40` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: unknownMetal.color }} />
                  <span className="font-bold text-sm" style={{ color: unknownMetal.color }}>
                    {unknownMetal.colorName}
                  </span>
                </div>
              </div>

              <p className="text-sm text-center mb-4" style={{ color: 'var(--muted)' }}>Which metal is present?</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {METALS.map(m => (
                  <motion.button key={m.id}
                    onClick={() => { setQuizGuess(m.id); setShowQuizResult(true); }}
                    disabled={showQuizResult}
                    className="py-2.5 rounded-xl text-sm font-semibold font-mono"
                    style={{
                      background: showQuizResult
                        ? m.id === unknownMetal.id ? 'rgba(122,255,178,0.15)' : quizGuess === m.id ? 'rgba(255,100,100,0.1)' : 'rgba(255,255,255,0.02)'
                        : 'rgba(255,255,255,0.03)',
                      border: showQuizResult
                        ? m.id === unknownMetal.id ? '1px solid rgba(122,255,178,0.4)' : quizGuess === m.id ? '1px solid rgba(255,100,100,0.3)' : '1px solid rgba(255,255,255,0.06)'
                        : '1px solid rgba(255,255,255,0.06)',
                      color: showQuizResult
                        ? m.id === unknownMetal.id ? '#7AFFB2' : quizGuess === m.id ? '#FF7EB3' : 'var(--muted)'
                        : 'var(--text)',
                    }}
                    whileHover={!showQuizResult ? { background: `${m.color}10`, borderColor: `${m.color}30` } : {}}
                    whileTap={!showQuizResult ? { scale: 0.97 } : {}}>
                    {m.symbol} — {m.name}
                    {showQuizResult && m.id === unknownMetal.id && ' ✓'}
                  </motion.button>
                ))}
              </div>

              {showQuizResult && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border p-4 mb-4 text-center"
                  style={{
                    background: quizGuess === unknownMetal.id ? 'rgba(122,255,178,0.06)' : 'rgba(255,100,100,0.06)',
                    borderColor: quizGuess === unknownMetal.id ? 'rgba(122,255,178,0.3)' : 'rgba(255,100,100,0.3)',
                  }}>
                  <p className="font-bold mb-1" style={{ color: quizGuess === unknownMetal.id ? '#7AFFB2' : '#FF7EB3' }}>
                    {quizGuess === unknownMetal.id ? '✓ Correct!' : '✗ Not quite'}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    The metal was <strong style={{ color: unknownMetal.color }}>{unknownMetal.name} ({unknownMetal.symbol})</strong> — {unknownMetal.colorName} flame.
                  </p>
                  <p className="text-xs font-mono mt-1.5" style={{ color: 'var(--muted)' }}>{unknownMetal.memory}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button onClick={reset}
                  className="py-3 rounded-xl text-sm font-semibold border"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--muted)', background: 'transparent' }}>
                  Test Metals
                </button>
                <button onClick={() => router.push('/lab/flashcards')}
                  className="py-3 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(252,211,77,0.1)', border: '1px solid rgba(252,211,77,0.25)', color: '#FCD34D' }}>
                  Flashcard Drill
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
