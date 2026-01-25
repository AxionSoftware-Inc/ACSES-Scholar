import { Container } from "../layout/Container";
import services from "@/app/content/services.json";


export function Services() {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Services</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Clear offers. Strong execution. Production-grade delivery.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.slug}
              className="ac-card flex flex-col justify-between p-6"
            >
              <div>
                <div className="text-lg font-semibold">{s.name}</div>
                <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.tagline}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="ac-badge bg-muted/50">{s.category}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
