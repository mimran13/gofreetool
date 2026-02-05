import Link from "next/link";
import { Tool } from "@/lib/tools";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`}>
      <div className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-slate-400 transition-all cursor-pointer h-full">
        <div className="text-4xl mb-3">{tool.icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">{tool.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {tool.shortDescription}
        </p>
        <div className="mt-4">
          <span className="inline-block text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {tool.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
