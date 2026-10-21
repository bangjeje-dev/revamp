# Bangjeje.dev — Maintenance Page

A modern, minimal, and editorial maintenance page built for [Bangjeje.dev](https://bangjeje.dev).

## Design Overview

- **Aesthetic**: Premium digital studio look, minimal, clean, and balanced.
- **Background**: Smooth animated liquid gradient with organic wave motion (16s–24s cycles) and ultra-lightweight procedural SVG fine-grain noise texture.
- **Main Card**: Centered white card with 20% reduced dimensions (max-width: 920px), 28px rounded corners, subtle multi-layered elevation shadow, and balanced whitespace.
- **Two-Column Desktop Layout**:
  - **Left Column**: Prominent maintenance illustration of the site owner personally working on the website beside a Work in Progress sign.
  - **Right Column**: Bold uppercase heading (`UNDER MAINTENANCE`), editorial copy, and a sleek black "Get Contact" WhatsApp button.
- **Mobile Responsive**: Ergonomic vertically stacked layout with centered content, fluid clamp typography, and zero horizontal overflow.
- **Accessibility**: Semantic HTML5 landmark tags, visible keyboard focus indicators, meaningful alt text, and `prefers-reduced-motion` compliance.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
npm install
```

### Development Server

Start the local development server at `http://localhost:5173`:

```bash
npm run dev
```

### Production Build

Build the optimized, minified production assets into the `dist/` folder:

```bash
npm run build
```

### Preview Production Build

Preview the compiled distribution build locally:

```bash
npm run preview
```

---

## Project Structure

```
├── public/
│   ├── favicon.svg                       # Bangjeje official vector favicon
│   ├── favicon.ico                       # Multi-resolution ICO favicon
│   ├── favicon-16x16.png                 # 16x16 PNG favicon
│   ├── favicon-32x32.png                 # 32x32 PNG favicon
│   ├── apple-touch-icon.png              # 180x180 Apple touch icon
│   └── images/
│       ├── logobjj.svg                   # Official Bangjeje vector logo
│       └── maintenance-illustration.png  # Work-in-progress owner illustration
├── src/
│   ├── main.js                           # Minimal entry script
│   └── style.css                         # CSS design system, variables & responsive rules
├── index.html                            # Semantic HTML5 entry page
├── package.json                          # Vite scripts & dev dependencies
├── vite.config.js                        # Vite configuration
└── README.md
```

---

## Configuration

- **WhatsApp Contact**: The "Get Contact" button links directly to WhatsApp at `https://wa.me/6281288137369`.
- **Assets**: The maintenance illustration is located at `public/images/maintenance-illustration.png`.
