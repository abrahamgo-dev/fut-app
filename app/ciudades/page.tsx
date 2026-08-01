import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CityPicker from "@/components/CityPicker";
import { getActiveCities } from "@/data/cities";

export const metadata: Metadata = {
  title: "Ciudades",
  description:
    "Once FC opera en varias ciudades de México. Elige tu ciudad para ver sesiones, sedes y agendar tu sesión gratuita.",
};

export default function CiudadesPage() {
  const cities = getActiveCities();

  return (
    <main id="main">
      <Nav />
      <section className="bg-coal pt-32 pb-20 text-bone">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
            Once FC en México
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] sm:text-7xl">
            Elige tu ciudad
          </h1>
          <p className="mt-6 max-w-md font-body text-lg text-bone/80">
            Hoy entrenamos en Monterrey — mismo club, mismo método llegando pronto a más
            ciudades.
          </p>

          <div className="mt-14">
            <h2 className="sr-only">Ciudades disponibles</h2>
            <CityPicker cities={cities} showMoreCitiesCard />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
