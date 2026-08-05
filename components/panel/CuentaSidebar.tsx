"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/panel/cuenta", label: "Mis reservas" },
  { href: "/panel/cuenta/perfil", label: "Perfil" },
];

export default function CuentaSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-bone/10 pb-3 md:w-44 md:shrink-0 md:flex-col md:gap-1 md:border-b-0 md:border-r md:border-bone/10 md:pb-0 md:pr-4">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-sm px-3 py-2 font-body text-sm font-medium transition ${
              active
                ? "bg-volt/10 text-volt"
                : "text-bone/70 hover:bg-bone/5 hover:text-bone"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
