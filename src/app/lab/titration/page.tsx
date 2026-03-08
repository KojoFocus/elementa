'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ChevronRight, RotateCcw, CheckCircle,
  AlertTriangle, Beaker, Eye
} from 'lucide-react';
import {
  TITRATION_RUNS, TITRATION_SCENARIO, CALCULATION_STEPS,
  AVERAGE_TITRE, CONCORDANT_RUNS, WAEC_PRECAUTIONS
} from '@/data/waec/titration';

// ── Color helpers ────────────────────────────────────────────────
function interpolateColor(t: number): string {
  if (t < 0.85) {
    const p = t / 0.85;
    return `rgb(${Math.round(253 + (249 - 253) * p)},${Math.round(224 + (115 - 224) * p)},${Math.round(71 + (22 - 71) * p)})`;
  }
  const p = (t - 0.85) / 0.15;
  return `rgb(${Math.round(249 + (220 - 249) * p)},${Math.round(115 + (38 - 115) * p)},${Math.round(22 + (38 - 22) * p)})`;
}

// ── SVG: Setup Scene 1 — Fill Burette ───────────────────────────
function FillBuretteScene({ playing, fillLevel }: { playing: boolean; fillLevel: number }) {
  // Bench surface at y=375. All objects sit at or above this line.
  const BENCH = 375;
  // Burette: top at y=72 (below funnel neck), height=270, bottom at y=342
  const BTOP = 72; const BHEIGHT = 270;
  const liquidY = BTOP + BHEIGHT * (1 - fillLevel);
  const liquidH = BHEIGHT * fillLevel;

  // Bottle rests on bench: height=82, so rect y = BENCH-82 = 293
  const bottleY = BENCH - 82;
  // Bottle placed far right (x=240–294) — burette centred at x≈119
  const bottleCX = 267;

  return (
    <svg viewBox="0 0 340 420" className="w-full" style={{ maxHeight: 360 }}>
      {/* Lab bench */}
      <rect x="0" y={BENCH} width="340" height="45" fill="#0d1520" />
      <rect x="0" y={BENCH - 6} width="340" height="8" rx="2" fill="#1a2a3d" />

      {/* Retort stand base (sits on bench) */}
      <rect x="38" y={BENCH - 9} width="78" height="9" rx="3" fill="#3d5a70" />
      {/* Retort stand rod */}
      <rect x="70" y="22" width="7" height={BENCH - 28} rx="3" fill="#3d5a70" />
      {/* Clamp arm */}
      <rect x="70" y="50" width="80" height="8" rx="3" fill="#3d5a70" />

      {/* Funnel (at top of burette, x centred at ~119) */}
      <path d="M 103 30 L 112 58 L 126 58 L 135 30 Z" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      <rect x="113" y="58" width="7" height="16" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />

      {/* Burette tube */}
      <rect x="108" y={BTOP} width="22" height={BHEIGHT} rx="3"
        fill="rgba(13,21,32,0.6)" stroke="#4FD1FF" strokeWidth="1.2" />
      {/* Liquid fill — grows downward from top */}
      <clipPath id="burette-clip1"><rect x="109" y={BTOP} width="20" height={BHEIGHT} /></clipPath>
      <motion.rect
        x="109" y={liquidY} width="20" height={liquidH} rx="2"
        fill="rgba(100,200,255,0.45)"
        animate={{ y: liquidY, height: liquidH }}
        transition={{ duration: 0.15 }}
        clipPath="url(#burette-clip1)"
      />
      {/* Scale marks (0 at top = BTOP, 50 at bottom) */}
      {[0, 10, 20, 30, 40, 50].map(v => {
        const sy = BTOP + (v / 50) * BHEIGHT;
        return (
          <g key={v}>
            <line x1="105" y1={sy} x2="108" y2={sy} stroke="#4FD1FF" strokeWidth="0.8" />
            <text x="101" y={sy + 3} fill="#5a7a99" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {/* cm³ label */}
      <text x="103" y="27" fill="#5a7a99" fontSize="6" textAnchor="end">cm³</text>
      {/* Stopcock */}
      <rect x="100" y={BTOP + BHEIGHT} width="30" height="8" rx="4" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      {/* Nozzle tip — ends at bench level */}
      <path d={`M 116 ${BTOP + BHEIGHT + 8} L 113 ${BENCH - 14} L 119 ${BENCH - 14} Z`}
        fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1" />

      {/* HCl bottle on bench — lifts + tilts toward funnel when pouring */}
      <motion.g
        animate={playing
          ? { x: -148, y: -248, rotate: -38 }
          : { x: 0, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.15 }}
        style={{ transformOrigin: `${bottleCX}px ${BENCH}px` }}
      >
        {/* Liquid inside bottle */}
        <rect x={bottleCX - 24} y={bottleY + 4} width="48" height="73" rx="5"
          fill="rgba(100,200,255,0.25)" />
        {/* Bottle body */}
        <rect x={bottleCX - 27} y={bottleY} width="54" height="82" rx="8"
          fill="rgba(30,80,140,0.8)" stroke="#4FD1FF" strokeWidth="1.2" />
        {/* Bottle cap */}
        <rect x={bottleCX - 14} y={bottleY - 14} width="28" height="18" rx="5"
          fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
        {/* Cap tip */}
        <rect x={bottleCX - 4} y={bottleY - 22} width="8" height="10" rx="2"
          fill="#4FD1FF" opacity="0.7" />
        <text x={bottleCX} y={bottleY + 38} fill="#4FD1FF" fontSize="9" textAnchor="middle" fontWeight="bold">HCl</text>
        <text x={bottleCX} y={bottleY + 51} fill="#4FD1FF" fontSize="6.5" textAnchor="middle">unknown</text>
      </motion.g>

      {/* Liquid stream: appears inside funnel neck when filling */}
      {playing && fillLevel < 0.98 && (
        <motion.rect
          x="114" width="5" rx="2"
          fill="rgba(100,200,255,0.8)"
          y={74} height={0}
          animate={{ height: [0, 18, 18, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, delay: 0.7, ease: 'easeInOut' }}
        />
      )}
      {/* No flask in scene 1 — burette filling only needs the burette + bottle */}

      {/* Labels */}
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

// ── SVG: Setup Scene 2 — Pipette Flask ──────────────────────────
function PipetteScene({ phase }: { phase: 'idle' | 'fill' | 'transfer' | 'done' }) {
  // Bench surface y=375
  const BENCH = 375;

  // ── Beaker (left side, sits on bench) ─────────────────────────
  // Beaker: open-top vessel, x=28-98, bottom at BENCH
  const BKR_X = 28; const BKR_W = 70; const BKR_H = 85;
  const BKR_Y = BENCH - BKR_H; // top of beaker walls = 290
  // Solution level inside beaker — drops when pipette fills
  const fullLevel = 62; // px of solution at full
  const drawnLevel = (phase === 'fill' || phase === 'transfer' || phase === 'done') ? 38 : fullLevel;
  const solutionY = BENCH - drawnLevel;

  // ── Pipette position ───────────────────────────────────────────
  // Idle: centred at x=170, tip at y=340 (above bench)
  // Fill: moved over beaker — x≈63, dipped so tip is inside beaker at y≈340
  // Transfer: moved over flask — x≈268, tip above flask neck
  const pipetteX =
    phase === 'fill' ? 63 :
    phase === 'transfer' || phase === 'done' ? 268 :
    170;
  const pipetteY =
    phase === 'fill' ? 30 :    // dipped down into beaker
    phase === 'transfer' || phase === 'done' ? -20 :
    0;

  // Pipette has liquid when fill or transfer
  const hasLiquid = phase === 'fill' || phase === 'transfer';

  // ── Conical flask (right, sits on bench) ──────────────────────
  const FLX = 268; const FL_BENCH = BENCH; // flask centred at x=268

  return (
    <svg viewBox="0 0 340 420" className="w-full" style={{ maxHeight: 360 }}>
      {/* Lab bench */}
      <rect x="0" y={BENCH} width="340" height="45" fill="#0d1520" />
      <rect x="0" y={BENCH - 6} width="340" height="8" rx="2" fill="#1a2a3d" />

      {/* ── BEAKER on bench ─────────────────────────── */}
      {/* Beaker walls (open top) */}
      <path d={`M ${BKR_X} ${BKR_Y} L ${BKR_X} ${BENCH} L ${BKR_X + BKR_W} ${BENCH} L ${BKR_X + BKR_W} ${BKR_Y}`}
        fill="none" stroke="#7AFFB2" strokeWidth="1.5" />
      {/* Bottom */}
      <line x1={BKR_X} y1={BENCH} x2={BKR_X + BKR_W} y2={BENCH} stroke="#7AFFB2" strokeWidth="1.5" />
      {/* Pouring lip */}
      <path d={`M ${BKR_X + BKR_W - 8} ${BKR_Y} Q ${BKR_X + BKR_W + 4} ${BKR_Y - 4} ${BKR_X + BKR_W + 2} ${BKR_Y + 8}`}
        fill="none" stroke="#7AFFB2" strokeWidth="1.2" />
      {/* Solution inside — level drops */}
      <clipPath id="beaker-clip-p">
        <rect x={BKR_X + 2} y={BKR_Y} width={BKR_W - 4} height={BKR_H} />
      </clipPath>
      <motion.rect
        x={BKR_X + 2} width={BKR_W - 4} rx="1"
        fill="rgba(122,255,178,0.35)"
        y={solutionY} height={drawnLevel}
        animate={{ y: solutionY, height: drawnLevel }}
        transition={{ duration: 1.0, ease: 'easeOut', delay: phase === 'fill' ? 0.9 : 0 }}
        clipPath="url(#beaker-clip-p)"
      />
      {/* Graduation mark on beaker */}
      <line x1={BKR_X + BKR_W} y1={BENCH - fullLevel} x2={BKR_X + BKR_W + 6} y2={BENCH - fullLevel}
        stroke="#7AFFB2" strokeWidth="0.8" />
      {/* Beaker labels */}
      <text x={BKR_X + BKR_W / 2} y={BENCH - fullLevel / 2 + 4} fill="#7AFFB2" fontSize="7"
        textAnchor="middle" fontWeight="bold">Na₂CO₃</text>
      <text x={BKR_X + BKR_W / 2} y={BENCH - fullLevel / 2 + 14} fill="#7AFFB2" fontSize="5.5"
        textAnchor="middle">0.100 mol dm⁻³</text>
      <text x={BKR_X + BKR_W / 2} y={BENCH + 16} fill="#5a7a99" fontSize="7" textAnchor="middle">
        Na₂CO₃ soln
      </text>

      {/* ── VOLUMETRIC PIPETTE ────────────────────────── */}
      <motion.g
        animate={{ x: pipetteX - 170, y: pipetteY }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        {/* Upper stem */}
        <line x1="170" y1="90" x2="170" y2="178" stroke="#4FD1FF" strokeWidth="2.5" strokeLinecap="round" />
        {/* Bulb */}
        <ellipse cx="170" cy="210" rx="13" ry="26"
          fill="rgba(13,21,32,0.6)" stroke="#4FD1FF" strokeWidth="1.5" />
        {/* Liquid in bulb when filled */}
        {hasLiquid && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <ellipse cx="170" cy="210" rx="10.5" ry="23" fill="rgba(122,255,178,0.5)" />
            {/* Upper stem liquid */}
            <rect x="167" y="155" width="6" height="28" fill="rgba(122,255,178,0.5)" />
          </motion.g>
        )}
        {/* When draining into flask — level drops */}
        {phase === 'transfer' && (
          <motion.g initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1.0, duration: 1.2 }}>
            <ellipse cx="170" cy="210" rx="10.5" ry="23" fill="rgba(122,255,178,0.5)" />
          </motion.g>
        )}
        {/* Graduation line */}
        <line x1="162" y1="155" x2="178" y2="155" stroke="#4FD1FF" strokeWidth="1" />
        <text x="182" y="159" fill="#5a7a99" fontSize="6.5">25.0</text>
        {/* Lower stem */}
        <line x1="170" y1="236" x2="170" y2="320" stroke="#4FD1FF" strokeWidth="2.5" strokeLinecap="round" />
        {/* Tip */}
        <path d="M 166 320 L 170 348 L 174 320 Z"
          fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1" />
        {/* Suction bulb at top */}
        <ellipse cx="170" cy="85" rx="12" ry="10"
          fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      </motion.g>

      {/* ── CONICAL FLASK on bench ───────────────────── */}
      {/* White tile */}
      <rect x={FLX - 58} y={BENCH - 8} width="116" height="6" rx="2" fill="#1e3a50" />
      {/* Flask body */}
      <path d={`M ${FLX} ${BENCH - 55} L ${FLX - 52} ${BENCH - 6} L ${FLX + 52} ${BENCH - 6} Z`}
        fill="rgba(13,21,32,0.5)" stroke="#4FD1FF" strokeWidth="1.2" />
      {/* Flask neck */}
      <rect x={FLX - 7} y={BENCH - 72} width="14" height="19" rx="2"
        fill="rgba(13,21,32,0.5)" stroke="#4FD1FF" strokeWidth="1.2" />
      {/* Flask rim */}
      <rect x={FLX - 10} y={BENCH - 80} width="20" height="10" rx="3"
        fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      {/* Flask liquid — fills in done phase */}
      {(phase === 'done') && (
        <motion.path
          d={`M ${FLX - 40} ${BENCH - 18} L ${FLX - 52} ${BENCH - 6} L ${FLX + 52} ${BENCH - 6} L ${FLX + 40} ${BENCH - 18} Z`}
          fill="rgba(122,255,178,0.35)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
      )}
      {/* Liquid stream from pipette tip to flask (during transfer) */}
      {phase === 'transfer' && (
        <motion.rect
          x={FLX - 2} y={BENCH - 80} width="4" height="0"
          fill="rgba(122,255,178,0.7)"
          animate={{ height: [0, 75, 75, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, delay: 1.0 }}
        />
      )}

      {/* Labels */}
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

// ── SVG: Setup Scene 3 — Indicator Drops ────────────────────────
function IndicatorScene({ dropsAdded }: { dropsAdded: number }) {
  // Flask starts empty — only gets colour when drops are added
  const flaskColor =
    dropsAdded === 0 ? 'rgba(13,21,32,0.5)' :
    dropsAdded >= 3  ? '#FDE047' :
    'rgba(253,224,71,0.25)';
  // Bench at y=385, flask base sits ON bench
  const BENCH = 385;
  const cx = 170;
  // Flask: base at BENCH-8=377, top of body (shoulder) at 295, neck at 263-295
  return (
    <svg viewBox="0 0 340 420" className="w-full" style={{ maxHeight: 360 }}>
      {/* Lab bench */}
      <rect x="0" y={BENCH} width="340" height="35" fill="#0d1520" />
      <rect x="0" y={BENCH - 6} width="340" height="8" rx="2" fill="#1a2a3d" />

      {/* Flask sitting on bench */}
      {/* Flask body — base at BENCH-8, top at 295 */}
      <motion.path d={`M ${cx} 295 L ${cx - 62} ${BENCH - 8} L ${cx + 62} ${BENCH - 8} Z`}
        fill={flaskColor}
        animate={{ fill: flaskColor }}
        transition={{ duration: 0.5 }} />
      <path d={`M ${cx} 295 L ${cx - 62} ${BENCH - 8} L ${cx + 62} ${BENCH - 8} Z`}
        fill="transparent" stroke="#4FD1FF" strokeWidth="1.4" />
      {/* Flask neck */}
      <rect x={cx - 8} y="263" width="16" height="34" rx="2"
        fill="rgba(13,21,32,0.5)" stroke="#4FD1FF" strokeWidth="1.2" />
      {/* Flask rim */}
      <rect x={cx - 11} y="257" width="22" height="9" rx="3"
        fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      <text x={cx} y={BENCH + 16} fill="#5a7a99" fontSize="7" textAnchor="middle">Na₂CO₃ + indicator</text>

      {/* Dropper bottle — centred at cx, above flask */}
      {/* Bottle body */}
      <rect x={cx - 20} y="90" width="40" height="80" rx="6"
        fill="rgba(251,146,60,0.2)" stroke="#FB923C" strokeWidth="1.2" />
      {/* Bottle cap */}
      <rect x={cx - 8} y="78" width="16" height="16" rx="4"
        fill="#2d4a5e" stroke="#FB923C" strokeWidth="1" />
      {/* Label text */}
      <text x={cx} y="124" fill="#FB923C" fontSize="7" textAnchor="middle" fontWeight="bold">Methyl</text>
      <text x={cx} y="135" fill="#FB923C" fontSize="7" textAnchor="middle">Orange</text>
      <text x={cx} y="146" fill="#FB923C" fontSize="6" textAnchor="middle">indicator</text>
      {/* Dropper nozzle */}
      <rect x={cx - 3} y="170" width="6" height="18" rx="2" fill="#FB923C" />
      {/* Dropper tip triangle */}
      <path d={`M ${cx - 4} 188 L ${cx} 200 L ${cx + 4} 188 Z`} fill="#FB923C" />

      {/* Dashed guide line: bottle tip → flask opening */}
      <line x1={cx} y1="202" x2={cx} y2="257"
        stroke="rgba(251,146,60,0.2)" strokeWidth="1" strokeDasharray="3,3" />

      {/* Animated drops — fall from nozzle tip into flask neck */}
      {[0, 1, 2].map(i => (
        dropsAdded > i && (
          <motion.circle key={i}
            cx={cx} r={3.5}
            fill="#F59E0B"
            initial={{ cy: 202, opacity: 1, scale: 1 }}
            animate={{ cy: [202, 257], opacity: [1, 0], scale: [1, 0.6] }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
          />
        )
      ))}

      {/* Drop count */}
      <text x={cx} y="237" fill="#FB923C" fontSize="10" textAnchor="middle" fontWeight="bold">
        {dropsAdded}/3 drops
      </text>

      {/* Colour confirmation */}
      {dropsAdded >= 3 && (
        <motion.text x={cx} y={BENCH - 14} fill="#FDE047" fontSize="9" textAnchor="middle" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Solution is YELLOW ✓
        </motion.text>
      )}
    </svg>
  );
}

// ── SVG: Main titration apparatus ──────────────────────────────
function TitrationApparatus({
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
      {/* Bench */}
      <rect x="0" y="480" width="240" height="20" fill="#0d1520" />
      <rect x="0" y="475" width="240" height="8" rx="2" fill="#1a2a3d" />

      {/* Stand */}
      <rect x="42" y="10" width="6" height="465" rx="3" fill="#3d5a70" />
      <rect x="8" y="468" width="74" height="10" rx="3" fill="#3d5a70" />
      <rect x="42" y="48" width="68" height="8" rx="3" fill="#3d5a70" />

      {/* Burette outer */}
      <rect x="108" y={BTOP} width="22" height={BHEIGHT + 12} rx="3"
        fill="rgba(13,21,32,0.7)" stroke="#4FD1FF" strokeWidth="1.2" />
      {/* Liquid */}
      {liquidH > 0 && (
        <motion.rect x="109.5" y={liquidTop} width="19" height={liquidH} rx="2"
          fill="rgba(100,200,255,0.45)"
          animate={{ y: liquidTop, height: liquidH }} transition={{ duration: 0.1 }} />
      )}
      {/* Scale marks */}
      {[0, 5, 10, 15, 20, 25, 30, 40, 50].map(v => {
        const y = BTOP + (v / 50) * BHEIGHT;
        return (
          <g key={v}>
            <line x1="106" y1={y} x2="108" y2={y} stroke="#4FD1FF" strokeWidth="0.8" />
            <text x="102" y={y + 3} fill="#5a7a99" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {/* Reading indicator */}
      <text x="134" y={liquidTop + 4} fill="#4FD1FF" fontSize="9" fontWeight="bold">
        {acidAdded.toFixed(2)}
      </text>
      <line x1="131" y1={liquidTop} x2="132" y2={liquidTop} stroke="#4FD1FF" strokeWidth="1" />
      <text x="104" y={BTOP - 6} fill="#5a7a99" fontSize="6" textAnchor="middle">cm³</text>

      {/* Stopcock */}
      <motion.g animate={{ rotate: tapOpen ? 90 : 0 }} style={{ transformOrigin: '119px 260px' }}>
        <rect x="103" y="256" width="32" height="8" rx="4" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />
      </motion.g>
      <line x1="119" y1="264" x2="119" y2="282" stroke="#4FD1FF" strokeWidth="1.5" />

      {/* Drop */}
      {showDrop && (
        <motion.circle cx="119" cy="282" r="3.5" fill="rgba(100,200,255,0.85)"
          initial={{ cy: 282, opacity: 1, r: 3.5 }}
          animate={{ cy: 340, opacity: 0, r: 2 }}
          transition={{ duration: 0.6, ease: 'easeIn' }}
        />
      )}

      {/* Flask stand */}
      <line x1="68" y1="348" x2="178" y2="348" stroke="#3d5a70" strokeWidth="2.5" />

      {/* Flask neck */}
      <rect x="113" y="328" width="12" height="22" rx="1"
        fill="rgba(13,21,32,0.5)" stroke="#4FD1FF" strokeWidth="1.2" />
      {/* Flask stopper */}
      <rect x="110" y="323" width="18" height="7" rx="2" fill="#2d4a5e" stroke="#4FD1FF" strokeWidth="1" />

      {/* Flask body */}
      <path d="M 113 348 L 72 455 L 166 455 L 125 348 Z"
        fill="rgba(13,21,32,0.45)" stroke="#4FD1FF" strokeWidth="1.2" />

      {/* Liquid pool — grows as acid is added (clipped to flask shape) */}
      <clipPath id="flask-clip-t">
        <path d="M 113 348 L 72 455 L 166 455 L 125 348 Z" />
      </clipPath>
      {(() => {
        // Liquid height grows from 8px (empty) to 80px (endpoint) as acidAdded → BHEIGHT
        const liqH = Math.min(80, 8 + (acidAdded / 50) * 72);
        const liqY = 455 - liqH;
        // Calculate x-extent at liqY using flask trapezoid edges
        const t = (455 - liqY) / (455 - 348); // 0=bottom,1=top
        const lx = 72 + t * (113 - 72);
        const rx2 = 166 - t * (166 - 125);
        return (
          <motion.path
            d={`M ${lx + 2} ${liqY} L ${lx} 455 L ${rx2} 455 L ${rx2 - 2} ${liqY} Z`}
            fill={flaskColor} opacity={0.9}
            animate={{ d: `M ${lx + 2} ${liqY} L ${lx} 455 L ${rx2} 455 L ${rx2 - 2} ${liqY} Z`, fill: flaskColor }}
            transition={{ duration: 0.3 }}
            clipPath="url(#flask-clip-t)"
          />
        );
      })()}

      {/* Swirl bubbles at endpoint */}
      {endpointReached && [0, 1, 2].map(i => (
        <motion.circle key={i} cx={100 + i * 18} cy={445} r={2.5}
          fill="rgba(255,255,255,0.3)"
          animate={{ cy: [445, 432, 445], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: 4, duration: 0.9, delay: i * 0.25 }} />
      ))}

      {/* Endpoint — glow the flask stroke instead of a rectangle */}
      {endpointReached && (
        <motion.path d="M 113 348 L 72 455 L 166 455 L 125 348 Z"
          fill="transparent"
          stroke="#DC2626"
          strokeWidth={0}
          animate={{ strokeWidth: [3, 0, 2, 0], opacity: [1, 0, 0.6, 0] }}
          transition={{ duration: 1.4 }} />
      )}

      {/* Color legend strip */}
      <defs>
        <linearGradient id="colorBar" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      <rect x="168" y="400" width="60" height="8" rx="4" fill="url(#colorBar)" opacity={0.6} />
      <text x="168" y="420" fill="#5a7a99" fontSize="5.5">Yellow</text>
      <text x="208" y="420" fill="#5a7a99" fontSize="5.5">Red</text>
    </svg>
  );
}

// ── Notebook component ──────────────────────────────────────────
function LabNotebook({ runs, currentRunIdx }: {
  runs: { label: string; titre: number | null; isPilot: boolean }[];
  currentRunIdx: number;
}) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(79,209,255,0.15)' }}>
      <div className="px-4 py-2.5 border-b text-xs font-mono font-semibold"
        style={{ background: 'rgba(79,209,255,0.06)', borderColor: 'rgba(79,209,255,0.15)', color: '#4FD1FF' }}>
        Lab Notebook — Burette Readings
      </div>
      <table className="w-full text-xs font-mono">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(79,209,255,0.1)' }}>
            {['Run', 'Init / cm³', 'Final / cm³', 'Titre / cm³', 'Valid?'].map(h => (
              <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--muted)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {runs.map((run, i) => {
            const isActive = i === currentRunIdx && run.titre === null;
            return (
              <tr key={run.label} style={{
                background: isActive ? 'rgba(79,209,255,0.04)' : 'transparent',
                borderBottom: '1px solid rgba(79,209,255,0.06)',
              }}>
                <td className="px-3 py-2 font-semibold" style={{ color: isActive ? '#4FD1FF' : 'var(--text)' }}>
                  {run.label}{isActive && <span className="animate-pulse ml-1">▶</span>}
                </td>
                <td className="px-3 py-2" style={{ color: 'var(--muted)' }}>
                  {run.titre !== null || isActive ? '0.00' : '—'}
                </td>
                <td className="px-3 py-2" style={{ color: 'var(--text)' }}>
                  {run.titre !== null ? run.titre.toFixed(2) : (isActive ? '…' : '—')}
                </td>
                <td className="px-3 py-2 font-bold"
                  style={{ color: run.titre !== null ? (run.isPilot ? '#F59E0B' : '#7AFFB2') : 'var(--muted)' }}>
                  {run.titre !== null ? run.titre.toFixed(2) : '—'}
                </td>
                <td className="px-3 py-2"
                  style={{ color: run.isPilot ? '#F59E0B' : (run.titre !== null ? '#7AFFB2' : 'var(--muted)') }}>
                  {run.titre !== null ? (run.isPilot ? 'Pilot ✗' : '✓') : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────
type Phase = 'intro' | 'setup-burette' | 'setup-pipette' | 'setup-indicator' | 'running' | 'analysis' | 'calculation' | 'complete';

export default function TitrationPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');

  // Setup state
  const [burette, setBurette] = useState({ filling: false, level: 0 });
  const [pipettePhase, setPipettePhase] = useState<'idle' | 'fill' | 'transfer' | 'done'>('idle');
  const [dropsAdded, setDropsAdded] = useState(0);

  // Titration state
  const [currentRunIdx, setCurrentRunIdx] = useState(0);
  const [acidAdded, setAcidAdded] = useState(0);
  const [tapOpen, setTapOpen] = useState(false);
  const [endpointReached, setEndpointReached] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [recordedRuns, setRecordedRuns] = useState([
    { label: 'Pilot', titre: null as number | null, isPilot: true },
    { label: 'Run 1', titre: null as number | null, isPilot: false },
    { label: 'Run 2', titre: null as number | null, isPilot: false },
    { label: 'Run 3', titre: null as number | null, isPilot: false },
  ]);
  const [calcStep, setCalcStep] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dropIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentRun = TITRATION_RUNS[currentRunIdx];
  const endpoint = currentRun?.endpoint ?? 22.40;
  const colorT = Math.min(1, acidAdded / endpoint);
  const flaskColor = endpointReached ? '#DC2626' : interpolateColor(colorT);

  const stopDrip = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    setTapOpen(false); setShowDrop(false);
  }, []);

  const openTap = useCallback(() => {
    if (endpointReached) return;
    setTapOpen(true);
    const rate = currentRunIdx === 0 ? 0.28 : 0.12;
    intervalRef.current = setInterval(() => {
      setAcidAdded(prev => {
        const next = prev + rate;
        if (next >= endpoint) {
          setEndpointReached(true); stopDrip(); return endpoint;
        }
        return next;
      });
    }, 50);
    dropIntervalRef.current = setInterval(() => {
      setShowDrop(true);
      setTimeout(() => setShowDrop(false), 600);
    }, 700);
  }, [currentRunIdx, endpoint, endpointReached, stopDrip]);

  useEffect(() => () => stopDrip(), [stopDrip]);

  function recordReading() {
    const titre = currentRun.titre;
    setRecordedRuns(prev => prev.map((r, i) => i === currentRunIdx ? { ...r, titre } : r));
    stopDrip();
    if (currentRunIdx < TITRATION_RUNS.length - 1) {
      setTimeout(() => {
        setCurrentRunIdx(c => c + 1);
        setAcidAdded(0); setEndpointReached(false);
      }, 600);
    } else {
      setTimeout(() => setPhase('analysis'), 800);
    }
  }

  // Burette filling animation
  function startFillBurette() {
    setBurette({ filling: true, level: 0 });
    const t = setInterval(() => {
      setBurette(b => {
        if (b.level >= 1) { clearInterval(t); return { filling: false, level: 1 }; }
        return { ...b, level: b.level + 0.025 };
      });
    }, 60);
  }

  function reset() {
    stopDrip();
    setPhase('intro');
    setCurrentRunIdx(0); setAcidAdded(0); setTapOpen(false); setEndpointReached(false);
    setBurette({ filling: false, level: 0 });
    setPipettePhase('idle'); setDropsAdded(0); setCalcStep(0);
    setRecordedRuns([
      { label: 'Pilot', titre: null, isPilot: true },
      { label: 'Run 1', titre: null, isPilot: false },
      { label: 'Run 2', titre: null, isPilot: false },
      { label: 'Run 3', titre: null, isPilot: false },
    ]);
  }

  const SETUP_STEPS = [
    { id: 'setup-burette', label: 'Fill Burette', num: 1 },
    { id: 'setup-pipette', label: 'Pipette Flask', num: 2 },
    { id: 'setup-indicator', label: 'Add Indicator', num: 3 },
  ];
  const currentSetupIdx = SETUP_STEPS.findIndex(s => s.id === phase);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b"
        style={{ background: 'rgba(8,12,16,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <button onClick={() => router.push('/lab')} className="flex items-center gap-1.5 text-xs font-mono" style={{ color: 'var(--muted)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Lab
        </button>
        <div className="flex items-center gap-2">
          {/* Phase progress dots */}
          {['intro', 'setup-burette', 'setup-pipette', 'setup-indicator', 'running', 'analysis', 'calculation', 'complete'].map((p, i) => {
            const phases = ['intro', 'setup-burette', 'setup-pipette', 'setup-indicator', 'running', 'analysis', 'calculation', 'complete'];
            const current = phases.indexOf(phase);
            return (
              <div key={p} className="w-1.5 h-1.5 rounded-full"
                style={{ background: i < current ? '#7AFFB2' : i === current ? '#4FD1FF' : 'rgba(255,255,255,0.12)' }} />
            );
          })}
        </div>
        <button onClick={reset} className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--muted)' }}>
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {/* ── INTRO ─────────────────────────────────── */}
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto">
              <div className="rounded-2xl border p-6 mb-4"
                style={{ background: 'rgba(79,209,255,0.04)', borderColor: 'rgba(79,209,255,0.2)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Beaker className="w-5 h-5" style={{ color: '#4FD1FF' }} />
                  <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Acid-Base Titration</h1>
                </div>
                <div className="text-xs font-mono mb-5 px-3 py-2.5 rounded-lg leading-relaxed"
                  style={{ background: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.2)', color: '#FCD34D' }}>
                  You are given: <strong>Solution A</strong> — Na₂CO₃ (0.100 mol dm⁻³, 500 cm³ made from 5.30 g)<br />
                  <strong>Solution B</strong> — HCl of unknown concentration in the burette.<br />
                  Determine the concentration of Solution B.
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-5 text-sm">
                  {[
                    { k: 'Reaction', v: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂', c: '#A78BFA' },
                    { k: 'Indicator', v: 'Methyl orange (3 drops)', c: '#FB923C' },
                    { k: 'Endpoint colour', v: 'Yellow → Permanent orange-red', c: '#FDE047' },
                    { k: 'Molar ratio', v: '1 Na₂CO₃ : 2 HCl', c: '#4FD1FF' },
                  ].map(item => (
                    <div key={item.k} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-[10px] font-mono mb-1" style={{ color: 'var(--muted)' }}>{item.k}</p>
                      <p className="font-semibold text-xs" style={{ color: item.c }}>{item.v}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>What you will do</p>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {['Fill burette with HCl', 'Pipette 25 cm³ Na₂CO₃ into flask', 'Add methyl orange', 'Titrate (pilot + 3 accurate runs)', 'Calculate C(HCl)'].map((s, i) => (
                      <div key={i} className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg"
                        style={{ background: 'rgba(79,209,255,0.06)', border: '1px solid rgba(79,209,255,0.12)', color: '#4FD1FF' }}>
                        <span className="font-bold">{i + 1}.</span> {s}
                      </div>
                    ))}
                  </div>
                </div>
                <motion.button onClick={() => { setPhase('setup-burette'); startFillBurette(); }}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{ background: 'rgba(79,209,255,0.12)', border: '1px solid rgba(79,209,255,0.3)', color: '#4FD1FF' }}
                  whileHover={{ background: 'rgba(79,209,255,0.18)' }} whileTap={{ scale: 0.98 }}>
                  Enter the Lab <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── SETUP: FILL BURETTE ───────────────────── */}
          {phase === 'setup-burette' && (
            <motion.div key="setup-burette" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border p-4" style={{ background: 'rgba(13,21,32,0.6)', borderColor: 'rgba(79,209,255,0.15)' }}>
                <div className="flex items-center gap-2 mb-3">
                  {SETUP_STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: i === 0 ? 'rgba(79,209,255,0.2)' : 'rgba(255,255,255,0.06)', color: i === 0 ? '#4FD1FF' : 'var(--muted)' }}>
                        {s.num}
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: i === 0 ? '#4FD1FF' : 'var(--muted)' }}>{s.label}</span>
                      {i < 2 && <ChevronRight className="w-3 h-3" style={{ color: 'var(--muted)' }} />}
                    </div>
                  ))}
                </div>
                <FillBuretteScene playing={burette.filling} fillLevel={burette.level} />
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Step 1: Fill the Burette</h2>
                  <p className="text-xs font-mono" style={{ color: '#4FD1FF' }}>Reagent: Dilute HCl (Solution B)</p>
                </div>
                <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: 'rgba(79,209,255,0.15)' }}>
                  {[
                    { n: 1, t: 'Close the stopcock (rotate horizontal to vertical)' },
                    { n: 2, t: 'Rinse the burette with a small volume of HCl — discard the washings' },
                    { n: 3, t: 'Fill the burette above the 0.00 cm³ mark using a small funnel' },
                    { n: 4, t: 'Open the tap briefly to expel air from the nozzle' },
                    { n: 5, t: 'Adjust the level to exactly 0.00 cm³. Read at the bottom of the meniscus at eye level' },
                  ].map(s => (
                    <div key={s.n} className="flex gap-2.5">
                      <span className="text-xs font-mono font-bold w-5 flex-shrink-0 mt-0.5" style={{ color: '#4FD1FF' }}>{s.n}.</span>
                      <p className="text-sm" style={{ color: 'var(--muted)' }}>{s.t}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3 text-xs font-mono" style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D' }}>
                  <strong>WAEC mark:</strong> Rinsing with the acid (not water) prevents dilution. Failure to rinse = inaccurate concentration result.
                </div>
                <motion.button
                  onClick={() => { setPipettePhase('fill'); setPhase('setup-pipette'); setTimeout(() => setPipettePhase('transfer'), 1500); setTimeout(() => setPipettePhase('done'), 3200); }}
                  disabled={burette.level < 0.9}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{
                    background: burette.level >= 0.9 ? 'rgba(79,209,255,0.12)' : 'rgba(79,209,255,0.04)',
                    border: `1px solid ${burette.level >= 0.9 ? 'rgba(79,209,255,0.3)' : 'rgba(79,209,255,0.1)'}`,
                    color: burette.level >= 0.9 ? '#4FD1FF' : 'var(--muted)',
                  }}
                  whileHover={burette.level >= 0.9 ? { background: 'rgba(79,209,255,0.18)' } : {}}
                  whileTap={burette.level >= 0.9 ? { scale: 0.98 } : {}}>
                  {burette.level < 0.9 ? 'Filling burette…' : 'Burette ready — Next Step'} <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── SETUP: PIPETTE ────────────────────────── */}
          {phase === 'setup-pipette' && (
            <motion.div key="setup-pipette" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border p-4" style={{ background: 'rgba(13,21,32,0.6)', borderColor: 'rgba(122,255,178,0.15)' }}>
                <PipetteScene phase={pipettePhase} />
                {pipettePhase === 'done' && (
                  <motion.div className="mt-3 text-center text-xs font-mono"
                    style={{ color: '#7AFFB2' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    ✓ 25.0 cm³ Na₂CO₃ transferred to flask
                  </motion.div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Step 2: Pipette the Alkali</h2>
                  <p className="text-xs font-mono" style={{ color: '#7AFFB2' }}>Reagent: Na₂CO₃ solution (0.100 mol dm⁻³)</p>
                </div>
                <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: 'rgba(122,255,178,0.15)' }}>
                  {[
                    { n: 1, t: 'Rinse the pipette with a small volume of Na₂CO₃ solution — discard' },
                    { n: 2, t: 'Draw up Na₂CO₃ to above the 25.0 cm³ graduation mark using a pipette filler' },
                    { n: 3, t: 'Adjust to exactly 25.0 cm³ — keep the graduation mark at eye level' },
                    { n: 4, t: 'Transfer into a clean (water-rinsed) conical flask. Allow to drain — do not blow out' },
                  ].map(s => (
                    <div key={s.n} className="flex gap-2.5">
                      <span className="text-xs font-mono font-bold w-5 flex-shrink-0 mt-0.5" style={{ color: '#7AFFB2' }}>{s.n}.</span>
                      <p className="text-sm" style={{ color: 'var(--muted)' }}>{s.t}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3 text-xs font-mono" style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D' }}>
                  <strong>WAEC mark:</strong> Do NOT rinse flask with Na₂CO₃ — only with distilled water. Rinsing with the alkali changes the number of moles.
                </div>
                <motion.button
                  onClick={() => setPhase('setup-indicator')}
                  disabled={pipettePhase !== 'done'}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{
                    background: pipettePhase === 'done' ? 'rgba(122,255,178,0.1)' : 'rgba(122,255,178,0.04)',
                    border: `1px solid ${pipettePhase === 'done' ? 'rgba(122,255,178,0.3)' : 'rgba(122,255,178,0.1)'}`,
                    color: pipettePhase === 'done' ? '#7AFFB2' : 'var(--muted)',
                  }}
                  whileHover={pipettePhase === 'done' ? { background: 'rgba(122,255,178,0.16)' } : {}}
                  whileTap={pipettePhase === 'done' ? { scale: 0.98 } : {}}>
                  {pipettePhase !== 'done' ? 'Transferring…' : 'Flask ready — Add Indicator'} <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── SETUP: INDICATOR ──────────────────────── */}
          {phase === 'setup-indicator' && (
            <motion.div key="setup-indicator" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border p-4" style={{ background: 'rgba(13,21,32,0.6)', borderColor: 'rgba(251,146,60,0.15)' }}>
                <IndicatorScene dropsAdded={dropsAdded} />
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>Step 3: Add Indicator</h2>
                  <p className="text-xs font-mono" style={{ color: '#FB923C' }}>Methyl orange — 3 drops only</p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: 'rgba(251,146,60,0.15)' }}>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>
                    Add exactly 3 drops of methyl orange to the conical flask. The solution should turn <strong style={{ color: '#FDE047' }}>YELLOW</strong>.
                  </p>
                  <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--muted)' }}>
                    Methyl orange is yellow in alkaline/neutral solution (Na₂CO₃ is alkaline).
                    It turns orange-red in acid at the endpoint.
                  </p>
                </div>
                <div className="flex gap-3">
                  {[1, 2, 3].map(drop => (
                    <motion.button key={drop}
                      onClick={() => setDropsAdded(d => Math.min(3, d + 1))}
                      disabled={dropsAdded >= drop}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold"
                      style={{
                        background: dropsAdded >= drop ? 'rgba(245,158,11,0.15)' : 'rgba(251,146,60,0.06)',
                        border: `1px solid ${dropsAdded >= drop ? 'rgba(245,158,11,0.4)' : 'rgba(251,146,60,0.18)'}`,
                        color: dropsAdded >= drop ? '#F59E0B' : '#FB923C',
                      }}
                      whileHover={dropsAdded < drop ? { background: 'rgba(251,146,60,0.12)' } : {}}
                      whileTap={dropsAdded < drop ? { scale: 0.95 } : {}}>
                      Drop {drop} {dropsAdded >= drop ? '✓' : ''}
                    </motion.button>
                  ))}
                </div>
                <div className="rounded-xl p-3 text-xs font-mono" style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D' }}>
                  <strong>WAEC:</strong> Only 2–3 drops of indicator. Too much indicator makes the endpoint colour change harder to see.
                </div>
                <motion.button
                  onClick={() => setPhase('running')}
                  disabled={dropsAdded < 3}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{
                    background: dropsAdded >= 3 ? 'rgba(79,209,255,0.12)' : 'rgba(79,209,255,0.04)',
                    border: `1px solid ${dropsAdded >= 3 ? 'rgba(79,209,255,0.3)' : 'rgba(79,209,255,0.1)'}`,
                    color: dropsAdded >= 3 ? '#4FD1FF' : 'var(--muted)',
                  }}
                  whileHover={dropsAdded >= 3 ? { background: 'rgba(79,209,255,0.18)' } : {}}
                  whileTap={dropsAdded >= 3 ? { scale: 0.98 } : {}}>
                  {dropsAdded < 3 ? 'Add all 3 drops' : 'Begin Titration'} <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── RUNNING ───────────────────────────────── */}
          {phase === 'running' && (
            <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-6">
              <div>
                <div className="rounded-2xl border p-4 mb-4"
                  style={{ background: 'rgba(13,21,32,0.6)', borderColor: 'rgba(79,209,255,0.15)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold" style={{ color: '#4FD1FF' }}>
                      {currentRun.label} {currentRun.isPilot ? '(Rough — fast)' : '(Accurate)'}
                    </span>
                    <motion.span key={String(endpointReached)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{ background: endpointReached ? 'rgba(220,38,38,0.15)' : tapOpen ? 'rgba(122,255,178,0.08)' : 'rgba(79,209,255,0.08)', color: endpointReached ? '#EF4444' : tapOpen ? '#7AFFB2' : '#4FD1FF' }}
                      initial={{ scale: 1.1 }} animate={{ scale: 1 }}>
                      {endpointReached ? '⚡ Endpoint!' : tapOpen ? 'Dripping…' : 'Tap closed'}
                    </motion.span>
                  </div>
                  <div style={{ height: 420 }}>
                    <TitrationApparatus acidAdded={acidAdded} tapOpen={tapOpen}
                      endpointReached={endpointReached} flaskColor={flaskColor} showDrop={showDrop} />
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[9px] font-mono" style={{ color: 'var(--muted)' }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FDE047' }} /> Yellow = start
                    <span className="w-2.5 h-2.5 rounded-full ml-2" style={{ background: '#FB923C' }} /> Nearing end
                    <span className="w-2.5 h-2.5 rounded-full ml-2" style={{ background: '#DC2626' }} /> Endpoint
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onPointerDown={openTap} onPointerUp={stopDrip} onPointerLeave={stopDrip}
                    disabled={endpointReached}
                    className="py-3.5 rounded-xl font-semibold text-sm select-none"
                    style={{
                      background: tapOpen ? 'rgba(122,255,178,0.15)' : 'rgba(122,255,178,0.06)',
                      border: '1px solid rgba(122,255,178,0.25)',
                      color: endpointReached ? 'var(--muted)' : '#7AFFB2',
                      opacity: endpointReached ? 0.5 : 1,
                    }}
                    whileTap={!endpointReached ? { scale: 0.97 } : {}}>
                    {tapOpen ? '● Dripping…' : 'Hold: Open Tap'}
                  </motion.button>
                  <motion.button onClick={recordReading} disabled={!endpointReached}
                    className="py-3.5 rounded-xl font-semibold text-sm"
                    style={{
                      background: endpointReached ? 'rgba(79,209,255,0.15)' : 'rgba(79,209,255,0.04)',
                      border: `1px solid ${endpointReached ? 'rgba(79,209,255,0.4)' : 'rgba(79,209,255,0.1)'}`,
                      color: endpointReached ? '#4FD1FF' : 'var(--muted)',
                    }}
                    whileHover={endpointReached ? { background: 'rgba(79,209,255,0.22)' } : {}}
                    whileTap={endpointReached ? { scale: 0.97 } : {}}>
                    Record Reading
                  </motion.button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border p-4" style={{ background: 'rgba(13,21,32,0.5)', borderColor: 'rgba(79,209,255,0.12)' }}>
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Current Step</p>
                  <AnimatePresence mode="wait">
                    <motion.p key={currentRunIdx + String(endpointReached)}
                      initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                      {endpointReached
                        ? `✓ Endpoint at ${currentRun.titre.toFixed(2)} cm³. The flask has turned permanently orange-red. Press "Record Reading" to log.`
                        : currentRun.isPilot
                          ? 'Pilot run: hold the button to add acid quickly. You are just finding the approximate endpoint — accuracy is not critical here.'
                          : `Accurate run ${currentRunIdx}: add acid SLOWLY near the expected endpoint (~${(currentRun.endpoint - 2).toFixed(0)} cm³). One drop at a time near the end. Swirl continuously.`}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <LabNotebook runs={recordedRuns} currentRunIdx={currentRunIdx} />
                <div className="rounded-xl p-3 text-xs font-mono leading-relaxed"
                  style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D' }}>
                  <strong>Eye position:</strong> Read the burette at eye level — looking up or down gives parallax error. Always read the bottom of the meniscus.
                </div>
                <div className="flex gap-1.5">
                  {TITRATION_RUNS.map((r, i) => (
                    <div key={r.id} className="flex-1 h-1.5 rounded-full"
                      style={{ background: i < currentRunIdx ? (r.isPilot ? 'rgba(245,158,11,0.6)' : 'rgba(122,255,178,0.6)') : i === currentRunIdx ? 'rgba(79,209,255,0.5)' : 'rgba(255,255,255,0.06)' }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ANALYSIS ──────────────────────────────── */}
          {phase === 'analysis' && (
            <motion.div key="analysis" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-5">
              <div className="text-center">
                <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: '#7AFFB2' }} />
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>All Runs Complete</h2>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Identify your concordant results and calculate the average titre.</p>
              </div>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(79,209,255,0.2)' }}>
                <div className="px-4 py-2.5 border-b text-xs font-mono font-semibold"
                  style={{ background: 'rgba(79,209,255,0.06)', borderColor: 'rgba(79,209,255,0.15)', color: '#4FD1FF' }}>
                  Burette Readings Table
                </div>
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(79,209,255,0.1)' }}>
                      {['Run', 'Initial', 'Final', 'Titre', 'Concordant?'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs" style={{ color: 'var(--muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TITRATION_RUNS.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid rgba(79,209,255,0.06)' }}>
                        <td className="px-4 py-2.5 font-semibold" style={{ color: r.isPilot ? '#F59E0B' : 'var(--text)' }}>{r.label}</td>
                        <td className="px-4 py-2.5" style={{ color: 'var(--muted)' }}>0.00</td>
                        <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{r.finalReading.toFixed(2)}</td>
                        <td className="px-4 py-2.5 font-bold" style={{ color: r.isPilot ? '#F59E0B' : '#4FD1FF' }}>{r.titre.toFixed(2)}</td>
                        <td className="px-4 py-2.5">
                          {r.isPilot ? <span style={{ color: '#F59E0B' }}>Pilot — excluded</span>
                            : <span style={{ color: '#7AFFB2' }}>✓ Yes (within ±0.10)</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl border p-4" style={{ background: 'rgba(122,255,178,0.05)', borderColor: 'rgba(122,255,178,0.2)' }}>
                <p className="text-xs font-mono mb-1" style={{ color: 'var(--muted)' }}>Average titre (concordant runs 1, 2, 3)</p>
                <p className="text-2xl font-bold font-mono" style={{ color: '#7AFFB2' }}>{AVERAGE_TITRE.toFixed(2)} cm³</p>
                <p className="text-xs font-mono mt-1" style={{ color: 'var(--muted)' }}>(22.40 + 22.35 + 22.40) ÷ 3</p>
              </div>
              <div className="rounded-xl p-3.5 text-xs font-mono" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5" />
                Pilot (23.50 cm³) excluded — done quickly, likely overshoots.
              </div>
              <motion.button onClick={() => setPhase('calculation')}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: 'rgba(79,209,255,0.12)', border: '1px solid rgba(79,209,255,0.3)', color: '#4FD1FF' }}
                whileHover={{ background: 'rgba(79,209,255,0.18)' }} whileTap={{ scale: 0.98 }}>
                Calculate Concentration <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* ── CALCULATION ────────────────────────────── */}
          {phase === 'calculation' && (
            <motion.div key="calc" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Finding C(HCl)</h2>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Write each step exactly as in your WAEC answer book.</p>
              </div>
              {CALCULATION_STEPS.map((step, i) => (
                <motion.div key={step.step}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: i <= calcStep ? 1 : 0.2, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border p-4"
                  style={{ background: i <= calcStep ? 'rgba(79,209,255,0.04)' : 'rgba(255,255,255,0.01)', borderColor: i <= calcStep ? 'rgba(79,209,255,0.2)' : 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: i <= calcStep ? 'rgba(79,209,255,0.15)' : 'rgba(255,255,255,0.04)', color: i <= calcStep ? '#4FD1FF' : 'var(--muted)' }}>
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-mono font-semibold mb-2" style={{ color: i <= calcStep ? 'var(--text)' : 'var(--muted)' }}>{step.label}</p>
                      <div className="font-mono text-sm space-y-1">
                        <p style={{ color: '#4FD1FF' }}>{step.formula}</p>
                        <p style={{ color: 'var(--muted)' }}>{step.working}</p>
                        <p className="font-bold text-base" style={{ color: '#7AFFB2' }}>{step.result}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {calcStep < CALCULATION_STEPS.length - 1
                ? <motion.button onClick={() => setCalcStep(c => c + 1)}
                    className="w-full py-3 rounded-xl font-semibold text-sm"
                    style={{ background: 'rgba(79,209,255,0.1)', border: '1px solid rgba(79,209,255,0.25)', color: '#4FD1FF' }}
                    whileHover={{ background: 'rgba(79,209,255,0.16)' }} whileTap={{ scale: 0.98 }}>
                    Next Step
                  </motion.button>
                : <motion.button onClick={() => setPhase('complete')}
                    className="w-full py-3 rounded-xl font-semibold text-sm"
                    style={{ background: 'rgba(122,255,178,0.12)', border: '1px solid rgba(122,255,178,0.3)', color: '#7AFFB2' }}
                    whileHover={{ background: 'rgba(122,255,178,0.18)' }} whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    View Results <ChevronRight className="w-4 h-4 inline ml-1" />
                  </motion.button>
              }
            </motion.div>
          )}

          {/* ── COMPLETE ───────────────────────────────── */}
          {phase === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-5">
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(122,255,178,0.12)', border: '2px solid rgba(122,255,178,0.4)' }}>
                  <CheckCircle className="w-8 h-8" style={{ color: '#7AFFB2' }} />
                </motion.div>
                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Titration Complete</h2>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>C(HCl) = <strong style={{ color: '#4FD1FF' }}>0.223 mol dm⁻³</strong></p>
              </div>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(79,209,255,0.2)' }}>
                <div className="px-4 py-2.5 text-xs font-mono font-semibold border-b"
                  style={{ background: 'rgba(79,209,255,0.06)', borderColor: 'rgba(79,209,255,0.2)', color: '#4FD1FF' }}>
                  WAEC Model Answer
                </div>
                <div className="p-4 text-sm font-mono space-y-1.5" style={{ color: 'var(--muted)' }}>
                  <p><span style={{ color: '#4FD1FF' }}>Average titre</span> = 22.38 cm³ (concordant Runs 1–3)</p>
                  <p><span style={{ color: '#4FD1FF' }}>n(Na₂CO₃)</span> = 0.100 × 25.0/1000 = 2.50 × 10⁻³ mol</p>
                  <p><span style={{ color: '#4FD1FF' }}>n(HCl)</span> = 2 × 2.50 × 10⁻³ = 5.00 × 10⁻³ mol</p>
                  <p><span style={{ color: '#7AFFB2', fontWeight: 'bold' }}>C(HCl)</span> = 5.00 × 10⁻³ ÷ 0.02238 = <strong style={{ color: '#7AFFB2' }}>0.223 mol dm⁻³</strong></p>
                </div>
              </div>
              <div className="rounded-xl border p-4" style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.04)' }}>
                <p className="text-xs font-mono font-semibold mb-3" style={{ color: '#F59E0B' }}>WAEC Precautions (write 3–4 in your exam)</p>
                {WAEC_PRECAUTIONS.slice(0, 6).map((p, i) => (
                  <div key={i} className="flex gap-2 mb-1.5">
                    <span className="text-xs" style={{ color: '#F59E0B' }}>•</span>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{p}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={reset} className="py-3 rounded-xl font-semibold text-sm border"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--muted)', background: 'transparent' }}>
                  Repeat Lab
                </button>
                <button onClick={() => router.push('/lab/flashcards?topic=titration')}
                  className="py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'rgba(79,209,255,0.12)', border: '1px solid rgba(79,209,255,0.3)', color: '#4FD1FF' }}>
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
