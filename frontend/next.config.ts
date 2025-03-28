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
