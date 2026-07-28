import type { Metadata } from "next";
import { Anton, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://once-fc.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Once FC — Club de entrenamiento de fútbol para adultos en México",
    template: "%s | Once FC",
  },
  description:
    "Once FC es un club de entrenamiento de fútbol para adultos en México. Niveles de iniciación a competitivo, sesiones antes del trabajo, entrenadores certificados y partidos todo el año. Agenda tu sesión gratuita.",
  keywords: [
    "futbol para adultos",
    "club de futbol adultos",
    "liga de futbol amateur",
    "entrenamiento de futbol adultos",
    "futbol despues del trabajo",
    "escuela de futbol para adultos",
    "liga recreativa de futbol",
  ],
  authors: [{ name: "Once FC" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Once FC",
    title: "Once FC — Club de entrenamiento de fútbol para adultos en México",
    description:
      "Niveles de iniciación a competitivo, sesiones antes del trabajo y entrenadores certificados. Agenda tu sesión gratuita.",
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "Once FC — Club de entrenamiento de fútbol para adultos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Once FC — Club de entrenamiento de fútbol para adultos",
    description:
      "Niveles de iniciación a competitivo y partidos todo el año. Agenda tu sesión gratuita.",
    images: ["/og-cover.svg"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Once FC",
    description:
      "Club de entrenamiento de fútbol para adultos en México, con niveles de iniciación a competitivo, presente en varias ciudades.",
    url: siteUrl,
    sport: "Soccer",
    areaServed: "MX",
  };

  return (
    <html lang="es-MX" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased">
        <a href="#main" className="skip-link">
          Saltar al contenido principal
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        ) : null}
      </body>
    </html>
  );
}
