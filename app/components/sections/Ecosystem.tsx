import { Container } from "../layout/Container";
import Link from "next/link";
import ecosystem from "@/app/content/ecosystem.json";


export function Ecosystem() {
    return (
        <section className="py-14 md:py-20">
            <Container>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Ecosystem</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Each project starts inside ACSES. When it grows, it becomes a standalone product.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {ecosystem.map((p) => (
                        <Link
                            key={p.slug}
                            href={`/ecosystem/${p.slug}`}
                            className="ac-card ac-card-hover group p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-lg font-semibold">{p.name}</div>
                                <div className="rounded-full border border-border/10 px-2 py-1 text-xs text-muted-foreground">
                                    {p.status}
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">{p.tagline}</div>
                            <div className="mt-4 text-xs text-muted-foreground/60">{p.category}</div>
                            <div className="mt-5 text-sm text-muted-foreground group-hover:text-foreground">
                                Open →
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
