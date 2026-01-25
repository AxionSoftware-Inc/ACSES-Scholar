import Link from "next/link";
import projects from "../../content/projects.json";
import { Container } from "../../components/layout/Container";

type Item = {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  category: string;
};

export const metadata = {
  title: "ACSES • Projects",
  description: "Client work, prototypes, and internal experiments by ACSES.",
};

export default function ProjectsPage() {
  const items = projects as Item[];

  return (
    <main className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Projects
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Client work, prototypes, and internal experiments.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="ac-card group p-6 transition hover:bg-muted/20"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="ac-chip">{p.category}</span>
                <span className="ac-chip">{p.status}</span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold tracking-tight text-foreground">
                    {p.name}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {p.tagline}
                  </div>
                </div>

                <span className="text-muted-foreground transition group-hover:text-foreground">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
