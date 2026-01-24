import { Container } from "../layout/Container";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-16">
      <Container>
        <div className="rounded-3xl border border-black/10 p-8 shadow-sm dark:border-white/10 md:p-12">
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Tell us what you want to build.
          </h3>
          <p className="mt-3 max-w-2xl text-sm text-black/70 dark:text-white/70">
            We can start with a compact MVP and evolve it into a full product line inside the ACSES ecosystem.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-black px-6 py-3 text-sm text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Contact / Brief
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
