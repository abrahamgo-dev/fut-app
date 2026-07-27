import Link from "next/link";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Method from "@/components/Method";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CityPicker from "@/components/CityPicker";
import { getActiveCities } from "@/data/cities";

export default function Home() {
  const cities = getActiveCities();

  return (
    <main id="main">
      <Nav />
      <Hero />
      <Categories />
      <Method />
      <Testimonials />

      <section id="ciudades" className="bg-coal py-24 text-bone">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
            Dónde entrenamos
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-4xl sm:text-5xl">Elige tu ciudad</h2>
            <p className="max-w-sm font-body text-sm text-bone/60">
              Mismo club, mismo método, en cada ciudad donde entrenamos. Agenda tu sesión
              gratuita desde la página de tu ciudad.
            </p>
          </div>

          <div className="mt-12">
            <CityPicker cities={cities} />
          </div>

          <Link
            href="/ciudades"
            className="mt-8 inline-block font-body text-sm font-semibold text-volt hover:text-bone"
          >
            Ver todas las ciudades →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
