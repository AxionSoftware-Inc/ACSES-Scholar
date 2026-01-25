import Link from "next/link";
import { notFound } from "next/navigation";
import projects from "../../../content/projects.json";
import { Container } from "../../../components/layout/Container";

type Item = {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  category: string;
  description?: string;
  highlights?: string[];
  stack?: string[];
  metrics?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
};

type Params = { slug: string } | Promise<{ slug: string }>;
async function unwrapParams(p: Params) {
  return await p;
}

export function generateStaticParams() {
  return (projects as Item[]).map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await unwrapParams(params);
  const it = (projects as Item[]).find((x) => x.slug === slug);
  if (!it) return { title: "ACSES • Projects" };
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

export default async function ProjectSlugPage({ params }: { params: Params }) {
  const { slug } = await unwrapParams(params);
  const it = (projects as Item[]).find((x) => x.slug === slug);
  if (!it) return notFound();

  const related = (projects as Item[]).filter((x) => x.slug !== it.slug).slice(0, 2);

  return (
    <main className="py-10 md:py-14">
      <Container>
        {/* Hero */}
        <section className="ac-card p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
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
                <Link
                  href="/projects"
                  className="ac-btn border border-border/30 bg-transparent text-foreground hover:bg-muted/30 active:scale-95"
                >
                  Back to Projects
                </Link>

                <Link
                  href="/contact"
                  className="ac-btn bg-accent text-accent-foreground shadow-md hover:opacity-90 active:scale-95"
                >
                  Start a project
                </Link>
              </div>
            </div>

            {/* Metrics */}
            {it.metrics?.length ? (
              <div className="grid w-full gap-2 md:w-[320px]">
                {it.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-border/30 bg-muted/30 p-4"
                  >
                    <div className="text-xs font-semibold text-foreground">{m.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{m.value}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Highlights + Stack */}
        <section className="mt-6 grid gap-6 md:grid-cols-12">
          <div className="ac-card p-6 md:col-span-7">
            <SectionTitle title="Highlights" desc="What we shipped or are building." />
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
            <SectionTitle title="Stack" desc="Technologies used or planned." />
            {it.stack?.length ? (
              <div className="flex flex-wrap gap-2">
                {it.stack.map((s) => (
                  <span key={s} className="ac-badge">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">To be defined.</div>
            )}
          </div>
        </section>

        {/* Optional: Extra links from JSON */}
        {it.links?.length ? (
          <section className="mt-10">
            <SectionTitle title="Links" desc="Direct resources and references." />
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

        {/* Related */}
        {related.length ? (
          <section className="mt-10">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-foreground">More projects</div>
                <div className="text-xs text-muted-foreground">Other work and experiments</div>
              </div>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/projects/${r.slug}`}
                  className="ac-card p-6 transition hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold text-foreground">{r.name}</div>
                    <span className="ac-chip">{r.status}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{r.tagline}</div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
}
