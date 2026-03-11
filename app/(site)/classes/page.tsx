import { Container } from "@/app/components/layout/Container";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";

export default async function ClassesPage() {
    const classes = await getCatalog();

    return (
        <main className="py-14 md:py-20">
            <Container>
                <div className="max-w-3xl">
                    <div className="flex items-center gap-2">
                        <span className="ac-chip">ACSES Media</span>
                    </div>
                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                        Mavjud Sinflar
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground">
                        Matematika va Fizika fanlari bo&apos;yicha video darsliklarimizni sinflar kesimida ko&apos;rishingiz mumkin. Har bir sinf uchun maxsus tayyorlangan dasturlar.
                    </p>
                </div>

                <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {classes.map((cls) => (
                        <Link
                            key={cls.slug}
                            href={`/classes/${cls.slug}`}
                            className="ac-card group flex flex-col justify-between p-8 hover:border-foreground/20 hover:shadow-xl transition-all duration-300"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center font-bold text-xl group-hover:bg-foreground group-hover:text-background transition-colors">
                                        {cls.title.split("-")[0]}
                                    </div>
                                    <span className="ac-badge bg-secondary">Video Kurslar</span>
                                </div>
                                <h3 className="mt-6 text-2xl font-bold text-foreground">{cls.title}</h3>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {cls.subjects.map((sub) => (
                                        <span
                                            key={sub.id}
                                            className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground border border-border/40"
                                        >
                                            {sub.title}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 flex items-center gap-2 text-sm font-semibold text-foreground">
                                Darslarni ko&apos;rish
                                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-24 ac-card p-10 bg-muted/30">
                    <div className="grid gap-10 md:grid-cols-2 items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Nega bizning darslar?</h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                Bizning platformadagi barcha darslar malakali o&apos;qituvchilar tomonidan sodda va tushunarli tilda tushuntirilgan. Har bir video darslik aniq misollar va masalalar bilan boyitilgan.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">1</div>
                                <span className="font-medium">O&apos;zbek tilida sifatli ta&apos;lim</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">2</div>
                                <span className="font-medium">Istalgan vaqtda ko&apos;rish imkoniyati</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">3</div>
                                <span className="font-medium">Doimiy yangilanib boruvchi mavzular</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}