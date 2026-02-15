"use client";

import { useState, useEffect } from "react";

interface QRCodeShareProps {
  toolSlug: string;
  toolName: string;
}

export default function QRCodeShare({ toolSlug, toolName }: QRCodeShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const url = `https://gofreetool.com/tools/${toolSlug}`;

  useEffect(() => {
    if (isOpen && !qrDataUrl) {
      generateQR();
    }
  }, [isOpen]);

  const generateQR = async () => {
    // Using QR Code API (no backend needed - it's a public service)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    setQrDataUrl(qrUrl);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${toolSlug}-qr.png`;
    link.click();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                   bg-gray-100 text-gray-600 hover:bg-gray-200
                   dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                   transition-colors"
        title="QR Code"
      >
        <QRIcon className="w-4 h-4" />
        <span className="hidden sm:inline">QR</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl
                          shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                QR Code
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-2 rounded-lg">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${toolName}`}
                  width={200}
                  height={200}
                  className="rounded"
                />
              ) : (
                <div className="w-[200px] h-[200px] flex items-center justify-center">
                  <div className="animate-spin w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full" />
                </div>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Scan to open this tool
            </p>

            <button
              onClick={handleDownload}
              className="mt-3 w-full px-3 py-2 text-sm font-medium text-white
                         bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
            >
              Download QR
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function QRIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
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
