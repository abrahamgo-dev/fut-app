export default function Nav() {
  const links = [
    { href: "#niveles", label: "Niveles" },
    { href: "#metodo", label: "Método" },
    { href: "#testimonios", label: "Testimonios" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-bone/10 bg-coal-deep/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="13" stroke="#B6FF3B" strokeWidth="1.5" />
            <path d="M14 5 L18 9 L16.5 14 L11.5 14 L10 9 Z" fill="#B6FF3B" />
            <path d="M14 5 V1.5 M14 27 V23 M2 14 H5.5 M22.5 14 H26" stroke="#B6FF3B" strokeWidth="1.2" />
          </svg>
          <span className="font-display text-xl tracking-wide text-bone">
            ONCE<span className="text-volt">FC</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-body text-sm font-medium text-bone/80 transition hover:text-volt"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#prueba"
          className="rounded-sm bg-volt px-4 py-2 font-body text-sm font-semibold text-coal-deep transition hover:bg-bone"
        >
          Reserva tu sesión
        </a>
      </nav>
    </header>
  );
}
