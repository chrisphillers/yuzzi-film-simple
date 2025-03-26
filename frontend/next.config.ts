import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
};

//TODO Complete for SEO - think about LLMs

module.exports = {
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
