'use client';

import { motion, type Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FlaskConical, Beaker, Wind, Layers, Zap, BookOpen, ChevronRight, Star, ArrowLeft, Flame, Thermometer } from 'lucide-react';

const PRACTICALS = [
  {
    id: 'titration',
    href: '/lab/titration',
    icon: Beaker,
    accent: '#4FD1FF',
    bg: 'rgba(79,209,255,0.06)',
    border: 'rgba(79,209,255,0.2)',
    badge: 'Most Common',
    badgeColor: '#4FD1FF',
    title: 'Volumetric Analysis',
    subtitle: 'Acid-Base Titration',
    description: 'Fill the burette, pipette the alkali, add indicator and find the endpoint — then calculate the unknown concentration exactly as WAEC expects.',
    skills: ['Burette technique', 'Concordant titres', 'Mole calculations'],
    duration: '25 min',
    difficulty: 'Core',
  },
  {
    id: 'salt-analysis',
    href: '/lab/salt-analysis',
    icon: FlaskConical,
    accent: '#7AFFB2',
    bg: 'rgba(122,255,178,0.06)',
    border: 'rgba(122,255,178,0.2)',
    badge: 'Every Year',
    badgeColor: '#7AFFB2',
    title: 'Qualitative Analysis',
    subtitle: 'Unknown Salt Identification',
    description: 'Receive an unknown salt. Perform systematic tests — observe precipitates, gases, and colour changes — then write your inference like a WAEC examinee.',
    skills: ['Cation tests', 'Anion tests', 'Observation & Inference'],
    duration: '20 min',
    difficulty: 'Core',
  },
  {
    id: 'gas-tests',
    href: '/lab/gas-tests',
    icon: Wind,
    accent: '#FB923C',
    bg: 'rgba(251,146,60,0.06)',
    border: 'rgba(251,146,60,0.2)',
    badge: 'Key Topic',
    badgeColor: '#FB923C',
    title: 'Gas Tests',
    subtitle: 'Identifying Laboratory Gases',
    description: 'Test H₂, O₂, CO₂, NH₃, Cl₂ and more with the correct tests. See each reaction animated and drill the observations until they are automatic.',
    skills: ['8 common gases', 'Test methods', 'Confirming reactions'],
    duration: '15 min',
    difficulty: 'Essential',
  },
  {
    id: 'flame-tests',
    href: '/lab/flame-tests',
    icon: Flame,
    accent: '#F97316',
    bg: 'rgba(249,115,22,0.06)',
    border: 'rgba(249,115,22,0.2)',
    badge: 'Visual',
    badgeColor: '#F97316',
    title: 'Flame Tests',
    subtitle: 'Metal Ion Identification',
    description: 'Dip a nichrome wire, hold it in a roaring flame and observe the characteristic colour. Identify 7 metals and tackle the mystery metal challenge.',
    skills: ['7 metal colours', 'Nichrome wire technique', 'Mystery metal quiz'],
    duration: '15 min',
    difficulty: 'Essential',
  },
  {
    id: 'heating-salts',
    href: '/lab/heating-salts',
    icon: Thermometer,
    accent: '#EF4444',
    bg: 'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.2)',
    badge: null,
    badgeColor: '#EF4444',
    title: 'Heating of Salts',
    subtitle: 'Thermal Decomposition',
    description: 'Heat CuSO₄, CaCO₃, NH₄Cl and more in a test tube. Watch colour changes and gas evolution, then write the decomposition equations.',
    skills: ['Colour changes', 'Gas identification', 'Decomposition equations'],
    duration: '20 min',
    difficulty: 'Core',
  },
  {
    id: 'electrolysis',
    href: '/lab/electrolysis',
    icon: Zap,
    accent: '#FCD34D',
    bg: 'rgba(252,211,77,0.06)',
    border: 'rgba(252,211,77,0.2)',
    badge: 'Key Topic',
    badgeColor: '#FCD34D',
    title: 'Electrolysis',
    subtitle: 'Electrode Reactions',
    description: 'Pass current through brine, CuSO₄, and dilute H₂SO₄. Watch bubbles form and copper deposit — then write the half-equations for each electrode.',
    skills: ['Selective discharge', 'Half-equations', 'Electrode products'],
    duration: '20 min',
    difficulty: 'Core',
  },
  {
    id: 'chromatography',
    href: '/lab/chromatography',
    icon: Layers,
    accent: '#A78BFA',
    bg: 'rgba(167,139,250,0.06)',
    border: 'rgba(167,139,250,0.2)',
    badge: null,
    badgeColor: '#A78BFA',
    title: 'Chromatography',
    subtitle: 'Separating Mixtures',
    description: 'Spot black ink or plant extract on paper, let the solvent rise, and watch the colours separate. Calculate Rf values and identify unknown components.',
    skills: ['Rf values', 'Solubility differences', 'Identifying unknowns'],
    duration: '15 min',
    difficulty: 'Beginner',
  },
  {
    id: 'flashcards',
    href: '/lab/flashcards',
    icon: BookOpen,
    accent: '#34D399',
    bg: 'rgba(52,211,153,0.06)',
    border: 'rgba(52,211,153,0.2)',
    badge: 'Revise',
    badgeColor: '#34D399',
    title: 'Flashcard Drills',
    subtitle: 'All Topics · 30 Cards',
    description: 'Rapid-fire revision covering titration, salt analysis, gas tests, indicators and calculations. Every card is based on real WAEC past-paper questions.',
    skills: ['Titration', 'Salt analysis', 'Gas tests', 'Calculations'],
    duration: '10 min',
    difficulty: 'All levels',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function LabHubPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-[var(--border)]"
        style={{ background: 'rgba(8,12,16,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2.5">
          <FlaskConical className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="font-mono text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
            Elementa Lab
          </span>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-mono transition-colors"
          style={{ color: 'var(--muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Hero */}
        <motion.div
          className="pt-12 pb-8 text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border"
            style={{ background: 'rgba(79,209,255,0.06)', borderColor: 'rgba(79,209,255,0.2)', color: 'var(--accent)' }}>
            <Star className="w-3 h-3" />
            WAEC Chemistry Practical — Complete Companion
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            Step into the Lab
          </h1>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
            No theory walls. Pick an experiment, simulate the procedure hands-on,
            then drill with flashcards until exam day.
          </p>
        </motion.div>

        {/* Practicals grid */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {PRACTICALS.map((p, i) => {
            const Icon = p.icon;
            // First card (titration) spans full width, last card (flashcards) also spans full width
            const isWide = i === 0 || i === PRACTICALS.length - 1;

            return (
              <motion.button
                key={p.id}
                variants={cardVariants}
                onClick={() => router.push(p.href)}
                className={`text-left rounded-2xl p-5 border transition-all duration-200 group${isWide ? ' sm:col-span-2' : ''}`}
                style={{ background: p.bg, borderColor: p.border }}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className={`flex gap-4${isWide ? ' sm:flex-row flex-col' : ' flex-col'}`}>
                  {/* Icon + badge */}
                  <div className="flex-shrink-0">
                    <div className="relative w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${p.accent}15`, border: `1px solid ${p.accent}30` }}>
                      <Icon className="w-6 h-6" style={{ color: p.accent }} />
                    </div>
                    {p.badge && (
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full border"
                        style={{ color: p.badgeColor, borderColor: `${p.badgeColor}40`, background: `${p.badgeColor}10` }}>
                        <Star className="w-2.5 h-2.5" />
                        {p.badge}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>{p.title}</h2>
                        <p className="text-xs font-mono" style={{ color: p.accent }}>{p.subtitle}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 transition-transform group-hover:translate-x-1"
                        style={{ color: 'var(--muted)' }} />
                    </div>

                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>
                      {p.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      {p.skills.map(s => (
                        <span key={s} className="text-[11px] font-mono px-2 py-0.5 rounded"
                          style={{ background: `${p.accent}12`, color: p.accent }}>
                          {s}
                        </span>
                      ))}
                      <span className="ml-auto text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
                        {p.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Bottom note */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-2 text-xs font-mono"
          style={{ color: 'var(--muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <BookOpen className="w-3.5 h-3.5" />
          All content aligned to the WAEC Chemistry Practical syllabus
        </motion.div>
      </div>
    </div>
  );
}
