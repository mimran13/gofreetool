import { Metadata } from "next";
import Link from "next/link";
import { homepageMetadata } from "@/lib/seo";
import { categories, getFeaturedTools } from "@/lib/tools";
import CategoryCard from "@/components/CategoryCard";
import ToolCard from "@/components/ToolCard";

export const metadata: Metadata = homepageMetadata;

export default function Home() {
  const featuredTools = getFeaturedTools();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
              Free Daily-Use Tools
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto">
              Simple calculators and utilities for everyday life
            </p>
            <p className="text-lg text-gray-500">
              🚀 No signup • 🔒 No tracking • 💯 100% Free
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/tools/emi-calculator"
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors"
              >
                Try Our Tools
              </Link>
              <Link
                href="#categories"
                className="px-8 py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-bold rounded-lg transition-colors"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Tools */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Browse by Category
          </h2>
          <div className="space-y-8">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>

        {/* SEO & Info Section */}
        <section className="py-16 bg-white rounded-xl border border-gray-200 px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why Choose gofreetool.com?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">✅ Completely Free</h3>
              <p className="text-gray-600">
                All our tools are completely free. No hidden charges, no premium
                plans, no limits on usage.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🚫 No Signup Required
              </h3>
              <p className="text-gray-600">
                Use our tools instantly without creating an account or providing
                any personal information.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🔒 Your Data is Safe
              </h3>
              <p className="text-gray-600">
                All calculations happen in your browser. We never store, send, or
                track your data.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                📱 Works Everywhere
              </h3>
              <p className="text-gray-600">
                Fully responsive design works on desktop, tablet, and mobile devices.
                Works offline too!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
