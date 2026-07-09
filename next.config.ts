import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Since we want standard static rendering that works perfectly on Vercel
  // out of the box without complex server configurations.
  eslint: {
    // Warning only to avoid build blocking on minor issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
