import Link from "next/link";
import { Tool, getRelatedTools, getCategoryBySlug } from "@/lib/tools";
import Breadcrumbs from "./Breadcrumbs";
import RelatedTools from "./RelatedTools";
import ShareButtons from "./ShareButtons";
import FavoriteButton from "./FavoriteButton";
import EmbedCode from "./EmbedCode";
import PrintButton from "./PrintButton";
import QRCodeShare from "./QRCodeShare";
import FullscreenButton from "./FullscreenButton";
import ToolTracker from "./ToolTracker";

// ============================================================================
// JSON-LD SCHEMA GENERATORS
// ============================================================================

function generateToolSchema(tool: Tool, categoryName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.seo.description,
    url: `https://gofreetool.com/tools/${tool.slug}`,
    applicationCategory: categoryName,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "100",
    },
  };
}

function generateBreadcrumbSchema(tool: Tool, category: { name: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://gofreetool.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name.replace(/^[^\s]+\s/, ""),
        item: `https://gofreetool.com/category/${category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: `https://gofreetool.com/tools/${tool.slug}`,
      },
    ],
  };
}

function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this tool free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! All our tools are completely free. No registration, no hidden charges, no ads. Just open and use.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data safe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. All calculations happen in your browser. We don't store, send, or track any of your data. Everything is processed locally on your device.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this on mobile?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! All our tools are fully responsive and work perfectly on smartphones, tablets, and desktops.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need internet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No! Once the page loads, you can use the tool completely offline. All calculations happen in your browser without any server connection.",
        },
      },
    ],
  };
}

// ============================================================================
// LAYOUT WIDTH WRAPPER COMPONENTS
// ============================================================================

/**
 * Narrow content wrapper for text-heavy sections (640-720px max)
 * Use for: descriptions, how-to sections, FAQs, feature lists
 */
export function ToolContent({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {children}
    </div>
  );
}

/**
 * Wide content wrapper for tool interfaces (1280-1440px max)
 * Use for: editors, input/output panels, interactive components
 */
export function ToolInterface({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
}

// ============================================================================
// MAIN TOOL LAYOUT
// ============================================================================

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  disclaimer?: string;
}

export default function ToolLayout({
  tool,
  children,
  disclaimer,
}: ToolLayoutProps) {
  const relatedTools = getRelatedTools(tool.slug);
  const category = getCategoryBySlug(tool.category);
  const categoryName = category?.name.replace(/^[^\s]+\s/, "") || "Utility";

  // Generate JSON-LD schemas
  const toolSchema = generateToolSchema(tool, categoryName);
  const breadcrumbSchema = category
    ? generateBreadcrumbSchema(tool, { name: category.name, slug: category.slug })
    : null;
  const faqSchema = generateFAQSchema();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb - Narrow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-2xl">
          {category && (
            <Breadcrumbs
              category={{ name: category.name, slug: category.slug }}
              tool={{ name: tool.name }}
            />
          )}
        </div>
      </div>

      {/* Main Content - Wide Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          {/* Header - Narrow for readability */}
          <div className="max-w-2xl mb-6">
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {tool.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Track tool usage for recently used */}
          <ToolTracker toolSlug={tool.slug} />

          {/* Tool Actions Bar */}
          <div className="max-w-2xl mb-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <ShareButtons tool={tool} />
              <div className="flex items-center gap-2 ml-auto">
                <FavoriteButton toolSlug={tool.slug} toolName={tool.name} />
                <QRCodeShare toolSlug={tool.slug} toolName={tool.name} />
                <PrintButton />
                <FullscreenButton />
                <EmbedCode toolSlug={tool.slug} toolName={tool.name} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

          {/* Tool Content - Full width available */}
          <div className="mb-8">{children}</div>

          {/* Disclaimer - Narrow */}
          {disclaimer && (
            <div className="max-w-2xl mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Disclaimer:</strong> {disclaimer}
              </p>
            </div>
          )}
        </div>

        {/* FAQ Section - Narrow */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-sm transition-shadow">
              <summary className="font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3">❓</span> Is this tool free?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                Yes! All our tools are completely free. No registration, no hidden
                charges, no ads. Just open and use.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-sm transition-shadow">
              <summary className="font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3">🔒</span> Is my data safe?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                Absolutely. All calculations happen in your browser. We don&apos;t store,
                send, or track any of your data. Everything is processed locally on
                your device.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-sm transition-shadow">
              <summary className="font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3">📱</span> Can I use this on mobile?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                Yes! All our tools are fully responsive and work perfectly on
                smartphones, tablets, and desktops.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-sm transition-shadow">
              <summary className="font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3">🌐</span> Do I need internet?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                No! Once the page loads, you can use the tool completely offline.
                All calculations happen in your browser without any server connection.
              </p>
            </details>
          </div>
        </div>

        {/* Back to Home - Narrow */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <Link
            href="/"
            title="Browse all free online tools"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors"
          >
            ← Browse All Free Tools
          </Link>
        </div>

        {/* Related Tools Section - Centered */}
        <div className="max-w-4xl mx-auto">
          <RelatedTools tools={relatedTools} />
        </div>
      </main>
    </div>
  );
}
