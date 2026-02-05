import Link from "next/link";
import { categories, tools } from "@/lib/tools";

// Top tools curated across categories for the footer
const FOOTER_POPULAR_TOOLS = [
  "emi-calculator",
  "bmi-calculator",
  "json-formatter-viewer",
  "word-counter",
  "age-calculator",
  "password-generator",
  "base64-encoder-decoder",
  "color-picker",
  "csv-json-converter",
  "image-resizer",
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const popularTools = FOOTER_POPULAR_TOOLS
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as typeof tools;

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <span className="text-xl font-extrabold tracking-tight text-teal-500">
                gofreetool
              </span>
              <span className="text-xs font-medium text-gray-600">.com</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Free online tools and calculators for everyone. No signup, no ads,
              100% client-side. Your data never leaves your browser.
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Popular Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-slate-300 transition-colors"
                  >
                    {category.name.replace(/^[^\s]+\s/, "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} gofreetool.com. All rights reserved.
          </p>
          <p className="text-sm text-gray-600">
            {tools.length}+ free tools &middot; No signup &middot; 100% private
          </p>
        </div>
      </div>
    </footer>
  );
}
