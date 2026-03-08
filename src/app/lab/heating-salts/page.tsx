'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, RotateCcw, CheckCircle } from 'lucide-react';

const SALTS = [
  {
    id: 'cuso4-h',
    name: 'Hydrated Copper(II) Sulfate',
    formula: 'CuSO₄·5H₂O',
    startColor: '#3B82F6',
    startDesc: 'Blue crystals',
    stages: [
      { temp: 'gentle', color: '#93C5FD', desc: 'Colour fades to pale blue', gas: 'steam', gasColor: 'rgba(200,230,255,0.6)', observation: 'Solid becomes paler; water droplets form on cooler part of test tube' },
      { temp: 'hot', color: '#F1F5F9', desc: 'White anhydrous powder', gas: 'steam', gasColor: 'rgba(200,230,255,0.6)', observation: 'White powder remains; test tube wall shows water condensation' },
    ],
    equation: 'CuSO₄·5H₂O(s)  →  CuSO₄(s)  +  5H₂O(g)',
    products: 'Anhydrous CuSO₄ (white) + water vapour',
    reverseTest: 'Add water to white residue → turns BLUE again (test for water)',
    waecNote: 'CuSO₄·5H₂O → white on heating. Re-adding water reverses the change. This is a test for water (blue to white, white to blue).',
  },
  {
    id: 'cuno3',
    name: 'Copper(II) Nitrate',
    formula: 'Cu(NO₃)₂',
    startColor: '#3B82F6',
    startDesc: 'Blue powder/crystals',
    stages: [
      { temp: 'gentle', color: '#1D4ED8', desc: 'Melt and deepen in colour', gas: null, gasColor: null, observation: 'Salt melts to dark blue liquid; begins to bubble' },
      { temp: 'hot', color: '#1C1917', desc: 'Black residue (CuO)', gas: 'brown', gasColor: 'rgba(180,83,9,0.5)', observation: 'Brown fumes (NO₂) given off; black residue remains' },
    ],
    equation: '2Cu(NO₃)₂(s)  →  2CuO(s)  +  4NO₂(g)  +  O₂(g)',
    products: 'CuO (black) + NO₂ (brown gas) + O₂ (gas)',
    reverseTest: 'Test brown gas with damp blue litmus → turns red (acidic NO₂)',
    waecNote: 'Metal nitrates of less reactive metals → metal oxide + NO₂ + O₂. Cu, Pb, etc. follow this pattern.',
  },
  {
    id: 'caco3',
    name: 'Calcium Carbonate',
    formula: 'CaCO₃',
    startColor: '#F8FAFC',
    startDesc: 'White powder (chalk/marble)',
    stages: [
      { temp: 'gentle', color: '#F1F5F9', desc: 'No visible change at low temp', gas: null, gasColor: null, observation: 'No change observed at low temperature — needs strong heat' },
      { temp: 'very hot', color: '#F1F5F9', desc: 'Still white residue (CaO)', gas: 'co2', gasColor: 'rgba(200,200,200,0.4)', observation: 'Colourless gas (CO₂) given off; white quicklime (CaO) remains' },
    ],
    equation: 'CaCO₃(s)  →  CaO(s)  +  CO₂(g)',
    products: 'CaO (quicklime, white) + CO₂ (gas)',
    reverseTest: 'Pass CO₂ into limewater → turns milky',
    waecNote: 'Metal carbonates decompose on heating: MCO₃ → MO + CO₂. Na₂CO₃ and K₂CO₃ are exceptions — too thermally stable to decompose easily.',
  },
  {
    id: 'nh4cl',
    name: 'Ammonium Chloride',
    formula: 'NH₄Cl',
    startColor: '#F1F5F9',
    startDesc: 'White crystalline solid',
    stages: [
      { temp: 'gentle', color: '#F1F5F9', desc: 'Sublimes (no melt)', gas: 'white fumes', gasColor: 'rgba(241,245,249,0.7)', observation: 'White fumes appear above the solid; solid appears to disappear from bottom of tube' },
      { temp: 'hot', color: '#F1F5F9', desc: 'Re-deposits higher up tube', gas: 'white fumes', gasColor: 'rgba(241,245,249,0.7)', observation: 'White solid re-forms on the cooler upper part of tube (sublimation)' },
    ],
    equation: 'NH₄Cl(s)  ⇌  NH₃(g)  +  HCl(g)',
    products: 'NH₃ (gas) + HCl (gas) — re-combine on cooling',
    reverseTest: 'Hold moist red litmus near fumes → turns blue (NH₃ present)',
    waecNote: 'NH₄Cl sublimes — it does not melt. The dissociation is reversible. Products recombine at cooler surface to give white NH₄Cl again.',
  },
  {
    id: 'kno3',
    name: 'Potassium Nitrate',
    formula: 'KNO₃',
    startColor: '#F1F5F9',
    startDesc: 'White crystalline solid',
    stages: [
      { temp: 'gentle', color: '#E2E8F0', desc: 'Melts to colourless liquid', gas: null, gasColor: null, observation: 'Salt melts to clear colourless liquid; no gas at low temperature' },
      { temp: 'hot', color: '#E2E8F0', desc: 'KNO₂ remains (colourless)', gas: 'oxygen', gasColor: 'rgba(122,255,178,0.3)', observation: 'Gas given off (O₂) — relights glowing splint' },
    ],
    equation: '2KNO₃(s)  →  2KNO₂(s)  +  O₂(g)',
    products: 'KNO₂ (potassium nitrite, white) + O₂ (gas)',
    reverseTest: 'Test gas with glowing splint → relights (confirms O₂)',
    waecNote: 'Alkali metal nitrates → metal nitrite + O₂. Compare with Cu(NO₃)₂ → CuO + NO₂ + O₂ (more reactive = more decomposition).',
  },
];

// Bunsen flame SVG
function BunsenFlame({ intensity, flameLevel }: { intensity: number; flameLevel: 'off' | 'gentle' | 'hot' | 'very hot' }) {
  const colors = { off: '#1E3A5F', gentle: '#F97316', hot: '#F59E0B', 'very hot': '#EF4444' };
  const heights = { off: 0, gentle: 30, hot: 50, 'very hot': 70 };
  const h = heights[flameLevel];
  const c = colors[flameLevel];
  return (
    <g>
      {/* Barrel */}
      <rect x="90" y="280" width="20" height="60" rx="4" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      <rect x="88" y="336" width="24" height="6" rx="3" fill="#3d5a70" />
      {/* Base */}
      <rect x="78" y="342" width="44" height="8" rx="3" fill="#3d5a70" />
      {/* Flame */}
      {h > 0 && (
        <>
          <motion.ellipse cx="100" cy={280 - h * 0.6} rx={8} ry={h * 0.6}
            fill={c} opacity={0.5}
            animate={{ ry: [h * 0.55, h * 0.7, h * 0.55], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity }} />
          <motion.ellipse cx="100" cy={280 - h * 0.5} rx={5} ry={h * 0.5}
            fill={c} opacity={0.9}
            animate={{ ry: [h * 0.45, h * 0.55, h * 0.45], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }} />
          <motion.ellipse cx="100" cy={280 - h * 0.35} rx={3} ry={h * 0.35}
            fill={flameLevel === 'very hot' ? '#FDE047' : '#60A5FA'} opacity={0.9}
            animate={{ ry: [h * 0.3, h * 0.38, h * 0.3] }}
            transition={{ duration: 0.5, repeat: Infinity }} />
        </>
      )}
    </g>
  );
}

// Animated test tube being heated
function HeatingScene({
  salt,
  stageIdx,
  heating,
  flameLevel,
}: {
  salt: typeof SALTS[0];
  stageIdx: number;
  heating: boolean;
  flameLevel: 'off' | 'gentle' | 'hot' | 'very hot';
}) {
  const currentStage = salt.stages[stageIdx];
  const solidColor = stageIdx < 0 ? salt.startColor : (salt.stages[stageIdx - 1]?.color ?? salt.startColor);
  const targetColor = currentStage?.color ?? salt.startColor;
  const displayColor = heating || stageIdx > 0 ? targetColor : solidColor;

  return (
    <svg viewBox="0 0 240 400" className="w-full" style={{ maxHeight: 360 }}>
      {/* Bench */}
      <rect x="0" y="370" width="240" height="30" fill="#0d1520" />
      <rect x="0" y="365" width="240" height="8" rx="2" fill="#1a2a3d" />

      {/* Clamp stand */}
      <rect x="18" y="10" width="5" height="355" rx="2" fill="#3d5a70" />
      <rect x="5" y="358" width="32" height="8" rx="2" fill="#3d5a70" />
      <rect x="18" y="50" width="50" height="6" rx="2" fill="#3d5a70" />
      <ellipse cx="68" cy="53" rx="6" ry="6" fill="none" stroke="#3d5a70" strokeWidth="3" />

      {/* Test tube holder (tilted ~45°) */}
      <g transform="rotate(-45, 120, 200)">
        {/* Test tube */}
        <rect x="108" y="100" width="24" height="120" rx="4"
          fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1.2" />
        <ellipse cx="120" cy="220" rx="12" ry="10"
          fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1.2" />
        {/* Salt inside */}
        <motion.rect x="110" y="170" width="20" height="48" rx="2"
          fill={displayColor}
          animate={{ fill: displayColor }}
          transition={{ duration: 1.5 }} />
        <motion.ellipse cx="120" cy="170" rx="10" ry="4"
          fill={displayColor}
          animate={{ fill: displayColor }}
          transition={{ duration: 1.5 }} />
        <motion.ellipse cx="120" cy="218" rx="10.5" ry="9"
          fill={displayColor}
          animate={{ fill: displayColor }}
          transition={{ duration: 1.5 }} />
        {/* Bung */}
        <rect x="111" y="96" width="18" height="8" rx="2" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
        {/* Delivery tube */}
        <line x1="120" y1="96" x2="120" y2="70" stroke="#4FD1FF" strokeWidth="1.5" />
      </g>

      {/* Gas/steam escaping */}
      {heating && currentStage?.gasColor && (
        <>
          {[0, 1, 2, 3].map(i => (
            <motion.circle key={i}
              cx={150 + i * 8} cy={120}
              r={4 + i}
              fill={currentStage.gasColor ?? 'transparent'}
              animate={{ cy: [120, 80, 50], opacity: [0.8, 0.4, 0], r: [3 + i, 6 + i, 2] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
            />
          ))}
        </>
      )}

      {/* Bunsen burner */}
      <BunsenFlame intensity={1} flameLevel={flameLevel} />

      {/* Temperature label */}
      <text x="200" y="300" fill="#F59E0B" fontSize="9" textAnchor="middle" fontWeight="bold">
        {flameLevel === 'off' ? 'No heat' : flameLevel === 'gentle' ? '~200°C' : flameLevel === 'hot' ? '~400°C' : '~800°C'}
      </text>

      {/* Gas label */}
      {heating && currentStage?.gas && (
        <motion.text x="175" y="100" fill="#5a7a99" fontSize="8" textAnchor="middle"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {currentStage.gas === 'steam' ? 'H₂O(g)' : currentStage.gas === 'brown' ? 'NO₂(g)' : currentStage.gas === 'co2' ? 'CO₂(g)' : currentStage.gas === 'oxygen' ? 'O₂(g)' : currentStage.gas}
        </motion.text>
      )}
    </svg>
  );
}

export default function HeatingSaltsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<typeof SALTS[0] | null>(null);
  const [stageIdx, setStageIdx] = useState(-1);
  const [heating, setHeating] = useState(false);
  const [heatingDone, setHeatingDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flameLevel = !heating ? 'off' : (stageIdx === 0 ? 'gentle' : stageIdx === 1 && selected?.id === 'caco3' ? 'very hot' : 'hot');

  function startHeat() {
    if (heatingDone) return;
    setHeating(true);
    timerRef.current = setTimeout(() => {
      setHeating(false);
      setHeatingDone(true);
    }, 3500);
  }

  function nextStage() {
    if (!selected) return;
    const nextIdx = stageIdx + 1;
    setStageIdx(nextIdx);
    setHeating(false);
    setHeatingDone(false);
  }

  function selectSalt(s: typeof SALTS[0]) {
    setSelected(s);
    setStageIdx(0);
    setHeating(false);
    setHeatingDone(false);
  }

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelected(null); setStageIdx(-1); setHeating(false); setHeatingDone(false);
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const currentStage = selected ? selected.stages[stageIdx] : null;
  const isLastStage = selected ? stageIdx >= selected.stages.length - 1 : false;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b"
        style={{ background: 'rgba(8,12,16,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <button onClick={() => router.push('/lab')} className="flex items-center gap-1.5 text-xs font-mono" style={{ color: 'var(--muted)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Lab
        </button>
        <span className="text-xs font-mono font-semibold" style={{ color: '#FCD34D' }}>Heating of Salts</span>
        {selected && <button onClick={reset} className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--muted)' }}><RotateCcw className="w-3 h-3" /> Reset</button>}
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {/* ── SELECTION ──────────────────────────────── */}
          {!selected && (
            <motion.div key="sel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Thermal Decomposition</h1>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Select a salt. Apply heat. Observe what happens — colour change, gas evolved, and residue.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {SALTS.map(s => (
                  <motion.button key={s.id} onClick={() => selectSalt(s)}
                    className="text-left rounded-2xl border p-4 group transition-all"
                    style={{ background: 'rgba(252,211,77,0.03)', borderColor: 'rgba(252,211,77,0.12)' }}
                    whileHover={{ scale: 1.02, borderColor: 'rgba(252,211,77,0.3)' }} whileTap={{ scale: 0.98 }}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg flex-shrink-0"
                        style={{ background: s.startColor, opacity: 0.8, border: '1px solid rgba(255,255,255,0.1)' }} />
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{s.formula}</p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>{s.startDesc}</p>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{s.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-mono" style={{ color: '#FCD34D' }}>{s.stages.length} heating stages</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" style={{ color: 'var(--muted)' }} />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Decomposition summary table */}
              <div className="mt-8 max-w-3xl mx-auto rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(252,211,77,0.15)' }}>
                <div className="px-4 py-2.5 text-xs font-mono font-semibold border-b"
                  style={{ background: 'rgba(252,211,77,0.06)', borderColor: 'rgba(252,211,77,0.15)', color: '#FCD34D' }}>
                  Thermal Decomposition — WAEC Summary
                </div>
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(252,211,77,0.1)' }}>
                      {['Salt', 'Products', 'Gas test'].map(h => (
                        <th key={h} className="px-3 py-2 text-left" style={{ color: 'var(--muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SALTS.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-3 py-2 font-bold" style={{ color: '#FCD34D' }}>{s.formula}</td>
                        <td className="px-3 py-2" style={{ color: 'var(--text)' }}>{s.products}</td>
                        <td className="px-3 py-2" style={{ color: 'var(--muted)' }}>{s.reverseTest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── HEATING EXPERIMENT ─────────────────────── */}
          {selected && stageIdx >= 0 && currentStage && (
            <motion.div key={`heat-${stageIdx}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              className="grid lg:grid-cols-2 gap-6">
              {/* Left: apparatus */}
              <div className="rounded-2xl border p-4"
                style={{ background: 'rgba(13,21,32,0.6)', borderColor: 'rgba(252,211,77,0.15)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-semibold" style={{ color: '#FCD34D' }}>
                    {selected.formula} — Stage {stageIdx + 1}/{selected.stages.length}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{
                      background: heating ? 'rgba(245,158,11,0.15)' : heatingDone ? 'rgba(122,255,178,0.1)' : 'rgba(255,255,255,0.05)',
                      color: heating ? '#F59E0B' : heatingDone ? '#7AFFB2' : 'var(--muted)',
                    }}>
                    {heating ? '🔥 Heating…' : heatingDone ? '✓ Done' : 'Ready'}
                  </span>
                </div>

                <div style={{ height: 340 }}>
                  <HeatingScene salt={selected} stageIdx={stageIdx} heating={heating} flameLevel={flameLevel} />
                </div>

                {/* Stage dots */}
                <div className="flex gap-1.5 mt-2">
                  {selected.stages.map((_, i) => (
                    <div key={i} className="flex-1 h-1 rounded-full"
                      style={{ background: i < stageIdx ? 'rgba(122,255,178,0.5)' : i === stageIdx ? 'rgba(252,211,77,0.7)' : 'rgba(255,255,255,0.08)' }} />
                  ))}
                </div>
              </div>

              {/* Right: observations */}
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
                    Heating: {selected.name}
                  </p>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                    {currentStage.temp === 'gentle' ? 'Gentle heating' : currentStage.temp === 'very hot' ? 'Very strong heating' : 'Strong heating'}
                  </h2>
                </div>

                <div className="rounded-xl border p-4" style={{ borderColor: 'rgba(252,211,77,0.15)' }}>
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>What to expect</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                    {currentStage.desc}
                  </p>
                </div>

                {/* Observation box — reveals after heating */}
                <AnimatePresence>
                  {heatingDone && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(122,255,178,0.2)' }}>
                      <div className="px-4 py-2.5 text-xs font-mono font-semibold border-b"
                        style={{ background: 'rgba(122,255,178,0.06)', borderColor: 'rgba(122,255,178,0.15)', color: '#7AFFB2' }}>
                        Observation &amp; Inference
                      </div>
                      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                        <div className="px-4 py-3">
                          <p className="text-[10px] font-mono mb-1.5" style={{ color: 'var(--muted)' }}>Observation</p>
                          <p className="text-sm" style={{ color: 'var(--text)' }}>{currentStage.observation}</p>
                        </div>
                        <div className="px-4 py-3">
                          <p className="text-[10px] font-mono mb-1.5" style={{ color: 'var(--muted)' }}>Colour change</p>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ background: selected.startColor }} />
                            <span className="text-xs" style={{ color: 'var(--muted)' }}>→</span>
                            <div className="w-4 h-4 rounded border" style={{ background: currentStage.color, borderColor: 'rgba(255,255,255,0.1)' }} />
                            <span className="text-xs" style={{ color: currentStage.color }}>{currentStage.desc}</span>
                          </div>
                        </div>
                        {currentStage.gas && (
                          <div className="px-4 py-3">
                            <p className="text-[10px] font-mono mb-1.5" style={{ color: 'var(--muted)' }}>Gas evolved</p>
                            <p className="text-sm font-mono" style={{ color: '#FB923C' }}>
                              {currentStage.gas === 'steam' ? 'H₂O(g) — water vapour' :
                               currentStage.gas === 'brown' ? 'NO₂(g) — brown fumes (acidic)' :
                               currentStage.gas === 'co2' ? 'CO₂(g) — turns limewater milky' :
                               currentStage.gas === 'oxygen' ? 'O₂(g) — relights glowing splint' :
                               'White fumes (NH₃ + HCl)'}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={heatingDone ? (isLastStage ? undefined : nextStage) : startHeat}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{
                    background: heating ? 'rgba(245,158,11,0.08)' : heatingDone && isLastStage ? 'rgba(122,255,178,0.1)' : 'rgba(245,158,11,0.12)',
                    border: `1px solid ${heating ? 'rgba(245,158,11,0.2)' : heatingDone && isLastStage ? 'rgba(122,255,178,0.3)' : 'rgba(245,158,11,0.3)'}`,
                    color: heating ? 'var(--muted)' : heatingDone && isLastStage ? '#7AFFB2' : '#F59E0B',
                  }}
                  disabled={heating}
                  whileHover={!heating ? { background: heatingDone ? 'rgba(122,255,178,0.15)' : 'rgba(245,158,11,0.18)' } : {}}
                  whileTap={!heating ? { scale: 0.98 } : {}}
                  onClick={heatingDone ? (isLastStage ? () => setStageIdx(-2) : nextStage) : startHeat}>
                  {heating ? 'Heating… wait' : heatingDone ? (isLastStage ? 'See Conclusion' : 'Next Stage →') : '🔥 Apply Heat'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── CONCLUSION ────────────────────────────── */}
          {selected && stageIdx === -2 && (
            <motion.div key="conc" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-4">
              <div className="text-center">
                <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: '#7AFFB2' }} />
                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Decomposition Complete</h2>
              </div>
              <div className="rounded-2xl border p-5" style={{ background: 'rgba(252,211,77,0.04)', borderColor: 'rgba(252,211,77,0.25)' }}>
                <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>Equation</p>
                <p className="text-lg font-bold font-mono mb-2" style={{ color: '#FCD34D' }}>{selected.equation}</p>
                <p className="text-xs font-mono mb-3" style={{ color: 'var(--muted)' }}>Products: {selected.products}</p>
                <div className="rounded-lg p-3"
                  style={{ background: 'rgba(79,209,255,0.06)', border: '1px solid rgba(79,209,255,0.15)' }}>
                  <p className="text-[10px] font-mono mb-1" style={{ color: 'var(--muted)' }}>Confirm gas / reverse test</p>
                  <p className="text-sm" style={{ color: '#4FD1FF' }}>{selected.reverseTest}</p>
                </div>
              </div>
              <div className="rounded-xl p-4 text-xs font-mono leading-relaxed"
                style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D' }}>
                <strong>WAEC Note: </strong>{selected.waecNote}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={reset} className="py-3 rounded-xl font-semibold text-sm border"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--muted)', background: 'transparent' }}>
                  Try Another Salt
                </button>
                <button onClick={() => router.push('/lab/flashcards')}
                  className="py-3 rounded-xl font-semibold text-sm"
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
