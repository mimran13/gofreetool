export function formatNumber(num: number, decimals: number = 2): string {
  return parseFloat(num.toFixed(decimals)).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function calculateEMI(
  principal: number,
  annualRate: number,
  years: number
): {
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
} {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  if (monthlyRate === 0) {
    return {
      monthlyEMI: principal / months,
      totalInterest: 0,
      totalPayable: principal,
    };
  }

  const monthlyEMI =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayable = monthlyEMI * months;
  const totalInterest = totalPayable - principal;

  return {
    monthlyEMI,
    totalInterest,
    totalPayable,
  };
}

export function calculateBMI(
  heightCm: number,
  weightKg: number
): {
  bmi: number;
  category: string;
  categoryColor: string;
} {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category = "";
  let categoryColor = "";

  if (bmi < 18.5) {
    category = "Underweight";
    categoryColor = "text-blue-600";
  } else if (bmi < 25) {
    category = "Normal Weight";
    categoryColor = "text-green-600";
  } else if (bmi < 30) {
    category = "Overweight";
    categoryColor = "text-yellow-600";
  } else {
    category = "Obese";
    categoryColor = "text-red-600";
  }

  return {
    bmi,
    category,
    categoryColor,
  };
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function countCharacters(text: string, includeSpaces: boolean = true): number {
  if (includeSpaces) {
    return text.length;
  }
  return text.replace(/\s/g, "").length;
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = countWords(text);
  return Math.ceil(words / wordsPerMinute);
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Percentage utilities
export function calculatePercentage(value: number, percent: number): number {
  return (value * percent) / 100;
}

export function calculatePercentOf(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function calculatePercentageIncrease(original: number, new_value: number): number {
  if (original === 0) return 0;
  return ((new_value - original) / original) * 100;
}

export function calculatePercentageDecrease(original: number, new_value: number): number {
  if (original === 0) return 0;
  return ((original - new_value) / original) * 100;
}

// Discount utilities
export function calculateDiscount(originalPrice: number, discountPercent: number): number {
  return originalPrice - (originalPrice * discountPercent) / 100;
}

export function calculateDiscountAmount(originalPrice: number, discountPercent: number): number {
  return (originalPrice * discountPercent) / 100;
}

// Water intake calculator
export function calculateWaterIntake(weightKg: number, activityLevel: "sedentary" | "moderate" | "active"): number {
  let baseIntake = weightKg * 0.033; // Base: ~33ml per kg
  
  switch (activityLevel) {
    case "sedentary":
      return baseIntake * 1;
    case "moderate":
      return baseIntake * 1.3;
    case "active":
      return baseIntake * 1.6;
    default:
      return baseIntake;
  }
}

// Text case converters
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function toSentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((word, index) => 
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
}

// Date utilities
export function calculateAge(birthDate: Date): {
  years: number;
  months: number;
  days: number;
} {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

export function calculateDateDifference(date1: Date, date2: Date): {
  days: number;
  weeks: number;
  months: number;
  years: number;
} {
  const oneDay = 24 * 60 * 60 * 1000;
  const days = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  return { days, weeks, months, years };
}

