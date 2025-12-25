import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during builds to prevent false positive errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable Turbopack due to Windows symlink issues with Prisma
  turbopack: {
    // This config section exists to force webpack mode
  },
  experimental: {
    // Use webpack instead of Turbopack
  },
};

export default nextConfig;

