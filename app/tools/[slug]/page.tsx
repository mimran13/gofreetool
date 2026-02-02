import { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools";
import { generateMetadata as generateMeta } from "@/lib/seo";
import EMICalculator from "./emi-calculator";
import BMICalculator from "./bmi-calculator";
import WordCounter from "./word-counter";
import PercentageCalculator from "./percentage-calculator";
import DiscountCalculator from "./discount-calculator";
import SplitBillCalculator from "./split-bill-calculator";
import WaterIntakeCalculator from "./water-intake-calculator";
import TextCaseConverter from "./text-case-converter";
import AgeCalculator from "./age-calculator";
import DateDifferenceCalculator from "./date-difference-calculator";

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
    { slug: "percentage-calculator" },
    { slug: "discount-calculator" },
    { slug: "split-bill-calculator" },
    { slug: "water-intake-calculator" },
    { slug: "text-case-converter" },
    { slug: "age-calculator" },
    { slug: "date-difference-calculator" },
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
    case "percentage-calculator":
      return <PercentageCalculator />;
    case "discount-calculator":
      return <DiscountCalculator />;
    case "split-bill-calculator":
      return <SplitBillCalculator />;
    case "water-intake-calculator":
      return <WaterIntakeCalculator />;
    case "text-case-converter":
      return <TextCaseConverter />;
    case "age-calculator":
      return <AgeCalculator />;
    case "date-difference-calculator":
      return <DateDifferenceCalculator />;
    default:
      return <div className="p-8 text-center">Tool not found</div>;
  }
}
