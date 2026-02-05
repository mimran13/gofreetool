import { Metadata } from "next";
import Link from "next/link";
import {
  categories,
  getCategoryBySlug,
  getToolsByCategory,
  getCategorySEO,
  getPopularToolsForCategory,
  getRelatedCategories,
  getSubcategoriesForCategory,
  getToolBySlug,
  Tool,
  Category,
  Subcategory,
} from "@/lib/tools";

// ============================================================================
// TYPES
// ============================================================================

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// ============================================================================
// SEO METADATA
// ============================================================================

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const seoConfig = getCategorySEO(slug);

  if (!category || !seoConfig) {
    return {
      title: "Category Not Found | GoFreeTool",
      description: "The category you're looking for doesn't exist.",
    };
  }

  const categoryName = category.name.replace(/^[^\s]+\s/, ""); // Remove emoji
  const title = `Free ${categoryName} Tools Online | GoFreeTool`;
  const url = `https://gofreetool.com/category/${slug}`;

  return {
    title,
    description: seoConfig.description,
    keywords: [...seoConfig.keywords, "free tools", "no signup", "online tools", "browser-based"],
    openGraph: {
      title,
      description: seoConfig.description,
      url,
      type: "website",
      siteName: "GoFreeTool",
      images: [
        {
          url: "https://gofreetool.com/og-image.png",
          width: 1200,
          height: 630,
          alt: `${categoryName} Tools - GoFreeTool`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seoConfig.description,
      images: ["https://gofreetool.com/og-image.png"],
    },
    alternates: {
      canonical: url,
    },
  };
}

// ============================================================================
// STATIC GENERATION
// ============================================================================

export async function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

// ============================================================================
// COMPONENTS
// ============================================================================

function Breadcrumb({ category }: { category: Category }) {
  const categoryName = category.name.replace(/^[^\s]+\s/, "");
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/#categories" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Categories
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-gray-900 dark:text-white font-medium" aria-current="page">
          {categoryName}
        </li>
      </ol>
    </nav>
  );
}

function IntroSection({ category, intro, toolCount }: { category: Category; intro: string; toolCount: number }) {
  const categoryName = category.name.replace(/^[^\s]+\s/, "");
  return (
    <header className="mb-12">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/50">
          <span className="text-4xl" role="img" aria-hidden="true">
            {category.icon}
          </span>
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Free {categoryName} Tools Online
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {toolCount} free tool{toolCount !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
        {intro}
      </p>
      {/* Trust indicators */}
      <div className="flex flex-wrap gap-4 mt-6">
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          100% Free
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          No Signup Required
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Browser-Based
        </span>
      </div>
    </header>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const category = getCategoryBySlug(tool.category);
  const categoryName = category?.name.replace(/^[^\s]+\s/, "") || tool.category;

  return (
    <Link href={`/tools/${tool.slug}`} className="group">
      <article className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-slate-400 dark:hover:border-slate-500 transition-all">
        <div className="flex items-start gap-4">
          <span className="text-4xl group-hover:scale-110 transition-transform" role="img" aria-hidden="true">
            {tool.icon}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {tool.shortDescription}
            </p>
            <span className="inline-block mt-3 text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-full">
              {categoryName}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function PopularToolsSection({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null;

  return (
    <section className="mb-16" aria-labelledby="popular-tools-heading">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl" role="img" aria-hidden="true">
          🔥
        </span>
        <h2 id="popular-tools-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
          Most Popular
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.slice(0, 4).map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 rounded-xl hover:shadow-md transition-all"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform" role="img" aria-hidden="true">
              {tool.icon}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                {tool.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {tool.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AllToolsSection({ tools, categoryName }: { tools: Tool[]; categoryName: string }) {
  return (
    <section className="mb-16" aria-labelledby="all-tools-heading">
      <h2 id="all-tools-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        All {categoryName} Tools
      </h2>
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No tools in this category yet. Check back soon!
          </p>
        </div>
      )}
    </section>
  );
}

function SubcategorizedToolsSection({
  subcategories,
  allTools,
  categoryName,
}: {
  subcategories: Subcategory[];
  allTools: Tool[];
  categoryName: string;
}) {
  // Collect slugs that appear in any subcategory
  const groupedSlugs = new Set(subcategories.flatMap((s) => s.toolSlugs));

  // Tools that don't belong to any subcategory
  const ungrouped = allTools.filter((t) => !groupedSlugs.has(t.slug));

  return (
    <section className="mb-16" aria-labelledby="all-tools-heading">
      <h2 id="all-tools-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        All {categoryName} Tools
      </h2>

      <div className="space-y-12">
        {subcategories.map((sub) => {
          const tools = sub.toolSlugs
            .map((slug) => getToolBySlug(slug))
            .filter((t): t is Tool => t !== undefined);

          if (tools.length === 0) return null;

          return (
            <div key={sub.name}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/50">
                  <span className="text-lg">{sub.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sub.name}
                </h3>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-full">
                  {tools.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Ungrouped tools, if any */}
        {ungrouped.length > 0 && (
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/50">
                <span className="text-lg">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Other Tools
              </h3>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-full">
                {ungrouped.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ungrouped.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SEOContentSection({ content, categoryName }: { content: string; categoryName: string }) {
  return (
    <section className="mb-16" aria-labelledby="about-section-heading">
      <h2
        id="about-section-heading"
        className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
      >
        About Our Free {categoryName} Tools
      </h2>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{content}</p>
      </div>
    </section>
  );
}

function RelatedCategoriesSection({ relatedCategories }: { relatedCategories: Category[] }) {
  if (relatedCategories.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="related-categories-heading">
      <h2 id="related-categories-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Related Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {relatedCategories.map((cat) => {
          const catName = cat.name.replace(/^[^\s]+\s/, "");
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-slate-400 dark:hover:border-slate-500 transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/50 group-hover:bg-slate-200 dark:group-hover:bg-slate-700/50 transition-colors flex-shrink-0">
                <span className="text-2xl group-hover:scale-110 transition-transform" role="img" aria-hidden="true">
                  {cat.icon}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  {catName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {cat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function BackToHome() {
  return (
    <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
      <Link
        href="/"
        title="Browse all free online tools - no signup required"
        className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Browse All Free Online Tools
      </Link>
    </div>
  );
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const seoConfig = getCategorySEO(slug);

  // 404 state
  if (!category || !seoConfig) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <span className="text-6xl mb-4 block">404</span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              The category you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const tools = getToolsByCategory(slug);
  const popularTools = getPopularToolsForCategory(slug);
  const relatedCategories = getRelatedCategories(slug);
  const subcategories = getSubcategoriesForCategory(slug);
  const categoryName = category.name.replace(/^[^\s]+\s/, "");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb category={category} />

        {/* Intro Section with H1 */}
        <IntroSection category={category} intro={seoConfig.intro} toolCount={tools.length} />

        {/* Popular Tools (Featured) */}
        <PopularToolsSection tools={popularTools} />

        {/* All Tools — subcategorized or flat grid */}
        {subcategories ? (
          <SubcategorizedToolsSection
            subcategories={subcategories}
            allTools={tools}
            categoryName={categoryName}
          />
        ) : (
          <AllToolsSection tools={tools} categoryName={categoryName} />
        )}

        {/* SEO Content Section */}
        <SEOContentSection content={seoConfig.seoContent} categoryName={categoryName} />

        {/* Related Categories (Internal Linking) */}
        <RelatedCategoriesSection relatedCategories={relatedCategories} />

        {/* Back to Home */}
        <BackToHome />
      </main>
    </div>
  );
}
