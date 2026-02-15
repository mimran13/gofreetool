"use client";

import { useState } from "react";

interface EmbedCodeProps {
  toolSlug: string;
  toolName: string;
}

export default function EmbedCode({ toolSlug, toolName }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const embedUrl = `https://gofreetool.com/tools/${toolSlug}?embed=true`;
  const embedCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="500"
  frameborder="0"
  title="${toolName}"
  style="border-radius: 8px; border: 1px solid #e5e7eb;"
></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = embedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                   bg-gray-100 text-gray-600 hover:bg-gray-200
                   dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                   transition-colors"
        title="Get embed code"
      >
        <CodeIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Embed</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl
                          shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                Embed this tool
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Add this tool to your website. Copy the code below:
            </p>

            <div className="relative">
              <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-xs
                              text-gray-700 dark:text-gray-300 overflow-x-auto
                              border border-gray-200 dark:border-gray-700">
                <code>{embedCode}</code>
              </pre>

              <button
                onClick={handleCopy}
                className={`absolute top-2 right-2 px-2 py-1 text-xs rounded
                            transition-colors ${
                              copied
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                            }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Free to use. Link back appreciated.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
