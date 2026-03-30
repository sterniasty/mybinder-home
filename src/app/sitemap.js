export default function sitemap() {
  const locales = ["en", "pl", "de", "es", "fr", "it"];
  const base = "https://mybinder.cards";

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}`])),
      },
    },
  ];
}
