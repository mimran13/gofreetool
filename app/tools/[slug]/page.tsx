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
// Phase 3 New Tools - Calculators
import SimpleInterestCalculator from "../simple-interest-calculator/page";
import CompoundInterestCalculator from "../compound-interest-calculator/page";
import SavingsGoalCalculator from "../savings-goal-calculator/page";
import TipCalculator from "../tip-calculator/page";
import LoanEligibilityCalculator from "../loan-eligibility-calculator/page";
import RentSplitCalculator from "../rent-split-calculator/page";
// Phase 3 New Tools - Health
import BMRCalculator from "../bmr-calculator/page";
import IdealWeightCalculator from "../ideal-weight-calculator/page";
import StepCalorieConverter from "../step-calorie-converter/page";
// Phase 3 New Tools - Writing
import RemoveExtraSpaces from "../remove-extra-spaces/page";
import LineSorter from "../line-sorter/page";
import DuplicateLineRemover from "../duplicate-line-remover/page";
// Phase 3 New Tools - Date & Time
import DayOfWeekFinder from "../day-of-week-finder/page";
import WorkdaysCalculator from "../workdays-calculator/page";
// Phase 3 New Tools - Home
import PaintAreaCalculator from "../paint-area-calculator/page";
import ElectricityBillCalculator from "../electricity-bill-calculator/page";
import ApplianceEnergyCalculator from "../appliance-energy-calculator/page";
import FuelCostCalculator from "../fuel-cost-calculator/page";
// Phase 3 New Tools - Fun
import RandomNumberGenerator from "../random-number-generator/page";
import RandomPasswordGenerator from "../random-password-generator/page";
import LuckyNumberGenerator from "../lucky-number-generator/page";
import YesNoSpinner from "../yes-no-spinner/page";
import DecisionWheel from "../decision-wheel/page";
// Developer Tools
import JsonFormatterViewer from "../json-formatter-viewer/page";
import UUIDGenerator from "../uuid-generator/page";
import HashGenerator from "../hash-generator/page";
// Security & Encoding Tools
import Base64EncoderDecoder from "../base64-encoder-decoder/page";
import URLEncoderDecoder from "../url-encoder-decoder/page";
import PasswordGenerator from "../password-generator/page";

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
    // Original tools
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
    // Phase 3 Calculators
    { slug: "simple-interest-calculator" },
    { slug: "compound-interest-calculator" },
    { slug: "savings-goal-calculator" },
    { slug: "tip-calculator" },
    { slug: "loan-eligibility-calculator" },
    { slug: "rent-split-calculator" },
    // Phase 3 Health
    { slug: "bmr-calculator" },
    { slug: "ideal-weight-calculator" },
    { slug: "step-calorie-converter" },
    // Phase 3 Writing
    { slug: "remove-extra-spaces" },
    { slug: "line-sorter" },
    { slug: "duplicate-line-remover" },
    // Phase 3 Date & Time
    { slug: "day-of-week-finder" },
    { slug: "workdays-calculator" },
    // Phase 3 Home
    { slug: "paint-area-calculator" },
    { slug: "electricity-bill-calculator" },
    { slug: "appliance-energy-calculator" },
    { slug: "fuel-cost-calculator" },
    // Phase 3 Fun
    { slug: "random-number-generator" },
    { slug: "random-password-generator" },
    { slug: "lucky-number-generator" },
    { slug: "yes-no-spinner" },
    { slug: "decision-wheel" },
    // Developer Tools
    { slug: "json-formatter-viewer" },
    { slug: "uuid-generator" },
    { slug: "hash-generator" },
    // Security & Encoding Tools
    { slug: "base64-encoder-decoder" },
    { slug: "url-encoder-decoder" },
    { slug: "password-generator" },
  ];
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;

  switch (slug) {
    // Original tools
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
    // Phase 3 Calculators
    case "simple-interest-calculator":
      return <SimpleInterestCalculator />;
    case "compound-interest-calculator":
      return <CompoundInterestCalculator />;
    case "savings-goal-calculator":
      return <SavingsGoalCalculator />;
    case "tip-calculator":
      return <TipCalculator />;
    case "loan-eligibility-calculator":
      return <LoanEligibilityCalculator />;
    case "rent-split-calculator":
      return <RentSplitCalculator />;
    // Phase 3 Health
    case "bmr-calculator":
      return <BMRCalculator />;
    case "ideal-weight-calculator":
      return <IdealWeightCalculator />;
    case "step-calorie-converter":
      return <StepCalorieConverter />;
    // Phase 3 Writing
    case "remove-extra-spaces":
      return <RemoveExtraSpaces />;
    case "line-sorter":
      return <LineSorter />;
    case "duplicate-line-remover":
      return <DuplicateLineRemover />;
    // Phase 3 Date & Time
    case "day-of-week-finder":
      return <DayOfWeekFinder />;
    case "workdays-calculator":
      return <WorkdaysCalculator />;
    // Phase 3 Home
    case "paint-area-calculator":
      return <PaintAreaCalculator />;
    case "electricity-bill-calculator":
      return <ElectricityBillCalculator />;
    case "appliance-energy-calculator":
      return <ApplianceEnergyCalculator />;
    case "fuel-cost-calculator":
      return <FuelCostCalculator />;
    // Phase 3 Fun
    case "random-number-generator":
      return <RandomNumberGenerator />;
    case "random-password-generator":
      return <RandomPasswordGenerator />;
    case "lucky-number-generator":
      return <LuckyNumberGenerator />;
    case "yes-no-spinner":
      return <YesNoSpinner />;
    case "decision-wheel":
      return <DecisionWheel />;
    // Developer Tools
    case "json-formatter-viewer":
      return <JsonFormatterViewer />;
    case "uuid-generator":
      return <UUIDGenerator />;
    case "hash-generator":
      return <HashGenerator />;
    // Security & Encoding Tools
    case "base64-encoder-decoder":
      return <Base64EncoderDecoder />;
    case "url-encoder-decoder":
      return <URLEncoderDecoder />;
    case "password-generator":
      return <PasswordGenerator />;
    default:
      return <div className="p-8 text-center">Tool not found</div>;
  }
}
