import { prisma } from '@/lib/prisma';
import type { Experiment } from '@/generated/prisma/client';

export async function getAllExperiments(): Promise<Experiment[]> {
  return prisma.experiment.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getExperimentBySlug(slug: string): Promise<Experiment | null> {
  return prisma.experiment.findUnique({ where: { slug } });
}
