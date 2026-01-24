import { Container } from "../../components/layout/Container";

export default function ContactPage() {
  return (
    <main className="py-14 md:py-20">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Contact</h1>
        <p className="mt-2 text-sm text-black/70 dark:text-white/70">
          Brief yuboring — biz tezda javob beramiz.
        </p>

        <div className="mt-8 rounded-3xl border border-black/10 p-6 dark:border-white/10">
          <div className="text-sm text-black/60 dark:text-white/60">Telegram</div>
          <div className="mt-2 font-medium">@YOUR_TELEGRAM</div>

          <div className="mt-6 text-sm text-black/60 dark:text-white/60">Email</div>
          <div className="mt-2 font-medium">you@example.com</div>
        </div>
      </Container>
    </main>
  );
}
