import { Container } from "@/app/components/layout/Container";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="py-14 md:py-20">
            <Container>
                {/* Intro */}
                <div className="max-w-3xl">
                    <div className="flex items-center gap-2">
                        <span className="ac-chip">About ACSES</span>
                    </div>
                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                        Building the future of digital ecosystems.
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
                        ACSES is an innovation lab and product studio. We build interconnected platforms, tools, and educational resources designed to empower the next generation of builders.
                    </p>
                </div>

                {/* Bento Grid / Stats */}
                <div className="mt-16 grid gap-4 md:grid-cols-3">
                    <div className="ac-card p-8 md:col-span-2">
                        <h3 className="text-xl font-semibold text-foreground">Our Mission</h3>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            To create a unified ecosystem where learning, building, and deploying software feels seamless. We believe in open standards, high-quality design, and the power of community-driven development.
                        </p>
                    </div>
                    <div className="ac-card flex flex-col justify-center p-8">
                        <div className="text-4xl font-bold text-foreground">4+</div>
                        <div className="mt-2 text-sm text-muted-foreground">Active Initiatives</div>
                    </div>
                    <div className="ac-card flex flex-col justify-center p-8">
                        <div className="text-4xl font-bold text-foreground">100%</div>
                        <div className="mt-2 text-sm text-muted-foreground">Bootstrapped</div>
                    </div>
                    <div className="ac-card p-8 md:col-span-2">
                        <h3 className="text-xl font-semibold text-foreground">The Vision</h3>
                        <p className="mt-4 leading-relaxed text-muted-foreground">
                            From standalone tools to a complete suite of services, ACSES aims to be the backbone for modern digital products in our region and beyond. We start small, iterate fast, and scale with our users.
                        </p>
                    </div>
                </div>

                {/* Team / Culture (Placeholder) */}
                <div className="mt-16">
                    <div className="flex items-end justify-between">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Who we are
                        </h2>
                        <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Join us →
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="ac-card group p-6 hover:bg-muted/20 transition">
                                <div className="h-12 w-12 rounded-full bg-muted group-hover:bg-foreground group-hover:text-background transition-colors flex items-center justify-center font-bold">
                                    {i}
                                </div>
                                <div className="mt-6 font-semibold text-foreground">Team Member {i}</div>
                                <div className="mt-1 text-sm text-muted-foreground">Lead Developer</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-20 rounded-3xl bg-foreground p-8 text-center text-background md:p-16">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Ready to build with us?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-foreground/80">
                        Whether you need a product built or want to join our ecosystem, we&apos;d love to hear from you.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link
                            href="/contact"
                            className="rounded-full bg-background px-8 py-3 text-sm font-bold text-foreground hover:opacity-90 active:scale-95 transition"
                        >
                            Get in touch
                        </Link>
                    </div>
                </div>
            </Container>
        </main>
    );
}
