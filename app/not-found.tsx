import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>404 — Topilmadi</h1>
      <p>Bu sahifa mavjud emas.</p>
      <Link href="/">Home</Link>
    </main>
  );
}
