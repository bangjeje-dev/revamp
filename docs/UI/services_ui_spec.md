# UI/UX Specification: Services Page

**Project:** bangjeje.dev
**Document Type:** UI/UX Blueprint
**Author:** Creative Director / UX Architect
**Status:** Approved for implementation

---

## 1. Global UI Rules & Architecture

### Page Layout & Grid System
*   **Container:** `max-w-8xl` (1440px) to prevent excessive stretching on 4K displays.
*   **Grid:** 12-column CSS Grid layout for complex internal alignments, defaulting to flexbox for standard stacking.
*   **Bleed:** Ambient glows and borders break out to full viewport width, while content remains constrained.

### Typography Hierarchy (Outfit)
*   **Display / Hero Headlines:** `text-7xl` to `text-9xl` (Desktop). `tracking-tighter`, `leading-[1.05]`.
*   **Section Headers:** `text-5xl` to `text-6xl`. `font-bold`.
*   **Pill Labels / Meta:** `text-xs` to `text-sm`. `uppercase`, `tracking-widest`, `font-mono`.
*   **Body Text:** `text-lg` or `text-xl`. `font-light`, `leading-relaxed`, color: `#94A3B8`.

### Spacing System
*   **Vertical Rhythm:** Massive section padding (`py-32` or `py-40` for desktop, `py-20` for mobile).
*   **Component Gaps:** `gap-6` or `gap-8` for grids, up to `gap-16` for editorial side-by-side text blocks.

### Button System & CTA Hierarchy
*   **Primary CTA (`.btn-primary`):** Background `#C3FF00`, Text `#050505`. Pill shape (`rounded-full`). Soft shadow/glow (`rgba(195,255,0,0.2)`). Hovers to `#D7FF4D`.
*   **Secondary CTA (`.btn-secondary`):** Transparent background, `border border-glass`, Text `#F8FAFC`. Hovers to white text with a very subtle `#C3FF00` border glow. Used for "View Related Work".

### Navigation & Scroll Behavior
*   **Nav:** Sticky global header. Transparent until scroll, then inherits a deep `backdrop-blur-md` with `border-b border-glass`. The "Services" link is active (colored `#C3FF00`).
*   **Scroll:** `scroll-behavior: smooth` applied globally.
*   **Link Routing:** Every service section should have a secondary CTA routing to the `#work` or `/work.html` section to maintain engagement.

### Animation Behavior
*   **Reveal-Up:** Every section and major typographic block uses a custom Intersection Observer class (`reveal-up`). Initial state: `opacity: 0`, `transform: translateY(30px)`. Final state: `opacity: 1`, `transform: translateY(0)`.
*   **Stagger:** Child elements within a grid (e.g., deliverables) stagger their entrance by `100ms`.
*   **Easing:** Heavy, cinematic easing (`cubic-bezier(0.16, 1, 0.3, 1)`). Duration: `700ms`.

### Accessibility Considerations
*   **Focus States:** Explicit keyboard focus states (`focus-visible`) using a 2px `#C3FF00` ring with an offset.
*   **Contrast:** Secondary text (`#94A3B8`) against `#050505` exceeds WCAG AA.
*   **ARIA:** Decorative glows are set to `aria-hidden="true"`.

---

## 2. Section Specifications

### Section 1: The Capabilities Hero
*   **Purpose:** Establish the scale and authority of the studio immediately.
*   **Layout:** Centered, perfectly balanced block. No background images. Pure typography and light.
*   **Typography:** Giant `9xl` headline breaking across two lines. "Capabilities & Services". Small uppercase badge above it: `02 // OUR EXPERTISE`.
*   **Spacing:** `min-h-[70vh]` or `80vh` to allow the user to immediately scroll down.
*   **Interaction:** None. Static confidence.
*   **Animation:** Text block drifts up smoothly on load. Ambient mesh gradient fades in behind.
*   **CTA:** Scroll indicator down arrow or "Explore Methodologies".
*   **Responsive:** Typography scales down to `text-5xl` on mobile.

### Sections 2-5: The Core Services
*   **Purpose:** Break down UI/UX, Web Dev, Business Systems, and Growth.
*   **Layout:** Alternating Z-pattern (Left-Right, Right-Left).
    *   *Side A (Content):* Massive Service Title (e.g., "UI/UX Architecture"), 2 sentences of business-value body copy, followed by a secondary CTA ("View Design Cases").
    *   *Side B (Deliverables):* A structural, bordered list of actual deliverables. Not standard glass cards, but elegant rows (e.g., `border-b border-glass py-4`).
*   **Typography:** Service titles at `text-6xl`. Deliverable items at `text-xl` or `text-2xl` with a thin font weight.
*   **Spacing:** `py-32`. Huge gaps (`gap-16`) between Side A and Side B.
*   **Interaction (Hover):** Hovering over a deliverable row triggers a soft `#C3FF00` 1px border shift and a slight left-padding increase (`translate-x`).
*   **Animation:** Side A drifts up first. Side B deliverables drift up sequentially (staggered).
*   **CTA:** Secondary CTA linking to `/work.html` or `/contact.html`.
*   **Responsive:** Z-pattern breaks into a strict vertical stack on mobile/tablet. Content block always appears *above* the deliverable list on mobile.

### Section 6: The bangjeje.dev Difference (Working Model)
*   **Purpose:** Differentiate from traditional bloat agencies. Explain the partnership model.
*   **Layout:** A 3-column grid (`grid-cols-3`).
*   **Typography:** Section header at `text-5xl`. Grid items have `text-2xl` headers (e.g., "Direct Access", "Extreme Velocity", "Zero Middlemen").
*   **Spacing:** `py-32`. `gap-8` between columns.
*   **Interaction:** Standard glassmorphism card hover (border shifts to faint lime, internal shadow).
*   **Animation:** Standard `reveal-up` stagger.
*   **CTA:** None. Purely informational.
*   **Responsive:** `grid-cols-1` on mobile, `grid-cols-2` on tablet, `grid-cols-3` on desktop.

### Section 7: Final CTA
*   **Purpose:** The ultimate conversion point.
*   **Layout:** Massive full-width glass panel constrained by the `max-w-6xl` container. High padding (`py-24`).
*   **Typography:** Giant centered headline: "Ready to engineer your next phase of growth?"
*   **Spacing:** `mb-12` (provides space before the global footer).
*   **Interaction:** The entire container emits a soft, pulsing `#C3FF00` glow behind it. Primary button is magnetic.
*   **Animation:** Standard reveal-up.
*   **CTA:** `.btn-primary` -> "Initiate Project".
*   **Responsive:** Padding reduces on mobile (`py-16`), text scales to `text-4xl`.

---

## 3. Visual Consistency Checklist
- [ ] No generic box shadows; use soft, colored ambient glows.
- [ ] No border radii under `16px` for structural elements, except buttons (`rounded-full`).
- [ ] Ensure all hover states transition color AND a secondary property (transform or border).
- [ ] Never use `#2DD4BF` (Teal) – exclusively use `#C3FF00` (Lime) for accents.
- [ ] Validate that all sections link out to either Contact, Work, or Articles to prevent dead-ends.
