# Privacy-Focused Microcopy

Tone: Confident, simple, non-legal. Focus on what we *don't* do.

---

## Homepage Trust Section

### Hero Tagline (under main headline)

**Option A (Current):**
> No signup. No tracking. Runs in your browser.

**Option B (Expanded):**
> Your data stays on your device. Always.

**Option C (Action-focused):**
> Use any tool instantly. Nothing leaves your browser.

---

### Trust Section (3-column layout)

**Column 1: Privacy**
```
🔒 Privacy First
Your data never leaves your browser. We can't see it, store it, or sell it.
```

**Column 2: No Account**
```
✨ No Signup Required
Jump straight to any tool. No email, no password, no friction.
```

**Column 3: Free**
```
💰 100% Free
Every tool, every feature. No paywalls, no premium tiers.
```

---

### Trust Section - Alternative Copy

**Privacy (Technical users):**
```
🔒 Client-Side Only
All processing happens in your browser via JavaScript. Zero server calls.
```

**Privacy (General users):**
```
🔒 What Happens Here Stays Here
Your numbers, text, and files never leave your device.
```

**Privacy (Reassurance-heavy):**
```
🔒 We Never See Your Data
Seriously. Your inputs aren't sent anywhere. Check the network tab yourself.
```

---

### Trust Banner (Full-width, optional)

**Short:**
> 🔒 Browser-based tools. Your data never touches our servers.

**Medium:**
> All tools run locally in your browser. We don't collect, store, or transmit your data. Ever.

**With CTA:**
> Your privacy matters. That's why every tool processes data locally in your browser. [Read our Privacy Policy →]

---

## Tool Page Reassurance Line

Place below the tool interface or in the privacy section.

### Single Line (Recommended)

**Universal:**
> 🔒 Your data stays in your browser. Nothing is sent to any server.

**Calculator-specific:**
> 🔒 Your numbers stay on your device. We never see your calculations.

**Text tool-specific:**
> 🔒 Your text is processed locally. Nothing leaves your browser.

**File tool-specific:**
> 🔒 Your files stay on your device. They're never uploaded anywhere.

**Encoder/Security tools:**
> 🔒 All encoding happens in your browser. Your data is never transmitted.

---

### Expandable FAQ Style (Current Implementation)

```
🔒 Is my data safe?

Yes. All processing happens in your browser. We don't store, send, or
track any of your data. Your inputs stay on your device.
```

**Alternative:**
```
🔒 Where does my data go?

Nowhere. Everything runs locally in your browser. We can't access your
inputs even if we wanted to.
```

**Technical version:**
```
🔒 How is my data processed?

Client-side JavaScript only. Your browser does all the work. No API calls,
no server processing, no data transmission.
```

---

### Inline Reassurance (Compact)

For tight spaces near inputs or outputs:

> 🔒 Processed locally

> 🔒 Never sent to servers

> 🔒 Stays on your device

> 🔒 100% browser-based

---

## Footer / Persistent Badge Copy

### Footer Privacy Line

**Short (single line):**
> All tools process data locally in your browser. We never collect or store your information.

**With link:**
> Your privacy is protected. All tools run in your browser. [Privacy Policy]

**Badge style:**
> 🔒 Privacy-First Tools — Your data never leaves your device

---

### Floating Badge (Bottom corner)

**Minimal:**
```
🔒 Browser-only
```

**Expanded on hover:**
```
🔒 Browser-only
Your data stays on your device
```

**With verification:**
```
🔒 No data sent
Verify: Open DevTools → Network
```

---

### Footer Trust Row (Icon badges)

```
[🔒 No Tracking]  [✨ No Signup]  [💰 100% Free]  [⚡ Instant Access]
```

Expanded on hover/tap:
- No Tracking → "Your data never leaves your browser"
- No Signup → "Use any tool without an account"
- 100% Free → "Every tool, every feature, always free"
- Instant Access → "No downloads or installations needed"

---

## Category-Specific Variations

### Calculators
> Your calculations stay private. Numbers in, results out—nothing stored.

### Health & Fitness
> Your health data is personal. That's why it never leaves your device.

### Developer Tools
> Process sensitive data safely. Everything runs client-side.

### Security & Encoding
> Encode and decode with confidence. Your data never touches our servers.

### Writing & Text
> Your words stay yours. Text processing happens entirely in your browser.

### Data Conversion
> Convert files locally. Your data is never uploaded or stored.

---

## Copy Don'ts

Avoid:
- ❌ "We take your privacy seriously" (overused, meaningless)
- ❌ "Your data is safe with us" (implies we have it)
- ❌ "Industry-standard encryption" (we don't need it—no transmission)
- ❌ "GDPR compliant" (legal jargon)
- ❌ "We may collect..." (creates doubt)
- ❌ "Rest assured" (sounds defensive)

Use instead:
- ✅ Specific statements about what happens (or doesn't)
- ✅ Technical accuracy without jargon
- ✅ Invitations to verify ("check the network tab")
- ✅ Simple declarative sentences

---

## Implementation Examples

### ToolLayout.tsx - Privacy Section

```tsx
<div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20
                border border-green-200 dark:border-green-800 rounded-lg">
  <span className="text-xl">🔒</span>
  <div>
    <p className="font-medium text-green-800 dark:text-green-200">
      Your data stays in your browser
    </p>
    <p className="text-sm text-green-700 dark:text-green-300">
      Nothing is sent to any server. All processing happens locally on your device.
    </p>
  </div>
</div>
```

### Homepage Trust Section

```tsx
<section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
  <div className="text-center">
    <div className="text-4xl mb-4">🔒</div>
    <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
    <p className="text-gray-600">
      Your data never leaves your browser. We can't see it, store it, or sell it.
    </p>
  </div>
  {/* ... other columns */}
</section>
```

### Floating Badge Component

```tsx
<div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2
                bg-white dark:bg-gray-800 border border-gray-200
                dark:border-gray-700 rounded-full shadow-lg text-sm">
  <span>🔒</span>
  <span className="text-gray-600 dark:text-gray-400">Browser-only</span>
</div>
```

---

## Quick Reference

| Placement | Length | Key Message |
|-----------|--------|-------------|
| Hero tagline | 6-10 words | No signup, no tracking |
| Trust section | 15-20 words each | Privacy, Free, No account |
| Tool page line | 10-15 words | Data stays in browser |
| Footer | 12-18 words | Local processing, no collection |
| Badge | 2-4 words | Browser-only |
