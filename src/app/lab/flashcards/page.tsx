'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Zap, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { FLASHCARDS, TOPIC_LABELS, TOPIC_COLORS, type FlashcardTopic } from '@/data/waec/flashcards';
import { Suspense } from 'react';

const TOPICS = Object.keys(TOPIC_LABELS) as FlashcardTopic[];

function DifficultyDot({ d }: { d: 'easy' | 'medium' | 'hard' }) {
  const colors = { easy: '#7AFFB2', medium: '#FCD34D', hard: '#FF7EB3' };
  return <span className="w-2 h-2 rounded-full inline-block" style={{ background: colors[d] }} />;
}

function FlashcardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initTopic = (searchParams.get('topic') as FlashcardTopic) ?? null;

  const [activeTopic, setActiveTopic] = useState<FlashcardTopic | 'all'>('all');
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [marked, setMarked] = useState<Record<string, 'know' | 'review'>>({});
  const [mode, setMode] = useState<'browse' | 'quiz'>('browse');

  // Set topic from URL param on mount
  useState(() => { if (initTopic) setActiveTopic(initTopic); });

  const filteredCards = activeTopic === 'all'
    ? FLASHCARDS
    : FLASHCARDS.filter(c => c.topic === activeTopic);

  const card = filteredCards[cardIdx] ?? null;
  const total = filteredCards.length;
  const knownCount = filteredCards.filter(c => marked[c.id] === 'know').length;
  const reviewCount = filteredCards.filter(c => marked[c.id] === 'review').length;
  const progress = total > 0 ? (knownCount / total) * 100 : 0;

  const goNext = useCallback(() => {
    setFlipped(false);
    setTimeout(() => setCardIdx(i => (i + 1) % total), 100);
  }, [total]);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setTimeout(() => setCardIdx(i => (i - 1 + total) % total), 100);
  }, [total]);

  function markCard(status: 'know' | 'review') {
    if (!card) return;
    setMarked(prev => ({ ...prev, [card.id]: status }));
    goNext();
  }

  function reset() {
    setCardIdx(0);
    setFlipped(false);
    setMarked({});
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b"
        style={{ background: 'rgba(8,12,16,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <button onClick={() => router.push('/lab')} className="flex items-center gap-1.5 text-xs font-mono"
          style={{ color: 'var(--muted)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Lab
        </button>
        <span className="text-xs font-mono font-semibold" style={{ color: '#FCD34D' }}>
          Flashcard Drills
        </span>
        <button onClick={reset} className="flex items-center gap-1 text-xs font-mono"
          style={{ color: 'var(--muted)' }}>
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Topic filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setActiveTopic('all'); setCardIdx(0); setFlipped(false); }}
            className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
            style={{
              background: activeTopic === 'all' ? 'rgba(252,211,77,0.12)' : 'transparent',
              borderColor: activeTopic === 'all' ? 'rgba(252,211,77,0.35)' : 'rgba(255,255,255,0.08)',
              color: activeTopic === 'all' ? '#FCD34D' : 'var(--muted)',
            }}>
            All Topics ({FLASHCARDS.length})
          </button>
          {TOPICS.map(t => {
            const count = FLASHCARDS.filter(c => c.topic === t).length;
            const color = TOPIC_COLORS[t];
            return (
              <button key={t}
                onClick={() => { setActiveTopic(t); setCardIdx(0); setFlipped(false); }}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                style={{
                  background: activeTopic === t ? `${color}12` : 'transparent',
                  borderColor: activeTopic === t ? `${color}35` : 'rgba(255,255,255,0.08)',
                  color: activeTopic === t ? color : 'var(--muted)',
                }}>
                {TOPIC_LABELS[t]} ({count})
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span style={{ color: 'var(--muted)' }}>Card {cardIdx + 1} of {total}</span>
            <div className="flex items-center gap-3">
              <span style={{ color: '#7AFFB2' }}>✓ {knownCount} known</span>
              <span style={{ color: '#FB923C' }}>↻ {reviewCount} review</span>
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: '#7AFFB2' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Flashcard */}
        {card && (
          <div className="mb-5">
            {/* Topic + difficulty row */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                style={{ background: `${TOPIC_COLORS[card.topic]}12`, color: TOPIC_COLORS[card.topic] }}>
                {TOPIC_LABELS[card.topic]}
              </span>
              <DifficultyDot d={card.difficulty} />
              <span className="text-[10px] font-mono capitalize" style={{ color: 'var(--muted)' }}>{card.difficulty}</span>
              {marked[card.id] && (
                <span className={`ml-auto text-[10px] font-mono`}
                  style={{ color: marked[card.id] === 'know' ? '#7AFFB2' : '#FB923C' }}>
                  {marked[card.id] === 'know' ? '✓ Known' : '↻ Review'}
                </span>
              )}
            </div>

            {/* Card with flip */}
            <div
              className="relative cursor-pointer"
              style={{ perspective: 1200, height: 280 }}
              onClick={() => setFlipped(f => !f)}
            >
              <AnimatePresence mode="wait">
                {!flipped ? (
                  <motion.div key="front"
                    initial={{ opacity: 0, rotateY: -20 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 20 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 rounded-2xl border p-6 flex flex-col"
                    style={{ background: 'rgba(13,21,32,0.8)', borderColor: `${TOPIC_COLORS[card.topic]}25` }}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest"
                        style={{ color: TOPIC_COLORS[card.topic] }}>Question</span>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
                        Tap to reveal →
                      </span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)' }}>
                        {card.front}
                      </p>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>
                        — tap card to see answer —
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="back"
                    initial={{ opacity: 0, rotateY: 20 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -20 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 rounded-2xl border p-6 flex flex-col overflow-y-auto"
                    style={{
                      background: `${TOPIC_COLORS[card.topic]}08`,
                      borderColor: `${TOPIC_COLORS[card.topic]}35`,
                    }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest"
                        style={{ color: TOPIC_COLORS[card.topic] }}>Answer</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)' }}>
                        {card.back}
                      </p>
                    </div>
                    {card.waecTip && (
                      <div className="mt-3 rounded-lg px-3 py-2.5 text-xs font-mono"
                        style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.2)', color: '#FCD34D' }}>
                        <span className="font-bold">WAEC: </span>{card.waecTip}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mark buttons — only visible after flip */}
            <AnimatePresence>
              {flipped && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={(e) => { e.stopPropagation(); markCard('review'); }}
                    className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.25)', color: '#FB923C' }}>
                    <XCircle className="w-4 h-4" /> Still Learning
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); markCard('know'); }}
                    className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: 'rgba(122,255,178,0.1)', border: '1px solid rgba(122,255,178,0.25)', color: '#7AFFB2' }}>
                    <CheckCircle className="w-4 h-4" /> I Know This
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={goPrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-mono border"
            style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'var(--muted)', background: 'transparent' }}>
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          {/* Dot navigation */}
          <div className="flex gap-1.5 overflow-x-auto" style={{ maxWidth: 200 }}>
            {filteredCards.slice(Math.max(0, cardIdx - 4), cardIdx + 5).map((c, i) => {
              const absIdx = Math.max(0, cardIdx - 4) + i;
              return (
                <button key={c.id}
                  onClick={() => { setCardIdx(absIdx); setFlipped(false); }}
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: absIdx === cardIdx
                      ? TOPIC_COLORS[c.topic]
                      : marked[c.id] === 'know'
                        ? 'rgba(122,255,178,0.4)'
                        : marked[c.id] === 'review'
                          ? 'rgba(251,146,60,0.4)'
                          : 'rgba(255,255,255,0.08)',
                  }} />
              );
            })}
          </div>

          <button onClick={goNext}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-mono border"
            style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'var(--muted)', background: 'transparent' }}>
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Completion summary */}
        {knownCount === total && total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl border p-5 text-center"
            style={{ background: 'rgba(122,255,178,0.06)', borderColor: 'rgba(122,255,178,0.3)' }}>
            <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: '#7AFFB2' }} />
            <p className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>
              {activeTopic === 'all' ? 'All cards' : TOPIC_LABELS[activeTopic as FlashcardTopic]} mastered!
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              You marked all {total} cards as known.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={reset}
                className="py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--muted)' }}>
                Restart
              </button>
              <button onClick={() => router.push('/lab')}
                className="py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(79,209,255,0.1)', border: '1px solid rgba(79,209,255,0.25)', color: '#4FD1FF' }}>
                Back to Lab
              </button>
            </div>
          </motion.div>
        )}

        {/* Study tips */}
        <div className="mt-8 rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4" style={{ color: 'var(--muted)' }} />
            <p className="text-xs font-mono font-semibold" style={{ color: 'var(--muted)' }}>WAEC Exam Tips</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono">
            {[
              'Always state the COLOUR and pH range for indicator results',
              'Write "permanent colour change" for titration endpoints',
              'Add HCl/HNO₃ BEFORE AgNO₃ or BaCl₂ in anion tests',
              'For concordant: titres must agree within ±0.10 cm³',
              'Pilot run is EXCLUDED from the average titre',
              'Dissolves in excess NaOH = amphoteric (Zn²⁺, Al³⁺)',
              '"Moist red litmus turns blue" confirms NH₃ gas only',
              'Glowing splint rekindles = O₂ (not burning splint)',
            ].map((tip, i) => (
              <div key={i} className="flex gap-1.5">
                <span style={{ color: '#FCD34D' }}>·</span>
                <span style={{ color: 'var(--muted)' }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-xs font-mono" style={{ color: 'var(--muted)' }}>Loading flashcards…</div>
    </div>}>
      <FlashcardContent />
    </Suspense>
  );
}
