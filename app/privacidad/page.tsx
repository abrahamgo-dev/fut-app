import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Qué datos recaba Once FC, para qué los usa y cómo ejercer tus derechos ARCO.",
  alternates: { canonical: "/privacidad" },
};

const sections = [
  {
    title: "1. Responsable",
    body: "Once FC (\"nosotros\") es responsable del tratamiento de tus datos personales conforme a este aviso. Puedes contactarnos en hola@once-fc.com o en el correo de tu ciudad.",
  },
  {
    title: "2. Datos que recabamos",
    body: "Nombre, correo y foto de perfil (al iniciar sesión con Google); teléfono, edad y ciudad si los compartes en un formulario de contacto o postulación; e historial de tus reservas y sesiones. No almacenamos los datos de tu tarjeta — Stripe los procesa directamente y nunca llegan a nuestros servidores.",
  },
  {
    title: "3. Para qué los usamos",
    body: "Para crear tu cuenta, gestionar tus reservas y pagos, contactarte sobre tus sesiones (confirmaciones, cambios, recordatorios), responder a tus mensajes y mejorar el servicio. No vendemos tus datos a terceros.",
  },
  {
    title: "4. Con quién los compartimos",
    body: "Con proveedores que nos ayudan a operar el servicio: Google (inicio de sesión), Stripe (pagos) y un proveedor de correo para enviarte confirmaciones y notificaciones. Cada uno trata tus datos bajo sus propias políticas de privacidad.",
  },
  {
    title: "5. Tus derechos (ARCO)",
    body: "Puedes solicitar acceder, rectificar, cancelar tus datos personales, u oponerte a su uso, escribiendo a hola@once-fc.com. Responderemos tu solicitud en un plazo razonable.",
  },
  {
    title: "6. Cambios a este aviso",
    body: "Este aviso puede actualizarse conforme el servicio evoluciona. La versión vigente siempre está disponible en esta página.",
  },
];

export default function PrivacidadPage() {
  return (
    <main id="main">
      <Nav />
      <section className="bg-coal pt-32 pb-20 text-bone">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">
            Legal
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[0.95] sm:text-6xl">
            Aviso de privacidad
          </h1>
          <p className="mt-6 font-body text-lg text-bone/80">
            Qué datos recabamos, para qué los usamos y cómo ejercer tus
            derechos sobre ellos.
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
            ¿Dudas sobre el manejo de tus datos?{" "}
            <Link
              href="/ciudades"
              className="font-semibold text-volt hover:text-bone"
            >
              Elige tu ciudad
            </Link>{" "}
            y escríbele directo a un coach, o revisa nuestros{" "}
            <Link
              href="/terminos"
              className="font-semibold text-volt hover:text-bone"
            >
              términos y condiciones
            </Link>
            .
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
