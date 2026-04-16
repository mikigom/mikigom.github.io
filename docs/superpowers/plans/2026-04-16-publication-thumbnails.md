# Publication Thumbnails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add card-style preview thumbnails (140x90px, rounded corners, shadow) to the left of each publication entry in the academic portfolio.

**Architecture:** Convert the publications markdown list to HTML flex rows. Each entry gets a `pub-entry` div containing a `pub-thumb` (image) and `pub-text` (markdown content). Images sourced from arxiv/project pages; papers without images get a CSS-styled placeholder with domain-specific SVG icon.

**Tech Stack:** Jekyll (GitHub Pages), SCSS, HTML, curl for image downloads

---

### Task 1: Add CSS for publication thumbnail layout

**Files:**
- Modify: `assets/styles.scss:421-448` (inside `.card--papers` block and after it)

- [ ] **Step 1: Add `.pub-entry` and `.pub-thumb` styles**

Add after the existing `.card--papers` block (after line 448) in `assets/styles.scss`:

```scss
/* Publication Entry with Thumbnail */
.pub-entry {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid var(--card-border);

  &:last-child {
    border-bottom: none;
  }
}

.pub-thumb {
  flex-shrink: 0;
  width: 140px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #f1f5f9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.pub-thumb--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%);
  border: 1px solid var(--card-border);

  svg {
    width: 36px;
    height: 36px;
    opacity: 0.35;
  }
}

.pub-text {
  flex: 1;
  min-width: 0;

  strong {
    color: var(--text);
    font-size: 1.5rem;
    display: block;
    margin-bottom: 0.3rem;
    line-height: 1.4;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;

    li {
      padding: 0.15rem 0;
      border-bottom: none;
      line-height: 1.8;

      &:before {
        content: none;
      }

      img {
        margin: 0 0.3rem;
        vertical-align: middle;
      }
    }
  }
}

@media (max-width: 600px) {
  .pub-thumb {
    display: none;
  }
}
```

- [ ] **Step 2: Verify styles compile**

Run: `cd "C:/Users/s3213/Downloads/mikigom.github.io" && bundle exec jekyll build 2>&1 | head -20`

Expected: Build succeeds without SCSS errors.

- [ ] **Step 3: Commit**

```bash
git add assets/styles.scss
git commit -m "style: add CSS for publication thumbnail layout"
```

---

### Task 2: Create `assets/papers/` directory and placeholder SVG

**Files:**
- Create: `assets/papers/placeholder-cv.svg`
- Create: `assets/papers/placeholder-rs.svg`
- Create: `assets/papers/placeholder-ml.svg`
- Create: `assets/papers/placeholder-hci.svg`

- [ ] **Step 1: Create the papers directory**

```bash
mkdir -p assets/papers
```

- [ ] **Step 2: Create CV/Detection placeholder SVG**

Create `assets/papers/placeholder-cv.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="90" viewBox="0 0 140 90">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0fdf4"/>
      <stop offset="100%" stop-color="#f0f9ff"/>
    </linearGradient>
  </defs>
  <rect width="140" height="90" rx="10" fill="url(#bg)"/>
  <rect x="30" y="20" width="40" height="30" rx="3" fill="none" stroke="#0fbf9f" stroke-width="2" stroke-dasharray="4 2" opacity="0.5"/>
  <rect x="70" y="40" width="40" height="30" rx="3" fill="none" stroke="#0fbf9f" stroke-width="2" stroke-dasharray="4 2" opacity="0.35"/>
  <circle cx="50" cy="35" r="4" fill="#0fbf9f" opacity="0.3"/>
</svg>
```

- [ ] **Step 3: Create Remote Sensing placeholder SVG**

Create `assets/papers/placeholder-rs.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="90" viewBox="0 0 140 90">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eff6ff"/>
      <stop offset="100%" stop-color="#f0fdf4"/>
    </linearGradient>
  </defs>
  <rect width="140" height="90" rx="10" fill="url(#bg)"/>
  <circle cx="70" cy="45" r="22" fill="none" stroke="#0fbf9f" stroke-width="2" opacity="0.4"/>
  <ellipse cx="70" cy="45" rx="22" ry="8" fill="none" stroke="#0fbf9f" stroke-width="1.5" opacity="0.3"/>
  <line x1="70" y1="23" x2="70" y2="67" stroke="#0fbf9f" stroke-width="1.5" opacity="0.25"/>
  <circle cx="70" cy="45" r="3" fill="#0fbf9f" opacity="0.35"/>
</svg>
```

- [ ] **Step 4: Create ML/XAI placeholder SVG**

Create `assets/papers/placeholder-ml.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="90" viewBox="0 0 140 90">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#faf5ff"/>
      <stop offset="100%" stop-color="#f0f9ff"/>
    </linearGradient>
  </defs>
  <rect width="140" height="90" rx="10" fill="url(#bg)"/>
  <circle cx="40" cy="30" r="5" fill="#0fbf9f" opacity="0.3"/>
  <circle cx="40" cy="60" r="5" fill="#0fbf9f" opacity="0.3"/>
  <circle cx="70" cy="35" r="5" fill="#0fbf9f" opacity="0.35"/>
  <circle cx="70" cy="55" r="5" fill="#0fbf9f" opacity="0.35"/>
  <circle cx="100" cy="45" r="5" fill="#0fbf9f" opacity="0.4"/>
  <line x1="45" y1="30" x2="65" y2="35" stroke="#0fbf9f" stroke-width="1.2" opacity="0.25"/>
  <line x1="45" y1="30" x2="65" y2="55" stroke="#0fbf9f" stroke-width="1.2" opacity="0.25"/>
  <line x1="45" y1="60" x2="65" y2="35" stroke="#0fbf9f" stroke-width="1.2" opacity="0.25"/>
  <line x1="45" y1="60" x2="65" y2="55" stroke="#0fbf9f" stroke-width="1.2" opacity="0.25"/>
  <line x1="75" y1="35" x2="95" y2="45" stroke="#0fbf9f" stroke-width="1.2" opacity="0.25"/>
  <line x1="75" y1="55" x2="95" y2="45" stroke="#0fbf9f" stroke-width="1.2" opacity="0.25"/>
</svg>
```

- [ ] **Step 5: Create HCI/Sensing placeholder SVG**

Create `assets/papers/placeholder-hci.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="90" viewBox="0 0 140 90">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef3f2"/>
      <stop offset="100%" stop-color="#f0f9ff"/>
    </linearGradient>
  </defs>
  <rect width="140" height="90" rx="10" fill="url(#bg)"/>
  <path d="M60 60 Q60 40 70 35 Q75 33 78 36 L80 40 Q82 36 86 38 Q88 40 88 44 L88 55 Q88 62 82 65 L68 65 Q60 65 60 60Z" fill="none" stroke="#0fbf9f" stroke-width="2" opacity="0.4"/>
  <circle cx="55" cy="35" r="8" fill="none" stroke="#0fbf9f" stroke-width="1.5" opacity="0.3" stroke-dasharray="3 2"/>
</svg>
```

- [ ] **Step 6: Commit**

```bash
git add assets/papers/
git commit -m "assets: add placeholder SVGs for publication thumbnails"
```

---

### Task 3: Search and download representative images for papers with project pages

**Files:**
- Create: `assets/papers/yopo.jpg` (or .png)
- Create: `assets/papers/forcectrl.jpg`
- Create: `assets/papers/pimforce.jpg`

These 3 papers have dedicated project pages with hero/teaser images:

- [ ] **Step 1: Download YOPO image from project page**

Visit `https://mikigom.github.io/YOPO-project-page/` and find the teaser/hero figure. Download it:

```bash
curl -L -o assets/papers/yopo.jpg "<image-url-from-project-page>"
```

If the project page doesn't have a suitable image, try the arxiv page `https://arxiv.org/abs/2508.14965`.

- [ ] **Step 2: Download ForceCtrl image from project page**

Visit `https://ohseo.github.io/projects/2025_01_forcectrl/` and find the teaser figure. Download it:

```bash
curl -L -o assets/papers/forcectrl.jpg "<image-url-from-project-page>"
```

- [ ] **Step 3: Download PIMForce image from project page**

Visit `https://pimforce.hcitech.org/` and find the teaser figure. Download it:

```bash
curl -L -o assets/papers/pimforce.jpg "<image-url-from-project-page>"
```

- [ ] **Step 4: Commit**

```bash
git add assets/papers/yopo.* assets/papers/forcectrl.* assets/papers/pimforce.*
git commit -m "assets: add thumbnail images from project pages"
```

---

### Task 4: Search and download images for arxiv papers

**Files:**
- Create: `assets/papers/{short-id}.jpg` for each paper where an image is found

Papers with arxiv links (search each for a representative first-figure or teaser):

| Short ID | ArXiv ID | Paper |
|----------|----------|-------|
| hdm-detr | 2305.07598 | Hausdorff Distance Matching |
| billion-rs | 2304.05215 | Billion-scale Foundation Model |
| proto-cd | 2310.09759 | Prototype-oriented Change Detection |
| sihg | 2202.10523 | Semi-Implicit Hybrid Gradient |
| domain-inv-det | 2105.14693 | Domain-invariant Object Detector |
| naive-pll | 2010.11600 | Naive Partial Label Learning |
| bagging-disaster | 1910.01911 | Revisiting Classical Bagging |
| dcfsc | 1908.09419 | Deep Closed-Form Subspace Clustering |
| noisy-saliency | 1902.04893 | Why are Saliency Maps Noisy |
| bridge-adv | 1903.11626 | Bridging Adversarial Robustness |
| noise-saliency | 1806.03000 | Noise-adding Saliency Map |
| domain-aircraft | 1806.03002 | Domain Adaptive Aircraft |

For each paper:

- [ ] **Step 1: Visit each arxiv HTML page and search for first figure**

For each arxiv ID, try `https://arxiv.org/html/{id}` to find figure images. If HTML version is unavailable, try `https://arxiv.org/abs/{id}` for the abstract page thumbnail.

Download each found image:
```bash
curl -L -o assets/papers/{short-id}.jpg "<figure-url>"
```

- [ ] **Step 2: Search for images for non-arxiv papers**

Papers without arxiv links that may have accessible images:
- `thumb-force`: ACM DL page `https://dl.acm.org/doi/10.1145/3746058.3760441`
- `lst-sr`: IEEE `https://ieeexplore.ieee.org/document/11011314`
- `self-pair`: CVF open access `https://openaccess.thecvf.com/content/WACV2023/...`
- `goar`: OpenReview `https://openreview.net/forum?id=gh69Bu7k48`

For each, visit the page and look for a representative figure. Download if found, otherwise the paper will use a placeholder.

- [ ] **Step 3: Record which papers need placeholders**

Papers that will use placeholders (no image found):
- `quantile-ae` (IEEE Access, no preprint) -> `placeholder-ml.svg`
- `cmc-sar` (IEEE GRSL, no preprint) -> `placeholder-rs.svg`
- `nl-linknet` (IEEE GRSL, no preprint) -> `placeholder-rs.svg`
- `rbox-cnn` (ACM, no preprint) -> `placeholder-cv.svg`
- `multitask-aircraft` (no link at all) -> `placeholder-cv.svg`

Update this list based on actual search results from steps 1-2.

- [ ] **Step 4: Commit all downloaded images**

```bash
git add assets/papers/
git commit -m "assets: add paper thumbnail images from arxiv and conferences"
```

---

### Task 5: Convert publications section to HTML with thumbnails

**Files:**
- Modify: `index.md:71-145` (the entire publications section)

- [ ] **Step 1: Replace the publications section**

Replace lines 71-145 in `index.md` with the new HTML structure. The section header stays the same; each `* **Title**...` list item becomes a `pub-entry` div.

The pattern for each entry with an image:
```html
<div class="pub-entry">
  <div class="pub-thumb">
    <img src="/assets/papers/{short-id}.jpg" alt="{short title}" loading="lazy" />
  </div>
  <div class="pub-text" markdown="1">
**Full Paper Title**
  - <img height="10" src="/assets/-Authors-brightgreen.svg"> Author list
  - <img height="10" src="/assets/-Presented%20at-blue.svg"> Venue. Year. [icon links]
  </div>
</div>
```

The pattern for entries using a placeholder:
```html
<div class="pub-entry">
  <div class="pub-thumb pub-thumb--placeholder">
    <img src="/assets/papers/placeholder-{domain}.svg" alt="placeholder" />
  </div>
  <div class="pub-text" markdown="1">
**Full Paper Title**
  - <img height="10" src="/assets/-Authors-brightgreen.svg"> Author list
  - <img height="10" src="/assets/-Presented%20at-blue.svg"> Venue. Year. [icon links]
  </div>
</div>
```

Convert all 24 publications following this pattern. Use `loading="lazy"` on all images for performance.

Map each paper to its image or placeholder:

| # | Short ID | Image file | Placeholder fallback |
|---|----------|-----------|---------------------|
| 1 | yopo | yopo.jpg | placeholder-cv.svg |
| 2 | forcectrl | forcectrl.jpg | placeholder-hci.svg |
| 3 | thumb-force | thumb-force.jpg | placeholder-hci.svg |
| 4 | lst-sr | lst-sr.jpg | placeholder-rs.svg |
| 5 | hdm-detr | hdm-detr.jpg | placeholder-cv.svg |
| 6 | pimforce | pimforce.jpg | placeholder-hci.svg |
| 7 | billion-rs | billion-rs.jpg | placeholder-rs.svg |
| 8 | self-pair | self-pair.jpg | placeholder-rs.svg |
| 9 | goar | goar.jpg | placeholder-ml.svg |
| 10 | proto-cd | proto-cd.jpg | placeholder-rs.svg |
| 11 | sihg | sihg.jpg | placeholder-ml.svg |
| 12 | quantile-ae | — | placeholder-ml.svg |
| 13 | cmc-sar | — | placeholder-rs.svg |
| 14 | domain-inv-det | domain-inv-det.jpg | placeholder-cv.svg |
| 15 | naive-pll | naive-pll.jpg | placeholder-ml.svg |
| 16 | nl-linknet | — | placeholder-rs.svg |
| 17 | bagging-disaster | bagging-disaster.jpg | placeholder-cv.svg |
| 18 | dcfsc | dcfsc.jpg | placeholder-ml.svg |
| 19 | noisy-saliency | noisy-saliency.jpg | placeholder-ml.svg |
| 20 | bridge-adv | bridge-adv.jpg | placeholder-ml.svg |
| 21 | rbox-cnn | — | placeholder-cv.svg |
| 22 | noise-saliency | noise-saliency.jpg | placeholder-ml.svg |
| 23 | domain-aircraft | domain-aircraft.jpg | placeholder-rs.svg |
| 24 | multitask-aircraft | — | placeholder-cv.svg |

Use the actual image if it was downloaded in Tasks 3-4; otherwise fall back to the placeholder.

- [ ] **Step 2: Verify Jekyll builds successfully**

Run: `cd "C:/Users/s3213/Downloads/mikigom.github.io" && bundle exec jekyll build 2>&1 | head -20`

Expected: Build succeeds, no markdown or HTML errors.

- [ ] **Step 3: Commit**

```bash
git add index.md
git commit -m "feat: add publication thumbnails with card-style preview layout"
```

---

### Task 6: Visual verification

- [ ] **Step 1: Start local Jekyll server**

```bash
cd "C:/Users/s3213/Downloads/mikigom.github.io" && bundle exec jekyll serve
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:4000` and check:
- Each publication shows a thumbnail on the left
- Images display correctly with rounded corners and shadow
- Placeholder SVGs display for papers without images
- Text alignment and spacing look good
- Links and icon buttons still work
- Responsive: resize below 600px and verify thumbnails hide gracefully

- [ ] **Step 3: Fix any visual issues**

If spacing, sizing, or alignment needs adjustment, update `assets/styles.scss` accordingly.

- [ ] **Step 4: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix: adjust publication thumbnail styling"
```
