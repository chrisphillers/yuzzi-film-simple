import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.screenslate.com',
        port: '', // Leave empty for default HTTPS port (443)
        pathname: '/**', // Allows any path under the hostname
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/graphql`,
      },
    ];
  },
};

// TODO Complete for SEO - think about LLMs

module.exports = {
  ...nextConfig, // Spread the nextConfig object to include its properties
  async headers() {
    return [
      {
        source: '/secret',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
