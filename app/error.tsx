"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>Xatolik</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Qayta urinib ko‘rish</button>
    </main>
  );
}
