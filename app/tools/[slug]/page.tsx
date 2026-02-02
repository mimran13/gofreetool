import { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import { generateMetadata as generateMeta } from "@/lib/seo";
import EMICalculator from "./emi-calculator";
import BMICalculator from "./bmi-calculator";
import WordCounter from "./word-counter";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The tool you're looking for doesn't exist.",
    };
  }

  return generateMeta(
    tool.seo.title,
    tool.seo.description,
    tool.seo.keywords,
    `/tools/${tool.slug}`
  );
}

export async function generateStaticParams() {
  return [
    { slug: "emi-calculator" },
    { slug: "bmi-calculator" },
    { slug: "word-counter" },
  ];
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;

  switch (slug) {
    case "emi-calculator":
      return <EMICalculator />;
    case "bmi-calculator":
      return <BMICalculator />;
    case "word-counter":
      return <WordCounter />;
    default:
      return <div className="p-8 text-center">Tool not found</div>;
  }
}
