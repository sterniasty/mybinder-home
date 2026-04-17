/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "pl", "de", "es", "fr", "it"],
    defaultLocale: "en",
    localeDetection: false,
  },
  async rewrites() {
    return [
      {
        source: '/bb',
        destination: 'https://bb-app-eight.vercel.app/bb',
      },
      {
        source: '/bb/:path*',
        destination: 'https://bb-app-eight.vercel.app/bb/:path*',
      },
    ];
  },
};

module.exports = nextConfig;