import { Container } from "../layout/Container";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-black/10 blur-3xl dark:bg-white/10" />
        <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-black/5 blur-3xl dark:bg-white/5" />
      </div>

      <Container>
        <div className="relative grid gap-10 py-16 md:grid-cols-12 md:items-center md:py-24">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              ACSES • Studio / Academy / Lab
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              One ecosystem to build, ship, and teach.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              ACSES develops software products, runs a course ecosystem, prototypes hardware,
              and publishes research-grade visualizations.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="ac-btn bg-foreground text-background hover:opacity-90 dark:bg-foreground dark:text-background"
              >
                Start a project
              </Link>

              <Link
                href="/academy"
                className="ac-btn border border-border/20 bg-background/50 hover:bg-muted"
              >
                Open Academy
              </Link>

              <a
                href="https://www.youtube.com"
                className="ac-btn border border-border/20 bg-transparent hover:bg-muted"
                target="_blank"
                rel="noreferrer"
              >
                Watch demo
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border/10 bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Delivery</div>
                <div className="mt-1 text-sm font-medium">MVP → Product</div>
              </div>
              <div className="rounded-2xl border border-border/10 bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Focus</div>
                <div className="mt-1 text-sm font-medium">Quality systems</div>
              </div>
              <div className="rounded-2xl border border-border/10 bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Ecosystem</div>
                <div className="mt-1 text-sm font-medium">Projects scale out</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-border/10 bg-card/40 shadow-sm backdrop-blur">
              <div className="p-4">
                <div className="text-sm font-medium">Featured</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Replace this with your best product screenshot later.
                </div>
              </div>

              {/* Use a remote image for now */}
              <img
                src="https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1600&q=80"
                alt="ACSES visual"
                className="h-72 w-full object-cover md:h-80"
                loading="lazy"
              />

              <div className="p-4 text-xs text-muted-foreground">
                Tip: later we’ll swap to Next Image + your own brand visuals.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
