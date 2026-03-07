import { prisma } from '@/lib/prisma';
import type { Attempt, QuizAnswer } from '@/generated/prisma/client';

// ─── Create ───────────────────────────────────────────────────

export async function createAttempt(
  userId: string,
  experimentId: string
): Promise<Attempt> {
  return prisma.attempt.create({
    data: { userId, experimentId },
  });
}

// ─── Complete ─────────────────────────────────────────────────

export interface AttemptScores {
  safetyScore: number;     // 0–100
  experimentScore: number; // 0–100
  quizScore: number;       // 0–100
  quizAnswers?: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
  }>;
}

export async function completeAttempt(
  attemptId: string,
  scores: AttemptScores
): Promise<Attempt> {
  // Weighted total: safety 10 %, experiment 40 %, quiz 50 %
  const totalScore = Math.round(
    scores.safetyScore * 0.1 +
    scores.experimentScore * 0.4 +
    scores.quizScore * 0.5
  );

  return prisma.attempt.update({
    where: { id: attemptId },
    data: {
      completedAt: new Date(),
      safetyScore: scores.safetyScore,
      experimentScore: scores.experimentScore,
      quizScore: scores.quizScore,
      totalScore,
      passed: totalScore >= 60,
      quizAnswers: scores.quizAnswers
        ? {
            createMany: {
              data: scores.quizAnswers.map((a) => ({
                questionId: a.questionId,
                answer: a.answer,
                isCorrect: a.isCorrect,
              })),
            },
          }
        : undefined,
    },
  });
}

// ─── Read ─────────────────────────────────────────────────────

export type AttemptWithAnswers = Attempt & { quizAnswers: QuizAnswer[] };

export async function getAttemptsByUser(
  userId: string
): Promise<AttemptWithAnswers[]> {
  return prisma.attempt.findMany({
    where: { userId },
    include: { quizAnswers: true },
    orderBy: { startedAt: 'desc' },
  }) as Promise<AttemptWithAnswers[]>;
}

export async function getBestAttempt(
  userId: string,
  experimentId: string
): Promise<AttemptWithAnswers | null> {
  return prisma.attempt.findFirst({
    where: { userId, experimentId, passed: true },
    include: { quizAnswers: true },
    orderBy: { totalScore: 'desc' },
  }) as Promise<AttemptWithAnswers | null>;
}
