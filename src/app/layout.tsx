import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Wunderbar wirksame Websites | Anders & Seim – Internetagentur Frankfurt",
  description:
    "Anders & Seim: Internetagentur aus Langen bei Frankfurt für Webdesign, SEO, GEO (KI-Sichtbarkeit) und Online-Marketing. Wir helfen KMU in Deutschland, Österreich und der Schweiz online profitabel zu wachsen. 100% Weiterempfehlung auf ProvenExpert.",
  keywords: [
    "Internetagentur Frankfurt",
    "Webdesign KMU",
    "SEO Agentur DACH",
    "GEO Generative Engine Optimization",
    "KI-Sichtbarkeit",
    "Webdesign Langen Hessen",
    "Online Marketing Agentur",
    "Webseite erstellen lassen",
  ],
  alternates: { canonical: "https://www.andersundseim.de" },
  openGraph: {
    title: "Wunderbar wirksame Websites | Anders & Seim",
    description:
      "Internetagentur für Webdesign, SEO, GEO und Online-Marketing. 29+ Jahre Erfahrung, 100% Weiterempfehlung.",
    url: "https://www.andersundseim.de",
    siteName: "Anders & Seim",
    locale: "de_DE",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://www.andersundseim.de/#organization",
      name: "Anders & Seim Neue Medien",
      url: "https://www.andersundseim.de",
      telephone: "+4961035930",
      email: "hallo@andersundseim.de",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Langen",
        addressRegion: "Hessen",
        addressCountry: "DE",
      },
      areaServed: ["DE", "AT", "CH"],
      description:
        "Internetagentur für Webdesign, SEO, GEO (Generative Engine Optimization) und Online-Marketing für kleine und mittelständische Unternehmen in Deutschland, Österreich und der Schweiz.",
      knowsAbout: [
        "Webdesign",
        "Suchmaschinenoptimierung",
        "Generative Engine Optimization",
        "Online-Marketing",
        "E-Commerce",
        "UX Design",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        bestRating: "5",
        ratingCount: "13",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.andersundseim.de/#website",
      url: "https://www.andersundseim.de",
      name: "Anders & Seim",
      publisher: { "@id": "https://www.andersundseim.de/#organization" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Was ist GEO – Generative Engine Optimization?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GEO (Generative Engine Optimization) sorgt dafür, dass Ihr Unternehmen in KI-basierten Suchantworten prominent erscheint – in ChatGPT, Google AI Overviews, Perplexity und anderen KI-Systemen. Da immer mehr Nutzer Antworten direkt von KI erhalten, ist GEO ein entscheidender Faktor für digitale Sichtbarkeit.",
          },
        },
        {
          "@type": "Question",
          name: "Für welche Unternehmen ist Anders & Seim geeignet?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Wir spezialisieren uns auf kleine und mittelständische Unternehmen (KMU) in Deutschland, Österreich und der Schweiz, die mehr qualifizierte Anfragen über ihre Website generieren möchten.",
          },
        },
        {
          "@type": "Question",
          name: "Wie läuft die Zusammenarbeit mit Anders & Seim ab?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Auf ein kostenloses Erstgespräch folgen Strategie und Konzept, professionelles Design und technische Umsetzung sowie Launch und kontinuierliche Optimierung. Wir begleiten Sie langfristig als digitaler Partner.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${jakartaSans.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full antialiased font-jakarta">{children}</body>
    </html>
  );
}
