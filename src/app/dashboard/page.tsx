import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const [attempts, experiments] = await Promise.all([
    prisma.attempt.findMany({
      where: { userId: session.user.id, completedAt: { not: null } },
      orderBy: { completedAt: 'desc' },
      take: 10,
      include: { experiment: { select: { title: true, slug: true } } },
    }),
    prisma.experiment.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'asc' } }),
  ]);

  const scores = attempts.map(a => a.totalScore ?? 0).filter(s => s > 0);
  const stats = {
    completed: attempts.length,
    average: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    best: scores.length ? Math.max(...scores) : 0,
  };

  return (
    <DashboardClient
      user={{ name: session.user.name ?? '', school: session.user.school ?? null }}
      stats={stats}
      attempts={attempts.map(a => ({
        id: a.id,
        experimentTitle: a.experiment.title,
        experimentSlug: a.experiment.slug,
        totalScore: a.totalScore ?? 0,
        passed: a.passed ?? false,
        completedAt: a.completedAt?.toISOString() ?? '',
      }))}
      experiments={experiments.map(e => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        subject: e.subject,
        difficulty: e.difficulty,
      }))}
    />
  );
}
