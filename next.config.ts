import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from Clerk CDN
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
  // Suppress Convex peer dependency warnings
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
