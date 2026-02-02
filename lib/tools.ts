export interface FAQ {
  question: string;
  answer: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  icon: string;
  featured?: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  faq?: FAQ[];
  disclaimer?: string;
  relatedTools?: string[]; // array of tool slugs
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
    description: "Financial, math, and everyday calculators for quick calculations",
  },
  {
    slug: "health",
    name: "❤️ Health",
    icon: "💪",
    description: "Health, fitness, and wellness calculators",
  },
  {
    slug: "writing",
    name: "✍️ Writing",
    icon: "📝",
    description: "Text analysis and writing tools for content creators",
  },
  {
    slug: "date-time",
    name: "📅 Date & Time",
    icon: "⏰",
    description: "Date, time, and age calculators",
  },
];

export const tools: Tool[] = [
  // CALCULATORS CATEGORY
  {
    id: "emi-calculator",
    slug: "emi-calculator",
    name: "EMI Calculator",
    category: "calculators",
    featured: true,
    description:
      "Calculate your monthly EMI (Equated Monthly Installment) for loans. Get detailed breakdown of interest and total payable amount.",
    shortDescription: "Calculate monthly loan payments",
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
    relatedTools: ["percentage-calculator", "split-bill-calculator"],
  },
  {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "calculators",
    featured: true,
    description:
      "Calculate percentages, percentage increase/decrease, and what percentage one number is of another. Perfect for math, finance, and everyday use.",
    shortDescription: "Calculate percentages instantly",
    icon: "📊",
    seo: {
      title: "Percentage Calculator - Calculate % Online",
      description:
        "Free percentage calculator for calculating percentages, percent increase, percent decrease. Fast, accurate, and easy to use.",
      keywords: ["percentage calculator", "percent increase", "percent decrease", "% calculator"],
    },
    relatedTools: ["discount-calculator", "split-bill-calculator"],
  },
  {
    id: "discount-calculator",
    slug: "discount-calculator",
    name: "Discount Calculator",
    category: "calculators",
    description:
      "Calculate discounts, sale prices, and savings. Find out how much you save with percentage or fixed amount discounts.",
    shortDescription: "Calculate discounts and sale prices",
    icon: "🏷️",
    seo: {
      title: "Discount Calculator - Calculate Sale Prices",
      description:
        "Free discount calculator. Calculate percentage discounts, final prices, and savings. Great for shopping and budgeting.",
      keywords: ["discount calculator", "sale price", "percentage off", "savings calculator"],
    },
    relatedTools: ["percentage-calculator", "split-bill-calculator"],
  },
  {
    id: "split-bill-calculator",
    slug: "split-bill-calculator",
    name: "Split Bill Calculator",
    category: "calculators",
    description:
      "Split bills easily among friends or colleagues. Calculate per-person cost with optional tip and tax.",
    shortDescription: "Divide bills equally",
    icon: "💰",
    seo: {
      title: "Split Bill Calculator - Divide Bills Easily",
      description:
        "Free bill splitter calculator. Split restaurant bills, rent, or any expense among friends. Includes tip and tax calculations.",
      keywords: ["split bill", "bill splitter", "divide bill", "cost calculator"],
    },
    relatedTools: ["percentage-calculator", "emi-calculator"],
  },

  // HEALTH CATEGORY
  {
    id: "bmi-calculator",
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    featured: true,
    description:
      "Calculate your Body Mass Index (BMI) based on height and weight. Get your BMI category and health insights.",
    shortDescription: "Calculate your Body Mass Index",
    icon: "❤️",
    disclaimer: "This tool is for informational purposes only and not medical advice. Consult a healthcare professional for personalized guidance.",
    seo: {
      title: "BMI Calculator - Check Your Body Mass Index",
      description:
        "Free BMI calculator to check your body mass index. Determine if you're underweight, normal, overweight, or obese.",
      keywords: ["BMI calculator", "body mass index", "health calculator", "weight"],
    },
    relatedTools: ["water-intake-calculator"],
  },
  {
    id: "water-intake-calculator",
    slug: "water-intake-calculator",
    name: "Daily Water Intake Calculator",
    category: "health",
    description:
      "Calculate your recommended daily water intake based on your weight and activity level. Stay hydrated with personalized recommendations.",
    shortDescription: "Calculate daily water needs",
    icon: "💧",
    seo: {
      title: "Water Intake Calculator - Daily Hydration Guide",
      description:
        "Free water intake calculator. Calculate how much water you should drink daily based on your weight and activity level.",
      keywords: ["water intake calculator", "daily water", "hydration", "water consumption"],
    },
    relatedTools: ["bmi-calculator"],
  },

  // WRITING CATEGORY
  {
    id: "word-counter",
    slug: "word-counter",
    name: "Word & Character Counter",
    category: "writing",
    featured: true,
    description:
      "Count words, characters, and reading time for your text. Perfect for content creators and writers.",
    shortDescription: "Count words and characters",
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
    relatedTools: ["text-case-converter"],
  },
  {
    id: "text-case-converter",
    slug: "text-case-converter",
    name: "Text Case Converter",
    category: "writing",
    description:
      "Convert text to uppercase, lowercase, title case, sentence case, and more. Perfect for formatting text quickly.",
    shortDescription: "Convert text case instantly",
    icon: "🔤",
    seo: {
      title: "Text Case Converter - Change Text Case",
      description:
        "Free text case converter. Convert text to UPPERCASE, lowercase, Title Case, Sentence case, and more.",
      keywords: ["text case converter", "uppercase", "lowercase", "title case", "case converter"],
    },
    relatedTools: ["word-counter"],
  },

  // DATE & TIME CATEGORY
  {
    id: "age-calculator",
    slug: "age-calculator",
    name: "Age Calculator",
    category: "date-time",
    description:
      "Calculate your age in years, months, and days. Find out exactly how old you are down to the day.",
    shortDescription: "Calculate your exact age",
    icon: "🎂",
    seo: {
      title: "Age Calculator - Calculate Your Age",
      description:
        "Free age calculator. Calculate your age in years, months, and days from your birth date.",
      keywords: ["age calculator", "calculate age", "how old am I", "birthday calculator"],
    },
    relatedTools: ["date-difference-calculator"],
  },
  {
    id: "date-difference-calculator",
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    category: "date-time",
    description:
      "Calculate the number of days, weeks, months, and years between two dates. Perfect for planning and timeline analysis.",
    shortDescription: "Calculate days between dates",
    icon: "📆",
    seo: {
      title: "Date Difference Calculator - Days Between Dates",
      description:
        "Free date difference calculator. Calculate the number of days, weeks, months between two dates.",
      keywords: ["date difference", "days between", "date calculator", "timeline calculator"],
    },
    relatedTools: ["age-calculator"],
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
  return tools.filter((tool) => tool.featured).slice(0, 6);
}

export function getRelatedTools(toolSlug: string): Tool[] {
  const tool = getToolBySlug(toolSlug);
  if (!tool?.relatedTools) return [];
  return tool.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is Tool => t !== undefined);
}
