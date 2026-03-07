'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  BookOpen, FlaskConical, Calculator, MessageSquare,
  ChevronRight, Send, Loader2, RotateCcw, User, Bot,
} from 'lucide-react';
import Button from '@/components/ui/Button';

// ─── Types ────────────────────────────────────────────────────
type Tab = 'overview' | 'indicators' | 'calculations' | 'tutor';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Helpers ──────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-bold mb-3 mt-6 first:mt-0" style={{ color: 'var(--accent)' }}>
      {children}
    </h3>
  );
}
function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </p>
  );
}
function Callout({ children, color = 'accent' }: { children: React.ReactNode; color?: 'accent' | 'success' | 'warning' | 'danger' }) {
  const map = {
    accent:  { bg: 'rgba(79,209,255,0.06)',  border: 'rgba(79,209,255,0.2)',  text: 'var(--accent)' },
    success: { bg: 'rgba(34,197,94,0.06)',   border: 'rgba(34,197,94,0.2)',   text: 'var(--success)' },
    warning: { bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.2)',  text: 'var(--warning)' },
    danger:  { bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.2)',   text: 'var(--danger)' },
  }[color];
  return (
    <div className="rounded-lg p-4 mb-4 text-sm leading-relaxed font-mono"
      style={{ background: map.bg, border: `1px solid ${map.border}`, color: map.text }}>
      {children}
    </div>
  );
}
function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg px-4 py-3 my-3 text-center font-mono text-sm font-semibold"
      style={{ background: 'rgba(79,209,255,0.08)', border: '1px solid rgba(79,209,255,0.2)', color: 'var(--accent)' }}>
      {children}
    </div>
  );
}

// ─── pH colour table ──────────────────────────────────────────
const PH_ROWS = [
  { pH: '1–2',  color: '#dc2626', label: 'Red',    desc: 'Strong acid',   example: '0.1 mol dm⁻³ HCl' },
  { pH: '3–4',  color: '#f97316', label: 'Orange', desc: 'Weak acid',     example: 'Ethanoic acid (vinegar)' },
  { pH: '5–6',  color: '#eab308', label: 'Yellow', desc: 'Very weak acid',example: 'Carbonic acid (fizzy drink)' },
  { pH: '7',    color: '#22c55e', label: 'Green',  desc: 'Neutral',       example: 'Distilled water' },
  { pH: '8–9',  color: '#3b82f6', label: 'Blue',   desc: 'Weak alkali',   example: 'Na₂CO₃ solution' },
  { pH: '10–11',color: '#6366f1', label: 'Indigo', desc: 'Alkali',        example: 'Ammonia solution' },
  { pH: '12–14',color: '#a855f7', label: 'Violet', desc: 'Strong alkali', example: '0.1 mol dm⁻³ NaOH' },
];

// ─── Worked examples ──────────────────────────────────────────
const EXAMPLES = [
  {
    id: 1,
    title: 'pH from Concentration',
    tag: 'pH Calculation',
    question: 'Calculate the pH of a 0.01 mol dm⁻³ solution of hydrochloric acid (HCl). [HCl is fully dissociated]',
    steps: [
      { label: 'Step 1 — Write the dissociation', content: 'HCl(aq) → H⁺(aq) + Cl⁻(aq)  (strong acid, complete dissociation)' },
      { label: 'Step 2 — Find [H⁺]', content: '[H⁺] = concentration of HCl = 0.01 mol dm⁻³ = 10⁻² mol dm⁻³' },
      { label: 'Step 3 — Apply the formula', content: 'pH = −log[H⁺] = −log(10⁻²) = 2' },
    ],
    answer: 'pH = 2',
    tip: 'For strong acids, [H⁺] equals the molar concentration directly. Each unit drop in pH = 10× more acidic.',
  },
  {
    id: 2,
    title: 'Titration — Molar Concentration (1:1)',
    tag: 'Titration',
    question: '25.0 cm³ of NaOH solution was exactly neutralised by 20.0 cm³ of 0.10 mol dm⁻³ HCl. Find the concentration of the NaOH. [NaOH + HCl → NaCl + H₂O]',
    steps: [
      { label: 'Step 1 — Moles of HCl (known acid)', content: 'n(HCl) = C × V = 0.10 × (20.0 ÷ 1000) = 0.10 × 0.020 = 0.0020 mol' },
      { label: 'Step 2 — Mole ratio from equation', content: 'NaOH : HCl = 1 : 1   ∴ n(NaOH) = 0.0020 mol' },
      { label: 'Step 3 — Concentration of NaOH', content: 'C(NaOH) = n ÷ V = 0.0020 ÷ (25.0 ÷ 1000) = 0.0020 ÷ 0.025 = 0.080 mol dm⁻³' },
    ],
    answer: '[NaOH] = 0.080 mol dm⁻³',
    tip: 'Always convert cm³ → dm³ by dividing by 1000. In a 1:1 equation the moles are equal.',
  },
  {
    id: 3,
    title: 'Molar Mass & Concentration (Na₂CO₃)',
    tag: 'Molar Mass',
    question: '5.3 g of anhydrous sodium carbonate (Na₂CO₃) was dissolved in distilled water and made up to 500 cm³. Calculate the molar concentration. [Na = 23, C = 12, O = 16]',
    steps: [
      { label: 'Step 1 — Molar mass of Na₂CO₃', content: 'Mr = 2(23) + 12 + 3(16) = 46 + 12 + 48 = 106 g mol⁻¹' },
      { label: 'Step 2 — Moles of Na₂CO₃', content: 'n = mass ÷ Mr = 5.3 ÷ 106 = 0.050 mol' },
      { label: 'Step 3 — Volume in dm³', content: 'V = 500 cm³ ÷ 1000 = 0.500 dm³' },
      { label: 'Step 4 — Molar concentration', content: 'C = n ÷ V = 0.050 ÷ 0.500 = 0.10 mol dm⁻³' },
    ],
    answer: 'C(Na₂CO₃) = 0.10 mol dm⁻³',
    tip: 'Na₂CO₃ (Mr = 106) is the standard primary standard in WAEC titration practicals. Memorise this Mr.',
  },
  {
    id: 4,
    title: 'Titration — 1:2 Molar Ratio (H₂SO₄ + NaOH)',
    tag: 'Stoichiometry',
    question: '24.0 cm³ of 0.15 mol dm⁻³ H₂SO₄ reacted completely with 40.0 cm³ of NaOH. Find [NaOH]. [H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O]',
    steps: [
      { label: 'Step 1 — Moles of H₂SO₄ (known acid)', content: 'n(H₂SO₄) = 0.15 × (24.0 ÷ 1000) = 0.15 × 0.024 = 0.0036 mol' },
      { label: 'Step 2 — Mole ratio from equation', content: 'H₂SO₄ : NaOH = 1 : 2   ∴ n(NaOH) = 2 × 0.0036 = 0.0072 mol' },
      { label: 'Step 3 — Concentration of NaOH', content: 'C(NaOH) = 0.0072 ÷ (40.0 ÷ 1000) = 0.0072 ÷ 0.040 = 0.18 mol dm⁻³' },
    ],
    answer: '[NaOH] = 0.18 mol dm⁻³',
    tip: 'The 1:2 ratio is the most common WAEC trap. Always read the molar ratio from the balanced equation before calculating.',
  },
];

// ─── Suggested questions ──────────────────────────────────────
const SUGGESTED = [
  'What is the difference between a strong acid and a weak acid?',
  'How do I find the pH of a 0.05 mol dm⁻³ H₂SO₄ solution?',
  'Which indicator should I use for a Na₂CO₃ vs HCl titration?',
  'What is the ionic equation for HCl reacting with NaOH?',
  'How do I calculate the number of moles from a mass?',
  'Why does red litmus not change in an alkaline solution?',
];

// ─── Tab content components ───────────────────────────────────

function OverviewTab() {
  return (
    <div>
      <SectionTitle>What Are Acids and Bases?</SectionTitle>
      <Para>
        An <strong style={{ color: 'var(--text-primary)' }}>acid</strong> is a substance that produces hydrogen ions (H⁺) when dissolved in water (Arrhenius definition), or a proton donor (Brønsted-Lowry definition).
        A <strong style={{ color: 'var(--text-primary)' }}>base</strong> is a substance that accepts protons or produces hydroxide ions (OH⁻) in water.
      </Para>
      <Callout color="danger">
        Key examples of acids: HCl, H₂SO₄, HNO₃ (strong) · CH₃COOH, H₂CO₃ (weak)
      </Callout>
      <Callout color="accent">
        Key examples of bases/alkalis: NaOH, KOH (strong) · Na₂CO₃, NH₃(aq) (weak)
      </Callout>

      <SectionTitle>Strong vs Weak Acids</SectionTitle>
      <Para>
        A <strong style={{ color: 'var(--danger)' }}>strong acid</strong> fully dissociates in water — every molecule releases H⁺. A <strong style={{ color: 'var(--warning)' }}>weak acid</strong> only partially dissociates; an equilibrium exists between the undissociated and dissociated forms.
      </Para>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-xs font-mono" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Type', 'Dissociation', 'Example', 'Equation'].map(h => (
                <th key={h} className="px-3 py-2 text-left" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Strong acid', 'Complete (→)', 'HCl', 'HCl → H⁺ + Cl⁻'],
              ['Weak acid', 'Partial (⇌)', 'CH₃COOH', 'CH₃COOH ⇌ CH₃COO⁻ + H⁺'],
              ['Strong alkali', 'Complete (→)', 'NaOH', 'NaOH → Na⁺ + OH⁻'],
              ['Weak alkali', 'Partial (⇌)', 'Na₂CO₃', 'CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻'],
            ].map(([type, diss, ex, eq]) => (
              <tr key={type} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{type}</td>
                <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{diss}</td>
                <td className="px-3 py-2" style={{ color: 'var(--accent)' }}>{ex}</td>
                <td className="px-3 py-2" style={{ color: 'var(--text-muted)' }}>{eq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionTitle>Neutralisation</SectionTitle>
      <Para>
        When an acid reacts with a base, they neutralise each other to form a salt and water. The general ionic equation for any strong acid–strong base neutralisation is:
      </Para>
      <Formula>H⁺(aq) + OH⁻(aq) → H₂O(l)</Formula>
      <Para>
        The full equation for HCl + NaOH: <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>HCl + NaOH → NaCl + H₂O</span>
        {' '}and for H₂SO₄ + 2NaOH: <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O</span>
      </Para>

      <SectionTitle>The Substances in This Experiment</SectionTitle>
      <div className="space-y-2">
        {[
          { label: 'Solution A — Dilute HCl', detail: 'Strong acid. Fully dissociates. pH 1–2. Universal indicator: Red.', color: '#ef4444' },
          { label: 'Solution B — Ethanoic Acid (CH₃COOH)', detail: 'Weak acid. Partial dissociation. pH 3–4. Universal indicator: Orange.', color: '#f97316' },
          { label: 'Solution C — Distilled Water', detail: 'Neutral. No net dissociation. pH 7. Universal indicator: Green.', color: '#22c55e' },
          { label: 'Solution D — Na₂CO₃ Solution', detail: 'Weak alkali (salt hydrolysis). pH 10–11. Universal indicator: Blue.', color: '#3b82f6' },
          { label: 'Solution E — NaOH Solution', detail: 'Strong alkali. Fully dissociates. pH 13–14. Universal indicator: Purple.', color: '#a855f7' },
        ].map(({ label, detail, color }) => (
          <div key={label} className="flex items-start gap-3 rounded-lg px-3 py-2.5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <span className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ background: color }} />
            <div>
              <p className="text-xs font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndicatorsTab() {
  return (
    <div>
      <SectionTitle>The pH Scale</SectionTitle>
      <Para>
        The pH scale runs from 0 to 14. pH = −log[H⁺]. Solutions with pH &lt; 7 are acidic, pH = 7 is neutral, and pH &gt; 7 is alkaline. Each unit change in pH represents a 10× change in [H⁺].
      </Para>
      <Formula>pH = −log[H⁺]&nbsp;&nbsp;&nbsp;&nbsp;[H⁺] = 10^(−pH)</Formula>

      <SectionTitle>Universal Indicator Colour Chart</SectionTitle>
      <Para>Universal indicator is a mixture of several indicators that shows a continuous range of colours across the full pH scale.</Para>
      <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: 'var(--surface-2, #111d2e)', borderBottom: '1px solid var(--border)' }}>
              {['pH', 'Colour', 'Classification', 'Example Solution'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-mono uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PH_ROWS.map((row, i) => (
              <tr key={row.pH} style={{
                background: i % 2 === 0 ? 'var(--surface)' : 'rgba(255,255,255,0.02)',
                borderBottom: i < PH_ROWS.length - 1 ? '1px solid var(--border)' : undefined,
              }}>
                <td className="px-3 py-2.5 font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{row.pH}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full shrink-0" style={{ background: row.color }} />
                    <span className="font-mono" style={{ color: row.color }}>{row.label}</span>
                  </span>
                </td>
                <td className="px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>{row.desc}</td>
                <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{row.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionTitle>Litmus Paper Tests</SectionTitle>
      <div className="grid grid-cols-1 gap-3 mb-4">
        {[
          { paper: 'Blue Litmus', acid: 'Turns RED → confirms acid', neutral: 'No change', alkali: 'No change', paperColor: '#3b82f6' },
          { paper: 'Red Litmus',  acid: 'No change',  neutral: 'No change', alkali: 'Turns BLUE → confirms alkali', paperColor: '#ef4444' },
        ].map(({ paper, acid, neutral, alkali, paperColor }) => (
          <div key={paper} className="rounded-lg p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold font-mono mb-2" style={{ color: paperColor }}>{paper}</p>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="text-center p-2 rounded" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                <p className="font-bold mb-1">ACID</p><p>{acid}</p>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'rgba(34,197,94,0.08)', color: '#22c55e' }}>
                <p className="font-bold mb-1">NEUTRAL</p><p>{neutral}</p>
              </div>
              <div className="text-center p-2 rounded" style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}>
                <p className="font-bold mb-1">ALKALI</p><p>{alkali}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Choosing the Right Indicator for Titrations</SectionTitle>
      <Callout color="warning">
        WAEC tip: Universal indicator is NOT suitable for titrations — it changes colour gradually. Use a sharp indicator that changes at the equivalence point.
      </Callout>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Titration Type', 'Suitable Indicator', 'End-point Colour Change'].map(h => (
                <th key={h} className="px-3 py-2 text-left" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Strong acid + Strong base', 'Methyl orange or phenolphthalein', 'MO: red → yellow · PP: colourless → pink'],
              ['Weak acid + Strong base', 'Phenolphthalein', 'Colourless → pink (at pH ~8.2)'],
              ['Strong acid + Weak base', 'Methyl orange', 'Red → yellow (at pH ~4.0)'],
              ['Na₂CO₃ + HCl (WAEC common)', 'Methyl orange', 'Yellow → red at equivalence'],
            ].map(([type, ind, change]) => (
              <tr key={type} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{type}</td>
                <td className="px-3 py-2" style={{ color: 'var(--accent)' }}>{ind}</td>
                <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CalculationsTab() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <SectionTitle>Key Formulae</SectionTitle>
      <div className="grid grid-cols-1 gap-3 mb-6">
        {[
          { label: 'Moles from concentration', formula: 'n = C × V    (V in dm³)' },
          { label: 'Concentration', formula: 'C = n ÷ V    (V in dm³)' },
          { label: 'Moles from mass', formula: 'n = mass ÷ Mr' },
          { label: 'pH formula', formula: 'pH = −log[H⁺]' },
          { label: 'Volume conversion', formula: 'V(dm³) = V(cm³) ÷ 1000' },
          { label: 'Titration link', formula: 'C₁V₁ / n₁ = C₂V₂ / n₂' },
        ].map(({ label, formula }) => (
          <div key={label} className="flex items-center justify-between rounded-lg px-4 py-2.5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            <span className="font-mono text-xs font-semibold" style={{ color: 'var(--accent)' }}>{formula}</span>
          </div>
        ))}
      </div>

      <SectionTitle>Worked Examples</SectionTitle>
      <div className="space-y-3">
        {EXAMPLES.map((ex, i) => (
          <div key={ex.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {/* Header */}
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
              style={{ background: open === i ? 'rgba(79,209,255,0.08)' : 'var(--surface)' }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: 'rgba(79,209,255,0.15)', color: 'var(--accent)' }}>
                  {ex.id}
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{ex.title}</p>
                  <p className="text-[10px] font-mono uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>{ex.tag}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 transition-transform"
                style={{ color: 'var(--text-muted)', transform: open === i ? 'rotate(90deg)' : undefined }} />
            </button>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--border)' }}>
                    {/* Question */}
                    <div className="mt-3 mb-4 rounded-lg px-3 py-2.5 text-sm"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                      {ex.question}
                    </div>

                    {/* Steps */}
                    <div className="space-y-2 mb-4">
                      {ex.steps.map((step, j) => (
                        <div key={j} className="flex gap-3">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                            style={{ background: 'rgba(122,255,178,0.15)', color: 'var(--accent2)' }}>
                            {j + 1}
                          </span>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider font-mono mb-0.5" style={{ color: 'var(--text-muted)' }}>{step.label}</p>
                            <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{step.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Answer */}
                    <div className="rounded-lg px-4 py-2.5 mb-3 font-mono text-sm font-bold text-center"
                      style={{ background: 'rgba(122,255,178,0.08)', border: '1px solid rgba(122,255,178,0.25)', color: 'var(--accent2)' }}>
                      ∴ {ex.answer}
                    </div>

                    {/* Tip */}
                    <div className="rounded-lg px-3 py-2 text-xs font-mono"
                      style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', color: 'var(--warning)' }}>
                      💡 WAEC Tip: {ex.tip}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Tutor Tab ─────────────────────────────────────────────
function TutorTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: question };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: messages.slice(-6), // last 3 exchanges for context
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setMessages([...next, { role: 'assistant', content: data.answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '420px' }}>
      {/* Intro */}
      {messages.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              WAEC Chemistry AI Tutor
            </span>
          </div>
          <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
            Ask any question about acid-base chemistry, pH calculations, titration, or the WAEC practical paper. I&apos;ll show full step-by-step working.
          </p>
          <p className="text-[10px] uppercase tracking-widest font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
            Suggested questions
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((q) => (
              <button key={q} onClick={() => send(q)}
                className="text-[11px] px-3 py-1.5 rounded-full font-mono transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Message history */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: 'rgba(79,209,255,0.12)', border: '1px solid rgba(79,209,255,0.25)' }}>
                  <Bot className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                </div>
              )}
              <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'rounded-tr-sm'
                  : 'rounded-tl-sm'
              }`}
                style={{
                  background: m.role === 'user' ? 'rgba(79,209,255,0.1)' : 'var(--surface)',
                  border: `1px solid ${m.role === 'user' ? 'rgba(79,209,255,0.25)' : 'var(--border)'}`,
                  color: m.role === 'user' ? 'var(--accent)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                }}>
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: 'rgba(122,255,178,0.12)', border: '1px solid rgba(122,255,178,0.25)' }}>
                  <User className="w-3.5 h-3.5" style={{ color: 'var(--accent2)' }} />
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
                style={{ background: 'rgba(79,209,255,0.12)', border: '1px solid rgba(79,209,255,0.25)' }}>
                <Bot className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              </div>
              <div className="rounded-xl rounded-tl-sm px-4 py-3"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}
          {error && (
            <div className="text-xs font-mono px-3 py-2 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--danger)' }}>
              {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Clear button */}
      {messages.length > 0 && (
        <button onClick={() => { setMessages([]); setError(null); }}
          className="flex items-center gap-1.5 text-[10px] font-mono mb-3 self-end transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          <RotateCcw className="w-3 h-3" /> Clear chat
        </button>
      )}

      {/* Input */}
      <div className="flex gap-2 mt-auto">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
          placeholder="Ask a chemistry question…"
          className="flex-1 px-4 py-2.5 rounded-lg font-mono text-sm outline-none transition-all"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          disabled={loading}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
          style={{ background: 'rgba(79,209,255,0.12)', border: '1px solid rgba(79,209,255,0.3)', color: 'var(--accent)' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',      label: 'Overview',       icon: <BookOpen   className="w-4 h-4" /> },
  { id: 'indicators',    label: 'pH & Indicators', icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'calculations',  label: 'Calculations',    icon: <Calculator className="w-4 h-4" /> },
  { id: 'tutor',         label: 'AI Tutor',        icon: <MessageSquare className="w-4 h-4" /> },
];

export default function TheoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-deep)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <BookOpen className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="font-mono text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
            Theory — Acid-Base Chemistry
          </span>
        </motion.div>
        <button
          className="text-xs font-mono transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onClick={() => router.push('/lab')}
        >
          ← Back
        </button>
      </header>

      {/* Tab bar */}
      <div className="flex border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-4 py-3 font-mono text-xs whitespace-nowrap transition-all border-b-2"
            style={{
              borderBottomColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
              background: activeTab === tab.id ? 'rgba(79,209,255,0.04)' : 'transparent',
            }}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}>
              {activeTab === 'overview'     && <OverviewTab />}
              {activeTab === 'indicators'   && <IndicatorsTab />}
              {activeTab === 'calculations' && <CalculationsTab />}
              {activeTab === 'tutor'        && <TutorTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 px-4 py-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-deep)' }}>
        <div className="max-w-2xl mx-auto">
          <Button
            size="lg"
            variant="primary"
            onClick={() => router.push('/lab/safety')}
            className="w-full justify-center"
          >
            Proceed to Safety Check
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
