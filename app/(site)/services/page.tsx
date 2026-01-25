import Link from "next/link";
import services from "../../content/services.json";
import { Container } from "../../components/layout/Container";

type Service = {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
  summary?: string;
};

export const metadata = {
  title: "ACSES • Services",
  description: "Software engineering, education platforms, and R&D prototyping.",
};

export default function ServicesPage() {
  const items = services as Service[];

  return (
    <main className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Services
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            What ACSES builds: product engineering, education ecosystems, and research-grade prototypes.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="ac-card group overflow-hidden transition hover:bg-muted/20"
            >
              {s.imageUrl ? (
                <div className="relative">
                  <img
                    src={s.imageUrl}
                    alt={s.imageAlt || s.name}
                    className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                </div>
              ) : null}

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="ac-chip">{s.category}</span>
                  <span className="ac-chip">{s.status}</span>
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold tracking-tight text-foreground">
                      {s.name}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {s.tagline}
                    </div>
                  </div>

                  <span className="text-muted-foreground transition group-hover:text-foreground">
                    →
                  </span>
                </div>

                {s.summary ? (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {s.summary}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="ac-badge">View details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
