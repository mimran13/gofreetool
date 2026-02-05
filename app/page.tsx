"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { categories, tools, getCategoryBySlug } from "@/lib/tools";

// ============================================================================
// TOOL SEARCH COMPONENT
// ============================================================================

function ToolSearch() {
  const [query, setQuery] = useState("");

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return tools
      .filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.shortDescription.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools... (e.g., JSON formatter, password generator)"
          className="w-full pl-12 pr-12 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-gray-400"
          aria-label="Search tools"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search results */}
      {query.trim() && (
        <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
          {filteredTools.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No tools found for &quot;{query}&quot;
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTools.map((tool) => {
                const category = getCategoryBySlug(tool.category);
                return (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-3xl">{tool.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {tool.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {tool.shortDescription}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-full">
                        {category?.name.replace(/^[^\s]+\s/, "") || tool.category}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// POPULAR TOOL CARD
// ============================================================================

interface PopularToolCardProps {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

function PopularToolCard({ slug, name, description, icon, category }: PopularToolCardProps) {
  const cat = getCategoryBySlug(category);

  return (
    <Link href={`/tools/${slug}`}>
      <article className="group h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-slate-400 dark:hover:border-slate-500 transition-all">
        <div className="flex items-start gap-4">
          <span className="text-4xl group-hover:scale-110 transition-transform">{icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {description}
            </p>
            <span className="inline-block mt-3 text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-full">
              {cat?.name.replace(/^[^\s]+\s/, "") || category}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ============================================================================
// CATEGORY CARD
// ============================================================================

interface CategoryCardProps {
  slug: string;
  name: string;
  icon: string;
  description: string;
  toolCount: number;
}

function CategoryCard({ slug, name, icon, description, toolCount }: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`}>
      <article className="group h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-slate-400 dark:hover:border-slate-500 transition-all text-center">
        <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 group-hover:bg-slate-200 dark:group-hover:bg-slate-700/50 transition-colors">
          <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
          {name.replace(/^[^\s]+\s/, "")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {description}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
          {toolCount} tools
        </p>
      </article>
    </Link>
  );
}

// ============================================================================
// TRUST BADGE
// ============================================================================

interface TrustBadgeProps {
  icon: string;
  title: string;
  description: string;
}

function TrustBadge({ icon, title, description }: TrustBadgeProps) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <span className="text-3xl mb-2">{icon}</span>
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
    </div>
  );
}

// ============================================================================
// MAIN HOMEPAGE COMPONENT
// ============================================================================

// Curated popular tools (hand-picked for visibility)
const POPULAR_TOOLS = [
  "json-formatter-viewer",
  "password-generator",
  "uuid-generator",
  "base64-encoder-decoder",
  "hash-generator",
  "csv-json-converter",
  "bmi-calculator",
  "word-counter",
];

export default function Home() {
  // Get popular tools data
  const popularTools = POPULAR_TOOLS.map((slug) =>
    tools.find((t) => t.slug === slug)
  ).filter(Boolean) as typeof tools;

  // Get category tool counts
  const categoryWithCounts = categories.map((cat) => ({
    ...cat,
    toolCount: tools.filter((t) => t.category === cat.slug).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main>
        {/* ================================================================ */}
        {/* HERO SECTION */}
        {/* ================================================================ */}
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center space-y-6">
              {/* Main heading - SEO optimized H1 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Free Online Tools for{" "}
                <span className="text-teal-600">Developers</span> &{" "}
                <span className="text-teal-600">Everyone</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {tools.length}+ free tools for formatting, encoding, calculating, and converting.
                No signup. No tracking. Runs in your browser.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="#popular"
                  className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Popular Tools
                </Link>
                <Link
                  href="#categories"
                  title="Browse free online tools by category"
                  className="px-8 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-white font-semibold rounded-lg transition-colors"
                >
                  Browse Tool Categories
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SEARCH SECTION */}
        {/* ================================================================ */}
        <section className="py-8 -mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ToolSearch />
          </div>
        </section>

        {/* ================================================================ */}
        {/* POPULAR TOOLS SECTION */}
        {/* ================================================================ */}
        <section id="popular" className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Popular Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Most used tools by our community
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularTools.map((tool) => (
                <PopularToolCard
                  key={tool.slug}
                  slug={tool.slug}
                  name={tool.name}
                  description={tool.shortDescription}
                  icon={tool.icon}
                  category={tool.category}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="#categories"
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
              >
                Browse all {tools.length} free tools by category →
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* CATEGORIES SECTION */}
        {/* ================================================================ */}
        <section id="categories" className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Browse by Category
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Find the right tool for your needs
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryWithCounts.map((category) => (
                <CategoryCard
                  key={category.slug}
                  slug={category.slug}
                  name={category.name}
                  icon={category.icon}
                  description={category.description}
                  toolCount={category.toolCount}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* TRUST / PRIVACY SECTION */}
        {/* ================================================================ */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-8 sm:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Why Choose gofreetool.com?
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <TrustBadge
                  icon="🚀"
                  title="No Signup"
                  description="Use all tools instantly without creating an account"
                />
                <TrustBadge
                  icon="🔒"
                  title="Privacy First"
                  description="Your data never leaves your browser"
                />
                <TrustBadge
                  icon="💯"
                  title="100% Free"
                  description="No hidden fees, no premium plans, no limits"
                />
                <TrustBadge
                  icon="⚡"
                  title="Works Offline"
                  description="Tools work even without internet connection"
                />
              </div>

              <div className="text-center mt-8 pt-8 border-t border-teal-200 dark:border-teal-700">
                <p className="text-gray-600 dark:text-gray-400">
                  All tools are <strong>client-side only</strong>. We don&apos;t store, track, or
                  transmit any of your data. Read our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ALL TOOLS QUICK LIST (SEO + Discoverability) */}
        {/* ================================================================ */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Quick links to all {tools.length} tools
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors truncate"
                  title={tool.name}
                >
                  <span className="mr-1.5">{tool.icon}</span>
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
