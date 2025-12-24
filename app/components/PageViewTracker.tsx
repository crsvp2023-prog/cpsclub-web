"use client";

import { usePageViewTracking } from "@/app/lib/usePageViewTracking";

export function PageViewTracker() {
  usePageViewTracking();
  return null;
}
