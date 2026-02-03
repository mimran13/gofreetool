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
    name: "❤️ Health & Fitness",
    icon: "💪",
    description: "Health, fitness, and wellness calculators",
  },
  {
    slug: "writing",
    name: "✍️ Writing & Text",
    icon: "📝",
    description: "Text analysis and writing tools for content creators",
  },
  {
    slug: "date-time",
    name: "📅 Date & Time",
    icon: "⏰",
    description: "Date, time, and age calculators",
  },
  {
    slug: "home",
    name: "🏠 Home & Daily Life",
    icon: "🏡",
    description: "Calculators for home projects, utilities, and daily expenses",
  },
  {
    slug: "fun",
    name: "🎉 Fun & Random",
    icon: "🎲",
    description: "Random generators and fun decision-making tools",
  },
  {
    slug: "developer",
    name: "💻 Developer Tools",
    icon: "🛠️",
    description: "Essential tools for developers: formatters, validators, converters, and more",
  },
  {
    slug: "security-encoding",
    name: "🔐 Security & Encoding",
    icon: "🔒",
    description: "Encoding, decoding, and security tools for safe data handling",
  },
  {
    slug: "data-conversion",
    name: "🔄 Data Conversion",
    icon: "📊",
    description: "Convert data between formats: CSV, JSON, XML, and more",
  },
  {
    slug: "design",
    name: "🎨 Design & Visual",
    icon: "🖼️",
    description: "Color pickers, image tools, and visual design utilities",
  },
];

export const tools: Tool[] = [
  // ==================== CALCULATORS (10) ====================
  {
    id: "emi-calculator",
    slug: "emi-calculator",
    name: "EMI Calculator",
    category: "calculators",
    featured: true,
    description: "Calculate your monthly EMI (Equated Monthly Installment) for loans. Get detailed breakdown of interest and total payable amount.",
    shortDescription: "Calculate monthly loan payments",
    icon: "🧮",
    seo: {
      title: "EMI Calculator - Calculate Monthly Loan Payments",
      description: "Free EMI calculator to calculate monthly loan payments. Get total interest and payable amount in seconds. No signup required.",
      keywords: ["EMI calculator", "loan calculator", "monthly payment", "interest calculator"],
    },
    relatedTools: ["percentage-calculator", "split-bill-calculator", "simple-interest-calculator"],
  },
  {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "calculators",
    featured: true,
    description: "Calculate percentages, percentage increase/decrease, and what percentage one number is of another.",
    shortDescription: "Calculate percentages instantly",
    icon: "📊",
    seo: {
      title: "Percentage Calculator - Calculate % Online",
      description: "Free percentage calculator for calculating percentages, percent increase, percent decrease.",
      keywords: ["percentage calculator", "percent increase", "percent decrease"],
    },
    relatedTools: ["discount-calculator", "split-bill-calculator"],
  },
  {
    id: "discount-calculator",
    slug: "discount-calculator",
    name: "Discount Calculator",
    category: "calculators",
    featured: true,
    description: "Calculate discounts, sale prices, and savings. Find out how much you save with percentage or fixed amount discounts.",
    shortDescription: "Calculate discounts and sale prices",
    icon: "🏷️",
    seo: {
      title: "Discount Calculator - Calculate Sale Prices",
      description: "Free discount calculator. Calculate percentage discounts, final prices, and savings.",
      keywords: ["discount calculator", "sale price", "percentage off"],
    },
    relatedTools: ["percentage-calculator", "tip-calculator"],
  },
  {
    id: "split-bill-calculator",
    slug: "split-bill-calculator",
    name: "Split Bill Calculator",
    category: "calculators",
    featured: true,
    description: "Split bills easily among friends or colleagues. Calculate per-person cost with optional tip and tax.",
    shortDescription: "Divide bills equally",
    icon: "💰",
    seo: {
      title: "Split Bill Calculator - Divide Bills Easily",
      description: "Free bill splitter calculator. Split restaurant bills, rent, or any expense among friends.",
      keywords: ["split bill", "bill splitter", "divide bill"],
    },
    relatedTools: ["percentage-calculator", "tip-calculator"],
  },
  {
    id: "simple-interest-calculator",
    slug: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    category: "calculators",
    description: "Calculate simple interest on loans or investments. Find total amount payable with interest.",
    shortDescription: "Calculate simple interest",
    icon: "🏦",
    seo: {
      title: "Simple Interest Calculator - Calculate SI",
      description: "Free simple interest calculator. Calculate interest on loans and investments.",
      keywords: ["simple interest", "interest calculator", "SI calculator"],
    },
    relatedTools: ["emi-calculator", "compound-interest-calculator"],
  },
  {
    id: "compound-interest-calculator",
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "calculators",
    description: "Calculate compound interest on savings and investments. See how your money grows over time.",
    shortDescription: "Calculate compound interest",
    icon: "📈",
    seo: {
      title: "Compound Interest Calculator - Calculate CI",
      description: "Free compound interest calculator. Calculate compound interest on savings and investments.",
      keywords: ["compound interest", "CI calculator", "investment calculator"],
    },
    relatedTools: ["simple-interest-calculator", "savings-goal-calculator"],
  },
  {
    id: "savings-goal-calculator",
    slug: "savings-goal-calculator",
    name: "Savings Goal Calculator",
    category: "calculators",
    description: "Calculate how much you need to save monthly to reach your financial goals.",
    shortDescription: "Plan your savings goals",
    icon: "🎯",
    seo: {
      title: "Savings Goal Calculator - Calculate Savings",
      description: "Free savings goal calculator. Determine monthly savings needed to reach your goals.",
      keywords: ["savings goal", "savings calculator", "financial goal"],
    },
    relatedTools: ["compound-interest-calculator"],
  },
  {
    id: "tip-calculator",
    slug: "tip-calculator",
    name: "Tip Calculator",
    category: "calculators",
    description: "Calculate tips easily for restaurants and services. Get total bill with customizable tip percentages.",
    shortDescription: "Calculate tips instantly",
    icon: "💵",
    seo: {
      title: "Tip Calculator - Calculate Tips Easily",
      description: "Free tip calculator for restaurants and services. Calculate bills with tips.",
      keywords: ["tip calculator", "gratuity calculator", "service charge"],
    },
    relatedTools: ["split-bill-calculator", "percentage-calculator"],
  },
  {
    id: "loan-eligibility-calculator",
    slug: "loan-eligibility-calculator",
    name: "Loan Eligibility Calculator",
    category: "calculators",
    description: "Check your loan eligibility based on income and debt. Get pre-qualification estimates.",
    shortDescription: "Check loan eligibility",
    icon: "✅",
    seo: {
      title: "Loan Eligibility Calculator - Check Your Eligibility",
      description: "Free loan eligibility calculator. Check if you qualify for loans.",
      keywords: ["loan eligibility", "loan qualification", "loan calculator"],
    },
    relatedTools: ["emi-calculator"],
  },
  {
    id: "rent-split-calculator",
    slug: "rent-split-calculator",
    name: "Rent Split Calculator",
    category: "calculators",
    description: "Split rent fairly among roommates based on room sizes or income. Calculate each person's share.",
    shortDescription: "Split rent fairly",
    icon: "🏠",
    seo: {
      title: "Rent Split Calculator - Divide Rent Equally",
      description: "Free rent split calculator. Divide rent fairly among roommates.",
      keywords: ["rent split", "roommate rent", "rent calculator"],
    },
    relatedTools: ["split-bill-calculator"],
  },

  // ==================== HEALTH & FITNESS (5) ====================
  {
    id: "bmi-calculator",
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    featured: true,
    description: "Calculate your Body Mass Index (BMI) based on height and weight. Get your BMI category and health insights.",
    shortDescription: "Calculate your Body Mass Index",
    icon: "❤️",
    disclaimer: "This tool is for informational purposes only and not medical advice. Consult a healthcare professional for personalized guidance.",
    seo: {
      title: "BMI Calculator - Check Your Body Mass Index",
      description: "Free BMI calculator to check your body mass index.",
      keywords: ["BMI calculator", "body mass index", "health calculator"],
    },
    relatedTools: ["water-intake-calculator", "bmr-calculator", "ideal-weight-calculator"],
  },
  {
    id: "water-intake-calculator",
    slug: "water-intake-calculator",
    name: "Daily Water Intake Calculator",
    category: "health",
    description: "Calculate your recommended daily water intake based on your weight and activity level.",
    shortDescription: "Calculate daily water needs",
    icon: "💧",
    seo: {
      title: "Water Intake Calculator - Daily Hydration Guide",
      description: "Free water intake calculator. Calculate daily water needs.",
      keywords: ["water intake", "hydration", "water consumption"],
    },
    relatedTools: ["bmi-calculator"],
  },
  {
    id: "bmr-calculator",
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "health",
    description: "Calculate your Basal Metabolic Rate (BMR). Find how many calories your body burns at rest.",
    shortDescription: "Calculate your BMR",
    icon: "🔥",
    disclaimer: "For fitness guidance, consult a healthcare professional or certified trainer.",
    seo: {
      title: "BMR Calculator - Calculate Basal Metabolic Rate",
      description: "Free BMR calculator. Calculate how many calories you burn at rest.",
      keywords: ["BMR calculator", "basal metabolic rate", "calorie calculator"],
    },
    relatedTools: ["bmi-calculator", "ideal-weight-calculator"],
  },
  {
    id: "ideal-weight-calculator",
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    category: "health",
    description: "Calculate your ideal weight range based on height. Get personalized weight recommendations.",
    shortDescription: "Calculate ideal weight",
    icon: "⚖️",
    disclaimer: "Ideal weight varies by individual. Consult a healthcare provider for personalized advice.",
    seo: {
      title: "Ideal Weight Calculator - Calculate Your Ideal Weight",
      description: "Free ideal weight calculator. Find your healthy weight range.",
      keywords: ["ideal weight", "healthy weight", "weight calculator"],
    },
    relatedTools: ["bmi-calculator", "bmr-calculator"],
  },
  {
    id: "step-calorie-converter",
    slug: "step-calorie-converter",
    name: "Step to Calorie Converter",
    category: "health",
    description: "Convert steps walked to calories burned. Track your fitness progress and daily activity.",
    shortDescription: "Convert steps to calories",
    icon: "👟",
    seo: {
      title: "Step to Calorie Converter - Calculate Calories Burned",
      description: "Free step to calorie converter. Calculate calories burned from steps.",
      keywords: ["step calculator", "calorie converter", "fitness tracker"],
    },
    relatedTools: ["bmr-calculator"],
  },

  // ==================== WRITING & TEXT (5) ====================
  {
    id: "word-counter",
    slug: "word-counter",
    name: "Word & Character Counter",
    category: "writing",
    featured: true,
    description: "Count words, characters, and reading time for your text. Perfect for content creators and writers.",
    shortDescription: "Count words and characters",
    icon: "✍️",
    seo: {
      title: "Word & Character Counter - Text Analysis Tool",
      description: "Free word and character counter. Analyze text for word count and reading time.",
      keywords: ["word counter", "character counter", "text analysis"],
    },
    relatedTools: ["text-case-converter", "remove-extra-spaces", "duplicate-line-remover"],
  },
  {
    id: "text-case-converter",
    slug: "text-case-converter",
    name: "Text Case Converter",
    category: "writing",
    featured: true,
    description: "Convert text to uppercase, lowercase, title case, sentence case, and more.",
    shortDescription: "Convert text case instantly",
    icon: "🔤",
    seo: {
      title: "Text Case Converter - Change Text Case",
      description: "Free text case converter. Convert text to UPPERCASE, lowercase, Title Case.",
      keywords: ["text case converter", "uppercase", "lowercase", "title case"],
    },
    relatedTools: ["word-counter"],
  },
  {
    id: "remove-extra-spaces",
    slug: "remove-extra-spaces",
    name: "Remove Extra Spaces Tool",
    category: "writing",
    description: "Remove extra spaces, tabs, and newlines from your text. Clean up formatting quickly.",
    shortDescription: "Remove extra spaces",
    icon: "🧹",
    seo: {
      title: "Remove Extra Spaces Tool - Clean Text",
      description: "Free tool to remove extra spaces from text. Clean formatting instantly.",
      keywords: ["remove spaces", "clean text", "text formatter"],
    },
    relatedTools: ["word-counter"],
  },
  {
    id: "line-sorter",
    slug: "line-sorter",
    name: "Line Sorter",
    category: "writing",
    description: "Sort lines alphabetically or in custom order. Perfect for organizing lists and data.",
    shortDescription: "Sort text lines",
    icon: "📋",
    seo: {
      title: "Line Sorter - Sort Text Lines",
      description: "Free line sorter. Sort text lines alphabetically or reverse.",
      keywords: ["line sorter", "sort text", "text organizer"],
    },
    relatedTools: ["duplicate-line-remover"],
  },
  {
    id: "duplicate-line-remover",
    slug: "duplicate-line-remover",
    name: "Duplicate Line Remover",
    category: "writing",
    description: "Remove duplicate lines from your text. Keep only unique lines in your content.",
    shortDescription: "Remove duplicate lines",
    icon: "🔄",
    seo: {
      title: "Duplicate Line Remover - Remove Duplicate Lines",
      description: "Free duplicate line remover. Remove duplicate lines from text.",
      keywords: ["duplicate remover", "unique lines", "text cleaner"],
    },
    relatedTools: ["line-sorter", "word-counter"],
  },

  // ==================== DATE & TIME (4) ====================
  {
    id: "age-calculator",
    slug: "age-calculator",
    name: "Age Calculator",
    category: "date-time",
    featured: true,
    description: "Calculate your age in years, months, and days. Find out exactly how old you are.",
    shortDescription: "Calculate your exact age",
    icon: "🎂",
    seo: {
      title: "Age Calculator - Calculate Your Age",
      description: "Free age calculator. Calculate your age in years, months, and days.",
      keywords: ["age calculator", "calculate age", "birthday calculator"],
    },
    relatedTools: ["date-difference-calculator", "day-of-week-finder"],
  },
  {
    id: "date-difference-calculator",
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    category: "date-time",
    featured: true,
    description: "Calculate the number of days, weeks, months, and years between two dates.",
    shortDescription: "Calculate days between dates",
    icon: "📆",
    seo: {
      title: "Date Difference Calculator - Days Between Dates",
      description: "Free date difference calculator. Calculate days between dates.",
      keywords: ["date difference", "days between", "date calculator"],
    },
    relatedTools: ["age-calculator", "workdays-calculator"],
  },
  {
    id: "day-of-week-finder",
    slug: "day-of-week-finder",
    name: "Day of Week Finder",
    category: "date-time",
    description: "Find what day of the week a specific date falls on. Great for event planning.",
    shortDescription: "Find day of the week",
    icon: "📅",
    seo: {
      title: "Day of Week Finder - Find Day of Date",
      description: "Free day finder. Find what day of the week any date falls on.",
      keywords: ["day of week", "date finder", "calendar"],
    },
    relatedTools: ["date-difference-calculator"],
  },
  {
    id: "workdays-calculator",
    slug: "workdays-calculator",
    name: "Workdays Calculator",
    category: "date-time",
    description: "Calculate the number of working days between two dates. Perfect for project planning.",
    shortDescription: "Calculate workdays",
    icon: "💼",
    seo: {
      title: "Workdays Calculator - Calculate Working Days",
      description: "Free workdays calculator. Calculate business days between dates.",
      keywords: ["workdays", "business days", "working days calculator"],
    },
    relatedTools: ["date-difference-calculator"],
  },

  // ==================== HOME & DAILY LIFE (4) ====================
  {
    id: "paint-area-calculator",
    slug: "paint-area-calculator",
    name: "Paint Area Calculator",
    category: "home",
    description: "Calculate paint needed for your project. Find area to paint and quantity required.",
    shortDescription: "Calculate paint needed",
    icon: "🎨",
    seo: {
      title: "Paint Area Calculator - Calculate Paint Needed",
      description: "Free paint calculator. Calculate paint needed for walls and surfaces.",
      keywords: ["paint calculator", "paint area", "home improvement"],
    },
    relatedTools: ["electricity-bill-calculator"],
  },
  {
    id: "electricity-bill-calculator",
    slug: "electricity-bill-calculator",
    name: "Electricity Bill Estimator",
    category: "home",
    description: "Estimate your monthly electricity bill based on appliance usage. Track energy costs.",
    shortDescription: "Estimate electricity bill",
    icon: "⚡",
    seo: {
      title: "Electricity Bill Calculator - Estimate Bill",
      description: "Free electricity bill calculator. Estimate monthly energy costs.",
      keywords: ["electricity bill", "power consumption", "energy calculator"],
    },
    relatedTools: ["appliance-energy-calculator"],
  },
  {
    id: "appliance-energy-calculator",
    slug: "appliance-energy-calculator",
    name: "Appliance Energy Calculator",
    category: "home",
    description: "Calculate energy consumption and cost of individual appliances. Save on electricity.",
    shortDescription: "Calculate appliance energy use",
    icon: "🔌",
    seo: {
      title: "Appliance Energy Calculator - Calculate Energy Use",
      description: "Free appliance energy calculator. Calculate electricity consumption.",
      keywords: ["appliance calculator", "energy consumption", "power usage"],
    },
    relatedTools: ["electricity-bill-calculator"],
  },
  {
    id: "fuel-cost-calculator",
    slug: "fuel-cost-calculator",
    name: "Fuel Cost Calculator",
    category: "home",
    description: "Calculate fuel costs for trips based on distance and fuel prices. Plan travel budgets.",
    shortDescription: "Calculate fuel costs",
    icon: "⛽",
    seo: {
      title: "Fuel Cost Calculator - Calculate Trip Costs",
      description: "Free fuel cost calculator. Calculate gas costs for trips.",
      keywords: ["fuel calculator", "gas cost", "travel cost"],
    },
    relatedTools: ["paint-area-calculator"],
  },

  // ==================== FUN & RANDOM (5) ====================
  {
    id: "random-number-generator",
    slug: "random-number-generator",
    name: "Random Number Generator",
    category: "fun",
    description: "Generate random numbers with custom range. Perfect for games, lotteries, and selections.",
    shortDescription: "Generate random numbers",
    icon: "🎲",
    seo: {
      title: "Random Number Generator - Generate Random Numbers",
      description: "Free random number generator. Generate numbers for games and draws.",
      keywords: ["random number", "number generator", "random picker"],
    },
    relatedTools: ["random-password-generator", "lucky-number-generator"],
  },
  {
    id: "random-password-generator",
    slug: "random-password-generator",
    name: "Random Password Generator",
    category: "fun",
    description: "Generate strong random passwords for security. Customize length and character types.",
    shortDescription: "Generate secure passwords",
    icon: "🔐",
    seo: {
      title: "Random Password Generator - Generate Passwords",
      description: "Free password generator. Create strong random passwords.",
      keywords: ["password generator", "random password", "secure password"],
    },
    relatedTools: ["random-number-generator"],
  },
  {
    id: "lucky-number-generator",
    slug: "lucky-number-generator",
    name: "Lucky Number Generator",
    category: "fun",
    description: "Generate your lucky numbers based on name or date. Fun numerology tool.",
    shortDescription: "Generate lucky numbers",
    icon: "⭐",
    seo: {
      title: "Lucky Number Generator - Generate Lucky Numbers",
      description: "Free lucky number generator. Get your lucky numbers.",
      keywords: ["lucky number", "numerology", "number generator"],
    },
    relatedTools: ["random-number-generator"],
  },
  {
    id: "yes-no-spinner",
    slug: "yes-no-spinner",
    name: "Yes / No Spinner",
    category: "fun",
    description: "Spin a wheel to get yes or no answers. Perfect for quick decisions.",
    shortDescription: "Yes or no spinner",
    icon: "🎡",
    seo: {
      title: "Yes No Spinner - Quick Decisions",
      description: "Free yes no spinner. Get instant answers for decisions.",
      keywords: ["yes no spinner", "decision maker", "yes or no"],
    },
    relatedTools: ["decision-wheel"],
  },
  {
    id: "decision-wheel",
    slug: "decision-wheel",
    name: "Decision Wheel",
    category: "fun",
    description: "Create a custom decision wheel with your options. Spin for random choices.",
    shortDescription: "Custom decision wheel",
    icon: "🎯",
    seo: {
      title: "Decision Wheel - Random Choice Picker",
      description: "Free decision wheel. Spin for random choices from your options.",
      keywords: ["decision wheel", "choice picker", "random selector"],
    },
    relatedTools: ["yes-no-spinner"],
  },

  // ==================== DEVELOPER TOOLS (3) ====================
  {
    id: "json-formatter-viewer",
    slug: "json-formatter-viewer",
    name: "JSON Formatter & Viewer",
    category: "developer",
    featured: true,
    description: "Format, validate, and view JSON data with syntax highlighting. Pretty-print minified JSON, expand/collapse nested objects, and catch errors instantly. All processing happens in your browser for complete privacy.",
    shortDescription: "Format and validate JSON instantly",
    icon: "{ }",
    seo: {
      title: "JSON Formatter & Viewer - Free Online JSON Pretty Print Tool",
      description: "Free online JSON formatter and viewer. Validate, pretty-print, and explore JSON data with syntax highlighting. 100% client-side, no data sent to servers.",
      keywords: ["JSON formatter", "JSON viewer", "JSON validator", "pretty print JSON", "JSON beautifier", "format JSON online", "JSON parser"],
    },
    relatedTools: ["uuid-generator", "hash-generator"],
  },
  {
    id: "uuid-generator",
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "developer",
    featured: true,
    description: "Generate cryptographically secure UUID v4 identifiers instantly. Create single or bulk UUIDs (up to 50 at once) for databases, APIs, and applications. All generation happens in your browser using secure random values.",
    shortDescription: "Generate secure UUID v4 identifiers",
    icon: "🔑",
    seo: {
      title: "UUID Generator - Free Online UUID v4 Generator Tool",
      description: "Free online UUID v4 generator. Create cryptographically secure unique identifiers instantly. Generate single or bulk UUIDs. 100% client-side, no data sent to servers.",
      keywords: ["UUID generator", "UUID v4", "GUID generator", "unique identifier", "random UUID", "bulk UUID generator", "online UUID tool"],
    },
    relatedTools: ["json-formatter-viewer", "hash-generator"],
  },
  {
    id: "hash-generator",
    slug: "hash-generator",
    name: "Hash Generator",
    category: "developer",
    featured: true,
    description: "Generate MD5, SHA-1, and SHA-256 hashes from any text instantly. Perfect for verifying file integrity, creating checksums, and password hashing workflows. All hashing happens in your browser for complete privacy.",
    shortDescription: "Generate MD5, SHA-1, SHA-256 hashes",
    icon: "#️⃣",
    seo: {
      title: "Hash Generator - Free Online MD5, SHA-1, SHA-256 Hash Tool",
      description: "Free online hash generator. Create MD5, SHA-1, and SHA-256 hashes instantly. Verify file integrity and generate checksums. 100% client-side, no data sent to servers.",
      keywords: ["hash generator", "MD5 hash", "SHA-1 hash", "SHA-256 hash", "checksum generator", "online hash tool", "text to hash"],
    },
    relatedTools: ["uuid-generator", "json-formatter-viewer", "base64-encoder-decoder"],
  },

  // ==================== SECURITY & ENCODING TOOLS (2) ====================
  {
    id: "base64-encoder-decoder",
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "security-encoding",
    featured: true,
    description: "Encode text or files to Base64 and decode Base64 strings back to original content. Supports Unicode text and file uploads. All processing happens in your browser for complete privacy and security.",
    shortDescription: "Encode and decode Base64 strings",
    icon: "🔄",
    seo: {
      title: "Base64 Encoder Decoder - Free Online Base64 Tool",
      description: "Free online Base64 encoder and decoder. Convert text and files to Base64 and decode Base64 strings. Supports Unicode. 100% client-side, no data sent to servers.",
      keywords: ["Base64 encoder", "Base64 decoder", "Base64 converter", "encode Base64", "decode Base64", "Base64 online tool", "file to Base64"],
    },
    relatedTools: ["hash-generator", "url-encoder-decoder"],
  },
  {
    id: "url-encoder-decoder",
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    category: "security-encoding",
    featured: true,
    description: "Encode and decode URL strings instantly. Convert special characters to percent-encoded format for safe URL transmission. Parse and view query parameters in a readable table format.",
    shortDescription: "Encode and decode URL strings",
    icon: "🔗",
    seo: {
      title: "URL Encoder Decoder - Free Online URL Encoding Tool",
      description: "Free online URL encoder and decoder. Convert special characters to percent-encoded format. Parse query parameters. 100% client-side, no data sent to servers.",
      keywords: ["URL encoder", "URL decoder", "percent encoding", "encode URL", "decode URL", "URL parser", "query string decoder"],
    },
    relatedTools: ["base64-encoder-decoder", "json-formatter-viewer"],
  },
  {
    id: "password-generator",
    slug: "password-generator",
    name: "Password Generator",
    category: "security-encoding",
    featured: true,
    description: "Generate cryptographically secure passwords with customizable length and character options. Choose from uppercase, lowercase, numbers, and symbols. Real-time strength indicator helps you create strong passwords.",
    shortDescription: "Generate secure passwords instantly",
    icon: "🔐",
    seo: {
      title: "Password Generator - Free Secure Password Generator Tool",
      description: "Free online password generator. Create strong, secure passwords with customizable options. Uses cryptographic randomness. 100% client-side, no passwords stored or transmitted.",
      keywords: ["password generator", "secure password", "random password", "strong password generator", "password creator", "safe password generator"],
    },
    relatedTools: ["hash-generator", "uuid-generator", "base64-encoder-decoder"],
  },

  // ==================== DATA CONVERSION TOOLS (1) ====================
  {
    id: "csv-json-converter",
    slug: "csv-json-converter",
    name: "CSV to JSON Converter",
    category: "data-conversion",
    featured: true,
    description: "Convert CSV data to JSON and JSON to CSV instantly. Supports custom delimiters, headers, and RFC 4180 compliant parsing. All processing happens in your browser for complete privacy.",
    shortDescription: "Convert between CSV and JSON formats",
    icon: "📄",
    seo: {
      title: "CSV to JSON Converter - Free Online CSV JSON Tool",
      description: "Free online CSV to JSON converter. Convert CSV to JSON and JSON to CSV instantly. Supports custom delimiters and headers. 100% client-side, no data sent to servers.",
      keywords: ["CSV to JSON", "JSON to CSV", "CSV converter", "JSON converter", "data converter", "CSV parser", "JSON parser"],
    },
    relatedTools: ["json-formatter-viewer", "base64-encoder-decoder"],
  },

  // ==================== DESIGN & VISUAL TOOLS (5) ====================
  {
    id: "color-picker",
    slug: "color-picker",
    name: "Color Picker",
    category: "design",
    featured: true,
    description: "Pick any color and instantly convert between HEX, RGB, and HSL formats. Use the native color picker or enter values directly. Copy color codes with one click for use in CSS, design tools, or code.",
    shortDescription: "Pick and convert colors instantly",
    icon: "🎨",
    seo: {
      title: "Color Picker - Free Online HEX, RGB, HSL Color Converter",
      description: "Free online color picker tool. Convert colors between HEX, RGB, and HSL formats instantly. Copy color codes for CSS and design. 100% client-side, no data sent to servers.",
      keywords: ["color picker", "hex to rgb", "rgb to hsl", "color converter", "css colors", "color code generator", "hex color picker"],
    },
    relatedTools: ["gradient-generator", "image-resizer"],
  },
  {
    id: "gradient-generator",
    slug: "gradient-generator",
    name: "CSS Gradient Generator",
    category: "design",
    featured: true,
    description: "Create beautiful CSS gradients visually. Pick two colors, adjust the angle, and copy the generated linear-gradient CSS code instantly. Includes preset gradients and real-time preview.",
    shortDescription: "Create CSS gradients visually",
    icon: "🌈",
    seo: {
      title: "CSS Gradient Generator - Free Online Linear Gradient Maker",
      description: "Free online CSS gradient generator. Create beautiful linear gradients with custom colors and angles. Copy CSS code instantly. 100% client-side, no data sent to servers.",
      keywords: ["css gradient generator", "linear gradient", "gradient maker", "css background gradient", "gradient css", "color gradient tool"],
    },
    relatedTools: ["color-picker", "image-resizer"],
  },
  {
    id: "image-resizer",
    slug: "image-resizer",
    name: "Image Resizer",
    category: "design",
    featured: true,
    description: "Resize images instantly in your browser. Upload any image, set custom dimensions or use presets, maintain aspect ratio, and download the resized version. All processing happens locally — your images never leave your device.",
    shortDescription: "Resize images in your browser",
    icon: "📐",
    seo: {
      title: "Image Resizer - Free Online Image Resize Tool",
      description: "Free online image resizer. Resize images to any dimension instantly. Maintain aspect ratio, use presets for social media. 100% client-side, no uploads to servers.",
      keywords: ["image resizer", "resize image online", "image resize tool", "photo resizer", "resize picture", "image dimensions", "scale image"],
    },
    relatedTools: ["color-picker", "hex-rgb-converter"],
  },
  {
    id: "hex-rgb-converter",
    slug: "hex-rgb-converter",
    name: "HEX ↔ RGB Converter",
    category: "design",
    featured: true,
    description: "Convert colors between HEX and RGB formats instantly. Enter a HEX code or RGB values and see the conversion in real-time. Validates inputs and provides copy buttons for both formats.",
    shortDescription: "Convert HEX and RGB colors",
    icon: "🔄",
    seo: {
      title: "HEX to RGB Converter - Free Online Color Converter",
      description: "Free online HEX to RGB converter. Convert colors between HEX and RGB formats instantly. Live conversion with validation. 100% client-side, no data sent to servers.",
      keywords: ["hex to rgb", "rgb to hex", "color converter", "hex rgb converter", "color code converter", "css color converter"],
    },
    relatedTools: ["color-picker", "contrast-checker"],
  },
  {
    id: "contrast-checker",
    slug: "contrast-checker",
    name: "Color Contrast Checker",
    category: "design",
    featured: true,
    description: "Check the contrast ratio between text and background colors to ensure WCAG accessibility compliance. Shows pass/fail results for AA and AAA levels for both normal and large text.",
    shortDescription: "Check WCAG color contrast",
    icon: "♿",
    seo: {
      title: "Color Contrast Checker - Free WCAG Accessibility Tool",
      description: "Free online color contrast checker. Test text and background colors for WCAG AA and AAA compliance. Live preview with pass/fail indicators. 100% client-side.",
      keywords: ["contrast checker", "wcag contrast", "color accessibility", "contrast ratio", "wcag aa", "wcag aaa", "accessibility checker"],
    },
    relatedTools: ["color-picker", "hex-rgb-converter"],
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

// ============================================================================
// CATEGORY SEO CONFIGURATION
// ============================================================================

export interface CategorySEO {
  title: string;
  description: string;
  keywords: string[];
  intro: string;
}

export const CATEGORY_SEO_CONFIG: Record<string, CategorySEO> = {
  calculators: {
    title: "Free Calculator Tools Online",
    description:
      "Free online calculators for EMI, loans, percentages, tips, and more. Fast, accurate, and easy to use. No signup required. Works in your browser.",
    keywords: [
      "free calculator",
      "online calculator",
      "EMI calculator",
      "loan calculator",
      "percentage calculator",
      "tip calculator",
      "financial calculator",
    ],
    intro:
      "Powerful calculators for everyday financial and math needs. Calculate EMI payments, compound interest, percentages, and more. All tools run directly in your browser — no signup, no data collection, completely free.",
  },
  health: {
    title: "Free Health & Fitness Tools Online",
    description:
      "Free health calculators for BMI, BMR, calorie tracking, and ideal weight. Get instant health insights. No signup required. Privacy-first.",
    keywords: [
      "BMI calculator",
      "health calculator",
      "BMR calculator",
      "calorie calculator",
      "fitness tools",
      "ideal weight calculator",
    ],
    intro:
      "Track your health and fitness goals with easy-to-use calculators. Calculate BMI, daily water intake, calories burned, and more. All calculations happen in your browser — your health data stays private.",
  },
  writing: {
    title: "Free Writing & Text Tools Online",
    description:
      "Free text tools for word counting, case conversion, and text formatting. Perfect for writers and content creators. No signup required.",
    keywords: [
      "word counter",
      "character counter",
      "text converter",
      "case converter",
      "writing tools",
      "text formatter",
    ],
    intro:
      "Essential tools for writers, bloggers, and content creators. Count words and characters, convert text case, remove duplicate lines, and format text. Free, fast, and works offline.",
  },
  "date-time": {
    title: "Free Date & Time Tools Online",
    description:
      "Free date calculators for age, date differences, and day of week. Calculate time between dates instantly. No signup required.",
    keywords: [
      "date calculator",
      "age calculator",
      "date difference",
      "day of week finder",
      "workdays calculator",
      "time calculator",
    ],
    intro:
      "Calculate dates, ages, and time differences instantly. Find days between dates, calculate workdays, or discover what day of the week any date falls on. Accurate and free.",
  },
  home: {
    title: "Free Home & Daily Life Tools Online",
    description:
      "Free calculators for home projects, electricity bills, fuel costs, and daily expenses. Plan your budget and projects. No signup required.",
    keywords: [
      "electricity calculator",
      "fuel cost calculator",
      "paint calculator",
      "home tools",
      "utility calculator",
      "budget calculator",
    ],
    intro:
      "Practical tools for everyday household planning. Calculate electricity bills, estimate paint for your walls, track fuel costs, and split rent fairly. Save time and money with these free tools.",
  },
  fun: {
    title: "Free Fun & Random Generator Tools Online",
    description:
      "Free random generators and decision-making tools. Generate random numbers, spin decision wheels, and make choices fun. No signup required.",
    keywords: [
      "random generator",
      "decision wheel",
      "random number",
      "lucky number",
      "yes no spinner",
      "random password",
    ],
    intro:
      "Make decisions fun with random generators and spinners. Generate random numbers, spin a decision wheel, pick lucky numbers, or let fate decide with yes/no spinners. Completely random and unbiased.",
  },
  developer: {
    title: "Free Developer Tools Online",
    description:
      "Free developer tools for JSON formatting, UUID generation, and hash creation. Essential utilities for programmers. No signup required.",
    keywords: [
      "JSON formatter",
      "UUID generator",
      "hash generator",
      "developer tools",
      "code formatter",
      "programming tools",
    ],
    intro:
      "Essential tools for developers and programmers. Format JSON, generate UUIDs, create hashes, and more. All processing happens client-side — your code never leaves your browser.",
  },
  "security-encoding": {
    title: "Free Security & Encoding Tools Online",
    description:
      "Free encoding tools for Base64, URL encoding, and password generation. Secure your data with browser-based tools. No signup required.",
    keywords: [
      "Base64 encoder",
      "URL encoder",
      "password generator",
      "encoding tools",
      "security tools",
      "encryption tools",
    ],
    intro:
      "Encode, decode, and secure your data with privacy-focused tools. Convert Base64, encode URLs, and generate strong passwords. Everything runs locally — your sensitive data never touches our servers.",
  },
  "data-conversion": {
    title: "Free Data Conversion Tools Online",
    description:
      "Free data converters for CSV, JSON, and other formats. Convert data formats instantly in your browser. No signup required.",
    keywords: [
      "CSV to JSON",
      "JSON to CSV",
      "data converter",
      "format converter",
      "file converter",
      "data transformation",
    ],
    intro:
      "Convert data between popular formats effortlessly. Transform CSV to JSON, parse structured data, and export in the format you need. Fast, accurate, and completely private.",
  },
  design: {
    title: "Free Design & Visual Tools Online",
    description:
      "Free design tools for color picking, image editing, and visual utilities. Perfect for designers and developers. No signup required.",
    keywords: [
      "color picker",
      "hex to rgb",
      "color converter",
      "design tools",
      "css colors",
      "visual tools",
    ],
    intro:
      "Essential visual tools for designers and developers. Pick colors, convert between formats, and get the exact color codes you need for your projects. All tools run in your browser — fast, free, and private.",
  },
};

// ============================================================================
// POPULAR TOOLS BY CATEGORY (Curated)
// ============================================================================

export const POPULAR_TOOLS_BY_CATEGORY: Record<string, string[]> = {
  calculators: ["emi-calculator", "percentage-calculator", "discount-calculator", "tip-calculator"],
  health: ["bmi-calculator", "bmr-calculator", "water-intake-calculator", "ideal-weight-calculator"],
  writing: ["word-counter", "text-case-converter", "remove-extra-spaces", "duplicate-line-remover"],
  "date-time": ["age-calculator", "date-difference-calculator", "day-of-week-finder", "workdays-calculator"],
  home: ["electricity-bill-calculator", "fuel-cost-calculator", "paint-area-calculator", "rent-split-calculator"],
  fun: ["random-number-generator", "decision-wheel", "random-password-generator", "lucky-number-generator"],
  developer: ["json-formatter-viewer", "uuid-generator", "hash-generator"],
  "security-encoding": ["base64-encoder-decoder", "url-encoder-decoder", "password-generator"],
  "data-conversion": ["csv-json-converter"],
  design: ["color-picker", "contrast-checker", "gradient-generator", "image-resizer"],
};

// ============================================================================
// RELATED CATEGORIES (for internal linking)
// ============================================================================

export const RELATED_CATEGORIES: Record<string, string[]> = {
  calculators: ["health", "home", "date-time"],
  health: ["calculators", "home", "fun"],
  writing: ["developer", "data-conversion", "fun"],
  "date-time": ["calculators", "home", "writing"],
  home: ["calculators", "date-time", "health"],
  fun: ["writing", "security-encoding", "developer"],
  developer: ["security-encoding", "data-conversion", "design"],
  "security-encoding": ["developer", "data-conversion", "fun"],
  "data-conversion": ["developer", "security-encoding", "writing"],
  design: ["developer", "writing", "data-conversion"],
};

// ============================================================================
// CATEGORY HELPER FUNCTIONS
// ============================================================================

export function getCategorySEO(slug: string): CategorySEO | undefined {
  return CATEGORY_SEO_CONFIG[slug];
}

export function getPopularToolsForCategory(categorySlug: string): Tool[] {
  const slugs = POPULAR_TOOLS_BY_CATEGORY[categorySlug] || [];
  return slugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is Tool => t !== undefined);
}

export function getRelatedCategories(categorySlug: string): Category[] {
  const slugs = RELATED_CATEGORIES[categorySlug] || [];
  return slugs
    .map((slug) => getCategoryBySlug(slug))
    .filter((c): c is Category => c !== undefined);
}
