import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Precio, qué llevar a tu primera sesión, cómo reservar y en qué canchas entrenamos. Todo lo que debes saber antes de tu primera sesión con Once FC.",
};

const faqs = [
  {
    question: "¿Necesito experiencia previa para entrenar?",
    answer:
      "No. Cada sesión indica su nivel, de Iniciación (sin presión) a Competitivo, así que reservas la que corresponda a tu condición actual. Un coach confirma tu nivel en la primera sesión.",
  },
  {
    question: "¿Cuánto cuesta una sesión?",
    answer:
      "El precio varía por ciudad y sesión. Agenda tu sesión gratuita y un coach te comparte el costo exacto y las opciones de pago.",
  },
  {
    question: "¿Qué debo llevar a mi primera sesión?",
    answer:
      "Ropa deportiva cómoda, tenis o zapatos de fútbol (tachones si los tienes), espinilleras y una botella de agua. Nosotros ponemos los balones y el material de entrenamiento.",
  },
  {
    question: "¿Tengo que ir siempre a la misma hora?",
    answer:
      "No. No hay membresía fija ni grupo asignado: reservas la sesión que te acomode en el momento que quieras, revisando el calendario de sesiones disponibles en tu ciudad.",
  },
  {
    question: "¿Hay partidos o solo entrenamientos?",
    answer:
      "Ambos. Además de las sesiones de entrenamiento, organizamos amistosos y torneos durante todo el año, así que compites, no solo practicas.",
  },
  {
    question: "¿Cómo veo qué sesiones hay disponibles?",
    answer:
      "En la sección de Eventos de la página de tu ciudad puedes ver las próximas sesiones confirmadas, con cancha, coach y horario asignado, y reservar tu lugar directamente.",
  },
  {
    question: "¿En qué ciudades opera Once FC?",
    answer:
      "Hoy entrenamos en Monterrey. Guadalajara, Ciudad de México, Tijuana y Saltillo abren próximamente en la apertura, con el mismo método y sedes seleccionadas por calidad en cada ciudad.",
  },
  {
    question: "¿Cómo agendo mi sesión gratuita?",
    answer:
      "Llena el formulario en la página de tu ciudad. Un coach te contacta por WhatsApp en menos de 24 horas para confirmar horario y darte la ubicación exacta de la cancha.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <section className="bg-coal pt-32 pb-20 text-bone">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">Ayuda</p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] sm:text-6xl">
            Preguntas frecuentes
          </h1>
          <p className="mt-6 font-body text-lg text-bone/80">
            Lo que más nos preguntan antes de agendar su primera sesión.
          </p>

          <div className="mt-14 divide-y divide-bone/15 border-t border-bone/15">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-bone marker:content-none">
                  {faq.question}
                  <span
                    className="flex-shrink-0 font-mono text-volt transition group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-xl font-body text-sm text-bone/70">{faq.answer}</p>
              </details>
            ))}
          </div>

          <p className="mt-12 font-body text-sm text-bone/60">
            ¿No encuentras tu respuesta?{" "}
            <Link href="/ciudades" className="font-semibold text-volt hover:text-bone">
              Elige tu ciudad
            </Link>{" "}
            y escríbele directo a un coach.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
