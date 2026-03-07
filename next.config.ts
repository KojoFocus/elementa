import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma 7 generated client uses node:path / node:url — keep it server-side only
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-neon'],
};

export default nextConfig;
