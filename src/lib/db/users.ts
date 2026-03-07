import { prisma } from '@/lib/prisma';
import type { Role, User } from '@/generated/prisma/client';

export async function createUser(params: {
  email: string;
  name: string;
  role?: Role;
  school?: string;
}): Promise<User> {
  return prisma.user.create({
    data: {
      email: params.email,
      name: params.name,
      role: params.role ?? 'STUDENT',
      school: params.school ?? null,
    },
  });
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}
