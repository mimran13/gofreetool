"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem("cookie-consent", "essential");
    setShowBanner(false);
  };

  if (!isClient || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              🍪 Cookie Consent
            </h3>
            <p className="text-sm text-gray-600">
              We use essential cookies to make this site work. We'd also like to
              set analytics cookies to understand how you use our site, but we
              won't until you accept. Read our{" "}
              <a
                href="/cookie-policy"
                className="text-teal-600 hover:underline"
              >
                cookie policy
              </a>
              .
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleRejectNonEssential}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
