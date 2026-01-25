import Link from "next/link";
import ecosystem from "../../content/ecosystem.json";
import { Container } from "../../components/layout/Container";

type Item = {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  category: string;
  cover?: { imageUrl: string; alt?: string };
  primaryCta?: { label: string; href: string };
};

export const metadata = {
  title: "ACSES • Ecosystem",
  description: "ACSES products and initiatives that scale into standalone platforms.",
};

export default function EcosystemPage() {
  const items = ecosystem as Item[];

  return (
    <main className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ecosystem
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Major ACSES initiatives designed to scale into standalone products.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((it) => (
            <Link
              key={it.slug}
              href={`/ecosystem/${it.slug}`}
              className="ac-card group overflow-hidden transition hover:bg-muted/20"
            >
              {it.cover?.imageUrl ? (
                <div className="relative">
                  <img
                    src={it.cover.imageUrl}
                    alt={it.cover.alt || it.name}
                    className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                </div>
              ) : null}

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="ac-chip">{it.category}</span>
                  <span className="ac-chip">{it.status}</span>
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold tracking-tight text-foreground">
                      {it.name}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {it.tagline}
                    </div>
                  </div>

                  <span className="text-muted-foreground transition group-hover:text-foreground">
                    →
                  </span>
                </div>

                {it.primaryCta?.label ? (
                  <div className="mt-5">
                    <span className="ac-badge">
                      {it.primaryCta.label}
                    </span>
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
