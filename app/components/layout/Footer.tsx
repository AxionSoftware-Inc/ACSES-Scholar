import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-black/10 py-10 dark:border-white/10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-black/60 dark:text-white/60">
            © {new Date().getFullYear()} ACSES. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white" href="/services">
              Services
            </Link>
            <Link className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white" href="/projects">
              Ecosystem
            </Link>
            <Link className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
