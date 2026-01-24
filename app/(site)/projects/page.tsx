import { Container } from "../../components/layout/Container";
import Link from "next/link";
import projects from "@/app/content/projects.json";

export default function ProjectsPage() {
    return (
        <main className="py-14 md:py-20">
            <Container>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Ecosystem</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Projects inside ACSES — from concept to standalone platforms.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {projects.map((p) => (
                        <Link
                            key={p.slug}
                            href={`/projects/${p.slug}`}
                            className="ac-card ac-card-hover p-6"
                        >
                            <div className="text-lg font-semibold">{p.name}</div>
                            <div className="mt-2 text-sm text-muted-foreground">{p.tagline}</div>
                            <div className="mt-4 text-xs text-muted-foreground/60">
                                {p.type} • {p.status}
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </main>
    );
}
