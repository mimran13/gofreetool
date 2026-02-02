export interface Tool {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  icon: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  {
    slug: "calculators",
    name: "🧮 Calculators",
    icon: "📊",
    description: "Simple calculators for everyday calculations",
  },
  {
    slug: "health",
    name: "❤️ Health",
    icon: "💪",
    description: "Health and fitness calculators",
  },
  {
    slug: "writing",
    name: "✍️ Writing",
    icon: "📝",
    description: "Text analysis and writing tools",
  },
];

export const tools: Tool[] = [
  {
    id: "emi-calculator",
    slug: "emi-calculator",
    name: "EMI Calculator",
    category: "calculators",
    description:
      "Calculate your monthly EMI (Equated Monthly Installment) for loans. Get detailed breakdown of interest and total payable amount.",
    shortDescription: "Calculate monthly loan payments (EMI)",
    icon: "🧮",
    seo: {
      title: "EMI Calculator - Calculate Monthly Loan Payments",
      description:
        "Free EMI calculator to calculate monthly loan payments. Get total interest and payable amount in seconds. No signup required.",
      keywords: [
        "EMI calculator",
        "loan calculator",
        "monthly payment",
        "interest calculator",
      ],
    },
  },
  {
    id: "bmi-calculator",
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    description:
      "Calculate your Body Mass Index (BMI) based on height and weight. Get your BMI category and health insights.",
    shortDescription: "Calculate your Body Mass Index",
    icon: "❤️",
    seo: {
      title: "BMI Calculator - Check Your Body Mass Index",
      description:
        "Free BMI calculator to check your body mass index. Determine if you're underweight, normal, overweight, or obese.",
      keywords: ["BMI calculator", "body mass index", "health calculator", "weight"],
    },
  },
  {
    id: "word-counter",
    slug: "word-counter",
    name: "Word & Character Counter",
    category: "writing",
    description:
      "Count words, characters, and reading time for your text. Perfect for content creators and writers.",
    shortDescription: "Count words and characters in text",
    icon: "✍️",
    seo: {
      title: "Word & Character Counter - Text Analysis Tool",
      description:
        "Free word and character counter. Analyze text for word count, character count, and reading time. Perfect for writers and content creators.",
      keywords: [
        "word counter",
        "character counter",
        "text analysis",
        "reading time",
      ],
    },
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return tools.filter((tool) => tool.category === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getFeaturedTools(): Tool[] {
  return tools.slice(0, 3);
}
