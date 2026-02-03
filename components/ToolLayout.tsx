import Link from "next/link";
import { Tool, getRelatedTools, getCategoryBySlug } from "@/lib/tools";
import Breadcrumbs from "./Breadcrumbs";
import RelatedTools from "./RelatedTools";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* AdSense Top Banner Placeholder - HIDDEN TEMPORARILY */}
      {/* <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
          [AdSense - Top Banner 728x90]
        </div>
      </div> */}

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {category && (
          <Breadcrumbs
            category={{ name: category.name, slug: category.slug }}
            tool={{ name: tool.name }}
          />
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {tool.name}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Tool Content */}
          <div className="mb-8">{children}</div>

          {/* Disclaimer */}
          {disclaimer && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Disclaimer:</strong> {disclaimer}
              </p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-sm transition-shadow">
              <summary className="font-semibold text-gray-900 flex items-center">
                <span className="mr-3">❓</span> Is this tool free?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                Yes! All our tools are completely free. No registration, no hidden
                charges, no ads. Just open and use.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-sm transition-shadow">
              <summary className="font-semibold text-gray-900 flex items-center">
                <span className="mr-3">🔒</span> Is my data safe?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                Absolutely. All calculations happen in your browser. We don't store,
                send, or track any of your data. Everything is processed locally on
                your device.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-sm transition-shadow">
              <summary className="font-semibold text-gray-900 flex items-center">
                <span className="mr-3">📱</span> Can I use this on mobile?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                Yes! All our tools are fully responsive and work perfectly on
                smartphones, tablets, and desktops.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-sm transition-shadow">
              <summary className="font-semibold text-gray-900 flex items-center">
                <span className="mr-3">🌐</span> Do I need internet?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                No! Once the page loads, you can use the tool completely offline.
                All calculations happen in your browser without any server connection.
              </p>
            </details>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Related Tools Section */}
        <RelatedTools tools={relatedTools} />

        {/* AdSense Inline Placeholder - HIDDEN TEMPORARILY */}
        {/* <div className="mt-16 bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
          [AdSense - Inline Rectangle 300x250]
        </div> */}
      </main>

      {/* AdSense Footer Banner Placeholder - HIDDEN TEMPORARILY */}
      {/* <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
          [AdSense - Footer Banner 728x90]
        </div>
      </div> */}
    </div>
  );
}
