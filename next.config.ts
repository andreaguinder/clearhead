import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        destination: 'https://clearhead-5a93c.firebaseapp.com/__/auth/:path*',
      },
    ];
  },
};

export default nextConfig;
