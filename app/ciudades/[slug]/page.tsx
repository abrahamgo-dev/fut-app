import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import Showcase from "@/components/Showcase";
import ProximasSesiones from "@/components/ProximasSesiones";
import Prueba from "@/components/Prueba";
import Footer from "@/components/Footer";
import { cities, getCityBySlug } from "@/data/cities";
import { prisma } from "@/lib/prisma";
import { PRELAUNCH_MODE } from "@/lib/launchFlags";

type Props = {
  params: { slug: string };
};

export const revalidate = 60;

export function generateStaticParams() {
  return cities.filter((c) => c.active).map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = getCityBySlug(params.slug);
  if (!city) return {};

  const title = `Once FC ${city.name} — Reserva sesiones de entrenamiento`;
  const description = `Reserva sesiones de entrenamiento de fútbol en ${city.name}, en canchas de calidad y con coaches con experiencia.`;

  return {
    title,
    description,
    alternates: { canonical: `/ciudades/${city.slug}` },
    openGraph: { title, description },
  };
}

export default async function CiudadPage({ params }: Props) {
  const city = getCityBySlug(params.slug);
  if (!city) notFound();

  const sedesCount = await prisma.sede.count({ where: { active: true, citySlug: city.slug } });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: `Once FC ${city.name}`,
    description: `Sesiones de entrenamiento de fútbol para adultos en canchas de calidad en ${city.name}, México.`,
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
      <Nav cityName={city.name} citySlug={city.slug} />
      <Hero
        cityLabel={`${city.name}, ${city.state}`}
        citySlug={city.slug}
        sedesCount={sedesCount}
      />
      {!PRELAUNCH_MODE ? <ProximasSesiones citySlug={city.slug} /> : null}
      <Method />
      <Showcase cityName={city.name} />
      <Prueba cityName={city.name} />
      <Footer
        cityLabel={city.name}
        scheduleNote={city.scheduleNote}
        contactEmail={city.contactEmail}
      />
    </main>
  );
}
