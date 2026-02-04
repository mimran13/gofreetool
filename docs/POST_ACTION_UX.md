# Post-Action UX Patterns

Encourage continued usage after task completion. Non-intrusive, value-driven.

---

## Core Principles

1. **Value first** — User got what they came for before any prompt
2. **Contextual** — Suggestions relate to what they just did
3. **Inline** — No modals, no overlays, no interruptions
4. **Dismissible** — Easy to ignore without friction

---

## Action Completion States

### State Flow

```
[Input] → [Processing] → [Result] → [Post-Action Zone]
                                           │
                         ┌─────────────────┼─────────────────┐
                         │                 │                 │
                    Copy Result     Suggested Next     Try Another
                                        Action
```

### Post-Action Zone Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Result                                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Your output here...                                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  [Copy] [Download] [Clear]                    Primary actions│
│                                                             │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                             │
│  What's next?                              Post-action zone │
│  • Convert this to CSV → [CSV Converter]                    │
│  • Need more UUIDs? [Generate again]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Copy Examples by Context

### After Successful Calculation

**Neutral confirmation:**
> ✓ Calculated

**With next step:**
> ✓ Done · Need to calculate something else?

**With related tool:**
> ✓ Got your BMI · Want to check your ideal weight too?

### After Copy Action

**Simple:**
> ✓ Copied to clipboard

**With continuation:**
> ✓ Copied · Generate more?

**With share prompt:**
> ✓ Copied · Found this useful? Share with others

### After File Processing

**Download ready:**
> ✓ Ready · Download your file

**With alternative:**
> ✓ Processed · Need a different format?

### After Conversion

**Complete:**
> ✓ Converted · Copy or download your result

**With reverse option:**
> ✓ JSON ready · Need to convert back to CSV?

---

## Suggested Next Actions

### Pattern 1: Workflow Continuation

Suggest the logical next step in a workflow.

```tsx
const WORKFLOW_NEXT: Record<string, { prompt: string; tool: string; label: string }> = {
  'json-formatter': {
    prompt: 'Need to convert this?',
    tool: 'csv-json-converter',
    label: 'Convert to CSV',
  },
  'base64-encoder': {
    prompt: 'Working with URLs too?',
    tool: 'url-encoder-decoder',
    label: 'URL Encode/Decode',
  },
  'word-counter': {
    prompt: 'Check reading time?',
    tool: 'reading-time-calculator',
    label: 'Reading Time',
  },
  'bmi-calculator': {
    prompt: 'Want the full picture?',
    tool: 'bmr-calculator',
    label: 'Calculate BMR',
  },
  'percentage-calculator': {
    prompt: 'Planning a loan?',
    tool: 'emi-calculator',
    label: 'EMI Calculator',
  },
  'password-generator': {
    prompt: 'Need to hash it?',
    tool: 'hash-generator',
    label: 'Generate Hash',
  },
};
```

**Implementation:**
```tsx
{result && WORKFLOW_NEXT[tool.slug] && (
  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
    <p className="text-sm text-gray-500 mb-2">
      {WORKFLOW_NEXT[tool.slug].prompt}
    </p>
    <Link
      href={`/tools/${WORKFLOW_NEXT[tool.slug].tool}`}
      className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:underline"
    >
      {WORKFLOW_NEXT[tool.slug].label}
      <ArrowRightIcon className="w-3 h-3" />
    </Link>
  </div>
)}
```

### Pattern 2: Same Tool, New Input

Encourage repeat usage with fresh input.

**Copy:**
> Need another? [Generate again]

> Try with different values? [Reset]

> Run another calculation? [Clear & start over]

**Implementation:**
```tsx
{result && (
  <button
    onClick={handleReset}
    className="text-sm text-gray-500 hover:text-teal-600"
  >
    ↻ Try another
  </button>
)}
```

### Pattern 3: Related Tools Row

Show 2-3 related tools inline, not as cards.

```
Also useful: [Percentage Calculator] · [Tip Calculator] · [Split Bill]
```

**Implementation:**
```tsx
{result && relatedTools.length > 0 && (
  <div className="mt-4 text-sm text-gray-500">
    Also useful:{' '}
    {relatedTools.slice(0, 3).map((t, i) => (
      <span key={t.slug}>
        {i > 0 && ' · '}
        <Link href={`/tools/${t.slug}`} className="text-teal-600 hover:underline">
          {t.name}
        </Link>
      </span>
    ))}
  </div>
)}
```

### Pattern 4: Result-Aware Suggestions

Tailor suggestions based on the actual result.

```tsx
// BMI Calculator example
const getSuggestion = (bmi: number) => {
  if (bmi < 18.5) {
    return { text: 'Calculate calories needed', tool: 'calorie-calculator' };
  }
  if (bmi > 25) {
    return { text: 'Check your ideal weight', tool: 'ideal-weight-calculator' };
  }
  return { text: 'Calculate your BMR', tool: 'bmr-calculator' };
};
```

### Pattern 5: Quick Repeat Variants

For generators, offer quick variations.

```
┌─────────────────────────────────────────────┐
│  Generated: 8f14e45f-ceea-367a-a714-...     │
│                                             │
│  Quick generate:                            │
│  [1 more] [5 more] [10 more]               │
└─────────────────────────────────────────────┘
```

---

## Non-Intrusive Patterns

### Pattern 1: Delayed Appearance

Show suggestions 1-2 seconds after result, not instantly.

```tsx
const [showSuggestions, setShowSuggestions] = useState(false);

useEffect(() => {
  if (result) {
    const timer = setTimeout(() => setShowSuggestions(true), 1500);
    return () => clearTimeout(timer);
  }
  setShowSuggestions(false);
}, [result]);
```

### Pattern 2: Scroll-Triggered

Show "explore more" only when user scrolls past result.

```tsx
const [passedResult, setPassedResult] = useState(false);
const resultRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setPassedResult(!entry.isIntersecting),
    { threshold: 0 }
  );
  if (resultRef.current) observer.observe(resultRef.current);
  return () => observer.disconnect();
}, []);
```

### Pattern 3: Subtle Visual Hierarchy

Suggestions should be visually secondary to the result.

```tsx
// Result: prominent
<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
  <p className="font-medium text-green-800">{result}</p>
</div>

// Suggestion: subtle
<div className="mt-4 text-sm text-gray-500">
  <p>What's next?</p>
</div>
```

### Pattern 4: Single Suggestion

Don't overwhelm. One contextual suggestion beats three generic ones.

```
✓ Good: "Need to check your BMR too?"

✗ Bad:  "Try these: BMR Calculator, Ideal Weight, Calorie Counter,
         Body Fat Calculator, Macro Calculator..."
```

### Pattern 5: Dismissible Memory

Remember if user dismissed suggestions.

```tsx
const [dismissed, setDismissed] = useState(() => {
  return sessionStorage.getItem('dismissedSuggestions') === 'true';
});

const handleDismiss = () => {
  setDismissed(true);
  sessionStorage.setItem('dismissedSuggestions', 'true');
};
```

---

## Category-Specific Patterns

### Calculators

```
┌─────────────────────────────────────────────┐
│  Your EMI: ₹15,234/month                    │
│                                             │
│  [Copy] [View Breakdown]                    │
│                                             │
│  Planning ahead?                            │
│  → Check loan eligibility                   │
│  → Compare with fixed deposit returns       │
└─────────────────────────────────────────────┘
```

### Generators

```
┌─────────────────────────────────────────────┐
│  Your UUID                                  │
│  550e8400-e29b-41d4-a716-446655440000       │
│                                             │
│  [Copy] ✓                                   │
│                                             │
│  [Generate another] [Generate 10]           │
└─────────────────────────────────────────────┘
```

### Converters

```
┌─────────────────────────────────────────────┐
│  JSON Output                     [Copy]     │
│  ┌───────────────────────────────────────┐  │
│  │ {"name": "John", "age": 30}           │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [↔ Convert back to CSV] [Format JSON]      │
└─────────────────────────────────────────────┘
```

### Text Tools

```
┌─────────────────────────────────────────────┐
│  Word count: 342 · Characters: 1,847        │
│                                             │
│  More insights:                             │
│  → Reading time: ~2 min                     │
│  → [Check grammar] [Remove extra spaces]    │
└─────────────────────────────────────────────┘
```

### Health Tools

```
┌─────────────────────────────────────────────┐
│  Your BMI: 22.4 (Normal)                    │
│                                             │
│  Complete your health check:                │
│  ☐ BMR (Basal Metabolic Rate)              │
│  ☐ Ideal Weight Range                       │
│  ☐ Daily Calorie Needs                      │
└─────────────────────────────────────────────┘
```

---

## Component: PostActionZone

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PostActionZoneProps {
  tool: { slug: string; name: string };
  result: string | null;
  onReset: () => void;
  relatedTools?: { slug: string; name: string }[];
}

export function PostActionZone({ tool, result, onReset, relatedTools }: PostActionZoneProps) {
  const [visible, setVisible] = useState(false);
  const nextAction = WORKFLOW_NEXT[tool.slug];

  // Delay appearance
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [result]);

  if (!result || !visible) return null;

  return (
    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800
                    animate-fade-in space-y-3">
      {/* Primary: Repeat action */}
      <button
        onClick={onReset}
        className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
      >
        ↻ Try with different values
      </button>

      {/* Secondary: Workflow continuation */}
      {nextAction && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">{nextAction.prompt}</span>
          <Link
            href={`/tools/${nextAction.tool}`}
            className="text-teal-600 hover:underline"
          >
            {nextAction.label} →
          </Link>
        </div>
      )}

      {/* Tertiary: Related tools */}
      {relatedTools && relatedTools.length > 0 && (
        <p className="text-sm text-gray-400">
          Also:{' '}
          {relatedTools.slice(0, 2).map((t, i) => (
            <span key={t.slug}>
              {i > 0 && ', '}
              <Link href={`/tools/${t.slug}`} className="hover:text-teal-600">
                {t.name}
              </Link>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
```

---

## Animation: Fade In

```css
/* globals.css */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

---

## Engagement Without Annoyance

### Do

- ✓ Wait for task completion
- ✓ Offer one clear next step
- ✓ Keep suggestions contextual
- ✓ Use subtle visual treatment
- ✓ Make dismissal effortless

### Don't

- ✗ Show suggestions before result
- ✗ Use modals or overlays
- ✗ List 5+ options at once
- ✗ Auto-redirect anywhere
- ✗ Repeat dismissed prompts
- ✗ Add countdown timers
- ✗ Use urgency language ("Limited time!")

---

## Quick Reference

| Trigger | Copy | Action |
|---------|------|--------|
| Result shown | — | Show primary actions (Copy/Download) |
| After 1.5s | "What's next?" | Show workflow suggestion |
| User copies | "✓ Copied" | Show share prompt |
| User scrolls past | "Also useful:" | Show related tools |
| User resets | — | Clear suggestions |
