'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FlaskConical, ChevronRight, CheckCircle, RotateCcw, Eye } from 'lucide-react';
import { UNKNOWN_SALTS, CATION_TESTS, ANION_TESTS, type UnknownSalt, type TestResult } from '@/data/waec/saltAnalysis';

// Animated test tube with precipitate
function TestTube({
  liquidColor,
  precipColor,
  hasPrecip,
  precipHeight = 20,
  label,
  size = 'md',
}: {
  liquidColor: string;
  precipColor?: string;
  hasPrecip?: boolean;
  precipHeight?: number;
  label: string;
  size?: 'sm' | 'md';
}) {
  const w = size === 'sm' ? 24 : 32;
  const h = size === 'sm' ? 80 : 110;
  const lh = Math.round(h * 0.6); // liquid height

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={w + 16} height={h + 20} viewBox={`0 0 ${w + 16} ${h + 20}`}>
        {/* Tube body */}
        <rect x="8" y="2" width={w} height={h - 10} rx="2"
          fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1.2" />
        {/* Rounded bottom */}
        <ellipse cx={8 + w / 2} cy={h - 8} rx={w / 2} ry="8"
          fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1.2" />

        {/* Liquid fill */}
        <motion.rect
          x="9.5" y={h - lh - 8}
          width={w - 3} height={lh}
          fill={liquidColor}
          opacity={0.7}
          initial={{ height: 0, y: h - 8 }}
          animate={{ height: lh, y: h - lh - 8 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {/* Liquid bottom fill */}
        <motion.ellipse
          cx={8 + w / 2} cy={h - 8}
          rx={w / 2 - 1.5} ry="6.5"
          fill={liquidColor}
          opacity={0.7}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.8 }}
        />

        {/* Precipitate layer */}
        {hasPrecip && precipColor && (
          <>
            <motion.rect
              x="9.5" y={h - precipHeight - 5}
              width={w - 3} height={precipHeight}
              fill={precipColor}
              opacity={0.9}
              initial={{ height: 0, y: h - 5 }}
              animate={{ height: precipHeight, y: h - precipHeight - 5 }}
              transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
            />
            <motion.ellipse
              cx={8 + w / 2} cy={h - precipHeight - 5}
              rx={w / 2 - 2} ry="3"
              fill={precipColor}
              opacity={0.95}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.95, scaleX: 1 }}
              transition={{ duration: 0.4, delay: 1.8 }}
            />
          </>
        )}

        {/* Top rim */}
        <rect x="6" y="0" width={w + 4} height="5" rx="1"
          fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="0.8" />
      </svg>
      <span className="text-[9px] font-mono text-center leading-tight max-w-[48px]"
        style={{ color: 'var(--muted)' }}>{label}</span>
    </div>
  );
}

// Gas bubble animation
function GasBubbles({ color = 'rgba(200,200,200,0.5)' }: { color?: string }) {
  return (
    <div className="relative w-8 h-16">
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + i * 2,
            height: 4 + i * 2,
            background: color,
            left: 8 + i * 4,
          }}
          animate={{ y: [-60, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

type TestStage = 'select' | 'observe' | 'water' | 'naoh' | 'excess-naoh' | 'heat-naoh' | 'anion' | 'conclude';

const TEST_STAGES: { id: TestStage; label: string; reagent: string }[] = [
  { id: 'observe', label: 'Observe Salt', reagent: 'No reagent — observe the solid' },
  { id: 'water', label: 'Add Water', reagent: 'Distilled water (~5 cm³)' },
  { id: 'naoh', label: 'Add NaOH', reagent: 'Dilute NaOH (a few drops)' },
  { id: 'excess-naoh', label: 'Excess NaOH', reagent: 'Continue adding NaOH in excess' },
  { id: 'heat-naoh', label: 'Heat + NaOH', reagent: 'Heat gently with NaOH' },
  { id: 'anion', label: 'Anion Test', reagent: 'AgNO₃ or BaCl₂ (acidified)' },
  { id: 'conclude', label: 'Conclusion', reagent: 'All data gathered' },
];

interface ObserveResult { observation: string; inference: string; }
type StageData = TestResult | ObserveResult | null;

function getStageData(salt: UnknownSalt, stage: TestStage): StageData {
  switch (stage) {
    case 'observe': return { observation: salt.appearance.description, inference: `Colour and appearance noted. Salt is ${salt.appearance.color.toLowerCase()}.` };
    case 'water': return salt.waterTest;
    case 'naoh': return salt.naohTest;
    case 'excess-naoh': return salt.excessNaohTest;
    case 'heat-naoh': return salt.heatNaohTest ?? null;
    case 'anion': return salt.agno3Test ?? salt.bacl2Test ?? null;
    default: return null;
  }
}

function stagesForSalt(salt: UnknownSalt): TestStage[] {
  const base: TestStage[] = ['observe', 'water', 'naoh', 'excess-naoh'];
  if (salt.heatNaohTest) base.push('heat-naoh');
  base.push('anion', 'conclude');
  return base;
}

function getTestTubeProps(salt: UnknownSalt, stage: TestStage) {
  switch (stage) {
    case 'observe': return { liquidColor: salt.appearance.hex, hasPrecip: false, label: 'Solid' };
    case 'water': return {
      liquidColor: salt.waterTest.color ?? '#E0F2FE',
      hasPrecip: false,
      label: 'In water',
    };
    case 'naoh': return {
      liquidColor: salt.waterTest.color ?? '#E0F2FE',
      precipColor: salt.naohTest.hasPrecipitate ? (salt.naohTest.color ?? '#FFFFFF') : undefined,
      hasPrecip: salt.naohTest.hasPrecipitate ?? false,
      label: '+NaOH',
    };
    case 'excess-naoh': return {
      liquidColor: salt.excessNaohTest.precipitateSoluble
        ? '#E0F2FE'
        : (salt.waterTest.color ?? '#E0F2FE'),
      precipColor: !salt.excessNaohTest.precipitateSoluble ? (salt.naohTest.color ?? '#FFFFFF') : undefined,
      hasPrecip: !salt.excessNaohTest.precipitateSoluble,
      label: 'Excess',
    };
    case 'heat-naoh': return { liquidColor: '#E0F2FE', hasPrecip: false, label: 'Heated' };
    case 'anion': return {
      liquidColor: '#E0F2FE',
      precipColor: '#FFFFFF',
      hasPrecip: true,
      label: 'Anion test',
    };
    default: return { liquidColor: '#E0F2FE', hasPrecip: false, label: '' };
  }
}

export default function SaltAnalysisPage() {
  const router = useRouter();
  const [selectedSalt, setSelectedSalt] = useState<UnknownSalt | null>(null);
  const [stage, setStage] = useState<TestStage>('observe');
  const [completedStages, setCompletedStages] = useState<TestStage[]>([]);

  function selectSalt(salt: UnknownSalt) {
    setSelectedSalt(salt);
    setStage('observe');
    setCompletedStages([]);
  }

  function advanceStage() {
    if (!selectedSalt) return;
    const stages = stagesForSalt(selectedSalt);
    const idx = stages.indexOf(stage);
    setCompletedStages(prev => [...prev.filter(s => s !== stage), stage]);
    if (idx < stages.length - 1) {
      setStage(stages[idx + 1]);
    }
  }

  function reset() {
    setSelectedSalt(null);
    setStage('observe');
    setCompletedStages([]);
  }

  const stageData = selectedSalt ? getStageData(selectedSalt, stage) : null;
  const tubeProps = selectedSalt ? getTestTubeProps(selectedSalt, stage) : null;
  const stages = selectedSalt ? stagesForSalt(selectedSalt) : [];
  const stageIdx = stages.indexOf(stage);
  const isConclude = stage === 'conclude';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b"
        style={{ background: 'rgba(8,12,16,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <button onClick={() => router.push('/lab')} className="flex items-center gap-1.5 text-xs font-mono"
          style={{ color: 'var(--muted)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Lab
        </button>
        <span className="text-xs font-mono font-semibold" style={{ color: '#7AFFB2' }}>
          Qualitative Salt Analysis
        </span>
        {selectedSalt && (
          <button onClick={reset} className="flex items-center gap-1 text-xs font-mono"
            style={{ color: 'var(--muted)' }}>
            <RotateCcw className="w-3 h-3" /> New Salt
          </button>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {/* ── SALT SELECTION ─────────────────────────── */}
          {!selectedSalt && (
            <motion.div key="select" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Unknown Salt Analysis</h1>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Choose a salt. Perform systematic tests. Identify the cation and anion.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {UNKNOWN_SALTS.map(salt => (
                  <motion.button key={salt.id}
                    onClick={() => selectSalt(salt)}
                    className="text-left rounded-2xl border p-5 transition-all group"
                    style={{ background: 'rgba(122,255,178,0.03)', borderColor: 'rgba(122,255,178,0.15)' }}
                    whileHover={{ scale: 1.02, borderColor: 'rgba(122,255,178,0.3)' }}
                    whileTap={{ scale: 0.98 }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${salt.appearance.hex}20`, border: `1px solid ${salt.appearance.hex}40` }}>
                        <div className="w-5 h-5 rounded-full" style={{ background: salt.appearance.hex, opacity: 0.9 }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{salt.label}</p>
                        <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>Unknown substance</p>
                      </div>
                    </div>
                    <div className="text-xs font-mono px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--muted)' }}>
                      Appearance: {salt.appearance.description}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
                        {stages.length - 1} tests required
                      </span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        style={{ color: '#7AFFB2' }} />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Quick reference tables */}
              <div className="mt-10 max-w-4xl mx-auto grid lg:grid-cols-2 gap-5">
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(79,209,255,0.15)' }}>
                  <div className="px-4 py-2.5 text-xs font-mono font-semibold border-b"
                    style={{ background: 'rgba(79,209,255,0.06)', borderColor: 'rgba(79,209,255,0.15)', color: '#4FD1FF' }}>
                    Cation Tests with NaOH
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(79,209,255,0.1)' }}>
                          {['Ion', 'Precipitate', 'Excess NaOH'].map(h => (
                            <th key={h} className="px-3 py-2 text-left" style={{ color: 'var(--muted)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {CATION_TESTS.map(t => (
                          <tr key={t.ion} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td className="px-3 py-2 font-bold" style={{ color: '#4FD1FF' }}>{t.ion}</td>
                            <td className="px-3 py-2" style={{ color: 'var(--muted)' }}>{t.naoh}</td>
                            <td className="px-3 py-2" style={{ color: t.other !== '—' ? '#FB923C' : 'var(--muted)' }}>{t.other || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(122,255,178,0.15)' }}>
                  <div className="px-4 py-2.5 text-xs font-mono font-semibold border-b"
                    style={{ background: 'rgba(122,255,178,0.06)', borderColor: 'rgba(122,255,178,0.15)', color: '#7AFFB2' }}>
                    Anion Tests
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(122,255,178,0.1)' }}>
                          {['Ion', 'Reagent', 'Observation'].map(h => (
                            <th key={h} className="px-3 py-2 text-left" style={{ color: 'var(--muted)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ANION_TESTS.map(t => (
                          <tr key={t.ion} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td className="px-3 py-2 font-bold" style={{ color: '#7AFFB2' }}>{t.ion}</td>
                            <td className="px-3 py-2" style={{ color: 'var(--muted)' }}>{t.reagent}</td>
                            <td className="px-3 py-2" style={{ color: 'var(--text)' }}>{t.observation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TESTING PHASE ──────────────────────────── */}
          {selectedSalt && !isConclude && (
            <motion.div key={`test-${stage}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-6">
              {/* Left: visual */}
              <div>
                {/* Stage progress */}
                <div className="flex gap-1.5 mb-4">
                  {stages.filter(s => s !== 'conclude').map((s, i) => (
                    <div key={s} className="flex-1 h-1 rounded-full"
                      style={{
                        background: completedStages.includes(s)
                          ? 'rgba(122,255,178,0.6)'
                          : s === stage ? 'rgba(122,255,178,0.9)' : 'rgba(255,255,255,0.08)',
                      }} />
                  ))}
                </div>

                {/* Test tube visualisation */}
                <div className="rounded-2xl border p-6 flex flex-col items-center justify-center min-h-64"
                  style={{ background: 'rgba(13,21,32,0.6)', borderColor: 'rgba(122,255,178,0.15)' }}>
                  <p className="text-[10px] font-mono uppercase tracking-widest mb-6" style={{ color: 'var(--muted)' }}>
                    Test tube · {selectedSalt.label}
                  </p>

                  <div className="flex items-end gap-8">
                    {/* Before tube */}
                    {stage !== 'observe' && (
                      <div className="opacity-40">
                        <TestTube
                          liquidColor={selectedSalt.appearance.hex}
                          hasPrecip={false}
                          label="Before"
                          size="sm"
                        />
                      </div>
                    )}

                    {/* Main tube */}
                    {tubeProps && (
                      <motion.div key={stage}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                        <TestTube {...tubeProps} size="md" />
                      </motion.div>
                    )}

                    {/* Gas animation if applicable */}
                    {stageData && 'hasGas' in stageData && stageData.hasGas && (
                      <div className="flex flex-col items-center">
                        <GasBubbles color="rgba(255,220,100,0.5)" />
                        <p className="text-[9px] font-mono mt-1" style={{ color: '#FCD34D' }}>Gas</p>
                      </div>
                    )}
                  </div>

                  {/* Precipitate label */}
                  {tubeProps?.hasPrecip && (
                    <motion.p className="mt-4 text-xs font-mono"
                      style={{ color: '#7AFFB2' }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                      Precipitate formed ↓
                    </motion.p>
                  )}
                  {stage === 'excess-naoh' && selectedSalt.excessNaohTest.precipitateSoluble && (
                    <motion.p className="mt-4 text-xs font-mono"
                      style={{ color: '#FB923C' }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                      Precipitate dissolved in excess NaOH ↑
                    </motion.p>
                  )}
                </div>

                {/* Current reagent badge */}
                <div className="mt-3 px-4 py-2.5 rounded-xl text-xs font-mono"
                  style={{ background: 'rgba(122,255,178,0.06)', border: '1px solid rgba(122,255,178,0.15)', color: '#7AFFB2' }}>
                  <span style={{ color: 'var(--muted)' }}>Reagent: </span>
                  {TEST_STAGES.find(s => s.id === stage)?.reagent}
                </div>
              </div>

              {/* Right: observation table */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold mb-0.5" style={{ color: 'var(--text)' }}>
                    {TEST_STAGES.find(s => s.id === stage)?.label}
                  </h2>
                  <p className="text-sm font-mono" style={{ color: 'var(--muted)' }}>
                    Recording test for {selectedSalt.label}
                  </p>
                </div>

                {stageData && (
                  <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(122,255,178,0.15)' }}>
                    <div className="px-4 py-2.5 text-xs font-mono font-semibold border-b"
                      style={{ background: 'rgba(122,255,178,0.06)', borderColor: 'rgba(122,255,178,0.12)', color: '#7AFFB2' }}>
                      Observation & Inference
                    </div>
                    <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <div className="px-4 py-3">
                        <p className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>
                          Observation
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                          {(stageData as ObserveResult).observation ?? ''}
                        </p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>
                          Inference
                        </p>
                        <p className="text-sm leading-relaxed font-mono" style={{ color: '#7AFFB2' }}>
                          {(stageData as ObserveResult).inference ?? ''}
                        </p>
                      </div>
                      {(stageData as TestResult).gasTest && (
                        <div className="px-4 py-3">
                          <p className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>
                            Confirm gas
                          </p>
                          <p className="text-sm" style={{ color: '#FCD34D' }}>{(stageData as TestResult).gasTest}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Accumulated observations */}
                {completedStages.length > 0 && (
                  <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
                      Tests completed
                    </p>
                    <div className="space-y-1">
                      {completedStages.map(s => (
                        <div key={s} className="flex items-center gap-2 text-xs font-mono"
                          style={{ color: '#7AFFB2' }}>
                          <CheckCircle className="w-3 h-3 flex-shrink-0" />
                          {TEST_STAGES.find(ts => ts.id === s)?.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <motion.button
                  onClick={advanceStage}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{ background: 'rgba(122,255,178,0.1)', border: '1px solid rgba(122,255,178,0.25)', color: '#7AFFB2' }}
                  whileHover={{ background: 'rgba(122,255,178,0.16)' }}
                  whileTap={{ scale: 0.98 }}>
                  {stageIdx < stages.length - 2 ? (
                    <>Next Test <ChevronRight className="w-4 h-4" /></>
                  ) : (
                    <>Draw Conclusion <ChevronRight className="w-4 h-4" /></>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── CONCLUSION ─────────────────────────────── */}
          {selectedSalt && isConclude && (
            <motion.div key="conclude" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-5">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(122,255,178,0.1)', border: '2px solid rgba(122,255,178,0.4)' }}>
                  <Eye className="w-8 h-8" style={{ color: '#7AFFB2' }} />
                </motion.div>
                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Salt Identified!</h2>
              </div>

              {/* Reveal */}
              <div className="rounded-2xl border p-5"
                style={{ background: 'rgba(122,255,178,0.05)', borderColor: 'rgba(122,255,178,0.3)' }}>
                <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
                  Identity of {selectedSalt.label}
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg" style={{ background: selectedSalt.appearance.hex, opacity: 0.8 }} />
                  <div>
                    <p className="text-xl font-bold font-mono" style={{ color: '#7AFFB2' }}>
                      {selectedSalt.formula}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>{selectedSalt.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(79,209,255,0.1)' }}>
                    <p className="text-[10px] font-mono mb-1" style={{ color: 'var(--muted)' }}>Cation</p>
                    <p className="font-bold font-mono" style={{ color: '#4FD1FF' }}>{selectedSalt.cation}</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(122,255,178,0.1)' }}>
                    <p className="text-[10px] font-mono mb-1" style={{ color: 'var(--muted)' }}>Anion</p>
                    <p className="font-bold font-mono" style={{ color: '#7AFFB2' }}>{selectedSalt.anion}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {selectedSalt.conclusion}
                </p>
              </div>

              {/* Full test summary table */}
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="px-4 py-2.5 text-xs font-mono font-semibold border-b"
                  style={{ background: 'rgba(79,209,255,0.05)', borderColor: 'rgba(79,209,255,0.12)', color: '#4FD1FF' }}>
                  WAEC Results Table — {selectedSalt.label}
                </div>
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Test', 'Observation', 'Inference'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left" style={{ color: 'var(--muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { test: 'Appearance', obs: selectedSalt.appearance.description, inf: `Colour noted` },
                      { test: 'Add water', obs: selectedSalt.waterTest.observation, inf: selectedSalt.waterTest.inference },
                      { test: 'Add NaOH (drops)', obs: selectedSalt.naohTest.observation, inf: selectedSalt.naohTest.inference },
                      { test: 'Excess NaOH', obs: selectedSalt.excessNaohTest.observation, inf: selectedSalt.excessNaohTest.inference },
                      ...(selectedSalt.heatNaohTest ? [{ test: 'Heat + NaOH', obs: selectedSalt.heatNaohTest.observation, inf: selectedSalt.heatNaohTest.inference }] : []),
                      ...(selectedSalt.agno3Test ? [{ test: 'HNO₃ + AgNO₃', obs: selectedSalt.agno3Test.observation, inf: selectedSalt.agno3Test.inference }] : []),
                      ...(selectedSalt.bacl2Test ? [{ test: 'HCl + BaCl₂', obs: selectedSalt.bacl2Test.observation, inf: selectedSalt.bacl2Test.inference }] : []),
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-3 py-2 font-semibold" style={{ color: '#4FD1FF' }}>{row.test}</td>
                        <td className="px-3 py-2" style={{ color: 'var(--text)' }}>{row.obs}</td>
                        <td className="px-3 py-2" style={{ color: 'var(--muted)' }}>{row.inf}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={reset}
                  className="py-3 rounded-xl font-semibold text-sm border"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--muted)', background: 'transparent' }}>
                  Try Another Salt
                </button>
                <button onClick={() => router.push('/lab/flashcards')}
                  className="py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'rgba(122,255,178,0.1)', border: '1px solid rgba(122,255,178,0.3)', color: '#7AFFB2' }}>
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
