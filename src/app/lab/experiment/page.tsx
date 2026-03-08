'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useLabStore } from '@/store/labStore';
import { STEPS, SUBSTANCES, COLOR_OPTIONS } from '@/data/acidBase';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';

// ─── Mini beaker ──────────────────────────────────────────────
function MiniBeaker({ color, label, animating }: { color?: string; label: string; animating: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-10 h-14 flex items-end justify-center">
        <svg width="40" height="56" viewBox="0 0 40 56" fill="none" className="absolute inset-0">
          <path d="M8 4 L4 50 Q4 53 7 53 L33 53 Q36 53 36 50 L32 4 Z"
            stroke="rgba(79,209,255,0.35)" strokeWidth="1.2" fill="rgba(13,21,32,0.6)" />
          <rect x="6" y="1" width="28" height="4" rx="1.5"
            fill="rgba(79,209,255,0.12)" stroke="rgba(79,209,255,0.3)" strokeWidth="1" />
        </svg>
        {color && (
          <motion.div className="absolute bottom-1 left-[6px] right-[6px] rounded-sm"
            style={{ background: color, opacity: 0.75 }}
            initial={{ height: 0 }} animate={{ height: '60%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }} />
        )}
      </div>
      <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{label}</span>
    </div>
  );
}

// ─── Color helper ─────────────────────────────────────────────
function interpolateColor(t: number): string {
  if (t < 0.85) {
    const p = t / 0.85;
    return `rgb(${Math.round(253 + (249 - 253) * p)},${Math.round(224 + (115 - 224) * p)},${Math.round(71 + (22 - 71) * p)})`;
  }
  const p = (t - 0.85) / 0.15;
  return `rgb(${Math.round(249 + (220 - 249) * p)},${Math.round(115 + (38 - 115) * p)},${Math.round(22 + (38 - 22) * p)})`;
}

// ─── SVG Scene: Fill Burette ───────────────────────────────────
function FillBuretteScene({ playing, fillLevel }: { playing: boolean; fillLevel: number }) {
  const BENCH = 375;
  const BTOP = 72; const BHEIGHT = 270;
  const liquidY = BTOP + BHEIGHT * (1 - fillLevel);
  const liquidH = BHEIGHT * fillLevel;
  const bottleY = BENCH - 82;
  const bottleCX = 267;
  return (
    <svg viewBox="0 0 340 420" className="w-full" style={{ maxHeight: 360 }}>
      <rect x="0" y={BENCH} width="340" height="45" fill="#0d1520" />
      <rect x="0" y={BENCH - 6} width="340" height="8" rx="2" fill="#1a2a3d" />
      <rect x="38" y={BENCH - 9} width="78" height="9" rx="3" fill="#3d5a70" />
      <rect x="70" y="22" width="7" height={BENCH - 28} rx="3" fill="#3d5a70" />
      <rect x="70" y="50" width="80" height="8" rx="3" fill="#3d5a70" />
      <path d="M 103 30 L 112 58 L 126 58 L 135 30 Z" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      <rect x="113" y="58" width="7" height="16" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      <rect x="108" y={BTOP} width="22" height={BHEIGHT} rx="3" fill="rgba(13,21,32,0.6)" stroke="#4FD1FF" strokeWidth="1.2" />
      <clipPath id="burette-clip-exp"><rect x="109" y={BTOP} width="20" height={BHEIGHT} /></clipPath>
      <motion.rect x="109" y={liquidY} width="20" height={liquidH} rx="2"
        fill="rgba(100,200,255,0.45)"
        animate={{ y: liquidY, height: liquidH }} transition={{ duration: 0.15 }}
        clipPath="url(#burette-clip-exp)" />
      {[0, 10, 20, 30, 40, 50].map(v => {
        const sy = BTOP + (v / 50) * BHEIGHT;
        return (
          <g key={v}>
            <line x1="105" y1={sy} x2="108" y2={sy} stroke="#4FD1FF" strokeWidth="0.8" />
            <text x="101" y={sy + 3} fill="#5a7a99" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      <text x="103" y="27" fill="#5a7a99" fontSize="6" textAnchor="end">cm³</text>
      <rect x="100" y={BTOP + BHEIGHT} width="30" height="8" rx="4" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      <path d={`M 116 ${BTOP + BHEIGHT + 8} L 113 ${BENCH - 14} L 119 ${BENCH - 14} Z`}
        fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1" />
      <motion.g
        animate={playing ? { x: -148, y: -248, rotate: -38 } : { x: 0, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.15 }}
        style={{ transformOrigin: `${bottleCX}px ${BENCH}px` }}>
        <rect x={bottleCX - 24} y={bottleY + 4} width="48" height="73" rx="5" fill="rgba(100,200,255,0.25)" />
        <rect x={bottleCX - 27} y={bottleY} width="54" height="82" rx="8" fill="rgba(30,80,140,0.8)" stroke="#4FD1FF" strokeWidth="1.2" />
        <rect x={bottleCX - 14} y={bottleY - 14} width="28" height="18" rx="5" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
        <rect x={bottleCX - 4} y={bottleY - 22} width="8" height="10" rx="2" fill="#4FD1FF" opacity="0.7" />
        <text x={bottleCX} y={bottleY + 38} fill="#4FD1FF" fontSize="9" textAnchor="middle" fontWeight="bold">HCl</text>
        <text x={bottleCX} y={bottleY + 51} fill="#4FD1FF" fontSize="6.5" textAnchor="middle">unknown</text>
      </motion.g>
      {playing && fillLevel < 0.98 && (
        <motion.rect x="114" width="5" rx="2" fill="rgba(100,200,255,0.8)"
          y={74} height={0}
          animate={{ height: [0, 18, 18, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, delay: 0.7, ease: 'easeInOut' }} />
      )}
      <text x="119" y={BENCH + 16} fill="#5a7a99" fontSize="7" textAnchor="middle">Burette</text>
      {fillLevel > 0.05 && (
        <motion.text x="143" y={BTOP + 16} fill="#4FD1FF" fontSize="9" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
          0.00 cm³
        </motion.text>
      )}
    </svg>
  );
}

// ─── SVG Scene: Pipette Transfer ──────────────────────────────
function PipetteScene({ phase }: { phase: 'idle' | 'fill' | 'transfer' | 'done' }) {
  const BENCH = 375;
  const BKR_X = 28; const BKR_W = 70; const BKR_H = 85;
  const BKR_Y = BENCH - BKR_H;
  const fullLevel = 62;
  const drawnLevel = (phase === 'fill' || phase === 'transfer' || phase === 'done') ? 38 : fullLevel;
  const solutionY = BENCH - drawnLevel;
  const pipetteX = phase === 'fill' ? 63 : phase === 'transfer' || phase === 'done' ? 268 : 170;
  const pipetteY = phase === 'fill' ? 30 : phase === 'transfer' || phase === 'done' ? -20 : 0;
  const hasLiquid = phase === 'fill' || phase === 'transfer';
  const FLX = 268;
  return (
    <svg viewBox="0 0 340 420" className="w-full" style={{ maxHeight: 360 }}>
      <rect x="0" y={BENCH} width="340" height="45" fill="#0d1520" />
      <rect x="0" y={BENCH - 6} width="340" height="8" rx="2" fill="#1a2a3d" />
      <path d={`M ${BKR_X} ${BKR_Y} L ${BKR_X} ${BENCH} L ${BKR_X + BKR_W} ${BENCH} L ${BKR_X + BKR_W} ${BKR_Y}`}
        fill="none" stroke="#7AFFB2" strokeWidth="1.5" />
      <line x1={BKR_X} y1={BENCH} x2={BKR_X + BKR_W} y2={BENCH} stroke="#7AFFB2" strokeWidth="1.5" />
      <path d={`M ${BKR_X + BKR_W - 8} ${BKR_Y} Q ${BKR_X + BKR_W + 4} ${BKR_Y - 4} ${BKR_X + BKR_W + 2} ${BKR_Y + 8}`}
        fill="none" stroke="#7AFFB2" strokeWidth="1.2" />
      <clipPath id="beaker-clip-exp">
        <rect x={BKR_X + 2} y={BKR_Y} width={BKR_W - 4} height={BKR_H} />
      </clipPath>
      <motion.rect x={BKR_X + 2} width={BKR_W - 4} rx="1"
        fill="rgba(122,255,178,0.35)" y={solutionY} height={drawnLevel}
        animate={{ y: solutionY, height: drawnLevel }}
        transition={{ duration: 1.0, ease: 'easeOut', delay: phase === 'fill' ? 0.9 : 0 }}
        clipPath="url(#beaker-clip-exp)" />
      <text x={BKR_X + BKR_W / 2} y={BENCH - fullLevel / 2 + 4} fill="#7AFFB2" fontSize="7" textAnchor="middle" fontWeight="bold">Na₂CO₃</text>
      <text x={BKR_X + BKR_W / 2} y={BENCH - fullLevel / 2 + 14} fill="#7AFFB2" fontSize="5.5" textAnchor="middle">0.100 mol dm⁻³</text>
      <text x={BKR_X + BKR_W / 2} y={BENCH + 16} fill="#5a7a99" fontSize="7" textAnchor="middle">Na₂CO₃ soln</text>
      <motion.g animate={{ x: pipetteX - 170, y: pipetteY }} transition={{ duration: 1.2, ease: 'easeInOut' }}>
        <line x1="170" y1="90" x2="170" y2="178" stroke="#4FD1FF" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="170" cy="210" rx="13" ry="26" fill="rgba(13,21,32,0.6)" stroke="#4FD1FF" strokeWidth="1.5" />
        {hasLiquid && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <ellipse cx="170" cy="210" rx="10.5" ry="23" fill="rgba(122,255,178,0.5)" />
            <rect x="167" y="155" width="6" height="28" fill="rgba(122,255,178,0.5)" />
          </motion.g>
        )}
        {phase === 'transfer' && (
          <motion.g initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1.0, duration: 1.2 }}>
            <ellipse cx="170" cy="210" rx="10.5" ry="23" fill="rgba(122,255,178,0.5)" />
          </motion.g>
        )}
        <line x1="162" y1="155" x2="178" y2="155" stroke="#4FD1FF" strokeWidth="1" />
        <text x="182" y="159" fill="#5a7a99" fontSize="6.5">25.0</text>
        <line x1="170" y1="236" x2="170" y2="320" stroke="#4FD1FF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 166 320 L 170 348 L 174 320 Z" fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1" />
        <ellipse cx="170" cy="85" rx="12" ry="10" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      </motion.g>
      <rect x={FLX - 58} y={BENCH - 8} width="116" height="6" rx="2" fill="#1e3a50" />
      <path d={`M ${FLX} ${BENCH - 55} L ${FLX - 52} ${BENCH - 6} L ${FLX + 52} ${BENCH - 6} Z`}
        fill="rgba(13,21,32,0.5)" stroke="#4FD1FF" strokeWidth="1.2" />
      <rect x={FLX - 7} y={BENCH - 72} width="14" height="19" rx="2" fill="rgba(13,21,32,0.5)" stroke="#4FD1FF" strokeWidth="1.2" />
      <rect x={FLX - 10} y={BENCH - 80} width="20" height="10" rx="3" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      {phase === 'done' && (
        <motion.path
          d={`M ${FLX - 40} ${BENCH - 18} L ${FLX - 52} ${BENCH - 6} L ${FLX + 52} ${BENCH - 6} L ${FLX + 40} ${BENCH - 18} Z`}
          fill="rgba(122,255,178,0.35)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
      )}
      {phase === 'transfer' && (
        <motion.rect x={FLX - 2} y={BENCH - 80} width="4" height="0"
          fill="rgba(122,255,178,0.7)"
          animate={{ height: [0, 75, 75, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, delay: 1.0 }} />
      )}
      <text x={FLX} y={BENCH + 16} fill="#5a7a99" fontSize="7" textAnchor="middle">Conical flask</text>
      {phase === 'done' && (
        <motion.text x={FLX + 58} y={BENCH - 12} fill="#7AFFB2" fontSize="8" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          25.0 cm³
        </motion.text>
      )}
    </svg>
  );
}

// ─── SVG Scene: Indicator (flask already has Na₂CO₃) ──────────
function IndicatorSceneExp({ dropsAdded }: { dropsAdded: number }) {
  const BENCH = 385;
  const cx = 170;
  const flaskBase = BENCH - 8; // 377
  const flaskShoulder = 295;
  // Na₂CO₃ liquid: 30px high, always visible
  const liqH = 30;
  const liqY = flaskBase - liqH; // 347
  const t = liqH / (flaskBase - flaskShoulder); // 30/82
  const lx = (cx - 62) + t * 62;
  const rx = (cx + 62) - t * 62;
  // Colour: light green → yellow when drops added
  const liquidColor =
    dropsAdded === 0 ? 'rgba(122,255,178,0.35)' :
    dropsAdded >= 3 ? '#FDE047' :
    'rgba(253,224,71,0.4)';
  return (
    <svg viewBox="0 0 340 420" className="w-full" style={{ maxHeight: 360 }}>
      <rect x="0" y={BENCH} width="340" height="35" fill="#0d1520" />
      <rect x="0" y={BENCH - 6} width="340" height="8" rx="2" fill="#1a2a3d" />
      {/* White tile */}
      <rect x={cx - 68} y={flaskBase} width="136" height="6" rx="2" fill="#1e3a50" />
      {/* Flask body */}
      <path d={`M ${cx} ${flaskShoulder} L ${cx - 62} ${flaskBase} L ${cx + 62} ${flaskBase} Z`}
        fill="rgba(13,21,32,0.45)" stroke="#4FD1FF" strokeWidth="1.4" />
      {/* Na₂CO₃ liquid layer — always shown */}
      <clipPath id="ind-clip-exp">
        <path d={`M ${cx} ${flaskShoulder} L ${cx - 62} ${flaskBase} L ${cx + 62} ${flaskBase} Z`} />
      </clipPath>
      <motion.path
        d={`M ${lx} ${liqY} L ${cx - 62} ${flaskBase} L ${cx + 62} ${flaskBase} L ${rx} ${liqY} Z`}
        fill={liquidColor}
        animate={{ fill: liquidColor }}
        transition={{ duration: 0.5 }}
        clipPath="url(#ind-clip-exp)" />
      {/* Flask neck */}
      <rect x={cx - 8} y="263" width="16" height="34" rx="2" fill="rgba(13,21,32,0.5)" stroke="#4FD1FF" strokeWidth="1.2" />
      {/* Flask rim */}
      <rect x={cx - 11} y="257" width="22" height="9" rx="3" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      <text x={cx} y={BENCH + 16} fill="#5a7a99" fontSize="7" textAnchor="middle">Conical flask</text>
      {/* Dropper bottle */}
      <rect x={cx - 20} y="90" width="40" height="80" rx="6" fill="rgba(251,146,60,0.2)" stroke="#FB923C" strokeWidth="1.2" />
      <rect x={cx - 8} y="78" width="16" height="16" rx="4" fill="#2d4a5e" stroke="#FB923C" strokeWidth="1" />
      <text x={cx} y="124" fill="#FB923C" fontSize="7" textAnchor="middle" fontWeight="bold">Methyl</text>
      <text x={cx} y="135" fill="#FB923C" fontSize="7" textAnchor="middle">Orange</text>
      <text x={cx} y="146" fill="#FB923C" fontSize="6" textAnchor="middle">indicator</text>
      <rect x={cx - 3} y="170" width="6" height="18" rx="2" fill="#FB923C" />
      <path d={`M ${cx - 4} 188 L ${cx} 200 L ${cx + 4} 188 Z`} fill="#FB923C" />
      {/* Guide line */}
      <line x1={cx} y1="202" x2={cx} y2="257" stroke="rgba(251,146,60,0.2)" strokeWidth="1" strokeDasharray="3,3" />
      {/* Animated drops */}
      {[0, 1, 2].map(i => (
        dropsAdded > i && (
          <motion.circle key={i} cx={cx} r={3.5} fill="#F59E0B"
            initial={{ cy: 202, opacity: 1, scale: 1 }}
            animate={{ cy: [202, 257], opacity: [1, 0], scale: [1, 0.6] }}
            transition={{ duration: 0.7, delay: i * 0.2 }} />
        )
      ))}
      {/* Drop count */}
      <text x={cx} y="237" fill="#FB923C" fontSize="10" textAnchor="middle" fontWeight="bold">
        {dropsAdded}/3 drops
      </text>
      {dropsAdded >= 3 && (
        <motion.text x={cx} y={flaskBase - 22} fill="#FDE047" fontSize="9" textAnchor="middle" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Solution is YELLOW ✓
        </motion.text>
      )}
    </svg>
  );
}

// ─── SVG Scene: Titration Apparatus ───────────────────────────
function TitrationApparatusExp({
  acidAdded, tapOpen, endpointReached, flaskColor, showDrop,
}: {
  acidAdded: number; tapOpen: boolean; endpointReached: boolean;
  flaskColor: string; showDrop: boolean;
}) {
  const BTOP = 35; const BHEIGHT = 220;
  const liquidTop = BTOP + acidAdded * (BHEIGHT / 50);
  const liquidH = Math.max(0, BHEIGHT - acidAdded * (BHEIGHT / 50));
  return (
    <svg viewBox="0 0 240 500" className="w-full" style={{ maxHeight: 430 }}>
      <rect x="0" y="480" width="240" height="20" fill="#0d1520" />
      <rect x="0" y="475" width="240" height="8" rx="2" fill="#1a2a3d" />
      <rect x="42" y="10" width="6" height="465" rx="3" fill="#3d5a70" />
      <rect x="8" y="468" width="74" height="10" rx="3" fill="#3d5a70" />
      <rect x="42" y="48" width="68" height="8" rx="3" fill="#3d5a70" />
      <rect x="108" y={BTOP} width="22" height={BHEIGHT + 12} rx="3" fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1.2" />
      {liquidH > 0 && (
        <motion.rect x="109.5" y={liquidTop} width="19" height={liquidH} rx="2"
          fill="rgba(100,200,255,0.45)"
          animate={{ y: liquidTop, height: liquidH }} transition={{ duration: 0.1 }} />
      )}
      {[0, 5, 10, 15, 20, 25, 30, 40, 50].map(v => {
        const y = BTOP + (v / 50) * BHEIGHT;
        return (
          <g key={v}>
            <line x1="106" y1={y} x2="108" y2={y} stroke="#4FD1FF" strokeWidth="0.8" />
            <text x="102" y={y + 3} fill="#5a7a99" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      <text x="134" y={liquidTop + 4} fill="#4FD1FF" fontSize="9" fontWeight="bold">{acidAdded.toFixed(2)}</text>
      <text x="104" y={BTOP - 6} fill="#5a7a99" fontSize="6" textAnchor="middle">cm³</text>
      <motion.g animate={{ rotate: tapOpen ? 90 : 0 }} style={{ transformOrigin: '119px 260px' }}>
        <rect x="103" y="256" width="32" height="8" rx="4" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      </motion.g>
      <line x1="119" y1="264" x2="119" y2="282" stroke="#4FD1FF" strokeWidth="1.5" />
      {showDrop && (
        <motion.circle cx="119" cy="282" r="3.5" fill="rgba(100,200,255,0.85)"
          initial={{ cy: 282, opacity: 1, r: 3.5 }}
          animate={{ cy: 340, opacity: 0, r: 2 }}
          transition={{ duration: 0.6, ease: 'easeIn' }} />
      )}
      <line x1="68" y1="348" x2="178" y2="348" stroke="#3d5a70" strokeWidth="2.5" />
      <rect x="113" y="328" width="12" height="22" rx="1" fill="rgba(13,21,32,0.5)" stroke="#4FD1FF" strokeWidth="1.2" />
      <rect x="110" y="323" width="18" height="7" rx="2" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      <path d="M 113 348 L 72 455 L 166 455 L 125 348 Z" fill="rgba(13,21,32,0.45)" stroke="#4FD1FF" strokeWidth="1.2" />
      <clipPath id="flask-clip-exp">
        <path d="M 113 348 L 72 455 L 166 455 L 125 348 Z" />
      </clipPath>
      {(() => {
        const liqH = Math.min(80, 8 + (acidAdded / 50) * 72);
        const liqY = 455 - liqH;
        const tt = (455 - liqY) / (455 - 348);
        const lx = 72 + tt * (113 - 72);
        const rx2 = 166 - tt * (166 - 125);
        return (
          <motion.path
            d={`M ${lx + 2} ${liqY} L ${lx} 455 L ${rx2} 455 L ${rx2 - 2} ${liqY} Z`}
            fill={flaskColor} opacity={0.9}
            animate={{ d: `M ${lx + 2} ${liqY} L ${lx} 455 L ${rx2} 455 L ${rx2 - 2} ${liqY} Z`, fill: flaskColor }}
            transition={{ duration: 0.3 }}
            clipPath="url(#flask-clip-exp)" />
        );
      })()}
      {endpointReached && [0, 1, 2].map(i => (
        <motion.circle key={i} cx={100 + i * 18} cy={445} r={2.5}
          fill="rgba(255,255,255,0.3)"
          animate={{ cy: [445, 432, 445], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: 4, duration: 0.9, delay: i * 0.25 }} />
      ))}
      {endpointReached && (
        <motion.path d="M 113 348 L 72 455 L 166 455 L 125 348 Z"
          fill="transparent" stroke="#DC2626" strokeWidth={0}
          animate={{ strokeWidth: [3, 0, 2, 0], opacity: [1, 0, 0.6, 0] }}
          transition={{ duration: 1.4 }} />
      )}
      <defs>
        <linearGradient id="colorBarExp" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      <rect x="168" y="400" width="60" height="8" rx="4" fill="url(#colorBarExp)" opacity={0.6} />
      <text x="168" y="420" fill="#5a7a99" fontSize="5.5">Yellow</text>
      <text x="208" y="420" fill="#5a7a99" fontSize="5.5">Red</text>
    </svg>
  );
}

// ─── EXPERIMENT 1: Indicator Testing (existing) ───────────────

function SetupStep({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState(0);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Click each test tube to place it in the rack (1 of 5).</p>
      <div className="flex gap-4 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div key={i} whileTap={{ scale: 0.95 }} onClick={() => {
            if (i === placed) setPlaced(p => { const n = p + 1; if (n === 5) setTimeout(onComplete, 300); return n; });
          }} className="cursor-pointer" style={{ opacity: i < placed ? 1 : i === placed ? 1 : 0.35 }}>
            <svg width="14" height="48" viewBox="0 0 14 48" fill="none">
              <rect x="1" y="0" width="12" height="38" rx="6"
                stroke={i < placed ? 'rgba(122,255,178,0.5)' : i === placed ? 'rgba(79,209,255,0.5)' : 'rgba(79,209,255,0.2)'}
                strokeWidth="1.2" fill="rgba(13,21,32,0.5)" />
              {i < placed && <circle cx="7" cy="44" r="3" fill="rgba(122,255,178,0.6)" />}
            </svg>
          </motion.div>
        ))}
      </div>
      <p className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{placed} / 5 placed</p>
    </div>
  );
}

function AddSubstancesStep({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState<string[]>([]);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Click each substance bottle to add 5 drops to its test tube.</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {SUBSTANCES.map(s => (
          <motion.button key={s.id} whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (done.includes(s.id)) return;
              const next = [...done, s.id];
              setDone(next);
              if (next.length === SUBSTANCES.length) setTimeout(onComplete, 400);
            }}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
            style={{ background: done.includes(s.id) ? 'rgba(122,255,178,0.08)' : 'var(--surface)', border: `1px solid ${done.includes(s.id) ? 'rgba(122,255,178,0.35)' : 'var(--border)'}` }}>
            <div className="w-6 h-6 rounded-full" style={{ background: s.indicatorColor, opacity: 0.7 }} />
            <span className="text-[10px] font-mono" style={{ color: done.includes(s.id) ? 'var(--accent2)' : 'var(--muted)' }}>{s.name.split(' ')[0]}</span>
            {done.includes(s.id) && <CheckCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent2)' }} />}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function AddIndicatorStep({ onComplete }: { onComplete: () => void }) {
  const [added, setAdded] = useState<string[]>([]);
  const [indicatorSelected, setIndicatorSelected] = useState(false);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>First click the indicator bottle, then click each tube.</p>
      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIndicatorSelected(true)}
        className="px-4 py-2 rounded-lg font-mono text-xs border transition-all"
        style={{ background: indicatorSelected ? 'rgba(107,33,168,0.15)' : 'var(--surface)', borderColor: indicatorSelected ? 'rgba(107,33,168,0.5)' : 'var(--border)', color: indicatorSelected ? '#a855f7' : 'var(--muted)' }}>
        🧴 Universal Indicator {indicatorSelected ? '(selected)' : ''}
      </motion.button>
      <div className="flex gap-3 flex-wrap justify-center">
        {SUBSTANCES.map(s => (
          <motion.div key={s.id} className="cursor-pointer" whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!indicatorSelected || added.includes(s.id)) return;
              const next = [...added, s.id];
              setAdded(next);
              if (next.length === SUBSTANCES.length) setTimeout(onComplete, 600);
            }}>
            <MiniBeaker color={added.includes(s.id) ? s.indicatorColor : undefined} label={s.name.split(' ')[0]} animating={added.includes(s.id)} />
          </motion.div>
        ))}
      </div>
      <p className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{added.length} / {SUBSTANCES.length} tubes done</p>
    </div>
  );
}

function RecordColorsStep({ onComplete }: { onComplete: () => void }) {
  const recordObservation = useLabStore(s => s.recordObservation);
  const [selected, setSelected] = useState<Record<string, string>>({});
  function pick(substanceId: string, colorId: string) {
    recordObservation(substanceId, colorId);
    const next = { ...selected, [substanceId]: colorId };
    setSelected(next);
    if (Object.keys(next).length === SUBSTANCES.length) setTimeout(onComplete, 400);
  }
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Select the colour you observed in each test tube.</p>
      {SUBSTANCES.map(s => (
        <div key={s.id} className="flex items-center gap-3">
          <span className="text-xs font-mono w-28 shrink-0" style={{ color: 'var(--text)' }}>{s.name}</span>
          <div className="flex gap-1.5 flex-wrap">
            {COLOR_OPTIONS.map(c => (
              <button key={c.id} onClick={() => pick(s.id, c.id)}
                className="w-7 h-7 rounded-full border-2 transition-all"
                style={{ background: c.hex, borderColor: selected[s.id] === c.id ? '#fff' : 'transparent', opacity: 0.85, transform: selected[s.id] === c.id ? 'scale(1.2)' : 'scale(1)' }}
                title={c.label} />
            ))}
          </div>
          {selected[s.id] && <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--accent2)' }} />}
        </div>
      ))}
    </div>
  );
}

function LitmusStep({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState<string[]>([]);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Click each test tube to dip the litmus paper and record the result.</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {SUBSTANCES.map(s => (
          <motion.button key={s.id} whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (done.includes(s.id)) return;
              const next = [...done, s.id];
              setDone(next);
              if (next.length === SUBSTANCES.length) setTimeout(onComplete, 400);
            }}
            className="flex flex-col items-center gap-2 p-3 rounded-xl"
            style={{ background: done.includes(s.id) ? 'rgba(122,255,178,0.08)' : 'var(--surface)', border: `1px solid ${done.includes(s.id) ? 'rgba(122,255,178,0.35)' : 'var(--border)'}` }}>
            <div className="flex gap-0.5">
              <div className="w-1.5 h-8 rounded-sm" style={{ background: done.includes(s.id) && s.classification === 'acid' ? '#ef4444' : '#3b82f6' }} />
              <div className="w-1.5 h-8 rounded-sm" style={{ background: done.includes(s.id) && s.classification === 'alkali' ? '#3b82f6' : '#ef4444' }} />
            </div>
            <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>{s.name.split(' ')[0]}</span>
            {done.includes(s.id) && <CheckCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent2)' }} />}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ClassifyStep({ onComplete }: { onComplete: () => void }) {
  const recordClassification = useLabStore(s => s.recordClassification);
  const [selected, setSelected] = useState<Record<string, string>>({});
  function pick(substanceId: string, value: string) {
    recordClassification(substanceId, value);
    const next = { ...selected, [substanceId]: value };
    setSelected(next);
    if (Object.keys(next).length === SUBSTANCES.length) setTimeout(onComplete, 400);
  }
  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      <p className="text-sm font-mono text-center mb-2" style={{ color: 'var(--muted)' }}>Classify each substance based on your results.</p>
      {SUBSTANCES.map(s => (
        <div key={s.id} className="flex items-center gap-3">
          <span className="text-xs font-mono w-28 shrink-0" style={{ color: 'var(--text)' }}>{s.name}</span>
          <div className="flex gap-2">
            {['acid', 'neutral', 'alkali'].map(cls => (
              <button key={cls} onClick={() => pick(s.id, cls)}
                className="px-3 py-1 rounded font-mono text-[10px] uppercase tracking-wider border transition-all"
                style={{
                  background: selected[s.id] === cls ? (cls === 'acid' ? 'rgba(239,68,68,0.15)' : cls === 'neutral' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)') : 'transparent',
                  borderColor: selected[s.id] === cls ? (cls === 'acid' ? '#ef4444' : cls === 'neutral' ? '#22c55e' : '#3b82f6') : 'var(--border)',
                  color: selected[s.id] === cls ? (cls === 'acid' ? '#ef4444' : cls === 'neutral' ? '#22c55e' : '#3b82f6') : 'var(--muted)',
                }}>{cls}</button>
            ))}
          </div>
          {selected[s.id] && <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--accent2)' }} />}
        </div>
      ))}
    </div>
  );
}

function CleanupStep({ onComplete }: { onComplete: () => void }) {
  const [disposed, setDisposed] = useState(0);
  const [rinsed, setRinsed] = useState(false);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Dispose of all test tubes in the waste beaker, then rinse.</p>
      <div className="flex gap-3">
        {SUBSTANCES.map((s, i) => (
          <motion.div key={s.id} whileTap={{ scale: 0.95 }}
            onClick={() => { if (i === disposed) setDisposed(d => d + 1); }}
            className="cursor-pointer" style={{ opacity: i < disposed ? 0.3 : i === disposed ? 1 : 0.4 }}>
            <svg width="12" height="42" viewBox="0 0 12 42" fill="none">
              <rect x="1" y="0" width="10" height="34" rx="5"
                stroke={i < disposed ? 'rgba(90,122,153,0.3)' : 'rgba(79,209,255,0.4)'} strokeWidth="1" fill="rgba(13,21,32,0.5)" />
              <rect x="2" y="20" width="8" height="12" rx="4" fill={s.indicatorColor} fillOpacity={0.6} />
            </svg>
          </motion.div>
        ))}
      </div>
      {disposed === SUBSTANCES.length && !rinsed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => { setRinsed(true); setTimeout(onComplete, 500); }}
            className="px-6 py-2.5 rounded-lg font-mono text-sm border transition-all"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            💧 Rinse All Tubes
          </button>
        </motion.div>
      )}
      {rinsed && <p className="text-sm font-mono" style={{ color: 'var(--accent2)' }}>✓ Lab cleaned successfully</p>}
    </div>
  );
}

const EXP1_COMPONENTS = [SetupStep, AddSubstancesStep, AddIndicatorStep, RecordColorsStep, LitmusStep, ClassifyStep, CleanupStep];

// ─── EXPERIMENT 2: Acid-Base Titration ───────────────────────

const TITRATION_STEPS_DATA = [
  { id: 1, title: 'Set Up Apparatus', instruction: 'Clamp the burette vertically to the retort stand. Place the conical flask on a white tile below the burette tip. A white tile makes the indicator colour change easier to see.', action: 'Click each apparatus item to assemble the set-up.', points: 8 },
  { id: 2, title: 'Fill the Burette', instruction: 'Fill the burette with Solution A (HCl). Open the tap briefly to remove the air bubble from the tip. Record initial reading: 0.00 cm³. Always record to 2 decimal places.', action: 'Click to fill the burette, then click to expel the air bubble.', points: 8 },
  { id: 3, title: 'Pipette 25.0 cm³ of B', instruction: 'Rinse the pipette with Solution B (Na₂CO₃) before use. Using a safety filler, pipette exactly 25.0 cm³ of B into the clean conical flask.', action: 'Click the pipette, then click the flask to transfer B.', points: 8 },
  { id: 4, title: 'Add Methyl Orange', instruction: 'Add exactly 2–3 drops of methyl orange indicator to the flask. Na₂CO₃ is alkaline — the solution turns yellow. Methyl orange is yellow in alkali.', action: 'Click the methyl orange bottle, then click the flask.', points: 6 },
  { id: 5, title: 'Rough (Pilot) Titration', instruction: 'Open the burette tap and add HCl steadily until one drop causes the solution to turn permanently orange-red. Record the rough titre (~26.90 cm³). This run establishes the approximate end-point — it is EXCLUDED from the average.', action: 'Click the burette tap repeatedly to add HCl. Watch the colour change.', points: 5 },
  { id: 6, title: 'Accurate Titrations', instruction: 'Refill to 0.00 cm³. Perform 3 careful titrations, adding HCl drop-by-drop near the end-point. Titre 1 = 26.40, Titre 2 = 26.50, Titre 3 = 26.40. Identify the TWO concordant titres (within 0.10 cm³).', action: 'Click the two concordant titres in the table.', points: 10 },
  { id: 7, title: 'Calculate Concentration', instruction: 'Use the concordant average titre (26.40 cm³) to calculate C(HCl). Equation: Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂. Molar ratio 1:2. C(Na₂CO₃) = 0.10 mol dm⁻³.', action: 'Select the correct value at each calculation step.', points: 5 },
];

function TitSetup({ onComplete }: { onComplete: () => void }) {
  const items = ['🧪 Burette', '🔩 Retort Stand', '⚗️ Conical Flask', '⬜ White Tile'];
  const [done, setDone] = useState<number[]>([]);
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Click each item to assemble the titration apparatus.</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {items.map((item, i) => (
          <motion.button key={i} whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (done.includes(i)) return;
              const next = [...done, i];
              setDone(next);
              if (next.length === items.length) setTimeout(onComplete, 400);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs transition-all"
            style={{ background: done.includes(i) ? 'rgba(122,255,178,0.08)' : 'var(--surface)', border: `1px solid ${done.includes(i) ? 'rgba(122,255,178,0.35)' : 'var(--border)'}`, color: done.includes(i) ? 'var(--accent2)' : 'var(--text)' }}>
            {item} {done.includes(i) && '✓'}
          </motion.button>
        ))}
      </div>
      <p className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{done.length} / {items.length} ready</p>
    </div>
  );
}

function TitFillBurette({ onComplete }: { onComplete: () => void }) {
  const [fillLevel, setFillLevel] = useState(0);
  const [filling, setFilling] = useState(false);
  const [bubbleCleared, setBubbleCleared] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startFill() {
    if (filling || fillLevel > 0) return;
    setFilling(true);
    timerRef.current = setInterval(() => {
      setFillLevel(l => {
        if (l >= 1) { clearInterval(timerRef.current!); setFilling(false); return 1; }
        return l + 0.025;
      });
    }, 60);
  }

  const filled = fillLevel >= 0.9;
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="rounded-2xl border p-3" style={{ background: 'rgba(13,21,32,0.6)', borderColor: 'rgba(79,209,255,0.15)' }}>
        <FillBuretteScene playing={filling} fillLevel={fillLevel} />
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <div className="space-y-2.5">
          {[
            'Close the stopcock before filling',
            'Rinse burette twice with small volume of HCl (discard washings)',
            'Pour HCl above the 0.00 cm³ mark via the small funnel',
            'Open tap briefly to expel air from the nozzle tip',
            'Adjust to exactly 0.00 cm³ — read at bottom of meniscus',
          ].map((s, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-xs font-mono font-bold w-4 shrink-0 mt-0.5" style={{ color: '#4FD1FF' }}>{i + 1}.</span>
              <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{s}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={startFill} disabled={fillLevel > 0}
            className="px-4 py-2 rounded-lg font-mono text-xs border transition-all"
            style={{ background: filled ? 'rgba(122,255,178,0.08)' : 'var(--surface)', borderColor: filled ? 'rgba(122,255,178,0.35)' : 'var(--border)', color: filled ? 'var(--accent2)' : 'var(--muted)', opacity: fillLevel > 0 && !filled ? 0.6 : 1 }}>
            {filled ? '✓ Burette filled with HCl' : '🧴 Fill burette with HCl'}
          </motion.button>
          {filled && !bubbleCleared && (
            <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.95 }}
              onClick={() => setBubbleCleared(true)}
              className="px-4 py-2 rounded-lg font-mono text-xs border transition-all"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--muted)' }}>
              💨 Open tap to clear air bubble
            </motion.button>
          )}
          {filled && bubbleCleared && (
            <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: 'rgba(79,209,255,0.12)', border: '1px solid rgba(79,209,255,0.3)', color: '#4FD1FF' }}>
              Reading: 0.00 cm³ ✓ — Continue →
            </motion.button>
          )}
        </div>
        <div className="rounded-lg p-2.5 text-xs font-mono" style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D' }}>
          <strong>WAEC:</strong> Rinse with HCl (not water) — prevents dilution error.
        </div>
      </div>
    </div>
  );
}

function TitPipette({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'fill' | 'transfer' | 'done'>('idle');

  function start() {
    setPhase('fill');
    setTimeout(() => setPhase('transfer'), 1800);
    setTimeout(() => {
      setPhase('done');
      setTimeout(onComplete, 1200);
    }, 3600);
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="rounded-2xl border p-3" style={{ background: 'rgba(13,21,32,0.6)', borderColor: 'rgba(79,209,255,0.15)' }}>
        <PipetteScene phase={phase} />
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <div className="space-y-2.5">
          {[
            { t: 'Rinse the pipette twice with Na₂CO₃ solution', done: phase !== 'idle' },
            { t: 'Use a safety filler — draw solution to the 25.0 cm³ mark', done: phase === 'transfer' || phase === 'done' },
            { t: 'Hold finger over top; transfer to the conical flask', done: phase === 'done' },
            { t: 'Touch pipette tip to flask wall to release the last drop', done: phase === 'done' },
          ].map((s, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-bold"
                style={{ background: s.done ? 'rgba(122,255,178,0.15)' : 'rgba(79,209,255,0.1)', color: s.done ? 'var(--accent2)' : '#4FD1FF', border: `1px solid ${s.done ? 'rgba(122,255,178,0.4)' : 'rgba(79,209,255,0.3)'}` }}>
                {s.done ? '✓' : i + 1}
              </div>
              <p className="text-xs font-mono" style={{ color: s.done ? 'var(--text)' : 'var(--muted)' }}>{s.t}</p>
            </div>
          ))}
        </div>
        {phase === 'idle' && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={start}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: 'rgba(122,255,178,0.1)', border: '1px solid rgba(122,255,178,0.3)', color: '#7AFFB2' }}>
            🔬 Begin pipetting Na₂CO₃
          </motion.button>
        )}
        {(phase === 'fill' || phase === 'transfer') && (
          <p className="text-xs font-mono text-center" style={{ color: '#4FD1FF' }}>
            {phase === 'fill' ? 'Drawing up solution…' : 'Transferring to flask…'}
          </p>
        )}
        {phase === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(122,255,178,0.08)', border: '1px solid rgba(122,255,178,0.25)' }}>
            <p className="text-xs font-mono font-bold" style={{ color: 'var(--accent2)' }}>✓ 25.0 cm³ Na₂CO₃ in flask</p>
            <p className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>n(Na₂CO₃) = 0.10 × 0.025 = 2.50 × 10⁻³ mol</p>
          </motion.div>
        )}
        <div className="rounded-lg p-2.5 text-xs font-mono" style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D' }}>
          <strong>WAEC:</strong> Never pipette by mouth. Rinsing prevents dilution error.
        </div>
      </div>
    </div>
  );
}

function TitAddIndicator({ onComplete }: { onComplete: () => void }) {
  const [bottleSelected, setBottleSelected] = useState(false);
  const [dropsAdded, setDropsAdded] = useState(0);

  function addDrop() {
    if (!bottleSelected || dropsAdded >= 3) return;
    const next = dropsAdded + 1;
    setDropsAdded(next);
    if (next >= 3) setTimeout(onComplete, 800);
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="rounded-2xl border p-3" style={{ background: 'rgba(13,21,32,0.6)', borderColor: 'rgba(79,209,255,0.15)' }}>
        <IndicatorSceneExp dropsAdded={dropsAdded} />
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <div className="space-y-2.5">
          {[
            { t: 'Flask contains 25.0 cm³ Na₂CO₃ solution (alkaline)', done: true },
            { t: 'Select methyl orange indicator bottle', done: bottleSelected },
            { t: 'Add exactly 2–3 drops to the flask', done: dropsAdded >= 3 },
            { t: 'Solution turns YELLOW — methyl orange is yellow in alkali', done: dropsAdded >= 3 },
          ].map((s, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-bold"
                style={{ background: s.done ? 'rgba(122,255,178,0.15)' : 'rgba(79,209,255,0.1)', color: s.done ? 'var(--accent2)' : '#4FD1FF', border: `1px solid ${s.done ? 'rgba(122,255,178,0.4)' : 'rgba(79,209,255,0.3)'}` }}>
                {s.done ? '✓' : i + 1}
              </div>
              <p className="text-xs font-mono" style={{ color: s.done ? 'var(--text)' : 'var(--muted)' }}>{s.t}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {!bottleSelected && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setBottleSelected(true)}
              className="px-4 py-2 rounded-lg font-mono text-xs border transition-all"
              style={{ background: 'rgba(245,158,11,0.08)', borderColor: '#f59e0b', color: '#f59e0b' }}>
              🟡 Select Methyl Orange indicator
            </motion.button>
          )}
          {bottleSelected && dropsAdded < 3 && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={addDrop}
              className="px-4 py-2 rounded-lg font-mono text-xs border transition-all"
              style={{ background: 'rgba(245,158,11,0.08)', borderColor: '#f59e0b', color: '#f59e0b' }}>
              💧 Add drop ({dropsAdded}/3)
            </motion.button>
          )}
          {dropsAdded >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="px-3 py-2 rounded-lg"
              style={{ background: 'rgba(253,224,71,0.08)', border: '1px solid rgba(253,224,71,0.3)', color: '#FDE047' }}>
              <p className="text-xs font-mono font-bold">✓ Yellow solution — ready for titration</p>
            </motion.div>
          )}
        </div>
        <div className="rounded-lg p-2.5 text-xs font-mono" style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D' }}>
          <strong>WAEC:</strong> Endpoint = first permanent orange-red. Yellow → acid = colour change.
        </div>
      </div>
    </div>
  );
}

function TitRoughTitration({ onComplete }: { onComplete: () => void }) {
  const [acidAdded, setAcidAdded] = useState(0);
  const [tapOpen, setTapOpen] = useState(false);
  const [endpointReached, setEndpointReached] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dropIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ENDPOINT = 26.9;
  const colorT = Math.min(1, acidAdded / ENDPOINT);
  const flaskColor = endpointReached ? '#DC2626' : interpolateColor(colorT);

  const stopDrip = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    setTapOpen(false); setShowDrop(false);
  }, []);

  useEffect(() => () => stopDrip(), [stopDrip]);

  function openTap() {
    if (endpointReached || tapOpen) return;
    setTapOpen(true);
    intervalRef.current = setInterval(() => {
      setAcidAdded(prev => {
        const next = prev + 0.28;
        if (next >= ENDPOINT) { setEndpointReached(true); stopDrip(); return ENDPOINT; }
        return next;
      });
    }, 50);
    dropIntervalRef.current = setInterval(() => {
      setShowDrop(true);
      setTimeout(() => setShowDrop(false), 600);
    }, 700);
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="rounded-2xl border p-3" style={{ background: 'rgba(13,21,32,0.6)', borderColor: 'rgba(79,209,255,0.15)' }}>
        <TitrationApparatusExp acidAdded={acidAdded} tapOpen={tapOpen} endpointReached={endpointReached} flaskColor={flaskColor} showDrop={showDrop} />
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <div className="space-y-2">
          <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--muted)' }}>
            Hold the tap open — add HCl steadily until the solution turns <strong style={{ color: '#f97316' }}>permanently orange-red</strong>.
          </p>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg p-2" style={{ background: 'rgba(79,209,255,0.05)', border: '1px solid rgba(79,209,255,0.15)' }}>
              <p className="text-[9px] font-mono mb-0.5" style={{ color: 'var(--muted)' }}>HCl added</p>
              <p className="text-sm font-bold font-mono" style={{ color: '#4FD1FF' }}>{acidAdded.toFixed(2)} cm³</p>
            </div>
            <div className="rounded-lg p-2 flex flex-col items-center" style={{ background: `${flaskColor}15`, border: `1px solid ${flaskColor}40` }}>
              <p className="text-[9px] font-mono mb-1" style={{ color: 'var(--muted)' }}>Flask colour</p>
              <div className="w-5 h-5 rounded-full" style={{ background: flaskColor }} />
            </div>
          </div>
        </div>
        {!endpointReached ? (
          <motion.button whileTap={{ scale: 0.97 }}
            onPointerDown={openTap} onPointerUp={stopDrip} onPointerLeave={stopDrip}
            className="py-3 rounded-xl font-semibold text-sm"
            style={{ background: tapOpen ? 'rgba(79,209,255,0.18)' : 'rgba(79,209,255,0.08)', border: `1px solid ${tapOpen ? 'rgba(79,209,255,0.5)' : 'rgba(79,209,255,0.2)'}`, color: '#4FD1FF' }}>
            {tapOpen ? '🔵 Flowing…' : '🔵 Hold to open tap'}
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
            <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <p className="text-xs font-mono font-bold" style={{ color: '#f87171' }}>✓ End-point reached!</p>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--muted)' }}>
                Rough titre: <strong style={{ color: 'var(--text)' }}>{ENDPOINT.toFixed(2)} cm³</strong>
              </p>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(239,68,68,0.5)' }}>This run is EXCLUDED from the concordant average</p>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onComplete}
              className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: 'rgba(79,209,255,0.12)', border: '1px solid rgba(79,209,255,0.3)', color: '#4FD1FF' }}>
              Record Rough Titre →
            </motion.button>
          </motion.div>
        )}
        <div className="rounded-lg p-2.5 text-xs font-mono" style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D' }}>
          <strong>WAEC:</strong> Rough titre is always excluded from the concordant average.
        </div>
      </div>
    </div>
  );
}

function TitAccurateTitration({ onComplete }: { onComplete: () => void }) {
  const titres = [
    { label: 'Rough', value: '26.90', rough: true },
    { label: 'Titre 1', value: '26.40', rough: false },
    { label: 'Titre 2', value: '26.50', rough: false },
    { label: 'Titre 3', value: '26.40', rough: false },
  ];
  const [selected, setSelected] = useState<number[]>([]);
  const concordant = [1, 3]; // indices of Titre 1 and Titre 3

  function toggle(i: number) {
    if (titres[i].rough) return;
    if (selected.includes(i)) { setSelected(selected.filter(x => x !== i)); return; }
    if (selected.length >= 2) return;
    const next = [...selected, i];
    setSelected(next);
    if (next.length === 2) {
      const correct = next.includes(1) && next.includes(3);
      if (correct) setTimeout(onComplete, 600);
    }
  }

  const bothSelected = selected.length === 2;
  const correct = selected.includes(1) && selected.includes(3);

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Click the TWO concordant titres (within 0.10 cm³ of each other). Ignore the rough titre.</p>
      <div className="overflow-x-auto w-full max-w-sm">
        <table className="w-full text-xs font-mono text-center" style={{ borderCollapse: 'collapse', border: '1px solid var(--border)' }}>
          <thead>
            <tr style={{ background: 'rgba(79,209,255,0.08)' }}>
              {['Run', 'Volume (cm³)', 'Select'].map(h => <th key={h} className="px-3 py-2" style={{ color: 'var(--accent)', border: '1px solid var(--border)' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {titres.map((t, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)', opacity: t.rough ? 0.45 : 1 }}>
                <td className="px-3 py-2" style={{ border: '1px solid var(--border)', color: t.rough ? 'rgba(239,68,68,0.6)' : 'var(--text-secondary)', fontStyle: t.rough ? 'italic' : 'normal' }}>{t.label}{t.rough ? ' *' : ''}</td>
                <td className="px-3 py-2" style={{ border: '1px solid var(--border)', color: t.rough ? 'rgba(239,68,68,0.6)' : 'var(--text-secondary)' }}>{t.value}</td>
                <td className="px-3 py-2" style={{ border: '1px solid var(--border)' }}>
                  {t.rough ? <span style={{ color: 'rgba(239,68,68,0.5)' }}>excluded</span> : (
                    <button onClick={() => toggle(i)}
                      className="w-5 h-5 rounded border-2 transition-all mx-auto flex items-center justify-center"
                      style={{ borderColor: selected.includes(i) ? 'var(--accent2)' : 'var(--border)', background: selected.includes(i) ? 'rgba(122,255,178,0.15)' : 'transparent' }}>
                      {selected.includes(i) && <CheckCircle className="w-3 h-3" style={{ color: 'var(--accent2)' }} />}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] font-mono italic" style={{ color: 'rgba(239,68,68,0.6)' }}>* Rough titre is always excluded from the average.</p>
      {bothSelected && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono"
          style={{ color: correct ? 'var(--accent2)' : 'var(--danger)' }}>
          {correct ? '✓ Correct! Titre 1 & 3 differ by 0.00 cm³ — concordant. Average = 26.40 cm³' : '✗ Not concordant. Check which titres agree within 0.10 cm³.'}
        </motion.p>
      )}
    </div>
  );
}

function TitCalculate({ onComplete }: { onComplete: () => void }) {
  const questions = [
    { q: 'Average titre (from T1 and T3)?', options: ['26.40 cm³', '26.50 cm³', '26.60 cm³', '26.93 cm³'], correct: 0 },
    { q: 'n(Na₂CO₃) in 25.0 cm³ at 0.10 mol dm⁻³?', options: ['0.0010 mol', '0.0025 mol', '0.0050 mol', '0.10 mol'], correct: 1 },
    { q: 'n(HCl) used? [Na₂CO₃ : HCl = 1 : 2]', options: ['0.0010 mol', '0.0025 mol', '0.0050 mol', '0.010 mol'], correct: 2 },
    { q: 'C(HCl) = n ÷ V? [V = 26.40 cm³]', options: ['0.095 mol dm⁻³', '0.148 mol dm⁻³', '0.189 mol dm⁻³', '0.210 mol dm⁻³'], correct: 2 },
  ];
  const [answers, setAnswers] = useState<Record<number, number>>({});

  function pick(qi: number, oi: number) {
    const next = { ...answers, [qi]: oi };
    setAnswers(next);
    if (Object.keys(next).length === questions.length && next[qi] === questions[qi].correct) {
      const allCorrect = questions.every((q, i) => next[i] === q.correct);
      if (allCorrect) setTimeout(onComplete, 600);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <p className="text-sm font-mono text-center mb-1" style={{ color: 'var(--muted)' }}>Answer each calculation step. Build the full answer chain.</p>
      {questions.map((q, qi) => (
        <div key={qi} className="rounded-xl p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-mono mb-2" style={{ color: 'var(--text)' }}>Step {qi + 1}: {q.q}</p>
          <div className="flex gap-2 flex-wrap">
            {q.options.map((opt, oi) => {
              const picked = answers[qi] === oi;
              const isCorrect = oi === q.correct;
              return (
                <button key={oi} onClick={() => pick(qi, oi)}
                  className="px-2 py-1 rounded font-mono text-[10px] border transition-all"
                  style={{
                    background: picked ? (isCorrect ? 'rgba(122,255,178,0.12)' : 'rgba(239,68,68,0.12)') : 'transparent',
                    borderColor: picked ? (isCorrect ? 'rgba(122,255,178,0.5)' : 'rgba(239,68,68,0.5)') : 'var(--border)',
                    color: picked ? (isCorrect ? 'var(--accent2)' : 'var(--danger)') : 'var(--text-secondary)',
                  }}>{opt}</button>
              );
            })}
          </div>
          {answers[qi] !== undefined && (
            <p className="text-[10px] font-mono mt-1.5" style={{ color: answers[qi] === q.correct ? 'var(--accent2)' : 'var(--danger)' }}>
              {answers[qi] === q.correct ? '✓ Correct' : '✗ Try again'}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

const EXP2_COMPONENTS = [TitSetup, TitFillBurette, TitPipette, TitAddIndicator, TitRoughTitration, TitAccurateTitration, TitCalculate];

// ─── EXPERIMENT 3: Qualitative Analysis (Cation ID) ───────────

const QA_SUBSTANCES_DATA = [
  { id: 'A', cation: 'Fe²⁺', salt: 'Iron(II) sulphate', color: '#16a34a', colorName: 'Green precipitate', excessResult: 'Remains — does not dissolve', nh3Result: 'Green precipitate (same)', ionicEq: 'Fe²⁺(aq) + 2OH⁻(aq) → Fe(OH)₂(s)' },
  { id: 'B', cation: 'Fe³⁺', salt: 'Iron(III) chloride', color: '#b45309', colorName: 'Brown/rust precipitate', excessResult: 'Remains — does not dissolve', nh3Result: 'Brown precipitate', ionicEq: 'Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)' },
  { id: 'C', cation: 'Cu²⁺', salt: 'Copper(II) sulphate', color: '#3b82f6', colorName: 'Blue precipitate', excessResult: 'Remains (not amphoteric)', nh3Result: 'Dissolves → deep blue solution [Cu(NH₃)₄]²⁺', ionicEq: 'Cu²⁺(aq) + 2OH⁻(aq) → Cu(OH)₂(s)' },
  { id: 'D', cation: 'Zn²⁺', salt: 'Zinc sulphate', color: '#d1d5db', colorName: 'White precipitate', excessResult: 'Dissolves — Zn is amphoteric: Zn(OH)₂ + 2OH⁻ → [Zn(OH)₄]²⁻', nh3Result: 'Dissolves → colourless solution', ionicEq: 'Zn²⁺(aq) + 2OH⁻(aq) → Zn(OH)₂(s)' },
];

const QA_STEPS_DATA = [
  { id: 1, title: 'Set Up Test Tubes', instruction: 'Label four clean, dry test tubes A to D and place them in the rack. Rinse each with a small amount of the solution it will contain.', action: 'Click each test tube to label and place it.', points: 6 },
  { id: 2, title: 'Add Unknown Solutions', instruction: 'Using a clean dropper, add about 2 cm³ of each solution (A–D) to its labelled test tube. These are the four unknown salt solutions you will identify.', action: 'Click each solution bottle to transfer into the correct tube.', points: 6 },
  { id: 3, title: 'Add Aqueous NaOH', instruction: 'Add about 5 drops of dilute NaOH solution to each test tube. Observe any precipitate that forms. The colour of the precipitate identifies the metal cation.', action: 'Click the NaOH bottle, then click each test tube in order.', points: 8 },
  { id: 4, title: 'Record Precipitate Colours', instruction: 'WAEC colour chart: Fe²⁺ = green ppt · Fe³⁺ = brown/rust ppt · Cu²⁺ = blue ppt · Zn²⁺ = white ppt · Ca²⁺ = white ppt · Pb²⁺ = white ppt · NH₄⁺ = no ppt (gives gas on heating)', action: 'Select the precipitate colour for each test tube.', points: 8 },
  { id: 5, title: 'Identify the Cations', instruction: 'Based on your precipitate colours, identify the cation in each solution. Use the WAEC standard colour chart as your reference.', action: 'Select the cation for each solution.', points: 8 },
  { id: 6, title: 'Test with Excess NaOH', instruction: 'Add excess NaOH to each tube. Amphoteric hydroxides (Zn, Pb, Al) dissolve in excess — key for WAEC distinction. Fe(OH)₂, Fe(OH)₃, Cu(OH)₂ do NOT dissolve in excess NaOH.', action: 'Select what happens when excess NaOH is added.', points: 7 },
  { id: 7, title: 'Write Ionic Equations', instruction: 'Write the ionic equation for the reaction of each cation with NaOH. WAEC requires: cation + OH⁻ → precipitate, with state symbols.', action: 'Select the correct ionic equation for each cation.', points: 7 },
];

function QAStep1({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState(0);
  const labels = ['A', 'B', 'C', 'D'];
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Click each test tube to label and place it in the rack.</p>
      <div className="flex gap-5 justify-center">
        {labels.map((label, i) => (
          <motion.div key={i} whileTap={{ scale: 0.95 }} onClick={() => {
            if (i === placed) setPlaced(p => { const n = p + 1; if (n === 4) setTimeout(onComplete, 300); return n; });
          }} className="flex flex-col items-center gap-1.5 cursor-pointer" style={{ opacity: i < placed ? 1 : i === placed ? 1 : 0.3 }}>
            <svg width="16" height="52" viewBox="0 0 16 52" fill="none">
              <rect x="1" y="0" width="14" height="42" rx="7" stroke={i < placed ? 'rgba(122,255,178,0.6)' : i === placed ? 'rgba(79,209,255,0.6)' : 'rgba(79,209,255,0.2)'} strokeWidth="1.2" fill="rgba(13,21,32,0.5)" />
              {i < placed && <circle cx="8" cy="48" r="3" fill="rgba(122,255,178,0.6)" />}
            </svg>
            <span className="text-[10px] font-mono font-bold" style={{ color: i < placed ? 'var(--accent2)' : 'var(--accent)' }}>{label}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{placed} / 4 placed</p>
    </div>
  );
}

function QAStep2({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState<string[]>([]);
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Add 2 cm³ of each unknown solution to its labelled test tube.</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {QA_SUBSTANCES_DATA.map(s => (
          <motion.button key={s.id} whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (done.includes(s.id)) return;
              const next = [...done, s.id];
              setDone(next);
              if (next.length === QA_SUBSTANCES_DATA.length) setTimeout(onComplete, 400);
            }}
            className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all"
            style={{ background: done.includes(s.id) ? 'rgba(122,255,178,0.08)' : 'var(--surface)', border: `1px solid ${done.includes(s.id) ? 'rgba(122,255,178,0.35)' : 'var(--border)'}` }}>
            <div className="w-5 h-5 rounded-full border" style={{ background: done.includes(s.id) ? s.color : 'transparent', borderColor: 'rgba(79,209,255,0.3)', opacity: 0.7 }} />
            <span className="text-[10px] font-mono font-bold" style={{ color: done.includes(s.id) ? 'var(--accent2)' : 'var(--text)' }}>Solution {s.id}</span>
            <span className="text-[9px] font-mono" style={{ color: 'var(--muted)' }}>unknown</span>
            {done.includes(s.id) && <CheckCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent2)' }} />}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function QAStep3({ onComplete }: { onComplete: () => void }) {
  const [naohSelected, setNaohSelected] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Select NaOH, then click each test tube to add 5 drops.</p>
      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setNaohSelected(true)}
        className="px-4 py-2 rounded-lg font-mono text-xs border transition-all"
        style={{ background: naohSelected ? 'rgba(59,130,246,0.12)' : 'var(--surface)', borderColor: naohSelected ? '#3b82f6' : 'var(--border)', color: naohSelected ? '#3b82f6' : 'var(--muted)' }}>
        🧴 Aqueous NaOH (aq) {naohSelected ? '(selected)' : ''}
      </motion.button>
      <div className="flex gap-4">
        {QA_SUBSTANCES_DATA.map(s => (
          <motion.div key={s.id} className={naohSelected && !done.includes(s.id) ? 'cursor-pointer' : 'cursor-default'}
            whileTap={naohSelected ? { scale: 0.92 } : {}}
            onClick={() => {
              if (!naohSelected || done.includes(s.id)) return;
              const next = [...done, s.id];
              setDone(next);
              if (next.length === QA_SUBSTANCES_DATA.length) setTimeout(onComplete, 700);
            }}>
            <MiniBeaker color={done.includes(s.id) ? s.color : undefined} label={`Tube ${s.id}`} animating={done.includes(s.id)} />
            {done.includes(s.id) && <p className="text-[8px] font-mono text-center mt-0.5" style={{ color: s.color, maxWidth: '44px' }}>{s.colorName.split(' ')[0]}</p>}
          </motion.div>
        ))}
      </div>
      <p className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{done.length} / 4 tubes tested</p>
    </div>
  );
}

function QAStep4({ onComplete }: { onComplete: () => void }) {
  const colorOptions = [
    { label: 'Green', hex: '#16a34a' }, { label: 'Brown', hex: '#b45309' },
    { label: 'Blue', hex: '#3b82f6' }, { label: 'White', hex: '#d1d5db' },
    { label: 'No ppt', hex: '#4b5563' },
  ];
  const [selected, setSelected] = useState<Record<string, string>>({});
  function pick(id: string, hex: string) {
    const next = { ...selected, [id]: hex };
    setSelected(next);
    if (Object.keys(next).length === QA_SUBSTANCES_DATA.length) {
      const correct = QA_SUBSTANCES_DATA.every(s => next[s.id] === s.color);
      if (correct) setTimeout(onComplete, 500);
    }
  }
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Select the precipitate colour for each test tube.</p>
      {QA_SUBSTANCES_DATA.map(s => (
        <div key={s.id} className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full shrink-0" style={{ background: s.color, opacity: 0.7 }} />
          <span className="text-xs font-mono w-16 shrink-0" style={{ color: 'var(--text)' }}>Tube {s.id}</span>
          <div className="flex gap-2">
            {colorOptions.map(c => (
              <button key={c.label} onClick={() => pick(s.id, c.hex)} title={c.label}
                className="w-7 h-7 rounded-full border-2 transition-all"
                style={{ background: c.hex, borderColor: selected[s.id] === c.hex ? '#fff' : 'transparent', opacity: 0.8, transform: selected[s.id] === c.hex ? 'scale(1.2)' : 'scale(1)' }} />
            ))}
          </div>
          {selected[s.id] && (
            <span className="text-[9px] font-mono" style={{ color: selected[s.id] === s.color ? 'var(--accent2)' : 'var(--danger)' }}>
              {selected[s.id] === s.color ? '✓' : '✗'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function QAStep5({ onComplete }: { onComplete: () => void }) {
  const cations = ['Fe²⁺', 'Fe³⁺', 'Cu²⁺', 'Zn²⁺'];
  const [selected, setSelected] = useState<Record<string, string>>({});
  function pick(id: string, cation: string) {
    const next = { ...selected, [id]: cation };
    setSelected(next);
    if (Object.keys(next).length === QA_SUBSTANCES_DATA.length) {
      const correct = QA_SUBSTANCES_DATA.every(s => next[s.id] === s.cation);
      if (correct) setTimeout(onComplete, 500);
    }
  }
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Identify the cation in each solution based on the precipitate colour.</p>
      {QA_SUBSTANCES_DATA.map(s => (
        <div key={s.id} className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full shrink-0" style={{ background: s.color, opacity: 0.7 }} />
          <span className="text-xs font-mono w-20 shrink-0" style={{ color: 'var(--text)' }}>Tube {s.id} ({s.colorName.split(' ')[0]})</span>
          <div className="flex gap-2 flex-wrap">
            {cations.map(c => (
              <button key={c} onClick={() => pick(s.id, c)}
                className="px-2 py-1 rounded font-mono text-[10px] border transition-all"
                style={{
                  background: selected[s.id] === c ? (c === s.cation ? 'rgba(122,255,178,0.12)' : 'rgba(239,68,68,0.12)') : 'transparent',
                  borderColor: selected[s.id] === c ? (c === s.cation ? 'rgba(122,255,178,0.5)' : 'rgba(239,68,68,0.5)') : 'var(--border)',
                  color: selected[s.id] === c ? (c === s.cation ? 'var(--accent2)' : 'var(--danger)') : 'var(--text-secondary)',
                }}>{c}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function QAStep6({ onComplete }: { onComplete: () => void }) {
  const outcomes = ['Precipitate remains', 'Precipitate dissolves'];
  const [selected, setSelected] = useState<Record<string, string>>({});
  function pick(id: string, val: string) {
    const s = QA_SUBSTANCES_DATA.find(x => x.id === id)!;
    const correct = id === 'D' ? 'Precipitate dissolves' : 'Precipitate remains';
    const next = { ...selected, [id]: val };
    setSelected(next);
    if (Object.keys(next).length === QA_SUBSTANCES_DATA.length) {
      const allCorrect = QA_SUBSTANCES_DATA.every(sub => {
        const c = sub.id === 'D' ? 'Precipitate dissolves' : 'Precipitate remains';
        return next[sub.id] === c;
      });
      if (allCorrect) setTimeout(onComplete, 600);
    }
  }
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>What happens when EXCESS NaOH is added to each tube?</p>
      {QA_SUBSTANCES_DATA.map(s => {
        const correct = s.id === 'D' ? 'Precipitate dissolves' : 'Precipitate remains';
        return (
          <div key={s.id} className="rounded-xl p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-mono mb-2" style={{ color: 'var(--text)' }}>
              <span style={{ color: s.color }}>●</span> Tube {s.id} — {s.cation}
            </p>
            <div className="flex gap-2">
              {outcomes.map(o => (
                <button key={o} onClick={() => pick(s.id, o)}
                  className="px-3 py-1 rounded font-mono text-[10px] border transition-all flex-1"
                  style={{
                    background: selected[s.id] === o ? (o === correct ? 'rgba(122,255,178,0.12)' : 'rgba(239,68,68,0.12)') : 'transparent',
                    borderColor: selected[s.id] === o ? (o === correct ? 'rgba(122,255,178,0.5)' : 'rgba(239,68,68,0.5)') : 'var(--border)',
                    color: selected[s.id] === o ? (o === correct ? 'var(--accent2)' : 'var(--danger)') : 'var(--text-secondary)',
                  }}>{o}</button>
              ))}
            </div>
            {selected[s.id] === correct && (
              <p className="text-[9px] font-mono mt-1.5" style={{ color: 'var(--text-muted)' }}>{s.excessResult}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function QAStep7({ onComplete }: { onComplete: () => void }) {
  const equations = [
    'Fe²⁺(aq) + 2OH⁻(aq) → Fe(OH)₂(s)',
    'Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)',
    'Cu²⁺(aq) + 2OH⁻(aq) → Cu(OH)₂(s)',
    'Zn²⁺(aq) + 2OH⁻(aq) → Zn(OH)₂(s)',
  ];
  const [selected, setSelected] = useState<Record<string, string>>({});
  function pick(id: string, eq: string) {
    const s = QA_SUBSTANCES_DATA.find(x => x.id === id)!;
    const next = { ...selected, [id]: eq };
    setSelected(next);
    if (Object.keys(next).length === QA_SUBSTANCES_DATA.length) {
      const allCorrect = QA_SUBSTANCES_DATA.every(sub => next[sub.id] === sub.ionicEq);
      if (allCorrect) setTimeout(onComplete, 600);
    }
  }
  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      <p className="text-sm font-mono text-center" style={{ color: 'var(--muted)' }}>Select the correct ionic equation for each cation + NaOH reaction.</p>
      {QA_SUBSTANCES_DATA.map(s => (
        <div key={s.id} className="rounded-xl p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-mono mb-2" style={{ color: 'var(--text)' }}>
            <span style={{ color: s.color }}>●</span> Tube {s.id} — {s.cation} ({s.colorName.split(' ')[0]} ppt)
          </p>
          <div className="flex flex-col gap-1.5">
            {equations.map(eq => (
              <button key={eq} onClick={() => pick(s.id, eq)}
                className="text-left px-3 py-1.5 rounded font-mono text-[10px] border transition-all"
                style={{
                  background: selected[s.id] === eq ? (eq === s.ionicEq ? 'rgba(122,255,178,0.08)' : 'rgba(239,68,68,0.08)') : 'transparent',
                  borderColor: selected[s.id] === eq ? (eq === s.ionicEq ? 'rgba(122,255,178,0.4)' : 'rgba(239,68,68,0.4)') : 'var(--border)',
                  color: selected[s.id] === eq ? (eq === s.ionicEq ? 'var(--accent2)' : 'var(--danger)') : 'var(--text-secondary)',
                }}>{eq}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const EXP3_COMPONENTS = [QAStep1, QAStep2, QAStep3, QAStep4, QAStep5, QAStep6, QAStep7];

// ─── Experiment definitions ───────────────────────────────────

const EXPERIMENTS = [
  {
    id: 'indicator',
    title: 'Indicator Testing',
    subtitle: 'Universal indicator + litmus on 5 WAEC standard solutions',
    tag: 'WAEC Type 1 — Classification',
    color: 'var(--accent)',
    icon: '🧪',
    difficulty: 'Beginner',
    topics: ['Universal indicator', 'Litmus paper', 'pH colour chart', 'Acid / Neutral / Alkali'],
    stepsData: STEPS,
    components: EXP1_COMPONENTS,
    usesStore: true,
  },
  {
    id: 'titration',
    title: 'Acid-Base Titration',
    subtitle: 'Na₂CO₃ vs HCl — standardise the acid with a primary standard',
    tag: 'WAEC Type 2 — Volumetric Analysis',
    color: 'var(--accent2)',
    icon: '⚗️',
    difficulty: 'Intermediate',
    topics: ['Burette technique', 'Concordant titres', 'Methyl orange end-point', 'Mole ratio 1:2'],
    stepsData: TITRATION_STEPS_DATA,
    components: EXP2_COMPONENTS,
    usesStore: false,
  },
  {
    id: 'qualitative',
    title: 'Qualitative Analysis',
    subtitle: 'Identify cations Fe²⁺, Fe³⁺, Cu²⁺, Zn²⁺ using NaOH',
    tag: 'WAEC Type 3 — Cation Identification',
    color: '#f97316',
    icon: '🔬',
    difficulty: 'Intermediate',
    topics: ['Precipitate colours', 'NaOH test', 'Excess NaOH', 'Ionic equations'],
    stepsData: QA_STEPS_DATA,
    components: EXP3_COMPONENTS,
    usesStore: false,
  },
];

// ─── Experiment Selector ──────────────────────────────────────

function ExperimentSelector({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-center mb-2" style={{ color: 'var(--accent)' }}>WAEC Chemistry Practical</p>
          <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>Choose Your Experiment</h1>
          <p className="text-sm font-mono text-center mb-8" style={{ color: 'var(--muted)' }}>Select a WAEC practical type to begin. Each experiment covers a different examined skill.</p>
          <div className="flex flex-col gap-4">
            {EXPERIMENTS.map(exp => (
              <motion.button key={exp.id} whileTap={{ scale: 0.985 }}
                onClick={() => onSelect(exp.id)}
                className="text-left w-full rounded-2xl p-5 transition-all"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                whileHover={{ borderColor: exp.color }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{exp.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-base font-bold" style={{ color: 'var(--text)' }}>{exp.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                        style={{ background: `${exp.color}18`, color: exp.color, border: `1px solid ${exp.color}40` }}>
                        {exp.difficulty}
                      </span>
                    </div>
                    <p className="text-xs font-mono mb-2" style={{ color: 'var(--muted)' }}>{exp.subtitle}</p>
                    <p className="text-[9px] font-mono mb-2" style={{ color: exp.color }}>{exp.tag}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {exp.topics.map(t => (
                        <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(79,209,255,0.06)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0 mt-1" style={{ color: 'var(--muted)' }} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────

export default function ExperimentPage() {
  const router = useRouter();
  const currentStep = useLabStore(s => s.currentStep);
  const experimentScore = useLabStore(s => s.experimentScore);
  const completeStep = useLabStore(s => s.completeStep);
  const setCurrentStep = useLabStore(s => s.setCurrentStep);


  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);
  const [localStep, setLocalStep] = useState(0);
  const [localScore, setLocalScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [stepDone, setStepDone] = useState(false);

  // Safety gate removed — students can access the experiment directly

  if (!selectedExpId) {
    return <ExperimentSelector onSelect={(id) => {
      const exp = EXPERIMENTS.find(e => e.id === id)!;
      setSelectedExpId(id);
      setLocalStep(exp.usesStore ? currentStep : 0);
      setLocalScore(0);
      setStepDone(false);
      setFeedback(null);
    }} />;
  }

  const exp = EXPERIMENTS.find(e => e.id === selectedExpId)!;
  const step = localStep < exp.stepsData.length ? exp.stepsData[localStep] : exp.stepsData[exp.stepsData.length - 1];
  const StepContent = exp.components[localStep] ?? exp.components[exp.components.length - 1];
  const progress = (localStep / exp.stepsData.length) * 100;
  const displayScore = exp.usesStore ? experimentScore : localScore;

  function handleStepComplete() {
    if (exp.usesStore) {
      completeStep(step.id, step.points);
    } else {
      setLocalScore(s => s + step.points);
    }
    setStepDone(true);
    const fb = 'correctFeedback' in step ? String(step.correctFeedback) : 'Step complete!';
    setFeedback(step.points > 0 ? `+${step.points} pts — ${fb}` : fb);
  }

  function handleNext() {
    setFeedback(null);
    setStepDone(false);
    if (localStep === exp.stepsData.length - 1) {
      if (exp.usesStore) {
        router.push('/lab/quiz');
      } else {
        setSelectedExpId(null);
        setLocalStep(0);
      }
    } else {
      if (exp.usesStore) setCurrentStep(localStep + 1);
      setLocalStep(s => s + 1);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedExpId(null); setLocalStep(0); setStepDone(false); }}
            className="flex items-center gap-1 text-xs font-mono transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Experiments
          </button>
          <span className="text-xs font-mono" style={{ color: exp.color }}>|</span>
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
            Step {localStep + 1} of {exp.stepsData.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>Score:</span>
          <span className="text-sm font-semibold font-mono" style={{ color: exp.color }}>{displayScore} pts</span>
        </div>
      </header>

      {/* Progress */}
      <div className="px-6 pt-4">
        <ProgressBar value={progress} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className={`w-full ${selectedExpId === 'titration' && localStep >= 1 && localStep <= 4 ? 'max-w-4xl' : 'max-w-2xl'}`}>
          <motion.div className="text-center mb-8" key={`${selectedExpId}-${localStep}`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: exp.color }}>{exp.tag}</p>
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--accent)' }}>
              Step {step.id}
            </p>
            <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
              {step.title}
            </h1>
            <p className="text-sm font-mono max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
              {step.instruction}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!stepDone ? (
              <motion.div key={`active-${localStep}`} className="w-full flex justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="w-full">
                  <StepContent onComplete={handleStepComplete} />
                </div>
              </motion.div>
            ) : (
              <motion.div key={`done-${localStep}`} className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                {feedback && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-sm"
                    style={{ background: 'rgba(122,255,178,0.08)', border: '1px solid rgba(122,255,178,0.25)', color: 'var(--accent2)' }}>
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {feedback}
                  </div>
                )}
                <Button size="lg" onClick={handleNext} className="min-w-[200px]">
                  {localStep === exp.stepsData.length - 1
                    ? (exp.usesStore ? 'Proceed to Quiz →' : '✓ Experiment Complete — Back to Menu')
                    : 'Next Step →'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom instruction */}
      <div className="px-4 pb-6">
        <div className="max-w-2xl mx-auto glass rounded-xl px-5 py-3 flex items-center gap-3">
          <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
          <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{step.action}</p>
        </div>
      </div>
    </div>
  );
}
