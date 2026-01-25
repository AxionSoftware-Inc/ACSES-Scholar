import { Container } from "../layout/Container";
import { CheckCircle2 } from "lucide-react";

const benefits = [
    {
        title: "Bepul Ta'lim",
        description: "Barcha video darslar va materiallar o'quvchilar uchun mutlaqo bepul.",
    },
    {
        title: "Malakali Ustozlar",
        description: "Darslar tajribali va malakali o'qituvchilar tomonidan tayyorlangan.",
    },
    {
        title: "Istalgan Vaqtda",
        description: "Platformadan kunning istalgan vaqtida foydalanish imkoniyati.",
    },
];

export function Ecosystem() {
    return (
        <section className="py-14 md:py-20 bg-muted/30" id="about">
            <Container>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Nega aynan ACSES Scholar?</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Sifatli va qulay ta&apos;lim olish imkoniyatlari.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {benefits.map((b, i) => (
                        <div
                            key={i}
                            className="ac-card p-6 flex flex-col gap-3"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="text-primary h-6 w-6" />
                                <div className="text-lg font-semibold">{b.title}</div>
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                {b.description}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
