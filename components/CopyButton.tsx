"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
  successLabel?: string;
  variant?: "default" | "icon" | "inline";
}

export default function CopyButton({
  text,
  className = "",
  label = "Copy",
  successLabel = "Copied!",
  variant = "default",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleCopy}
        className={`p-2 rounded-lg transition-colors ${
          copied
            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        } ${className}`}
        title={copied ? successLabel : label}
      >
        {copied ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <CopyIcon className="w-4 h-4" />
        )}
      </button>
    );
  }

  if (variant === "inline") {
    return (
      <button
        onClick={handleCopy}
        className={`text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400
                    dark:hover:text-teal-300 transition-colors ${className}`}
      >
        {copied ? successLabel : label}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
        copied
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      } ${className}`}
    >
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          {successLabel}
        </>
      ) : (
        <>
          <CopyIcon className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
