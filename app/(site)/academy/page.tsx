import Link from "next/link";
import { Container } from "../../components/layout/Container";
import courses from "../../content/courses.json";

export default function AcademyPage() {
  return (
    <main className="py-14 md:py-20">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">ACSES Academy</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Courses hosted on YouTube, organized as a clean curriculum inside the ACSES ecosystem.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {courses.map((c) => (
            <Link
              key={c.slug}
              href={`/academy/${c.slug}`}
              className="ac-card ac-card-hover p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-lg font-semibold">{c.title}</div>
                <div className="rounded-full border border-border/10 px-2 py-1 text-xs text-muted-foreground">
                  {c.level}
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{c.description}</div>
              <div className="mt-4 text-xs text-muted-foreground/60">{c.category}</div>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
