import { Container } from "../layout/Container";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-black/10 blur-3xl dark:bg-white/10" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-black/5 blur-3xl dark:bg-white/5" />
      </div>

      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs text-black/70 dark:border-white/10 dark:text-white/70">
              ACSES • Software • Academy • Hardware • R&D
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
              Build serious products with a studio that ships.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-black/70 dark:text-white/70">
              We design and develop software, create educational platforms, prototype hardware,
              and publish research-grade visualizations — inside one ecosystem.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-black px-5 py-2.5 text-sm text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                Start a project
              </Link>
              <Link
                href="/projects"
                className="rounded-full border border-black/15 px-5 py-2.5 text-sm hover:border-black/30 dark:border-white/15 dark:hover:border-white/30"
              >
                Explore ecosystem
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-3xl border border-black/10 p-6 shadow-sm dark:border-white/10">
              <div className="text-sm text-black/60 dark:text-white/60">Core capabilities</div>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-black/80 dark:text-white/80">Product engineering</span>
                  <span className="text-black/50 dark:text-white/50">Web • Mobile • AR</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-black/80 dark:text-white/80">Academy platform</span>
                  <span className="text-black/50 dark:text-white/50">Courses • Mentorship</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-black/80 dark:text-white/80">Hardware prototyping</span>
                  <span className="text-black/50 dark:text-white/50">IoT • Devices</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-black/80 dark:text-white/80">R&D visualization</span>
                  <span className="text-black/50 dark:text-white/50">Science • Simulation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
