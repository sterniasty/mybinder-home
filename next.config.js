/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "pl", "de", "es", "fr", "it"],
    defaultLocale: "en",
    localeDetection: true,
  },
};

module.exports = nextConfig;
