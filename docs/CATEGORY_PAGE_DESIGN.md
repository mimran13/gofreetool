# Category Page Design

## Page Structure

```
┌─────────────────────────────────────────────┐
│  Breadcrumb: Home / Categories / [Current]  │
├─────────────────────────────────────────────┤
│  [Icon]  H1: Free [Category] Tools Online   │
│          Tool count · Trust badges          │
│          Intro paragraph (2-3 sentences)    │
├─────────────────────────────────────────────┤
│  ⭐ Popular Tools (4-column featured grid)  │
├─────────────────────────────────────────────┤
│  All Tools (3-column grid, alphabetical)    │
├─────────────────────────────────────────────┤
│  SEO Content Section (~300 words)           │
├─────────────────────────────────────────────┤
│  Related Categories (3-column grid)         │
├─────────────────────────────────────────────┤
│  ← Browse All Free Online Tools             │
└─────────────────────────────────────────────┘
```

---

## Tool Grid Behavior

### Responsive Breakpoints

| Section | Mobile | Tablet (md) | Desktop (lg) |
|---------|--------|-------------|--------------|
| Popular Tools | 1 col | 2 col | 4 col |
| All Tools | 1 col | 2 col | 3 col |
| Related Categories | 1 col | 3 col | 3 col |

### Grid Implementation

```tsx
// Popular tools - wider showcase
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// All tools - standard density
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Related categories
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
```

### Tool Card States

```tsx
// Base card
<Link className="group block h-full p-6 bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700 rounded-xl
                 hover:shadow-lg hover:border-teal-300 transition-all">

// Icon animation
<span className="text-4xl transition-transform group-hover:scale-110">

// Title hover
<h3 className="font-semibold text-gray-900 group-hover:text-teal-600">
```

### Card Content Hierarchy

1. **Icon** (4xl) - Visual anchor
2. **Name** (font-semibold) - Primary identifier
3. **Description** (text-sm, line-clamp-2) - Context
4. **Category badge** (optional on cross-category pages)

---

## Intro Text Placement

### Header Section Structure

```tsx
<section className="mb-12">
  <div className="flex flex-col md:flex-row md:items-start gap-6">
    {/* Icon - large, left-aligned */}
    <div className="text-5xl">{category.icon}</div>

    <div className="flex-1">
      {/* H1 - SEO optimized title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Free {category.name} Tools Online
      </h1>

      {/* Tool count */}
      <p className="text-gray-600 mb-4">
        {tools.length} free tool{tools.length !== 1 ? 's' : ''} available
      </p>

      {/* Intro paragraph - max 3 sentences */}
      <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-6">
        {seoConfig.intro}
      </p>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-1 text-teal-600">
          <CheckIcon /> 100% Free
        </span>
        <span className="flex items-center gap-1 text-teal-600">
          <CheckIcon /> No Signup Required
        </span>
        <span className="flex items-center gap-1 text-teal-600">
          <CheckIcon /> Browser-Based
        </span>
      </div>
    </div>
  </div>
</section>
```

### Intro Text Guidelines

| Element | Length | Purpose |
|---------|--------|---------|
| H1 | 5-8 words | Primary keyword + "Free" + "Online" |
| Tool count | Dynamic | Social proof, freshness signal |
| Intro | 2-3 sentences | Value proposition, target keywords |
| Trust badges | 3 items | Reduce friction, build trust |

---

## Internal Linking Strategy

### 1. Breadcrumb Navigation (Top)

```tsx
<nav aria-label="Breadcrumb" className="mb-8">
  <ol className="flex items-center gap-2 text-sm">
    <li><Link href="/">Home</Link></li>
    <li aria-hidden="true">/</li>
    <li><Link href="/#categories">Categories</Link></li>
    <li aria-hidden="true">/</li>
    <li aria-current="page">{category.name}</li>
  </ol>
</nav>
```

### 2. Tool Links (Primary)

Every tool card links to `/tools/[slug]`:
- Descriptive link text (tool name)
- Title attribute for accessibility
- Entire card is clickable (Link wrapper)

### 3. Related Categories (Cross-linking)

```tsx
// Configuration in lib/tools.ts
RELATED_CATEGORIES: {
  calculators: ["health", "home", "date-time"],
  health: ["calculators", "home", "fun"],
  developer: ["security", "data-conversion", "writing"],
  // Semantic groupings based on user intent
}
```

**Placement**: After all tools, before footer
**Display**: 3 category cards with icon + name + description

### 4. Back Navigation (Bottom)

```tsx
<Link href="/" className="inline-flex items-center gap-2 text-teal-600">
  <ArrowLeftIcon />
  Browse All Free Online Tools
</Link>
```

### 5. Link Density Guidelines

| Page Section | Links | Type |
|--------------|-------|------|
| Breadcrumb | 2-3 | Navigational |
| Popular Tools | 4 | Content |
| All Tools | 5-15 | Content |
| Related Categories | 3 | Cross-link |
| Back to Home | 1 | Navigational |

**Total internal links per page**: 15-25 (optimal for SEO)

---

## UX Patterns for Tool Discovery

### 1. Featured Tools Section

**Purpose**: Surface high-value tools immediately

```tsx
<section className="mb-12">
  <h2 className="text-2xl font-bold mb-6">
    Popular {category.name} Tools
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {popularTools.map(tool => (
      <ToolCard key={tool.id} tool={tool} variant="featured" />
    ))}
  </div>
</section>
```

**Selection criteria** (configure in `POPULAR_TOOLS_BY_CATEGORY`):
- Most visited tools (analytics-driven)
- Tools with highest completion rates
- Seasonally relevant tools

### 2. Visual Hierarchy

```
[Featured] ────────────────────────────────
  ████  ████  ████  ████    ← 4 prominent cards
                             Gradient bg, larger icons

[All Tools] ───────────────────────────────
  ███  ███  ███              ← Standard 3-col grid
  ███  ███  ███              Alphabetical order
  ███  ███  ███              Consistent card size
```

### 3. Hover States for Engagement

```tsx
// Card lift effect
hover:shadow-lg hover:-translate-y-1 transition-all

// Icon animation
group-hover:scale-110 transition-transform

// Text color shift
group-hover:text-teal-600

// Border highlight
hover:border-teal-300
```

### 4. Empty State (if category has no tools)

```tsx
{tools.length === 0 && (
  <div className="text-center py-16">
    <p className="text-gray-500 mb-4">
      Tools for this category are coming soon.
    </p>
    <Link href="/" className="text-teal-600 hover:underline">
      Browse other categories →
    </Link>
  </div>
)}
```

### 5. Search Integration

Header search should:
- Filter across all categories
- Show category badges in results
- Prioritize exact matches
- Support fuzzy matching for typos

---

## SEO Implementation

### Metadata Generation

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  const seoConfig = CATEGORY_SEO_CONFIG[params.slug];

  return {
    title: `Free ${category.name} Tools Online | GoFreeTool`,
    description: seoConfig.description,
    keywords: [...seoConfig.keywords, "free tools", "online tools", "no signup"],
    openGraph: {
      title: `Free ${category.name} Tools Online`,
      description: seoConfig.description,
      url: `https://gofreetool.com/category/${params.slug}`,
      siteName: "GoFreeTool",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Free ${category.name} Tools Online`,
      description: seoConfig.description,
    },
    alternates: {
      canonical: `https://gofreetool.com/category/${params.slug}`,
    },
  };
}
```

### Static Generation

```tsx
export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}
```

### SEO Content Section

```tsx
<section className="mt-16 prose prose-gray dark:prose-invert max-w-none">
  <h2>About Our Free {category.name} Tools</h2>
  <div dangerouslySetInnerHTML={{ __html: seoConfig.seoContent }} />
</section>
```

**Content guidelines**:
- 250-400 words
- Include primary and secondary keywords
- Answer common user questions
- Mention specific tools by name (internal links)
- Update quarterly for freshness

### Sitemap Priority

```tsx
// sitemap.ts
{
  url: `https://gofreetool.com/category/${slug}`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.9,  // High priority (homepage = 1.0)
}
```

---

## Accessibility Checklist

- [ ] H1 contains category name (one per page)
- [ ] H2 for section headings (Popular Tools, All Tools, Related)
- [ ] Breadcrumb uses `<nav>` with `aria-label`
- [ ] Current breadcrumb has `aria-current="page"`
- [ ] Tool cards are keyboard navigable
- [ ] Icons have `aria-hidden="true"`
- [ ] Link text is descriptive (not "click here")
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus states visible on all interactive elements

---

## Performance Considerations

1. **Static generation** - Pre-render all category pages at build time
2. **Image optimization** - Use Next.js Image for tool icons if applicable
3. **Minimal JS** - Category pages are mostly static content
4. **Lazy loading** - Defer below-fold content on long category pages
5. **Font subsetting** - Only load required character sets
