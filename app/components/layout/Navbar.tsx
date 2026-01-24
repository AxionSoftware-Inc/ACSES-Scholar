"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Container } from "./Container";
import { Menu, X } from "lucide-react";

type NavItem = { href: string; label: string; badge?: string; external?: boolean };

const NAV: NavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Ecosystem" },
  { href: "/academy", label: "Academy", badge: "Beta" },
  // Scholar alohida bo‘lsa:
  // { href: "https://scholar.acses.uz", label: "Scholar", external: true },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close mobile menu on route change logic handled via Link onClick now
  // Keeping this empty hook if needed for other side effects, but cleaner to remove if unused. 
  // actually, let's keep it clean.

  const nav = useMemo(() => NAV, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* --- Brand --- */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 outline-none"
              onClick={() => setOpen(false)}
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background shadow-md transition group-hover:scale-95 group-active:scale-90">
                <span className="font-bold tracking-tighter">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground">ACSES</span>
                <span className="text-[10px] font-medium text-muted-foreground">Ecosystem</span>
              </div>
            </Link>

            {/* --- Desktop Nav --- */}
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                const props = item.external ? { target: "_blank", rel: "noreferrer" } : {};

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...props}
                    className={`
                      ${active
                        ? "bg-foreground/5 text-foreground font-semibold"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                      }
                      relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring
                    `}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`
                        flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider
                        ${active
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground border border-border/20"
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* --- Actions --- */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <div className="hidden h-6 w-px bg-border/40 md:block" />

              <Link
                href="/contact"
                className="hidden md:inline-flex ac-btn bg-foreground text-background shadow-md hover:opacity-90 active:scale-95"
              >
                Start Project
              </Link>

              {/* Mobile Trigger */}
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="inline-flex items-center justify-center rounded-full border border-border/20 bg-muted/50 p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95 md:hidden"
                aria-label="Toggle menu"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* --- Mobile Menu Overlay --- */}
      <div
        className={`fixed inset-x-0 top-16 z-40 border-b border-border/10 bg-background/95 backdrop-blur-3xl transition-all duration-300 md:hidden ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <Container>
          <div className="flex flex-col gap-2 py-6">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center justify-between rounded-2xl border px-5 py-4 text-sm font-medium transition-all
                    ${active
                      ? "border-foreground/10 bg-foreground text-background shadow-md"
                      : "border-border/40 bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-background/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="mt-2 h-px w-full bg-border/30" />
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex w-full items-center justify-center rounded-2xl bg-foreground py-4 text-sm font-bold text-background shadow-md active:scale-95 transition-transform"
            >
              Start Project →
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
