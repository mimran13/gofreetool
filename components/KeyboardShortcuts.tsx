"use client";

import { useEffect, useState, useCallback } from "react";

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

interface KeyboardShortcutsProps {
  shortcuts?: Shortcut[];
}

// Default shortcuts available on all tool pages
const DEFAULT_SHORTCUTS: Omit<Shortcut, "action">[] = [
  { key: "?", shift: true, description: "Show keyboard shortcuts" },
  { key: "h", description: "Go to homepage" },
  { key: "s", description: "Focus search" },
  { key: "p", description: "Print page" },
  { key: "Escape", description: "Close modal / Clear focus" },
];

export default function KeyboardShortcuts({ shortcuts = [] }: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      // Only allow Escape in inputs
      if (e.key !== "Escape") return;
    }

    // Show help modal with ?
    if (e.key === "?" && e.shiftKey) {
      e.preventDefault();
      setShowHelp(true);
      return;
    }

    // Close modal with Escape
    if (e.key === "Escape") {
      setShowHelp(false);
      (document.activeElement as HTMLElement)?.blur();
      return;
    }

    // Homepage with h
    if (e.key === "h" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      window.location.href = "/";
      return;
    }

    // Focus search with s
    if (e.key === "s" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const searchInput = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder*="Search"]');
      searchInput?.focus();
      return;
    }

    // Print with p
    if (e.key === "p" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      window.print();
      return;
    }

    // Custom shortcuts
    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : (!e.ctrlKey && !e.metaKey);
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
      const altMatch = shortcut.alt ? e.altKey : !e.altKey;

      if (e.key.toLowerCase() === shortcut.key.toLowerCase() && ctrlMatch && shiftMatch && altMatch) {
        e.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const allShortcuts = [
    ...DEFAULT_SHORTCUTS,
    ...shortcuts.map(({ key, ctrl, shift, alt, description }) => ({
      key,
      ctrl,
      shift,
      alt,
      description,
    })),
  ];

  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowHelp(false)}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setShowHelp(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {allShortcuts.map((shortcut, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {shortcut.description}
              </span>
              <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700
                             text-gray-700 dark:text-gray-300 rounded border
                             border-gray-200 dark:border-gray-600">
                {formatShortcut(shortcut)}
              </kbd>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}

function formatShortcut(shortcut: { key: string; ctrl?: boolean; shift?: boolean; alt?: boolean }): string {
  const parts: string[] = [];
  if (shortcut.ctrl) parts.push("Ctrl");
  if (shortcut.alt) parts.push("Alt");
  if (shortcut.shift) parts.push("Shift");
  parts.push(shortcut.key === " " ? "Space" : shortcut.key.toUpperCase());
  return parts.join(" + ");
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
