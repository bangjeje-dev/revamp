# About Page: UI/UX Specification

## 1. Overall Page Layout
The About page is an editorial, typography-driven experience. It strips away heavy UI components in favor of massive whitespace, severe typography, and subtle glowing accents to establish intellectual authority. The layout is heavily asymmetric in certain sections to avoid predictable, boring corporate templates.

## 2. Visual Hierarchy
1. **Typography:** The absolute dominant element. Headlines (`<h1>`, `<h2>`) will use extreme scaling (`text-5xl` to `text-[7rem]`) with ultra-tight tracking (`tracking-tighter`).
2. **Whitespace (Negative Space):** Serves as a primary design element. Padding of `py-32` to `py-48` will enforce a slow, deliberate reading pace.
3. **Glassmorphism:** Used sparingly for structural containment (e.g., The Principles cards).
4. **Color (#C3FF00):** Used exclusively for interaction states, key emphasis, and subtle ambient glows.

## 3. Section-by-Section Layout

**01. The Manifesto Hero**
- **Layout:** Centered, highly constrained max-width container (`max-w-4xl`). Massive headline scaling down to a refined, mid-sized paragraph.
- **UI:** No buttons. Just raw typography. A subtle mesh gradient glow (`#C3FF00` at 5-10% opacity) sits behind the text.

**02. The Core Thesis (The Cost of Fragmented Execution)**
- **Layout:** Asymmetric 12-column grid. Left side (col-span-4) holds the section sticky title. Right side (col-span-8) holds large, editorial prose.
- **UI:** High-contrast text (`textPrimary`) against pure dark background.

**03. How We Think (Strategic Decision Making)**
- **Layout:** 2-column alternating text layout, or standard vertical stacking with `max-w-3xl` center alignment works best for readability.
- **UI:** Indented blockquotes with a 2px solid `#C3FF00` left border for key strategic statements.

**04. The Principles**
- **Layout:** 2-column or 3-column CSS Grid.
- **UI:** Heavily relies on the existing `.glass-card` component. Each card contains a massive, dim number (e.g., "01"), a bright title, and secondary text.

**05. The Proof**
- **Layout:** Minimalist stat grid. 3 or 4 columns.
- **UI:** Massive numbers (e.g., `text-6xl`) in `#F8FAFC`, with a subtle neon lime dot or underline, paired with small, uppercase tracking-widest metric labels.

**06. The Partnership Model**
- **Layout:** Centered text block, max-width constrained.
- **UI:** Deep, dark surface (`#0D1117`) background spanning the full viewport width to break up the vertical rhythm.

**07. The Work Bridge**
- **Layout:** Full width, high-impact image or abstract graphic masked inside a glass container, with a prominent "View the Proof" or "Explore Case Studies" link.
- **UI:** Hover reveals a magnetic, neon lime arrow.

**08. Final CTA (The Catalyst)**
- **Layout:** Reused from Homepage/Services. Massive heading, centered, with dual buttons.
- **Copy Update:** "Discuss Partnership" instead of "Start Project".

**09. Global Footer**
- Reused exactly as implemented globally.

## 4. Grid System
- 12-column CSS grid (`grid-cols-12`) used for asymmetric narrative sections (e.g., Thesis).
- 2, 3, or 4-column grids used for structured data (Principles, Proof).
- Gap sizing must remain consistent (`gap-8` to `gap-16` on desktop).

## 5. Container Widths
- **Global Constraints:** `max-w-7xl` or `max-w-8xl` with `px-6` (mobile) to `px-12` (desktop).
- **Reading Containers:** Paragraph blocks must be constrained to `max-w-2xl` or `max-w-3xl` to maintain an optimal reading length of 60-75 characters per line.

## 6. Typography Scale (Outfit)
- **Hero Title (`<h1>`):** `text-6xl md:text-7xl lg:text-[7rem] font-medium tracking-tighter leading-none`.
- **Section Headers (`<h2>`):** `text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight`.
- **Manifesto Prose:** `text-xl md:text-2xl lg:text-3xl font-light text-textSecondary leading-relaxed`.
- **Standard Body:** `text-base md:text-lg font-light text-textSecondary leading-loose`.
- **Labels (Proof/Metrics):** `text-xs md:text-sm uppercase tracking-widest text-textSecondary font-semibold`.

## 7. Spacing System
- **Section Padding:** `py-24 md:py-32 lg:py-48` for massive breathing room.
- **Element Spacing:** `space-y-6` for paragraphs, `space-y-12` for headline-to-body transitions.
- **Grid Gaps:** `gap-8` or `gap-12`.

## 8. Color Usage
- **Background:** `bg-[#050505]` for the vast majority of the page.
- **Surface:** `bg-[#0D1117]` used for The Partnership Model to create a subtle banding effect.
- **Card:** `bg-[#111827]` mixed with `bg-opacity-50` for glass cards.
- **Text:** `text-[#F8FAFC]` for all headings and active states. `text-[#94A3B8]` for all body copy and inactive states.
- **Accent:** `#C3FF00` reserved for links (hover), active nav states, button backgrounds (primary), and abstract mesh gradients.

## 9. Glass Card Specifications
- **Reuse:** Exact same `.glass-card` utility classes from the Homepage.
- **CSS:** `backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 lg:p-12`.
- **Hover:** Subtle transform (`-translate-y-2`), increased border opacity (`border-white/20`), and subtle glow box-shadow.

## 10. Button System
- **Reuse Global Component:**
- **Primary:** Neon Lime background (`bg-accent`), dark text (`text-dark`), rounded-full, `px-8 py-4`, `font-semibold`. Hover: scales up `scale-105`, intensifies color.
- **Secondary:** Transparent background, white border (`border-white/20`), white text. Hover: border becomes lime (`border-accent`), text becomes lime.

## 11. Icon Style
- **Phosphor Icons (Light/Thin weight).**
- Used inside The Principles (top left of glass cards) and for the Work Bridge (directional arrows).

## 12. Motion & Animation
- **Reveal System:** Strict adherence to the `.reveal-up` Intersection Observer system.
- **Staggering:** Extensive use of `.delay-100`, `.delay-200`, `.delay-300` in the manifesto and thesis sections to ensure paragraphs cascade in slowly, enforcing a reading rhythm.
- **Easing:** All transitions use `cubic-bezier(0.16, 1, 0.3, 1)`.

## 13. Scroll Behaviour
- `scroll-smooth` globally enabled.
- Parallax effects minimized to avoid distracting from the text. Focus entirely on opacity and Y-translation reveals.

## 14. Hover States
- **Text Links:** `text-textSecondary` transitions to `text-textPrimary` with a bottom border or underline using the `#C3FF00` accent.
- **Glass Cards:** Subtle lift and border illumination.
- **Work Bridge:** The entire container should act as a giant hit area, scaling the internal image/graphic slightly (`scale-105`) and highlighting the arrow icon.

## 15. Responsive Behaviour
- **Mobile First:** Typography drops down two scale steps (e.g., `text-[7rem]` becomes `text-5xl`). All grids (Principles, Proof) collapse to 1 column. Padding drops to `py-16`.
- **Tablet:** 2-column grids applied. Typography scales up.
- **Desktop:** Full layout activated. Extreme typography sizes and massive padding enforced.

## 16. Accessibility Notes
- `aria-label` applied to the Work Bridge and final CTA.
- The `textSecondary` color (`#94A3B8`) on the `dark` background (`#050505`) passes WCAG AA for normal text.
- Ensure `alt` tags on any imagery used in the Work Bridge.

## 17. Component Reuse Strategy
- **Header:** Sticky glass nav.
- **Footer:** Massive logo footer.
- **CSS Classes:** `.reveal-up`, `.glass-card`, `.btn-primary`, `.btn-secondary`.
- **No new CSS classes** should be written unless absolutely necessary for a hyper-specific layout (like an asymmetric text block).

## 18. Implementation Notes
- The developer must strictly map this to `about.html` without injecting custom structural CSS.
- Tailwind utility classes are sufficient for 100% of this layout.
- The Intersection Observer JS from `index.html` must be linked or copied into this page.
