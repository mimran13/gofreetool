# Tool Prioritization Framework

A scoring model for deciding which tools to build next.

---

## Scoring Overview

| Factor | Weight | Score Range |
|--------|--------|-------------|
| Search Intent | 35% | 1-5 |
| Build Complexity | 25% | 1-5 (inverted) |
| Reusability | 20% | 1-5 |
| Monetization Potential | 20% | 1-5 |

**Formula:**
```
Priority Score = (Search × 0.35) + (Complexity × 0.25) + (Reusability × 0.20) + (Monetization × 0.20)
```

**Threshold:** Build tools scoring ≥ 3.5

---

## Factor 1: Search Intent (35%)

How many people actively search for this tool?

### Scoring Criteria

| Score | Monthly Searches | Indicator |
|-------|------------------|-----------|
| 5 | 50,000+ | High-volume head term |
| 4 | 10,000-50,000 | Solid demand |
| 3 | 2,000-10,000 | Moderate niche |
| 2 | 500-2,000 | Small audience |
| 1 | <500 | Minimal search volume |

### How to Measure

**Free tools:**
- Google Keyword Planner (requires Ads account)
- Ubersuggest (limited free searches)
- Google Trends (relative comparison)

**Paid tools:**
- Ahrefs / SEMrush (exact volumes)
- Keywords Everywhere (cheap, browser extension)

### Search Patterns to Target

| Pattern | Example | Value |
|---------|---------|-------|
| "[thing] calculator" | "BMI calculator" | High |
| "[thing] converter" | "CSV to JSON converter" | High |
| "[thing] generator" | "UUID generator" | High |
| "free [tool] online" | "free PDF compressor online" | High |
| "how to calculate [thing]" | "how to calculate EMI" | Medium |
| "[tool] without signup" | "image resizer without signup" | Medium |

### Bonus Points

- +0.5 if keyword difficulty < 30
- +0.5 if no strong free competitor
- +0.5 if trending upward (Google Trends)

---

## Factor 2: Build Complexity (25%)

How much effort to build and maintain? **Score is inverted** (lower complexity = higher score).

### Scoring Criteria

| Score | Complexity | Build Time | Examples |
|-------|------------|------------|----------|
| 5 | Trivial | < 2 hours | Text case converter, character counter |
| 4 | Simple | 2-4 hours | Percentage calculator, word counter |
| 3 | Moderate | 4-8 hours | JSON formatter, color picker |
| 2 | Complex | 1-2 days | Image resizer, CSV converter |
| 1 | Very Complex | 3+ days | PDF tools, OCR, video processing |

### Complexity Factors

| Factor | Impact |
|--------|--------|
| Client-side only | -1 complexity |
| Needs file upload | +1 complexity |
| Needs canvas/image processing | +1 complexity |
| Needs external API | +2 complexity |
| Needs server processing | +2 complexity |
| Needs real-time preview | +1 complexity |

### Reusable Patterns (Reduce Complexity)

Already built:
- Text input → process → text output
- Number inputs → calculate → display result
- File upload → process → download
- Dual-mode converter (A↔B)

**If pattern exists:** -1 from complexity estimate

---

## Factor 3: Reusability (20%)

Can components/logic be reused for other tools?

### Scoring Criteria

| Score | Reusability | Description |
|-------|-------------|-------------|
| 5 | Platform | Creates shared infrastructure (file upload, export) |
| 4 | Category | Enables 3+ similar tools in same category |
| 3 | Moderate | Components useful for 1-2 other tools |
| 2 | Limited | Some utility functions reusable |
| 1 | None | Completely standalone, one-off |

### High-Reusability Examples

| Tool | Unlocks |
|------|---------|
| Image upload component | All image tools (resize, compress, convert, crop) |
| File parser (CSV) | CSV viewer, CSV to JSON, CSV editor |
| Color picker | Contrast checker, palette generator, gradient maker |
| Unit conversion engine | Length, weight, temperature, currency converters |
| Text processing utils | Word count, character count, case convert, line sort |

### Scoring Shortcut

Ask: "If I build this, how many other tools become easier?"
- 0 tools → Score 1
- 1-2 tools → Score 2-3
- 3-4 tools → Score 4
- 5+ tools → Score 5

---

## Factor 4: Monetization Potential (20%)

Can this tool generate revenue (ads, affiliates, premium)?

### Scoring Criteria

| Score | Potential | Indicators |
|-------|-----------|------------|
| 5 | High | Commercial intent, high CPM niche, natural affiliate fit |
| 4 | Good | Professional users, repeat usage, ad-friendly |
| 3 | Moderate | General audience, decent session time |
| 2 | Low | Quick in-and-out usage, low CPM |
| 1 | Minimal | Technical users (ad blockers), one-time use |

### Monetization Signals

**High value (Score 4-5):**
- Finance tools (loan, mortgage, investment calculators)
- Business tools (invoice, ROI calculators)
- Health tools (insurance-adjacent)
- Real estate tools
- Professional developer tools

**Medium value (Score 3):**
- Design tools (creative professionals)
- Writing tools (content creators)
- Conversion tools (general utility)

**Lower value (Score 1-2):**
- Fun/random generators
- Highly technical dev tools
- One-click utilities

### Revenue Models by Tool Type

| Tool Type | Best Model |
|-----------|------------|
| Calculators (finance) | Display ads, affiliate (loan providers) |
| Image tools | Freemium (batch processing), ads |
| PDF tools | Freemium (file size limits), ads |
| Dev tools | Sponsorships, job board ads |
| Text tools | Display ads |
| Converters | Display ads, API access |

---

## Scoring Template

```markdown
## Tool: [Name]

### Search Intent (×0.35)
- Monthly searches: [X]
- Keyword difficulty: [X]
- Competition: [Strong/Moderate/Weak]
- Trend: [Up/Stable/Down]
- **Score: [1-5]** + bonuses: [X]

### Build Complexity (×0.25)
- Estimated time: [X hours/days]
- Pattern exists: [Yes/No]
- Special requirements: [List]
- **Score: [1-5]** (inverted)

### Reusability (×0.20)
- Components created: [List]
- Tools unlocked: [X]
- **Score: [1-5]**

### Monetization (×0.20)
- User intent: [Commercial/Informational/Navigational]
- Niche CPM: [High/Medium/Low]
- Affiliate potential: [Yes/No]
- **Score: [1-5]**

### Total Score
(Search × 0.35) + (Complexity × 0.25) + (Reusability × 0.20) + (Monetization × 0.20)
= **[X.XX]**

### Decision: [BUILD / DEFER / SKIP]
```

---

## Example Evaluations

### Example 1: Mortgage Calculator

| Factor | Score | Weighted |
|--------|-------|----------|
| Search Intent | 5 (100K+ searches) | 1.75 |
| Complexity | 4 (simple math, existing pattern) | 1.00 |
| Reusability | 3 (loan calc patterns) | 0.60 |
| Monetization | 5 (finance, affiliate potential) | 1.00 |
| **Total** | | **4.35** ✓ BUILD |

### Example 2: Regex Tester

| Factor | Score | Weighted |
|--------|-------|----------|
| Search Intent | 4 (30K searches) | 1.40 |
| Complexity | 2 (real-time parsing, edge cases) | 0.50 |
| Reusability | 2 (standalone) | 0.40 |
| Monetization | 2 (dev audience, ad blockers) | 0.40 |
| **Total** | | **2.70** → DEFER |

### Example 3: Color Palette Generator

| Factor | Score | Weighted |
|--------|-------|----------|
| Search Intent | 4 (25K searches) | 1.40 |
| Complexity | 3 (color theory, UI) | 0.75 |
| Reusability | 5 (unlocks: contrast checker, gradient maker, color converter) | 1.00 |
| Monetization | 3 (designers, moderate CPM) | 0.60 |
| **Total** | | **3.75** ✓ BUILD |

### Example 4: QR Code Generator

| Factor | Score | Weighted |
|--------|-------|----------|
| Search Intent | 5 (200K+ searches) | 1.75 |
| Complexity | 3 (library-based, customization) | 0.75 |
| Reusability | 2 (standalone) | 0.40 |
| Monetization | 3 (business users) | 0.60 |
| **Total** | | **3.50** ✓ BUILD |

---

## Quick Prioritization Matrix

For rapid decisions without full scoring:

```
                    HIGH SEARCH VOLUME
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         │   BUILD NEXT    │   BUILD IF      │
         │   (Quick wins)  │   (Worth effort)│
         │                 │                 │
LOW ─────┼─────────────────┼─────────────────┼───── HIGH
COMPLEXITY                 │                 │      COMPLEXITY
         │                 │                 │
         │   CONSIDER      │   SKIP          │
         │   (If reusable) │   (Not worth it)│
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                    LOW SEARCH VOLUME
```

**Priority order:**
1. High search + Low complexity → Build immediately
2. High search + High complexity → Build if strategically important
3. Low search + Low complexity → Build if enables other tools
4. Low search + High complexity → Skip unless unique value

---

## Tool Ideas Backlog Template

| Tool | Search | Complexity | Reuse | Money | Score | Status |
|------|--------|------------|-------|-------|-------|--------|
| Mortgage Calculator | 5 | 4 | 3 | 5 | 4.35 | TODO |
| QR Code Generator | 5 | 3 | 2 | 3 | 3.50 | TODO |
| Regex Tester | 4 | 2 | 2 | 2 | 2.70 | Defer |
| PDF Merger | 5 | 1 | 4 | 4 | 3.55 | TODO |
| ... | | | | | | |

---

## Review Cadence

- **Weekly:** Score 2-3 new tool ideas
- **Monthly:** Re-evaluate deferred tools
- **Quarterly:** Audit scoring weights based on actual performance

---

## Adjusting Weights

Shift weights based on current goals:

| Goal | Search | Complexity | Reuse | Money |
|------|--------|------------|-------|-------|
| Growth (default) | 35% | 25% | 20% | 20% |
| Speed to market | 25% | 40% | 20% | 15% |
| Platform building | 25% | 20% | 35% | 20% |
| Revenue focus | 30% | 20% | 15% | 35% |
