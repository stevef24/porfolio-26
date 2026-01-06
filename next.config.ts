import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Image optimization - external domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
  },

  // Experimental performance features
  experimental: {
    optimizePackageImports: ["motion", "@hugeicons/react"],
  },

  // Silence incorrect workspace root detection
  outputFileTracingRoot: process.cwd(),

  // Ensure Node built-ins don't break client bundling
  webpack: (cfg) => {
    cfg.resolve = cfg.resolve || {};
    cfg.resolve.fallback = {
      ...(cfg.resolve.fallback || {}),
      fs: false,
      path: false,
      module: false,
    };
    return cfg;
  },
};

export default withMDX(nextConfig);
