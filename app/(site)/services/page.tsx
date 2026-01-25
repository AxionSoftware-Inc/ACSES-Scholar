import { Container } from "../../components/layout/Container";
import { Services } from "../../components/sections/Services";

export default function ServicesPage() {
    return (
        <main className="py-14 md:py-20">
            <Container>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Services</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    We offer high-quality software development services.
                </p>

                <div className="mt-12">
                    <Services />
                </div>
            </Container>
        </main>
    );
}
