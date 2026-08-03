# Work Page: UI/UX Specification

This document defines the complete UI/UX blueprint for the Work page (`work.html`). It adheres strictly to the Global Design Foundation and acts as the technical precursor to HTML generation.

---

## Part 1: Global System Requirements

### 1. Page Layout
- **Architecture:** Multipage architecture, inheriting the sticky glass header and global footer.
- **Max Width:** Content constrained to a maximum width of `1440px` (`max-w-8xl`).
- **Container Alignment:** Centered with `mx-auto`, retaining consistent horizontal padding (`px-6` mobile/tablet, `lg:px-12` desktop).
- **Background:** Solid `#050505` (`bg-dark`) with ambient mesh and radial glows applied sparingly behind the hero and final CTA.

### 2. Grid System
- **Core Grid:** 12-column CSS Grid (`grid-cols-12`) used exclusively for desktop layouts to ensure pixel-perfect alignment.
- **Asymmetry:** Case studies will heavily utilize asymmetric grid spans (e.g., Image taking 7 columns, Text taking 4 columns, 1 column offset) to create an editorial, high-end agency feel.

### 3. Typography Hierarchy
- **Font Family:** `Outfit` (Primary and Secondary).
- **H1 (Hero):** Massive scale (`text-[5rem]` to `text-[7rem]`), bold (`font-bold`), tracking tight (`tracking-tighter`), balancing solid white (`#F8FAFC`) with gradient accents.
- **H2 (Case Study Title):** `text-4xl` to `text-5xl`, tracking tight, high contrast white.
- **H3 (Section Headers):** `text-xl` to `text-2xl`, subtle `#94A3B8`.
- **Body Text:** `text-lg` or `text-xl`, light font weight (`font-light`), extremely readable line height (`leading-relaxed`), using `#94A3B8` (text-textSecondary).
- **Micro-Copy (Tags/Labels):** `text-xs` to `text-[10px]`, monospace or sans-serif, uppercase, wide tracking (`tracking-widest`), font weight bold, utilizing `#C3FF00`.

### 4. Spacing System
- **Vertical Rhythm:** Massive, deliberate whitespace.
- **Section Spacing:** Minimum `py-32` (8rem) between major sections on desktop, scaling down to `py-24` on mobile.
- **Internal Spacing:** `gap-16` or `gap-24` between text and imagery in grid layouts.
- **Content Blocks:** Generous bottom margins (`mb-10` to `mb-16`) below paragraphs before CTAs or data points.

### 5. Component Specification
- **`.glass-card`:** Used for project metadata blocks or archive grid items. `bg-card/30`, 16px blur, 1px border of `rgba(255,255,255,0.06)`, `rounded-2xl`.
- **`.btn-primary`:** Solid `#C3FF00` background, dark text, glowing box-shadow, pill-shaped (`rounded-full`).
- **`.btn-secondary`:** Transparent background, `rgba(255,255,255,0.1)` border, white text, pill-shaped.
- **`.pill-tag`:** Small metadata tags for tech stack or industry (e.g., "Fintech", "React"). Border `rgba(255,255,255,0.1)`, small padding, uppercase text.

### 6. Case Study Layout
- **Structure:** Alternating layout structure.
  - *Project 1:* Image Left (Col 1-7), Text Right (Col 9-12).
  - *Project 2:* Text Left (Col 1-4), Image Right (Col 6-12).
- **Metrics Bar:** A specific horizontal row beneath the case study description highlighting 3 key metrics (e.g., "+300% Conversion", "0.5s Load Time").

### 7. CTA Hierarchy
- **Primary:** "Initiate Project" (Global Nav, Final Section).
- **Secondary:** "View Case Study" or "Visit Live Site" (Internal to each featured project block).

### 8. Interaction Rules
- All interactive elements must provide immediate visual feedback.
- Cursor changes to pointer on all interactive surfaces.

### 9. Hover States
- **Primary Buttons:** Background shifts to `#D7FF4D` (lighter lime), shadow intensity increases.
- **Secondary Buttons:** Background shifts to `rgba(255,255,255,0.08)`, border glows `#C3FF00`.
- **Cards/Images:** Slight translateY lift (`-translate-y-2`), border color shifts to `rgba(195,255,0,0.3)`.

### 10. Animation Rules
- **Scroll Reveal (`.reveal-up`):** The Intersection Observer logic from the homepage handles all entrance animations. Elements fade in and translate up 30px over 1000ms using `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Staggers:** Text content (Labels -> Headings -> Paragraphs -> Metrics -> Buttons) must utilize `.delay-100`, `.delay-200`, etc., for sequential revealing.

### 11. Responsive Behaviour
- **Mobile (< 768px):** Strict 1-column flow. Content blocks always stack above images. Padding normalizes to `px-6`.
- **Tablet (768px - 1023px):** Maintain 1-column flow but increase padding and image sizing.
- **Desktop (1024px+):** Deploy full 12-column asymmetrical grids.

### 12. Accessibility
- Ensure sufficient contrast for `#94A3B8` text on `#050505` backgrounds.
- All functional CTAs must be semantic `<a>` or `<button>` tags with `aria-label` attributes where the text context is ambiguous (e.g., "Visit site").

### 13. Image Usage
- **Style:** High-resolution product mockups, dashboard renders, or architectural diagrams. No generic stock photos.
- **Treatment:** Slight rounded corners (`rounded-2xl`), subtle inner borders to separate from the dark background, potential subtle glow behind the image container.

### 14. Navigation Behaviour
- Matches Homepage/Services exactly.
- "Work" nav item receives the active text-glow styling.

### 15. Visual Consistency Checklist
- [ ] `#050505` background
- [ ] `#C3FF00` accent color strictly limited to <10% of UI
- [ ] Outfit font stack exclusively
- [ ] Same `.reveal-up` CSS classes as homepage
- [ ] Same `.glass-panel` and `.glass-card` CSS as homepage
- [ ] Multipage HTML boilerplate perfectly synced

---

## Part 2: Section Breakdown

### Section 01: The Proof Hero
- **Purpose:** Establish the page's tone. Position bangjeje.dev as a strategic engineering partner.
- **Layout:** Centered, highly constrained text column (`max-w-4xl`), occupying minimum 60vh.
- **Typography:** Massive `text-[6rem]` or `text-[7rem]` gradient headline. "The Proof." followed by a strong H2 subheadline.
- **Spacing:** `pt-48` top padding to clear the navigation, `pb-32` bottom padding.
- **Components:** Pill label ("03 // SELECTED WORKS").
- **Interaction:** Scroll indicator arrow bounces on hover.
- **Animation:** Headline and subtext reveal up sequentially.
- **Responsive:** Text scales down to `text-5xl` on mobile, maintaining line height.

### Section 02, 03, 04: Featured Case Studies
- **Purpose:** Provide an in-depth look at major projects, proving the Challenge -> Solution -> Impact methodology.
- **Layout:** Desktop uses alternating 12-column grids (Image Left / Text Right, then Text Left / Image Right).
- **Typography:** Bold H2 for project title, light `text-lg` for the narrative. Accent color used for the specific industry or tech-stack labels.
- **Spacing:** Massive `py-32` between projects to allow cognitive breathing room.
- **Components:**
  - **Metrics Row:** A flex container with a top border (`border-t border-glass`) displaying 3 key stats.
  - **Project Image:** A large container (`rounded-2xl`) housing the visual evidence.
- **Interaction:** Hovering the project image applies a slight scale/lift and increases the drop shadow. Secondary CTA button border glows on hover.
- **Animation:** The text block reveals first, followed by staggered metric reveals. The image reveals from the opposite direction (or standard fade-up).
- **Responsive:** Stacks completely into a single column on mobile. Text and metrics *must* appear before the image in the DOM order or via flex-order on mobile.

### Section 05: The Archive Grid
- **Purpose:** Demonstrate volume and variety of work without needing full case studies for every project.
- **Layout:** 3-column CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- **Typography:** H3 for project title (`text-xl`), small body text (`text-sm`), tags (`text-[10px]`).
- **Spacing:** standard `gap-8` between grid items.
- **Components:** `.glass-card` wrappers for each item.
- **Interaction:** Standard glass card hover (border shifts to lime, slight translation).
- **Animation:** Entire grid reveals in a staggered sequence across the rows.
- **Responsive:** 1 column on mobile, 2 columns on tablet, 3 on desktop.

### Section 06: Final CTA (The Catalyst)
- **Purpose:** Convert the high intent generated by the case studies into a consultation request.
- **Layout:** Centered within a massive `.glass-panel` bounded by a glowing ambient mesh.
- **Typography:** High-contrast `text-5xl` to `text-6xl` demanding action.
- **Spacing:** Huge `py-32` internal padding, sitting `mb-12` above the footer.
- **Components:** `.btn-primary` (Initiate Project).
- **Interaction:** Button glow effects.
- **Animation:** Panel reveals up.
- **Responsive:** Scales down typography on mobile but maintains the heavy glassmorphism feel.
