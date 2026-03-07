import type { NextAuthConfig } from 'next-auth';

// Edge-compatible auth config — no Node.js built-ins (no Prisma, no bcrypt).
// Used by middleware for JWT session checks.
// The full auth.ts adds the Credentials provider on top of this.
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [], // populated in auth.ts for Node.js runtime
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isPublic =
        pathname === '/' ||
        pathname === '/login' ||
        pathname === '/register' ||
        pathname.startsWith('/api/auth');
      if (isPublic) return true;
      // Return 401 JSON for API routes instead of redirecting to the login page
      if (!isLoggedIn && pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id     = user.id;
        token.role   = (user as { role?: string }).role;
        token.school = (user as { school?: string | null }).school;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id     = token.id as string;
        session.user.role   = token.role as string;
        session.user.school = token.school as string | null;
      }
      return session;
    },
  },
};
