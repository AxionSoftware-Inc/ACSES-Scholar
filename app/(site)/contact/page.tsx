import { Container } from "@/app/components/layout/Container";
import Link from "next/link";
import { Mail, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="py-14 md:py-20">
      <Container>
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
            Get in Touch
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Let&apos;s build something great.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Whether you have a project in mind, want to partner with us, or just want to say hi — we&apos;re always open to new connections.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Telegram */}
          <Link
            href="https://t.me/YOUR_TELEGRAM"
            target="_blank"
            rel="noreferrer"
            className="ac-card group flex flex-col items-center p-10 text-center hover:bg-muted/30 transition-all active:scale-[99%]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <Send size={24} />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">Telegram</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fastest way to reach us. We usually reply within minutes.
            </p>
            <div className="mt-6 font-medium text-foreground group-hover:underline">@YOUR_TELEGRAM</div>
          </Link>

          {/* Email */}
          <Link
            href="mailto:you@example.com"
            className="ac-card group flex flex-col items-center p-10 text-center hover:bg-muted/30 transition-all active:scale-[99%]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
              <Mail size={24} />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">Email</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              For detailed inquiries, RFPs, or partnership proposals.
            </p>
            <div className="mt-6 font-medium text-foreground group-hover:underline">you@example.com</div>
          </Link>
        </div>

        {/* Office / Other Info (Optional) */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Based in Tashkent, Uzbekistan. Operating globally.
          </p>
        </div>
      </Container>
    </main>
  );
}
