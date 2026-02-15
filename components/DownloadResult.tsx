"use client";

import { useState } from "react";

type Format = "txt" | "json" | "csv";

interface DownloadResultProps {
  data: string | object;
  filename: string;
  formats?: Format[];
  className?: string;
}

export default function DownloadResult({
  data,
  filename,
  formats = ["txt"],
  className = "",
}: DownloadResultProps) {
  const [isOpen, setIsOpen] = useState(false);

  const download = (format: Format) => {
    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case "json":
        content = typeof data === "string" ? JSON.stringify({ result: data }, null, 2) : JSON.stringify(data, null, 2);
        mimeType = "application/json";
        extension = "json";
        break;
      case "csv":
        if (typeof data === "object" && !Array.isArray(data)) {
          const entries = Object.entries(data);
          content = entries.map(([key, value]) => `"${key}","${value}"`).join("\n");
        } else if (Array.isArray(data)) {
          content = data.join("\n");
        } else {
          content = data;
        }
        mimeType = "text/csv";
        extension = "csv";
        break;
      default:
        content = typeof data === "string" ? data : JSON.stringify(data, null, 2);
        mimeType = "text/plain";
        extension = "txt";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsOpen(false);
  };

  if (formats.length === 1) {
    return (
      <button
        onClick={() => download(formats[0])}
        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                    bg-gray-100 text-gray-600 hover:bg-gray-200
                    dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                    transition-colors ${className}`}
        title="Download result"
      >
        <DownloadIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Download</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                    bg-gray-100 text-gray-600 hover:bg-gray-200
                    dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                    transition-colors ${className}`}
        title="Download result"
      >
        <DownloadIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Download</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 py-1 w-32 bg-white dark:bg-gray-800 rounded-lg
                          shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => download(format)}
                className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300
                           hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Download as .{format.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

// Export for easy use
export function downloadAsFile(content: string, filename: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
