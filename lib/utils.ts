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
