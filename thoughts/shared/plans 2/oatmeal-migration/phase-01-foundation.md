# Phase 1: Foundation Layer

## Overview

This phase establishes the core design tokens that all other components depend on. It includes font configuration and the complete CSS variable system.

**Status**: Pending
**Dependencies**: None
**Estimated Effort**: High
**Risk Level**: High (all other phases depend on this)

---

## Files to Modify

| File | Lines | Changes |
|------|-------|---------|
| `app/layout.tsx` | 1-50 | Replace Playfair Display with Instrument Serif |
| `app/globals.css` | 9-71 | Update @theme inline radius/shadow tokens |
| `app/globals.css` | 73-185 | Replace all color variables |

---

## Task 1.1: Font Configuration

### File: `app/layout.tsx`

**Current State:**
```typescript
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  display: "swap",
});
```

**Target State:**
```typescript
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],  // Instrument Serif only has regular weight
  display: "swap",
});
```

**Additional Changes:**
- Update the className in `<html>` or `<body>` to use `instrumentSerif.variable` instead of `playfair.variable`
- Keep Inter and JetBrains Mono unchanged

### Important Note
Instrument Serif only has weight 400. The current system uses weights 400, 500, 600 for Playfair. This means:
- All display headings will use weight 400
- Typography classes referencing `font-weight: 500` or `600` for display font will render as 400
- This is intentional - Instrument Serif achieves hierarchy through size, not weight

---

## Task 1.2: Tailwind Theme Tokens

### File: `app/globals.css` (lines 9-71)

Update the `@theme inline` block with Oatmeal tokens:

**Radius Scale (replace existing):**
```css
@theme inline {
  /* ... existing font vars ... */

  /* Oatmeal Radius Scale */
  --radius-xs: 0.125rem;   /* 2px - inputs */
  --radius-sm: 0.25rem;    /* 4px - small badges */
  --radius-md: 0.5rem;     /* 8px - cards, panels */
  --radius-lg: 0.75rem;    /* 12px - large cards */
  --radius-xl: 1rem;       /* 16px - section containers */
  --radius-full: 9999px;   /* Pill shape - buttons, badges */

  /* Map to Tailwind utilities */
  --radius: var(--radius-md);  /* Default 8px */
}
```

**Shadow Scale (add if not present):**
```css
@theme inline {
  /* ... */

  /* Oatmeal Shadows - defined in :root, referenced here */
  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
}
```

---

## Task 1.3: Color Variables - Light Mode

### File: `app/globals.css` (lines 73-130 approximately)

Replace the entire `:root` color block:

```css
:root {
  /* ═══════════════════════════════════════════════════════
     OATMEAL DESIGN SYSTEM - LIGHT MODE
     ═══════════════════════════════════════════════════════ */

  /* Background Scale */
  --background: #f8f6ef;           /* bg.base - warm cream */
  --foreground: #19170f;           /* text.primary - near black */

  /* Card/Elevated Surfaces */
  --card: #ffffff;                 /* bg.elevated - pure white */
  --card-foreground: #19170f;

  /* Popover (same as card) */
  --popover: #ffffff;
  --popover-foreground: #19170f;

  /* Primary - Olive Green Accent */
  --primary: #566240;              /* accent.primary */
  --primary-foreground: #ffffff;   /* text.inverse */

  /* Secondary - Muted Background */
  --secondary: #f1eee5;            /* bg.muted */
  --secondary-foreground: #19170f;

  /* Muted - Testimonial/Emphasized Background */
  --muted: #e8e5da;                /* bg.testimonial - darker olive tint */
  --muted-foreground: #5f5a48;     /* text.secondary */

  /* Accent (same as primary for consistency) */
  --accent: #566240;
  --accent-foreground: #ffffff;

  /* Destructive - Errors */
  --destructive: #b04a48;          /* Oatmeal state.danger */

  /* Borders */
  --border: #e3e0d5;               /* border.subtle */
  --input: #d0cabc;                /* border.strong */
  --ring: #566240;                 /* accent.primary for focus */

  /* Chart Colors - Olive Scale */
  --chart-1: #839167;              /* Lightest olive */
  --chart-2: #6f7c5a;
  --chart-3: #566240;
  --chart-4: #4a5436;
  --chart-5: #3d452c;              /* Darkest olive */

  /* ═══════════════════════════════════════════════════════
     OATMEAL SHADOWS - LIGHT MODE
     ═══════════════════════════════════════════════════════ */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* ═══════════════════════════════════════════════════════
     LAYOUT TOKENS (keep existing)
     ═══════════════════════════════════════════════════════ */
  --radius: 0.5rem;                /* 8px - Oatmeal default */
  --content-width: 840px;
  --toc-width: 14rem;
  --content-gap: 4rem;
  --navbar-height: 4rem;

  /* Scrolly drawer vars (keep existing values) */
  --scrolly-drawer-collapsed: 0px;
  --scrolly-drawer-expanded: min(520px, 45vw);

  /* ═══════════════════════════════════════════════════════
     SIDEBAR COLORS
     ═══════════════════════════════════════════════════════ */
  --sidebar: #f1eee5;              /* bg.muted */
  --sidebar-foreground: #19170f;
  --sidebar-primary: #566240;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #e8e5da;       /* bg.testimonial */
  --sidebar-accent-foreground: #19170f;
  --sidebar-border: #e3e0d5;       /* border.subtle */
  --sidebar-ring: #566240;
}
```

---

## Task 1.4: Color Variables - Dark Mode

### File: `app/globals.css` (lines 131-185 approximately)

Replace the entire `.dark` color block:

```css
.dark {
  /* ═══════════════════════════════════════════════════════
     OATMEAL DESIGN SYSTEM - DARK MODE
     ═══════════════════════════════════════════════════════ */

  /* Background Scale */
  --background: #0e0e0c;           /* bg.base - deep charcoal */
  --foreground: #f8f6ef;           /* text.primary - warm white */

  /* Card/Elevated Surfaces */
  --card: #1e1e1b;                 /* bg.elevated */
  --card-foreground: #f8f6ef;

  /* Popover */
  --popover: #1e1e1b;
  --popover-foreground: #f8f6ef;

  /* Primary - Olive Green (lighter for dark mode contrast) */
  --primary: #6f7c5a;              /* accent.primary dark */
  --primary-foreground: #0e0e0c;   /* text.inverse dark */

  /* Secondary */
  --secondary: #1a1a17;            /* bg.muted dark */
  --secondary-foreground: #f8f6ef;

  /* Muted */
  --muted: #1e1e1b;                /* bg.testimonial dark */
  --muted-foreground: #a19b86;     /* text.secondary dark */

  /* Accent */
  --accent: #6f7c5a;
  --accent-foreground: #0e0e0c;

  /* Destructive */
  --destructive: #c66a67;          /* Oatmeal state.danger dark */

  /* Borders */
  --border: #2a2a26;               /* border.subtle dark */
  --input: #3b3b36;                /* border.strong dark */
  --ring: #6f7c5a;

  /* Chart Colors */
  --chart-1: #839167;
  --chart-2: #6f7c5a;
  --chart-3: #566240;
  --chart-4: #4a5436;
  --chart-5: #3d452c;

  /* ═══════════════════════════════════════════════════════
     OATMEAL SHADOWS - DARK MODE
     ═══════════════════════════════════════════════════════ */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.6);

  /* ═══════════════════════════════════════════════════════
     SIDEBAR COLORS - DARK
     ═══════════════════════════════════════════════════════ */
  --sidebar: #1a1a17;
  --sidebar-foreground: #f8f6ef;
  --sidebar-primary: #6f7c5a;
  --sidebar-primary-foreground: #0e0e0c;
  --sidebar-accent: #1e1e1b;
  --sidebar-accent-foreground: #f8f6ef;
  --sidebar-border: #2a2a26;
  --sidebar-ring: #6f7c5a;
}
```

---

## Task 1.5: Update Dark Body Background

### File: `app/globals.css` (line ~224-226)

Find and update:
```css
.dark body {
  background-color: #0e0e0c;  /* Match Oatmeal bg.base dark */
}
```

---

## Verification Steps

After completing this phase:

### 1. Build Check
```bash
pnpm build
```
Should complete without errors.

### 2. Visual Check - Light Mode
- [ ] Background is warm cream (#f8f6ef), not pure white
- [ ] Text is near-black (#19170f)
- [ ] Accent elements show olive green (#566240)
- [ ] Cards have white background with subtle borders

### 3. Visual Check - Dark Mode
- [ ] Background is deep charcoal (#0e0e0c)
- [ ] Text is warm white (#f8f6ef)
- [ ] Accent elements show lighter olive (#6f7c5a)
- [ ] Cards have elevated dark background

### 4. Font Check
- [ ] Headings render in Instrument Serif
- [ ] Body text remains Inter
- [ ] Code blocks remain JetBrains Mono

### 5. Console Check
- No font loading errors
- No CSS variable resolution errors

---

## Commit Strategy

After verification passes:

```bash
git add app/layout.tsx app/globals.css
git commit -m "style(foundation): migrate to Oatmeal color system and Instrument Serif

- Replace Playfair Display with Instrument Serif for display headings
- Update all CSS color variables to Oatmeal palette
- Add shadow scale (sm, md, lg) for both light and dark modes
- Update radius scale to Oatmeal specifications
- Update sidebar color variables"
```

---

## Rollback Plan

If issues arise, revert with:
```bash
git checkout HEAD~1 -- app/layout.tsx app/globals.css
```

---

## Next Phase

After Phase 1 completes, the following phases can run in parallel:
- [Phase 2: Background Component](./phase-02-background.md)
- [Phase 3: Typography Classes](./phase-03-typography.md)
- [Phase 4: Core UI Components](./phase-04-core-components.md)
- [Phase 5: Complex UI Components](./phase-05-complex-components.md)
