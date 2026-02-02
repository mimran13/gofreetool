"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-teal-600">gofreetool</span>
            <span className="text-xs text-gray-500">.com</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/category/calculators"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Calculators
            </Link>
            <Link
              href="/category/health"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Health
            </Link>
            <Link
              href="/category/writing"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Writing
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-3">
            <Link
              href="/"
              className="block text-gray-700 hover:text-teal-600 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/category/calculators"
              className="block text-gray-700 hover:text-teal-600 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Calculators
            </Link>
            <Link
              href="/category/health"
              className="block text-gray-700 hover:text-teal-600 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Health
            </Link>
            <Link
              href="/category/writing"
              className="block text-gray-700 hover:text-teal-600 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Writing
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-teal-600 py-2"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
