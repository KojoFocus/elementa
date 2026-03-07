import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SAFETY_SCORES, QUIZ_POINTS_PER_Q, PASS_MARK, STEPS } from '@/data/acidBase';

export type SafetyStep = 'handwash' | 'gloves' | 'goggles';

export interface LabState {
  attemptId: string | null;
  safetySteps: Record<SafetyStep, boolean>;
  safetyScore: number;
  currentStep: number;
  completedSteps: number[];
  observations: Record<string, string>;
  classifications: Record<string, string>;
  experimentScore: number;
  quizAnswers: Record<string, string>;
  quizScore: number;
  quizSubmitted: boolean;
  totalScore: number;
  passed: boolean;
}

export interface LabActions {
  setAttemptId: (id: string) => void;
  completeSafetyStep: (step: SafetyStep) => void;
  isSafetyComplete: () => boolean;
  setCurrentStep: (step: number) => void;
  completeStep: (stepId: number, points: number) => void;
  recordObservation: (substanceId: string, colorId: string) => void;
  recordClassification: (substanceId: string, value: string) => void;
  submitQuizAnswer: (questionId: string, answerId: string, isCorrect: boolean) => void;
  submitQuiz: () => void;
  calculateFinalScore: () => void;
  resetLab: () => void;
}

const INITIAL: LabState = {
  attemptId: null,
  safetySteps: { handwash: false, gloves: false, goggles: false },
  safetyScore: 0,
  currentStep: 0,
  completedSteps: [],
  observations: {},
  classifications: {},
  experimentScore: 0,
  quizAnswers: {},
  quizScore: 0,
  quizSubmitted: false,
  totalScore: 0,
  passed: false,
};

export const useLabStore = create<LabState & LabActions>()(
  persist(
    (set, get) => ({
      ...INITIAL,

      setAttemptId: (id) => set({ attemptId: id }),

      completeSafetyStep(step) {
        const s = get();
        if (s.safetySteps[step]) return;
        set({
          safetySteps: { ...s.safetySteps, [step]: true },
          safetyScore: s.safetyScore + SAFETY_SCORES[step],
        });
      },

      isSafetyComplete: () => {
        const s = get();
        return s.safetySteps.handwash && s.safetySteps.gloves && s.safetySteps.goggles;
      },

      setCurrentStep: (step) => set({ currentStep: step }),

      completeStep(stepId, points) {
        const s = get();
        if (s.completedSteps.includes(stepId)) return;
        set({
          completedSteps: [...s.completedSteps, stepId],
          experimentScore: s.experimentScore + points,
        });
      },

      recordObservation: (substanceId, colorId) =>
        set(s => ({ observations: { ...s.observations, [substanceId]: colorId } })),

      recordClassification: (substanceId, value) =>
        set(s => ({ classifications: { ...s.classifications, [substanceId]: value } })),

      submitQuizAnswer(questionId, answerId, isCorrect) {
        set(s => ({
          quizAnswers: { ...s.quizAnswers, [questionId]: answerId },
          quizScore: isCorrect ? s.quizScore + QUIZ_POINTS_PER_Q : s.quizScore,
        }));
      },

      submitQuiz() {
        set({ quizSubmitted: true });
        get().calculateFinalScore();
      },

      calculateFinalScore() {
        const { safetyScore, experimentScore, quizScore } = get();
        const total = safetyScore + experimentScore + quizScore;
        set({ totalScore: total, passed: total >= PASS_MARK });
      },

      resetLab: () => set(INITIAL),
    }),
    {
      name: 'elementa-lab',
      partialize: (s) => ({
        attemptId: s.attemptId,
        safetySteps: s.safetySteps,
        safetyScore: s.safetyScore,
        currentStep: s.currentStep,
        completedSteps: s.completedSteps,
        observations: s.observations,
        classifications: s.classifications,
        experimentScore: s.experimentScore,
        quizAnswers: s.quizAnswers,
        quizScore: s.quizScore,
        quizSubmitted: s.quizSubmitted,
        totalScore: s.totalScore,
        passed: s.passed,
      }),
    }
  )
);

export const selectSafetyComplete = (s: LabState & LabActions) =>
  s.safetySteps.handwash && s.safetySteps.gloves && s.safetySteps.goggles;

export const selectStepProgress = (s: LabState & LabActions) => ({
  current: s.currentStep + 1,
  total: STEPS.length,
  pct: (s.currentStep / STEPS.length) * 100,
});
