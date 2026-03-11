import { Container } from "@/app/components/layout/Container";
import { getCatalog } from "@/lib/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ClassPage(props: { params: Promise<{ classId: string }> }) {
    const params = await props.params;
    const classes = await getCatalog();
    const classData = classes.find((c) => c.slug === params.classId || c.id.toString() === params.classId);

    if (!classData) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-20 pb-16">
            <Container>
                <div className="flex flex-col gap-6">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                        &larr; Bosh sahifaga qaytish
                    </Link>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">{classData.title}</h1>
                        <p className="mt-2 text-muted-foreground">
                            Mavjud fanlar ro&apos;yxati. O&apos;rganishni boshlash uchun fanni tanlang.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {classData.subjects.map((subject) => (
                            <Link
                                key={subject.slug}
                                href={`/classes/${classData.slug}/${subject.slug}`}
                                className="ac-card group flex flex-col justify-between p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-card to-muted/20"
                            >
                                <div>
                                    <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-white shadow-lg ${subject.slug.includes("matematika") ? "bg-blue-600" :
                                            subject.slug.includes("fizika") ? "bg-orange-600" : "bg-primary"
                                        }`}>
                                        <span className="text-xl font-bold">{subject.title[0]}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                                        {subject.title}
                                    </h3>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="ac-badge bg-primary/10 text-primary border-primary/20">
                                            {subject.lessons.length} ta dars
                                        </span>
                                        <span className="text-xs text-muted-foreground">Video kurs</span>
                                    </div>
                                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                                        {classData.title} uchun {subject.title.toLowerCase()} fanidan barcha video darslar to&apos;plami.
                                    </p>
                                </div>
                                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                                    Kursni boshlash <span className="text-lg">&rarr;</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </Container>
        </main>
    );
}