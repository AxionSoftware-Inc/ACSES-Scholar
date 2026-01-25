import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../../../components/layout/Container";
import courses from "../../../../content/courses.json";

export function generateStaticParams() {
  const params: { course: string; lesson: string }[] = [];
  for (const c of courses) {
    for (const l of c.lessons) params.push({ course: c.slug, lesson: l.slug });
  }
  return params;
}

export default async function LessonPage({ params }: { params: Promise<{ course: string; lesson: string }> }) {
  const { course, lesson } = await params;
  const c = courses.find((x) => x.slug === course);
  const l = c?.lessons.find((x) => x.slug === lesson);
  if (!c || !l) return notFound();

  return (
    <main className="py-14 md:py-20">
      <Container>
        <Link
          href={`/academy/${c.slug}`}
          className="mb-6 inline-flex text-sm text-muted-foreground hover:text-foreground no-underline hover:underline underline-offset-4"
        >
          ← {c.title}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">{l.title}</h1>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-black shadow-lg">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${l.youtubeId}`}
              title={l.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
