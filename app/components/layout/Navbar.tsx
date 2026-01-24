"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Container } from "./Container";

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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  const nav = useMemo(() => NAV, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Strong contrast bar */}
      <div className="border-b border-black/10 bg-white/95 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/80">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link href="/" className="group flex items-center gap-3">
              {/* Accent dot */}
              <span className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-black/10 bg-black text-white shadow-sm dark:border-white/10 dark:bg-white dark:text-black">
                <span className="text-sm font-semibold">A</span>
                <span className="pointer-events-none absolute -inset-1 rounded-[18px] ring-1 ring-black/10 dark:ring-white/10" />
              </span>

              <div className="leading-tight">
                <div className="text-[15px] font-semibold tracking-tight text-black dark:text-white">
                  ACSES
                </div>
                <div className="hidden text-[12px] text-black/60 dark:text-white/60 md:block">
                  Studio • Academy • Lab
                </div>
              </div>

              {/* subtle hover glow */}
              <span className="pointer-events-none absolute left-1/2 top-3 h-8 w-28 -translate-x-1/2 rounded-full bg-black/5 opacity-0 blur-xl transition group-hover:opacity-100 dark:bg-white/10" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                const common =
                  "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition";

                const inactive =
                  "text-black/70 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10";

                const activeCls =
                  "bg-black text-white shadow-sm dark:bg-white dark:text-black";

                const aProps = item.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {};

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...aProps}
                    className={`${common} ${active ? activeCls : inactive}`}
                  >
                    <span>{item.label}</span>

                    {item.badge ? (
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          active
                            ? "bg-white/15 text-white dark:bg-black/15 dark:text-black"
                            : "border border-black/10 bg-white text-black/60 dark:border-white/10 dark:bg-black/30 dark:text-white/60",
                        ].join(" ")}
                      >
                        {item.badge}
                      </span>
                    ) : null}

                    {/* Active accent underline (very subtle) */}
                    {active ? (
                      <span className="pointer-events-none absolute inset-x-4 -bottom-[10px] h-[2px] rounded-full bg-black/25 dark:bg-white/25" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Link
                href="/contact"
                className="hidden rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 md:inline-flex"
              >
                Start a project
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open menu"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black/5 p-2 text-black shadow-sm transition hover:bg-black/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 md:hidden"
              >
                <span className="relative block h-5 w-5">
                  <span
                    className={[
                      "absolute left-0 top-[5px] h-[2px] w-5 rounded-full bg-current transition",
                      open ? "translate-y-[5px] rotate-45" : "",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute left-0 top-[10px] h-[2px] w-5 rounded-full bg-current transition",
                      open ? "opacity-0" : "opacity-100",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute left-0 top-[15px] h-[2px] w-5 rounded-full bg-current transition",
                      open ? "-translate-y-[5px] -rotate-45" : "",
                    ].join(" ")}
                  />
                </span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile panel with strong contrast */}
      <div
        className={[
          "md:hidden",
          "border-b border-black/10 bg-white/98 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/90",
          open ? "block" : "hidden",
        ].join(" ")}
      >
        <Container>
          <div className="py-4">
            <div className="flex flex-col gap-2">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                const aProps = item.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {};

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...aProps}
                    className={[
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                      active
                        ? "border-black/15 bg-black text-white shadow-sm dark:border-white/15 dark:bg-white dark:text-black"
                        : "border-black/10 bg-black/5 text-black hover:bg-black/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          active
                            ? "bg-white/15 text-white dark:bg-black/15 dark:text-black"
                            : "border border-black/10 bg-white text-black/60 dark:border-white/10 dark:bg-black/30 dark:text-white/60",
                        ].join(" ")}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <span className={active ? "text-white/70 dark:text-black/60" : "text-black/40 dark:text-white/40"}>
                        →
                      </span>
                    )}
                  </Link>
                );
              })}

              <Link
                href="/contact"
                className="mt-2 inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                Start a project
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
