import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JobApplicationForm from "@/components/JobApplicationForm";

export const metadata: Metadata = {
  title: "Bolsa de trabajo",
  description:
    "¿Quieres trabajar con nosotros como entrenador o coach en Once FC? Déjanos tus datos y cuéntanos sobre tu experiencia.",
};

export default function BolsaDeTrabajoPage() {
  return (
    <main id="main">
      <Nav />
      <section className="bg-coal pt-32 pb-24 text-bone">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
              Bolsa de trabajo
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[0.95] sm:text-6xl">
              Súmate al equipo de Once FC
            </h1>
            <p className="mt-6 max-w-md font-body text-lg text-bone/80">
              Buscamos entrenadores y coaches para nuestras sedes. Déjanos tus datos y cuéntanos
              sobre tu experiencia — te contactamos si tu perfil encaja con una vacante
              disponible.
            </p>
          </div>

          <JobApplicationForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
