import Link from "next/link";
import { Category } from "@/lib/tools";

interface RelatedCategoriesProps {
  categories: Category[];
}

export default function RelatedCategories({ categories }: RelatedCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Related Categories
      </h2>
      <ul className="space-y-3">
        {categories.slice(0, 2).map((category) => {
          const name = category.name.replace(/^[^\s]+\s/, ""); // Remove emoji prefix
          return (
            <li key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                title={`Browse free ${name} tools online`}
                className="group inline-flex items-start gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <span className="text-lg" aria-hidden="true">
                  {category.icon}
                </span>
                <span>
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Free {name} Tools
                  </span>
                  <span className="text-sm block text-gray-500 dark:text-gray-400">
                    {category.description}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
