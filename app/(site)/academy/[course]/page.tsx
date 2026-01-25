import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../../components/layout/Container";
import courses from "../../../content/courses.json";

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.slug }));
}

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  const c = courses.find((x) => x.slug === course);
  if (!c) return notFound();

  return (
    <main className="py-14 md:py-20">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="ac-chip">{c.category}</span>
              <span className="ac-chip">{c.level}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">{c.title}</h1>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {c.description}
        </p>

        <div className="mt-10">
          <div className="text-sm font-semibold text-foreground">Curriculum</div>
          <div className="mt-4 grid gap-3">
            {c.lessons.map((l, idx) => (
              <Link
                key={l.slug}
                href={`/academy/${c.slug}/${l.slug}`}
                className="ac-card group flex items-center justify-between p-4 hover:bg-muted/30 transition-all active:scale-[99%]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-foreground">{l.title}</span>
                </div>
                <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/academy"
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            ← Back to courses
          </Link>
        </div>
      </Container>
    </main>
  );
}
