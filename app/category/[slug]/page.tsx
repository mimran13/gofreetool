import { Metadata } from "next";
import {
  getCategoryBySlug,
  getToolsByCategory,
} from "@/lib/tools";
import { generateMetadata as generateMeta } from "@/lib/seo";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The category you're looking for doesn't exist.",
    };
  }

  return generateMeta(
    `${category.name} Tools - Free Online Tools`,
    `Explore our collection of ${category.name.toLowerCase()}. Free tools for everyday use.`,
    [category.name.toLowerCase(), "tools", "calculator"],
    `/category/${slug}`
  );
}

export async function generateStaticParams() {
  return [
    { slug: "calculators" },
    { slug: "health" },
    { slug: "writing" },
  ];
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Link
              href="/"
              className="inline-block text-teal-600 hover:text-teal-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const tools = getToolsByCategory(slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-teal-600">
            Home
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="text-5xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            {category.description}
          </p>
        </div>

        {/* Tools Grid */}
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center mb-12">
            <p className="text-gray-600 text-lg">
              No tools in this category yet. Check back soon!
            </p>
          </div>
        )}

        {/* Back button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
