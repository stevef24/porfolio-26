# Phase 3: Typography Classes

## Overview

This phase updates the Swiss typography utility classes to work with Instrument Serif characteristics and Oatmeal spacing/sizing specifications.

**Status**: Pending
**Dependencies**: Phase 1 (Foundation - font must be loaded)
**Estimated Effort**: Medium
**Risk Level**: Low

---

## Files to Modify

| File | Lines | Changes |
|------|-------|---------|
| `app/globals.css` | 284-363 | Update `.text-swiss-*` classes |
| `app/globals.css` | 369-467 | Update prose typography |

---

## Oatmeal Typography Specifications

### Font Families
| Purpose | Font | Usage |
|---------|------|-------|
| Display | Instrument Serif | Headings 32px+ only |
| Body | Inter | Everything else |
| Code | JetBrains Mono | Code blocks |

### Font Sizes
| Token | Desktop | Mobile | Usage |
|-------|---------|--------|-------|
| display.xl | 64px (4rem) | 44px (2.75rem) | Hero headings |
| display.lg | 48px (3rem) | 32px (2rem) | Section headings |
| display.md | 32px (2rem) | 24px (1.5rem) | Card titles |
| body.lg | 20px (1.25rem) | 20px | Lead paragraphs |
| body.md | 16px (1rem) | 16px | Standard body |
| body.sm | 14px (0.875rem) | 14px | Meta, captions |

### Key Rules
1. **Instrument Serif minimum size**: 32px (below this, use Inter)
2. **Display line-height**: 1.1 (tight for impact)
3. **Body line-height**: 1.5 (comfortable reading)
4. **Display letter-spacing**: -0.02em (subtle negative tracking)
5. **Instrument Serif weight**: 400 only (no bold/semibold available)

---

## Task 3.1: Update Swiss Typography Classes

### File: `app/globals.css` (lines 284-363)

**Replace entire typography section:**

```css
/* ═══════════════════════════════════════════════════════════════════
   OATMEAL TYPOGRAPHY CLASSES
   Based on Oatmeal Design System v1.0
   ═══════════════════════════════════════════════════════════════════ */

/* Hero - Large display heading
   Usage: Main page titles, hero sections
   Font: Instrument Serif (min 32px enforced by responsive sizing) */
.text-swiss-hero {
  font-family: var(--font-display), Georgia, serif;
  font-size: clamp(2.75rem, 7vw, 4rem); /* 44px → 64px */
  font-weight: 400; /* Instrument Serif only weight */
  line-height: 1.1; /* Tight per Oatmeal spec */
  letter-spacing: -0.02em; /* Subtle negative tracking */
  color: var(--foreground);
}

/* Subheading - Section eyebrow labels
   Usage: Above section headings, category labels
   Font: Inter uppercase for contrast */
.text-swiss-subheading {
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 0.875rem; /* 14px - Oatmeal body.sm */
  font-weight: 500; /* Medium weight */
  text-transform: uppercase;
  letter-spacing: 0.05em; /* Slight positive tracking */
  color: var(--muted-foreground);
}

/* Title - Card and article titles
   Usage: Blog post cards, feature cards
   Font: Instrument Serif at 24px (still above 32px threshold on desktop) */
.text-swiss-title {
  font-family: var(--font-display), Georgia, serif;
  font-size: clamp(1.25rem, 3vw, 1.5rem); /* 20px → 24px */
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

/* Body - Standard paragraphs
   Usage: Article content, descriptions
   Font: Inter for readability */
.text-swiss-body {
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 1rem; /* 16px - Oatmeal body.md */
  font-weight: 400;
  line-height: 1.5; /* Comfortable reading per Oatmeal */
  color: var(--muted-foreground);
}

/* Body Large - Lead paragraphs
   Usage: Hero subheadings, article leads
   Font: Inter at larger size */
.text-swiss-body-lg {
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 1.25rem; /* 20px - Oatmeal body.lg */
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

/* Label - Metadata and utility text
   Usage: Dates, categories, tags
   Font: Inter uppercase small */
.text-swiss-label {
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
}

/* Caption - Supplementary text
   Usage: Image captions, footnotes
   Font: Inter small */
.text-swiss-caption {
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 0.875rem; /* 14px - Oatmeal body.sm */
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

/* Section Heading - Large section titles
   Usage: "Features", "Testimonials", etc.
   Font: Instrument Serif at 48px */
.text-swiss-section {
  font-family: var(--font-display), Georgia, serif;
  font-size: clamp(2rem, 5vw, 3rem); /* 32px → 48px */
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
```

---

## Task 3.2: Update Prose Typography

### File: `app/globals.css` (lines 369-467)

**Update prose headings to use Instrument Serif characteristics:**

```css
/* ═══════════════════════════════════════════════════════════════════
   PROSE TYPOGRAPHY (Article Content)
   ═══════════════════════════════════════════════════════════════════ */

.prose {
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 1.0625rem; /* 17px - slightly larger for comfort */
  line-height: 1.7;
  color: var(--foreground);
}

/* Prose Headings - Instrument Serif */
.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  font-family: var(--font-display), Georgia, serif;
  font-weight: 400; /* Instrument Serif only weight */
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--foreground);
  margin-top: 2em;
  margin-bottom: 0.5em;
}

.prose h1 {
  font-size: 2.5rem; /* 40px */
}

.prose h2 {
  font-size: 2rem; /* 32px - at Instrument Serif threshold */
}

.prose h3 {
  font-size: 1.5rem; /* 24px */
  /* Note: Below 32px threshold, but keeping serif for consistency */
}

.prose h4 {
  font-size: 1.25rem; /* 20px */
  font-family: var(--font-sans), system-ui, sans-serif; /* Switch to Inter */
  font-weight: 600;
  letter-spacing: 0;
}

/* Prose Body Elements */
.prose p {
  margin-bottom: 1.5em;
}

.prose a {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 200ms ease-out;
}

.prose a:hover {
  color: var(--accent);
}

/* Prose Lists */
.prose ul,
.prose ol {
  margin: 1.5em 0;
  padding-left: 1.5em;
}

.prose li {
  margin-bottom: 0.5em;
}

/* Prose Blockquote */
.prose blockquote {
  font-style: italic;
  font-size: 1.25rem;
  border-left: 3px solid var(--primary);
  padding-left: 1.5em;
  margin: 2em 0;
  color: var(--muted-foreground);
}

/* Prose Code */
.prose code {
  font-family: var(--font-mono), monospace;
  font-size: 0.875em;
  background-color: var(--muted);
  padding: 0.125em 0.375em;
  border-radius: var(--radius-xs);
}

.prose pre {
  background-color: var(--muted);
  border-radius: var(--radius-md);
  padding: 1em;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose pre code {
  background: none;
  padding: 0;
}
```

---

## Task 3.3: Update Content Width Constraints

Add max-width classes per Oatmeal specifications:

```css
/* ═══════════════════════════════════════════════════════════════════
   CONTENT WIDTH CONSTRAINTS (Oatmeal Specs)
   ═══════════════════════════════════════════════════════════════════ */

/* Hero headline: max 640px */
.max-w-headline {
  max-width: 640px;
}

/* Hero subheading: max 600px */
.max-w-subheading {
  max-width: 600px;
}

/* Section heading: max 800px */
.max-w-section {
  max-width: 800px;
}

/* Section description: max 700px */
.max-w-description {
  max-width: 700px;
}

/* Body paragraphs: max 650px (50-60 chars) */
.max-w-prose {
  max-width: 650px;
}
```

---

## Verification Steps

### 1. Hero Typography Check
- [ ] Hero heading uses Instrument Serif
- [ ] Size scales from 44px (mobile) to 64px (desktop)
- [ ] Line-height is tight (1.1)
- [ ] Letter-spacing is slightly negative

### 2. Body Typography Check
- [ ] Body text uses Inter
- [ ] Size is 16-17px
- [ ] Line-height is 1.5-1.7
- [ ] Color is muted-foreground

### 3. Prose Typography Check
- [ ] Article headings use Instrument Serif (h1-h3)
- [ ] h4 switches to Inter (below 32px)
- [ ] Links are olive green with underline
- [ ] Blockquotes have olive left border

### 4. Responsive Check
- [ ] Typography scales correctly on mobile
- [ ] No horizontal overflow from large text
- [ ] Clamp() values working correctly

---

## Commit Strategy

```bash
git add app/globals.css
git commit -m "style(typography): update typography classes for Oatmeal system

- Update .text-swiss-* classes with Instrument Serif characteristics
- Set display text line-height to 1.1, letter-spacing to -0.02em
- Update prose headings to use Instrument Serif
- Add content width constraint utilities
- Maintain Inter for body text at 1.5 line-height"
```

---

## Typography Reference Card

| Class | Font | Size | Weight | Line-Height |
|-------|------|------|--------|-------------|
| `.text-swiss-hero` | Instrument Serif | 44-64px | 400 | 1.1 |
| `.text-swiss-section` | Instrument Serif | 32-48px | 400 | 1.1 |
| `.text-swiss-title` | Instrument Serif | 20-24px | 400 | 1.2 |
| `.text-swiss-subheading` | Inter | 14px | 500 | - |
| `.text-swiss-body` | Inter | 16px | 400 | 1.5 |
| `.text-swiss-body-lg` | Inter | 20px | 400 | 1.5 |
| `.text-swiss-label` | Inter | 14px | 500 | - |
| `.text-swiss-caption` | Inter | 14px | 400 | 1.5 |

---

## Next Steps

After Phase 3 completes:
- Phase 4 (Core Components) can proceed
- Phase 6 (Custom Components) can proceed
