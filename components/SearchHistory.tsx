"use client";

import { useState, useEffect } from "react";

const MAX_HISTORY = 5;

export function addSearchHistory(query: string) {
  if (typeof window === "undefined" || !query.trim()) return;

  const history = getSearchHistory();
  const filtered = history.filter((q) => q.toLowerCase() !== query.toLowerCase());
  const updated = [query, ...filtered].slice(0, MAX_HISTORY);

  localStorage.setItem("search_history", JSON.stringify(updated));
}

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("search_history") || "[]");
  } catch {
    return [];
  }
}

export function clearSearchHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("search_history");
}

interface SearchHistoryProps {
  onSelect: (query: string) => void;
  className?: string;
}

export default function SearchHistory({ onSelect, className = "" }: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  const handleClear = () => {
    clearSearchHistory();
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
          Recent Searches
        </span>
        <button
          onClick={handleClear}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((query, i) => (
          <button
            key={i}
            onClick={() => onSelect(query)}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                       rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}
