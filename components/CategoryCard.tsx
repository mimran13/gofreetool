import Link from "next/link";
import { Category, getToolsByCategory } from "@/lib/tools";
import ToolCard from "./ToolCard";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const tools = getToolsByCategory(category.slug);

  return (
    <div className="mb-12">
      <div className="mb-6">
        <div className="text-3xl mb-2">{category.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
        <p className="text-gray-600 mt-2">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {tools.length === 0 && (
        <p className="text-gray-500 text-center py-8">No tools in this category yet.</p>
      )}

      <Link href={`/category/${category.slug}`}>
        <div className="mt-6 text-center">
          <span className="text-teal-600 hover:text-teal-700 font-medium">
            View all {category.name} →
          </span>
        </div>
      </Link>
    </div>
  );
}
