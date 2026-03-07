import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

// Use the edge-compatible config — no Prisma, no Node.js built-ins
const { auth } = NextAuth(authConfig);

export default auth;
export { auth as middleware };

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};
