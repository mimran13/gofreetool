"use client";

import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categories, tools } from "@/lib/tools";
import DarkModeToggle from "./DarkModeToggle";

// ============================================================================
// SEARCH COMPONENT
// ============================================================================

interface SearchResult {
  type: "tool" | "category";
  name: string;
  slug: string;
  description: string;
  icon: string;
}

function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Filter results based on query
  const results: SearchResult[] = query.trim()
    ? [
        // Search tools
        ...tools
          .filter(
            (tool) =>
              tool.name.toLowerCase().includes(query.toLowerCase()) ||
              tool.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
              tool.category.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 6)
          .map((tool) => ({
            type: "tool" as const,
            name: tool.name,
            slug: `/tools/${tool.slug}`,
            description: tool.shortDescription,
            icon: tool.icon,
          })),
        // Search categories
        ...categories
          .filter(
            (cat) =>
              cat.name.toLowerCase().includes(query.toLowerCase()) ||
              cat.description.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 3)
          .map((cat) => ({
            type: "category" as const,
            name: cat.name.replace(/^[^\s]+\s/, ""), // Remove emoji prefix
            slug: `/category/${cat.slug}`,
            description: cat.description,
            icon: cat.icon,
          })),
      ]
    : [];

  const handleSelect = useCallback(
    (slug: string) => {
      router.push(slug);
      onClose();
      setQuery("");
    },
    [router, onClose]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
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
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools… (JSON, Password, EMI)"
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              aria-label="Search tools"
            />
            <kbd className="hidden sm:inline-block px-2 py-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {query.trim() === "" ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                Type to search {tools.length}+ tools
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                No results found for &quot;{query}&quot;
              </div>
            ) : (
              <ul className="py-2">
                {results.map((result) => (
                  <li key={result.slug}>
                    <button
                      onClick={() => handleSelect(result.slug)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <span className="text-2xl">{result.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {result.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {result.description}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          result.type === "tool"
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        }`}
                      >
                        {result.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// CATEGORIES MEGA DROPDOWN
// ============================================================================

// Organize categories into two columns for mega menu
const MEGA_MENU_COLUMNS = {
  left: ["calculators", "developer", "design", "security-encoding", "data-conversion"],
  right: ["health", "home", "writing", "date-time", "fun"],
};

function CategoriesMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get categories for each column
  const leftCategories = MEGA_MENU_COLUMNS.left
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean) as typeof categories;
  const rightCategories = MEGA_MENU_COLUMNS.right
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean) as typeof categories;

  // Handle mouse enter with slight delay for better UX
  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  }, []);

  // Handle mouse leave with delay to prevent accidental close
  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-200 font-semibold text-sm ${
          isOpen
            ? "text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20"
            : "text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Grid icon */}
        <svg
          className="w-4.5 h-4.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        Categories
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mega dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-[520px] bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 p-5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
            {/* Left column */}
            <div className="space-y-0.5">
              {leftCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800/60 text-base flex-shrink-0 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-[13px] leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {category.name.replace(/^[^\s]+\s/, "")}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Right column */}
            <div className="space-y-0.5">
              {rightCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800/60 text-base flex-shrink-0 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-[13px] leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {category.name.replace(/^[^\s]+\s/, "")}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer link */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
            <Link
              href="/#categories"
              onClick={() => setIsOpen(false)}
              title="Browse all free online tools by category"
              className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium py-1"
            >
              Browse all {tools.length} free tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MOBILE MENU
// ============================================================================

function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>("categories");

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Menu panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold text-teal-600">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Home link */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-medium mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>

          {/* Categories Accordion */}
          <div className="mb-4">
            <button
              onClick={() => setExpandedSection(expandedSection === "categories" ? null : "categories")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Categories
              </div>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${expandedSection === "categories" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Categories list (accordion content) */}
            {expandedSection === "categories" && (
              <div className="mt-2 ml-2 space-y-1 border-l-2 border-gray-100 dark:border-gray-700 pl-4">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm">{category.name.replace(/^[^\s]+\s/, "")}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-700 my-4" />

          {/* Secondary links */}
          <Link
            href="/about"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
          >
            About
          </Link>
        </nav>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN HEADER COMPONENT
// ============================================================================

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Keyboard shortcut for search (Cmd/Ctrl + K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Forward slash (when not in input)
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll detection for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all duration-300 ${
          isScrolled
            ? "shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)] border-b border-gray-200/60 dark:border-gray-700/50"
            : "border-b border-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-baseline gap-1 flex-shrink-0 group">
              <span className="font-extrabold text-[22px] sm:text-[24px] tracking-tight text-teal-600 group-hover:text-teal-700 dark:group-hover:text-teal-500 transition-colors">
                gofreetool
              </span>
              <span className="text-[11px] font-medium text-gray-300 dark:text-gray-600 hidden sm:inline">.com</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {/* Home */}
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                Home
              </Link>

              {/* Categories - Primary Navigation */}
              <CategoriesMegaMenu />

              {/* Favorites */}
              <Link
                href="/favorites"
                className="px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Favorites
              </Link>

              {/* About - De-emphasized */}
              <Link
                href="/about"
                className="px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                About
              </Link>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2.5">
              {/* Dark mode toggle */}
              <div className="hidden sm:block">
                <DarkModeToggle />
              </div>

              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-gray-400 dark:text-gray-500 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 focus:ring-2 focus:ring-teal-500/40 focus:outline-none rounded-full transition-all duration-200 w-48 lg:w-60 border border-gray-200/50 dark:border-gray-700/50"
                aria-label="Search tools"
              >
                <svg className="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-[13px] text-gray-400 dark:text-gray-500 truncate flex-1 text-left">
                  Search tools…
                </span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-700/80 rounded border border-gray-200/80 dark:border-gray-600/60 font-mono">
                  <span>⌘</span>K
                </kbd>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
