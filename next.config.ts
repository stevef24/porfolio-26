import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();
const WATCH_IGNORED_PATHS =
  /[\\/](node_modules|\\.git|\\.next|\\.turbo|\\.cache|\\.claude|\\.source|coverage|docs|tests|thoughts)[\\/]/;

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },

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
    viewTransition: true,
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

    cfg.watchOptions = {
      ...(cfg.watchOptions || {}),
      ignored: WATCH_IGNORED_PATHS,
    };

    return cfg;
  },
};

export default withMDX(nextConfig);
