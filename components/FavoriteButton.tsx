"use client";

import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  toolSlug: string;
  toolName: string;
  className?: string;
  showLabel?: boolean;
}

export default function FavoriteButton({
  toolSlug,
  toolName,
  className = "",
  showLabel = true,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const favorites = getFavorites();
    setIsFavorite(favorites.includes(toolSlug));
  }, [toolSlug]);

  const toggleFavorite = () => {
    const favorites = getFavorites();
    let newFavorites: string[];

    if (favorites.includes(toolSlug)) {
      newFavorites = favorites.filter((slug) => slug !== toolSlug);
    } else {
      newFavorites = [...favorites, toolSlug];
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }

    localStorage.setItem("favorite_tools", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);

    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent("favoritesChanged", { detail: newFavorites }));
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all
                  ${isFavorite
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  } ${className}`}
      aria-label={isFavorite ? `Remove ${toolName} from favorites` : `Add ${toolName} to favorites`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <HeartIcon
        filled={isFavorite}
        className={`w-4 h-4 ${isAnimating ? "animate-ping-once" : ""}`}
      />
      {showLabel && (
        <span className="hidden sm:inline">
          {isFavorite ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  if (filled) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

// Helper functions
export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("favorite_tools") || "[]");
  } catch {
    return [];
  }
}

export function isFavorite(toolSlug: string): boolean {
  return getFavorites().includes(toolSlug);
}
