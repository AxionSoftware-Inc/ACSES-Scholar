import { Container } from "@/app/components/layout/Container";
import { getCatalog } from "@/lib/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LessonPlayer } from "@/app/components/features/LessonPlayer";

import { Suspense } from "react";

export default async function SubjectPage(props: { params: Promise<{ classId: string; subjectId: string }> }) {
    const params = await props.params;
    const classes = await getCatalog();
    const classData = classes.find((c) => c.slug === params.classId || c.id.toString() === params.classId);
    const subjectData = classData?.subjects.find((s) => s.slug === params.subjectId || s.id.toString() === params.subjectId);

    if (!classData || !subjectData) {
        notFound();
    }

    const activeLesson = subjectData.lessons[0];

    return (
        <main className="min-h-screen pt-20 pb-16">
            <Container>
                <div className="flex flex-col gap-6">
                    <Link href={`/classes/${classData.slug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
                        <Suspense fallback={<div className="animate-pulse bg-muted h-[400px] rounded-2xl" />}>
                            <LessonPlayer
                                lessons={subjectData.lessons}
                                classId={classData.slug}
                                subjectId={subjectData.slug}
                                activeLessonId={activeLesson?.id}
                            />
                        </Suspense>
                    </div>
                </div>
            </Container>
        </main>
    );
}