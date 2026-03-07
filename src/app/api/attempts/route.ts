import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/attempts — create a new attempt when the student enters the lab
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { experimentId } = await req.json();
  if (!experimentId) {
    return NextResponse.json({ error: 'experimentId required' }, { status: 400 });
  }

  const attempt = await prisma.attempt.create({
    data: {
      userId:       session.user.id,
      experimentId,
    },
    select: { id: true },
  });

  return NextResponse.json({ attemptId: attempt.id }, { status: 201 });
}

// PATCH /api/attempts — save scores on completion
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { attemptId, safetyScore, experimentScore, quizScore, totalScore, passed } = await req.json();
  if (!attemptId) {
    return NextResponse.json({ error: 'attemptId required' }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.attempt.findUnique({
    where: { id: attemptId },
    select: { userId: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      safetyScore,
      experimentScore,
      quizScore,
      totalScore,
      passed,
      completedAt: new Date(),
    },
    select: { id: true, totalScore: true, passed: true },
  });

  return NextResponse.json(updated);
}
