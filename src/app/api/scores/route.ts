import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/scores — fetch all completed attempts for the current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const attempts = await prisma.attempt.findMany({
    where: {
      userId:      session.user.id,
      completedAt: { not: null },
    },
    orderBy: { completedAt: 'desc' },
    select: {
      id:              true,
      experimentId:    true,
      safetyScore:     true,
      experimentScore: true,
      quizScore:       true,
      totalScore:      true,
      passed:          true,
      completedAt:     true,
      experiment: {
        select: { title: true, slug: true, subject: true },
      },
    },
  });

  return NextResponse.json({ attempts });
}
