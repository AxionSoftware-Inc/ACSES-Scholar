import Link from "next/link";
import { notFound } from "next/navigation";
import ecosystem from "../../../content/ecosystem.json";
import { Container } from "../../../components/layout/Container";

type Item = {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  category: string;
  description?: string;
  cover?: { imageUrl: string; alt?: string };
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  highlights?: string[];
  metrics?: { label: string; value: string }[];
  stack?: string[];
  roadmap?: { title: string; desc: string }[];
  links?: { label: string; href: string }[];
};

export function generateStaticParams() {
  return (ecosystem as Item[]).map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const it = (ecosystem as Item[]).find((x) => x.slug === slug);
  if (!it) return { title: "ACSES • Ecosystem" };
  return {
    title: `ACSES • ${it.name}`,
    description: it.description || it.tagline,
  };
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-4">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      {desc ? <div className="mt-1 text-xs text-muted-foreground">{desc}</div> : null}
    </div>
  );
}

export default async function EcosystemSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const it = (ecosystem as Item[]).find((x) => x.slug === slug);
  if (!it) return notFound();

  return (
    <main className="py-10 md:py-14">
      <Container>
        {/* Hero */}
        <section className="ac-card overflow-hidden">
          {it.cover?.imageUrl ? (
            <div className="relative">
              <img
                src={it.cover.imageUrl}
                alt={it.cover.alt || it.name}
                className="h-56 w-full object-cover md:h-72"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            </div>
          ) : null}

          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="ac-chip">{it.category}</span>
              <span className="ac-chip">{it.status}</span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {it.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{it.tagline}</p>

            {it.description ? (
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {it.description}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-2">
              {it.primaryCta ? (
                <Link
                  href={it.primaryCta.href}
                  className="ac-btn bg-accent text-accent-foreground shadow-md hover:opacity-90 active:scale-95"
                >
                  {it.primaryCta.label}
                </Link>
              ) : null}

              {it.secondaryCta ? (
                <Link
                  href={it.secondaryCta.href}
                  className="ac-btn border border-border/30 bg-muted/30 text-foreground hover:bg-muted active:scale-95"
                >
                  {it.secondaryCta.label}
                </Link>
              ) : null}

              <Link
                href="/ecosystem"
                className="ac-btn border border-border/30 bg-transparent text-foreground hover:bg-muted/30 active:scale-95"
              >
                Back to Ecosystem
              </Link>
            </div>
          </div>
        </section>

        {/* Highlights + Metrics */}
        <section className="mt-6 grid gap-6 md:grid-cols-12">
          <div className="ac-card p-6 md:col-span-7">
            <SectionTitle title="Highlights" desc="Key differentiators and focus points." />
            {it.highlights?.length ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {it.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No highlights yet.</div>
            )}
          </div>

          <div className="ac-card p-6 md:col-span-5">
            <SectionTitle title="Quick facts" desc="Stage, model, and operating shape." />
            {it.metrics?.length ? (
              <div className="grid gap-2">
                {it.metrics.map((m) => (
                  <div key={m.label} className="rounded-2xl border border-border/30 bg-muted/30 p-4">
                    <div className="text-xs font-semibold text-foreground">{m.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{m.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No metrics yet.</div>
            )}
          </div>
        </section>

        {/* Stack */}
        {it.stack?.length ? (
          <section className="mt-10">
            <SectionTitle title="Stack" desc="Current or planned technologies." />
            <div className="ac-card p-6">
              <div className="flex flex-wrap gap-2">
                {it.stack.map((s) => (
                  <span key={s} className="ac-badge">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Roadmap */}
        {it.roadmap?.length ? (
          <section className="mt-10">
            <SectionTitle title="Roadmap" desc="Planned evolution over time." />
            <div className="ac-card p-6">
              <div className="space-y-4">
                {it.roadmap.map((r, idx) => (
                  <div key={r.title} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{r.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Links */}
        {it.links?.length ? (
          <section className="mt-10">
            <SectionTitle title="Links" desc="Direct resources and shortcuts." />
            <div className="grid gap-3 md:grid-cols-2">
              {it.links.map((l) => (
                <a
                  key={l.href + l.label}
                  href={l.href}
                  className="ac-card p-5 text-sm text-foreground hover:bg-muted/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{l.label}</span>
                    <span className="text-muted-foreground">→</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{l.href}</div>
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
}
