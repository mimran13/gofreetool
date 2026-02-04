# Authority-Building Static Pages

Evergreen pages that build trust, capture traffic, and establish expertise.

---

## Overview

| Page | Primary Purpose | SEO Target |
|------|-----------------|------------|
| About | Trust & credibility | Brand queries |
| How It Works | Technical transparency | "how does [tool] work" |
| All Tools Directory | Internal linking hub | "[category] tools list" |
| Glossary | Topical authority | Definition queries |
| Formulas & Methods | Educational authority | "how to calculate [x]" |
| Comparison Hub | Decision-making resource | "[x] vs [y]" queries |
| Use Cases | Audience targeting | "[audience] tools" |
| API Documentation | Developer audience | "[tool] API" |
| Changelog | Freshness signals | Return visitors |
| Accessibility Statement | Trust & compliance | Accessibility queries |

---

## 1. About Page

**URL:** `/about`

### Purpose
- Establish credibility and trust
- Explain the mission (free, private, no-signup)
- Differentiate from ad-heavy competitors
- Support E-E-A-T signals

### SEO Value
- Brand query traffic ("gofreetool", "who made gofreetool")
- Trust signals for Google's quality raters
- Natural backlink target (press, mentions)

### Content Outline

```
H1: About GoFreeTool

## Our Mission
- Why we built this (2-3 paragraphs)
- Problem we solve: tools that are free, private, instant
- No signup, no tracking, no paywalls

## How We're Different
- Comparison table vs competitors:
  | Feature | GoFreeTool | Others |
  | Free | ✓ Always | Often limited |
  | Signup | ✗ Never | Usually required |
  | Privacy | ✓ Browser-only | Data collected |
  | Ads | Minimal | Aggressive |

## Our Principles
1. Privacy first - your data never leaves your browser
2. Always free - no premium tiers or paywalls
3. No dark patterns - no popups, no guilt trips
4. Quality over quantity - each tool is carefully built

## The Team (optional)
- Brief, humanizing content
- No full bios needed—just enough for trust

## Contact
- Email for feedback/suggestions
- GitHub for bug reports (if open source)
```

**Word count target:** 400-600 words

---

## 2. How It Works

**URL:** `/how-it-works`

### Purpose
- Technical transparency builds trust
- Explains client-side processing
- Addresses privacy concerns proactively
- Educates non-technical users

### SEO Value
- Informational queries ("how do online calculators work")
- Supports privacy-related searches
- Internal linking to tool categories

### Content Outline

```
H1: How GoFreeTool Works

## Browser-Based Processing
- Explain client-side JavaScript (simple terms)
- Diagram: Your Device → Browser → Results (no server)
- "Your data never leaves your computer"

## What Happens When You Use a Tool
Step-by-step for a calculator example:
1. You enter numbers in the form
2. JavaScript calculates the result instantly
3. Result displays on your screen
4. Nothing is sent anywhere

## What We Don't Do
- ✗ Store your inputs
- ✗ Send data to servers
- ✗ Track what you calculate
- ✗ Require accounts or logins

## Verify It Yourself
- How to check Network tab in DevTools
- Screenshot/instructions
- "See for yourself—no requests are made"

## Technologies We Use
- Next.js (React framework)
- Tailwind CSS (styling)
- Client-side JavaScript (all processing)
- No backend for tool processing

## Questions?
- Link to FAQ
- Link to Privacy Policy
```

**Word count target:** 500-700 words

---

## 3. All Tools Directory

**URL:** `/tools` or `/all-tools`

### Purpose
- Central hub for all tools
- Maximizes internal link equity
- Supports browsing/discovery
- Captures "tools list" searches

### SEO Value
- "[category] tools online" queries
- "free online tools list" queries
- Distributes PageRank to all tool pages
- High internal linking density

### Content Outline

```
H1: All Free Online Tools

## Introduction (brief)
- Total tool count: {X} free tools
- All browser-based, no signup required
- Organized by category below

## Quick Jump
[Calculators] [Converters] [Generators] [Text Tools] [Developer] [Health] ...

## Calculators ({count})
Brief category description (1 sentence)
- EMI Calculator - Calculate monthly loan payments
- Percentage Calculator - Find percentages instantly
- [Full list with one-line descriptions]

## Text & Writing Tools ({count})
Brief category description
- Word Counter - Count words, characters, sentences
- [Full list...]

## Developer Tools ({count})
[Continue pattern for all categories...]

## Can't Find What You Need?
- Suggest a tool form/email
- Browse by category links
```

**Structure:** Organized list, not card grid (better for SEO)

**Word count target:** 800-1200 words (scales with tool count)

---

## 4. Glossary / Terminology

**URL:** `/glossary`

### Purpose
- Establish topical authority
- Capture definition searches
- Educational resource
- Internal linking opportunities

### SEO Value
- "what is [term]" queries (high volume, low competition)
- Featured snippet opportunities
- Supports semantic SEO for main tools
- Natural internal linking

### Content Outline

```
H1: Online Tools Glossary

## Introduction
Quick reference for terms used across our tools.
Jump to: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z

## A

### API
Application Programming Interface. A way for software to communicate...
Related tool: [JSON Formatter]

### ASCII
American Standard Code for Information Interchange...
Related tool: [ASCII Converter]

## B

### Base64
A binary-to-text encoding scheme...
Related tool: [Base64 Encoder/Decoder]

### BMI
Body Mass Index. A measure of body fat based on height and weight...
Formula: BMI = weight (kg) / height (m)²
Related tool: [BMI Calculator]

### BMR
Basal Metabolic Rate. The number of calories your body burns at rest...
Related tool: [BMR Calculator]

## C

### CSV
Comma-Separated Values. A file format for tabular data...
Related tool: [CSV to JSON Converter]

### Compound Interest
Interest calculated on both the initial principal and accumulated interest...
Formula: A = P(1 + r/n)^(nt)
Related tool: [Compound Interest Calculator]

[Continue through alphabet...]
```

**Terms to include:** 50-100 terms relevant to your tools

**Word count target:** 2000-4000 words

---

## 5. Formulas & Methods

**URL:** `/formulas`

### Purpose
- Educational authority
- Reference resource (bookmarkable)
- Captures "how to calculate" searches
- Demonstrates expertise

### SEO Value
- "how to calculate [x] formula" queries
- "[x] formula" queries
- Featured snippet potential
- Math/educational backlink magnet

### Content Outline

```
H1: Formulas & Calculation Methods

## Financial Formulas

### EMI (Equated Monthly Installment)
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)

Where:
- P = Principal loan amount
- r = Monthly interest rate (annual rate / 12 / 100)
- n = Number of monthly installments

Example: ₹10,00,000 loan at 10% for 20 years
→ [Calculate with our EMI Calculator]

### Simple Interest
SI = (P × R × T) / 100

Where:
- P = Principal
- R = Rate of interest (annual)
- T = Time (years)

→ [Calculate with our Simple Interest Calculator]

### Compound Interest
A = P(1 + r/n)^(nt)

Where:
- A = Final amount
- P = Principal
- r = Annual interest rate (decimal)
- n = Compounding frequency per year
- t = Time in years

→ [Calculate with our Compound Interest Calculator]

## Health Formulas

### BMI (Body Mass Index)
BMI = weight (kg) / height (m)²

Categories:
- < 18.5: Underweight
- 18.5-24.9: Normal
- 25-29.9: Overweight
- ≥ 30: Obese

→ [Calculate with our BMI Calculator]

### BMR (Basal Metabolic Rate)

Mifflin-St Jeor Equation:
- Men: BMR = 10W + 6.25H - 5A + 5
- Women: BMR = 10W + 6.25H - 5A - 161

Where: W = weight (kg), H = height (cm), A = age (years)

→ [Calculate with our BMR Calculator]

## Conversion Formulas

### Temperature
- Celsius to Fahrenheit: °F = (°C × 9/5) + 32
- Fahrenheit to Celsius: °C = (°F - 32) × 5/9

### Weight
- Kilograms to Pounds: lbs = kg × 2.20462
- Pounds to Kilograms: kg = lbs / 2.20462

[Continue with all relevant formulas...]
```

**Word count target:** 1500-2500 words

---

## 6. Comparison Hub

**URL:** `/compare`

### Purpose
- Capture comparison searches
- Help users choose the right tool
- Educational content
- Internal linking between related tools

### SEO Value
- "[x] vs [y]" queries (high intent)
- Decision-making searches
- Featured snippet opportunities

### Content Outline

```
H1: Tool & Concept Comparisons

## Financial Comparisons

### Simple Interest vs Compound Interest
| Aspect | Simple Interest | Compound Interest |
|--------|-----------------|-------------------|
| Calculation | On principal only | On principal + accumulated interest |
| Growth | Linear | Exponential |
| Best for | Short-term loans | Long-term savings |
| Formula | SI = PRT/100 | A = P(1+r/n)^nt |

When to use each...
→ [Simple Interest Calculator] | [Compound Interest Calculator]

### EMI vs Flat Rate
[Comparison table and explanation]

## Health Comparisons

### BMI vs BMR
| Aspect | BMI | BMR |
|--------|-----|-----|
| Measures | Body mass relative to height | Calories burned at rest |
| Unit | kg/m² (index) | Calories/day |
| Use | Weight category assessment | Diet planning |

[Explanation of when to use each]
→ [BMI Calculator] | [BMR Calculator]

## Data Format Comparisons

### JSON vs XML
| Aspect | JSON | XML |
|--------|------|-----|
| Syntax | Lightweight | Verbose |
| Readability | High | Medium |
| Data types | Native | All strings |
| Use case | APIs, config | Documents, SOAP |

→ [JSON Formatter] | [XML Formatter]

### CSV vs JSON
[Comparison table]
→ [CSV to JSON Converter]

[Continue with relevant comparisons...]
```

**Word count target:** 1500-3000 words

---

## 7. Use Cases by Audience

**URL:** `/use-cases` (hub) + `/for/[audience]` (individual)

### Purpose
- Target specific user segments
- Improve relevance for audience searches
- Guide users to relevant tools
- Support marketing/landing pages

### SEO Value
- "[audience] tools" queries
- "tools for [profession]" queries
- Long-tail keyword capture
- Persona-based content

### Hub Page Outline (`/use-cases`)

```
H1: Tools for Every Need

## For Students
Essential tools for homework, research, and studying.
→ [View student tools]

## For Developers
Code formatting, data conversion, and debugging tools.
→ [View developer tools]

## For Content Writers
Word counts, reading time, and text formatting.
→ [View writer tools]

## For Small Business
Calculators for loans, invoices, and planning.
→ [View business tools]

## For Health & Fitness
Track BMI, calories, and fitness metrics.
→ [View health tools]

## For Everyday Use
Quick calculations for daily life.
→ [View everyday tools]
```

### Individual Audience Page (`/for/students`)

```
H1: Free Tools for Students

## Why Students Love GoFreeTool
- No signup interrupting your work
- Works offline after loading
- Mobile-friendly for on-the-go

## Essential Student Tools

### Writing & Research
- Word Counter - Track essay length
- Reading Time Calculator - Estimate study time
- Text Case Converter - Fix capitalization

### Math & Science
- Percentage Calculator - Quick calculations
- Unit Converters - Metric/imperial conversions
- Scientific calculators (if applicable)

### Productivity
- [Relevant tools...]

## Tips for Students
- Bookmark your most-used tools
- Tools work offline once loaded
- [Other helpful tips]
```

**Word count per audience page:** 400-700 words

---

## 8. API Documentation (If Applicable)

**URL:** `/api` or `/developers`

### Purpose
- Attract developer audience
- Enable integrations
- Professional credibility
- Potential B2B leads

### SEO Value
- "[tool] API" queries
- Developer-focused long-tail
- Technical backlinks
- Community building

### Content Outline

```
H1: Developer API (if offered)

## Overview
- What's available via API
- Rate limits and usage
- Authentication (or lack thereof)

## Endpoints

### Unit Conversion
GET /api/convert?from=kg&to=lbs&value=5

Response:
{
  "from": "kg",
  "to": "lbs",
  "input": 5,
  "result": 11.0231
}

### [Other endpoints...]

## Usage Examples

### JavaScript
```js
const response = await fetch('/api/convert?from=kg&to=lbs&value=5');
const data = await response.json();
```

### Python
```python
import requests
response = requests.get('/api/convert', params={...})
```

## Terms of Use
- Free for personal and commercial use
- Attribution appreciated but not required
- Rate limits: X requests per minute
```

**Note:** Only create if you actually offer an API

---

## 9. Changelog / Updates

**URL:** `/changelog` or `/updates`

### Purpose
- Freshness signals for SEO
- Return visitor engagement
- Transparency about improvements
- Professional appearance

### SEO Value
- Demonstrates active maintenance
- Fresh content signals
- Supports "what's new" queries
- Encourages return visits

### Content Outline

```
H1: Changelog

## 2024

### February 2024
- Added: QR Code Generator
- Improved: JSON Formatter now supports larger files
- Fixed: BMI Calculator mobile layout issue

### January 2024
- Added: Color Palette Generator
- Added: Contrast Checker
- Improved: Faster load times across all tools

## 2023

### December 2023
- Added: Password Generator
- Added: Hash Generator (MD5, SHA-256)
- Improved: Dark mode support for all tools

[Continue chronologically...]

## Coming Soon
- PDF tools (merge, split, compress)
- Image format converters
- [Other planned features]

## Suggest a Tool
Have an idea? [Contact us]
```

**Update frequency:** Monthly or with each release

---

## 10. Accessibility Statement

**URL:** `/accessibility`

### Purpose
- Legal compliance (ADA, WCAG)
- Trust building
- Inclusive brand positioning
- Demonstrates quality standards

### SEO Value
- Accessibility-related queries
- Trust signals for quality raters
- Differentiator from competitors
- Potential .gov/.edu backlinks

### Content Outline

```
H1: Accessibility Statement

## Our Commitment
GoFreeTool is committed to ensuring digital accessibility for people
with disabilities. We continually improve the user experience for
everyone and apply relevant accessibility standards.

## Standards We Follow
- WCAG 2.1 Level AA guidelines
- Section 508 compliance
- WAI-ARIA best practices

## Accessibility Features
- Keyboard navigation for all tools
- Screen reader compatibility
- High contrast support
- Resizable text without loss of functionality
- No flashing content
- Clear focus indicators
- Descriptive link text

## Known Limitations
- [List any known issues and remediation timeline]

## Feedback
If you encounter accessibility barriers:
- Email: accessibility@gofreetool.com
- We aim to respond within 5 business days

## Testing
We test with:
- NVDA and VoiceOver screen readers
- Keyboard-only navigation
- axe DevTools automated testing

Last updated: [Date]
```

**Word count target:** 300-500 words

---

## Implementation Priority

### Phase 1 (Launch)
1. About page - Essential trust signal
2. All Tools Directory - Internal linking hub
3. Privacy Policy - Required (exists)

### Phase 2 (Authority Building)
4. How It Works - Technical transparency
5. Glossary - Definition traffic capture
6. Formulas page - Educational authority

### Phase 3 (Expansion)
7. Use Cases hub - Audience targeting
8. Comparison hub - Decision queries
9. Changelog - Freshness signals

### Phase 4 (Polish)
10. Accessibility Statement - Compliance
11. API Documentation - If applicable

---

## Quick Reference

| Page | Words | Links Out | Update Frequency |
|------|-------|-----------|------------------|
| About | 400-600 | 3-5 | Yearly |
| How It Works | 500-700 | 5-10 | As needed |
| All Tools | 800-1200 | All tools | With new tools |
| Glossary | 2000-4000 | 50+ | Monthly |
| Formulas | 1500-2500 | 20-30 | Quarterly |
| Comparisons | 1500-3000 | 20-30 | Quarterly |
| Use Cases | 400-700 each | 10-15 | Quarterly |
| Changelog | 500+ | 5-10 | Monthly |
| Accessibility | 300-500 | 2-3 | Yearly |
