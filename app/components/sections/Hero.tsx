import { Container } from "../layout/Container";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-accent/20 blur-3xl" />
      </div>

      <Container>
        <div className="relative grid gap-10 py-16 md:grid-cols-12 md:items-center md:py-24">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              ACSES Scholar • Online Ta&apos;lim Platformasi
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Kelajak ta&apos;limi — bugun.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Maktab o&apos;quvchilari uchun matematika va fizika fanlaridan mukammal video darslar, mashqlar va bilimni mustahkamlash tizimi.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/classes"
                className="ac-btn bg-foreground text-background hover:opacity-90 dark:bg-foreground dark:text-background"
              >
                Darslarni boshlash
              </Link>

              <Link
                href="/about"
                className="ac-btn border border-border/20 bg-background/50 hover:bg-muted"
              >
                Batafsil ma&apos;lumot
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border/10 bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Fanlar</div>
                <div className="mt-1 text-sm font-medium">Matematika va Fizika</div>
              </div>
              <div className="rounded-2xl border border-border/10 bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Sinflar</div>
                <div className="mt-1 text-sm font-medium">7, 8, 9, 10, 11</div>
              </div>
              <div className="rounded-2xl border border-border/10 bg-card/50 p-4">
                <div className="text-xs text-muted-foreground">Format</div>
                <div className="mt-1 text-sm font-medium">Video darslar</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-border/10 bg-card/40 shadow-sm backdrop-blur">
              <div className="p-4">
                <div className="text-sm font-medium">Video Darslar</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Har bir mavzu uchun maxsus tayyorlangan videolar
                </div>
              </div>

              {/* Use Next.js Image component for optimization */}
              <div className="relative h-72 w-full md:h-80">
                <img
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=80"
                  alt="ACSES Scholar"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
