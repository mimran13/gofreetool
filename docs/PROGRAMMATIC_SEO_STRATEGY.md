# Programmatic SEO Page Strategy

Scalable page generation for capturing long-tail search traffic.

---

## Overview

### Page Types

| Type | URL Pattern | Generation | Example |
|------|-------------|------------|---------|
| Tool pages | `/tools/[slug]` | Static | `/tools/bmi-calculator` |
| Category pages | `/category/[slug]` | Static | `/category/calculators` |
| Combo pages | `/tools/[from]-to-[to]-converter` | Programmatic | `/tools/kg-to-lbs-converter` |
| Use-case pages | `/[use-case]/[tool]` | Programmatic | `/fitness/bmi-calculator` |
| Location pages | `/tools/[tool]/[location]` | Programmatic | `/tools/tip-calculator/usa` |

### Traffic Potential

```
Tool pages (60)        →  Primary traffic (high intent)
Category pages (10)    →  Discovery traffic (browsing)
Combo pages (100+)     →  Long-tail traffic (specific queries)
Use-case pages (50+)   →  Context traffic (audience-specific)
```

---

## 1. URL Patterns

### Pattern A: Unit Converters

**URL:** `/tools/[from]-to-[to]-converter`

**Examples:**
```
/tools/kg-to-lbs-converter
/tools/celsius-to-fahrenheit-converter
/tools/miles-to-km-converter
/tools/inches-to-cm-converter
```

**Data structure:**
```typescript
interface UnitConversion {
  from: { unit: string; slug: string; symbol: string };
  to: { unit: string; slug: string; symbol: string };
  category: 'weight' | 'length' | 'temperature' | 'volume' | 'area';
  formula: (value: number) => number;
  reverseFormula: (value: number) => number;
}

const CONVERSIONS: UnitConversion[] = [
  {
    from: { unit: 'Kilograms', slug: 'kg', symbol: 'kg' },
    to: { unit: 'Pounds', slug: 'lbs', symbol: 'lb' },
    category: 'weight',
    formula: (kg) => kg * 2.20462,
    reverseFormula: (lbs) => lbs / 2.20462,
  },
  // ... more conversions
];
```

**Generation:**
```typescript
// app/tools/[from]-to-[to]-converter/page.tsx
export async function generateStaticParams() {
  return CONVERSIONS.map(c => ({
    from: c.from.slug,
    to: c.to.slug,
  }));
}
```

### Pattern B: Format Converters

**URL:** `/tools/[format-a]-to-[format-b]-converter`

**Examples:**
```
/tools/csv-to-json-converter
/tools/json-to-xml-converter
/tools/yaml-to-json-converter
/tools/markdown-to-html-converter
```

**Data structure:**
```typescript
interface FormatConversion {
  from: { format: string; slug: string; mime: string };
  to: { format: string; slug: string; mime: string };
  converter: (input: string, options?: object) => string;
  bidirectional: boolean;
}
```

### Pattern C: Calculator Variations

**URL:** `/tools/[type]-[base-tool]`

**Examples:**
```
/tools/home-loan-emi-calculator
/tools/car-loan-emi-calculator
/tools/personal-loan-emi-calculator
/tools/business-loan-emi-calculator
```

**Data structure:**
```typescript
interface CalculatorVariant {
  type: string;
  slug: string;
  baseTool: string;
  defaults: Record<string, number>;
  customFields?: string[];
  seoModifiers: {
    titlePrefix: string;
    descriptionContext: string;
    keywords: string[];
  };
}

const EMI_VARIANTS: CalculatorVariant[] = [
  {
    type: 'Home Loan',
    slug: 'home-loan',
    baseTool: 'emi-calculator',
    defaults: { interestRate: 8.5, tenure: 240 },
    seoModifiers: {
      titlePrefix: 'Home Loan',
      descriptionContext: 'for home loans and mortgages',
      keywords: ['home loan EMI', 'mortgage calculator', 'housing loan'],
    },
  },
  // ... more variants
];
```

### Pattern D: Use-Case Landing Pages

**URL:** `/for/[audience]/[tool]` or `/use-case/[context]`

**Examples:**
```
/for/students/word-counter
/for/developers/json-formatter
/for/writers/reading-time-calculator
/for/freelancers/invoice-calculator
```

**Data structure:**
```typescript
interface UseCasePage {
  audience: string;
  audienceSlug: string;
  tool: string;
  customIntro: string;
  customFAQ: FAQ[];
  relatedTools: string[];
}
```

### Pattern E: Comparison Pages

**URL:** `/compare/[tool-a]-vs-[tool-b]`

**Examples:**
```
/compare/bmi-vs-bmr
/compare/simple-interest-vs-compound-interest
/compare/json-vs-xml
```

---

## 2. Page Content Structure

### Template: Unit Converter Page

```tsx
// app/tools/[from]-to-[to]-converter/page.tsx

export default function UnitConverterPage({ params }) {
  const conversion = getConversion(params.from, params.to);

  return (
    <ToolLayout tool={generatedTool}>
      {/* H1: Dynamic title */}
      <h1>{conversion.from.unit} to {conversion.to.unit} Converter</h1>

      {/* Intro: Programmatic but natural */}
      <p>
        Convert {conversion.from.unit.toLowerCase()} to {conversion.to.unit.toLowerCase()}
        instantly. Enter a value in {conversion.from.symbol} to see the equivalent
        in {conversion.to.symbol}.
      </p>

      {/* Tool interface: Reusable component */}
      <UnitConverterTool conversion={conversion} />

      {/* Conversion table: Unique content */}
      <ConversionTable conversion={conversion} values={COMMON_VALUES} />

      {/* Formula explanation: Educational content */}
      <FormulaExplanation conversion={conversion} />

      {/* Related conversions: Internal linking */}
      <RelatedConversions category={conversion.category} current={conversion} />
    </ToolLayout>
  );
}
```

### Content Blocks for Programmatic Pages

**1. Dynamic intro (required):**
```typescript
const generateIntro = (conversion: UnitConversion): string => {
  return `Convert ${conversion.from.unit} (${conversion.from.symbol}) to
          ${conversion.to.unit} (${conversion.to.symbol}) instantly with our
          free online converter. Simply enter your value and get accurate
          results in real-time.`;
};
```

**2. Conversion table (unique content):**
```tsx
<section>
  <h2>Common {from.unit} to {to.unit} Conversions</h2>
  <table>
    <thead>
      <tr><th>{from.symbol}</th><th>{to.symbol}</th></tr>
    </thead>
    <tbody>
      {COMMON_VALUES.map(value => (
        <tr key={value}>
          <td>{value} {from.symbol}</td>
          <td>{formula(value).toFixed(2)} {to.symbol}</td>
        </tr>
      ))}
    </tbody>
  </table>
</section>
```

**3. Formula section (educational):**
```tsx
<section>
  <h2>How to Convert {from.unit} to {to.unit}</h2>
  <p>The formula to convert {from.unit} to {to.unit} is:</p>
  <code>{to.symbol} = {from.symbol} × {conversionFactor}</code>
  <p>For example, to convert 5 {from.symbol} to {to.symbol}:</p>
  <code>5 × {conversionFactor} = {(5 * conversionFactor).toFixed(2)} {to.symbol}</code>
</section>
```

**4. Reverse converter link (internal linking):**
```tsx
<p>
  Need to convert the other way? Use our{' '}
  <Link href={`/tools/${to.slug}-to-${from.slug}-converter`}>
    {to.unit} to {from.unit} converter
  </Link>.
</p>
```

### Minimum Unique Content Per Page

| Element | Minimum | Purpose |
|---------|---------|---------|
| Title | Unique | Primary keyword targeting |
| Meta description | Unique | Click-through rate |
| H1 | Unique | On-page relevance |
| Intro paragraph | 40+ words | Context setting |
| Data table | 10+ rows | Unique valuable content |
| Formula/explanation | 50+ words | Educational value |
| FAQ | 2+ questions | Long-tail keywords |

---

## 3. Canonical and Duplicate Handling

### Canonical Rules

**Rule 1: One canonical per page**
```tsx
// Every programmatic page must declare canonical
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://gofreetool.com/tools/${params.from}-to-${params.to}-converter`,
    },
  };
}
```

**Rule 2: Bidirectional converters**
```
/tools/kg-to-lbs-converter  →  canonical: self
/tools/lbs-to-kg-converter  →  canonical: self (different page, different intent)
```
Both are valid—users search for both directions.

**Rule 3: Variant pages point to base when thin**
```
If variant page has < 100 words unique content:
  canonical → base tool page

If variant page has substantial unique content:
  canonical → self
```

### Duplicate Detection

**Check before generating:**
```typescript
function shouldGeneratePage(page: ProgrammaticPage): boolean {
  // Check 1: Sufficient search volume
  if (page.estimatedSearchVolume < 100) return false;

  // Check 2: Not duplicate of existing page
  if (isDuplicateIntent(page)) return false;

  // Check 3: Can generate unique content
  if (!canGenerateUniqueContent(page)) return false;

  return true;
}

function isDuplicateIntent(page: ProgrammaticPage): boolean {
  // "kg to lbs" and "kilograms to pounds" are same intent
  const normalizedSlug = normalizeSlug(page.slug);
  return existingSlugs.has(normalizedSlug);
}
```

### Handling Similar Pages

**Scenario: Multiple ways to express same conversion**

```
User searches: "kg to lbs", "kilograms to pounds", "kilo to pound"
```

**Solution: One page, multiple keywords**
```typescript
{
  slug: 'kg-to-lbs-converter',
  keywords: [
    'kg to lbs',
    'kilograms to pounds',
    'kilo to pound',
    'convert kg to lbs',
  ],
}
```

**Don't create:**
```
/tools/kg-to-lbs-converter
/tools/kilograms-to-pounds-converter  ← duplicate intent
/tools/kilo-to-pound-converter        ← duplicate intent
```

### Redirect Strategy

```typescript
// next.config.js
const redirects = async () => [
  // Synonym redirects
  {
    source: '/tools/kilograms-to-pounds-converter',
    destination: '/tools/kg-to-lbs-converter',
    permanent: true,
  },
  // Old URL redirects
  {
    source: '/converters/kg-lbs',
    destination: '/tools/kg-to-lbs-converter',
    permanent: true,
  },
];
```

---

## 4. When NOT to Create a Page

### Hard Rules (Never Create)

| Condition | Example | Reason |
|-----------|---------|--------|
| < 50 monthly searches | "decameters to hectometers" | No traffic potential |
| Duplicate intent exists | "kgs to pounds" when "kg to lbs" exists | Cannibalization |
| Cannot generate unique content | Generic placeholder page | Thin content penalty |
| No conversion possible | "json to mp3" | Nonsensical |
| Covered by base tool | "calculate 5% of 100" | Use query parameters |

### Soft Rules (Evaluate Case-by-Case)

| Condition | Evaluate | Create If |
|-----------|----------|-----------|
| 50-200 monthly searches | Competition, difficulty | KD < 20 and no strong competitor |
| Similar to existing page | Content differentiation | Can add 200+ unique words |
| Highly specific variant | User intent | Clear distinct use case |
| Seasonal topic | Evergreen potential | Can rank year-round |

### Decision Framework

```typescript
function evaluatePage(candidate: PageCandidate): 'create' | 'skip' | 'redirect' {
  // Hard fails
  if (candidate.searchVolume < 50) return 'skip';
  if (candidate.duplicateOf) return 'redirect';
  if (!candidate.canGenerateContent) return 'skip';

  // Soft evaluation
  const score =
    (candidate.searchVolume / 1000) * 0.4 +
    (1 - candidate.keywordDifficulty / 100) * 0.3 +
    (candidate.uniqueContentScore / 100) * 0.3;

  if (score >= 0.5) return 'create';
  if (candidate.duplicateOf) return 'redirect';
  return 'skip';
}
```

### Content Quality Threshold

**Minimum requirements for programmatic page:**

```typescript
interface ContentRequirements {
  uniqueWords: number;      // >= 150
  uniqueSections: number;   // >= 2
  dataPoints: number;       // >= 5 (table rows, examples)
  internalLinks: number;    // >= 3
  externalValue: boolean;   // Answers a real question
}

function meetsQualityThreshold(page: GeneratedPage): boolean {
  return (
    page.uniqueWords >= 150 &&
    page.uniqueSections >= 2 &&
    page.dataPoints >= 5 &&
    page.internalLinks >= 3 &&
    page.answersRealQuestion
  );
}
```

---

## 5. Implementation in Next.js

### File Structure

```
app/
├── tools/
│   ├── [slug]/
│   │   └── page.tsx                    # Individual tools
│   ├── [from]-to-[to]-converter/
│   │   └── page.tsx                    # Unit converters
│   └── [type]-[base]-calculator/
│       └── page.tsx                    # Calculator variants
├── category/
│   └── [slug]/
│       └── page.tsx                    # Category pages
├── for/
│   └── [audience]/
│       └── [tool]/
│           └── page.tsx                # Use-case pages
└── compare/
    └── [toolA]-vs-[toolB]/
        └── page.tsx                    # Comparison pages
```

### Static Generation

```typescript
// app/tools/[from]-to-[to]-converter/page.tsx

import { UNIT_CONVERSIONS } from '@/lib/conversions';

// Generate all pages at build time
export async function generateStaticParams() {
  return UNIT_CONVERSIONS
    .filter(c => c.searchVolume >= 100) // Only viable pages
    .map(c => ({
      from: c.from.slug,
      to: c.to.slug,
    }));
}

// Generate metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const conversion = getConversion(params.from, params.to);

  return {
    title: `${conversion.from.unit} to ${conversion.to.unit} Converter | GoFreeTool`,
    description: generateDescription(conversion),
    alternates: {
      canonical: `https://gofreetool.com/tools/${params.from}-to-${params.to}-converter`,
    },
  };
}

// Page component
export default function ConverterPage({ params }) {
  const conversion = getConversion(params.from, params.to);

  if (!conversion) {
    notFound();
  }

  return <UnitConverterTemplate conversion={conversion} />;
}
```

### Sitemap Generation

```typescript
// app/sitemap.ts

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const toolPages = tools.map(tool => ({
    url: `https://gofreetool.com/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const converterPages = UNIT_CONVERSIONS
    .filter(c => c.searchVolume >= 100)
    .map(c => ({
      url: `https://gofreetool.com/tools/${c.from.slug}-to-${c.to.slug}-converter`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6, // Lower than main tools
    }));

  return [...toolPages, ...converterPages];
}
```

### Build-Time Validation

```typescript
// scripts/validate-programmatic-pages.ts

async function validatePages() {
  const pages = await getAllProgrammaticPages();
  const issues: string[] = [];

  for (const page of pages) {
    // Check for duplicates
    const duplicates = pages.filter(p =>
      p.id !== page.id &&
      normalizeIntent(p.slug) === normalizeIntent(page.slug)
    );
    if (duplicates.length > 0) {
      issues.push(`Duplicate intent: ${page.slug} ↔ ${duplicates[0].slug}`);
    }

    // Check content threshold
    if (page.uniqueWords < 150) {
      issues.push(`Thin content: ${page.slug} (${page.uniqueWords} words)`);
    }

    // Check canonical
    if (!page.canonical) {
      issues.push(`Missing canonical: ${page.slug}`);
    }
  }

  if (issues.length > 0) {
    console.error('Validation failed:', issues);
    process.exit(1);
  }
}
```

---

## 6. Scaling Guidelines

### Phase 1: Core Conversions (50-100 pages)

Focus on high-volume, clear-intent conversions:
- Weight: kg↔lbs, oz↔g
- Length: cm↔inches, m↔ft, km↔miles
- Temperature: C↔F
- Volume: L↔gal, ml↔oz

### Phase 2: Calculator Variants (20-50 pages)

Expand popular calculators:
- EMI: home, car, personal, business, education loan
- Interest: savings, FD, RD, loan
- Health: BMI by age group, BMR by activity level

### Phase 3: Use-Case Pages (30-50 pages)

Target specific audiences:
- /for/students/
- /for/developers/
- /for/freelancers/
- /for/small-business/

### Phase 4: Comparison Pages (20-30 pages)

High-intent informational queries:
- /compare/bmi-vs-bmr
- /compare/simple-vs-compound-interest
- /compare/json-vs-yaml

### Monitoring

Track per page type:
- Indexed pages (Search Console)
- Impressions and clicks
- Average position
- Crawl frequency

**Warning signs:**
- Pages not getting indexed → thin content
- High impressions, low clicks → poor title/description
- Declining traffic → competitor or algorithm change

---

## Quick Reference

### URL Patterns

| Type | Pattern | Example |
|------|---------|---------|
| Unit converter | `/tools/[from]-to-[to]-converter` | `/tools/kg-to-lbs-converter` |
| Format converter | `/tools/[a]-to-[b]-converter` | `/tools/csv-to-json-converter` |
| Calculator variant | `/tools/[type]-[base]-calculator` | `/tools/home-loan-emi-calculator` |
| Use-case | `/for/[audience]/[tool]` | `/for/students/word-counter` |
| Comparison | `/compare/[a]-vs-[b]` | `/compare/bmi-vs-bmr` |

### Create vs Skip

| Create | Skip |
|--------|------|
| Search volume ≥ 100/mo | Search volume < 50/mo |
| Unique intent | Duplicate of existing |
| 150+ unique words possible | Thin/placeholder content |
| Clear user need | Nonsensical combination |
| KD < 40 | Dominated by authority sites |

### Content Minimums

| Element | Minimum |
|---------|---------|
| Unique words | 150 |
| Data table rows | 10 |
| Internal links | 3 |
| H2 sections | 2 |
| FAQ questions | 2 |
