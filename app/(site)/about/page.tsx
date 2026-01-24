import { Container } from "../../components/layout/Container";

export default function AboutPage() {
    return (
        <main className="py-14 md:py-20">
            <Container>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">About Us</h1>
                <p className="mt-2 text-sm text-black/70 dark:text-white/70">
                    We are ACSES, building the future of software ecosystems.
                </p>

                <div className="mt-8 prose dark:prose-invert">
                    <p>
                        Empty page. Content coming soon.
                    </p>
                </div>
            </Container>
        </main>
    );
}
