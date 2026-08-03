# Homepage UI Design Specification: bangjeje.dev

This document defines the exact visual architecture and UI design specifications for the homepage. It translates the strategic **Design Foundation** and **Homepage Plan** into actionable, component-level UI guidelines before any code is generated.

## Global UI Rules (The "Editorial" Aesthetic)
*   **Grid System:** 12-column responsive grid (max-width: 1280px). We will rarely span content across all 12 columns; using constraints (e.g., 8-column text blocks) creates visual tension and luxurious whitespace.
*   **Background Rhythm:** A deliberate visual rhythm across the homepage using alternating background tones. We will alternate between Pure White (`bg-white`) and Soft Gray (`bg-gray-50`) per section to keep the experience clean but visually demarcated.
*   **Typography (Outfit):** 
    *   *Display (H1/H2):* Massive, with tight tracking (letter-spacing) for high impact.
    *   *Captions/Kickers:* Small (12px-14px), uppercase, with wide tracking to create a premium, structural feel.
*   **Borders:** 1px solid lines using the Modern Gray Scale (e.g., `border-gray-200`) to create architectural separation between sections instead of heavy drop shadows.
*   **Interactions & Motion:** Hover states should feel weighty and deliberate, not bouncy. We will use smooth fade-ins and subtle y-axis translations (`ease-out`, 300ms-500ms duration).

---

## 1. Global Navigation (Header)
*   **Layout Structure:** Sticky top navigation. Logo aligned left, Links centered, Primary CTA aligned right.
*   **Visual Hierarchy:** Logo = CTA > Links.
*   **Typography:** Logo: `font-bold text-xl tracking-tight`. Links: `font-medium text-sm text-gray-600 hover:text-black`.
*   **Background Treatment:** Translucent white (`bg-white/90`) with a subtle glassmorphism effect (`backdrop-blur-md`) and a 1px bottom border.
*   **Button Styles:** Primary CTA (Right): Solid Professional Blue background, white text, sharp or subtly rounded edges (`rounded-sm`).
*   **Responsive:** Desktop links collapse into a minimalist hamburger menu on tablet/mobile, triggering a stark, full-screen white overlay menu.

## 2. Section 1: The Hero (Value Proposition)
*   **Layout Structure:** Asymmetric split. Left (7 columns): Text content. Right (5 columns): Premium imagery.
*   **Visual Hierarchy:** H1 > Hero Image > Primary CTA > Sub-headline.
*   **Typography:** 
    *   *Caption:* Uppercase, tracked out above the H1.
    *   *H1:* `text-6xl` or `text-7xl`, `font-bold`, `leading-none`, tight tracking.
    *   *Sub-headline:* `text-xl`, `text-gray-500`, max-width constrained.
*   **Spacing:** `pt-32 pb-24` (desktop). Generous gap between columns.
*   **Background Treatment:** Pure White (`bg-white`).
*   **Image Placement:** Right column. **Strict imagery rule:** Prioritize premium website mockups, product UI mockups, dashboard interfaces, editorial architectural photography, or digital workspace photography. No generic business meetings.
*   **Button Styles:** Primary CTA: Professional Blue. Secondary: Outline/Ghost. Accent elements may use Modern Yellow sparingly.
*   **Animation:** Text elements stagger-fade up. Image scales in slightly.

## 3. Section 2: Trust & Authority (Social Proof)
*   **Layout Structure:** Single row, flex layout, center-aligned.
*   **Background Treatment:** Soft Gray (`bg-gray-50`).
*   **Spacing:** `py-12`, bordered top and bottom (`border-t border-b border-gray-200`).
*   **Image Placement:** Client logos are monochromatic (grayscale), scaled uniformly, with a generous horizontal gap.

## 4. Section 3: The Insight / The Problem
*   **Layout Structure:** Centered, highly constrained width (max 6-8 columns).
*   **Typography:** The statement is treated as a bold pull-quote. `text-4xl` or `text-5xl`, `font-medium`, `leading-tight`.
*   **Spacing:** Massive vertical padding (`py-32`) to isolate the message in a sea of whitespace.
*   **Background Treatment:** Pure White (`bg-white`).

## 5. Section 4: The Pillars (Services Overview)
*   **Layout Structure:** Asymmetric Grid. Sticky 4-col sidebar (left) and 8-col scrolling grid (right).
*   **Background Treatment:** Soft Gray (`bg-gray-50`).
*   **Card Layouts:** Sharp edges, 1px borders. Minimalist internal padding (`p-8`). Icon (top left), Title, Description.
*   **Interaction:** On hover, the 1px border subtly darkens, and a minimalist arrow translates right.

## 6. Section 5: Why bangjeje.dev (Differentiators)
*   **Layout Structure:** 4-column horizontal grid across the 12-column container.
*   **Background Treatment:** Pure White (`bg-white`).
*   **Typography:** Large structural numbers (`text-gray-300 text-5xl`) acting as anchors above sharp, bold titles.
*   **Spacing:** `py-24`.
*   **Card Layouts:** Text-only, no borders. Relies entirely on typography and whitespace.

## 7. Section 6: Industries Served
*   **Layout Structure:** Interactive editorial layout. Left side (5 columns): Static image container. Right side (7 columns): Vertical list.
*   **Background Treatment:** Soft Gray (`bg-gray-50`).
*   **Typography:** List items are large (`text-4xl`), `font-medium`, default to `text-gray-400`.
*   **Interaction:** Hovering an industry turns it black and crossfades the left image.

## 8. Section 7: Featured Work
*   **Layout Structure:** 2-column grid, vertically staggered to break predictability.
*   **Background Treatment:** Pure White (`bg-white`).
*   **Typography:** Project Title (`text-2xl font-semibold`), Category (`text-sm uppercase text-gray-500`).
*   **Image Placement:** Massive, high-resolution thumbnails. Aspect ratio 4:3 or 3:4.
*   **Interaction:** Image zoom on hover (`scale-105`).

## 9. Section 8: Philosophy / Process
*   **Layout Structure:** Strict 3-step vertical accordion or horizontal timeline.
*   **Background Treatment:** Soft Gray (`bg-gray-50`).
*   **Spacing:** `py-24`, separated by 1px horizontal borders.

## 10. Section 9: Latest Articles
*   **Layout Structure:** 3-column grid.
*   **Background Treatment:** Pure White (`bg-white`).
*   **Card Layouts:** Image on top (aspect 16:9 or 4:3), Title below, Date/Category as kicker. No borders.
*   **Typography:** Article Title: `text-xl font-medium leading-snug`. Kicker: `text-xs uppercase font-bold text-blue-600`.

## 11. Section 10: Final Call to Action
*   **Layout Structure:** Centered box, contained within a 10-column wrapper.
*   **Background Treatment:** Deep Charcoal (`bg-gray-900`) to create a strong, authoritative ending rhythm.
*   **Typography:** White text (`text-white`). Massive Display H2 (`text-5xl font-bold`).
*   **Button Styles:** Primary CTA: Solid Professional Blue background (`bg-blue-600`), white text, sharp edges.
*   **Spacing:** High internal padding (`py-24 px-12`), `rounded-lg` or `rounded-xl`.

## 12. Global Footer
*   **Layout Structure:** 4-column grid. 1st col: Brand logo & description. 2nd/3rd col: Links. 4th col: Socials/Legal.
*   **Background Treatment:** Deep Charcoal (`bg-gray-950`). A stronger footer treatment to anchor the page, maintaining excellent readability with white/light-gray text.
*   **Typography:** `text-sm text-gray-400`. Headers for link columns are `text-sm font-bold text-white`.
*   **Spacing:** `pt-16 pb-8`.
