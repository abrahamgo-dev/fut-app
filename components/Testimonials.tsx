import type { Testimonial } from "@/data/cities";

const defaultTestimonials: Testimonial[] = [
  {
    quote:
      "Dejé de jugar como 10 años por la chamba. Volver a entrenar dos veces por semana me regresó la condición... y las ganas.",
    name: "Jugador, nivel intermedio",
  },
  {
    quote:
      "Entro derechito de mi casa a las 7 de la mañana. Es lo único que me ha hecho sostener una rutina de ejercicio en años.",
    name: "Jugador, grupo mañanero",
  },
  {
    quote:
      "No es una escuelita, se siente como un equipo de verdad: entrenamos táctica, jugamos partidos en serio y hay rivalidad sana con otros clubes.",
    name: "Jugador, nivel competitivo",
  },
];

export default function Testimonials({
  testimonials = defaultTestimonials,
}: {
  testimonials?: Testimonial[];
}) {
  return (
    <section id="testimonios" className="bg-coal py-24 text-bone">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">Testimonios</p>
        <h2 className="mt-3 max-w-xl font-display text-4xl sm:text-5xl">
          Lo que dicen en la banca
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="flex flex-col justify-between border-t border-bone/20 pt-6"
            >
              <p className="font-body text-base leading-relaxed text-bone/90">“{t.quote}”</p>
              <footer className="mt-6 font-mono text-xs uppercase tracking-widest text-volt-dim">
                {t.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
