"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PlayCircle } from "lucide-react";

type Lesson = {
    id: string;
    title: string;
    youtubeId: string;
};

interface LessonPlayerProps {
    lessons: Lesson[];
}

export function LessonPlayer({ lessons }: LessonPlayerProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const lessonId = searchParams.get("lesson");

    const activeLesson = (lessonId ? lessons.find(l => l.id === lessonId) : null) ||
        (lessons.length > 0 ? lessons[0] : null);

    const handleLessonSelect = (lesson: Lesson) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("lesson", lesson.id);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (lessons.length === 0) {
        return (
            <div className="text-muted-foreground py-10">
                Hozircha darslar yuklanmagan.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Player Section */}
            {activeLesson && (
                <div className="w-full overflow-hidden rounded-2xl border border-border/10 bg-black shadow-2xl">
                    <div className="aspect-video w-full">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${activeLesson.youtubeId}?autoplay=0&rel=0`}
                            title={activeLesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="border-0"
                        />
                    </div>
                    <div className="p-6 bg-card">
                        <h2 className="text-xl font-bold md:text-2xl">{activeLesson.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Video dars</p>
                    </div>
                </div>
            )}

            {/* Playlist Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold px-1">Darslar ro&apos;yxati</h3>
                <div className="grid gap-3">
                    {lessons.map((lesson, index) => {
                        const isActive = activeLesson?.id === lesson.id;
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => handleLessonSelect(lesson)}
                                className={`
                  flex items-center gap-4 rounded-xl border p-4 text-left transition-all
                  ${isActive
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border/40 bg-card hover:bg-muted/50 hover:border-border"
                                    }
                `}
                            >
                                <div
                                    className={`
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors
                    ${isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }
                  `}
                                >
                                    {isActive ? <PlayCircle size={14} /> : index + 1}
                                </div>

                                <div className="flex-1">
                                    <div className={`font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                                        {lesson.title}
                                    </div>
                                </div>

                                {isActive && (
                                    <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
                                        O&apos;ynalmoqda
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
