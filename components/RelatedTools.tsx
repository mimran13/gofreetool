import Link from "next/link";

interface RelatedTool {
  slug: string;
  name: string;
  shortDescription: string;
  icon: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.slice(0, 3).map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-teal-300 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {tool.shortDescription}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
