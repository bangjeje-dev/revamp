# Design Foundation: bangjeje.dev

**Status:** Approved
**Version:** 4.0 (Dark Mode Vercel/Linear Aesthetic)

## 1. Core Brand Identity
*   **Positioning:** Premium Digital Design Studio & Growth Partner
*   **Aesthetic Goal:** Minimal luxury, extremely confident, calm, and highly technical.
*   **Inspiration:** Linear, Vercel, Framer, Cuberto, Locomotive.
*   **Philosophy:** Less UI. Less effects. More sophistication. Whitespace is more valuable than decoration.

## 2. Technical Stack
*   **Architecture:** Component-based Multipage Website
*   **Languages:** HTML5, Vanilla JavaScript
*   **Styling:** Tailwind CSS
*   **Performance:** SEO-friendly semantic markup, performance-first development.

## 3. The Color System (Dark Luxury)
*   **Background (Canvas):** `#050505` (Deepest black)
*   **Elevated Surface:** `#0D1117`
*   **Card Surface:** `#111827`
*   **Primary Accent:** `#C3FF00` (Neon Lime) - *Used strictly for < 10% of the interface (CTAs, subtle glows).*
*   **Accent Hover:** `#D7FF4D`
*   **Glow Effect:** `rgba(195,255,0,.35)`
*   **Glass Borders:** `rgba(255,255,255,.08)`
*   **Primary Text:** `#F8FAFC`
*   **Secondary Text:** `#94A3B8`

## 4. Typography
*   **Primary Typeface:** `Outfit`
*   **Fallback:** `Inter`, `sans-serif`
*   **Hierarchy:**
    *   Massive, editorial headlines (`7xl` to `9xl` on desktop).
    *   Tight tracking (`tracking-tighter`) for massive display headers.
    *   Wide tracking (`tracking-widest`) for small uppercase metadata and buttons.
    *   Comfortable, highly readable body text (`text-lg` or `text-xl`).

## 5. Visual Styling & Components
*   **Glassmorphism:** The primary structural container. Built using `.glass-card` (16px border-radius, `backdrop-blur-md`, dark surface opacity) and `.glass-panel` (24px border-radius, heavier blur).
*   **Rounded Corners:** `16px` (1rem) for standard cards. `24px` (1.5rem) or `32px` for major section panels.
*   **Borders:** Ultra-thin `border-glass` (`rgba(255,255,255,.08)`) to define structure without adding noise.
*   **Shadows / Glows:** Soft ambient glows rather than hard drop shadows. Accent glows used sparingly behind primary CTAs or critical typographic moments.

## 6. Interaction & Motion
*   **Philosophy:** Motion should feel expensive. Soft, slow, and intentional.
*   **Scroll Reveals:** Elements float up smoothly as they enter the viewport using intersection observers. No harsh snapping.
*   **Hover States:** Cards emit a very subtle `#C3FF00` border highlight and ambient inner background shift. Buttons slightly lift and glow brighter.

## 7. Layout & Spacing
*   **Container:** `max-w-8xl` (1440px) to ensure extreme wide-screen layouts don't break.
*   **Rhythm:** Predictable, sweeping vertical rhythm. Standardized `py-32` or `py-40` between major sections to ensure maximum breathing space.
*   **The Hero:** Completely typography and ambient lighting driven. No generic UI mockups or stock photos. Absolute minimal luxury.
