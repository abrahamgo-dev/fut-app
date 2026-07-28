type FooterProps = {
  zoneLabel?: string;
  scheduleNote?: string;
  /** Raw 10-digit Mexican mobile number, no spaces (e.g. "8110191519"). */
  contactWhatsapp?: string;
  contactEmail?: string;
};

function formatMxPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 10) return raw;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
}

export default function Footer({
  zoneLabel = "México",
  scheduleNote = "Lun a sáb",
  contactWhatsapp = "8110191519",
  contactEmail = "hola@once-fc.com",
}: FooterProps) {
  const waDigits = contactWhatsapp.replace(/\D/g, "");

  return (
    <footer className="bg-coal-deep py-14 text-bone">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:flex-row sm:justify-between">
        <div>
          <span className="font-display text-2xl">
            ONCE<span className="text-volt">FC</span>
          </span>
          <p className="mt-3 max-w-xs font-body text-sm text-bone/60">
            Club de entrenamiento de fútbol para adultos. Niveles de iniciación a competitivo.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-volt">Contacto</p>
            <ul className="mt-3 space-y-1 font-body text-sm text-bone/70">
              <li>
                <a
                  href={`https://wa.me/52${waDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-volt"
                >
                  WhatsApp {formatMxPhone(contactWhatsapp)}
                </a>
              </li>
              <li>{contactEmail}</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-volt">Cancha</p>
            <ul className="mt-3 space-y-1 font-body text-sm text-bone/70">
              <li>{zoneLabel}</li>
              <li>{scheduleNote}</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-volt">Ayuda</p>
            <ul className="mt-3 space-y-1 font-body text-sm text-bone/70">
              <li>
                <a href="/preguntas-frecuentes" className="hover:text-volt">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a href="/ciudades" className="hover:text-volt">
                  Todas las ciudades
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-bone/10 px-6 pt-6">
        <p className="font-mono text-xs text-bone/60">
          © {new Date().getFullYear()} Once FC. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
