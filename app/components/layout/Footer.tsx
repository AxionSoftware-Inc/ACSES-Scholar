import Link from "next/link";
import { Container } from "./Container";

// removed unused arrays ecosystem and company

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/10 bg-card py-12">
      <Container>
        {/* Top area */}
        <div className="grid gap-10 py-12 md:grid-cols-12">
          {/* Brand column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm">
                <span className="text-sm font-semibold">A</span>
              </div>
              <div className="leading-tight">
                <div className="text-base font-semibold tracking-tight text-foreground">
                  ACSES
                </div>
                <div className="text-xs text-muted-foreground">
                  Educational Platform
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Maktab o&apos;quvchilari uchun matematika va fizika fanlaridan onlayn darslar va resurslar platformasi.
            </p>

            {/* Contact chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="https://t.me/ACSES_SCHOLAR"
                target="_blank"
                rel="noreferrer"
                className="ac-chip"
              >
                Telegram
              </a>
              <a
                href="mailto:scholar@acses.uz"
                className="ac-chip"
              >
                Email
              </a>
              <Link
                href="/contact"
                className="ac-chip"
              >
                Aloqa
              </Link>
            </div>

            {/* Optional: small note */}
            <div className="mt-6 text-xs text-muted-foreground/60">
              O&apos;zbekistonda ishlab chiqilgan • Barcha uchun ochiq
            </div>
          </div>

          {/* Links columns */}
          <div className="md:col-span-7 md:grid md:grid-cols-2 md:gap-10">
            <div>
              <div className="text-sm font-semibold text-foreground">
                Platforma
              </div>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/classes" className="text-sm text-muted-foreground hover:text-foreground">
                    Sinflar
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    Biz haqimizda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                    Aloqa
                  </Link>
                </li>
              </ul>

              {/* Mini CTA */}
              <div className="mt-6">
                <Link
                  href="/classes"
                  className="ac-btn bg-foreground text-background hover:opacity-90 dark:bg-foreground dark:text-background"
                >
                  O&apos;qishni boshlash
                </Link>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-foreground">
                Resurslar
              </div>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/classes" className="text-sm text-muted-foreground hover:text-foreground">
                    Video Darslar
                  </Link>
                </li>
                <li>
                  <Link href="/classes" className="text-sm text-muted-foreground hover:text-foreground">
                    Fizika
                  </Link>
                </li>
                <li>
                  <Link href="/classes" className="text-sm text-muted-foreground hover:text-foreground">
                    Matematika
                  </Link>
                </li>
              </ul>

              {/* Social row */}
              <div className="mt-6">
                <div className="text-xs text-muted-foreground/60">
                  Social
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="ac-badge hover:bg-muted-foreground/10"
                  >
                    YouTube
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="ac-badge hover:bg-muted-foreground/10"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="ac-badge hover:bg-muted-foreground/10"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom legal bar */}
        <div className="flex flex-col gap-3 border-t border-border/10 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} ACSES. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground"
            >
              Terms
            </Link>
            <span className="text-muted-foreground/40">
              v1.0
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
