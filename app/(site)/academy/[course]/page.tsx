import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../../components/layout/Container";
import courses from "../../../content/courses.json";

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.slug }));
}

export default function CoursePage({ params }: { params: { course: string } }) {
  const c = courses.find((x) => x.slug === params.course);
  if (!c) return notFound();

  return (
    <main className="py-14 md:py-20">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{c.title}</h1>
          <div className="rounded-full border border-border/10 px-3 py-1 text-sm text-muted-foreground">
            {c.level}
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          {c.description}
        </p>

        <div className="mt-8 rounded-3xl border border-border/10 bg-card p-6">
          <div className="text-sm font-medium">Lessons</div>
          <div className="mt-4 space-y-2">
            {c.lessons.map((l) => (
              <Link
                key={l.slug}
                href={`/academy/${c.slug}/${l.slug}`}
                className="block rounded-2xl border border-border/10 px-4 py-3 text-sm hover:border-border/30 hover:bg-muted/50"
              >
                {l.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/academy"
            className="ac-btn border border-border/20 bg-background/50 hover:bg-muted"
          >
            Back to courses
          </Link>
        </div>
      </Container>
    </main>
  );
}
