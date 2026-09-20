---
name: Oud & Aura
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4b4640'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ed'
  outline: '#7c766f'
  outline-variant: '#cdc5bd'
  surface-tint: '#605e5c'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1d1b1a'
  on-primary-container: '#868381'
  inverse-primary: '#cac6c3'
  secondary: '#875200'
  on-secondary: '#ffffff'
  secondary-container: '#feb154'
  on-secondary-container: '#724500'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#201a15'
  on-tertiary-container: '#8c827a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6e1df'
  primary-fixed-dim: '#cac6c3'
  on-primary-fixed: '#1d1b1a'
  on-primary-fixed-variant: '#484645'
  secondary-fixed: '#ffddba'
  secondary-fixed-dim: '#ffb865'
  on-secondary-fixed: '#2b1700'
  on-secondary-fixed-variant: '#663d00'
  tertiary-fixed: '#ede0d7'
  tertiary-fixed-dim: '#d0c4bb'
  on-tertiary-fixed: '#201a15'
  on-tertiary-fixed-variant: '#4d453f'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.015em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.15em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system establishes a quiet luxury aesthetic for an independent haute-parfumerie and artisanal attar house. The visual voice is understated, architectural, and tactile—channeling the stillness and intimacy of an exclusive salon. 

Rooted in warm minimalism and high-end editorial commerce, the interface rejects aggressive promotional banners and high-saturation cues. Instead, it relies on generous negative space, deliberate typographic contrast, and exquisite tactile feedback. Every interaction conveys permanence, craft, and bespoke sensory indulgence, balancing timeless olfactory heritage with modern mobile-first fluid mechanics.

## Colors

The palette is anchored in organic warmth and nobility, avoiding sterile cool grays and harsh pure whites:

- **Primary (`#121110` - Deep Noir):** A rich, warm black evoking aged oud wood, obsidian flacons, and ink. Used for primary typography, authoritative containers, and prominent primary actions.
- **Secondary (`#B57419` - Amber Gold):** A rich, burnished metallic accent referencing vintage brass atomizer hardware and distilled essences. Applied to subtle borders, focus accents, select micro-badges, and interactive hover highlights.
- **Tertiary (`#8C827A` - Muted Taupe):** A mineral earth tone for secondary meta-labels, olfactory notes (top, heart, base), disabled states, and subdued supporting details.
- **Neutral (`#FAF8F5` - Warm Ivory):** The primary canvas substrate, reminiscent of heavy cotton vellum and unbleached silk packaging. Secondary warm cream (`#F5F1EB`) and soft beige (`#EBE5DD`) provide structural layering without harsh division.

For conversational commerce pathways, an auxiliary muted patina green (`#2D5A46`) or champagne-bordered variant is reserved exclusively for bespoke concierge and WhatsApp ordering actions, preserving palette integrity without jarring standard utility greens.

## Typography

The typography couples high-contrast romantic elegance with pristine modern ergonomics.

- **Playfair Display** serves editorial headlines, fragrance names, and collection titles. Its sweeping serifs and delicate terminals impart heritage and high luxury. Headings use looser leading and slight negative tracking at large display sizes to maintain sculptural tension.
- **Plus Jakarta Sans** provides clarity and functional legibility for body descriptions, checkout steps, ingredient lists, and interactive elements.
- **Micro-Labels & Meta:** All functional category markers, badges, and pricing descriptors strictly leverage `label-caps` in uppercase with wide tracking (`0.15em`). This technique mirrors luxury perfume packaging typography and creates a clean rhythm against serif headings.

## Layout & Spacing

The layout adopts an editorial fluid grid system governed by generous margins to preserve breathing room around every flacon, narrative note, and ingredient breakdown.

- **Desktop (1024px+):** 12-column grid with `3rem` section margins and `1.25rem` gutters. Product showcases employ asymmetric spans (e.g., 7 columns for imagery, 5 columns for typography and sensory notes).
- **Tablet (768px - 1023px):** 8-column grid with `2rem` margins, allowing horizontal side-by-side comparison of sizes and concentrations.
- **Mobile (< 768px):** 4-column fluid layout with `1.25rem` canvas margins. Product cards transition into uninterrupted single-column or refined 2-column alternating grids. Sticky purchase bars and WhatsApp concierge triggers hug safe-area edges with `space-sm` breathing padding.

## Elevation & Depth

This design system avoids synthetic drop shadows and heavy elevation planes. Depth is established through **tonal layering**, **warm diffuse ambient blooms**, and **whisper-thin hairline borders**:

- **Subtle Hairlines:** Cards, dividers, and modal frames use a 1px border colored with `#EBE5DD` on light surfaces or `#282523` on dark surfaces.
- **Olfactory Bloom (Ambient Glow):** Product display stages and elevated modals employ an extra-diffused, ultra-low opacity shadow tinted in warm amber-noir: `0px 24px 48px -12px rgba(18, 17, 16, 0.06), 0px 4px 16px -2px rgba(181, 116, 25, 0.08)`.
- **Satin Backdrops:** Dialogs, overlays, and drawer components utilize `backdrop-filter: blur(16px)` over `#FAF8F5` at 85% opacity, creating the visual effect of frosted flacon glass.

## Shapes

The architectural signature is grounded in **Sharp / Architectural (`0`)** corners for all structural containers, cards, images, input fields, and panels. This mirrors the sharp geometry of crystal flacons, weighted caps, and rigid presentation cases.

A single deliberate exception is applied to specific interactive micro-elements: editorial category pills, scent profile tags, and secondary action chips use fully rounded pill geometry (`9999px`) to create an organic, pebble-like contrast against the crisp rectangular frame of the main layout.

## Components

### Buttons
- **Primary Noir:** Solid `#121110` fill with `#FAF8F5` typography, rectangular corners, subtle border transition to `#B57419` on hover. Padding: `16px 32px`. Text styled with `label-caps`.
- **Secondary Amber Outline:** 1px border in `#B57419`, transparent background, text in `#121110`. Hover transitions to a soft ivory wash (`#F5F1EB`).
- **Concierge / WhatsApp CTA:** Crisp rectangular or refined pill geometry. Rich deep forest-noir tone (`#1B2E24`) or Amber Gold border with an engraved WhatsApp icon and refined gold micro-badge stating "Bespoke Order" or "Fragrance Advisor".

### Badges & Editorial Tags
- **Style:** Compact pill tags (`9999px`) or hairline rectangular frames.
- **Hierarchy:** 
  - *Attar / Pure Oil:* Amber outline (`#B57419`), text in `#121110`.
  - *Concentrated / Extrait:* Deep Noir background (`#121110`), text in `#FAF8F5`.
  - *Limited / Archive:* Soft beige fill (`#EBE5DD`), text in `#8C827A`.
- All text uses `label-caps` at 10px or 11px with `0.18em` letter-spacing.

### Product Presentation Cards
- Architectural grid frames with hairline borders (`#EBE5DD`) on 3 sides or completely borderless with generous internal padding (`space-lg`).
- **Imagery Backdrop:** Soft satin warm gradient (`#F5F1EB` to `#FAF8F5`) centered with a delicate radial glow behind the perfume flacon.
- **Micro-Details:** Headings set in `Playfair Display` with pricing and extraction volumes (e.g., "12ml Extrait de Parfum") in tracked sans-serif.

### Input Fields & Selectors
- Flat rectangular field design with a bottom-only hairline border (`1.5px solid #8C827A`) or 4-sided crisp border (`1px solid #EBE5DD`).
- Background: `#FFFFFF` or translucent `#F5F1EB`.
- Focused state transitions smoothly to `#B57419` without aggressive outer glow rings. Labels float cleanly in uppercase tracking above the field.

### Olfactory Note Pyramids
- Segmented minimal tier components visualizing Top, Heart, and Base notes with delicate horizontal rules, small typography, and ingredient origin descriptors set in `body-sm`.