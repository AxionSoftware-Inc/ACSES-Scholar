import { Container } from "../layout/Container";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";

export async function Services() {
  const classes = await getCatalog();

  return (
    <section id="classes-section" className="py-14 md:py-20">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Sinflar</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Maktab o&apos;quvchilari uchun mavjud sinflar va fanlar.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {classes.map((s) => (
            <Link
              href={`/classes/${s.id}`}
              key={s.id}
              className="ac-card flex flex-col justify-between p-6 hover:border-accent hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{s.title}</div>
                  <span className="ac-badge bg-secondary">Video Darslar</span>
                </div>
                <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Fanlar:</span>{" "}
                  {s.subjects.map((sub) => sub.title).join(", ")}
                </div>
              </div>

              <div className="mt-6 flex items-center text-sm font-medium text-primary group-hover:underline">
                Darslarni ko&apos;rish &rarr;
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}