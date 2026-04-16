# index.md Modern-Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh `index.md` into a modern-editorial CV page — Fraunces serif headline, Inter body, deep-teal `#0a7a6b` accent, borderless sections with left accent bar and `§ NN` numbered headers, publications restyled flat.

**Architecture:** Entirely in-repo — rewrite `assets/styles.scss` (tokens + components), rewrite `index.md` section-by-section, swap font request in `_config.yml`. No new JS. Alembic theme under `_sass/` stays pristine.

**Tech Stack:** Jekyll, SCSS (via alembic-jekyll-theme), HTML + markdown, Google Fonts (Fraunces + Inter). Preview via `bundle exec jekyll build` + `preview_start jekyll-preview` (serves `_site/` on port 4321).

**Spec:** [docs/superpowers/specs/2026-04-16-index-redesign-design.md](../specs/2026-04-16-index-redesign-design.md)

---

## File Structure

Files touched in this plan:

| File | Role | Change |
|---|---|---|
| `_config.yml` | Site config — font URLs | Update `font_urls` |
| `assets/styles.scss` | Custom CSS entry (imports alembic) | Full rewrite of custom section (post-`@import "alembic"`) |
| `index.md` | CV page content + HTML structure | Restructure markup section-by-section |
| `.claude/launch.json` | Preview launch config | Exists — unchanged |

No new files. Partial-split of `assets/styles.scss` into `_sass/custom/*` is out of scope (stays as a single file to match existing pattern).

## Execution Order

**Phase A — Preview & fonts setup** (Task 1)
**Phase B — CSS foundation** (Tasks 2–5)
**Phase C — CSS components** (Tasks 6–14)
**Phase D — Markup migration** (Tasks 15–22)
**Phase E — Final verification** (Task 23)

Phase C tasks can run in any order (each is an isolated `@block` in SCSS) but stay in this order for easier review. Phase D tasks should run in order — preview renders progressively become correct after each commit.

---

## Task 1: Boot the preview pipeline

Goal: confirm the Jekyll → preview flow works before any code changes. Run once; leave the server up for later tasks.

**Files:**
- Read: `Gemfile`, `.claude/launch.json`
- Generated: `_site/`

- [ ] **Step 1: Install Ruby deps**

Run: `bundle install`
Expected: "Bundle complete!" or all gems already installed. If Ruby/Bundler is not on PATH, install them first via the platform's package manager; do not proceed until this step succeeds.

- [ ] **Step 2: Build the site once so `_site/` exists**

Run: `bundle exec jekyll build`
Expected: `...done in X seconds.` output, no errors. Creates `_site/index.html` and `_site/assets/styles.css`.

- [ ] **Step 3: Start preview**

Tool call: `preview_start` with `name: "jekyll-preview"`
Expected: server starts on port 4321 with a `serverId`. Record the `serverId` — reuse it for every verification step that follows.

- [ ] **Step 4: Sanity-check current state**

Tool call: `preview_inspect` with `selector: ".profile-hero h1"`, `styles: ["font-size","color"]`
Expected: returns `font-size: 2.8rem` (the current hero size) and white color `rgb(255, 255, 255)`. This confirms the preview is showing the live CSS and we have a pre-change baseline.

- [ ] **Step 5: No commit**

Nothing changed. Continue to Task 2.

---

## Task 2: Replace Google Fonts request with Fraunces + Inter

**Files:**
- Modify: `_config.yml:143-148` (the `fonts:` block)

- [ ] **Step 1: Update `_config.yml`**

Replace the existing `fonts:` block (at end of file) with:

```yaml
fonts:
  preconnect_urls:
    - https://fonts.gstatic.com
  font_urls:
    - https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap
```

- [ ] **Step 2: Rebuild**

Run: `bundle exec jekyll build`
Expected: no errors. `_site/index.html` `<head>` should now reference the new Google Fonts URL (use Grep tool on `_site/index.html` if you want to double-check).

- [ ] **Step 3: Reload preview and check font requests**

Tool call: `preview_eval` with `expression: "window.location.reload()"`
Then: `preview_network` with `filter: "all"`
Expected: a request to `fonts.googleapis.com/css2?family=Fraunces...` returns 200. Any request to `Noto+Sans+KR` should be gone.

- [ ] **Step 4: Commit**

```bash
git add _config.yml
git commit -m "chore(fonts): swap Noto Sans KR for Fraunces + Inter"
```

---

## Task 3: Replace design tokens in `:root`

**Files:**
- Modify: `assets/styles.scss:8-16` (the existing `:root { ... }` block)

- [ ] **Step 1: Replace the `:root` block**

Find this exact block (just after `@import "alembic";`):

```scss
:root {
  --bg: #f6f8fb;
  --card-bg: #ffffff;
  --card-border: #e5eaf1;
  --accent: #0fbf9f;
  --accent-strong: #0a9c80;
  --text: #0f172a;
  --muted: #5f6b7a;
}
```

Replace with:

```scss
:root {
  --bg: #fafaf8;
  --surface: #ffffff;
  --ink: #0f1216;
  --ink-2: #2a2d33;
  --muted: #6b7280;
  --muted-2: #9aa0a6;
  --rule: #e3e6ea;
  --rule-soft: #eef0f3;
  --accent: #0a7a6b;
  --accent-strong: #086357;
  --accent-soft: #e8f2ef;
  --accent-border: #c4ddd6;
}
```

- [ ] **Step 2: Rebuild and reload**

Run: `bundle exec jekyll build`
Tool call: `preview_eval` with `expression: "window.location.reload()"`

- [ ] **Step 3: Verify tokens resolve in the DOM**

Tool call: `preview_eval` with `expression: "getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()"`
Expected: `"#0a7a6b"`

Tool call: `preview_eval` with `expression: "getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()"`
Expected: `"#fafaf8"`

- [ ] **Step 4: Commit**

```bash
git add assets/styles.scss
git commit -m "style(tokens): deep teal accent + warm off-white ink palette"
```

---

## Task 4: Update body base + global typography

**Files:**
- Modify: `assets/styles.scss` — `body` rule (~line 586) and heading rules (~lines 598–620)

- [ ] **Step 1: Replace body rule**

Find:

```scss
body {
  background: var(--bg);
  color: var(--text);
  font-family: "Inter", "Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.7;
  font-feature-settings: "kern" 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

Replace with:

```scss
body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.7;
  font-feature-settings: "kern" 1, "ss01" 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 2: Replace heading rules**

Find the block starting `/* Better Heading Spacing */`:

```scss
/* Better Heading Spacing */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.3;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.5rem;
}

h4 {
  font-size: 1.25rem;
}
```

Replace with:

```scss
/* Editorial heading system */
h1, h2, h3, h4, h5, h6, .serif {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.2;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--ink);
}

h1 { font-size: 72px; line-height: 1.0; letter-spacing: -0.025em; }
h2 { font-size: 28px; line-height: 1.1; }
h3 { font-size: 19px; line-height: 1.3; letter-spacing: -0.005em; }
h4 { font-size: 16px; }
```

- [ ] **Step 3: Rebuild, reload, verify h1 font**

Run: `bundle exec jekyll build`
Tool call: `preview_eval` with `expression: "window.location.reload()"`
Tool call: `preview_inspect` with `selector: "h1", styles: ["font-family","font-size"]`
Expected: `font-family` starts with `Fraunces`; `font-size: 72px` (or close — the current `.profile-hero h1` override still applies until Task 5 removes it).

- [ ] **Step 4: Commit**

```bash
git add assets/styles.scss
git commit -m "style(type): Fraunces heading system + Inter body base"
```

---

## Task 5: Remove legacy CSS rules

This task deletes every rule that will be replaced. It is the biggest single diff. After this task the page will render unstyled-looking — that's expected. Subsequent tasks restore styling.

**Files:**
- Modify: `assets/styles.scss` — delete specific rule blocks

- [ ] **Step 1: Delete `.page-title` and the whole "Modern Card Layouts" block through `.card--papers`**

Find `.page-title` (~line 18). Delete that rule, then delete all of `.card-grid`, `.card`, `.card--wide`, `.card--timeline`, `.card--pills`, `.card--papers`, ending at the final closing brace of the `.card` rule (approximately up through line 128 of the original file — use Grep to find the next rule `details { ... }` which stays).

- [ ] **Step 2: Delete `.profile-page` and the entire `.profile-hero` block**

Find `.profile-page` (~line 170). Delete `.profile-page` and `.profile-page section`, then delete the entire `.profile-hero { ... }` block including all `&__text`, `&__meta`, `&__actions`, `&__media`, `&__tag` descendants (approximately up through the closing brace of `.profile-hero`).

- [ ] **Step 3: Delete `.eyebrow-row`, `.eyebrow`, `.eyebrow--muted`, `.meta-pill`**

Find `.eyebrow-row` rule and delete it. Delete `.eyebrow`, `.eyebrow--muted`, `.meta-pill` rules as well.

- [ ] **Step 4: Delete `.portrait-frame` and `.profile-hero .chip`**

Delete the entire `.portrait-frame` block. Delete the `.profile-hero .chip` override block. Keep the standalone `.chip-row` and `.chip` rules (at ~lines 371–394) — these stay for now; the hero rewrite will reuse `.chip`.

- [ ] **Step 5: Delete `.hero-button` and `.hero-button--ghost`**

Find `/* Hero Buttons */` (~line 339). Delete the whole `.hero-button { ... }` block.

- [ ] **Step 6: Delete `.note-callout` and `.card--papers`-scoped publication overrides**

Find `.note-callout` and delete. Find the second `.card--papers { ... }` block (the one under `/* Enhanced Publications List */`, ~line 422) and delete.

- [ ] **Step 7: Delete `.content img[src*="YN2n7fI"]` and `.content h3`, `.content ul` overrides**

Find `/* Improved Main Content Area */` (~line 451). Delete the entire `.content { ... }` block.

- [ ] **Step 8: Delete `.typeset` overrides that targeted the old publication list**

Find `/* Better Typography for Publications */` and delete the `.typeset { ... }` block inside it (keeps document-level `.typeset a` rule if it exists separately).

- [ ] **Step 9: Delete the mobile-only `.profile-hero { padding: 1.5rem; margin: 0; }` override inside the first `@media (max-width: 768px)` block**

Find `/* Responsive Improvements */` (~line 497). Delete only the `.profile-hero` descendant inside the media query. Keep the `.card-grid` and `.card` rules inside the media query — they become harmless once the selectors no longer match, and the next task will overwrite the `.card-grid` reference. (Actually: delete them too since the selectors are dead. Keep the media query block itself.)

After this step the media query should be empty or contain only non-conflicting rules. If the media query is now empty, delete the empty `@media` wrapper.

- [ ] **Step 10: Rebuild and verify the file still compiles**

Run: `bundle exec jekyll build`
Expected: build succeeds, no SCSS errors. The site will look broken (no hero styling, no card styling) — that is correct and intended.

- [ ] **Step 11: Commit**

```bash
git add assets/styles.scss
git commit -m "style(cleanup): remove legacy hero + card + content overrides"
```

---

## Task 6: Add topbar component CSS

**Files:**
- Modify: `assets/styles.scss` — append new block (at end of file, before any closing brace if nested, otherwise at top-level)

- [ ] **Step 1: Append topbar rule**

Append to end of `assets/styles.scss`:

```scss
/* ============================================
   EDITORIAL REDESIGN — NEW COMPONENTS
   ============================================ */

.page {
  max-width: 1060px;
  margin: 0 auto;
  padding: 48px 40px 96px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--ink);
  margin-bottom: 56px;

  &__brand {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  &__status {
    font-size: 11.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 3px rgba(10, 122, 107, 0.15);
  }
}
```

- [ ] **Step 2: Rebuild**

Run: `bundle exec jekyll build`
Expected: no SCSS errors.

- [ ] **Step 3: Commit**

```bash
git add assets/styles.scss
git commit -m "style(topbar): add editorial topbar + page wrapper"
```

---

## Task 7: Add hero component CSS

**Files:**
- Modify: `assets/styles.scss` — append

- [ ] **Step 1: Append hero rules**

Append:

```scss
.hero {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 56px;
  align-items: center;
  margin-bottom: 84px;

  .eyebrow {
    font-size: 11.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 20px;
  }

  h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 72px;
    line-height: 1.0;
    font-weight: 500;
    color: var(--ink);
    margin: 0 0 28px;
    letter-spacing: -0.025em;
  }

  .lede {
    font-size: 17px;
    line-height: 1.65;
    color: var(--ink-2);
    margin: 0 0 28px;
    max-width: 580px;
    font-weight: 400;

    strong {
      color: var(--ink);
      font-weight: 600;
    }
  }

  &__actions {
    display: flex;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  &__media {
    justify-self: center;
    text-align: center;
  }
}

.portrait-circle {
  width: 240px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 1px solid var(--rule);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.portrait-caption {
  margin-top: 14px;
  font-size: 12px;
  color: var(--muted);

  strong {
    color: var(--accent);
    font-weight: 600;
  }
}

.btn-primary {
  font-size: 14px;
  padding: 11px 22px;
  background: var(--ink);
  color: #ffffff !important;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: var(--accent);
  }
}

.link {
  font-size: 14px;
  color: var(--accent);
  font-weight: 500;
  padding: 11px 4px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
}
```

- [ ] **Step 2: Override the `.chip` rule so chips inside hero use the new soft-teal style**

Find existing `.chip` rule (~line 378) and replace its body with:

```scss
.chip {
  display: inline-block;
  padding: 5px 12px;
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  border: 1px solid var(--accent-border);
  transition: all 0.2s ease;

  &:hover {
    background: var(--accent);
    color: #ffffff;
  }
}
```

- [ ] **Step 3: Rebuild and commit**

Run: `bundle exec jekyll build`
Expected: no errors.

```bash
git add assets/styles.scss
git commit -m "style(hero): editorial hero + portrait-circle + btn-primary + link"
```

---

## Task 8: Add section primitive CSS

**Files:**
- Modify: `assets/styles.scss` — append

- [ ] **Step 1: Append section rules**

Append:

```scss
.section {
  margin-top: 56px;
  padding-left: 18px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 3px;
    height: calc(100% - 8px);
    background: var(--accent);
    opacity: 0.9;
  }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 20px;
    gap: 16px;
  }

  &__head h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 28px;
    font-weight: 500;
    margin: 0;
    letter-spacing: -0.01em;
  }

  &__num {
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
    white-space: nowrap;

    a {
      color: var(--muted);
      margin-left: 4px;
    }
  }
}

.twocol {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;

  .section {
    margin-top: 0;
  }
}
```

- [ ] **Step 2: Rebuild and commit**

Run: `bundle exec jekyll build`

```bash
git add assets/styles.scss
git commit -m "style(section): borderless section + left accent bar + twocol"
```

---

## Task 9: Add row-list (Career / Education) CSS

**Files:**
- Modify: `assets/styles.scss` — append

- [ ] **Step 1: Append row-list rules**

Append:

```scss
.row-list {
  display: flex;
  flex-direction: column;
}

.row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  padding: 14px 0;
  border-bottom: 1px dotted var(--rule);
  align-items: baseline;

  &:last-child {
    border-bottom: none;
  }

  &__when {
    font-size: 13px;
    color: var(--muted);
    font-weight: 500;
    letter-spacing: 0.01em;
    font-variant-numeric: tabular-nums;
  }

  &__what {
    font-size: 15px;
    color: var(--ink-2);
    line-height: 1.55;

    strong {
      color: var(--ink);
      font-weight: 600;
    }

    a {
      color: var(--accent);
      text-decoration: none;
      border-bottom: 1px solid rgba(10, 122, 107, 0.3);

      &:hover {
        border-bottom-color: var(--accent);
      }
    }
  }

  &__sub {
    color: var(--muted);
    font-size: 13.5px;
    margin-top: 4px;
  }
}
```

- [ ] **Step 2: Rebuild and commit**

Run: `bundle exec jekyll build`

```bash
git add assets/styles.scss
git commit -m "style(row-list): two-column date/content rows for career + education"
```

---

## Task 10: Add tagged-list CSS

**Files:**
- Modify: `assets/styles.scss` — append

- [ ] **Step 1: Append tagged-list rules**

Append:

```scss
.tagged-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 10px 0 10px 20px;
    border-bottom: 1px dotted var(--rule);
    position: relative;
    font-size: 15px;
    color: var(--ink-2);
    line-height: 1.55;
    margin: 0;

    &::before {
      content: "→";
      position: absolute;
      left: 0;
      top: 10px;
      color: var(--accent);
      font-weight: 500;
    }

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: var(--ink);
      font-weight: 600;
    }

    a {
      color: var(--accent);
      text-decoration: none;
      border-bottom: 1px solid rgba(10, 122, 107, 0.3);

      &:hover {
        border-bottom-color: var(--accent);
      }
    }
  }
}
```

- [ ] **Step 2: Rebuild and commit**

Run: `bundle exec jekyll build`

```bash
git add assets/styles.scss
git commit -m "style(tagged-list): arrow-marker list for specialties/talks/reviews"
```

---

## Task 11: Restyle publication entries

**Files:**
- Modify: `assets/styles.scss` — rewrite `.pub-entry`, `.pub-thumb`, `.pub-text` blocks; add `.venue-tag`, `.venue-row`, `.pubs`, `.pub-authors`, `.pub-title`

- [ ] **Step 1: Replace existing `.pub-entry`, `.pub-thumb`, `.pub-text` blocks**

Find the existing block starting `/* Publication Entry with Thumbnail */` (~line 699) and ending at the `@media (max-width: 600px) { .pub-thumb { display: none; } }` rule (~line 776). Replace with:

```scss
/* Publications */
.pubs {
  margin-top: 20px;
}

.pub-entry {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 22px;
  padding: 22px 0;
  border-bottom: 1px solid var(--rule-soft);
  align-items: start;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
  }
}

.pub-thumb {
  width: 160px;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  border: 1px solid var(--rule);
  overflow: hidden;
  background: #f1f5f9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &--placeholder {
    background: linear-gradient(135deg, var(--accent-soft), #d4ebe4);
  }
}

.pub-text {
  min-width: 0;

  p {
    margin: 0 0 6px;
    padding: 0;
  }

  strong {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 19px;
    line-height: 1.3;
    font-weight: 500;
    color: var(--ink);
    display: block;
    margin-bottom: 8px;
    letter-spacing: -0.005em;
  }

  .pub-authors {
    font-size: 13.5px;
    color: var(--muted);
    line-height: 1.55;
    margin: 0 0 4px;
  }

  U, u {
    text-decoration: none;
    color: var(--ink);
    font-weight: 600;
    border-bottom: 1px solid var(--accent);
    padding-bottom: 1px;
  }
}

.venue-tag {
  display: inline-block;
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
  margin-right: 6px;
}

.venue-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--ink-2);
  font-weight: 500;
  margin-top: 4px;

  .year {
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }

  a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dotted var(--accent);
    padding-bottom: 1px;
    font-size: 12.5px;
  }
}

@media (max-width: 600px) {
  .pub-entry {
    grid-template-columns: 1fr;
  }
  .pub-thumb {
    display: none;
  }
}
```

- [ ] **Step 2: Rebuild and commit**

Run: `bundle exec jekyll build`

```bash
git add assets/styles.scss
git commit -m "style(pub): flat thumbnails + Fraunces titles + venue-tag pills"
```

---

## Task 12: Add awards-list CSS

**Files:**
- Modify: `assets/styles.scss` — append

- [ ] **Step 1: Append awards-list rules**

Append:

```scss
.awards-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 12px 0;
    border-bottom: 1px dotted var(--rule);
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 18px;
    font-size: 14.5px;
    align-items: baseline;
    margin: 0;

    &:last-child {
      border-bottom: none;
    }

    &::before {
      content: none;
    }
  }

  &__year {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 20px;
    color: var(--accent);
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  &__what {
    color: var(--ink-2);
    line-height: 1.55;

    strong {
      color: var(--ink);
      font-weight: 600;
    }

    a {
      color: var(--accent);
      text-decoration: none;
      border-bottom: 1px solid rgba(10, 122, 107, 0.3);
    }
  }
}
```

- [ ] **Step 2: Rebuild and commit**

Run: `bundle exec jekyll build`

```bash
git add assets/styles.scss
git commit -m "style(awards): year column in Fraunces deep-teal"
```

---

## Task 13: Add patents-list + status-pill CSS

**Files:**
- Modify: `assets/styles.scss` — append

- [ ] **Step 1: Append patents-list + status-pill rules**

Append:

```scss
.patents-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;

  li {
    padding: 8px 0;
    border-bottom: 1px dotted var(--rule);
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 14px;
    color: var(--ink-2);
    line-height: 1.55;
    margin: 0;
    align-items: baseline;

    &:last-child {
      border-bottom: none;
    }

    &::before {
      content: none;
    }
  }

  &__no {
    color: var(--muted);
    font-size: 13px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
}

.status-pill {
  display: inline-block;
  font-size: 10.5px;
  padding: 2px 7px;
  border-radius: 3px;
  background: var(--accent-soft);
  color: var(--accent);
  margin-left: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 600;
  border: 1px solid var(--accent-border);
  vertical-align: middle;
}
```

- [ ] **Step 2: Rebuild and commit**

Run: `bundle exec jekyll build`

```bash
git add assets/styles.scss
git commit -m "style(patents): two-column patents list + granted status pill"
```

---

## Task 14: Add page-footer + responsive breakpoints

**Files:**
- Modify: `assets/styles.scss` — append

- [ ] **Step 1: Append page-footer and responsive rules**

Append:

```scss
.page-footer {
  margin-top: 96px;
  padding-top: 24px;
  border-top: 1px solid var(--ink);
  font-size: 12.5px;
  color: var(--muted);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 968px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: left;
  }
  .hero__media {
    justify-self: start;
    text-align: left;
  }
  .portrait-circle {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .page {
    padding: 32px 20px 64px;
  }
  .hero h1 {
    font-size: 48px;
  }
  .twocol {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .section {
    margin-top: 40px;
    padding-left: 14px;
  }
  .topbar {
    margin-bottom: 40px;
  }
}

@media (max-width: 600px) {
  .row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  .patents-list li {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  .patents-list__no {
    text-align: left;
  }
  .awards-list li {
    grid-template-columns: 60px 1fr;
    gap: 12px;
  }
}
```

- [ ] **Step 2: Rebuild and commit**

Run: `bundle exec jekyll build`

```bash
git add assets/styles.scss
git commit -m "style(responsive): hero stack + twocol collapse + mobile row stack"
```

---

## Task 15: Rewrite index.md — hero + topbar

**Files:**
- Modify: `index.md:9-36` (the `.profile-page` wrapper start + `.profile-hero` section)

- [ ] **Step 1: Replace the opening wrapper + hero**

Find:

```markdown
<div class="profile-page">

<section class="profile-hero">
  <div class="profile-hero__text">
    <h1>Junghoon Seo</h1>
    <p class="lede">Leading computer vision and machine learning research for AI robotics @ PIT IN Corp. Experienced in satellite/aerial imagery and HCI sensing, with strong interests in GPU parallel computing and computer graphics.</p>
    <div class="chip-row">
      <span class="chip">Computer Vision</span>
      <span class="chip">Machine Learning</span>
      <span class="chip">AI Robotics</span>
      <span class="chip">Remote Sensing</span>
      <span class="chip">GPGPU/HPC</span>
      <span class="chip">HCI Sensing</span>
    </div>
    <div class="profile-hero__actions">
      <a class="hero-button" href="mailto:s3213403@gmail.com">Email Me</a>
      <span class="profile-hero__actions-break" aria-hidden="true"></span>
      <a class="hero-button hero-button--ghost" href="https://www.linkedin.com/in/junghoon-seo/">LinkedIn</a>
      <a class="hero-button hero-button--ghost" href="https://scholar.google.com/citations?user=9KBQk-YAAAAJ&hl=en">Google Scholar</a>
    </div>
  </div>
  <div class="profile-hero__media">
    <div class="portrait-frame">
      <img src="/assets/YN2n7fI_.jpg" alt="Junghoon Seo" />
    </div>
    <div class="profile-hero__tag">Currently leading AI research @ PIT IN Corp.</div>
  </div>
</section>
```

Replace with:

```markdown
<div class="page">

<div class="topbar">
  <span class="topbar__brand">J. Seo · mikigom.github.io</span>
  <span class="topbar__status"><span class="topbar__dot"></span>Principal Researcher — PIT IN Corp.</span>
</div>

<section class="hero">
  <div class="hero__text">
    <div class="eyebrow">AI Robotics · Computer Vision · HCI Sensing</div>
    <h1>Junghoon Seo</h1>
    <p class="lede">Leading computer vision and machine learning research for AI robotics <strong>@ PIT IN Corp.</strong> Experienced in satellite/aerial imagery and HCI sensing, with strong interests in GPU parallel computing and computer graphics.</p>
    <div class="chip-row">
      <span class="chip">Computer Vision</span>
      <span class="chip">Machine Learning</span>
      <span class="chip">AI Robotics</span>
      <span class="chip">Remote Sensing</span>
      <span class="chip">GPGPU/HPC</span>
      <span class="chip">HCI Sensing</span>
    </div>
    <div class="hero__actions">
      <a class="btn-primary" href="mailto:s3213403@gmail.com">Email</a>
      <a class="link" href="https://www.linkedin.com/in/junghoon-seo/">LinkedIn ↗</a>
      <a class="link" href="https://scholar.google.com/citations?user=9KBQk-YAAAAJ&hl=en">Google Scholar ↗</a>
    </div>
  </div>
  <div class="hero__media">
    <div class="portrait-circle">
      <img src="/assets/YN2n7fI_.jpg" alt="Junghoon Seo" />
    </div>
    <div class="portrait-caption"><strong>Currently</strong> leading AI research</div>
  </div>
</section>
```

- [ ] **Step 2: Rebuild, reload, verify hero h1**

Run: `bundle exec jekyll build`
Tool call: `preview_eval` with `expression: "window.location.reload()"`
Tool call: `preview_inspect` with `selector: ".hero h1", styles: ["font-family","font-size","color"]`
Expected: `font-family` starts with `Fraunces`; `font-size: 72px`; `color: rgb(15, 18, 22)`.

- [ ] **Step 3: Commit**

```bash
git add index.md
git commit -m "feat(hero): editorial topbar + hero with portrait-circle"
```

---

## Task 16: Rewrite index.md — Career + Education

**Files:**
- Modify: `index.md` — both `<section class="card card--timeline">` blocks

- [ ] **Step 1: Replace Career section**

Find:

```markdown
<section class="card card--timeline" markdown="1">
#### Career
  * *Dec 2024 - Current*, Principal Researcher, AI Robot Team @ [PIT IN Corp.](https://pitin-ev.com/)
  * *Sep 2020 - Sep 2024*, Technical Leader of Research Center & Co-founder @ [SI Analytics](https://www.si-analytics.ai/eng)
  * *Jul 2017 - Feb 2020*, ML/CV Research Scientist @ [Satrec Initiative](https://www.satreci.com/)
</section>
```

Replace with:

```html
<section class="section">
  <header class="section__head">
    <h2>Career</h2>
    <span class="section__num">§ 01</span>
  </header>
  <div class="row-list">
    <div class="row">
      <div class="row__when">Dec 2024 — Current</div>
      <div class="row__what">
        <strong>Principal Researcher</strong>, AI Robot Team
        <div class="row__sub">@ <a href="https://pitin-ev.com/">PIT IN Corp.</a></div>
      </div>
    </div>
    <div class="row">
      <div class="row__when">Sep 2020 — Sep 2024</div>
      <div class="row__what">
        <strong>Technical Leader of Research Center & Co-founder</strong>
        <div class="row__sub">@ <a href="https://www.si-analytics.ai/eng">SI Analytics</a></div>
      </div>
    </div>
    <div class="row">
      <div class="row__when">Jul 2017 — Feb 2020</div>
      <div class="row__what">
        <strong>ML/CV Research Scientist</strong>
        <div class="row__sub">@ <a href="https://www.satreci.com/">Satrec Initiative</a></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Replace Education section**

Find:

```markdown
<section class="card card--timeline" markdown="1">
#### Education
  * *Mar 2023 - Feb 2025*, [KAIST](https://www.kaist.ac.kr/en/), Daejeon, South Korea
    * Master's degree in Graduate School of Culture Technology
    * [HCI Tech Lab](https://hcitech.org/), supervised by Prof. [Sang Ho Yoon](https://sanghoy.com/)
  * *Mar 2014 - Feb 2021*, [GIST](https://www.gist.ac.kr/en/main.html), Gwangju, South Korea
    * B.S degree, Major in Electrical Engineering and Computer Science
</section>
```

Replace with:

```html
<section class="section">
  <header class="section__head">
    <h2>Education</h2>
    <span class="section__num">§ 02</span>
  </header>
  <div class="row-list">
    <div class="row">
      <div class="row__when">Mar 2023 — Feb 2025</div>
      <div class="row__what">
        <strong>M.S.</strong>, Graduate School of Culture Technology
        <div class="row__sub"><a href="https://www.kaist.ac.kr/en/">KAIST</a>, Daejeon · <a href="https://hcitech.org/">HCI Tech Lab</a>, supervised by Prof. <a href="https://sanghoy.com/">Sang Ho Yoon</a></div>
      </div>
    </div>
    <div class="row">
      <div class="row__when">Mar 2014 — Feb 2021</div>
      <div class="row__what">
        <strong>B.S.</strong>, Electrical Engineering and Computer Science
        <div class="row__sub"><a href="https://www.gist.ac.kr/en/main.html">GIST</a>, Gwangju</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Rebuild, reload, verify section primitive**

Run: `bundle exec jekyll build`
Tool call: `preview_eval` with `expression: "window.location.reload()"`
Tool call: `preview_inspect` with `selector: ".section:nth-of-type(1) .section__num"`
Expected: `textContent` contains `§ 01`.

- [ ] **Step 4: Commit**

```bash
git add index.md
git commit -m "feat(sections): Career + Education as row-list sections"
```

---

## Task 17: Rewrite index.md — Specialties + Current Focus

**Files:**
- Modify: `index.md` — `<section class="card-grid">` containing the two `<article>` cards

- [ ] **Step 1: Replace the card-grid block**

Find:

```markdown
<section class="card-grid">
<article class="card card--pills" markdown="1">
#### Specialties
  * Machine Learning, Computer Vision, Computer Graphics, and Remote Sensing Applications
  * Parallel Computing on HPC and GPGPU
  * Intelligent Sensing Techniques for Human-Computer Interaction
</article>

<article class="card card--pills" markdown="1">
#### Current Focus
  * Reliable Perception for AI Robotics
  * High-precision Photogrammetry
  * AI Agent for User-friendly Automation
  * Parallel/Efficient Computing Methods for Robotics
</article>
</section>
```

Replace with:

```html
<div class="twocol">
  <section class="section">
    <header class="section__head">
      <h2>Specialties</h2>
      <span class="section__num">§ 03</span>
    </header>
    <ul class="tagged-list">
      <li>Machine Learning, Computer Vision, Computer Graphics, and Remote Sensing Applications</li>
      <li>Parallel Computing on HPC and GPGPU</li>
      <li>Intelligent Sensing Techniques for Human-Computer Interaction</li>
    </ul>
  </section>
  <section class="section">
    <header class="section__head">
      <h2>Current Focus</h2>
      <span class="section__num">§ 04</span>
    </header>
    <ul class="tagged-list">
      <li>Reliable Perception for AI Robotics</li>
      <li>High-precision Photogrammetry</li>
      <li>AI Agent for User-friendly Automation</li>
      <li>Parallel/Efficient Computing Methods for Robotics</li>
    </ul>
  </section>
</div>
```

- [ ] **Step 2: Rebuild and commit**

Run: `bundle exec jekyll build`

```bash
git add index.md
git commit -m "feat(sections): Specialties + Current Focus as twocol tagged-lists"
```

---

## Task 18: Rewrite index.md — Publications section wrapper + venue rows

This is the largest markup change. Publications has 24 entries. The outer `<section class="card card--wide card--papers">` wrapper is replaced with `<section class="section">`. The inner `.pub-entry` HTML stays, BUT each `.pub-text` gets its internal markdown converted from the current `(Authors image) + bullet list` layout to the new `authors paragraph + venue-row` layout.

**Files:**
- Modify: `index.md:71-362` (the Publications section)

- [ ] **Step 1: Replace the Publications section opening**

Find:

```markdown
<section class="card card--wide card--papers">
<h4>Publications <a href="https://scholar.google.com/citations?user=9KBQk-YAAAAJ&hl=en" aria-label="Google Scholar" title="Google Scholar">{% include icon.html id="link" width="14" height="14" %}</a></h4>
```

Replace with:

```html
<section class="section">
  <header class="section__head">
    <h2>Publications</h2>
    <span class="section__num">§ 05 · 24 papers <a href="https://scholar.google.com/citations?user=9KBQk-YAAAAJ&hl=en" aria-label="Google Scholar" title="Google Scholar">{% include icon.html id="link" width="14" height="14" %}</a></span>
  </header>
  <div class="pubs">
```

- [ ] **Step 2: Replace the Publications section closing tag**

Find the final `</section>` that closes the publications block (the one right before the `<section class="card-grid">` that holds Working Titles/Awards). Replace with:

```html
  </div>
</section>
```

(Inserting a `</div>` for `.pubs` before the `</section>`.)

- [ ] **Step 3: Convert each of the 24 `.pub-entry` blocks**

For every `.pub-entry` in the Publications section, the existing structure is:

```markdown
<div class="pub-entry">
  <div class="pub-thumb"> … </div>
  <div class="pub-text" markdown="1">

**Paper Title**
  - <img height="10" src="/assets/-Authors-brightgreen.svg"> Authors...
  - <img height="10" src="/assets/-Presented%20at-blue.svg"> Venue. Year. <a …>{% include icon.html … %}</a> …
  </div>
</div>
```

Rewrite each to use plain text authors + a `.venue-row` block. Template to apply to every entry (using entry 1 "YOPO" as an example):

```html
<div class="pub-entry">
  <div class="pub-thumb">
    <img src="/assets/papers/yopo.jpg" alt="You Only Pose Once" loading="lazy" />
  </div>
  <div class="pub-text">
    <strong>You Only Pose Once: A Minimalist's Detection Transformer for Monocular RGB Category-level 9D Multi-Object Pose Estimation</strong>
    <p class="pub-authors">Hakjin Lee, <U>Junghoon Seo</U>, Jaehoon Sim</p>
    <div class="venue-row">
      <span class="venue-tag">IEEE ICRA</span>
      <span class="year">2026</span>
      <a href="https://arxiv.org/abs/2508.14965" aria-label="Paper link" title="Paper link">{% include icon.html id="paper" width="14" height="14" %}</a>
      <a href="https://mikigom.github.io/YOPO-project-page/" aria-label="Project page link" title="Project Page">{% include icon.html id="home" width="14" height="14" %}</a>
    </div>
  </div>
</div>
```

Apply this transformation to every entry. Mapping per entry:
- **Title** → wrapped in `<strong>…</strong>` (was already bold markdown)
- **Authors line** → plain `<p class="pub-authors">…</p>` with the `<U>…</U>` self-mark preserved on `Junghoon Seo`. Remove the `<img … -Authors-brightgreen.svg>` prefix.
- **Venue line** → `<div class="venue-row">` containing:
  - `<span class="venue-tag">{VENUE}</span>` where VENUE is everything before the period (e.g., `IEEE ICRA`, `IEEE TVCG`, `ACM UIST Demo`, `IEEE TGRS`, `IEEE WACV`, `NeurIPS`, `IEEE J-STARS`, `NeurIPS Workshop`, `AISTATS`, `IEEE Access`, `IEEE GRSL`, `CVPR Workshop`, `IEEE ICASSP`, `ICCV Workshop`, `ACM SIGSPATIAL`, `ICML Workshop`, `ICLR Workshop`, `ACML Workshop`)
  - `<span class="year">{YEAR}</span>`
  - The existing `<a href="…">{% include icon.html id="…" %}</a>` link(s) — kept verbatim, including `aria-label` and `title` attributes
  - Remove the `<img … -Presented%20at-blue.svg>` prefix

The full mapping for all 24 entries is mechanical. Apply the transformation to each `.pub-entry` in order. The 24 entries in file order (for reference — use the existing data in the file, do not retype):

| # | ID | Venue | Year |
|---|---|---|---|
| 1 | yopo | IEEE ICRA | 2026 |
| 2 | forcectrl | IEEE TVCG | 2026 |
| 3 | egopress | ACM UIST Demo | 2025 |
| 4 | lrt_sr | IEEE TGRS | 2025 |
| 5 | hdm-detr | IEEE WACV | 2025 |
| 6 | pimforce | NeurIPS | 2024 |
| 7 | billion-rs | IEEE J-STARS | 2024 |
| 8 | self-pair | IEEE WACV | 2023 |
| 9 | goar | NeurIPS Workshop | 2023 |
| 10 | proto-cd | NeurIPS Workshop | 2023 |
| 11 | sihg | AISTATS | 2022 |
| 12 | abnormal-access | IEEE Access | 2022 |
| 13 | contrastive | IEEE GRSL | 2021 |
| 14 | domain-inv-det | CVPR Workshop | 2021 |
| 15 | naive-pll | IEEE ICASSP | 2021 |
| 16 | nllink | IEEE GRSL | 2021 |
| 17 | bagging-disaster | NeurIPS Workshop | 2019 |
| 18 | dcfsc | ICCV Workshop | 2019 |
| 19 | noisy-saliency | ICCV Workshop | 2019 |
| 20 | bridge-adv | ICLR Workshop | 2019 |
| 21 | rbox-cnn | ACM SIGSPATIAL | 2018 |
| 22 | noise-saliency | ICML Workshop | 2018 |
| 23 | domain-aircraft | ACML Workshop | 2017 |
| 24 | placeholder-cv | ACML Workshop | 2017 |

For the last entry (Multi-task Learning for Fine-grained Visual Classification of Aircraft) there is no link in the original, so the `venue-row` has only the `venue-tag` and `year`:

```html
<div class="venue-row">
  <span class="venue-tag">ACML Workshop</span>
  <span class="year">2017</span>
</div>
```

Note: entries 3, 4, 8, 9, 10, 12, 13, 16, 21 currently use `<div class="pub-thumb pub-thumb--placeholder">` and `<img … alt="" …>` — preserve both the `--placeholder` class and the empty alt per the existing a11y convention.

- [ ] **Step 4: Rebuild, reload, verify publication entries count**

Run: `bundle exec jekyll build`
Tool call: `preview_eval` with `expression: "window.location.reload()"`
Tool call: `preview_eval` with `expression: "document.querySelectorAll('.pub-entry').length"`
Expected: `24`

Tool call: `preview_inspect` with `selector: ".pub-entry:first-child .pub-text strong", styles: ["font-family","font-size"]`
Expected: `font-family` starts with `Fraunces`, `font-size: 19px`.

Tool call: `preview_eval` with `expression: "document.querySelector('.pub-entry:first-child .venue-tag').textContent"`
Expected: `IEEE ICRA`.

- [ ] **Step 5: Commit**

```bash
git add index.md
git commit -m "feat(pubs): unwrap card, venue-tag pills, Fraunces titles"
```

---

## Task 19: Rewrite index.md — Working Titles + Awards

**Files:**
- Modify: `index.md` — the `<section class="card-grid">` block directly after publications (holds "Working Titles Under Review" and "Awards & Honors")

- [ ] **Step 1: Replace the card-grid block**

Find:

```markdown
<section class="card-grid">
<article class="card card--pills" markdown="1">
#### Working Titles Under Review
  - Pressure Estimation for Hand-based Interaction
  - Off-policy Evaluation from Multiple Logging Policies
  - Efficient and Robust Camera Calibration
  </article>

<article class="card" markdown="1">
#### Awards & Honors
  * *2024*, Lab demo project selected as **Popular Choice Winner in [CHI 2024](https://chi2024.acm.org/)**
  * *2021*, **Best Undergraduate Thesis Award** from GIST
  * *2020*, **5th place in [xView2 Challenge](https://xview2.org/)**
  * *2018*, **3rd-4th place in CVPR [NTIRE Super-resolution Challenge](https://data.vision.ee.ethz.ch/cvl/ntire18/)**
  * *2018*, **2nd place in [DOTA Challenge](https://captain-whu.github.io/DOTA/)**
  * *2016*, **Grand Prize at [KISTI National Supercomputing Competition](https://webedu.ksc.re.kr/gallery.es?mid=a30501000000&bid=0008&tag=&b_list=12&act=view&list_no=57&nPage=1&vlist_no_npage=0&keyField=&keyWord=&orderby=)**
  * *2016*, **Qualcomm-GIST Innovation Award**
  </article>
</section>
```

Replace with:

```html
<div class="twocol">
  <section class="section">
    <header class="section__head">
      <h2>Working Titles Under Review</h2>
      <span class="section__num">§ 06</span>
    </header>
    <ul class="tagged-list">
      <li>Pressure Estimation for Hand-based Interaction</li>
      <li>Off-policy Evaluation from Multiple Logging Policies</li>
      <li>Efficient and Robust Camera Calibration</li>
    </ul>
  </section>
  <section class="section">
    <header class="section__head">
      <h2>Awards & Honors</h2>
      <span class="section__num">§ 07</span>
    </header>
    <ul class="awards-list">
      <li><div class="awards-list__year">2024</div><div class="awards-list__what">Lab demo project selected as <strong>Popular Choice Winner</strong> in <a href="https://chi2024.acm.org/">CHI 2024</a></div></li>
      <li><div class="awards-list__year">2021</div><div class="awards-list__what"><strong>Best Undergraduate Thesis Award</strong> from GIST</div></li>
      <li><div class="awards-list__year">2020</div><div class="awards-list__what"><strong>5th place</strong> in <a href="https://xview2.org/">xView2 Challenge</a></div></li>
      <li><div class="awards-list__year">2018</div><div class="awards-list__what"><strong>3rd-4th place</strong> in CVPR <a href="https://data.vision.ee.ethz.ch/cvl/ntire18/">NTIRE Super-resolution Challenge</a></div></li>
      <li><div class="awards-list__year">2018</div><div class="awards-list__what"><strong>2nd place</strong> in <a href="https://captain-whu.github.io/DOTA/">DOTA Challenge</a></div></li>
      <li><div class="awards-list__year">2016</div><div class="awards-list__what"><strong>Grand Prize</strong> at <a href="https://webedu.ksc.re.kr/gallery.es?mid=a30501000000&bid=0008&tag=&b_list=12&act=view&list_no=57&nPage=1&vlist_no_npage=0&keyField=&keyWord=&orderby=">KISTI National Supercomputing Competition</a></div></li>
      <li><div class="awards-list__year">2016</div><div class="awards-list__what"><strong>Qualcomm-GIST Innovation Award</strong></div></li>
    </ul>
  </section>
</div>
```

- [ ] **Step 2: Rebuild, reload, verify year color**

Run: `bundle exec jekyll build`
Tool call: `preview_eval` with `expression: "window.location.reload()"`
Tool call: `preview_inspect` with `selector: ".awards-list__year", styles: ["font-family","color"]`
Expected: `font-family` starts with `Fraunces`, `color: rgb(10, 122, 107)`.

- [ ] **Step 3: Commit**

```bash
git add index.md
git commit -m "feat(sections): Working Titles + Awards as twocol"
```

---

## Task 20: Rewrite index.md — Talks + Reviews

**Files:**
- Modify: `index.md` — the `<section class="card-grid">` block with "Invited Talks" and "Review Services"

- [ ] **Step 1: Replace the card-grid block**

Find:

```markdown
<section class="card-grid">
<article class="card" markdown="1">
#### Invited Talks
  * **Query as Representation: A Paradigm Shift in Computer Vision Caused by DETR** @ Online. Nov 2022. [YouTube](https://www.youtube.com/watch?v=7Eq8WyKWjU0&t=3491s) (Korean)
  * **Recent XAI Trends in Deep Learning Era: (Under-)specification and Approaches** @ KAERI. Feb 2020.
  * **Back to the Representation Learning with focusing on Visual Self-supervision** @ ETRI. Jul 2019. [Slides](https://drive.google.com/file/d/12vu4arZQQvwT8f7GJLI99_YIJCkl3BL-/view?usp=sharing) (Korean)
  * **Deep Perceptual Super-resolution: Going Beyond Distortion** @ KARI. Jul 2018. [Slides](https://drive.google.com/file/d/1JN0afRsnPfBgKWicPPg4hGKkBiLr_42M/view?usp=sharing)
  </article>

<article class="card" markdown="1">
#### Review Services
  * **Journals:** IEEE TPAMI, IEEE TNNLS, IEEE TGRS, IEEE GRSL, and more
  * **Conferences:** ICLR \`26, CVPR \`26, AISTATS \`26, NeurIPS \`25, ICML \`25, and others
  </article>
</section>
```

Replace with:

```html
<div class="twocol">
  <section class="section">
    <header class="section__head">
      <h2>Invited Talks</h2>
      <span class="section__num">§ 08</span>
    </header>
    <ul class="tagged-list">
      <li><strong>Query as Representation: A Paradigm Shift in Computer Vision Caused by DETR</strong> @ Online. Nov 2022. <a href="https://www.youtube.com/watch?v=7Eq8WyKWjU0&t=3491s">YouTube</a> (Korean)</li>
      <li><strong>Recent XAI Trends in Deep Learning Era: (Under-)specification and Approaches</strong> @ KAERI. Feb 2020.</li>
      <li><strong>Back to the Representation Learning with focusing on Visual Self-supervision</strong> @ ETRI. Jul 2019. <a href="https://drive.google.com/file/d/12vu4arZQQvwT8f7GJLI99_YIJCkl3BL-/view?usp=sharing">Slides</a> (Korean)</li>
      <li><strong>Deep Perceptual Super-resolution: Going Beyond Distortion</strong> @ KARI. Jul 2018. <a href="https://drive.google.com/file/d/1JN0afRsnPfBgKWicPPg4hGKkBiLr_42M/view?usp=sharing">Slides</a></li>
    </ul>
  </section>
  <section class="section">
    <header class="section__head">
      <h2>Review Services</h2>
      <span class="section__num">§ 09</span>
    </header>
    <ul class="tagged-list">
      <li><strong>Journals:</strong> IEEE TPAMI, IEEE TNNLS, IEEE TGRS, IEEE GRSL, and more</li>
      <li><strong>Conferences:</strong> ICLR '26, CVPR '26, AISTATS '26, NeurIPS '25, ICML '25, and others</li>
    </ul>
  </section>
</div>
```

- [ ] **Step 2: Rebuild and commit**

Run: `bundle exec jekyll build`

```bash
git add index.md
git commit -m "feat(sections): Talks + Reviews as twocol tagged-lists"
```

---

## Task 21: Rewrite index.md — Patents

**Files:**
- Modify: `index.md` — the final `<section class="card card--wide">` for Patents

- [ ] **Step 1: Replace the Patents section**

Find:

```markdown
<section class="card card--wide" markdown="1">
#### Patents
* Method for detecting object, **granted**, 10-2364882
* Method for detecting on-the-fly disaster damage based on image, **granted**, 10-2255998
* Method for predicting frame using deep learning, application, 10-2023-0115699
* Method, system, and computing device for generating an alternative image of a satellite or aerial image in which an image of an area of interest is replaced, application, 10-2023-0075347
* Method of training object prediction models using ambiguous labels, application, 10-2022-0000169
* Method for detecting object, application, 10-2021-0168545
* Method to detect object, application, 10-2021-0135451
* Method for data clustering, application, 10-2020-0107206
</section>
```

Replace with:

```html
<section class="section">
  <header class="section__head">
    <h2>Patents</h2>
    <span class="section__num">§ 10 · 8 filings</span>
  </header>
  <ul class="patents-list">
    <li><div>Method for detecting object <span class="status-pill">Granted</span></div><div class="patents-list__no">10-2364882</div></li>
    <li><div>Method for detecting on-the-fly disaster damage based on image <span class="status-pill">Granted</span></div><div class="patents-list__no">10-2255998</div></li>
    <li><div>Method for predicting frame using deep learning</div><div class="patents-list__no">10-2023-0115699</div></li>
    <li><div>Method, system, and computing device for generating an alternative image of a satellite or aerial image in which an image of an area of interest is replaced</div><div class="patents-list__no">10-2023-0075347</div></li>
    <li><div>Method of training object prediction models using ambiguous labels</div><div class="patents-list__no">10-2022-0000169</div></li>
    <li><div>Method for detecting object</div><div class="patents-list__no">10-2021-0168545</div></li>
    <li><div>Method to detect object</div><div class="patents-list__no">10-2021-0135451</div></li>
    <li><div>Method for data clustering</div><div class="patents-list__no">10-2020-0107206</div></li>
  </ul>
</section>
```

- [ ] **Step 2: Rebuild, reload, verify status-pill appears**

Run: `bundle exec jekyll build`
Tool call: `preview_eval` with `expression: "window.location.reload()"`
Tool call: `preview_eval` with `expression: "document.querySelectorAll('.status-pill').length"`
Expected: `2` (exactly two granted patents).

- [ ] **Step 3: Commit**

```bash
git add index.md
git commit -m "feat(patents): two-column list with status pill for Granted"
```

---

## Task 22: Add page-footer + close `.page` wrapper

**Files:**
- Modify: `index.md` — final lines (currently `</div>` closing `.profile-page`)

- [ ] **Step 1: Replace the closing `</div>`**

Find the final:

```markdown
</div>
```

Replace with:

```html
<footer class="page-footer">
  <span>Junghoon Seo — Curriculum Vitae · Updated 2026</span>
  <span>mikigom.github.io</span>
</footer>

</div>
```

- [ ] **Step 2: Rebuild and commit**

Run: `bundle exec jekyll build`

```bash
git add index.md
git commit -m "feat(footer): add editorial page footer"
```

---

## Task 23: Final verification pass

Verify every item in the spec's Success Criteria. If any check fails, read the source, fix it, commit, re-run the check.

- [ ] **Step 1: Rebuild fresh**

Run: `bundle exec jekyll clean && bundle exec jekyll build`
Expected: clean build, no warnings.

- [ ] **Step 2: Reload preview**

Tool call: `preview_eval` with `expression: "window.location.reload()"`

- [ ] **Step 3: Criterion #1 — no console errors**

Tool call: `preview_console_logs` with `level: "error"`
Expected: empty (no errors).

Tool call: `preview_network` with `filter: "failed"`
Expected: empty (no failed requests — no 404 for fonts or images).

- [ ] **Step 4: Criterion #2 — Hero h1 renders Fraunces at ≥68px**

Tool call: `preview_resize` with `preset: "desktop"` (1280×800)
Tool call: `preview_inspect` with `selector: ".hero h1", styles: ["font-family","font-size"]`
Expected: font-family string contains `Fraunces`; font-size `72px`.

- [ ] **Step 5: Criterion #3 — no `#0fbf9f` in rendered styles**

Tool call: `preview_eval` with expression:

```js
(() => {
  const css = Array.from(document.styleSheets)
    .flatMap(s => { try { return Array.from(s.cssRules) } catch(_) { return [] } })
    .map(r => r.cssText).join('\n');
  return css.includes('#0fbf9f') || css.toLowerCase().includes('rgb(15, 191, 159)');
})()
```

Expected: `false`.

- [ ] **Step 6: Criterion #4 — every section has left bar + § NN**

Tool call: `preview_eval` with expression:

```js
Array.from(document.querySelectorAll('.section'))
  .map(s => ({ num: s.querySelector('.section__num')?.textContent.trim().slice(0,5), bar: getComputedStyle(s, '::before').content }))
```

Expected: an array with 10 entries; each has a `num` starting with `§ 0` or `§ 1`, and `bar` is `"\"\""` (non-none content — indicating the `::before` accent bar is rendered).

- [ ] **Step 7: Criterion #5 — publications render + responsive hide**

Tool call: `preview_resize` with `preset: "desktop"`
Tool call: `preview_eval` with `expression: "document.querySelectorAll('.pub-entry').length"`
Expected: `24`.

Tool call: `preview_inspect` with `selector: ".pub-entry:first-child .pub-thumb", styles: ["display"]`
Expected: `display: grid` or `block` (visible).

Tool call: `preview_resize` with `preset: "mobile"` (375×812)
Tool call: `preview_inspect` with `selector: ".pub-entry:first-child .pub-thumb", styles: ["display"]`
Expected: `display: none`.

- [ ] **Step 8: Criterion #6 — awards year is Fraunces + teal**

Tool call: `preview_resize` with `preset: "desktop"`
Tool call: `preview_inspect` with `selector: ".awards-list__year", styles: ["font-family","color"]`
Expected: font-family contains `Fraunces`; color `rgb(10, 122, 107)`.

- [ ] **Step 9: Criterion #7 — patents Granted pill**

Tool call: `preview_eval` with expression:

```js
Array.from(document.querySelectorAll('.patents-list li')).map(li => ({
  text: li.textContent.slice(0, 40),
  hasPill: !!li.querySelector('.status-pill')
}))
```

Expected: 8 entries; exactly 2 have `hasPill: true` (the first two, which are Granted).

- [ ] **Step 10: Criterion #8 — 375px: h1 48px, hero stacks, no horizontal scroll**

Tool call: `preview_resize` with `preset: "mobile"`
Tool call: `preview_inspect` with `selector: ".hero h1", styles: ["font-size"]`
Expected: `font-size: 48px`.

Tool call: `preview_eval` with `expression: "document.documentElement.scrollWidth <= document.documentElement.clientWidth"`
Expected: `true` (no horizontal scroll).

Tool call: `preview_inspect` with `selector: ".hero", styles: ["grid-template-columns"]`
Expected: a single-column template (e.g., `375px` or `100%` — should not be the two-column desktop template).

- [ ] **Step 11: Criterion #10 — skip-to-content link preserved**

Tool call: `preview_resize` with `preset: "desktop"`
Tool call: `preview_eval` with `expression: "document.querySelector('.skip-to-content')?.getAttribute('href') || 'not-found'"`
Expected: a string ending in `#content` or similar (whatever the alembic theme defined). If this returns `'not-found'`, the alembic theme may not include the skip link for the page layout — that's acceptable since the spec said to preserve it "if present"; document the finding but no action needed unless it regressed from the old site.

- [ ] **Step 12: Visual proof screenshot**

Tool call: `preview_resize` with `preset: "desktop"`
Tool call: `preview_screenshot`
Save the screenshot path for the user.

Tool call: `preview_resize` with `preset: "mobile"`
Tool call: `preview_screenshot`
Save the mobile screenshot path for the user.

- [ ] **Step 13: No commit here unless a fix was needed**

If any criterion failed, the fix + commit happened inline during this task. Otherwise, no code changed — nothing to commit.

---

## Spec Coverage Checklist

Each spec requirement cross-referenced to the task that implements it:

| Spec Section | Task(s) |
|---|---|
| Design Tokens | 3 |
| Typography (fonts + scale) | 2, 4 |
| Topbar | 6, 15 |
| Hero | 7, 15 |
| Section primitive | 8, 16–22 (every section uses it) |
| Career/Education row-list | 9, 16 |
| Tagged list (Specialties/Talks/Reviews/Working Titles) | 10, 17, 19, 20 |
| Publications restyle | 11, 18 |
| Awards list | 12, 19 |
| Patents list + status pill | 13, 21 |
| Footer | 14, 22 |
| Responsive breakpoints | 14 |
| Removed legacy CSS | 5 |
| Font URL swap | 2 |
| Success criteria (all 10) | 23 |

## Notes

- **Commit cadence:** every task ends in a commit. 22 commits total (task 1 is setup-only, task 23 commits only if a fix is needed).
- **Rollback:** any task is a single-commit revert if the change goes sideways.
- **Stylelint / SCSS lint:** project has no linter configured; relying on `bundle exec jekyll build` to flag SCSS syntax errors.
- **Browser preview after each task:** not strictly required, but recommended after Phase D tasks (15+) since markup changes are immediately visible.
