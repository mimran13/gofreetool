# GoFreeTool - Project Context

## What the Project Does

GoFreeTool is a **free web-based utility toolkit** providing 33+ calculators and tools for everyday use. Key value propositions:

- **Zero signup** - All tools accessible immediately
- **Privacy-first** - All calculations run client-side in browser (no server processing)
- **Offline-capable** - Works without internet after initial page load
- **No ads** (currently disabled)
- **Mobile responsive**

**Tool categories**: Financial calculators, health/fitness tools, text utilities, date/time helpers, home calculators, and fun/random generators.

---

## Architecture & Main Modules

```
gofreetool/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Header, Footer, CookieBanner, Analytics)
│   ├── page.tsx                # Homepage
│   ├── tools/
│   │   ├── [slug]/             # Dynamic tool router (switch statement maps slug → component)
│   │   │   ├── page.tsx        # Route handler + imports all tool components
│   │   │   ├── emi-calculator.tsx  # Original tools live here as sibling files
│   │   │   └── bmi-calculator.tsx
│   │   ├── bmr-calculator/     # Phase 3+ tools have own directories
│   │   │   └── page.tsx        # Self-contained tool component
│   │   └── ...
│   └── category/[slug]/        # Category listing pages
│
├── components/                 # Shared UI components
│   ├── ToolLayout.tsx          # Wrapper: breadcrumb, tool content, FAQ, related tools
│   ├── ToolCard.tsx            # Tool preview card
│   ├── Header.tsx / Footer.tsx
│   └── CookieBanner.tsx
│
├── lib/                        # Core logic
│   ├── tools.ts                # CENTRAL CONFIG: Tool/Category definitions
│   ├── utils.ts                # All calculation functions
│   ├── seo.ts                  # Metadata generation
│   └── analytics.ts            # Event tracking helpers
```

### Data Flow

1. **Tool Registration**: Add tool metadata to `lib/tools.ts`
2. **Utility Logic**: Add calculation function to `lib/utils.ts`
3. **Component**: Create React component using `ToolLayout` wrapper
4. **Routing**: Import & register in `app/tools/[slug]/page.tsx` (switch statement + `generateStaticParams`)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Fonts | Geist Sans/Mono |
| Analytics | Vercel Analytics |
| Hosting | Vercel |

**No external dependencies** for calculations - all logic is in `lib/utils.ts`.

---

## Conventions & Assumptions

### File Organization
- **Original tools** (Phase 1-2): Components in `app/tools/[slug]/` as sibling `.tsx` files
- **Newer tools** (Phase 3+): Each tool gets its own directory `app/tools/{slug}/page.tsx`
- This creates duplication in routing - both approaches work but are inconsistent

### Component Pattern
```tsx
'use client';  // All tools are client components

export default function MyCalculator() {
  const tool = getToolBySlug('my-calculator');  // Get metadata
  const [inputs, setInputs] = useState(...);
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    // Call utility from lib/utils.ts
    trackToolCalculate('my-calculator');  // Analytics
  };

  return (
    <ToolLayout tool={tool}>
      {/* Inputs → Calculate button → Results display */}
    </ToolLayout>
  );
}
```

### Naming Conventions
- Tool slugs: `kebab-case` (e.g., `bmi-calculator`)
- Component names: `PascalCase` matching slug (e.g., `BMICalculator`)
- Utility functions: `camelCase` prefixed with action (e.g., `calculateBMI`, `formatNumber`)

### Styling Patterns
- Tailwind utility classes throughout
- Color scheme: `teal-600` primary, `blue-600` buttons, `gray-*` backgrounds
- Dark mode classes present but may not be fully wired
- Animation class: `animate-slideIn` for results

### SEO
- Each tool defines `seo: { title, description, keywords }` in `lib/tools.ts`
- `generateMetadata` in route files pulls from tool config
- `generateStaticParams` enables static generation for all tool pages

---

## How to Reason About Changes

### Adding a New Tool

1. **Define metadata** in `lib/tools.ts`:
   - Add to `tools` array with unique `id`, `slug`, `category`, `seo`, `relatedTools`

2. **Add utility functions** to `lib/utils.ts` (if needed)

3. **Create component**:
   - Either in `app/tools/[slug]/my-tool.tsx` (original pattern)
   - Or `app/tools/my-tool/page.tsx` (newer pattern - preferred)
   - Use `'use client'`, `ToolLayout` wrapper, track analytics

4. **Register route** in `app/tools/[slug]/page.tsx`:
   - Add import
   - Add to `generateStaticParams` array
   - Add case to switch statement

### Modifying Existing Tools

- **UI changes**: Edit the tool's component file directly
- **Calculation logic**: Modify functions in `lib/utils.ts`
- **Metadata (title, description)**: Edit `lib/tools.ts`
- **Add related tools**: Update `relatedTools` array in tool config

### Key Invariants

- **Client-side only**: Never add server-side data fetching to tool calculations
- **No data persistence**: Tools should not save user data
- **Self-contained**: Each tool should work independently
- **ToolLayout required**: All tools must use the `ToolLayout` wrapper for consistent UX

### Watch Out For

- **Routing duplication**: The `[slug]/page.tsx` switch statement must stay in sync with `generateStaticParams` and the actual component files
- **Import paths**: Phase 3+ tools use `../tool-name/page` relative imports from the [slug] router
- **Analytics**: Call `trackToolCalculate` on calculate, `trackCopyClick` on copy actions

---

## Current Tools (33 total)

### Calculators (10)
- emi-calculator, percentage-calculator, discount-calculator, split-bill-calculator
- simple-interest-calculator, compound-interest-calculator, savings-goal-calculator
- tip-calculator, loan-eligibility-calculator, rent-split-calculator

### Health & Fitness (5)
- bmi-calculator, water-intake-calculator, bmr-calculator
- ideal-weight-calculator, step-calorie-converter

### Writing & Text (5)
- word-counter, text-case-converter, remove-extra-spaces
- line-sorter, duplicate-line-remover

### Date & Time (4)
- age-calculator, date-difference-calculator, day-of-week-finder, workdays-calculator

### Home & Daily Life (4)
- paint-area-calculator, electricity-bill-calculator
- appliance-energy-calculator, fuel-cost-calculator

### Fun & Random (5)
- random-number-generator, random-password-generator, lucky-number-generator
- yes-no-spinner, decision-wheel

---

## Quick Reference: Adding a Tool

```bash
# 1. Add to lib/tools.ts (in tools array)
# 2. Add utility to lib/utils.ts (if needed)
# 3. Create component: app/tools/my-tool/page.tsx
# 4. Register in app/tools/[slug]/page.tsx:
#    - Add import
#    - Add to generateStaticParams
#    - Add switch case
```
