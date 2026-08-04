import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Reglas de uso, reservas, pagos y política de cancelación de Once FC.",
  alternates: { canonical: "/terminos" },
};

const sections = [
  {
    title: "1. Sobre el servicio",
    body: "Once FC organiza sesiones de entrenamiento de fútbol para adultos en canchas seleccionadas, con coaches asignados. Las sesiones se publican con cupo, precio y horario definidos; reservar un lugar requiere una cuenta y, cuando la sesión tiene costo, el pago correspondiente.",
  },
  {
    title: "2. Elegibilidad",
    body: "El servicio está dirigido a personas mayores de 18 años. Al reservar una sesión confirmas que cumples con este requisito y que participas por tu cuenta y riesgo, considerando la naturaleza física de la actividad.",
  },
  {
    title: "3. Reservas y pagos",
    body: "El pago se procesa en línea a través de Stripe al momento de reservar. Once FC no almacena los datos de tu tarjeta — Stripe los procesa directamente. Tu lugar queda confirmado una vez que el pago se completa; si el cupo se llena antes de que termines de pagar, no se te cobrará.",
  },
  {
    title: "4. Cancelaciones y reembolsos",
    body: "Los pagos por una sesión reservada no son reembolsables si decides no asistir o cancelas por tu parte. La única excepción es cuando Once FC cancela la sesión (por ejemplo, por clima, falta de coach o cierre de la cancha) — en ese caso se reembolsa el 100% del pago.",
  },
  {
    title: "5. Conducta",
    body: "Se espera respeto hacia coaches y demás jugadores dentro y fuera de la cancha. Once FC puede negar el acceso a una sesión o suspender una cuenta ante conducta abusiva, violenta o que ponga en riesgo a otros participantes.",
  },
  {
    title: "6. Cambios a estos términos",
    body: "Estos términos pueden actualizarse conforme el servicio evoluciona. La versión vigente siempre está disponible en esta página.",
  },
];

export default function TerminosPage() {
  return (
    <main id="main">
      <Nav />
      <section className="bg-coal pt-32 pb-20 text-bone">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
            Legal
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] sm:text-6xl">
            Términos y condiciones
          </h1>
          <p className="mt-6 font-body text-lg text-bone/80">
            Lo que aplica al reservar y pagar una sesión con Once FC.
          </p>

          <div className="mt-14 space-y-10 border-t border-bone/15 pt-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-xl text-bone">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-xl font-body text-sm text-bone/70">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 font-body text-sm text-bone/60">
            ¿Dudas sobre estos términos?{" "}
            <Link
              href="/ciudades"
              className="font-semibold text-volt hover:text-bone"
            >
              Elige tu ciudad
            </Link>{" "}
            y escríbele directo a un coach, o revisa las{" "}
            <Link
              href="/preguntas-frecuentes"
              className="font-semibold text-volt hover:text-bone"
            >
              preguntas frecuentes
            </Link>
            .
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
