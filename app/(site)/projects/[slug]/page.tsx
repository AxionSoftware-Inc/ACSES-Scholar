import projects from "@/app/content/projects.json";


export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) return null;

  return (
    <main className="py-14 md:py-20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-3xl border border-black/10 p-8 shadow-sm dark:border-white/10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{project.name}</h1>
            <div className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60 dark:border-white/10 dark:text-white/60">
              {project.status}
            </div>
          </div>

          <p className="mt-4 text-lg text-black/70 dark:text-white/70">{project.tagline}</p>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">{project.type}</p>
        </div>
      </div>
    </main>
  );
}
