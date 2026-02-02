"use client";

import { useEffect } from "react";

const GA4_ID = "G-XXXXXXXXXX"; // Replace with actual GA4 ID

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function Analytics() {
  useEffect(() => {
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

    // Load GA4 script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", GA4_ID);

    // Make gtag globally accessible
    window.gtag = gtag;
  }, []);

  return null;
}
