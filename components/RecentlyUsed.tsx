"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToolBySlug, Tool } from "@/lib/tools";

const MAX_RECENT = 8;

export function trackRecentTool(toolSlug: string) {
  if (typeof window === "undefined") return;

  const recent = getRecentTools();
  const filtered = recent.filter((slug) => slug !== toolSlug);
  const updated = [toolSlug, ...filtered].slice(0, MAX_RECENT);

  localStorage.setItem("recent_tools", JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("recentToolsChanged"));
}

export function getRecentTools(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("recent_tools") || "[]");
  } catch {
    return [];
  }
}

interface RecentlyUsedProps {
  className?: string;
  limit?: number;
}

export default function RecentlyUsed({ className = "", limit = 6 }: RecentlyUsedProps) {
  const [recentTools, setRecentTools] = useState<Tool[]>([]);

  useEffect(() => {
    const loadRecent = () => {
      const slugs = getRecentTools().slice(0, limit);
      const tools = slugs
        .map((slug) => getToolBySlug(slug))
        .filter(Boolean) as Tool[];
      setRecentTools(tools);
    };

    loadRecent();

    window.addEventListener("recentToolsChanged", loadRecent);
    return () => window.removeEventListener("recentToolsChanged", loadRecent);
  }, [limit]);

  if (recentTools.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-gray-400" />
          Recently Used
        </h3>
        <button
          onClick={() => {
            localStorage.removeItem("recent_tools");
            setRecentTools([]);
          }}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm
                       bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                       rounded-full hover:bg-gray-200 dark:hover:bg-gray-700
                       transition-colors"
          >
            <span>{tool.icon}</span>
            <span>{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
