"use client";

interface PrintButtonProps {
  className?: string;
}

export default function PrintButton({ className = "" }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                  bg-gray-100 text-gray-600 hover:bg-gray-200
                  dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
                  transition-colors print:hidden ${className}`}
      title="Print this page"
    >
      <PrintIcon className="w-4 h-4" />
      <span className="hidden sm:inline">Print</span>
    </button>
  );
}

function PrintIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
      />
    </svg>
  );
}
