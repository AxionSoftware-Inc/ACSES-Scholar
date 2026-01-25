import Link from "next/link";
import { notFound } from "next/navigation";
import services from "../../../content/services.json";
import { Container } from "../../../components/layout/Container";

type Service = {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  category: string;

  imageUrl?: string;
  imageAlt?: string;

  summary?: string;

  deliverables?: string[];
  capabilities?: string[];
  stack?: string[];

  process?: { title: string; desc: string }[];
  faq?: { q: string; a: string }[];

  ctas?: { label: string; href: string; kind?: "primary" | "secondary" }[];
};

type Params = { slug: string } | Promise<{ slug: string }>;
async function unwrapParams(p: Params) {
  return await p;
}

export function generateStaticParams() {
  return (services as Service[]).map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await unwrapParams(params);
  const it = (services as Service[]).find((x) => x.slug === slug);
  if (!it) return { title: "ACSES • Services" };
  return {
    title: `ACSES • ${it.name}`,
    description: it.summary || it.tagline,
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

function CtaBtn({
  href,
  label,
  kind,
}: {
  href: string;
  label: string;
  kind?: "primary" | "secondary";
}) {
  if (kind === "primary") {
    return (
      <Link
        href={href}
        className="ac-btn bg-accent text-accent-foreground shadow-md hover:opacity-90 active:scale-95"
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="ac-btn border border-border/30 bg-muted/30 text-foreground hover:bg-muted active:scale-95"
    >
      {label}
    </Link>
  );
}

export default async function ServiceSlugPage({ params }: { params: Params }) {
  const { slug } = await unwrapParams(params);
  const it = (services as Service[]).find((x) => x.slug === slug);
  if (!it) return notFound();

  const more = (services as Service[]).filter((x) => x.slug !== it.slug).slice(0, 2);

  return (
    <main className="py-10 md:py-14">
      <Container>
        {/* Hero */}
        <section className="ac-card overflow-hidden">
          {it.imageUrl ? (
            <div className="relative">
              <img
                src={it.imageUrl}
                alt={it.imageAlt || it.name}
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

            {it.summary ? (
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {it.summary}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-2">
              {it.ctas?.length
                ? it.ctas.map((c) => (
                    <CtaBtn key={c.href + c.label} href={c.href} label={c.label} kind={c.kind} />
                  ))
                : null}

              <Link
                href="/services"
                className="ac-btn border border-border/30 bg-transparent text-foreground hover:bg-muted/30 active:scale-95"
              >
                Back to Services
              </Link>
            </div>
          </div>
        </section>

        {/* Deliverables + Capabilities */}
        <section className="mt-6 grid gap-6 md:grid-cols-12">
          <div className="ac-card p-6 md:col-span-7">
            <SectionTitle title="Deliverables" desc="What you get from this service." />
            {it.deliverables?.length ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {it.deliverables.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">To be defined.</div>
            )}
          </div>

          <div className="ac-card p-6 md:col-span-5">
            <SectionTitle title="Capabilities" desc="What we can cover in practice." />
            {it.capabilities?.length ? (
              <div className="flex flex-wrap gap-2">
                {it.capabilities.map((c) => (
                  <span key={c} className="ac-badge">
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">To be defined.</div>
            )}
          </div>
        </section>

        {/* Stack */}
        {it.stack?.length ? (
          <section className="mt-10">
            <SectionTitle title="Typical stack" desc="Tools and technologies commonly used." />
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

        {/* Process */}
        {it.process?.length ? (
          <section className="mt-10">
            <SectionTitle title="Process" desc="How we typically deliver." />
            <div className="ac-card p-6">
              <div className="space-y-4">
                {it.process.map((p, idx) => (
                  <div key={p.title} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{p.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* FAQ */}
        {it.faq?.length ? (
          <section className="mt-10">
            <SectionTitle title="FAQ" desc="Common questions." />
            <div className="ac-card p-6">
              <div className="space-y-4">
                {it.faq.map((f) => (
                  <div key={f.q} className="rounded-2xl border border-border/30 bg-muted/20 p-5">
                    <div className="text-sm font-semibold text-foreground">{f.q}</div>
                    <div className="mt-2 text-sm text-muted-foreground">{f.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* More services */}
        {more.length ? (
          <section className="mt-10">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-foreground">More services</div>
                <div className="text-xs text-muted-foreground">Other things ACSES can deliver</div>
              </div>
              <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {more.map((m) => (
                <Link
                  key={m.slug}
                  href={`/services/${m.slug}`}
                  className="ac-card p-6 transition hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold text-foreground">{m.name}</div>
                    <span className="ac-chip">{m.status}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{m.tagline}</div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
}
