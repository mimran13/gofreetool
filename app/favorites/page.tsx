"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getToolBySlug, Tool } from "@/lib/tools";
import { getFavorites } from "@/components/FavoriteButton";

export default function FavoritesPage() {
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      const slugs = getFavorites();
      const tools = slugs
        .map((slug) => getToolBySlug(slug))
        .filter(Boolean) as Tool[];
      setFavoriteTools(tools);
      setIsLoading(false);
    };

    loadFavorites();

    const handleChange = () => loadFavorites();
    window.addEventListener("favoritesChanged", handleChange);
    return () => window.removeEventListener("favoritesChanged", handleChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Favorite Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tools you&apos;ve saved for quick access. Stored locally in your browser.
          </p>
        </div>

        {favoriteTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full
                            flex items-center justify-center">
              <HeartIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click the heart icon on any tool to save it here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white
                         rounded-lg hover:bg-teal-700 transition-colors"
            >
              Browse Tools
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                           rounded-xl p-5 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700
                           transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg
                                  flex items-center justify-center text-2xl
                                  group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white
                                   group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {tool.shortDescription}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300
                       font-medium transition-colors"
          >
            ← Back to all tools
          </Link>
        </div>
      </main>
    </div>
  );
}

function HeartIcon({ className }: { className?: string }) {
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
