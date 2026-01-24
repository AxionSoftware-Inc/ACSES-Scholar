import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "../../../components/layout/Container";
import projects from "../../../content/projects.json";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const p = projects.find((x) => x.slug === params.slug);
  if (!p) return notFound();

  return (
    <main className="py-14 md:py-20">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{p.name}</h1>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border/10 px-3 py-1 text-sm text-muted-foreground">
              {p.type}
            </span>
            <span className="rounded-full border border-border/10 px-3 py-1 text-sm text-muted-foreground">
              {p.status}
            </span>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-base text-muted-foreground">
          {p.description}
        </p>

        {p.highlights?.length ? (
          <div className="mt-8 rounded-3xl border border-border/10 bg-card p-6 shadow-sm">
            <div className="text-sm font-medium">Highlights</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {p.links?.length ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {p.links.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="ac-btn bg-foreground text-background hover:opacity-90 dark:bg-foreground dark:text-background"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/projects"
              className="ac-btn border border-border/20 bg-background/50 hover:bg-muted"
            >
              Back to Ecosystem
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <Link
              href="/projects"
              className="ac-btn border border-border/20 bg-background/50 hover:bg-muted"
            >
              Back to Ecosystem
            </Link>
          </div>
        )}
      </Container>
    </main>
  );
}
