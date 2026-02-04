# Internal Linking Strategy

## Overview

A scalable internal linking system for 100+ tools that improves SEO, user navigation, and tool discovery without manual maintenance overhead.

---

## Link Relationship Types

### 1. Hierarchical Links (Automatic)
```
Homepage → Category → Tool
```
- Generated from `tool.category` field
- Zero maintenance required

### 2. Peer Links (Semi-automatic)
```
Tool A ←→ Tool B (same category)
Tool A ←→ Tool C (related category)
```
- Primary: Same category tools
- Secondary: Related category tools (via `RELATED_CATEGORIES`)

### 3. Curated Links (Manual)
```
Tool A → Tool B (explicit relationship)
```
- High-value connections only
- Reserved for non-obvious relationships

---

## Data Structure for Scalability

### Current (Manual)
```typescript
// Does not scale
relatedTools: ["tool-a", "tool-b", "tool-c"]
```

### Recommended (Hybrid)
```typescript
interface Tool {
  slug: string;
  category: string;
  tags?: string[];              // Auto-discovery
  relatedTools?: string[];      // Manual overrides (optional)
  difficulty?: 'basic' | 'intermediate' | 'advanced';
}
```

### Auto-Discovery Algorithm
```typescript
function getRelatedTools(tool: Tool, limit = 3): Tool[] {
  const candidates: ScoredTool[] = [];

  // Priority 1: Manual overrides (if defined)
  if (tool.relatedTools?.length) {
    return tool.relatedTools.map(getToolBySlug).slice(0, limit);
  }

  // Priority 2: Same category tools
  const categoryTools = getToolsByCategory(tool.category)
    .filter(t => t.slug !== tool.slug);
  categoryTools.forEach(t => candidates.push({ tool: t, score: 10 }));

  // Priority 3: Shared tags
  if (tool.tags) {
    tools.filter(t => t.slug !== tool.slug).forEach(t => {
      const sharedTags = t.tags?.filter(tag => tool.tags!.includes(tag)) || [];
      if (sharedTags.length > 0) {
        candidates.push({ tool: t, score: sharedTags.length * 5 });
      }
    });
  }

  // Priority 4: Related category tools
  const relatedCats = getRelatedCategories(tool.category);
  relatedCats.forEach(cat => {
    getToolsByCategory(cat.slug).forEach(t => {
      candidates.push({ tool: t, score: 3 });
    });
  });

  // Dedupe and sort by score
  return dedupeBySlug(candidates)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(c => c.tool);
}
```

---

## Link Placement on Tool Pages

### Page Structure with Links

```
┌─────────────────────────────────────────────┐
│  [1] Breadcrumb: Home / Category / Tool     │  ← 2 links
├─────────────────────────────────────────────┤
│  Tool Header + Description                  │
├─────────────────────────────────────────────┤
│  Tool Interface (input/output)              │
├─────────────────────────────────────────────┤
│  [2] Quick Actions (contextual)             │  ← 0-2 links
│  "Need to convert the result? Try X Tool"   │
├─────────────────────────────────────────────┤
│  [3] How to Use / FAQ                       │  ← 1-3 links
│  Inline links within content                │
├─────────────────────────────────────────────┤
│  [4] Related Tools Section                  │  ← 3 links
│  Grid of 3 related tool cards               │
├─────────────────────────────────────────────┤
│  [5] Category Link                          │  ← 1 link
│  "Explore more [Category] tools →"          │
├─────────────────────────────────────────────┤
│  [6] Back to Home                           │  ← 1 link
└─────────────────────────────────────────────┘

Total per page: 8-12 internal links
```

### Placement Details

| Position | Link Type | Count | Purpose |
|----------|-----------|-------|---------|
| Breadcrumb | Navigational | 2 | Hierarchy, category access |
| Quick Actions | Contextual | 0-2 | Workflow continuation |
| FAQ/Content | Inline | 1-3 | Deep linking, SEO |
| Related Tools | Discovery | 3 | Peer exploration |
| Category CTA | Navigational | 1 | Category hub access |
| Back to Home | Navigational | 1 | Site navigation |

---

## Anchor Text Rules

### Primary Rules

| Link Type | Pattern | Example |
|-----------|---------|---------|
| Tool name | `{Tool Name}` | "BMI Calculator" |
| Action-based | `{verb} with {Tool}` | "Convert with JSON Formatter" |
| Benefit-based | `{benefit} using {Tool}` | "Calculate your BMR using our free calculator" |
| Category | `{Category} tools` | "Calculator tools" |

### Do's and Don'ts

```
✓ DO: Descriptive, keyword-rich anchor text
  - "percentage calculator"
  - "convert CSV to JSON"
  - "free BMI calculator"

✗ DON'T: Generic or over-optimized anchors
  - "click here"
  - "this tool"
  - "best free online percentage calculator tool 2024"
```

### Variation Guidelines

For the same destination, rotate anchor text:

```typescript
// Tool: percentage-calculator
const anchors = [
  "Percentage Calculator",           // Exact match (primary)
  "calculate percentages",           // Action-based
  "percentage tool",                 // Short variation
  "find percentage of any number",   // Long-tail
];

// Use primary for navigation, variations for content
```

### Implementation

```tsx
// Navigation links - use tool name
<Link href={`/tools/${tool.slug}`}>
  {tool.name}
</Link>

// Content links - use contextual anchor
<Link href="/tools/percentage-calculator">
  calculate the percentage
</Link>

// Title attribute for all links
<Link
  href={`/tools/${tool.slug}`}
  title={`${tool.name} - ${tool.shortDescription}`}
>
```

---

## Contextual Linking Patterns

### 1. Workflow Links (Quick Actions)

Place after tool output when result can be used elsewhere:

```tsx
// After JSON Formatter output
{output && (
  <p className="text-sm text-gray-600 mt-4">
    Need to convert this? Try our{' '}
    <Link href="/tools/csv-json-converter" className="text-teal-600 hover:underline">
      CSV to JSON Converter
    </Link>
  </p>
)}
```

**Workflow mappings:**
```typescript
const WORKFLOW_LINKS: Record<string, string[]> = {
  'json-formatter': ['csv-json-converter', 'json-validator'],
  'base64-encoder': ['url-encoder-decoder', 'hash-generator'],
  'image-resizer': ['image-compressor', 'image-converter'],
  'word-counter': ['character-counter', 'reading-time-calculator'],
};
```

### 2. FAQ Inline Links

```tsx
const faq = [
  {
    question: "How accurate is the BMI calculation?",
    answer: `BMI provides a general indicator but doesn't account for muscle mass.
             For a complete picture, also check your
             <a href="/tools/bmr-calculator">BMR (Basal Metabolic Rate)</a> and
             <a href="/tools/body-fat-calculator">body fat percentage</a>.`
  }
];
```

### 3. SEO Content Links

```tsx
// In category SEO content section
<p>
  Our calculator collection includes essential financial tools like the{' '}
  <Link href="/tools/emi-calculator">EMI Calculator</Link> for loan planning,{' '}
  <Link href="/tools/percentage-calculator">Percentage Calculator</Link> for
  quick math, and{' '}
  <Link href="/tools/tip-calculator">Tip Calculator</Link> for dining out.
</p>
```

**Rule:** 2-4 tool links per 100 words of content.

---

## SEO-Safe Practices

### Link Attributes

```tsx
// Internal links - no special attributes needed
<Link href="/tools/calculator">Calculator</Link>

// External links (if any)
<a href="https://external.com" rel="noopener noreferrer" target="_blank">
  External Resource
</a>

// Never use on internal links
rel="nofollow"      // ✗ Blocks PageRank flow
rel="sponsored"     // ✗ For paid links only
rel="ugc"           // ✗ For user-generated content
```

### Link Density Guidelines

| Page Type | Target Links | Max Links |
|-----------|--------------|-----------|
| Tool page | 8-12 | 15 |
| Category page | 15-25 | 40 |
| Homepage | 30-50 | 75 |

**Rule:** Quality over quantity. Every link should have clear user value.

### Avoid Over-Optimization

```
✗ BAD: Keyword stuffing in anchors
  "Use our free online percentage calculator tool to calculate percentage"

✓ GOOD: Natural, varied anchors
  "Use our percentage calculator to find any percentage quickly"
```

### Crawl Efficiency

```tsx
// Use Next.js Link for client-side navigation + SEO
import Link from 'next/link';

// Consistent URL structure
/tools/{slug}        // Tool pages
/category/{slug}     // Category pages
/                    // Homepage

// No URL parameters for navigation
✗ /tools?id=calculator
✓ /tools/calculator
```

### Canonical URLs

```tsx
// In metadata generation
alternates: {
  canonical: `https://gofreetool.com/tools/${tool.slug}`,
}
```

---

## Scalability Implementation

### Phase 1: Tag-Based Discovery (Immediate)

Add tags to tool definitions:

```typescript
// lib/tools.ts
{
  slug: 'emi-calculator',
  category: 'calculators',
  tags: ['finance', 'loan', 'mortgage', 'banking'],
  // relatedTools no longer required
}
```

### Phase 2: Auto-Generation (Build Time)

Generate related tools at build:

```typescript
// scripts/generate-links.ts
function generateRelatedToolsMap() {
  const map: Record<string, string[]> = {};

  tools.forEach(tool => {
    map[tool.slug] = getRelatedTools(tool, 3).map(t => t.slug);
  });

  writeFileSync('lib/generated/related-tools.json', JSON.stringify(map));
}
```

### Phase 3: Bidirectional Validation

Ensure link integrity:

```typescript
// scripts/validate-links.ts
function validateLinks() {
  const errors: string[] = [];

  tools.forEach(tool => {
    tool.relatedTools?.forEach(slug => {
      if (!getToolBySlug(slug)) {
        errors.push(`${tool.slug} references non-existent tool: ${slug}`);
      }
    });
  });

  if (errors.length) {
    console.error('Link validation failed:', errors);
    process.exit(1);
  }
}
```

### Phase 4: Analytics-Driven (Future)

Incorporate usage data:

```typescript
interface ToolAnalytics {
  slug: string;
  views: number;
  conversions: number;
  exitToTools: Record<string, number>; // Which tools users navigate to
}

// Boost related tools that users actually click
function getRelatedToolsWithAnalytics(tool: Tool): Tool[] {
  const analytics = getAnalytics(tool.slug);
  const exitPatterns = Object.entries(analytics.exitToTools)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([slug]) => getToolBySlug(slug));

  return exitPatterns.length >= 3
    ? exitPatterns
    : getRelatedTools(tool, 3);
}
```

---

## Link Maintenance Checklist

### When Adding a Tool
- [ ] Set `category` field
- [ ] Add relevant `tags` (3-5 tags)
- [ ] Optional: Add `relatedTools` for special relationships
- [ ] Verify auto-generated links make sense
- [ ] Add to relevant FAQ content if applicable

### When Removing a Tool
- [ ] Search codebase for slug references
- [ ] Update any manual `relatedTools` arrays
- [ ] Check FAQ/content for inline links
- [ ] Verify no 404s in sitemap
- [ ] Run link validation script

### Quarterly Review
- [ ] Check for orphan pages (no inbound links)
- [ ] Review link click analytics
- [ ] Update workflow mappings based on usage
- [ ] Refresh SEO content links

---

## Quick Reference

### Link Count Per Page
```
Tool page:     8-12 links
Category page: 15-25 links
Homepage:      30-50 links
```

### Anchor Text Mix
```
60% - Exact tool name
25% - Action/benefit variation
15% - Long-tail/contextual
```

### Link Placement Priority
```
1. Breadcrumb (always)
2. Related tools section (always)
3. Category CTA (always)
4. FAQ inline links (when relevant)
5. Workflow links (when output exists)
```
