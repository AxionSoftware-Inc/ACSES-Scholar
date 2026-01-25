import { Container } from "@/app/components/layout/Container";
import scholarData from "@/app/content/scholar.json";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return scholarData.classes.map((c) => ({
        classId: c.id,
    }));
}

export default async function ClassPage(props: { params: Promise<{ classId: string }> }) {
    const params = await props.params;
    const classData = scholarData.classes.find((c) => c.id === params.classId);

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
                                key={subject.id}
                                href={`/classes/${classData.id}/${subject.id}`}
                                className="ac-card group flex flex-col justify-between p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:bg-muted/10 cursor-pointer"
                            >
                                <div>
                                    <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                                        {subject.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {subject.lessons.length} ta dars mavjud
                                    </p>
                                </div>
                                <div className="mt-6 flex items-center text-sm font-medium text-primary">
                                    Fanni tanlash &rarr;
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </Container>
        </main>
    );
}
