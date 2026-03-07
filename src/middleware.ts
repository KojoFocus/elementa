import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

// Use the edge-compatible config — no Prisma, no Node.js built-ins
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};
