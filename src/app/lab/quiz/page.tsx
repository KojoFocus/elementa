'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FlaskConical, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { useLabStore } from '@/store/labStore';
import { QUIZ_QUESTIONS, QUIZ_POINTS_PER_Q } from '@/data/acidBase';

export default function QuizPage() {
  const router = useRouter();
  const submitQuizAnswer = useLabStore(s => s.submitQuizAnswer);
  const submitQuiz       = useLabStore(s => s.submitQuiz);
  const quizAnswers      = useLabStore(s => s.quizAnswers);
  const quizScore        = useLabStore(s => s.quizScore);
  const quizSubmitted    = useLabStore(s => s.quizSubmitted);

  const [currentIdx, setCurrentIdx]     = useState(0);
  const [selected, setSelected]         = useState<string | null>(null);
  const [revealed, setRevealed]         = useState(false);
  const [showSummary, setShowSummary]   = useState(quizSubmitted);
  const [direction, setDirection]       = useState(1);

  const question = QUIZ_QUESTIONS[currentIdx];
  const isLast   = currentIdx === QUIZ_QUESTIONS.length - 1;
  const progress = ((currentIdx + (revealed ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;

  // If already submitted on re-visit, jump straight to summary
  if (quizSubmitted && !showSummary) {
    setShowSummary(true);
  }

  function handleSelect(optId: string) {
    if (revealed) return;
    setSelected(optId);
  }

  function handleReveal() {
    if (!selected) return;
    const isCorrect = selected === question.correctId;
    submitQuizAnswer(question.id, selected, isCorrect);
    setRevealed(true);
  }

  function handleNext() {
    setDirection(1);
    setSelected(null);
    setRevealed(false);
    setCurrentIdx(i => i + 1);
  }

  function handleSubmit() {
    submitQuiz();
    setShowSummary(true);
  }

  function handleContinue() {
    router.push('/lab/results');
  }

  const correctCount = QUIZ_QUESTIONS.filter(q => quizAnswers[q.id] === q.correctId).length;

  // ── Summary view ───────────────────────────────────────────
  if (showSummary) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-deep)' }}>
        <QuizHeader step={QUIZ_QUESTIONS.length} total={QUIZ_QUESTIONS.length} progress={100} />

        <div className="flex-1 flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                style={{ background: 'rgba(79,209,255,0.08)', border: '2px solid rgba(79,209,255,0.3)' }}>
                <span className="text-3xl font-bold font-mono" style={{ color: 'var(--accent)' }}>
                  {quizScore}
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Quiz Complete
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {correctCount} of {QUIZ_QUESTIONS.length} correct &mdash; {quizScore} out of {QUIZ_QUESTIONS.length * QUIZ_POINTS_PER_Q} points
              </p>
            </motion.div>

            {/* Question-by-question review */}
            <div className="space-y-4 mb-8">
              {QUIZ_QUESTIONS.map((q, i) => {
                const userAnswer = quizAnswers[q.id];
                const isCorrect  = userAnswer === q.correctId;
                const userOption = q.options.find(o => o.id === userAnswer);
                const correctOption = q.options.find(o => o.id === q.correctId);
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-lg p-4"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {isCorrect
                        ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
                        : <XCircle     className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
                      }
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {i + 1}. {q.question}
                      </p>
                    </div>
                    {!isCorrect && userOption && (
                      <p className="text-xs ml-8 mb-1" style={{ color: 'var(--danger)' }}>
                        Your answer: {userOption.text}
                      </p>
                    )}
                    {!isCorrect && (
                      <p className="text-xs ml-8 mb-1" style={{ color: 'var(--success)' }}>
                        Correct: {correctOption?.text}
                      </p>
                    )}
                    <p className="text-xs ml-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {q.explanation}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <Button size="lg" variant="primary" onClick={handleContinue} className="w-full justify-center">
              View My Results →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Per-question view ─────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-deep)' }}>
      <QuizHeader step={currentIdx + 1} total={QUIZ_QUESTIONS.length} progress={progress} />

      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIdx}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Question */}
              <div className="mb-8">
                <span className="text-xs font-mono tracking-widest uppercase mb-3 block"
                  style={{ color: 'var(--text-muted)' }}>
                  Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <h2 className="text-xl font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {question.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {question.options.map((opt, i) => {
                  const isSelected  = selected === opt.id;
                  const isCorrect   = opt.id === question.correctId;
                  const isWrong     = revealed && isSelected && !isCorrect;
                  const showCorrect = revealed && isCorrect;

                  let borderColor = 'var(--border)';
                  let bgColor     = 'var(--surface)';
                  let textColor   = 'var(--text-secondary)';

                  if (!revealed && isSelected) {
                    borderColor = 'var(--accent)';
                    bgColor     = 'rgba(79,209,255,0.08)';
                    textColor   = 'var(--accent)';
                  } else if (showCorrect) {
                    borderColor = 'var(--success)';
                    bgColor     = 'rgba(34,197,94,0.08)';
                    textColor   = 'var(--success)';
                  } else if (isWrong) {
                    borderColor = 'var(--danger)';
                    bgColor     = 'rgba(239,68,68,0.08)';
                    textColor   = 'var(--danger)';
                  }

                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={revealed ? {} : { scale: 1.01 }}
                      whileTap={revealed ? {} : { scale: 0.99 }}
                      onClick={() => handleSelect(opt.id)}
                      className="w-full text-left px-4 py-3.5 rounded-lg font-mono text-sm transition-all duration-200 flex items-center gap-3"
                      style={{ border: `1px solid ${borderColor}`, background: bgColor, color: textColor, cursor: revealed ? 'default' : 'pointer' }}
                    >
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: isSelected || showCorrect ? borderColor : 'var(--border)', color: isSelected || showCorrect ? 'var(--bg-deep)' : 'var(--text-muted)' }}>
                        {opt.id.toUpperCase()}
                      </span>
                      {opt.text}
                      {showCorrect && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" />}
                      {isWrong     && <XCircle      className="w-4 h-4 ml-auto shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation (after reveal) */}
              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="rounded-lg px-4 py-3"
                      style={{ background: 'rgba(79,209,255,0.05)', border: '1px solid rgba(79,209,255,0.15)' }}>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-semibold" style={{ color: 'var(--accent)' }}>Explanation: </span>
                        {question.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              {!revealed ? (
                <Button
                  size="lg"
                  variant="primary"
                  disabled={!selected}
                  onClick={handleReveal}
                  className="w-full justify-center"
                >
                  Check Answer
                </Button>
              ) : isLast ? (
                <Button
                  size="lg"
                  variant="primary"
                  onClick={handleSubmit}
                  className="w-full justify-center"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="primary"
                  onClick={handleNext}
                  className="w-full justify-center"
                  icon={<ChevronRight className="w-4 h-4" />}
                >
                  Next Question
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function QuizHeader({ step, total, progress }: { step: number; total: number; progress: number }) {
  return (
    <header className="flex flex-col gap-3 px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="font-mono text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
            Knowledge Check
          </span>
        </div>
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {step} / {total}
        </span>
      </div>
      <ProgressBar value={progress} label="Quiz Progress" current={step} total={total} />
    </header>
  );
}
