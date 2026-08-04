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

  const comingSoon = city.status === "comingSoon";
  const title = comingSoon
    ? `Once FC ${city.name} — Próximamente`
    : `Once FC ${city.name} — Reserva sesiones de entrenamiento`;
  const description = comingSoon
    ? `Muy pronto en ${city.name}: sesiones de entrenamiento de fútbol para adultos en canchas de calidad. Déjanos tus datos para avisarte cuando abramos.`
    : `Reserva sesiones de entrenamiento de fútbol en ${city.name}, en canchas de calidad y con coaches con experiencia.`;

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

  const comingSoon = city.status === "comingSoon";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: `Once FC ${city.name}`,
    description: comingSoon
      ? `Próximamente: sesiones de entrenamiento de fútbol para adultos en ${city.name}, México.`
      : `Sesiones de entrenamiento de fútbol para adultos en canchas de calidad en ${city.name}, México.`,
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
        comingSoon={comingSoon}
      />
      {!comingSoon ? <ProximasSesiones citySlug={city.slug} /> : null}
      <Method />
      <Showcase cityName={city.name} />
      <Prueba cityName={city.name} comingSoon={comingSoon} />
      <Footer
        cityLabel={`${city.name}, ${city.state}`}
        scheduleNote={city.scheduleNote}
        contactEmail={city.contactEmail}
      />
    </main>
  );
}
