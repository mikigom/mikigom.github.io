# index.md Modern-Editorial Redesign Design Spec

## Goal

Refresh the visual design of `index.md` (the CV landing page) for stronger aesthetic and readability, in a **modern editorial** direction. Replace the current dark-gradient hero + shadowed-card grid with a light, typography-forward layout using a serif headline, a restrained deep-teal accent, and a section system marked by a left accent bar instead of boxed cards. Publications and all other sections inherit the new system consistently.

## Design Direction

- **Style**: Modern editorial — refined visual hierarchy, generous whitespace, content-first
- **Scope**: Full refresh (hero + typography + cards/sections + publications + all long-tail sections)
- **Hero**: Option C pattern (serif name + circular portrait + light background + restrained teal)
- **Sections**: Option A pattern (no card boxes, left teal accent bar, flat background)
- **Typography**: Fraunces (serif, headings) + Inter (sans, body)
- **Accent color**: Deep Teal `#0a7a6b` (replaces the current brighter `#0fbf9f`)

## Design Tokens

Add to / replace values in `:root` of `assets/styles.scss`:

```css
:root {
  --bg: #fafaf8;              /* warm off-white (was #f6f8fb cool) */
  --surface: #ffffff;
  --ink: #0f1216;             /* primary text (was #0f172a) */
  --ink-2: #2a2d33;           /* secondary text */
  --muted: #6b7280;
  --muted-2: #9aa0a6;
  --rule: #e3e6ea;            /* hairline */
  --rule-soft: #eef0f3;       /* softer hairline */
  --accent: #0a7a6b;          /* Deep Teal (was #0fbf9f) */
  --accent-strong: #086357;   /* hover/active */
  --accent-soft: #e8f2ef;     /* tag/chip background */
  --accent-border: #c4ddd6;   /* tag/chip border */
}
```

Legacy `--card-bg` / `--card-border` become unused (remove after migration). Legacy `--text` is renamed to `--ink`.

## Typography

Load both webfonts via `_config.yml` `font_urls` (replacing the current Noto Sans KR include, which isn't used on this English page):

```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap
```

Body font stack (unchanged primary, add Fraunces-only class):

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-feature-settings: "kern" 1, "ss01" 1;
}
.serif, h1, h2, h3, h4, .pub-title, .section h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 500;
  letter-spacing: -0.015em;
}
```

Type scale:

| Use | Font | Size | Line-height | Weight |
|---|---|---|---|---|
| Hero h1 | Fraunces | 72px (desktop) / 48px (≤768) | 1.0 | 500 |
| Section h2 | Fraunces | 28px | 1.1 | 500 |
| Publication title | Fraunces | 19px | 1.3 | 500 |
| Awards year | Fraunces | 20px | 1.0 | 500 |
| Lede | Inter | 17px | 1.65 | 400 |
| Body / list item | Inter | 15px | 1.55 | 400 |
| Eyebrow / section number / status | Inter | 11–12px caps | 1 | 600 |
| Date column | Inter | 13px tabular | 1 | 500 |

## Page Structure

Target layout (applied to `index.md`):

```
┌────────────────────────────────────────────────────┐
│ Topbar:  brand ————————————————— ● status         │  ← new
├────────────────────────────────────────────────────┤
│                                                    │
│  eyebrow (caps)                                    │
│  JUNGHOON SEO               ┌───────────┐          │
│  (Fraunces 72px)            │  240×240  │          │
│  lede (Inter 17px)          │ portrait  │          │
│  chips . . . . . . .        │  circle   │          │
│  [Email]  LinkedIn ↗        └───────────┘          │
│           Scholar ↗         caption below          │
│                                                    │
├────────────────────────────────────────────────────┤
│ ║ Career                            § 01          │  ← left teal bar
│ ║ date column │ role + company                    │
│ ║ …                                                │
├────────────────────────────────────────────────────┤
│ ║ Education                         § 02          │
│ …                                                  │
├────────────────────────────────────────────────────┤
│ ║ Specialties § 03    │  ║ Current Focus § 04     │  ← twocol
├────────────────────────────────────────────────────┤
│ ║ Publications                      § 05 · 24     │
│ ║ [thumb 160×100] │ Title (Fraunces 19px)         │
│ ║                 │ authors · [TAG] 2026 · links  │
│ …                                                  │
├────────────────────────────────────────────────────┤
│ ║ Working Titles § 06 │ ║ Awards & Honors § 07    │  ← twocol
│                     │ 2024 (Fraunces) │ desc      │
├────────────────────────────────────────────────────┤
│ ║ Invited Talks § 08 │ ║ Review Services § 09     │  ← twocol
├────────────────────────────────────────────────────┤
│ ║ Patents                           § 10 · 8      │
│ ║ description  [granted]  │ 10-XXXXXXX            │
├────────────────────────────────────────────────────┤
│ footer ————————————————————————— right meta       │
└────────────────────────────────────────────────────┘
```

Max page width: `1060px`. Page padding: `48px 40px 96px` (desktop), `32px 20px 64px` (≤768).

## Section System

All non-hero sections use the same **borderless + accent bar** primitive:

```html
<section class="section">
  <header class="section__head">
    <h2>Career</h2>
    <span class="section__num">§ 01</span>
  </header>
  <!-- content -->
</section>
```

```css
.section {
  margin-top: 56px;
  padding-left: 18px;
  position: relative;
}
.section::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 3px;
  height: calc(100% - 8px);
  background: var(--accent);
  opacity: 0.9;
}
.section__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
}
.section__head h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 28px;
  font-weight: 500;
  margin: 0;
}
.section__num {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 600;
}
.twocol {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}
.twocol .section { margin-top: 0; }
@media (max-width: 768px) {
  .twocol { grid-template-columns: 1fr; gap: 24px; }
  .section { margin-top: 40px; padding-left: 14px; }
}
```

Section numbers run `§ 01 … § 10` in order of appearance:

| # | Section | Layout |
|---|---|---|
| § 01 | Career | Full-width row-list |
| § 02 | Education | Full-width row-list |
| § 03 | Specialties | Left column of twocol |
| § 04 | Current Focus | Right column of twocol |
| § 05 | Publications · 24 papers | Full-width pubs list |
| § 06 | Working Titles Under Review | Left column of twocol |
| § 07 | Awards & Honors | Right column of twocol |
| § 08 | Invited Talks | Left column of twocol |
| § 09 | Review Services | Right column of twocol |
| § 10 | Patents · 8 filings | Full-width patents list |

For sections with a count (Publications, Patents), append `· N items` to the number text.

## Component Specifications

### Topbar

```html
<div class="topbar">
  <span class="topbar__brand">J. Seo · mikigom.github.io</span>
  <span class="topbar__status"><span class="topbar__dot"></span>Principal Researcher — PIT IN Corp.</span>
</div>
```

- Bottom border: `1px solid var(--ink)`
- `status dot`: 7px circle `var(--accent)` with `0 0 0 3px rgba(10,122,107,0.15)` ring
- Status text: 11.5px caps, `var(--muted)`

### Hero

```html
<section class="hero">
  <div class="hero__text">
    <div class="eyebrow">AI Robotics · Computer Vision · HCI Sensing</div>
    <h1>Junghoon Seo</h1>
    <p class="lede">Leading computer vision … <strong>@ PIT IN Corp.</strong></p>
    <div class="chips">…</div>
    <div class="actions">
      <a class="btn-primary" href="mailto:…">Email</a>
      <a class="link" href="…">LinkedIn ↗</a>
      <a class="link" href="…">Google Scholar ↗</a>
    </div>
  </div>
  <div class="hero__media">
    <div class="portrait-circle"><img src="/assets/YN2n7fI_.jpg" alt="Junghoon Seo"/></div>
    <div class="portrait-caption"><strong>Currently</strong> leading AI research</div>
  </div>
</section>
```

Grid: `1fr 280px`, gap `56px`, breakpoint `≤968px` → single column.

- `.portrait-circle` — `240×240`, `border-radius: 50%`, `1px solid var(--rule)`, img `object-fit: cover`
- `.btn-primary` — dark solid, background `var(--ink)`, color white, hover background `var(--accent)`
- `.link` — `var(--accent)` text, `↗` arrow suffix
- `.chip` — 12.5px, `var(--accent-soft)` bg, `var(--accent)` text, `var(--accent-border)` border, 999px radius

### Career / Education Rows

```html
<div class="row-list">
  <div class="row">
    <div class="row__when">Dec 2024 — Current</div>
    <div class="row__what">
      <strong>Principal Researcher</strong>, AI Robot Team
      <div class="row__sub">@ <a href="…">PIT IN Corp.</a></div>
    </div>
  </div>
</div>
```

- Grid: `180px 1fr`, gap `24px`
- `padding: 14px 0`, dotted bottom hairline (`1px dotted var(--rule)`), last-child no border
- `row__when`: 13px, `var(--muted)`, `font-variant-numeric: tabular-nums`
- `row__what strong`: `var(--ink)` 600
- Inline `a`: `var(--accent)` + `1px solid rgba(10,122,107,.3)` underline, solid on hover
- Mobile (≤600): stack date above text (`grid-template-columns: 1fr`)

### Tagged List (Specialties / Current Focus / Talks / Reviews)

```html
<ul class="tagged-list">
  <li>Machine Learning, Computer Vision…</li>
</ul>
```

```css
.tagged-list { list-style: none; padding: 0; margin: 0; }
.tagged-list li {
  padding: 10px 0 10px 20px;
  border-bottom: 1px dotted var(--rule);
  position: relative;
  font-size: 15px;
  color: var(--ink-2);
}
.tagged-list li::before {
  content: "→";
  position: absolute;
  left: 0; top: 10px;
  color: var(--accent);
}
.tagged-list li:last-child { border-bottom: none; }
```

### Publications

Keep existing `.pub-entry` HTML markup from the earlier thumbnail work, but restyle the surrounding wrapper and internal typography. Remove the `.card.card--wide.card--papers` container — Publications is a plain `<section class="section">` now.

```html
<section class="section">
  <header class="section__head">
    <h2>Publications</h2>
    <span class="section__num">§ 05 · 24 papers <a href="https://scholar.google.com/…" aria-label="Google Scholar">{% include icon.html id="link" %}</a></span>
  </header>
  <div class="pubs">
    <div class="pub-entry">
      <div class="pub-thumb"><img src="/assets/papers/yopo.jpg" alt="YOPO"/></div>
      <div class="pub-text" markdown="1">
        …existing markdown…
      </div>
    </div>
  </div>
</section>
```

Restyle `.pub-entry` / `.pub-thumb` / `.pub-text`:

- `.pub-entry` — grid `160px 1fr`, gap `22px`, `padding: 22px 0`, `border-bottom: 1px solid var(--rule-soft)`; first-child `padding-top: 0`; last-child no border
- `.pub-thumb` — `160×100` (was `140×90`), `border-radius: 8px`, `1px solid var(--rule)`, shadow removed (flat)
- `.pub-text strong` (title) — Fraunces 19px 500, `letter-spacing: -0.005em`, `line-height: 1.3`, `var(--ink)`
- Author `<U>` (self-mark) — remove color override; use `var(--ink)` 600 with `1px solid var(--accent)` bottom-border
- Replace author badge images (`-Authors-brightgreen.svg` / `-Presented%20at-blue.svg`) with inline typography: authors become a single grey sentence; venue becomes a compact `<span class="venue-tag">` pill
- `.venue-row` — small flex row: `[TAG PILL] year links`
- Mobile (≤600): hide `.pub-thumb`, stack

Venue-tag pill:

```css
.venue-tag {
  font-family: 'Inter', sans-serif;
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
  border: 1px solid var(--accent-border);
}
```

### Awards

Two-column rows, year gets serif + teal treatment for visual anchor:

```html
<ul class="awards-list">
  <li><div class="awards-list__year">2024</div><div class="awards-list__what">Lab demo selected as <strong>Popular Choice Winner</strong> in CHI 2024</div></li>
</ul>
```

- `grid: 80px 1fr`, gap `18px`, padding `12px 0`, dotted bottom hairline
- `.awards-list__year` — Fraunces 20px, `var(--accent)`, `letter-spacing: -0.01em`
- Keep existing award links unchanged; let them inherit the default anchor style

### Patents

Compact 2-column with right-aligned tabular number:

```html
<ul class="patents-list">
  <li><div>Method for detecting object <span class="status-pill">Granted</span></div><div class="patents-list__no">10-2364882</div></li>
</ul>
```

- `grid: 1fr 200px`, gap `14px`, padding `8px 0`, dotted bottom hairline
- `.patents-list__no` — 13px, `var(--muted)`, right-aligned, `font-variant-numeric: tabular-nums`
- `.status-pill` — 10.5px caps, `var(--accent-soft)` bg, `var(--accent)` color, `var(--accent-border)` border, 3px radius, margin-left 8px
- "Granted" vs "Application": Granted gets the pill; Application shows no pill
- Status comes from the existing markdown; map "granted" → pill, "application" → none

### Footer

```html
<footer class="page-footer">
  <span>Junghoon Seo — Curriculum Vitae · Updated 2026</span>
  <span>mikigom.github.io</span>
</footer>
```

- Top border `1px solid var(--ink)`, padding-top `24px`, margin-top `96px`
- 12.5px, `var(--muted)`, flex space-between

## Removed / Changed Elements

**Remove from `assets/styles.scss`:**
- `.profile-hero` and all `.profile-hero__*` descendants (dark gradient hero)
- `.portrait-frame` (square gradient-border portrait, replaced by `.portrait-circle`)
- `.card`, `.card-grid`, `.card--timeline`, `.card--pills`, `.card--papers`, `.card--wide` (entire card system)
- `.hero-button`, `.hero-button--ghost` (replaced by `.btn-primary` / `.link`)
- `.eyebrow-row`, `.eyebrow--muted`, `.meta-pill` (unused after hero rewrite)
- Old `.pub-thumb` shadow + existing `.pub-text strong` size override (rewritten)
- `.content img[src*="YN2n7fI"]` circular profile rule (now handled by `.portrait-circle img`)

**Keep:**
- `@import "alembic"` and all alembic base styles
- Existing `_sass/` modules
- `details`/`summary`, `blockquote`, `table`, `pre`/`code`, `.chip` base rule (but chip styled within new hero)
- Selection / focus-visible / smooth-scroll utilities
- `.sr-only`, `.skip-to-content` accessibility helpers
- Reading-order `_layouts/page.html` (unchanged)

**Edits in `index.md`:**
- Frontmatter unchanged (`title`, `layout: page`, `aside: false`, `show_title: false`)
- Wrap all content in `<div class="page">` (was `.profile-page`)
- Replace hero HTML
- Replace `card card--timeline` sections with `<section class="section">` + `.row-list`
- Replace `card-grid` + `card card--pills` with `<div class="twocol">` + `.tagged-list`
- Replace `card card--wide card--papers` with `<section class="section">` + restyled `.pubs`
- Replace `card-grid` (Working Titles/Awards) with a `.twocol` containing two `.section`s: left is § 06 Working Titles (`.tagged-list`, 3 items), right is § 07 Awards (`.awards-list`, 7 items)
- Replace last `card-grid` (Talks/Reviews) with `.twocol` + `.tagged-list`
- Replace `card card--wide` (Patents) with `.patents-list`
- Remove author/venue badge images (`<img src="/assets/-Authors-…">` and `-Presented%20at-…`) from every `.pub-entry`; rebuild as plain text with `.venue-tag`

## Responsive Behavior

| Breakpoint | Changes |
|---|---|
| ≤968px | Hero stacks (text then media); portrait caption centered |
| ≤768px | Hero h1 → 48px; page padding `32px 20px 64px`; twocol → single column; section padding-left → 14px |
| ≤600px | Publication thumbnail hidden; Career/Education `.row` stacks (date above) |

## Accessibility

- Maintain `aria-label`s on icon-only links (paper, project, youtube links in publications)
- Color contrast check: `var(--ink)` on `var(--bg)` → 17:1 ✓; `var(--muted)` on `var(--bg)` → 5.9:1 ✓; `var(--accent)` on `var(--bg)` → 5.1:1 ✓
- Keyboard focus: keep existing `a:focus-visible` rule (3px accent outline), ensure it remains after accent-color change
- Skip-to-content link retained
- `alt` attributes: portrait image has `alt="Junghoon Seo"`; thumbnails follow existing pattern (descriptive or empty for placeholders per a11y commit)

## Files Affected

**Modify:**
- `assets/styles.scss` — remove legacy hero/card rules, add new design tokens + component rules (the single largest change)
- `index.md` — restructure markup for hero, sections, publications, awards, patents, footer
- `_config.yml` — update `font_urls` to include Fraunces + Inter in a single request, remove Noto Sans KR (not used on English page)

**Do not modify:**
- `_sass/*` theme files (alembic base — keep pristine)
- `_layouts/page.html` (layout unchanged)
- `assets/papers/*` (publication thumbnails already in place)
- `assets/YN2n7fI_.jpg` (profile photo reused)

## Out of Scope (YAGNI)

- Dark mode (can be added later as a separate spec)
- A new favicon / social-share image
- Content rewrites of biographical text, publication list, or patents
- Navigation/nav-bar changes beyond the new topbar
- Blog / post layout changes (different pages, untouched)
- Removing the `/assets/-*.svg` author/venue badge images from disk — leave files in place; just stop referencing them from `index.md`
- Korean typography — this page is English-only; Noto Sans KR font request is removed for perf

## Success Criteria

1. Loads with no console errors and no missing font / asset warnings
2. Hero renders Fraunces "Junghoon Seo" at ≥68px on a 1280-wide viewport
3. No element in the rendered page uses `#0fbf9f` (the old bright teal)
4. Every section has the left accent bar and a `§ NN` number in the header
5. Publications render with thumbnails on desktop, hide thumbnails below 600px, and all 24 entries display
6. Awards "year" column renders in Fraunces and deep teal
7. Patents "Granted" entries show a pill; "Application" entries do not
8. At 375px width, the hero stacks, h1 is 48px, and no horizontal scroll appears
9. Contrast passes WCAG AA for body text and accent links
10. No regression in existing icon-link `aria-label`s or the skip-to-content link
