import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'your-cdn.com', // Add the domain from your error message
      'ourbabyhospital.s3.amazonaws.com',
      'ourbabyhospital.s3.ap-southeast-2.amazonaws.com',
      'localhost', // For development
    ],
    // OR use remotePatterns (Next.js 12.3+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'ourbabyhospital.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'ourbabyhospital.s3.ap-southeast-2.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;