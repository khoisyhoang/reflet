import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        port: '',
        pathname: '/b/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100MB',
    },
  },
};

export default nextConfig;
