# Google Search Console Monitoring Playbook

A practical guide for monitoring a new tools website in GSC.

---

## Timeline Expectations

| Period | What to Expect | Focus |
|--------|----------------|-------|
| Week 1-2 | Minimal data, indexing begins | Submit sitemap, fix crawl errors |
| Week 3-4 | Pages start appearing | Monitor indexing coverage |
| Month 2-3 | Impressions grow, few clicks | Track which pages rank |
| Month 3-6 | Clicks increase, patterns emerge | Optimize based on data |
| Month 6+ | Stable baseline established | Ongoing optimization |

**Reality check:** New sites take 3-6 months to see meaningful organic traffic. Don't panic early.

---

## Weekly Check Routine

### Every Monday: 15-Minute Review

```
□ Performance overview (clicks, impressions trend)
□ Indexing status (any drops?)
□ New crawl errors
□ Manual actions (should be empty)
□ Security issues (should be empty)
```

### Quick Dashboard View

**Performance → Search Results**
- Date range: Last 28 days vs previous 28 days
- Check: Total clicks, impressions, CTR, position

**Healthy trends:**
```
Clicks:       ↑ or stable
Impressions:  ↑ (more visibility)
CTR:          2-5% for tools (varies by position)
Position:     Lower is better (1-10 ideal)
```

---

## Weekly Reports to Check

### 1. Performance Report

**Path:** Performance → Search results

**What to check:**

| Tab | Look For | Action |
|-----|----------|--------|
| Queries | Top search terms driving traffic | Note new queries, optimize pages |
| Pages | Which tools get impressions | Prioritize high-impression pages |
| Countries | Geographic distribution | Consider localization if concentrated |
| Devices | Mobile vs desktop split | Ensure mobile UX matches traffic |

**Filter by:**
- Last 28 days (stable view)
- Compare to previous period (trend)

**Export monthly** for tracking over time.

### 2. Indexing Report

**Path:** Indexing → Pages

**What to check:**

| Status | Meaning | Action |
|--------|---------|--------|
| Indexed | In Google | Good, no action |
| Discovered - not indexed | Found, not added | Wait or improve content |
| Crawled - not indexed | Evaluated, rejected | Improve page quality |
| Excluded by noindex | Intentionally hidden | Verify this is correct |
| Duplicate | Google chose canonical | Check canonical tags |

**Weekly goal:** All tool pages indexed.

### 3. Core Web Vitals

**Path:** Experience → Core Web Vitals

**What to check:**

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| LCP | < 2.5s | 2.5-4s | > 4s |
| INP | < 200ms | 200-500ms | > 500ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |

**Weekly goal:** All URLs in "Good" status.

### 4. Sitemaps

**Path:** Indexing → Sitemaps

**What to check:**
- Submitted vs indexed count
- Last read date (should be recent)
- Any errors

**Healthy state:**
```
Submitted:     60 URLs
Indexed:       55+ URLs (90%+ is good)
Last read:     Within 7 days
Status:        Success
```

---

## Early Warning Signs

### 🔴 Critical (Act Immediately)

| Signal | Meaning | Action |
|--------|---------|--------|
| Manual action notification | Google penalty | Follow removal instructions |
| Security issues alert | Site compromised | Fix immediately, request review |
| Indexed pages drop 50%+ | Deindexing | Check for noindex, robots.txt issues |
| Impressions drop 80%+ overnight | Algorithm or technical issue | Audit recent changes |

### 🟡 Warning (Investigate This Week)

| Signal | Meaning | Action |
|--------|---------|--------|
| Crawl errors spike | Site issues | Check server logs, fix 404s/500s |
| "Crawled - not indexed" growing | Quality concerns | Improve thin pages |
| Mobile usability errors | UX problems | Fix responsive issues |
| CWV moving to "Poor" | Performance regression | Audit recent deploys |
| Position dropping for key pages | Ranking loss | Check competition, content freshness |

### 🟢 Monitor (Note But Don't Panic)

| Signal | Meaning | Action |
|--------|---------|--------|
| Daily fluctuations ±20% | Normal variance | Track weekly averages instead |
| Some pages "Discovered - not indexed" | Google prioritizing | Wait 2-4 weeks |
| Position bouncing 5-15 to 20-30 | Ranking settling | Normal for new pages |
| CTR varies day to day | User behavior varies | Track monthly trends |

---

## When to Take Action

### Indexing Issues

**Scenario: Pages not getting indexed**

```
Timeline for new pages:
- Week 1-2: "Discovered - not indexed" (normal)
- Week 3-4: Should move to "Crawled" or "Indexed"
- Week 5+: If still not indexed, take action
```

**Actions:**
1. Request indexing via URL Inspection tool
2. Add internal links to the page
3. Ensure page has unique, valuable content
4. Check robots.txt isn't blocking
5. Verify no noindex tag

**Scenario: "Crawled - not indexed" pages**

This means Google saw the page but chose not to index it.

**Possible causes:**
- Thin content (< 300 words unique)
- Duplicate/similar to other pages
- Low-quality signals
- Site is too new (trust building)

**Actions:**
1. Add more unique content (conversion tables, formulas, FAQ)
2. Improve internal linking
3. Ensure page offers value beyond the tool itself
4. Wait—new sites need time to build trust

### Performance Issues

**Scenario: Impressions high, clicks low (CTR < 1%)**

| Position | Expected CTR | If Lower |
|----------|--------------|----------|
| 1-3 | 5-15% | Title/description issue |
| 4-10 | 2-5% | Improve snippet appeal |
| 11-20 | 0.5-2% | Normal, focus on ranking up |
| 20+ | < 0.5% | Normal, low visibility |

**Actions:**
1. Rewrite title tag (more compelling, include benefit)
2. Improve meta description (add CTA, unique value)
3. Add FAQ schema for rich results
4. Target featured snippet format

**Scenario: Rankings dropping for key pages**

```
Gradual decline over weeks → Content/competition issue
Sudden drop overnight → Technical or algorithm issue
```

**Actions for gradual decline:**
1. Update content (add fresh data, examples)
2. Analyze competitors who moved up
3. Add more internal links
4. Improve page experience

**Actions for sudden drop:**
1. Check for manual actions
2. Review recent site changes
3. Check robots.txt and noindex tags
4. Wait 1-2 weeks (algorithm fluctuation)

### Crawl Issues

**Scenario: Crawl errors increasing**

| Error Type | Cause | Fix |
|------------|-------|-----|
| 404 | Deleted/moved page | Redirect or restore |
| 500 | Server error | Check logs, fix code |
| Redirect error | Chain/loop | Simplify redirects |
| Blocked by robots.txt | Config error | Update robots.txt |

**Action threshold:** Fix when errors exceed 5% of total pages.

---

## What to Ignore Early On

### First 3 Months

| Metric | Why Ignore |
|--------|------------|
| Low total clicks | New sites need time |
| Position fluctuations | Rankings are settling |
| "Discovered - not indexed" | Normal queue |
| Day-to-day variations | Too noisy to act on |
| Low CTR on new pages | Need ranking data first |

### Always Ignore

| Signal | Why |
|--------|-----|
| Comparing to established competitors | Unfair comparison |
| Impression drops on weekends | Normal user behavior |
| Single-day performance dips | Statistical noise |
| Pages indexed count ≠ sitemap count | Google's discretion |
| "Excluded" pages that should be (404s, redirects) | Working as intended |

### False Alarms

**"Indexed pages dropped!"**
- Check if you removed pages intentionally
- Check date range (data delay is 2-3 days)
- Verify in URL Inspection tool

**"No data for today!"**
- GSC data has 2-3 day delay
- Check "Last updated" timestamp

**"CTR dropped!"**
- Did impressions increase? (more low-position impressions = lower CTR)
- Check by page, not sitewide

---

## Monthly Deep Dive

### First Week of Each Month

**1. Export and archive:**
- Performance data (queries, pages)
- Indexing status snapshot
- CWV status

**2. Compare month-over-month:**
```
| Metric | Last Month | This Month | Change |
|--------|------------|------------|--------|
| Clicks | X | Y | +/-% |
| Impressions | X | Y | +/-% |
| Avg CTR | X% | Y% | +/-% |
| Avg Position | X | Y | +/- |
| Indexed Pages | X | Y | +/- |
```

**3. Identify opportunities:**
- Pages with high impressions, low CTR → Improve titles
- Pages ranking 11-20 → Push to page 1
- New queries appearing → Create/optimize content
- Queries with no matching page → Content gap

### Query Analysis

**Find quick wins:**
```
Filter: Position 8-20, Impressions > 100
These are "striking distance" keywords—small improvements can reach page 1.
```

**Find content gaps:**
```
Filter: Queries where you rank but have no dedicated page
Consider creating targeted pages for high-volume queries.
```

---

## GSC Checklist by Site Age

### Week 1
```
□ Verify site ownership
□ Submit sitemap
□ Check robots.txt is correct
□ Request indexing for key pages
□ Set up email alerts
```

### Month 1
```
□ All pages discovered
□ No critical crawl errors
□ Core Web Vitals passing
□ Mobile usability clean
□ 50%+ pages indexed
```

### Month 3
```
□ 90%+ pages indexed
□ Impressions trending up
□ First clicks coming in
□ No manual actions
□ Position data available for key pages
```

### Month 6
```
□ Stable baseline established
□ Top queries identified
□ CTR benchmarks set
□ Monthly comparison possible
□ Optimization priorities clear
```

---

## Alert Setup

### Email Notifications

**Path:** Settings → Email preferences

**Enable:**
- [ ] Critical issues (always)
- [ ] New manual actions (always)
- [ ] Security issues (always)
- [ ] Significant indexing issues (recommended)

### Custom Monitoring

Set calendar reminders:
- **Weekly:** Monday 15-min check
- **Monthly:** First Monday deep dive
- **Quarterly:** Strategy review with 3-month data

---

## Quick Reference Card

### Weekly Check (15 min)
```
1. Performance: Clicks/impressions trend ✓
2. Indexing: Pages status ✓
3. Errors: Crawl issues ✓
4. Alerts: Manual actions/security ✓
```

### Action Triggers
```
🔴 Immediate: Manual action, security issue, 50%+ index drop
🟡 This week: Crawl errors spike, CWV degraded, key page ranking drop
🟢 Monitor: Daily fluctuations, new page not indexed yet
```

### Ignore Early On
```
- Low total clicks (first 3 months)
- Day-to-day variations
- Position bouncing for new pages
- "Discovered - not indexed" (first 4 weeks)
```

### Healthy Benchmarks (Month 6+)
```
Indexed:     90%+ of submitted pages
CTR:         2-5% overall (position dependent)
CWV:         All "Good"
Errors:      < 5% of pages
Growth:      Impressions trending up month-over-month
```
