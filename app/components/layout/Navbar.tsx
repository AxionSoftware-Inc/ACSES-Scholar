import Link from "next/link";
import { Container } from "./Container";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Ecosystem" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-lg font-semibold tracking-tight">ACSES</div>
            <div className="hidden text-sm text-black/60 dark:text-white/60 md:block">
              Studio • Lab • Academy
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="text-sm text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                {i.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="rounded-full border border-black/15 px-4 py-2 text-sm hover:border-black/30 dark:border-white/15 dark:hover:border-white/30"
            >
              Start a project
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
