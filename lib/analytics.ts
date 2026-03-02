export type AnalyticsEventType = "page_view" | "lesson_open" | "lesson_play" | "search" | "click";

type TrackPayload = {
  event_type: AnalyticsEventType;
  path: string;
  label?: string;
  duration_ms?: number;
  metadata?: Record<string, unknown>;
};

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api/v1";

export async function trackEvent(payload: TrackPayload) {
  if (typeof window === "undefined") return;

  try {
    await fetch(`${API_BASE}/analytics/track/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // analytics errors should not break UX
  }
}