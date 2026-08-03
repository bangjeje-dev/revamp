# Contact Page: UI/UX Specification

## 1. Overall Page Layout
The Contact page functions as a high-end acquisition terminal. The layout is severely asymmetrical, balancing the functional weight of a comprehensive data-capture form on one side against massive, confidence-building typography and alternative contact channels on the other. It strips away the standard final CTA, as the entire page serves that purpose.

## 2. Visual Hierarchy
1. **The Form Container:** Housed within a massive `.glass-panel` to differentiate the interactive space from the background.
2. **Typography (Hero & Labels):** Extreme headline scaling grabs attention, while precise, uppercase tracking-widest labels guide the form completion process.
3. **The Submit Button:** The most prominent interactive element on the page, utilizing the neon lime `#C3FF00` fill.
4. **Interactive Pills/Inputs:** Secondary visual weight, utilizing subtle glow and border transitions to indicate focus and selection.

## 3. Section-by-Section Layout

**01. The Invitation Hero**
- **Layout:** Centered or heavily left-aligned depending on the grid. Max-width constrained to `max-w-4xl`.
- **UI:** Massive greeting. Subtle ambient mesh glow `#C3FF00` at 10% opacity behind the text.

**02. Why Work With Us (Confidence Reinforcement)**
- **Layout:** A subtle 3-column micro-grid directly beneath the hero or seamlessly integrated before the form.
- **UI:** Minimalist icons (Phosphor) paired with short, punchy, high-contrast text to reinforce credibility.

**03. The Acquisition Interface (Form + Direct Info)**
- **Layout:** 12-column asymmetric grid. Left side (`col-span-5` or `col-span-4`) holds direct contact info (Email, LinkedIn, WhatsApp) and physical location if applicable. Right side (`col-span-7` or `col-span-8`) holds the `.glass-panel` containing the form.
- **UI:** Form inputs use `bg-dark/50` inside the `glass-panel` to create a sense of depth.

**04. The Process & FAQ**
- **Layout:** 2-column grid. Left side holds the 3-step process. Right side holds a compact accordion or list for FAQs.
- **UI:** Simple, high-contrast typography. Process steps use the dim, massive number aesthetic ("01", "02").

**05. Global Footer**
- Exact reuse of the global component, but the massive "Discuss Partnership" CTA block from other pages is explicitly omitted.

## 4. Grid System
- **12-column CSS Grid:** The core structural framework for the Acquisition Interface.
- **Grid Gap:** `gap-12` or `gap-16` on desktop to maintain severe whitespace separation between the form and the direct contact info.

## 5. Container Widths
- **Global:** `max-w-8xl` (1440px) with global `px-6` (mobile) to `px-12` (desktop) padding.
- **Form Constraints:** The form inputs themselves should not exceed `max-w-2xl` to prevent uncomfortably long reading lines for the user while typing.

## 6. Typography Scale (Outfit)
- **Hero Title (`<h1>`):** `text-5xl md:text-7xl lg:text-[6rem] font-medium tracking-tighter leading-none`.
- **Form Labels:** `text-xs md:text-sm font-semibold uppercase tracking-widest text-textSecondary`.
- **Input Text:** `text-lg md:text-xl font-light text-textPrimary`.
- **FAQ & Process Headers:** `text-2xl font-medium text-white`.

## 7. Spacing System
- **Section Rhythm:** `py-24 md:py-32` between major blocks.
- **Form Internal Spacing:** `space-y-8` between distinct input groups (e.g., Personal Info vs. Project Details).
- **Pill Grid:** `gap-4` for project type and budget selection grids.

## 8. Color Usage
- **Background:** `bg-[#050505]`.
- **Glass Panel:** `bg-[#0D1117]/40` with `backdrop-blur-2xl`.
- **Inputs:** `bg-black/20` (darker than the glass panel to indicate a well/input area) with `border-white/10`.
- **Accent:** `#C3FF00` strictly reserved for the active states of inputs, selected pills, and the final submit button.

## 9. Form Design System
- **No generic `<select>` dropdowns.** Use interactive CSS grid "Pills" for Project Type and Estimated Budget.
- **Estimated Budget Pills:** e.g., "$10k - $25k", "$25k - $50k", "$50k+", and "Not sure yet".
- **Inputs:** Underlined `border-b` only, OR full rounded rectangles `rounded-xl` depending on the exact aesthetic, but full rounded rectangles inside a glass panel feel more premium.
- **Padding:** Massive touch targets. Inputs must be `p-4` or `p-5`.

## 10. Input States
- **Default:** `border border-white/10 bg-black/20 text-textSecondary`.
- **Hover:** `border-white/30`.
- **Focus:** `border-accent ring-1 ring-accent/50 bg-black/40 text-textPrimary`. The label should also transition to `text-accent`.
- **Selected Pill:** `bg-accent text-dark border-accent scale-105 shadow-[0_0_20px_rgba(195,255,0,0.2)]`.

## 11. Button System
- **Submit Button:** Reuses `.btn-primary`.
- **Copy:** "Let's start a conversation" or "Send Inquiry".
- **Width:** `w-full` or `w-auto` with extreme padding (`px-12`).

## 12. Validation & Error States
- **Inline Validation:** Wait until `blur` or form submit.
- **Error UI:** Do NOT use bright red (`#FF0000`). Use a subtle, sophisticated coral/amber (e.g., `#FF6B6B`) for borders.
- **Error Message:** `text-xs tracking-widest text-[#FF6B6B] mt-2`.

## 13. Motion & Animation
- **Reveal-Up:** The entire form `.glass-panel` slides up. Individual fields inside stagger their entrance (`.delay-100` to `.delay-500`).
- **Submit Loading:** Upon click, button text fades out, replaced by a smooth spinning Phosphor icon (`ph-circle-notch animate-spin`) in `#050505`.

## 14. Responsive Behaviour
- **Mobile (< 768px):** Asymmetric 12-col grid collapses to stack: Hero -> Why Work With Us -> Direct Contact -> Form.
- **Input Scaling:** Inputs remain massive on mobile to ensure OS-level zoom does not trigger and tap targets are easy.
- **Pills:** The budget and project type grids shift from `grid-cols-2` to `grid-cols-1` or horizontal scroll containers.

## 15. Accessibility
- **Labels:** Explicit `<label for="id">` must be used. Do not rely solely on `placeholder` attributes.
- **Focus Rings:** Ensure `focus-visible` states are clearly demarcated by the `#C3FF00` accent.
- **Contrast:** `textSecondary` (`#94A3B8`) against the `bg-black/20` inputs passes WCAG AA.

## 16. Component Reuse Strategy
- `.glass-panel` for the form container.
- `.btn-primary` for submission.
- `.reveal-up` for entrance animations.
- Phosphor icons for direct contact channels (Email, LinkedIn, WhatsApp).
- Global Navigation and Global Footer (modified).

## 17. Success State
- Upon successful submission, the `.glass-panel` cross-fades (opacity transition) into a "Success State".
- **Success UI:** A massive Phosphor checkmark (`ph-check-circle text-accent text-6xl`), paired with "Inquiry Received." and a brief note: "We'll review your details and respond within 24 hours."
- **Avoid:** Generic browser alerts or immediate redirects to blank 'thank-you.html' pages.

## 18. Implementation Notes
- The form should visually function perfectly using HTML/CSS and Vanilla JS (for pill selection logic and fake success state simulation for prototype purposes).
- Avoid relying on a CSS framework other than the established Tailwind config.
- Ensure the JavaScript elegantly handles the `click` events for the custom pill selectors, toggling hidden `<input type="radio">` elements for semantic form submission.
