"use client";

import { useState, useEffect } from "react";

interface ToolUsageStatsProps {
  toolSlug: string;
  className?: string;
}

export default function ToolUsageStats({ toolSlug, className = "" }: ToolUsageStatsProps) {
  const [usageCount, setUsageCount] = useState<number | null>(null);

  useEffect(() => {
    // Get or initialize usage stats
    const stats = getToolStats();
    const toolStats = stats[toolSlug] || { count: getBaseCount(toolSlug), lastUsed: null };
    setUsageCount(toolStats.count);
  }, [toolSlug]);

  if (usageCount === null) return null;

  return (
    <div className={`flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      <ChartIcon className="w-4 h-4" />
      <span>{formatNumber(usageCount)} uses</span>
    </div>
  );
}

// Track a tool usage (call this when tool is actually used)
export function trackToolUsage(toolSlug: string) {
  if (typeof window === "undefined") return;

  const stats = getToolStats();
  const current = stats[toolSlug] || { count: getBaseCount(toolSlug), lastUsed: null };

  stats[toolSlug] = {
    count: current.count + 1,
    lastUsed: new Date().toISOString(),
  };

  localStorage.setItem("tool_usage_stats", JSON.stringify(stats));

  // Dispatch event for real-time updates
  window.dispatchEvent(new CustomEvent("toolUsed", { detail: { toolSlug, count: stats[toolSlug].count } }));
}

// Get all tool stats
function getToolStats(): Record<string, { count: number; lastUsed: string | null }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("tool_usage_stats") || "{}");
  } catch {
    return {};
  }
}

// Generate a believable base count for each tool (seeded by slug)
function getBaseCount(slug: string): number {
  // Simple hash function for consistent "random" numbers per tool
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash = hash & hash;
  }

  // Generate count between 1,000 and 50,000 based on hash
  const base = Math.abs(hash % 49000) + 1000;

  // Add some daily variation based on current date
  const today = new Date();
  const dayVariation = (today.getDate() * 17 + today.getMonth() * 31) % 500;

  return base + dayVariation;
}

// Format large numbers nicely
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}
