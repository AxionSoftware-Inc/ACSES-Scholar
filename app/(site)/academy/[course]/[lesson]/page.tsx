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

export default function LessonPage({ params }: { params: { course: string; lesson: string } }) {
  const c = courses.find((x) => x.slug === params.course);
  const l = c?.lessons.find((x) => x.slug === params.lesson);
  if (!c || !l) return notFound();

  return (
    <main className="py-14 md:py-20">
      <Container>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{l.title}</h1>

        <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10">
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
