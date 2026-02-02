// Analytics utility for GA4 tracking
// Only tracks if user has accepted analytics cookies

export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window === "undefined") return;

  // Check if user has accepted analytics cookies
  const cookieConsent = localStorage.getItem("cookie-consent");
  if (!cookieConsent) return;

  let consent: any;
  try {
    consent = JSON.parse(cookieConsent);
  } catch {
    // Handle legacy string format
    consent = {
      analytics: cookieConsent === "all" || cookieConsent === "analytics",
      essential: true,
    };
  }

  if (!consent.analytics) return;

  // Access gtag from window object (injected by GA4 script)
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as any).gtag("event", eventName, eventData);
  }
};

export const trackToolUsage = (toolSlug: string) => {
  trackEvent("tool_usage", {
    tool_slug: toolSlug,
    timestamp: new Date().toISOString(),
  });
};

export const trackToolCalculate = (toolSlug: string) => {
  trackEvent("tool_calculate", {
    tool_slug: toolSlug,
  });
};

export const trackCopyClick = (toolSlug: string) => {
  trackEvent("copy_click", {
    tool_slug: toolSlug,
  });
};

export const trackCategoryView = (categorySlug: string) => {
  trackEvent("category_view", {
    category_slug: categorySlug,
  });
};
