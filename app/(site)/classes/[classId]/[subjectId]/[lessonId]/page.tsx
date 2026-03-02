import { Container } from "@/app/components/layout/Container";
import { getCatalog } from "@/lib/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LessonPlayer } from "@/app/components/features/LessonPlayer";

export default async function LessonPage(props: { params: Promise<{ classId: string; subjectId: string; lessonId: string }> }) {
    const params = await props.params;
    const classes = await getCatalog();
    const classData = classes.find((c) => c.id === params.classId);
    const subjectData = classData?.subjects.find((s) => s.id === params.subjectId);
    const lessonData = subjectData?.lessons.find((l) => l.id === params.lessonId);

    if (!classData || !subjectData || !lessonData) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-20 pb-16">
            <Container>
                <div className="flex flex-col gap-6">
                    <Link href={`/classes/${classData.id}/${subjectData.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={16} />
                        Mavzular ro&apos;yxatiga qaytish
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/10 pb-6">
                        <div>
                            <div className="text-sm font-medium text-primary mb-1">
                                {classData.title} - {subjectData.title}
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight">{lessonData.title}</h1>
                        </div>
                    </div>

                    <div className="mt-6">
                        <LessonPlayer
                            lessons={subjectData.lessons}
                            classId={classData.id}
                            subjectId={subjectData.id}
                            activeLessonId={lessonData.id}
                        />
                    </div>
                </div>
            </Container>
        </main>
    );
}