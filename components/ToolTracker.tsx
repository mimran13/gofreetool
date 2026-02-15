"use client";

import { useEffect } from "react";
import { trackRecentTool } from "./RecentlyUsed";

interface ToolTrackerProps {
  toolSlug: string;
}

export default function ToolTracker({ toolSlug }: ToolTrackerProps) {
  useEffect(() => {
    trackRecentTool(toolSlug);
  }, [toolSlug]);

  return null;
}
