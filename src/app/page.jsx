import { headers } from "next/headers";
import { SETS } from "../data/sets";
import HomeClient from "../components/HomeClient";

// Detect locale from Accept-Language header
function getLocale() {
  try {
    const headersList = headers();
    const acceptLang = headersList.get("accept-language") || "en";
    const preferred = acceptLang.split(",")[0].split("-")[0].toLowerCase();
    const supported = ["en", "pl", "de", "es", "fr", "it"];
    return supported.includes(preferred) ? preferred : "en";
  } catch {
    return "en";
  }
}

function getTranslations(locale) {
  try {
    return require(`../locales/${locale}.json`);
  } catch {
    return require("../locales/en.json");
  }
}

// SSR metadata — different per language
export async function generateMetadata() {
  const locale = getLocale();
  const t = getTranslations(locale);

  const localeUrls = {
    en: "https://mybinder.cards",
    pl: "https://mybinder.cards/pl",
    de: "https://mybinder.cards/de",
    es: "https://mybinder.cards/es",
    fr: "https://mybinder.cards/fr",
    it: "https://mybinder.cards/it",
  };

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [
      "UniVersus", "TCG", "card collection", "Guilty Gear Strive", "GGS01",
      "card tracker", "trading card game", "collection manager",
      "kolekcja kart", "UniVersus tracker",
    ],
    authors: [{ name: "mybinder.cards" }],
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: "https://mybinder.cards",
      siteName: "mybinder.cards",
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
    alternates: {
      canonical: "https://mybinder.cards",
      languages: localeUrls,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default function Page() {
  const locale = getLocale();
  const t = getTranslations(locale);

  // SSR structured data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "mybinder.cards",
    "url": "https://mybinder.cards",
    "description": t.meta.description,
    "applicationCategory": "GameApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  return (
    <>
      {/* Structured data for Google — rendered server-side */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Client component handles interactivity (auth modal, language switcher) */}
      <HomeClient t={t} locale={locale} sets={SETS} />
    </>
  );
}
