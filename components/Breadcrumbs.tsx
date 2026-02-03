import Link from "next/link";

interface BreadcrumbsProps {
  category: {
    name: string;
    slug: string;
  };
  tool: {
    name: string;
  };
}

export default function Breadcrumbs({ category, tool }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-teal-600 transition-colors">
            Home
          </Link>
        </li>
        <li className="text-gray-400" aria-hidden="true">/</li>
        <li>
          <Link
            href={`/category/${category.slug}`}
            className="hover:text-teal-600 transition-colors"
          >
            {category.name}
          </Link>
        </li>
        <li className="text-gray-400" aria-hidden="true">/</li>
        <li>
          <span className="text-gray-900 font-medium">{tool.name}</span>
        </li>
      </ol>
    </nav>
  );
}
