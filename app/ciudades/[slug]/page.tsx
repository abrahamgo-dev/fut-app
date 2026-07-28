import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Method from "@/components/Method";
import Prueba from "@/components/Prueba";
import Footer from "@/components/Footer";
import { cities, getCityBySlug } from "@/data/cities";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return cities.filter((c) => c.active).map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = getCityBySlug(params.slug);
  if (!city) return {};

  const title = `Once FC ${city.name} — Club de entrenamiento de fútbol para adultos`;
  const description = `Entrena fútbol en ${city.name}: niveles de iniciación a competitivo, entrenadores certificados y partidos todo el año. Zona: ${city.zoneLabel}.`;

  return {
    title,
    description,
    alternates: { canonical: `/ciudades/${city.slug}` },
    openGraph: { title, description },
  };
}

export default function CiudadPage({ params }: Props) {
  const city = getCityBySlug(params.slug);
  if (!city) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: `Once FC ${city.name}`,
    description: `Club de entrenamiento de fútbol para adultos en ${city.name}, México.`,
    sport: "Soccer",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MX",
      addressRegion: city.state,
      addressLocality: city.name,
    },
    areaServed: city.name,
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav cityName={city.name} />
      <Hero cityLabel={`${city.name}, ${city.state}`} levelsCount={city.levels.length} />
      <Categories levels={city.levels} />
      <Method />
      <Prueba cityName={city.name} />
      <Footer
        zoneLabel={city.zoneLabel}
        scheduleNote={city.scheduleNote}
        contactWhatsapp={city.contactWhatsapp}
        contactEmail={city.contactEmail}
      />
    </main>
  );
}
