import { Container } from "../layout/Container";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-16" id="contact">
      <Container>
        <div className="ac-card p-8 md:p-12">
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl text-foreground">
            Savollaringiz bormi?
          </h3>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Platforma bo&apos;yicha takliflar yoki muammolar bo&apos;lsa, biz bilan bog&apos;laning.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="ac-btn bg-foreground text-background hover:opacity-90 dark:bg-foreground dark:text-background"
            >
              Biz bilan bog&apos;lanish
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
