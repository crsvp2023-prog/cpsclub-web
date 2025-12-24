export interface Analytics {
  userId?: string;
  eventType: "page_view" | "button_click" | "sponsor_click" | "form_submit";
  eventName: string;
  timestamp?: string;
  userAgent?: string;
  page?: string;
}

/**
 * Log an analytics event via API instead of directly to Firestore
 */
export async function logAnalyticsEvent(
  eventType: Analytics["eventType"],
  eventName: string,
  userId?: string
) {
  try {
    // Send to API endpoint instead of writing directly to Firestore
    await fetch("/api/analytics/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId || "anonymous",
        eventType,
        eventName,
        userAgent: typeof window !== "undefined" ? navigator.userAgent : null,
        page: typeof window !== "undefined" ? window.location.pathname : null,
      }),
    }).catch((error) => {
      // Silently fail - analytics shouldn't break the app
      console.debug("Analytics logging failed (this is ok):", error);
    });
  } catch (error) {
    console.debug("Error preparing analytics:", error);
  }
}

/**
 * Get total page views via API
 */
export async function getPageViews(page?: string) {
  try {
    const response = await fetch(`/api/analytics/page-views?page=${page || ""}`);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error getting page views:", error);
    return 0;
  }
}

/**
 * Get total clicks via API
 */
export async function getTotalClicks() {
  try {
    const response = await fetch("/api/analytics/clicks");
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error getting clicks:", error);
    return 0;
  }
}

/**
 * Get sponsor clicks via API
 */
export async function getSponsorClicks() {
  try {
    const response = await fetch("/api/analytics/sponsor-clicks");
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error getting sponsor clicks:", error);
    return 0;
  }
}

/**
 * Get total unique users via API
 */
export async function getUniqueUsers() {
  try {
    const response = await fetch("/api/analytics/unique-users");
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error getting unique users:", error);
    return 0;
  }
}
