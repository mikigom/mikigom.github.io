# Publication Thumbnails Design Spec

## Goal

Add card-style thumbnail images (140x90px, rounded corners, subtle shadow) to the left of each publication entry in `index.md`. Representative images should be sourced from paper pages or arxiv; papers without available images get a styled placeholder.

## Layout

Each publication entry becomes a flex row:

```
+------------------+  +---------------------------------------------+
|                  |  |  **Paper Title**                            |
|   140 x 90px     |  |  Authors: ...                               |
|   thumbnail      |  |  Venue. Year. [icons]                       |
|                  |  |                                             |
+------------------+  +---------------------------------------------+
```

- **Thumbnail**: 140x90px, `border-radius: 10px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- **Gap**: 16px between thumbnail and text
- **Object-fit**: `cover` to fill the frame without distortion
- **Mobile**: Thumbnail hidden below 600px to preserve readability

## HTML Structure Change

The current markdown list (`* **Title**...`) in the `card--papers` section must switch to raw HTML since Jekyll markdown doesn't support flex layouts within list items. Each entry becomes:

```html
<div class="pub-entry">
  <div class="pub-thumb">
    <img src="/assets/papers/yopo.png" alt="YOPO figure" />
  </div>
  <div class="pub-text" markdown="1">
**Paper Title**
  - Authors...
  - Venue...
  </div>
</div>
```

## CSS Additions (in `assets/styles.scss`)

New classes inside `.card--papers`:
- `.pub-entry` — flex row, aligned top, gap 16px, bottom border
- `.pub-thumb` — 140x90 fixed, rounded, shadow, overflow hidden
- `.pub-thumb img` — 100% w/h, object-fit cover
- `.pub-thumb--placeholder` — gradient background + SVG icon for papers without images
- Responsive: hide `.pub-thumb` at `max-width: 600px`

## Image Sourcing Strategy

1. **Project pages** (YOPO, ForceCtrl, PIMForce) — download hero/figure image
2. **ArXiv papers** — visit paper page or PDF to find a representative figure (first figure / teaser)
3. **Conference open-access** (CVF, OpenReview) — find figure from the paper
4. **IEEE/ACM** (behind paywall) — try arxiv preprint if available, otherwise placeholder
5. **No source available** — use domain-specific SVG placeholder

Images stored in `assets/papers/` directory, named by short identifier (e.g., `yopo.png`, `forcectrl.png`).

## Placeholder Design

Gradient background matching site accent colors with a domain-specific icon:
- CV/Detection: bounding box icon
- Remote Sensing: satellite/globe icon  
- ML/XAI: neural network graph icon
- HCI: hand/interaction icon

Implemented as a CSS class `.pub-thumb--placeholder` with inline SVG.

## Publications Inventory (24 papers)

| # | Short ID | Title (abbrev) | Image Source |
|---|----------|----------------|--------------|
| 1 | yopo | You Only Pose Once | project page / arxiv |
| 2 | forcectrl | ForceCtrl | project page |
| 3 | thumb-force | Thumb Force Estimation | ACM page |
| 4 | lst-sr | Guided Super Resolution LST | IEEE / placeholder |
| 5 | hdm-detr | Hausdorff Distance Matching | arxiv |
| 6 | pimforce | Posture-Informed Muscular Force | project page |
| 7 | billion-rs | Billion-scale Foundation Model RS | arxiv |
| 8 | self-pair | Self-Pair Change Detection | CVF open access |
| 9 | goar | GOAR XAI | OpenReview |
| 10 | proto-cd | Prototype-oriented Change Detection | arxiv |
| 11 | sihg | Semi-Implicit Hybrid Gradient | arxiv |
| 12 | quantile-ae | Quantile Autoencoder | IEEE / placeholder |
| 13 | cmc-sar | Contrastive Multiview Coding SAR | IEEE / placeholder |
| 14 | domain-inv-det | Domain-invariant Object Detector | arxiv |
| 15 | naive-pll | Naive Partial Label Learning | arxiv |
| 16 | nl-linknet | NL-LinkNet | IEEE / placeholder |
| 17 | bagging-disaster | Revisiting Classical Bagging | arxiv |
| 18 | dcfsc | Deep Closed-Form Subspace Clustering | arxiv |
| 19 | noisy-saliency | Why are Saliency Maps Noisy | arxiv |
| 20 | bridge-adv | Bridging Adversarial Robustness | arxiv |
| 21 | rbox-cnn | RBox-CNN | ACM / placeholder |
| 22 | noise-saliency | Noise-adding Saliency Map | arxiv |
| 23 | domain-aircraft | Domain Adaptive Aircraft Generation | arxiv |
| 24 | multitask-aircraft | Multi-task Aircraft Classification | placeholder |

## Implementation Order

1. Add CSS for `.pub-entry`, `.pub-thumb`, `.pub-thumb--placeholder` to `styles.scss`
2. Create `assets/papers/` directory
3. Search & download representative images for each paper (batch by source)
4. Create placeholder SVG/CSS for papers without images
5. Convert publications section in `index.md` from markdown list to HTML with thumbnails
6. Test locally with Jekyll serve and verify responsive behavior
