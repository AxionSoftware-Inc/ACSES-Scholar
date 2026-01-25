import { Container } from "@/app/components/layout/Container";
import scholarData from "@/app/content/scholar.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LessonPlayer } from "@/app/components/features/LessonPlayer";

export async function generateStaticParams() {
    const paths = [];
    for (const c of scholarData.classes) {
        for (const s of c.subjects) {
            paths.push({
                classId: c.id,
                subjectId: s.id
            })
        }
    }
    return paths;
}

export default async function SubjectPage(props: { params: Promise<{ classId: string; subjectId: string }> }) {
    const params = await props.params;
    const classData = scholarData.classes.find((c) => c.id === params.classId);
    const subjectData = classData?.subjects.find((s) => s.id === params.subjectId);

    if (!classData || !subjectData) {
        notFound();
    }

    // Assuming the first lesson is the featured one if no specific lesson is selected, 
    // but for now we just list them.
    // Or better: Show a "Featured Lesson" or "Start Learning" button.

    return (
        <main className="min-h-screen pt-20 pb-16">
            <Container>
                <div className="flex flex-col gap-6">
                    <Link href={`/classes/${classData.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={16} />
                        {classData.title}ga qaytish
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/10 pb-6">
                        <div>
                            <div className="text-sm font-medium text-primary mb-1">
                                {classData.title}
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight">{subjectData.title}</h1>
                            <p className="mt-2 text-muted-foreground max-w-2xl">
                                Ushbu fan bo&apos;yicha barcha video darslar va materiallar.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <LessonPlayer lessons={subjectData.lessons} />
                    </div>
                </div>
            </Container>
        </main>
    );
}
