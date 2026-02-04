# SEO Checklist for Tool Pages

Low-competition, intent-driven SEO for individual tool pages.

---

## Pre-Launch Checklist

```
□ Title tag optimized (50-60 chars)
□ Meta description written (150-160 chars)
□ H1 matches search intent
□ Intro text includes primary keyword
□ Internal links added (3-5 minimum)
□ Schema markup implemented
□ URL is clean and keyword-rich
□ Page loads < 3 seconds
□ Mobile-friendly verified
```

---

## 1. Title Tag Rules

### Formula

```
[Primary Keyword] - [Benefit/Action] | GoFreeTool
```

### Specifications

| Element | Requirement |
|---------|-------------|
| Length | 50-60 characters (max 60) |
| Primary keyword | Within first 30 characters |
| Brand | At end, after pipe |
| Unique | No duplicate titles across site |

### Patterns That Work

| Pattern | Example | When to Use |
|---------|---------|-------------|
| `[Tool] Calculator` | "EMI Calculator - Calculate Loan Payments" | Calculators |
| `[A] to [B] Converter` | "CSV to JSON Converter - Free Online" | Converters |
| `[Tool] Generator` | "UUID Generator - Create UUIDs Instantly" | Generators |
| `Free [Tool] Online` | "Free Password Generator Online" | High-competition terms |
| `[Action] [Thing]` | "Calculate BMI - Free Body Mass Index Tool" | Action-focused |

### Title Examples

```
✓ Good:
  "EMI Calculator - Calculate Monthly Loan Payments | GoFreeTool" (58 chars)
  "JSON Formatter - Format & Validate JSON Online | GoFreeTool" (57 chars)
  "BMI Calculator - Check Your Body Mass Index Free | GoFreeTool" (59 chars)

✗ Bad:
  "Calculator" (too short, no context)
  "The Best Free Online EMI Loan Payment Calculator Tool 2024" (keyword stuffed)
  "GoFreeTool - EMI Calculator" (brand first wastes space)
```

### Implementation

```typescript
// lib/tools.ts
seo: {
  title: "EMI Calculator - Calculate Monthly Loan Payments",
  // Full title becomes: "EMI Calculator - Calculate Monthly Loan Payments | GoFreeTool"
}
```

---

## 2. Meta Description Rules

### Formula

```
[What it does] + [Key benefit] + [Call to action]. [Trust signal].
```

### Specifications

| Element | Requirement |
|---------|-------------|
| Length | 150-160 characters |
| Primary keyword | Within first 100 characters |
| Call to action | Include action verb |
| Unique | No duplicates across site |
| No quotes | Avoid " marks (truncation issues) |

### Template

```
Free [tool name] to [primary action]. [Secondary benefit]. No signup required - works in your browser.
```

### Examples by Category

**Calculators:**
```
Free EMI calculator to calculate monthly loan payments instantly. See total interest and payment breakdown. No signup required.
```

**Converters:**
```
Convert CSV to JSON online for free. Handles large files, preserves data types. No upload needed - works entirely in your browser.
```

**Generators:**
```
Generate secure passwords instantly. Customize length, symbols, and complexity. Free, no signup - passwords never leave your device.
```

**Text Tools:**
```
Count words, characters, and sentences instantly. Free word counter for writers and students. Works offline, no data stored.
```

### What to Include

- ✓ Primary keyword naturally
- ✓ What the tool does
- ✓ One key benefit
- ✓ Trust signal (free, no signup, browser-based)
- ✓ Action word (calculate, convert, generate, check)

### What to Avoid

- ✗ Keyword stuffing
- ✗ ALL CAPS
- ✗ Excessive punctuation!!!
- ✗ "Click here" or "Learn more"
- ✗ Duplicate descriptions
- ✗ Price mentions (unless comparing)

---

## 3. Heading Structure

### Required Hierarchy

```
H1: [Tool Name]                          ← One per page, matches title intent
│
├── H2: How to Use [Tool]                ← Optional, for complex tools
│
├── H2: [Tool-Specific Section]          ← e.g., "Understanding BMI Categories"
│
├── H2: Frequently Asked Questions       ← Standard FAQ section
│   ├── H3: Is this tool free?
│   ├── H3: Is my data safe?
│   └── H3: [Tool-specific question]
│
└── H2: Related Tools                    ← Standard related section
```

### H1 Rules

| Rule | Example |
|------|---------|
| One H1 per page | "EMI Calculator" |
| Include primary keyword | "Percentage Calculator" not "Calculate %" |
| Match search intent | "BMI Calculator" not "Body Mass Index Computation Tool" |
| Keep concise | 3-7 words ideal |

### H2 Rules

- Use for major sections only
- Include secondary keywords where natural
- 2-5 H2s per page typical

### H3 Rules

- Use for subsections and FAQ questions
- Can include long-tail keywords
- Supports FAQ schema markup

### Heading Examples

```html
<!-- Good structure -->
<h1>JSON Formatter</h1>
<h2>How to Format JSON</h2>
<h2>JSON Formatting Options</h2>
<h2>Frequently Asked Questions</h2>
  <h3>What is JSON formatting?</h3>
  <h3>Is my JSON data secure?</h3>
<h2>Related Developer Tools</h2>

<!-- Bad structure -->
<h1>Welcome to Our Tool</h1>           <!-- Not descriptive -->
<h2>JSON Formatter</h2>                <!-- Should be H1 -->
<h4>Options</h4>                       <!-- Skipped H3 -->
```

---

## 4. Intro Text Guidelines

### Specifications

| Element | Requirement |
|---------|-------------|
| Length | 40-80 words (2-3 sentences) |
| Primary keyword | In first sentence |
| Tone | Direct, benefit-focused |
| Position | Immediately below H1 |

### Formula

```
[What it is] + [What it does] + [Key benefit or differentiator].
```

### Examples

**Calculator (54 words):**
```
Calculate your monthly EMI (Equated Monthly Installment) for home loans, car loans,
and personal loans. Enter your loan amount, interest rate, and tenure to get instant
results. See the complete breakdown of principal and interest payments over time.
```

**Converter (48 words):**
```
Convert CSV files to JSON format instantly. This free online converter handles large
datasets, preserves data types, and works entirely in your browser. No file uploads
needed—your data never leaves your device.
```

**Generator (42 words):**
```
Generate UUIDs (Universally Unique Identifiers) instantly. Create single or bulk UUIDs
in v4 format for databases, APIs, and applications. Copy with one click—no signup required.
```

### Tone Guidelines

| Do | Don't |
|----|-------|
| "Calculate your BMI instantly" | "Welcome to our BMI calculator" |
| "Convert CSV to JSON in seconds" | "This tool will help you convert" |
| "Generate secure passwords" | "Are you looking for a password generator?" |

### Keyword Placement

```
✓ Good: "Calculate your monthly EMI instantly with our free EMI calculator."
         ^^^^^^^^^ keyword in first 5 words

✗ Bad:  "Welcome to our website where you can find tools to calculate EMI."
         keyword buried at end
```

---

## 5. Internal Linking Placement

### Required Links Per Tool Page

| Position | Links | Type |
|----------|-------|------|
| Breadcrumb | 2 | Navigational (Home, Category) |
| Related tools section | 3 | Discovery |
| Back to home | 1 | Navigational |
| **Minimum total** | **6** | |

### Optional Links (Recommended)

| Position | Links | When |
|----------|-------|------|
| Intro text | 1-2 | If mentioning related concepts |
| How-to section | 1-2 | If referencing other tools |
| FAQ answers | 1-2 | If relevant to answer |
| Post-action zone | 1-2 | Workflow continuation |

### Anchor Text Distribution

| Type | Percentage | Example |
|------|------------|---------|
| Exact match | 40% | "percentage calculator" |
| Partial match | 30% | "calculate percentages" |
| Branded/Natural | 30% | "our calculator", "this tool" |

### Link Placement Examples

**In intro text:**
```
Calculate loan EMI and see how it compares to simple interest calculations
using our [simple interest calculator](/tools/simple-interest-calculator).
```

**In FAQ:**
```
Q: How is BMI different from BMR?
A: BMI measures body mass relative to height, while [BMR (Basal Metabolic Rate)](/tools/bmr-calculator)
   measures calories burned at rest. Both are useful health indicators.
```

**Post-action:**
```
Need to calculate the percentage difference? Try our [percentage calculator](/tools/percentage-calculator).
```

### Internal Linking Don'ts

- ✗ Don't link to the current page
- ✗ Don't use "click here" as anchor text
- ✗ Don't add more than 2 links per paragraph
- ✗ Don't link the same page twice with different anchors

---

## 6. Schema Markup

### Required: SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EMI Calculator",
  "description": "Free EMI calculator to calculate monthly loan payments...",
  "url": "https://gofreetool.com/tools/emi-calculator",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### Application Categories

| Tool Type | applicationCategory |
|-----------|---------------------|
| Finance/Calculator | FinanceApplication |
| Health | HealthApplication |
| Developer | DeveloperApplication |
| Design | DesignApplication |
| Productivity | ProductivityApplication |
| Utilities | UtilitiesApplication |

### Recommended: FAQPage Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is this tool free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all our tools are completely free..."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. All calculations happen in your browser..."
      }
    }
  ]
}
```

### Optional: HowTo Schema (for complex tools)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Calculate EMI",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Enter loan amount",
      "text": "Enter the total loan amount you wish to borrow"
    },
    {
      "@type": "HowToStep",
      "name": "Set interest rate",
      "text": "Enter the annual interest rate offered by your lender"
    }
  ]
}
```

### Schema Validation

Test at: https://validator.schema.org/ or Google Rich Results Test

---

## 7. URL Structure

### Format

```
https://gofreetool.com/tools/[keyword-slug]
```

### Rules

| Rule | Good | Bad |
|------|------|-----|
| Lowercase | `/tools/emi-calculator` | `/tools/EMI-Calculator` |
| Hyphens | `/tools/word-counter` | `/tools/word_counter` |
| No dates | `/tools/bmi-calculator` | `/tools/bmi-calculator-2024` |
| No parameters | `/tools/json-formatter` | `/tools/formatter?type=json` |
| Keyword-rich | `/tools/csv-to-json-converter` | `/tools/converter-1` |

### Slug Guidelines

- 2-5 words ideal
- Primary keyword first
- No stop words (the, a, an) unless necessary
- Match search intent exactly

---

## 8. Technical SEO

### Page Speed

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Total page size | < 500KB |

### Mobile Optimization

- [ ] Viewport meta tag present
- [ ] Touch targets ≥ 44px
- [ ] No horizontal scroll
- [ ] Font size ≥ 16px base
- [ ] Tool usable without zoom

### Indexing

```tsx
// For tool pages (index by default)
// No robots meta needed

// For utility pages (if any should be noindex)
<meta name="robots" content="noindex, nofollow" />
```

### Canonical URL

```tsx
alternates: {
  canonical: `https://gofreetool.com/tools/${tool.slug}`,
}
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│  TITLE TAG                                                  │
│  [Primary Keyword] - [Benefit] | GoFreeTool                │
│  50-60 chars, keyword in first 30                          │
├─────────────────────────────────────────────────────────────┤
│  META DESCRIPTION                                           │
│  [What] + [Benefit] + [Trust signal]. 150-160 chars.       │
│  Include CTA, no quotes, unique per page                   │
├─────────────────────────────────────────────────────────────┤
│  H1                                                         │
│  One per page, matches search intent, 3-7 words            │
├─────────────────────────────────────────────────────────────┤
│  INTRO TEXT                                                 │
│  40-80 words, keyword in first sentence, benefit-focused   │
├─────────────────────────────────────────────────────────────┤
│  INTERNAL LINKS                                             │
│  Minimum 6: Breadcrumb (2) + Related (3) + Home (1)        │
│  Anchor text: 40% exact, 30% partial, 30% natural          │
├─────────────────────────────────────────────────────────────┤
│  SCHEMA                                                     │
│  Required: SoftwareApplication                              │
│  Recommended: FAQPage                                       │
│  Optional: HowTo (complex tools)                           │
├─────────────────────────────────────────────────────────────┤
│  URL                                                        │
│  /tools/[keyword-slug] - lowercase, hyphens, 2-5 words     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tool-Specific SEO Templates

### Calculator Template

```typescript
{
  slug: "emi-calculator",
  name: "EMI Calculator",
  seo: {
    title: "EMI Calculator - Calculate Monthly Loan Payments",
    description: "Free EMI calculator to calculate monthly loan payments instantly. See interest breakdown and total payable amount. No signup required.",
    keywords: ["EMI calculator", "loan EMI", "monthly payment calculator", "loan calculator"]
  }
}
```

### Converter Template

```typescript
{
  slug: "csv-to-json-converter",
  name: "CSV to JSON Converter",
  seo: {
    title: "CSV to JSON Converter - Convert Files Online Free",
    description: "Convert CSV to JSON online for free. Handles large files, auto-detects delimiters. No upload needed - works in your browser.",
    keywords: ["CSV to JSON", "CSV converter", "JSON converter", "file converter"]
  }
}
```

### Generator Template

```typescript
{
  slug: "password-generator",
  name: "Password Generator",
  seo: {
    title: "Password Generator - Create Secure Passwords Free",
    description: "Generate strong, secure passwords instantly. Customize length and complexity. Free, no signup - passwords never stored or transmitted.",
    keywords: ["password generator", "secure password", "random password", "strong password"]
  }
}
```
