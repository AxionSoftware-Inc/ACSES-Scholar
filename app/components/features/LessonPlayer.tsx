"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PlayCircle } from "lucide-react";

type Lesson = {
    "id": string;
    "title": string;
    "youtubeId": string;
    "description"?: string;
    "duration"?: string;
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player Section */}
            <div className="lg:col-span-2 flex flex-col gap-6">
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
                        <div className="p-8 bg-card">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="ac-badge bg-primary/10 text-primary border-primary/20">Video Dars</span>
                                {activeLesson.duration && (
                                    <span className="text-xs text-muted-foreground font-medium">{activeLesson.duration}</span>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold md:text-3xl tracking-tight">{activeLesson.title}</h2>
                            {activeLesson.description && (
                                <p className="mt-4 text-muted-foreground leading-relaxed">
                                    {activeLesson.description}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Playlist Section */}
            <div className="flex flex-col gap-4 lg:h-[calc(100vh-200px)]">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-xl font-bold">Darslar ro&apos;yxati</h3>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {lessons.length} ta mavzu
                    </span>
                </div>

                <div className="grid gap-3 overflow-y-auto pr-2 custom-scrollbar">
                    {lessons.map((lesson, index) => {
                        const isActive = activeLesson?.id === lesson.id;
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => handleLessonSelect(lesson)}
                                className={`
                                    group flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all duration-300
                                    ${isActive
                                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                                        : "border-border/40 bg-card hover:bg-muted/50 hover:border-primary/50"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`
                                            flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all duration-300
                                            ${isActive
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                                                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                            }
                                        `}
                                    >
                                        {isActive ? <PlayCircle size={18} /> : index + 1}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className={`font-semibold truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                                            {lesson.title}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                                {lesson.duration || "15:00"}
                                            </span>
                                        </div>
                                    </div>

                                    {isActive && (
                                        <div className="flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
