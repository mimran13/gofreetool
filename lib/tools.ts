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
  {
    slug: "seo",
    name: "🔍 SEO & Marketing",
    icon: "📈",
    description: "SEO tools, meta tag generators, and marketing utilities for better search rankings",
  },
  {
    slug: "unit-converters",
    name: "📐 Unit Converters",
    icon: "🔢",
    description: "Convert between units of length, weight, temperature, data storage, and more",
  },
  {
    slug: "social-media",
    name: "📱 Social Media",
    icon: "📲",
    description: "Tools for social media content creation, hashtags, and platform optimization",
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

  // ==================== WRITING & TEXT (6) ====================
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
  {
    id: "lorem-ipsum-generator",
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "writing",
    featured: true,
    description: "Generate lorem ipsum placeholder text for your designs, mockups, and layouts. Create paragraphs, sentences, or words of classic dummy text instantly with customizable options.",
    shortDescription: "Generate placeholder dummy text",
    icon: "📝",
    seo: {
      title: "Lorem Ipsum Generator - Dummy Text",
      description: "Free lorem ipsum generator. Create placeholder dummy text for designs and mockups. Generate paragraphs, sentences, or words of lorem ipsum text instantly online.",
      keywords: ["lorem ipsum generator", "dummy text generator", "placeholder text", "lorem ipsum", "filler text", "lipsum generator", "blind text generator"],
    },
    faq: [
      {
        question: "What is Lorem Ipsum?",
        answer: "Lorem Ipsum is dummy placeholder text used in the printing and typesetting industry since the 1500s. It originates from a scrambled passage of Cicero's 'De Finibus Bonorum et Malorum' (45 BC) and is used to fill layouts without distracting from the design.",
      },
      {
        question: "Why use Lorem Ipsum instead of real text?",
        answer: "Lorem Ipsum provides a natural-looking text distribution without distracting readers with meaningful content. This lets designers and developers focus on visual elements like typography, spacing, and layout rather than being distracted by readable text.",
      },
      {
        question: "Is this tool free to use?",
        answer: "Yes, this Lorem Ipsum generator is completely free with no limits. Generate as much placeholder text as you need for your projects. All processing happens in your browser.",
      },
    ],
    relatedTools: ["word-counter", "text-case-converter", "remove-extra-spaces"],
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

  // ==================== FUN & RANDOM (6) ====================
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
  {
    id: "pomodoro-timer",
    slug: "pomodoro-timer",
    name: "Pomodoro Timer",
    category: "fun",
    featured: true,
    description: "Boost your productivity with the Pomodoro Technique. Work in focused 25-minute intervals with short breaks. Customizable durations, session tracking, and audio notifications. Works offline.",
    shortDescription: "Focus timer with breaks",
    icon: "🍅",
    seo: {
      title: "Pomodoro Timer - Free Online Focus Timer",
      description: "Free Pomodoro timer online. Work in focused 25-minute intervals with short breaks. Customizable durations, session tracking, and audio alerts. No signup required.",
      keywords: ["pomodoro timer", "pomodoro technique", "focus timer", "productivity timer", "study timer", "work timer online", "25 minute timer"],
    },
    faq: [
      {
        question: "What is the Pomodoro Technique?",
        answer: "The Pomodoro Technique is a time management method that uses 25-minute focused work intervals followed by 5-minute breaks. After 4 intervals, take a longer 15-minute break.",
      },
      {
        question: "Can I customize the timer duration?",
        answer: "Yes, you can adjust the focus time, short break, and long break durations in the settings. Common variations include 50/10 and 90/20 minute splits.",
      },
      {
        question: "Does the timer work in the background?",
        answer: "Yes, the timer continues running when you switch tabs. The remaining time is shown in the page title, and you'll hear an audio chime when it completes.",
      },
    ],
    relatedTools: ["date-difference-calculator", "workdays-calculator", "decision-wheel"],
  },

  // ==================== DEVELOPER TOOLS (8) ====================
  {
    id: "url-parser",
    slug: "url-parser",
    name: "URL Parser & Query String Viewer",
    category: "developer",
    featured: true,
    description: "Parse and analyze URLs instantly. Extract protocol, host, port, pathname, and hash. View query parameters in a readable table with one-click copy. Perfect for debugging APIs, analyzing tracking links, or understanding complex URLs.",
    shortDescription: "Parse URLs and view query strings",
    icon: "🔗",
    seo: {
      title: "URL Parser & Query String Viewer - Free Online URL Analyzer Tool",
      description: "Free online URL parser and query string viewer. Extract protocol, host, path, and query parameters instantly. Copy individual values. 100% client-side, no data sent to servers.",
      keywords: ["URL parser", "query string viewer", "URL analyzer", "parse URL", "query parameters", "URL decoder", "URL breakdown", "URL components"],
    },
    relatedTools: ["url-encoder-decoder", "json-formatter-viewer", "base64-encoder-decoder"],
  },
  {
    id: "html-formatter",
    slug: "html-formatter",
    name: "HTML Formatter & Beautifier",
    category: "developer",
    featured: true,
    description: "Format and beautify HTML code instantly. Transform minified or messy HTML into clean, properly indented code. Supports nested tags, inline styles, and scripts. Perfect for debugging, code review, or cleaning up web page source code.",
    shortDescription: "Format and beautify HTML code",
    icon: "📄",
    seo: {
      title: "HTML Formatter & Beautifier - Free Online HTML Pretty Print Tool",
      description: "Free online HTML formatter and beautifier. Format minified HTML, fix indentation, and clean up messy code. 100% client-side, no data sent to servers.",
      keywords: ["HTML formatter", "HTML beautifier", "HTML pretty print", "format HTML", "HTML indenter", "beautify HTML", "HTML cleanup", "code formatter"],
    },
    relatedTools: ["css-formatter", "json-formatter-viewer", "jwt-decoder", "markdown-previewer"],
  },
  {
    id: "jwt-decoder",
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "developer",
    featured: true,
    description: "Decode JSON Web Tokens (JWT) instantly. View the header and payload with pretty-printed JSON and syntax highlighting. Inspect claims like iss, sub, exp, and iat. No signature verification - decode only for debugging and inspection.",
    shortDescription: "Decode and inspect JWT tokens",
    icon: "🔓",
    seo: {
      title: "JWT Decoder - Free Online JSON Web Token Decoder Tool",
      description: "Free online JWT decoder. Decode and inspect JSON Web Token header and payload instantly. Pretty-print claims with syntax highlighting. 100% client-side, no data sent to servers.",
      keywords: ["JWT decoder", "JSON Web Token", "decode JWT", "JWT parser", "JWT inspector", "JWT debugger", "token decoder", "JWT claims"],
    },
    relatedTools: ["json-formatter-viewer", "base64-encoder-decoder", "regex-tester"],
  },
  {
    id: "regex-tester",
    slug: "regex-tester",
    name: "Regex Tester",
    category: "developer",
    featured: true,
    description: "Test and debug regular expressions in real-time. Enter a pattern and test string to see matches highlighted instantly. View capture groups, match indices, and counts. Supports all JavaScript regex flags (g, i, m, s, u).",
    shortDescription: "Test regex patterns in real-time",
    icon: "🔍",
    seo: {
      title: "Regex Tester - Free Online Regular Expression Tester Tool",
      description: "Free online regex tester. Test regular expressions with real-time match highlighting, capture groups, and flag support. 100% client-side, no data sent to servers.",
      keywords: ["regex tester", "regular expression", "regex debugger", "regex validator", "pattern matching", "regex online", "test regex", "regex groups"],
    },
    relatedTools: ["css-formatter", "json-formatter-viewer", "url-parser", "markdown-previewer"],
  },
  {
    id: "css-formatter",
    slug: "css-formatter",
    name: "CSS Formatter & Beautifier",
    category: "developer",
    featured: true,
    description: "Format and beautify CSS code instantly. Transform minified or messy CSS into clean, readable code with proper indentation. Supports minification for production. Perfect for debugging stylesheets, code review, or cleaning up CSS files.",
    shortDescription: "Format and beautify CSS code",
    icon: "🎨",
    seo: {
      title: "CSS Formatter & Beautifier - Free Online CSS Pretty Print Tool",
      description: "Free online CSS formatter and beautifier. Format minified CSS, fix indentation, and clean up messy stylesheets. Minify CSS for production. 100% client-side, no data sent to servers.",
      keywords: ["CSS formatter", "CSS beautifier", "CSS pretty print", "format CSS", "CSS minifier", "beautify CSS", "CSS cleanup", "style formatter"],
    },
    relatedTools: ["html-formatter", "json-formatter-viewer", "regex-tester", "base64-encoder-decoder", "markdown-previewer"],
  },
  {
    id: "base-number-converter",
    slug: "base-number-converter",
    name: "Base Number Converter",
    category: "developer",
    featured: true,
    description: "Convert numbers between Binary, Decimal, Hexadecimal, and Octal instantly. Auto-detect input base or specify manually. Perfect for programmers, computer science students, and anyone working with different number systems. Copy results with one click.",
    shortDescription: "Convert between binary, decimal, hex, octal",
    icon: "🔢",
    seo: {
      title: "Base Number Converter - Free Binary, Decimal, Hex, Octal Converter",
      description: "Free online base number converter. Convert between binary, decimal, hexadecimal, and octal instantly. Auto-detect input base. 100% client-side, no data sent to servers.",
      keywords: ["base converter", "number converter", "binary to decimal", "hex to decimal", "octal converter", "decimal to binary", "hex converter", "binary converter", "number base", "radix converter"],
    },
    relatedTools: ["uuid-generator", "hash-generator", "base64-encoder-decoder", "json-formatter-viewer"],
  },
  {
    id: "markdown-previewer",
    slug: "markdown-previewer",
    name: "Markdown Previewer",
    category: "developer",
    featured: true,
    description: "Preview Markdown as rendered HTML in real-time. Write or paste Markdown text and see it rendered instantly with support for headings, lists, code blocks, links, images, tables, and more. Toggle between split view and preview-only mode. Copy the rendered HTML with one click.",
    shortDescription: "Preview Markdown as rendered HTML",
    icon: "📝",
    seo: {
      title: "Markdown Previewer - Free Online Markdown to HTML Preview Tool",
      description: "Free online Markdown previewer. Write Markdown and see live HTML preview instantly. Supports headings, lists, code blocks, tables, and more. 100% client-side, no data sent to servers.",
      keywords: ["markdown previewer", "markdown editor", "markdown to HTML", "markdown preview", "markdown renderer", "live markdown", "markdown online", "md preview"],
    },
    relatedTools: ["html-formatter", "json-formatter-viewer", "css-formatter", "regex-tester"],
  },
  {
    id: "json-yaml-converter",
    slug: "json-yaml-converter",
    name: "JSON ⇄ YAML Converter",
    category: "developer",
    featured: true,
    description: "Convert between JSON and YAML formats instantly. Paste JSON to get YAML or YAML to get JSON. Real-time validation with clear error messages. Perfect for DevOps engineers, Kubernetes config editing, and working with CI/CD pipelines. 100% client-side processing.",
    shortDescription: "Convert between JSON and YAML formats",
    icon: "🔄",
    seo: {
      title: "JSON to YAML Converter – Free Online Tool",
      description: "Free online JSON to YAML and YAML to JSON converter. Convert DevOps configs, Kubernetes manifests, and CI/CD pipelines instantly. Real-time validation. 100% client-side, no data uploaded.",
      keywords: ["JSON to YAML", "YAML to JSON", "JSON YAML converter", "YAML converter", "Kubernetes config", "DevOps tools", "config file converter", "YAML parser", "JSON converter online"],
    },
    faq: [
      {
        question: "What is JSON?",
        answer: "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write. It uses key-value pairs and arrays, and is the most common format for APIs and web services.",
      },
      {
        question: "What is YAML?",
        answer: "YAML (YAML Ain't Markup Language) is a human-friendly data serialization format commonly used for configuration files. It uses indentation instead of braces, making it easier to read. YAML is widely used in Kubernetes, Docker Compose, Ansible, and CI/CD pipelines.",
      },
      {
        question: "Is my data uploaded to any server?",
        answer: "No. All conversion happens entirely in your browser using JavaScript. Your data never leaves your device — nothing is sent to any server, stored, or logged.",
      },
    ],
    relatedTools: ["json-formatter-viewer", "csv-json-converter", "regex-tester"],
  },
  {
    id: "cron-expression-parser",
    slug: "cron-expression-parser",
    name: "Cron Expression Parser & Explainer",
    category: "developer",
    featured: true,
    description: "Parse and explain cron expressions in plain English. Enter any standard 5-field cron expression and get a human-readable explanation plus the next scheduled execution times in your browser timezone. Quick presets for common schedules. Perfect for backend engineers and DevOps.",
    shortDescription: "Parse cron expressions to plain English",
    icon: "⏰",
    seo: {
      title: "Cron Expression Parser & Explainer – Free Online Tool",
      description: "Free online cron expression parser and explainer. Convert cron syntax to human-readable text, see next execution times. For backend engineers and scheduling jobs. 100% client-side.",
      keywords: ["cron parser", "cron expression", "cron explainer", "cron job", "crontab", "cron schedule", "cron syntax", "cron generator", "cron next run", "scheduled tasks"],
    },
    faq: [
      {
        question: "What is a cron expression?",
        answer: "A cron expression is a string of five fields separated by spaces that defines a schedule. The fields represent: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, where 0 is Sunday). Special characters like *, /, -, and commas allow flexible scheduling.",
      },
      {
        question: "How does cron scheduling work?",
        answer: "Cron is a time-based job scheduler found in Unix-like systems. It runs tasks automatically at specified intervals. The cron daemon checks the crontab (cron table) every minute and executes any commands whose schedule matches the current time.",
      },
      {
        question: "Is timezone supported?",
        answer: "Yes. This tool uses your browser's local timezone to calculate and display the next execution times. The timezone is shown alongside the results so you know exactly when jobs will run in your local time.",
      },
    ],
    relatedTools: ["regex-tester", "json-formatter-viewer", "json-yaml-converter"],
  },
  {
    id: "curl-to-http-converter",
    slug: "curl-to-http-converter",
    name: "Curl to HTTP Request Converter",
    category: "developer",
    featured: true,
    description: "Convert curl commands to JavaScript fetch, Axios, and Python requests code instantly. Paste any curl command and get clean, ready-to-use code. Supports headers, body, auth, cookies, and more. All processing happens in your browser for complete privacy.",
    shortDescription: "Convert curl to fetch, axios, python",
    icon: "📡",
    seo: {
      title: "Curl to HTTP Request Converter – Free Online Tool",
      description: "Convert curl commands to fetch, axios, and Python requests — 100% client-side. Parse headers, body, auth, and more. No data uploaded.",
      keywords: ["curl converter", "curl to fetch", "curl to axios", "curl to python", "HTTP request", "API testing", "curl parser", "curl to code"],
    },
    faq: [
      {
        question: "What is curl?",
        answer: "curl is a command-line tool for transferring data using various network protocols, most commonly HTTP and HTTPS. It's available on virtually every operating system and is widely used by developers to test APIs, download files, and debug network requests.",
      },
      {
        question: "What output formats are supported?",
        answer: "This tool generates code in three popular formats: JavaScript fetch (the built-in browser API), Axios (a popular HTTP client for Node.js and browsers), and Python requests (the most popular Python HTTP library).",
      },
      {
        question: "Is my data uploaded to any server?",
        answer: "No. All parsing and code generation happens entirely in your browser using JavaScript. Your curl commands — including any API keys, tokens, or sensitive URLs — never leave your device.",
      },
    ],
    relatedTools: ["json-formatter-viewer", "json-yaml-converter", "regex-tester"],
  },
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
    relatedTools: ["jwt-decoder", "html-formatter", "uuid-generator", "url-parser", "markdown-previewer"],
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
    relatedTools: ["json-formatter-viewer", "hash-generator", "base-number-converter"],
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
    relatedTools: ["uuid-generator", "json-formatter-viewer", "base64-encoder-decoder", "base-number-converter"],
  },
  {
    id: "unix-timestamp-converter",
    slug: "unix-timestamp-converter",
    name: "Unix Timestamp Converter",
    category: "developer",
    featured: true,
    description: "Convert Unix timestamps to human-readable dates and dates to timestamps. Supports seconds and milliseconds, multiple date formats including ISO 8601, UTC, and RFC 2822. Shows relative time.",
    shortDescription: "Convert Unix timestamps to dates",
    icon: "⏱️",
    seo: {
      title: "Unix Timestamp Converter - Free Online",
      description: "Free Unix timestamp converter. Convert epoch time to dates and dates to Unix timestamps. Supports seconds, milliseconds, ISO 8601, and more. 100% client-side.",
      keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "unix time", "epoch time", "posix time", "date to timestamp"],
    },
    faq: [
      {
        question: "What is a Unix timestamp?",
        answer: "A Unix timestamp counts the number of seconds since January 1, 1970, 00:00:00 UTC (the Unix Epoch). It is used in programming, databases, and APIs for timezone-independent time representation.",
      },
      {
        question: "What is the difference between seconds and milliseconds?",
        answer: "Traditional Unix timestamps use seconds (10 digits). JavaScript's Date.now() uses milliseconds (13 digits). Java and .NET also commonly use milliseconds. Use whichever your system expects.",
      },
      {
        question: "What is the Year 2038 problem?",
        answer: "Systems using 32-bit signed integers for timestamps will overflow on January 19, 2038. Most modern systems now use 64-bit integers to avoid this issue.",
      },
    ],
    relatedTools: ["date-difference-calculator", "age-calculator", "cron-expression-parser"],
  },
  {
    id: "text-diff-checker",
    slug: "text-diff-checker",
    name: "Text Diff Checker",
    category: "developer",
    featured: true,
    description: "Compare two texts side by side and see the differences highlighted. Line-by-line diff with additions in green and deletions in red. Supports case-insensitive and whitespace-ignoring comparison.",
    shortDescription: "Compare and diff two texts",
    icon: "📊",
    seo: {
      title: "Text Diff Checker - Compare Text Online",
      description: "Free online text diff checker. Compare two texts side by side with highlighted additions and deletions. Supports ignore case and whitespace. 100% client-side.",
      keywords: ["text diff", "text compare", "diff checker", "compare text online", "text difference", "file compare", "online diff tool"],
    },
    faq: [
      {
        question: "What diff algorithm does this tool use?",
        answer: "This tool uses a Longest Common Subsequence (LCS) based diff algorithm, similar to what Git uses. It finds the optimal set of additions and deletions to transform one text into another.",
      },
      {
        question: "Is my data safe?",
        answer: "Yes. All comparison happens entirely in your browser. Your text is never sent to any server or stored anywhere. This tool works offline after loading.",
      },
    ],
    relatedTools: ["word-counter", "remove-extra-spaces", "duplicate-line-remover"],
  },
  {
    id: "sql-formatter",
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "developer",
    featured: true,
    description: "Format and beautify SQL queries with proper indentation. Supports SELECT, INSERT, UPDATE, DELETE, JOINs, and subqueries. Minify mode compresses SQL to a single line. Uppercase keyword option.",
    shortDescription: "Format and beautify SQL queries",
    icon: "🗄️",
    seo: {
      title: "SQL Formatter - Beautify SQL Online",
      description: "Free online SQL formatter and beautifier. Format SQL queries with proper indentation and keyword casing. Supports MySQL, PostgreSQL, SQLite. 100% client-side.",
      keywords: ["sql formatter", "sql beautifier", "format sql", "sql formatter online", "sql pretty print", "sql minifier", "beautify sql query"],
    },
    faq: [
      {
        question: "Which SQL dialects are supported?",
        answer: "This formatter works with standard ANSI SQL and is compatible with MySQL, PostgreSQL, SQLite, SQL Server, and Oracle. It formats based on common keywords and structure.",
      },
      {
        question: "Does this validate SQL syntax?",
        answer: "No, this is a formatting tool, not a validator. It reformats your SQL for readability but does not check whether the query is syntactically correct.",
      },
      {
        question: "Are my queries safe?",
        answer: "Yes. All formatting happens in your browser. Your SQL queries are never sent to any server, logged, or stored.",
      },
    ],
    relatedTools: ["json-formatter-viewer", "html-formatter", "css-formatter", "text-diff-checker"],
  },

  // ==================== SECURITY & ENCODING TOOLS (6) ====================
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
    relatedTools: ["hash-generator", "url-encoder-decoder", "base-number-converter"],
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
  {
    id: "hash-generator-checker",
    slug: "hash-generator-checker",
    name: "MD5/SHA Hash Generator & Checker",
    category: "security-encoding",
    featured: true,
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text, or verify a hash against input text. Perfect for file integrity checks, checksums, and hash comparison. All hashing happens in your browser.",
    shortDescription: "Generate and verify MD5/SHA hashes",
    icon: "🔒",
    seo: {
      title: "MD5 & SHA Hash Generator - Verify Hashes",
      description: "Free online hash generator and checker. Generate MD5, SHA-1, SHA-256, SHA-512 hashes and verify hashes instantly. 100% client-side, no data sent to servers.",
      keywords: ["md5 hash generator", "sha256 hash checker", "hash verify online", "md5 checksum", "sha hash generator", "hash checker"],
    },
    faq: [
      {
        question: "What is the difference between hashing and encryption?",
        answer: "Hashing is a one-way function — you cannot reverse a hash to get the original data. Encryption is two-way — you can decrypt with the correct key. Hashing is used for data integrity and password verification, while encryption protects data confidentiality.",
      },
      {
        question: "Which hash algorithm should I use?",
        answer: "SHA-256 is recommended for general purposes. MD5 is cryptographically broken and should only be used for non-security checksums. SHA-512 provides the highest security. For password hashing, use bcrypt or Argon2 instead.",
      },
    ],
    relatedTools: ["aes-encryption-decryption", "base64-encoder-decoder", "password-generator"],
  },
  {
    id: "aes-encryption-decryption",
    slug: "aes-encryption-decryption",
    name: "AES Encryption / Decryption",
    category: "security-encoding",
    featured: true,
    description: "Encrypt and decrypt text using AES-256-GCM with PBKDF2 key derivation. Enter a passphrase to encrypt sensitive text or decrypt ciphertext. All processing happens in your browser using the Web Crypto API.",
    shortDescription: "Encrypt and decrypt text with AES-256",
    icon: "🛡️",
    seo: {
      title: "AES Encrypt & Decrypt Text - Free Tool",
      description: "Free online AES-256-GCM encryption and decryption tool. Encrypt text with a passphrase using PBKDF2 key derivation. 100% client-side, no data sent to servers.",
      keywords: ["aes encryption online", "encrypt text online", "aes decrypt", "online encryption tool", "aes-256 encryption", "text encryption"],
    },
    faq: [
      {
        question: "What is AES encryption?",
        answer: "AES (Advanced Encryption Standard) is a symmetric encryption algorithm used worldwide. AES-256 uses a 256-bit key for extremely strong security. GCM mode adds authenticated encryption for both confidentiality and integrity.",
      },
      {
        question: "What happens if I lose my passphrase?",
        answer: "The encrypted data cannot be recovered without the correct passphrase. AES-256 is designed to be unbreakable without the key. Always store your passphrase securely.",
      },
    ],
    relatedTools: ["hash-generator-checker", "base64-encoder-decoder", "password-generator"],
  },
  {
    id: "hex-text-converter",
    slug: "hex-text-converter",
    name: "Hex-Text Converter",
    category: "security-encoding",
    featured: true,
    description: "Convert text to hexadecimal and hex to text instantly. Supports UTF-8 encoding with configurable separators and case options. Perfect for debugging, network analysis, and data encoding.",
    shortDescription: "Convert between hex and text",
    icon: "🔢",
    seo: {
      title: "Hex Text Converter - Encode & Decode Hex",
      description: "Free online hex to text and text to hex converter. Supports UTF-8 with configurable separators and case options. No data sent to servers, works in your browser.",
      keywords: ["hex to text converter", "text to hex", "hexadecimal converter", "hex decoder", "hex encoder", "hex string converter"],
    },
    faq: [
      {
        question: "What is hexadecimal encoding?",
        answer: "Hexadecimal (base-16) uses digits 0-9 and letters A-F to represent values. Each hex digit represents 4 bits, so two hex digits represent one byte. It's a compact way to represent binary data.",
      },
      {
        question: "What is the difference between hex and Base64?",
        answer: "Both represent binary data as text. Hex uses 16 characters and doubles the size. Base64 uses 64 characters and increases size by ~33%. Base64 is more space-efficient, while hex is more human-readable.",
      },
    ],
    relatedTools: ["base64-encoder-decoder", "base-number-converter", "url-encoder-decoder"],
  },
  {
    id: "morse-code-translator",
    slug: "morse-code-translator",
    name: "Morse Code Translator",
    category: "security-encoding",
    featured: true,
    description: "Convert text to Morse code and Morse code to text. Supports ITU Morse code standard with letters, numbers, and punctuation. Listen to Morse code audio playback using the Web Audio API.",
    shortDescription: "Translate text to Morse code and back",
    icon: "📡",
    seo: {
      title: "Morse Code Translator - Encode & Decode",
      description: "Free Morse code translator for converting text to Morse and Morse to text. Supports audio playback and ITU standard. No signup required, works in your browser.",
      keywords: ["morse code translator", "text to morse code", "morse decoder", "morse code converter", "morse code audio", "morse code generator"],
    },
    faq: [
      {
        question: "What is Morse code?",
        answer: "Morse code represents letters and numbers as sequences of dots (short signals) and dashes (long signals). Invented in the 1830s for telegraph communication, the International (ITU) standard is still used today.",
      },
      {
        question: "Is Morse code still used today?",
        answer: "Yes. While no longer required commercially, Morse code is used by amateur radio operators, in aviation navigation aids, for accessibility devices, and as a hobby.",
      },
    ],
    relatedTools: ["base64-encoder-decoder", "hex-text-converter", "url-encoder-decoder"],
  },

  // ==================== DATA CONVERSION TOOLS (2) ====================
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
    relatedTools: ["json-formatter-viewer", "regex-tester", "base64-encoder-decoder"],
  },
  {
    id: "json-xml-converter",
    slug: "json-xml-converter",
    name: "JSON to XML Converter",
    category: "data-conversion",
    featured: true,
    description: "Convert JSON to XML and XML to JSON instantly. Supports nested objects, arrays, attributes, and custom root element names. Well-formatted output with proper indentation.",
    shortDescription: "Convert between JSON and XML",
    icon: "🔄",
    seo: {
      title: "JSON to XML Converter - Free Online",
      description: "Free JSON to XML and XML to JSON converter. Transform data formats instantly with proper formatting. Supports nested objects, arrays, and attributes. 100% client-side.",
      keywords: ["json to xml", "xml to json", "json xml converter", "convert json to xml", "xml converter", "json converter online", "data format converter"],
    },
    faq: [
      {
        question: "How are JSON arrays converted to XML?",
        answer: "JSON arrays are converted to repeated XML elements with the same tag name. When converting back, repeated elements are automatically detected and converted to JSON arrays.",
      },
      {
        question: "How are XML attributes handled?",
        answer: "When converting XML to JSON, attributes are prefixed with @ (e.g., @id). Text content of elements with attributes is stored in #text.",
      },
      {
        question: "Is the conversion lossless?",
        answer: "JSON to XML is generally lossless. XML to JSON may lose comments, processing instructions, and CDATA sections. Data types are heuristically parsed when converting back.",
      },
    ],
    relatedTools: ["json-formatter-viewer", "json-yaml-converter", "csv-json-converter"],
  },

  // ==================== DESIGN & VISUAL TOOLS (8) ====================
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
    relatedTools: ["image-format-converter", "color-picker"],
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
  {
    id: "image-format-converter",
    slug: "image-format-converter",
    name: "Image Format Converter",
    category: "design",
    featured: true,
    description: "Convert images between PNG, JPG, and WebP formats instantly in your browser. Adjust quality settings for optimal file size. All processing happens locally — your images never leave your device.",
    shortDescription: "Convert PNG, JPG, WebP images",
    icon: "🔄",
    seo: {
      title: "Image Format Converter - Free PNG JPG WebP Converter",
      description: "Free online image format converter. Convert between PNG, JPG, and WebP formats instantly. Adjust quality, compare file sizes. 100% client-side, no uploads.",
      keywords: ["image converter", "png to jpg", "jpg to png", "webp converter", "image format converter", "convert image online"],
    },
    relatedTools: ["image-resizer", "color-picker"],
  },
  {
    id: "qr-code-generator",
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "design",
    featured: true,
    description: "Generate QR codes from any text, URL, email, phone number, or WiFi credentials. Customize size, colors, and error correction level. Download as PNG. All processing happens in your browser.",
    shortDescription: "Generate QR codes instantly",
    icon: "📱",
    seo: {
      title: "QR Code Generator - Free Online",
      description: "Free QR code generator. Create QR codes from URLs, text, WiFi, email, and phone numbers. Customize colors and size. Download as PNG. 100% client-side, no data sent to servers.",
      keywords: ["qr code generator", "create qr code", "qr code maker", "free qr code", "qr code creator", "generate qr code online", "wifi qr code"],
    },
    faq: [
      {
        question: "How much data can a QR code hold?",
        answer: "A QR code can store up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 bytes of binary data. The actual capacity depends on the error correction level.",
      },
      {
        question: "Can I customize the colors of my QR code?",
        answer: "Yes, you can customize both the foreground and background colors. Ensure sufficient contrast between the two colors for reliable scanning.",
      },
      {
        question: "Is this QR code generator free?",
        answer: "Yes, this QR code generator is completely free with no limits, no watermarks, and no sign-up required. All QR codes are generated locally in your browser.",
      },
    ],
    relatedTools: ["base64-encoder-decoder", "url-encoder-decoder", "password-generator"],
  },
  {
    id: "image-compressor",
    slug: "image-compressor",
    name: "Image Compressor",
    category: "design",
    featured: true,
    description: "Compress images instantly in your browser. Reduce file size while maintaining quality. Supports JPEG, WebP, and PNG output formats with adjustable quality and optional resizing. All processing happens locally.",
    shortDescription: "Compress images to reduce file size",
    icon: "🗜️",
    seo: {
      title: "Image Compressor - Compress Images Free",
      description: "Free online image compressor. Reduce image file size while keeping quality. Supports JPEG, WebP, PNG with adjustable compression. 100% client-side, no uploads.",
      keywords: ["image compressor", "compress image", "reduce image size", "image optimizer", "compress photo", "image compression online", "optimize images"],
    },
    faq: [
      {
        question: "What quality level should I use?",
        answer: "For web images, 75-80% offers the best balance between file size and quality. For high-quality photos, use 85-90%. Below 60%, compression artifacts become noticeable.",
      },
      {
        question: "Should I use JPEG, WebP, or PNG?",
        answer: "Use WebP for best compression in modern browsers. Use JPEG for maximum compatibility with photos. Use PNG when you need transparency or lossless quality.",
      },
      {
        question: "Are my images safe?",
        answer: "Yes. All compression happens in your browser using the HTML Canvas API. Your images are never sent to any server.",
      },
    ],
    relatedTools: ["image-resizer", "image-format-converter", "qr-code-generator"],
  },

  // ==================== SEO & MARKETING TOOLS (5) ====================
  {
    id: "meta-tag-generator",
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "seo",
    featured: true,
    description: "Generate SEO-optimized meta tags for your website including title, description, keywords, Open Graph, and Twitter Card tags. Copy ready-to-use HTML code for better search engine rankings.",
    shortDescription: "Generate SEO meta tags",
    icon: "🏷️",
    seo: {
      title: "Meta Tag Generator - Free SEO Meta Tags Tool",
      description: "Free meta tag generator for SEO. Create title, description, Open Graph, and Twitter Card tags. Copy HTML code instantly. No signup required.",
      keywords: ["meta tag generator", "seo meta tags", "meta description generator", "open graph generator", "twitter card generator", "html meta tags"],
    },
    faq: [
      {
        question: "What are meta tags and why are they important?",
        answer: "Meta tags are HTML elements that provide information about your webpage to search engines and social media platforms. They affect how your page appears in search results and when shared on social media, impacting click-through rates and SEO.",
      },
      {
        question: "What is the ideal length for meta descriptions?",
        answer: "Meta descriptions should be between 150-160 characters. Google typically displays up to 155-160 characters in search results. Keep it concise but descriptive to encourage clicks.",
      },
      {
        question: "Do I need Open Graph and Twitter Card tags?",
        answer: "Yes, if you want your content to look good when shared on social media. Open Graph tags control how your page appears on Facebook, LinkedIn, and other platforms. Twitter Cards provide similar functionality for Twitter.",
      },
    ],
    relatedTools: ["open-graph-preview", "schema-markup-generator", "robots-txt-generator"],
  },
  {
    id: "open-graph-preview",
    slug: "open-graph-preview",
    name: "Open Graph Preview",
    category: "seo",
    featured: true,
    description: "Preview how your webpage will look when shared on Facebook, Twitter, LinkedIn, and other social media platforms. Test Open Graph and Twitter Card tags before publishing.",
    shortDescription: "Preview social media shares",
    icon: "👁️",
    seo: {
      title: "Open Graph Preview - Social Media Share Preview Tool",
      description: "Free Open Graph preview tool. See how your links appear on Facebook, Twitter, LinkedIn before sharing. Test OG tags and Twitter Cards instantly.",
      keywords: ["open graph preview", "social media preview", "facebook share preview", "twitter card preview", "og tag tester", "linkedin preview"],
    },
    faq: [
      {
        question: "What is Open Graph?",
        answer: "Open Graph is a protocol created by Facebook that allows you to control how your content appears when shared on social media. It includes tags for title, description, image, and more.",
      },
      {
        question: "Why does my shared link look different than expected?",
        answer: "Social platforms cache Open Graph data. If you've recently updated your tags, use Facebook's Sharing Debugger or Twitter's Card Validator to clear the cache and fetch fresh data.",
      },
      {
        question: "What image size should I use for Open Graph?",
        answer: "The recommended size is 1200x630 pixels for optimal display across platforms. Images should be at least 200x200 pixels, and Facebook recommends a 1.91:1 aspect ratio.",
      },
    ],
    relatedTools: ["meta-tag-generator", "schema-markup-generator", "keyword-density-checker"],
  },
  {
    id: "robots-txt-generator",
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "seo",
    featured: true,
    description: "Generate robots.txt files for your website to control search engine crawlers. Easily allow or disallow specific paths, add sitemaps, and set crawl delays for better SEO control.",
    shortDescription: "Create robots.txt files",
    icon: "🤖",
    seo: {
      title: "Robots.txt Generator - Free Online Tool",
      description: "Free robots.txt generator. Create and customize robots.txt files for your website. Control search engine crawlers, add sitemaps, set crawl delays. No signup required.",
      keywords: ["robots.txt generator", "robots txt creator", "robots file generator", "seo robots.txt", "crawl control", "search engine robots"],
    },
    faq: [
      {
        question: "What is robots.txt?",
        answer: "Robots.txt is a text file placed in your website's root directory that tells search engine crawlers which pages or sections they can or cannot access. It helps control crawling and indexing of your site.",
      },
      {
        question: "Where should I place the robots.txt file?",
        answer: "The robots.txt file must be placed in the root directory of your website (e.g., https://example.com/robots.txt). Search engines will only look for it at this specific location.",
      },
      {
        question: "Can robots.txt hide pages from Google?",
        answer: "No, robots.txt only prevents crawling, not indexing. If a page is linked from other indexed pages, it may still appear in search results. Use the 'noindex' meta tag or X-Robots-Tag header to prevent indexing.",
      },
    ],
    relatedTools: ["meta-tag-generator", "schema-markup-generator", "keyword-density-checker"],
  },
  {
    id: "schema-markup-generator",
    slug: "schema-markup-generator",
    name: "Schema Markup Generator",
    category: "seo",
    featured: true,
    description: "Generate JSON-LD structured data markup for rich snippets in search results. Support for Article, Product, FAQ, Organization, Local Business, and more schema types.",
    shortDescription: "Generate JSON-LD schema",
    icon: "📋",
    seo: {
      title: "Schema Markup Generator - Free JSON-LD Tool",
      description: "Free schema markup generator. Create JSON-LD structured data for rich snippets. Support for Article, Product, FAQ, Organization schema types. Copy code instantly.",
      keywords: ["schema markup generator", "json-ld generator", "structured data generator", "rich snippets", "schema.org generator", "seo schema"],
    },
    faq: [
      {
        question: "What is schema markup?",
        answer: "Schema markup is structured data code that helps search engines understand your content better. It can result in rich snippets in search results, such as star ratings, prices, FAQs, and more.",
      },
      {
        question: "Which schema type should I use?",
        answer: "Choose based on your content: Article for blog posts, Product for e-commerce, LocalBusiness for physical stores, Organization for companies, FAQ for question-answer pages, and Recipe for cooking content.",
      },
      {
        question: "Where do I add schema markup?",
        answer: "Add JSON-LD schema markup in the <head> section of your HTML or just before the closing </body> tag. JSON-LD is the recommended format by Google.",
      },
    ],
    relatedTools: ["meta-tag-generator", "open-graph-preview", "robots-txt-generator"],
  },
  {
    id: "keyword-density-checker",
    slug: "keyword-density-checker",
    name: "Keyword Density Checker",
    category: "seo",
    featured: true,
    description: "Analyze keyword density in your content for SEO optimization. Check word frequency, keyword prominence, and get suggestions for better on-page SEO. Supports single and multi-word phrases.",
    shortDescription: "Check keyword density",
    icon: "🔑",
    seo: {
      title: "Keyword Density Checker - Free SEO Tool",
      description: "Free keyword density checker for SEO. Analyze word frequency, check keyword prominence, optimize content. Supports single and multi-word phrases. No signup required.",
      keywords: ["keyword density checker", "keyword analyzer", "seo keyword tool", "word frequency counter", "keyword optimization", "content analysis"],
    },
    faq: [
      {
        question: "What is the ideal keyword density?",
        answer: "There's no perfect number, but generally 1-2% is considered natural. Focus on writing naturally for readers rather than hitting a specific percentage. Keyword stuffing (over 3%) can hurt your rankings.",
      },
      {
        question: "Does keyword density still matter for SEO?",
        answer: "Modern search engines focus more on content quality and user intent than exact keyword density. However, it's still useful to ensure your target keywords appear naturally throughout your content.",
      },
      {
        question: "What is keyword prominence?",
        answer: "Keyword prominence refers to where keywords appear in your content. Keywords in titles, headings, first paragraph, and meta descriptions carry more weight than those buried in the middle of content.",
      },
    ],
    relatedTools: ["meta-tag-generator", "open-graph-preview", "schema-markup-generator"],
  },

  // ==================== UNIT CONVERTERS (5) ====================
  {
    id: "length-converter",
    slug: "length-converter",
    name: "Length Converter",
    category: "unit-converters",
    featured: true,
    description: "Convert between length and distance units including meters, feet, inches, centimeters, kilometers, miles, yards, and more. Instant, accurate conversions.",
    shortDescription: "Convert length and distance units",
    icon: "📏",
    seo: {
      title: "Length Converter - Free Unit Conversion Tool",
      description: "Free length converter. Convert meters, feet, inches, cm, km, miles instantly. Accurate unit conversion calculator. No signup required.",
      keywords: ["length converter", "distance converter", "meters to feet", "inches to cm", "km to miles", "unit converter"],
    },
    faq: [
      {
        question: "How many centimeters are in an inch?",
        answer: "There are exactly 2.54 centimeters in one inch. This is the internationally accepted conversion factor.",
      },
      {
        question: "How do I convert kilometers to miles?",
        answer: "Multiply the number of kilometers by 0.621371 to get miles. For example, 10 km = 6.21 miles.",
      },
    ],
    relatedTools: ["weight-converter", "speed-converter", "temperature-converter"],
  },
  {
    id: "weight-converter",
    slug: "weight-converter",
    name: "Weight Converter",
    category: "unit-converters",
    featured: true,
    description: "Convert between weight and mass units including kilograms, pounds, ounces, grams, stones, and tons. Quick and accurate conversions.",
    shortDescription: "Convert weight and mass units",
    icon: "⚖️",
    seo: {
      title: "Weight Converter - Free Mass Unit Conversion",
      description: "Free weight converter. Convert kg, pounds, ounces, grams, stones instantly. Accurate mass unit calculator. No signup required.",
      keywords: ["weight converter", "mass converter", "kg to lbs", "pounds to kg", "ounces to grams", "unit converter"],
    },
    faq: [
      {
        question: "How many pounds are in a kilogram?",
        answer: "There are approximately 2.20462 pounds in one kilogram.",
      },
      {
        question: "What is a stone in weight?",
        answer: "A stone is a unit of weight equal to 14 pounds (6.35 kg), commonly used in the UK and Ireland for body weight.",
      },
    ],
    relatedTools: ["length-converter", "temperature-converter", "data-storage-converter"],
  },
  {
    id: "temperature-converter",
    slug: "temperature-converter",
    name: "Temperature Converter",
    category: "unit-converters",
    featured: true,
    description: "Convert temperatures between Celsius, Fahrenheit, and Kelvin. Includes common temperature reference points and formulas.",
    shortDescription: "Convert temperature units",
    icon: "🌡️",
    seo: {
      title: "Temperature Converter - Celsius Fahrenheit Kelvin",
      description: "Free temperature converter. Convert Celsius, Fahrenheit, and Kelvin instantly. Accurate temperature conversion calculator. No signup required.",
      keywords: ["temperature converter", "celsius to fahrenheit", "fahrenheit to celsius", "kelvin converter", "temperature calculator"],
    },
    faq: [
      {
        question: "What is the formula to convert Celsius to Fahrenheit?",
        answer: "Multiply Celsius by 9/5 (or 1.8) and add 32. Formula: °F = (°C × 9/5) + 32",
      },
      {
        question: "What is absolute zero?",
        answer: "Absolute zero is 0 Kelvin, -273.15°C, or -459.67°F. It's the lowest possible temperature where all molecular motion stops.",
      },
    ],
    relatedTools: ["length-converter", "weight-converter", "speed-converter"],
  },
  {
    id: "data-storage-converter",
    slug: "data-storage-converter",
    name: "Data Storage Converter",
    category: "unit-converters",
    featured: true,
    description: "Convert between digital storage units: bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes. Supports both binary (1024) and decimal (1000) standards.",
    shortDescription: "Convert bytes, KB, MB, GB, TB",
    icon: "💾",
    seo: {
      title: "Data Storage Converter - Bytes KB MB GB TB",
      description: "Free data storage converter. Convert bytes, KB, MB, GB, TB, PB instantly. Supports binary and decimal standards. No signup required.",
      keywords: ["data storage converter", "bytes to mb", "gb to tb", "file size converter", "storage calculator", "mb to gb"],
    },
    faq: [
      {
        question: "What's the difference between MB and MiB?",
        answer: "MB (megabyte) uses decimal: 1 MB = 1,000,000 bytes. MiB (mebibyte) uses binary: 1 MiB = 1,048,576 bytes. Storage manufacturers use decimal; operating systems often use binary.",
      },
      {
        question: "How many GB are in a TB?",
        answer: "In decimal: 1 TB = 1,000 GB. In binary: 1 TiB = 1,024 GiB.",
      },
    ],
    relatedTools: ["length-converter", "weight-converter", "speed-converter"],
  },
  {
    id: "speed-converter",
    slug: "speed-converter",
    name: "Speed Converter",
    category: "unit-converters",
    featured: true,
    description: "Convert between speed units including mph, km/h, m/s, knots, and feet per second. Perfect for travel, sports, and science calculations.",
    shortDescription: "Convert speed and velocity units",
    icon: "🚀",
    seo: {
      title: "Speed Converter - MPH KM/H M/S Knots",
      description: "Free speed converter. Convert mph, km/h, m/s, knots, fps instantly. Accurate velocity unit calculator. No signup required.",
      keywords: ["speed converter", "mph to kmh", "km/h to mph", "knots converter", "velocity converter", "m/s converter"],
    },
    faq: [
      {
        question: "How do I convert mph to km/h?",
        answer: "Multiply mph by 1.60934 to get km/h. For example, 60 mph = 96.56 km/h.",
      },
      {
        question: "What is a knot?",
        answer: "A knot is a unit of speed equal to one nautical mile per hour, approximately 1.15 mph or 1.85 km/h. It's used in maritime and aviation contexts.",
      },
    ],
    relatedTools: ["length-converter", "temperature-converter", "data-storage-converter"],
  },

  // ==================== SOCIAL MEDIA TOOLS (4) ====================
  {
    id: "hashtag-generator",
    slug: "hashtag-generator",
    name: "Hashtag Generator",
    category: "social-media",
    featured: true,
    description: "Generate relevant hashtags for Instagram, Twitter, TikTok, and LinkedIn. Get popular and niche hashtags based on your topic to increase reach and engagement.",
    shortDescription: "Generate social media hashtags",
    icon: "#️⃣",
    seo: {
      title: "Hashtag Generator - Free Instagram Twitter TikTok",
      description: "Free hashtag generator for Instagram, Twitter, TikTok, LinkedIn. Generate relevant hashtags to boost engagement. No signup required.",
      keywords: ["hashtag generator", "instagram hashtags", "twitter hashtags", "tiktok hashtags", "trending hashtags", "social media hashtags"],
    },
    faq: [
      {
        question: "How many hashtags should I use?",
        answer: "Instagram allows up to 30 hashtags (5-15 recommended). Twitter works best with 1-2. TikTok allows up to 100 characters of hashtags. LinkedIn recommends 3-5 hashtags.",
      },
      {
        question: "Should I use popular or niche hashtags?",
        answer: "Use a mix of both. Popular hashtags have more reach but more competition. Niche hashtags have less competition and more targeted audiences. A ratio of 30% popular, 70% niche often works well.",
      },
    ],
    relatedTools: ["social-media-character-counter", "youtube-timestamp-generator", "lorem-ipsum-generator"],
  },
  {
    id: "social-media-character-counter",
    slug: "social-media-character-counter",
    name: "Social Media Character Counter",
    category: "social-media",
    featured: true,
    description: "Count characters for Twitter/X, Instagram, Facebook, LinkedIn, YouTube, and TikTok. See limits for posts, bios, and descriptions across all platforms.",
    shortDescription: "Count characters for social posts",
    icon: "📊",
    seo: {
      title: "Social Media Character Counter - Twitter Instagram LinkedIn",
      description: "Free character counter for social media. Check limits for Twitter, Instagram, Facebook, LinkedIn, YouTube. Real-time counting. No signup required.",
      keywords: ["character counter", "twitter character limit", "instagram caption length", "social media limits", "post length checker"],
    },
    faq: [
      {
        question: "What is Twitter's character limit?",
        answer: "Twitter/X allows 280 characters for regular tweets. Twitter Blue/Premium subscribers can post up to 25,000 characters.",
      },
      {
        question: "What's the Instagram caption limit?",
        answer: "Instagram captions can be up to 2,200 characters, but only the first 125 characters show before 'more'. Instagram bio limit is 150 characters.",
      },
    ],
    relatedTools: ["hashtag-generator", "word-counter", "twitter-thread-maker"],
  },
  {
    id: "youtube-timestamp-generator",
    slug: "youtube-timestamp-generator",
    name: "YouTube Timestamp Generator",
    category: "social-media",
    featured: true,
    description: "Create timestamped links to specific moments in YouTube videos. Generate formatted timestamps for video chapters and descriptions.",
    shortDescription: "Create YouTube video timestamps",
    icon: "🎬",
    seo: {
      title: "YouTube Timestamp Generator - Create Video Chapters",
      description: "Free YouTube timestamp generator. Create links to specific video moments and generate formatted chapter timestamps. No signup required.",
      keywords: ["youtube timestamp", "video timestamp generator", "youtube chapters", "youtube time link", "video chapter maker"],
    },
    faq: [
      {
        question: "How do YouTube timestamps work?",
        answer: "Add ?t=XXs or &t=XXs to a YouTube URL, where XX is seconds. For example, ?t=90s starts at 1:30. You can also use ?t=1m30s format.",
      },
      {
        question: "How do I add chapters to YouTube videos?",
        answer: "Add timestamps in your video description starting from 0:00. Each timestamp needs a title. YouTube automatically creates chapters if you have at least 3 timestamps, each at least 10 seconds apart.",
      },
    ],
    relatedTools: ["hashtag-generator", "social-media-character-counter", "unix-timestamp-converter"],
  },
  {
    id: "twitter-thread-maker",
    slug: "twitter-thread-maker",
    name: "Twitter Thread Maker",
    category: "social-media",
    featured: true,
    description: "Split long text into Twitter/X threads with proper character counts. Automatically numbers tweets and ensures clean breaks at sentence boundaries.",
    shortDescription: "Create Twitter/X threads",
    icon: "🧵",
    seo: {
      title: "Twitter Thread Maker - Split Text into Tweets",
      description: "Free Twitter thread maker. Split long text into tweet-sized chunks. Auto-numbering and smart text splitting. No signup required.",
      keywords: ["twitter thread maker", "tweet splitter", "thread generator", "twitter thread creator", "split text into tweets"],
    },
    faq: [
      {
        question: "What's the best length for a Twitter thread?",
        answer: "Most engaging threads are 3-10 tweets. Longer threads (15-25 tweets) work well for educational content. Very long threads may lose reader attention.",
      },
      {
        question: "Should I number my tweets?",
        answer: "Yes, numbering helps readers follow along and know how much is left. Common formats: 1/, 1/10, or [1/10].",
      },
    ],
    relatedTools: ["social-media-character-counter", "hashtag-generator", "text-case-converter"],
  },

  // ==================== ADDITIONAL WRITING TOOLS (2) ====================
  {
    id: "slug-generator",
    slug: "slug-generator",
    name: "URL Slug Generator",
    category: "writing",
    featured: true,
    description: "Convert text into URL-friendly slugs. Removes special characters, converts spaces to hyphens, and creates SEO-friendly URLs for your blog posts and pages.",
    shortDescription: "Generate URL-friendly slugs",
    icon: "🔗",
    seo: {
      title: "URL Slug Generator - Create SEO-Friendly URLs",
      description: "Free URL slug generator. Convert titles to URL-friendly slugs. Remove special characters, lowercase, hyphenate. Perfect for blogs and CMS. No signup required.",
      keywords: ["slug generator", "url slug", "seo url", "permalink generator", "url friendly text", "slug maker"],
    },
    faq: [
      {
        question: "What is a URL slug?",
        answer: "A URL slug is the part of a URL that identifies a specific page in human-readable form. For example, in 'example.com/blog/my-first-post', 'my-first-post' is the slug.",
      },
      {
        question: "Why are slugs important for SEO?",
        answer: "SEO-friendly slugs help search engines understand page content, improve click-through rates by being readable, and can include target keywords for better rankings.",
      },
    ],
    relatedTools: ["text-case-converter", "remove-extra-spaces", "meta-tag-generator"],
  },
  {
    id: "text-reverser",
    slug: "text-reverser",
    name: "Text Reverser",
    category: "writing",
    description: "Reverse text, words, or lines. Create mirror text, backwards text, or flip the order of words and sentences. Fun and useful for various applications.",
    shortDescription: "Reverse text and words",
    icon: "🔄",
    seo: {
      title: "Text Reverser - Reverse Words and Letters Online",
      description: "Free text reverser tool. Reverse letters, words, or lines of text instantly. Create backwards text and mirror text. No signup required.",
      keywords: ["text reverser", "reverse text", "backwards text", "mirror text", "reverse words", "flip text"],
    },
    relatedTools: ["text-case-converter", "slug-generator", "lorem-ipsum-generator"],
  },

  // ==================== ADDITIONAL DEVELOPER TOOLS (3) ====================
  {
    id: "css-minifier",
    slug: "css-minifier",
    name: "CSS Minifier",
    category: "developer",
    featured: true,
    description: "Minify CSS code by removing whitespace, comments, and unnecessary characters. Reduce file size for faster page loads while preserving functionality.",
    shortDescription: "Minify and compress CSS",
    icon: "🎨",
    seo: {
      title: "CSS Minifier - Compress CSS Online Free",
      description: "Free CSS minifier. Compress CSS code by removing whitespace and comments. Reduce file size for faster loading. No signup required.",
      keywords: ["css minifier", "minify css", "css compressor", "compress css", "css optimizer", "reduce css size"],
    },
    faq: [
      {
        question: "What does CSS minification do?",
        answer: "Minification removes unnecessary characters (whitespace, comments, newlines) from CSS without changing functionality. This reduces file size by 10-30%, improving page load times.",
      },
      {
        question: "Should I minify CSS for production?",
        answer: "Yes, always minify CSS for production websites. Keep the original formatted version for development. Most build tools can automate this process.",
      },
    ],
    relatedTools: ["javascript-minifier", "html-minifier", "css-formatter"],
  },
  {
    id: "javascript-minifier",
    slug: "javascript-minifier",
    name: "JavaScript Minifier",
    category: "developer",
    featured: true,
    description: "Minify JavaScript code to reduce file size. Removes whitespace, shortens variable names, and optimizes code for faster page loads.",
    shortDescription: "Minify and compress JavaScript",
    icon: "📜",
    seo: {
      title: "JavaScript Minifier - Compress JS Online Free",
      description: "Free JavaScript minifier. Compress JS code to reduce file size and improve loading speed. No signup required.",
      keywords: ["javascript minifier", "minify js", "js compressor", "compress javascript", "js optimizer", "uglify js"],
    },
    faq: [
      {
        question: "Is minified JavaScript harder to debug?",
        answer: "Yes, minified code is difficult to read. Use source maps in development to map minified code back to original source. Keep unminified versions for debugging.",
      },
      {
        question: "How much can minification reduce file size?",
        answer: "JavaScript minification typically reduces file size by 20-50%. Combined with gzip compression, total reduction can reach 70-80%.",
      },
    ],
    relatedTools: ["css-minifier", "html-minifier", "json-formatter-viewer"],
  },
  {
    id: "html-minifier",
    slug: "html-minifier",
    name: "HTML Minifier",
    category: "developer",
    description: "Minify HTML code by removing whitespace, comments, and optional tags. Reduce page size for faster loading while maintaining valid markup.",
    shortDescription: "Minify and compress HTML",
    icon: "📄",
    seo: {
      title: "HTML Minifier - Compress HTML Online Free",
      description: "Free HTML minifier. Compress HTML by removing whitespace and comments. Reduce page size for faster loading. No signup required.",
      keywords: ["html minifier", "minify html", "html compressor", "compress html", "html optimizer", "reduce html size"],
    },
    faq: [
      {
        question: "What gets removed during HTML minification?",
        answer: "HTML minification removes unnecessary whitespace, comments, optional closing tags, redundant attributes, and can inline small CSS/JS. The result is valid HTML that renders identically.",
      },
    ],
    relatedTools: ["css-minifier", "javascript-minifier", "html-formatter"],
  },

  // ==================== ADDITIONAL DESIGN TOOLS (2) ====================
  {
    id: "image-to-base64",
    slug: "image-to-base64",
    name: "Image to Base64 Converter",
    category: "design",
    featured: true,
    description: "Convert images to Base64 encoded strings. Generate data URLs for embedding images directly in HTML, CSS, or JSON without separate file requests.",
    shortDescription: "Convert images to Base64",
    icon: "🖼️",
    seo: {
      title: "Image to Base64 Converter - Encode Images Online",
      description: "Free image to Base64 converter. Convert PNG, JPG, GIF to Base64 data URLs. Embed images in HTML/CSS. No signup required.",
      keywords: ["image to base64", "base64 image encoder", "image to data url", "encode image", "base64 converter", "inline image"],
    },
    faq: [
      {
        question: "When should I use Base64 images?",
        answer: "Use Base64 for small images (under 10KB) like icons, logos, or UI elements. This reduces HTTP requests. For larger images, regular files with proper caching are more efficient.",
      },
      {
        question: "Does Base64 increase file size?",
        answer: "Yes, Base64 encoding increases size by about 33%. However, for small images, eliminating an HTTP request can still improve performance.",
      },
    ],
    relatedTools: ["base64-encoder-decoder", "image-compressor", "image-format-converter"],
  },
  {
    id: "favicon-generator",
    slug: "favicon-generator",
    name: "Favicon Generator",
    category: "design",
    featured: true,
    description: "Generate favicons from images for your website. Create multiple sizes for different devices and browsers, including ICO, PNG, and Apple Touch icons.",
    shortDescription: "Create website favicons",
    icon: "⭐",
    seo: {
      title: "Favicon Generator - Create Website Icons Free",
      description: "Free favicon generator. Create ICO, PNG, and Apple Touch icons from any image. Generate all sizes needed for modern websites. No signup required.",
      keywords: ["favicon generator", "favicon creator", "ico generator", "website icon", "apple touch icon", "favicon maker"],
    },
    faq: [
      {
        question: "What sizes do I need for favicons?",
        answer: "Essential sizes: 16x16, 32x32 (standard), 180x180 (Apple Touch), and 192x192 (Android). For comprehensive support, also include 48x48, 96x96, and 512x512.",
      },
      {
        question: "Should I use ICO or PNG for favicons?",
        answer: "Use both. ICO format (containing 16x16 and 32x32) ensures compatibility with older browsers. PNG files work for modern browsers and mobile devices.",
      },
    ],
    relatedTools: ["image-to-base64", "image-resizer", "qr-code-generator"],
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
  seoContent: string;
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
    seoContent:
      "Whether you're planning a major purchase, managing your monthly budget, or simply need to split a bill with friends, our free online calculators make financial math effortless. These browser-based tools handle everything from loan EMI calculations to compound interest projections, helping you make informed financial decisions without the complexity of spreadsheets or expensive software. Each calculator is designed with simplicity in mind — enter your numbers, get instant results, and understand exactly what you're working with. Unlike many online calculators that require registration or bombard you with ads, our tools are completely free and work entirely in your browser. Your financial data never leaves your device, ensuring complete privacy. From students learning percentages to homeowners calculating mortgage payments, these calculators serve anyone who needs quick, accurate math on the go.",
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
    seoContent:
      "Taking control of your health starts with understanding your body's basic metrics. Our free online health calculators provide instant insights into key measurements like Body Mass Index, Basal Metabolic Rate, and ideal weight ranges — all without requiring an account or sharing personal information with third parties. These browser-based tools are perfect for anyone beginning a fitness journey, tracking progress toward weight goals, or simply curious about health benchmarks. Calculate how much water you should drink daily based on your activity level, estimate calories burned during walks, or find your target heart rate zone for effective workouts. Each tool uses established formulas trusted by health professionals worldwide. While these calculators offer valuable guidance, they're designed to complement — not replace — professional medical advice. Use them as a starting point for conversations with your healthcare provider about your personal health goals.",
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
    seoContent:
      "Every writer, blogger, student, and content creator needs reliable text tools at their fingertips. Our free online writing utilities handle the tedious formatting tasks that slow down your creative process — counting words for essay requirements, converting text between cases, removing duplicate content, and cleaning up messy formatting. These browser-based tools work instantly without installation or signup, making them perfect for quick edits on any device. Whether you're crafting a tweet within character limits, preparing a blog post with specific word counts, or reformatting copied text for a professional document, these tools save valuable time. The word counter shows real-time statistics as you type, while the case converter handles everything from UPPERCASE to Title Case with a single click. All processing happens locally in your browser, so your writing never touches external servers — ideal for sensitive documents or unpublished work you want to keep private.",
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
    seoContent:
      "Time-based calculations come up more often than you might expect — from figuring out exactly how old you are in days to counting business days until a project deadline. Our free online date and time tools handle these calculations instantly, eliminating the mental math and calendar counting that leads to errors. These browser-based calculators are invaluable for project managers tracking timelines, HR professionals calculating employment durations, parents planning milestone celebrations, or anyone curious about the exact time between two dates. Find out what day of the week you were born, calculate working days excluding weekends and holidays, or determine the precise age difference between family members. Each tool provides comprehensive results — not just days, but weeks, months, and years broken down clearly. No signup required, no apps to install, and all calculations happen right in your browser for instant, accurate results.",
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
    seoContent:
      "Managing a household involves countless small calculations that add up to significant savings when done right. Our free online home tools help you estimate costs before committing to purchases, plan DIY projects accurately, and understand where your money goes each month. Calculate exactly how much paint you need for a room renovation, estimate your electricity bill based on appliance usage, or figure out the true cost of your daily commute. These browser-based calculators turn complex estimates into simple inputs — enter your room dimensions, appliance wattages, or travel distances and get accurate results instantly. Perfect for homeowners planning renovations, renters splitting utility costs fairly, or anyone trying to budget household expenses more effectively. No registration required, no apps to download. Just practical tools that work on any device, helping you make smarter decisions about the everyday costs of running a home.",
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
    seoContent:
      "Sometimes the best decision is leaving it to chance. Our free online random generators and decision-making tools add an element of fun to everyday choices while ensuring truly unbiased results. Whether you're picking a restaurant for dinner, choosing who goes first in a game, generating lottery numbers, or settling a friendly debate, these browser-based tools deliver genuinely random outcomes using cryptographic randomization — not predictable patterns. The decision wheel lets you customize options and spin for a winner, while the yes/no spinner settles binary questions instantly. Random number generators support custom ranges for any use case, from classroom activities to raffle drawings. These tools work entirely in your browser with no signup required, making them perfect for classrooms, parties, team meetings, or personal use. Fair, fun, and completely free — let randomness decide when you can't.",
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
    seoContent:
      "Every developer needs a reliable toolkit for common tasks that don't warrant firing up a full IDE. Our free online developer tools handle everyday programming utilities — formatting messy JSON responses, generating secure UUIDs for database records, creating cryptographic hashes for verification, and more. These browser-based tools process everything client-side using JavaScript, meaning your code, API responses, and sensitive data never leave your machine. This makes them safe for working with production data, proprietary code, or any information you'd rather not paste into a random website. Format and validate JSON with syntax highlighting, generate UUID v4 identifiers using cryptographic randomness, or create MD5, SHA-1, and SHA-256 hashes instantly. No accounts, no installation, no tracking. Bookmark these tools and access them from any browser when you need quick utilities without the overhead of heavier solutions.",
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
    seoContent:
      "Working with encoded data and secure credentials requires tools you can trust. Our free online security and encoding utilities handle Base64 conversion, URL encoding, and password generation entirely in your browser — your sensitive data never transmits to any server. This client-side approach is essential when working with authentication tokens, encoded API payloads, or generating passwords for important accounts. Encode text and files to Base64 for embedding in JSON or HTML, decode Base64 strings to inspect their contents, or properly encode URLs with special characters for safe transmission. The password generator creates cryptographically secure passwords using your browser's random number generator, with customizable length and character options. These tools are perfect for developers debugging encoded data, security professionals testing systems, or anyone who needs strong passwords without trusting third-party generators. Completely free, private by design, and available whenever you need them.",
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
    seoContent:
      "Moving data between systems often means converting between formats — and doing it manually is tedious and error-prone. Our free online data conversion tools transform CSV to JSON, JSON to CSV, and other common formats instantly in your browser. Perfect for developers integrating APIs, analysts preparing datasets, or anyone who needs to reformat data without complex software. These browser-based converters handle the parsing automatically, respecting headers, handling special characters, and producing clean output ready for your next system. Unlike server-based converters that upload your files, everything processes locally in your browser. This means you can safely convert sensitive business data, customer information, or proprietary datasets without privacy concerns. Simply paste your data or upload a file, select your output format, and download the converted result. No signup required, no file size restrictions for reasonable datasets, and instant results every time.",
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
    seoContent:
      "Design work requires precise tools for color selection, format conversion, and accessibility testing. Our free online design utilities give you professional-grade capabilities without expensive software subscriptions or complex installations. Pick colors with precision using our color picker that displays HEX, RGB, and HSL values simultaneously. Convert between color formats instantly, create beautiful CSS gradients visually, and test color combinations for WCAG accessibility compliance. For image work, resize photos to exact dimensions or convert between PNG, JPG, and WebP formats — all processing happens locally in your browser, so your images stay private. These browser-based tools are essential for web developers styling interfaces, graphic designers matching brand colors, content creators preparing images for different platforms, or anyone who needs quick visual utilities. No accounts to create, no software to install, and no files uploaded to external servers. Professional design tools, completely free and ready when you need them.",
  },
  seo: {
    title: "Free SEO & Marketing Tools Online",
    description:
      "Free SEO tools for meta tags, Open Graph preview, robots.txt, schema markup, and keyword analysis. Improve your search rankings. No signup required.",
    keywords: [
      "seo tools",
      "meta tag generator",
      "open graph preview",
      "robots.txt generator",
      "schema markup",
      "keyword density",
      "search engine optimization",
    ],
    intro:
      "Boost your website's search rankings with free SEO tools. Generate meta tags, preview social shares, create robots.txt files, add schema markup, and analyze keyword density. All tools run in your browser — fast and private.",
    seoContent:
      "Search engine optimization doesn't require expensive software or agency fees for the fundamentals. Our free online SEO tools give you everything needed to optimize your website's technical SEO and content strategy. Generate perfect meta tags including title, description, Open Graph, and Twitter Card tags with our meta tag generator — then preview exactly how your pages will appear when shared on Facebook, Twitter, and LinkedIn. Create properly formatted robots.txt files to control search engine crawlers, and add JSON-LD schema markup for rich snippets in search results. The keyword density checker helps you analyze your content's keyword usage to ensure natural optimization without over-stuffing. These browser-based tools process everything locally, so your content strategy and website details stay private. Perfect for bloggers optimizing posts, developers building SEO-friendly sites, marketers improving click-through rates, or business owners taking control of their search presence. Professional SEO tools, completely free, with no accounts required.",
  },
  "unit-converters": {
    title: "Free Unit Converter Tools Online",
    description:
      "Free unit converters for length, weight, temperature, data storage, and speed. Instant, accurate conversions. No signup required.",
    keywords: [
      "unit converter",
      "length converter",
      "weight converter",
      "temperature converter",
      "data storage converter",
      "speed converter",
      "measurement converter",
    ],
    intro:
      "Convert between units instantly with our free online converters. Length, weight, temperature, data storage, and speed — all conversions happen in your browser with complete accuracy.",
    seoContent:
      "Unit conversions are a daily necessity for students, professionals, travelers, and anyone working with measurements. Our free online unit converters provide instant, accurate conversions across all common measurement systems. Convert between metric and imperial units for length and distance — meters to feet, kilometers to miles, centimeters to inches. Switch between weight units including kilograms, pounds, ounces, and stones. Temperature conversions between Celsius, Fahrenheit, and Kelvin are essential for cooking, science, and travel. Data storage conversions help you understand file sizes across bytes, kilobytes, megabytes, gigabytes, and terabytes — with support for both binary and decimal standards. Speed conversions cover mph, km/h, meters per second, and knots for automotive, aviation, and scientific applications. All converters process instantly in your browser with no server requests, ensuring your data stays private and conversions are lightning fast. Bookmark these tools for quick access whenever you need accurate unit conversions.",
  },
  "social-media": {
    title: "Free Social Media Tools Online",
    description:
      "Free tools for social media content creation. Hashtag generators, character counters, YouTube timestamps, and thread makers. No signup required.",
    keywords: [
      "social media tools",
      "hashtag generator",
      "character counter",
      "twitter thread",
      "youtube timestamp",
      "instagram tools",
      "content creator tools",
    ],
    intro:
      "Optimize your social media presence with free tools for hashtags, character counts, timestamps, and threads. Create better content for Instagram, Twitter, YouTube, and more — all in your browser.",
    seoContent:
      "Creating engaging social media content requires the right tools. Our free online social media utilities help content creators, marketers, and businesses optimize their posts across all major platforms. Generate relevant hashtags for Instagram, Twitter, TikTok, and LinkedIn to increase your content's reach and discoverability. Check character limits for each platform with our social media character counter — never exceed Twitter's 280 characters or LinkedIn's post limits again. Create timestamped links to specific moments in YouTube videos, perfect for referencing key points or creating video chapters. Split long-form content into perfectly-sized Twitter threads with automatic numbering and smart text breaks. These browser-based tools respect your privacy — your content ideas and social strategy never leave your device. Whether you're a solo creator, social media manager, or marketing team, these utilities streamline your workflow and help you create more effective social content. No accounts required, no limitations, just instant results.",
  },
};

// ============================================================================
// POPULAR TOOLS BY CATEGORY (Curated)
// ============================================================================

export const POPULAR_TOOLS_BY_CATEGORY: Record<string, string[]> = {
  calculators: ["emi-calculator", "percentage-calculator", "discount-calculator", "tip-calculator"],
  health: ["bmi-calculator", "bmr-calculator", "water-intake-calculator", "ideal-weight-calculator"],
  writing: ["word-counter", "text-case-converter", "lorem-ipsum-generator", "remove-extra-spaces", "duplicate-line-remover"],
  "date-time": ["age-calculator", "date-difference-calculator", "day-of-week-finder", "workdays-calculator"],
  home: ["electricity-bill-calculator", "fuel-cost-calculator", "paint-area-calculator", "rent-split-calculator"],
  fun: ["random-number-generator", "decision-wheel", "random-password-generator", "lucky-number-generator", "pomodoro-timer"],
  developer: ["css-formatter", "regex-tester", "jwt-decoder", "html-formatter", "url-parser", "json-formatter-viewer", "uuid-generator", "hash-generator", "base-number-converter", "markdown-previewer", "json-yaml-converter", "cron-expression-parser", "curl-to-http-converter", "unix-timestamp-converter", "text-diff-checker", "sql-formatter"],
  "security-encoding": ["base64-encoder-decoder", "url-encoder-decoder", "password-generator", "hash-generator-checker", "aes-encryption-decryption", "hex-text-converter", "morse-code-translator"],
  "data-conversion": ["csv-json-converter", "json-xml-converter"],
  design: ["color-picker", "contrast-checker", "image-resizer", "image-format-converter", "qr-code-generator", "image-compressor", "image-to-base64", "favicon-generator"],
  seo: ["meta-tag-generator", "open-graph-preview", "robots-txt-generator", "schema-markup-generator", "keyword-density-checker"],
  "unit-converters": ["length-converter", "weight-converter", "temperature-converter", "data-storage-converter", "speed-converter"],
  "social-media": ["hashtag-generator", "social-media-character-counter", "youtube-timestamp-generator", "twitter-thread-maker"],
};

// ============================================================================
// RELATED CATEGORIES (for internal linking)
// ============================================================================

export const RELATED_CATEGORIES: Record<string, string[]> = {
  calculators: ["health", "home", "unit-converters"],
  health: ["calculators", "home", "fun"],
  writing: ["developer", "social-media", "seo"],
  "date-time": ["calculators", "home", "writing"],
  home: ["calculators", "date-time", "unit-converters"],
  fun: ["writing", "social-media", "developer"],
  developer: ["security-encoding", "data-conversion", "design"],
  "security-encoding": ["developer", "data-conversion", "fun"],
  "data-conversion": ["developer", "security-encoding", "writing"],
  design: ["developer", "seo", "social-media"],
  seo: ["developer", "writing", "social-media"],
  "unit-converters": ["calculators", "home", "developer"],
  "social-media": ["seo", "writing", "design"],
};

// ============================================================================
// SUBCATEGORIES (tool groupings within a category page)
// ============================================================================

export interface Subcategory {
  name: string;
  icon: string;
  toolSlugs: string[];
}

export const CATEGORY_SUBCATEGORIES: Record<string, Subcategory[]> = {
  calculators: [
    {
      name: "Financial Calculators",
      icon: "🏦",
      toolSlugs: ["emi-calculator", "simple-interest-calculator", "compound-interest-calculator", "savings-goal-calculator", "loan-eligibility-calculator"],
    },
    {
      name: "Everyday Math",
      icon: "📊",
      toolSlugs: ["percentage-calculator", "discount-calculator", "tip-calculator"],
    },
    {
      name: "Bill & Rent Splitting",
      icon: "🤝",
      toolSlugs: ["split-bill-calculator", "rent-split-calculator"],
    },
  ],
  health: [
    {
      name: "Body Metrics",
      icon: "📏",
      toolSlugs: ["bmi-calculator", "ideal-weight-calculator"],
    },
    {
      name: "Nutrition & Metabolism",
      icon: "🍎",
      toolSlugs: ["bmr-calculator", "water-intake-calculator"],
    },
    {
      name: "Fitness Tracking",
      icon: "🏃",
      toolSlugs: ["step-calorie-converter"],
    },
  ],
  writing: [
    {
      name: "Text Analysis",
      icon: "📈",
      toolSlugs: ["word-counter"],
    },
    {
      name: "Text Transformation",
      icon: "🔤",
      toolSlugs: ["text-case-converter", "remove-extra-spaces", "text-reverser", "slug-generator"],
    },
    {
      name: "Text Generation",
      icon: "📝",
      toolSlugs: ["lorem-ipsum-generator"],
    },
    {
      name: "List Management",
      icon: "📋",
      toolSlugs: ["line-sorter", "duplicate-line-remover"],
    },
  ],
  "date-time": [
    {
      name: "Date Calculators",
      icon: "📆",
      toolSlugs: ["age-calculator", "date-difference-calculator"],
    },
    {
      name: "Calendar Tools",
      icon: "🗓️",
      toolSlugs: ["day-of-week-finder", "workdays-calculator"],
    },
  ],
  home: [
    {
      name: "Energy & Utilities",
      icon: "⚡",
      toolSlugs: ["electricity-bill-calculator", "appliance-energy-calculator"],
    },
    {
      name: "Home Projects",
      icon: "🏠",
      toolSlugs: ["paint-area-calculator"],
    },
    {
      name: "Travel & Transport",
      icon: "🚗",
      toolSlugs: ["fuel-cost-calculator"],
    },
  ],
  fun: [
    {
      name: "Random Generators",
      icon: "🎲",
      toolSlugs: ["random-number-generator", "random-password-generator", "lucky-number-generator"],
    },
    {
      name: "Decision Makers",
      icon: "🎯",
      toolSlugs: ["yes-no-spinner", "decision-wheel"],
    },
    {
      name: "Productivity",
      icon: "🍅",
      toolSlugs: ["pomodoro-timer"],
    },
  ],
  developer: [
    {
      name: "Formatters & Beautifiers",
      icon: "✨",
      toolSlugs: ["json-formatter-viewer", "html-formatter", "css-formatter", "markdown-previewer", "sql-formatter"],
    },
    {
      name: "Minifiers & Compressors",
      icon: "🗜️",
      toolSlugs: ["css-minifier", "javascript-minifier", "html-minifier"],
    },
    {
      name: "Converters & Parsers",
      icon: "🔄",
      toolSlugs: ["json-yaml-converter", "curl-to-http-converter", "url-parser", "base-number-converter", "unix-timestamp-converter"],
    },
    {
      name: "Generators",
      icon: "⚙️",
      toolSlugs: ["uuid-generator", "hash-generator"],
    },
    {
      name: "Testers & Debuggers",
      icon: "🧪",
      toolSlugs: ["regex-tester", "jwt-decoder", "cron-expression-parser", "text-diff-checker"],
    },
  ],
  "data-conversion": [
    {
      name: "Format Converters",
      icon: "🔄",
      toolSlugs: ["csv-json-converter", "json-xml-converter"],
    },
  ],
  "security-encoding": [
    {
      name: "Encoding & Decoding",
      icon: "🔄",
      toolSlugs: ["base64-encoder-decoder", "url-encoder-decoder", "hex-text-converter"],
    },
    {
      name: "Encryption & Hashing",
      icon: "🔐",
      toolSlugs: ["password-generator", "hash-generator-checker", "aes-encryption-decryption"],
    },
    {
      name: "Communication",
      icon: "📡",
      toolSlugs: ["morse-code-translator"],
    },
  ],
  design: [
    {
      name: "Color Tools",
      icon: "🎨",
      toolSlugs: ["color-picker", "gradient-generator", "hex-rgb-converter", "contrast-checker"],
    },
    {
      name: "Image Tools",
      icon: "🖼️",
      toolSlugs: ["image-resizer", "image-format-converter", "image-compressor", "image-to-base64", "favicon-generator"],
    },
    {
      name: "QR & Barcode",
      icon: "📱",
      toolSlugs: ["qr-code-generator"],
    },
  ],
  seo: [
    {
      name: "Meta & Social Tags",
      icon: "🏷️",
      toolSlugs: ["meta-tag-generator", "open-graph-preview"],
    },
    {
      name: "Technical SEO",
      icon: "🤖",
      toolSlugs: ["robots-txt-generator", "schema-markup-generator"],
    },
    {
      name: "Content Analysis",
      icon: "📊",
      toolSlugs: ["keyword-density-checker"],
    },
  ],
  "unit-converters": [
    {
      name: "Length & Distance",
      icon: "📏",
      toolSlugs: ["length-converter", "speed-converter"],
    },
    {
      name: "Mass & Weight",
      icon: "⚖️",
      toolSlugs: ["weight-converter"],
    },
    {
      name: "Temperature & Data",
      icon: "🌡️",
      toolSlugs: ["temperature-converter", "data-storage-converter"],
    },
  ],
  "social-media": [
    {
      name: "Content Creation",
      icon: "✍️",
      toolSlugs: ["hashtag-generator", "twitter-thread-maker"],
    },
    {
      name: "Analytics & Optimization",
      icon: "📊",
      toolSlugs: ["social-media-character-counter", "youtube-timestamp-generator"],
    },
  ],
};

export function getSubcategoriesForCategory(categorySlug: string): Subcategory[] | undefined {
  return CATEGORY_SUBCATEGORIES[categorySlug];
}

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
