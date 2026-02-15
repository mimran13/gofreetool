"use client";

import { useState, useEffect } from "react";

interface FullscreenButtonProps {
  className?: string;
}

export default function FullscreenButton({ className = "" }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // Don't render if fullscreen not supported
  if (typeof document !== "undefined" && !document.fullscreenEnabled) {
    return null;
  }

  return (
    <button
      onClick={toggleFullscreen}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                  bg-gray-100 text-gray-600 hover:bg-gray-200
                  dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                  transition-colors ${className}`}
      title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
    >
      {isFullscreen ? (
        <ExitFullscreenIcon className="w-4 h-4" />
      ) : (
        <FullscreenIcon className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
    </button>
  );
}

function FullscreenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  );
}

function ExitFullscreenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 9V4H4m0 0l5 5M9 15v5H4m0 0l5-5m10-1v5h5m0 0l-5-5m0-4V4h5m0 0l-5 5"
      />
    </svg>
  );
}
