# Lightweight Shareability Design

Non-intrusive sharing features. No accounts, no popups, no dark patterns.

---

## Core Principles

1. **Earn the share** — Only prompt after delivering value
2. **One-click action** — No modals, no multi-step flows
3. **Respect attention** — Inline placement, never interruptive
4. **Useful defaults** — Pre-fill smart copy, ready to paste

---

## When to Prompt Sharing

### Trigger Points (In Order of Priority)

| Trigger | Timing | Why It Works |
|---------|--------|--------------|
| **After successful result** | User copies output | Peak satisfaction moment |
| **After repeat use** | 3+ calculations in session | Engaged user, likely to recommend |
| **On bookmark/favorite** | User saves tool | Already signaling value |
| **End of tool section** | Scrolls past results | Natural content break |

### When NOT to Prompt

- ❌ On page load
- ❌ Before tool is used
- ❌ During active input
- ❌ On error states
- ❌ In modals or overlays

---

## Share Mechanics

### 1. Copy Link (Primary)

Simplest, highest conversion. Works everywhere.

```tsx
const handleCopyLink = async () => {
  const url = `${window.location.origin}/tools/${tool.slug}`;
  await navigator.clipboard.writeText(url);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};
```

### 2. Native Share API (Mobile)

Use Web Share API when available, fallback to copy.

```tsx
const handleShare = async () => {
  const shareData = {
    title: tool.name,
    text: `Check out this free ${tool.name}`,
    url: `${window.location.origin}/tools/${tool.slug}`,
  };

  if (navigator.share && navigator.canShare(shareData)) {
    await navigator.share(shareData);
  } else {
    handleCopyLink(); // Fallback
  }
};
```

### 3. Direct Platform Links (Optional)

For users who prefer specific platforms. No tracking pixels.

```tsx
const shareUrls = {
  twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`,
};
```

---

## UX Placement Ideas

### Placement 1: Post-Copy Nudge (Recommended)

After user copies result, show subtle inline prompt.

```
┌─────────────────────────────────────────────┐
│  Output                                     │
│  ┌───────────────────────────────────────┐  │
│  │ 550e8400-e29b-41d4-a716-446655440000  │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Copy] ✓ Copied!                           │
│                                             │
│  ────────────────────────────────────────   │
│  Found this useful? [Share this tool →]    │  ← Appears after copy
└─────────────────────────────────────────────┘
```

**Implementation:**
```tsx
{copied && (
  <p className="text-sm text-gray-500 mt-3 animate-fade-in">
    Found this useful?{' '}
    <button
      onClick={handleShare}
      className="text-teal-600 hover:underline"
    >
      Share this tool →
    </button>
  </p>
)}
```

### Placement 2: Result Card Footer

Persistent but unobtrusive. Below the result area.

```
┌─────────────────────────────────────────────┐
│  Your BMI: 22.4 (Normal weight)             │
│                                             │
│  [Copy Result]                              │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │ 🔗 Share  │  📋 Copy Link              ││  ← Subtle icon row
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

**Implementation:**
```tsx
{result && (
  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600"
    >
      <LinkIcon className="w-4 h-4" />
      Share tool
    </button>
  </div>
)}
```

### Placement 3: Floating Action (Mobile)

Bottom-right corner, appears after scroll or result.

```
                                    ┌──────┐
                                    │  ↗  │  ← Share icon
                                    └──────┘
```

**Implementation:**
```tsx
{showShareButton && (
  <button
    onClick={handleShare}
    className="fixed bottom-20 right-4 p-3 bg-teal-600 text-white
               rounded-full shadow-lg md:hidden"
    aria-label="Share this tool"
  >
    <ShareIcon className="w-5 h-5" />
  </button>
)}
```

### Placement 4: Related Tools Section

Natural spot for "share with others" messaging.

```
┌─────────────────────────────────────────────┐
│  Related Tools                              │
│  ┌─────┐  ┌─────┐  ┌─────┐                  │
│  │Tool1│  │Tool2│  │Tool3│                  │
│  └─────┘  └─────┘  └─────┘                  │
│                                             │
│  Know someone who'd find this useful?       │
│  [Copy link to share]                       │  ← End of section CTA
└─────────────────────────────────────────────┘
```

### Placement 5: Breadcrumb Row (Desktop)

Minimal, always visible, doesn't take extra space.

```
Free Online Tools / Calculators / BMI Calculator     [🔗 Share]
```

---

## Share Copy Examples

### Tool-Agnostic (Default)

**Short:**
> Check out this free {tool.name}

**With benefit:**
> Free {tool.name} - no signup, works in browser

**With URL:**
> {tool.name} - {url}

### Category-Specific Copy

**Calculators:**
> Free online {tool.name} - instant results, no signup needed

**Developer Tools:**
> Useful tool: {tool.name}. Browser-based, no install required.

**Text Tools:**
> {tool.name} - paste text, get instant results. No signup.

**Health Tools:**
> Calculate your {metric} for free: {url}

**Converters:**
> Quick {from} to {to} converter. Free, browser-based: {url}

### Result-Aware Copy (Advanced)

When sharing includes the result:

```tsx
const getShareText = (tool: Tool, result?: string) => {
  if (!result) {
    return `Check out this free ${tool.name}`;
  }

  // Tool-specific result sharing
  switch (tool.slug) {
    case 'bmi-calculator':
      return `Just calculated my BMI. Try this free calculator:`;
    case 'password-generator':
      return `Great password generator - free, browser-based:`;
    case 'uuid-generator':
      return `Free UUID generator - ${result.split('\n').length} UUIDs in one click:`;
    default:
      return `Check out this free ${tool.name}`;
  }
};
```

### Platform-Specific Copy

**Twitter (280 char limit):**
> 🛠️ {tool.name} - free, no signup, browser-based. {url}

**LinkedIn (Professional tone):**
> Useful free tool for {use case}: {tool.name}. No account required, processes data locally in browser. {url}

**Email:**
> Subject: Free {tool.name} I found useful
>
> Hey,
>
> Thought you might find this useful: {tool.name}
>
> It's free, doesn't require signup, and runs entirely in your browser.
>
> {url}

**Reddit:**
> {tool.name} - browser-based, no signup [Free Tool]

---

## Share Button Component

```tsx
'use client';

import { useState } from 'react';

interface ShareButtonProps {
  tool: { name: string; slug: string; shortDescription: string };
  variant?: 'inline' | 'icon' | 'full';
  className?: string;
}

export function ShareButton({ tool, variant = 'inline', className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const url = `https://gofreetool.com/tools/${tool.slug}`;
  const text = `${tool.name} - free, browser-based. No signup needed.`;

  const handleShare = async () => {
    const shareData = { title: tool.name, text, url };

    // Try native share first (mobile)
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        // User cancelled or error - fall through to copy
      }
    }

    // Fallback: copy link
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        className={`p-2 text-gray-500 hover:text-teal-600 rounded-lg
                    hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
        aria-label="Share this tool"
        title="Share this tool"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-600
                    dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400
                    border border-gray-200 dark:border-gray-700 rounded-lg
                    hover:border-teal-300 transition-colors ${className}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {copied ? 'Link copied!' : 'Share this tool'}
      </button>
    );
  }

  // Default: inline text link
  return (
    <button
      onClick={handleShare}
      className={`text-sm text-teal-600 hover:underline ${className}`}
    >
      {copied ? '✓ Link copied!' : 'Share this tool →'}
    </button>
  );
}
```

---

## Analytics (Privacy-Safe)

Track share intent without identifying users:

```tsx
// Simple counter - no user data
const trackShare = (toolSlug: string, method: 'copy' | 'native' | 'platform') => {
  // Increment anonymous counter
  fetch('/api/analytics/share', {
    method: 'POST',
    body: JSON.stringify({ tool: toolSlug, method }),
  });
};
```

What to measure:
- Share button clicks per tool
- Copy link vs native share ratio
- Most shared tools (for featuring)

---

## Implementation Priority

### Phase 1: Copy Link (Now)
- Add `ShareButton` component
- Place after result in ToolLayout
- Show on copy success

### Phase 2: Native Share (Mobile)
- Detect Web Share API support
- Use native share on mobile
- Fallback to copy on desktop

### Phase 3: Platform Links (Optional)
- Add Twitter/LinkedIn/Reddit direct links
- Show as expandable row
- No tracking pixels

---

## Quick Reference

| Placement | Trigger | Copy |
|-----------|---------|------|
| Post-copy nudge | After copying result | "Found this useful? Share →" |
| Result footer | After result shows | Icon + "Share tool" |
| Floating button | Scroll + result (mobile) | Share icon only |
| Related tools | Always visible | "Know someone who'd find this useful?" |
| Breadcrumb row | Always visible (desktop) | "Share" link |
