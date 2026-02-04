# Standard Tool Page Layout

## Page Structure

```
ToolLayout (wrapper)
├── Breadcrumbs
├── Header (icon + title + description)
├── Tool Card
│   ├── Input Section
│   ├── Actions
│   └── Output Section
├── Privacy Notice
├── How to Use
├── FAQ (details/summary)
└── Related Tools
```

## Component Patterns

### Header
```tsx
<div className="text-4xl mb-4">{icon}</div>
<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
  {title}
</h1>
<p className="text-lg text-gray-600 dark:text-gray-400">{description}</p>
```

### Input Section
```tsx
// Text input
<input
  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600
             dark:bg-gray-700 dark:text-white rounded-lg
             focus:ring-2 focus:ring-teal-500 focus:border-transparent"
/>

// Textarea
<textarea
  className="w-full h-64 px-4 py-3 font-mono text-sm border border-gray-300
             dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg
             focus:ring-2 focus:ring-teal-500 resize-none"
/>

// File upload
<div className="border-2 border-dashed border-gray-300 dark:border-gray-600
                rounded-xl p-12 hover:border-teal-500 transition-colors cursor-pointer">
  <input type="file" className="hidden" />
</div>
```

### Output Section
```tsx
<textarea
  value={output}
  readOnly
  className="w-full h-48 px-4 py-3 font-mono text-sm border border-gray-300
             dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-lg"
/>
```

### Action Buttons
```tsx
// Primary (main action)
<button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white
                   font-semibold rounded-lg transition-colors disabled:opacity-50">

// Secondary
<button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300
                   dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg">

// Quick selectors
<div className="flex flex-wrap gap-2">
  {options.map(opt => (
    <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700
                       hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
```

---

## UX Rules

### Empty State
- Show placeholder text in inputs
- Disable action buttons when input is empty
- Display helpful prompt: "Enter text above to get started"

### Error State
```tsx
{error && (
  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200
                  dark:border-red-800 rounded-lg">
    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
  </div>
)}
```

### Success State
```tsx
<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200
                dark:border-green-800 rounded-lg">
  <p className="text-sm text-green-700 dark:text-green-400">{message}</p>
</div>
```

### Copy Feedback
```tsx
const [copied, setCopied] = useState(false);

const handleCopy = async () => {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

<button>{copied ? 'Copied!' : 'Copy'}</button>
```

### Input Validation
- Validate in real-time on change
- Show inline error messages
- Disable submit button until valid
- Clear error when input changes

---

## Accessibility

### Required
- All inputs have associated `<label>` elements
- Use `aria-label` for icon-only buttons
- Focus states visible (`focus:ring-2 focus:ring-teal-500`)
- Color contrast meets WCAG AA (4.5:1 for text)
- Error messages linked via `aria-describedby`

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order (input → actions → output)
- Enter key submits primary action
- Escape clears/resets where appropriate

### Screen Readers
```tsx
// Announce status changes
<div role="status" aria-live="polite">{statusMessage}</div>

// Describe button actions
<button aria-label="Copy result to clipboard">
```

---

## Mobile-First Design

### Breakpoints
```
Base    → Mobile (< 640px)
sm:     → Small tablets (640px+)
md:     → Tablets (768px+)
lg:     → Desktop (1024px+)
```

### Responsive Patterns
```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-4">

// Single column on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// Responsive text sizes
<h1 className="text-3xl sm:text-4xl">

// Full-width buttons on mobile
<button className="w-full sm:w-auto">
```

### Touch Targets
- Minimum 44x44px touch target size
- Adequate spacing between interactive elements (gap-2 minimum)
- Larger padding on mobile inputs (`py-3`)

### Mobile Considerations
- Avoid horizontal scroll
- Keep primary action visible without scrolling
- Use bottom sheet patterns for complex options
- Test with on-screen keyboard open

---

## State Management Pattern

```tsx
'use client';

import { useState, useCallback } from 'react';

export default function ToolPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = useCallback(() => {
    setError('');
    try {
      const result = process(input);
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
  }, [input]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <ToolLayout tool={toolMetadata}>
      {/* Input */}
      {/* Actions */}
      {/* Output */}
      {/* Error display */}
    </ToolLayout>
  );
}
```

---

## Color Reference

| Purpose   | Light Mode       | Dark Mode              |
|-----------|------------------|------------------------|
| Primary   | `teal-600`       | `teal-500`             |
| Secondary | `gray-200`       | `gray-700`             |
| Success   | `green-50/600`   | `green-900/20, 400`    |
| Error     | `red-50/600`     | `red-900/20, 400`      |
| Warning   | `yellow-50/600`  | `yellow-900/20, 400`   |
| Text      | `gray-700`       | `gray-300`             |
| Background| `white`          | `gray-800`             |
| Border    | `gray-300`       | `gray-600`             |
