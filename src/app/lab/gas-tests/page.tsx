'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wind, ChevronRight, ChevronDown } from 'lucide-react';
import { GAS_TESTS, GAS_QUICK_REFERENCE, type GasTest } from '@/data/waec/gasTests';

// Animated gas test apparatus
function GasApparatus({
  gas,
  testIdx,
  playing,
}: {
  gas: GasTest;
  testIdx: number;
  playing: boolean;
}) {
  const test = gas.tests[testIdx];
  const animColor = test?.animColor ?? '#FFFFFF';

  // Different apparatus for different tests
  const isLitmusTest = test?.method.toLowerCase().includes('litmus');
  const isLimewaterTest = test?.method.toLowerCase().includes('limewater');
  const isSplintTest = test?.method.toLowerCase().includes('splint');

  return (
    <svg viewBox="0 0 220 260" className="w-full" style={{ maxHeight: 220 }}>
      {/* Test tube / gas source */}
      <rect x="20" y="60" width="44" height="100" rx="4"
        fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1.2" />
      {/* Gas in tube */}
      <motion.rect x="21.5" y="61.5" width="41" height="97" rx="3"
        fill={gas.color}
        opacity={playing ? 0.4 : 0.15}
        animate={playing ? { opacity: [0.15, 0.4, 0.15] } : { opacity: 0.15 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Rubber bung */}
      <rect x="18" y="55" width="48" height="10" rx="2" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      {/* Delivery tube */}
      <path d="M 42 55 Q 42 30 120 30" fill="none" stroke="#4FD1FF" strokeWidth="2" />

      {/* Gas particles flowing */}
      {playing && [0, 1, 2].map(i => (
        <motion.circle key={i}
          cx="42" cy="55" r="3"
          fill={gas.color}
          opacity={0.7}
          animate={{
            cx: [42, 60, 90, 120],
            cy: [55, 42, 32, 30],
            opacity: [0, 0.8, 0.6, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Litmus paper ── */}
      {isLitmusTest && (
        <g>
          {/* Paper strip */}
          <motion.rect x="110" y="15" width="12" height="45" rx="1"
            fill={playing ? animColor : '#1e40af'}
            animate={playing ? { fill: animColor } : { fill: '#1e40af' }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
          {/* Paper holder */}
          <rect x="112" y="8" width="8" height="10" rx="1" fill="#3d5a70" />
          <line x1="116" y1="8" x2="116" y2="0" stroke="#3d5a70" strokeWidth="1.5" />

          {/* Labels */}
          <text x="130" y="30" fill="#5a7a99" fontSize="8" fontStyle="italic">
            Litmus paper
          </text>
          {playing && (
            <motion.text x="130" y="45" fill={animColor} fontSize="9" fontWeight="bold"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              {test.observation.length > 20 ? 'See result' : test.observation}
            </motion.text>
          )}
        </g>
      )}

      {/* ── Limewater ── */}
      {isLimewaterTest && (
        <g>
          {/* Beaker */}
          <rect x="108" y="15" width="70" height="60" rx="3"
            fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1.2" />
          {/* Liquid */}
          <motion.rect x="110" y="25" width="66" height="48" rx="2"
            fill={playing ? animColor : '#E0F2FE'}
            opacity={0.7}
            animate={playing ? { fill: animColor } : { fill: '#E0F2FE' }}
            transition={{ duration: 1.5, delay: 1 }}
          />
          {/* Bubbles */}
          {playing && [0, 1].map(i => (
            <motion.circle key={i}
              cx={120 + i * 20} cy="65" r="2.5"
              fill="rgba(255,255,255,0.5)"
              animate={{ cy: [65, 30], opacity: [0.5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
          <text x="145" y="88" fill="#5a7a99" fontSize="8" textAnchor="middle" fontStyle="italic">
            limewater
          </text>
          {playing && (
            <motion.text x="145" y="102" fill={animColor} fontSize="9" fontWeight="bold" textAnchor="middle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              turns milky
            </motion.text>
          )}
        </g>
      )}

      {/* ── Splint ── */}
      {isSplintTest && (
        <g>
          {/* Splint stick */}
          <motion.line x1="130" y1="20" x2="110" y2="50"
            stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
          {/* Flame/glow */}
          {playing && (
            <>
              <motion.ellipse cx="131" cy="17" rx="5" ry="8"
                fill="#F97316"
                animate={{ opacity: [0.7, 1, 0.7], scaleY: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.ellipse cx="131" cy="13" rx="3" ry="5"
                fill="#FDE047"
                animate={{ opacity: [0.5, 0.9, 0.5], scaleY: [1, 1.2, 1] }}
                transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
              />
            </>
          )}
          {/* Glowing (not burning) state */}
          {!playing && (
            <motion.ellipse cx="131" cy="17" rx="4" ry="4"
              fill="#F59E0B"
              opacity={0.6}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          <text x="148" y="30" fill="#5a7a99" fontSize="8" fontStyle="italic">
            {test?.method.includes('glowing') ? 'glowing splint' : 'burning splint'}
          </text>
          {playing && (
            <motion.text x="148" y="50" fill={animColor} fontSize="9" fontWeight="bold"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              {test?.method.includes('glowing') ? 'rekindles!' : 'squeaky pop!'}
            </motion.text>
          )}
        </g>
      )}

      {/* ── Generic test (white fumes / colour) ── */}
      {!isLitmusTest && !isLimewaterTest && !isSplintTest && (
        <g>
          {playing && (
            <motion.text x="110" y="40" fill={animColor} fontSize="11" fontWeight="bold"
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 40 }} transition={{ delay: 0.8 }}>
              {test?.observation.split(' ').slice(0, 4).join(' ')}
            </motion.text>
          )}
          {/* Generic indicator */}
          <rect x="110" y="50" width="80" height="40" rx="6"
            fill="rgba(13,21,32,0.6)" stroke="#4FD1FF" strokeWidth="1" />
          <motion.rect x="112" y="52" width="76" height="36" rx="5"
            fill={playing ? animColor : 'rgba(255,255,255,0.05)'}
            opacity={0.5}
            animate={playing ? { fill: animColor, opacity: 0.6 } : { fill: 'rgba(255,255,255,0.05)', opacity: 0.1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <text x="150" y="75" fill="#5a7a99" fontSize="8" textAnchor="middle" fontStyle="italic">
            test reagent
          </text>
        </g>
      )}

      {/* Gas label */}
      <text x="42" y="172" fill={gas.color} fontSize="14" fontWeight="bold" textAnchor="middle">
        {gas.formula}
      </text>
      <text x="42" y="185" fill="#5a7a99" fontSize="7" textAnchor="middle">
        {gas.smell}
      </text>
    </svg>
  );
}

export default function GasTestsPage() {
  const router = useRouter();
  const [selectedGas, setSelectedGas] = useState<GasTest | null>(null);
  const [selectedTestIdx, setSelectedTestIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showReference, setShowReference] = useState(false);

  function selectGas(gas: GasTest) {
    setSelectedGas(gas);
    setSelectedTestIdx(0);
    setPlaying(false);
  }

  function runTest() {
    setPlaying(true);
    setTimeout(() => setPlaying(false), 4000);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b"
        style={{ background: 'rgba(8,12,16,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <button onClick={() => router.push('/lab')} className="flex items-center gap-1.5 text-xs font-mono"
          style={{ color: 'var(--muted)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Lab
        </button>
        <span className="text-xs font-mono font-semibold" style={{ color: '#FB923C' }}>
          Gas Tests
        </span>
        <button onClick={() => setShowReference(r => !r)}
          className="flex items-center gap-1 text-xs font-mono"
          style={{ color: 'var(--muted)' }}>
          Quick Ref <ChevronDown className={`w-3 h-3 transition-transform ${showReference ? 'rotate-180' : ''}`} />
        </button>
      </header>

      {/* Quick reference table collapsible */}
      <AnimatePresence>
        {showReference && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b"
            style={{ borderColor: 'rgba(251,146,60,0.15)', background: 'rgba(251,146,60,0.04)' }}>
            <div className="max-w-5xl mx-auto px-4 py-4 overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(251,146,60,0.15)' }}>
                    {['Gas', 'Test Method', 'Positive Result'].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: '#FB923C' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {GAS_QUICK_REFERENCE.map(r => (
                    <tr key={r.gas} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="px-3 py-1.5 font-bold" style={{ color: 'var(--text)' }}>{r.gas}</td>
                      <td className="px-3 py-1.5" style={{ color: 'var(--muted)' }}>{r.test}</td>
                      <td className="px-3 py-1.5 font-semibold" style={{ color: '#7AFFB2' }}>{r.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--text)' }}>
            Laboratory Gas Tests
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Select a gas · choose the test · watch what happens
          </p>
        </div>

        {/* Gas selector grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {GAS_TESTS.map(gas => (
            <motion.button key={gas.id}
              onClick={() => selectGas(gas)}
              className="rounded-xl border p-3 text-left transition-all"
              style={{
                background: selectedGas?.id === gas.id ? `${gas.color}10` : 'rgba(255,255,255,0.02)',
                borderColor: selectedGas?.id === gas.id ? `${gas.color}50` : 'rgba(255,255,255,0.08)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              <div className="text-xl mb-1.5">{gas.icon}</div>
              <p className="font-bold font-mono text-sm" style={{ color: selectedGas?.id === gas.id ? gas.color : 'var(--text)' }}>
                {gas.formula}
              </p>
              <p className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>{gas.name}</p>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedGas && (
            <motion.div key={selectedGas.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-6">
              {/* Left: apparatus animation */}
              <div>
                <div className="rounded-2xl border p-5"
                  style={{ background: 'rgba(13,21,32,0.6)', borderColor: `${selectedGas.color}25` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{selectedGas.icon}</span>
                    <div>
                      <h2 className="font-bold font-mono" style={{ color: selectedGas.color }}>
                        {selectedGas.formula} — {selectedGas.name}
                      </h2>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        {selectedGas.appearance} · {selectedGas.smell}
                      </p>
                    </div>
                  </div>

                  {/* Test selector (if multiple tests) */}
                  {selectedGas.tests.length > 1 && (
                    <div className="flex gap-2 mb-4">
                      {selectedGas.tests.map((t, i) => (
                        <button key={i}
                          onClick={() => { setSelectedTestIdx(i); setPlaying(false); }}
                          className="text-xs font-mono px-3 py-1 rounded-lg border"
                          style={{
                            background: selectedTestIdx === i ? `${selectedGas.color}15` : 'transparent',
                            borderColor: selectedTestIdx === i ? `${selectedGas.color}40` : 'rgba(255,255,255,0.08)',
                            color: selectedTestIdx === i ? selectedGas.color : 'var(--muted)',
                          }}>
                          Test {i + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  <GasApparatus
                    gas={selectedGas}
                    testIdx={selectedTestIdx}
                    playing={playing}
                  />

                  <motion.button
                    onClick={runTest}
                    disabled={playing}
                    className="w-full mt-4 py-3 rounded-xl font-semibold text-sm"
                    style={{
                      background: playing ? `${selectedGas.color}08` : `${selectedGas.color}12`,
                      border: `1px solid ${selectedGas.color}${playing ? '20' : '35'}`,
                      color: playing ? 'var(--muted)' : selectedGas.color,
                    }}
                    whileHover={!playing ? { background: `${selectedGas.color}20` } : {}}
                    whileTap={!playing ? { scale: 0.97 } : {}}>
                    {playing ? 'Running test…' : '▶  Run This Test'}
                  </motion.button>
                </div>
              </div>

              {/* Right: test details */}
              <div className="space-y-4">
                {/* Selected test */}
                <div className="rounded-xl border p-4"
                  style={{ borderColor: `${selectedGas.color}25`, background: `${selectedGas.color}05` }}>
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
                    Test Method
                  </p>
                  <p className="text-sm mb-3" style={{ color: 'var(--text)' }}>
                    {selectedGas.tests[selectedTestIdx]?.method}
                  </p>
                  <div className="rounded-lg p-3 mb-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>
                      Observation
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                      {selectedGas.tests[selectedTestIdx]?.observation}
                    </p>
                  </div>
                  <div className="rounded-lg p-3"
                    style={{ background: `${selectedGas.color}08`, border: `1px solid ${selectedGas.color}20` }}>
                    <p className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--muted)' }}>
                      Confirms
                    </p>
                    <p className="text-sm font-mono" style={{ color: selectedGas.color }}>
                      {selectedGas.tests[selectedTestIdx]?.result}
                    </p>
                  </div>
                </div>

                {/* Sources / preparation */}
                <div className="rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
                    How it is Produced in the Lab
                  </p>
                  {selectedGas.sources.map((src, i) => (
                    <div key={i} className="flex gap-2 mb-1.5">
                      <span className="text-xs mt-0.5" style={{ color: selectedGas.color }}>→</span>
                      <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{src}</p>
                    </div>
                  ))}
                </div>

                {/* All tests summary for this gas */}
                {selectedGas.tests.length > 1 && (
                  <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="px-4 py-2 text-[10px] font-mono font-semibold border-b"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)', color: 'var(--muted)' }}>
                      All tests for {selectedGas.formula}
                    </div>
                    {selectedGas.tests.map((t, i) => (
                      <div key={i} className="px-4 py-2.5 text-xs border-b last:border-0"
                        style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                        <p className="font-semibold mb-0.5" style={{ color: 'var(--text)' }}>Test {i + 1}: {t.method.split(' ').slice(0, 6).join(' ')}…</p>
                        <p style={{ color: selectedGas.color }}>→ {t.observation}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => router.push('/lab/flashcards?topic=gas-tests')}
                  className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.25)', color: '#FB923C' }}>
                  Practise Gas Tests — Flashcards <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {!selectedGas && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-12">
              <Wind className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--muted)' }} />
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Select a gas above to see its tests</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
