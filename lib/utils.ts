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

// ==================== PHASE 3 UTILITIES ====================

// SIMPLE & COMPOUND INTEREST
export function calculateSimpleInterest(principal: number, annualRate: number, years: number): {
  interest: number;
  totalAmount: number;
} {
  const interest = (principal * annualRate * years) / 100;
  const totalAmount = principal + interest;
  return { interest, totalAmount };
}

export function calculateCompoundInterest(principal: number, annualRate: number, years: number, compounds: number = 12): {
  interest: number;
  totalAmount: number;
} {
  const rate = annualRate / 100;
  const totalAmount = principal * Math.pow(1 + rate / compounds, compounds * years);
  const interest = totalAmount - principal;
  return { interest, totalAmount };
}

// SAVINGS GOAL
export function calculateMonthlySavings(goal: number, months: number): number {
  return goal / months;
}

// BMR CALCULATOR (Harris-Benedict Equation)
export function calculateBMR(weight: number, height: number, age: number, gender: "male" | "female"): number {
  if (gender === "male") {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
  }
}

// IDEAL WEIGHT (Devine Formula)
export function calculateIdealWeight(height: number, gender: "male" | "female"): {
  min: number;
  max: number;
} {
  let idealWeight: number;
  if (gender === "male") {
    idealWeight = 50 + (height - 152.4) * 0.75;
  } else {
    idealWeight = 45.5 + (height - 152.4) * 0.67;
  }
  const min = idealWeight * 0.9;
  const max = idealWeight * 1.1;
  return { min, max };
}

// STEP TO CALORIE CONVERTER
export function calculateCaloriesFromSteps(steps: number, weight: number): number {
  // Approximately 0.04 calories per step per kg of body weight
  return steps * 0.04 * weight;
}

// TEXT UTILITIES
export function removeExtraSpaces(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function sortLines(text: string, reverse: boolean = false): string {
  const lines = text.split('\n');
  lines.sort((a, b) => {
    if (reverse) return b.localeCompare(a);
    return a.localeCompare(b);
  });
  return lines.join('\n');
}

export function removeDuplicateLines(text: string): string {
  const lines = text.split('\n');
  return [...new Set(lines)].join('\n');
}

// DATE UTILITIES (EXTENDED)
export function getDayOfWeek(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

export function calculateWorkdays(date1: Date, date2: Date): number {
  let workdays = 0;
  const current = new Date(date1);
  
  while (current <= date2) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workdays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workdays;
}

// HOME CALCULATORS
export function calculatePaintArea(length: number, width: number, height: number): number {
  // Wall area = 2 * (length * height + width * height)
  return 2 * (length * height + width * height);
}

export function calculatePaintQuantity(area: number, coverage: number = 10): number {
  // Typical coverage: 1 liter covers 10 square meters
  return area / coverage;
}

export function calculateElectricityBill(powerWatts: number, hoursPerDay: number, daysPerMonth: number, ratePerKwh: number): number {
  const kwhPerDay = (powerWatts * hoursPerDay) / 1000;
  const kwhPerMonth = kwhPerDay * daysPerMonth;
  return kwhPerMonth * ratePerKwh;
}

export function calculateFuelCost(distance: number, mileage: number, fuelPrice: number): number {
  const litersNeeded = distance / mileage;
  return litersNeeded * fuelPrice;
}

// FUN UTILITIES
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomPassword(length: number = 12, includeSymbols: boolean = true): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const chars = includeSymbols ? letters + symbols : letters;

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export function calculateLuckyNumber(input: string): number {
  // Simple numerology: sum of character codes
  let sum = 0;
  for (const char of input.toUpperCase()) {
    const code = char.charCodeAt(0);
    sum += code;
  }
  // Reduce to single digit
  while (sum > 9) {
    sum = sum
      .toString()
      .split('')
      .reduce((acc, b) => parseInt(acc.toString()) + parseInt(b), 0);
  }
  return sum;
}

export function generateYesNoAnswer(): string {
  const answers = ['Yes', 'No', 'Maybe', 'Ask again later', 'Definitely', 'Not likely'];
  return answers[Math.floor(Math.random() * answers.length)];
}
