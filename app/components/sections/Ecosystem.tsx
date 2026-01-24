import { Container } from "../layout/Container";
import Link from "next/link";
import projects from "@/app/content/projects.json";


export function Ecosystem() {
    return (
        <section className="py-14 md:py-20">
            <Container>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Ecosystem</h2>
                <p className="mt-2 max-w-2xl text-sm text-black/70 dark:text-white/70">
                    Each project starts inside ACSES. When it grows, it becomes a standalone product.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {projects.map((p) => (
                        <Link
                            key={p.slug}
                            href={`/projects/${p.slug}`}
                            className="group rounded-3xl border border-black/10 p-6 shadow-sm transition hover:border-black/25 dark:border-white/10 dark:hover:border-white/25"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-lg font-semibold">{p.name}</div>
                                <div className="rounded-full border border-black/10 px-2 py-1 text-xs text-black/60 dark:border-white/10 dark:text-white/60">
                                    {p.status}
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-black/70 dark:text-white/70">{p.tagline}</div>
                            <div className="mt-4 text-xs text-black/50 dark:text-white/50">{p.type}</div>
                            <div className="mt-5 text-sm text-black/70 group-hover:text-black dark:text-white/70 dark:group-hover:text-white">
                                Open →
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
