"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pathWithQuery = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    void trackEvent({
      event_type: "page_view",
      path: pathWithQuery,
      label: pathname,
      metadata: { source: "nextjs" },
    });
  }, [pathname, searchParams]);

  return null;
}