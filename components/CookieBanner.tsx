"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ essential: true, analytics: true, marketing: true })
    );
    setShowBanner(false);
    // Reload to trigger GA4 script loading
    window.location.reload();
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ essential: true, analytics: false, marketing: false })
    );
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const essentialCheckbox = document.getElementById("essential") as HTMLInputElement;
    const analyticsCheckbox = document.getElementById("analytics") as HTMLInputElement;
    const marketingCheckbox = document.getElementById("marketing") as HTMLInputElement;

    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        essential: essentialCheckbox?.checked ?? true,
        analytics: analyticsCheckbox?.checked ?? false,
        marketing: marketingCheckbox?.checked ?? false,
      })
    );
    setShowBanner(false);
    // Reload to trigger GA4 script loading if analytics enabled
    if (analyticsCheckbox?.checked) {
      window.location.reload();
    }
  };

  if (!isClient || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 animate-slideUp">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!showDetails ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                🍪 Cookie Consent
              </h3>
              <p className="text-sm text-gray-600">
                We use essential cookies to make this site work. We'd also like to set analytics cookies to understand how you use our site and improve it. Read our{" "}
                <a href="/cookie-policy" className="text-teal-600 hover:underline">
                  cookie policy
                </a>
                .
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0 flex-col sm:flex-row">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Customize
              </button>
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
        ) : (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Cookie Settings
            </h3>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3">
                <input
                  id="essential"
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="rounded"
                />
                <span>
                  <strong>Essential Cookies</strong>
                  <p className="text-xs text-gray-600">Required for site functionality</p>
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  id="analytics"
                  type="checkbox"
                  defaultChecked={false}
                  className="rounded"
                />
                <span>
                  <strong>Analytics Cookies</strong>
                  <p className="text-xs text-gray-600">Help us improve using Google Analytics</p>
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  id="marketing"
                  type="checkbox"
                  defaultChecked={false}
                  className="rounded"
                />
                <span>
                  <strong>Marketing Cookies</strong>
                  <p className="text-xs text-gray-600">For personalized ads (optional)</p>
                </span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors text-sm font-medium"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
