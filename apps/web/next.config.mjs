/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['tsx', 'ts', 'get.', 'post.'],
  /*   rewrites() {
      return {
        beforeFiles: [
          {
            source: '/:path*',
            has: [
              {
                type: 'host',
                value: '*.raferdev_study.dev',
              },
            ],
            destination: '/:path*',
          },
        ],
      }
    }, */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/raferdev.png',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/profile_images/1337055608613253126/r_eiMp2H_400x400.png',
      },
    ],
  },

  /*   experimental: {
      instrumentationHook: true,
    }, */

  compiler: {
    removeConsole: true,
  },

  webpack: (config) => {
    config.experiments.topLevelAwait = true

    return config
  },
  poweredByHeader: false,
}

export default nextConfig