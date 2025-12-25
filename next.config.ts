import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack due to Windows symlink issues with Prisma
  turbopack: {
    // This config section exists to force webpack mode
  },
  experimental: {
    // Use webpack instead of Turbopack
  },
};

export default nextConfig;
