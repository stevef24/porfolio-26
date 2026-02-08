# Phase 9: Landing & Layout Components

## Overview

This phase updates the landing page sections and layout components with Oatmeal styling. Most changes are minimal since these components use CSS variables that were updated in Phase 1.

**Status**: Pending
**Dependencies**: Phases 1-8 (all previous phases)
**Estimated Effort**: Low
**Risk Level**: Low

---

## Files to Modify

| File | Priority | Key Changes |
|------|----------|-------------|
| `components/landing/Home.tsx` | Medium | Verify color variables work |
| `components/landing/Contact.tsx` | Medium | Link hover colors |
| `components/layout/Header.tsx` | Medium | Nav styling, CTA button |
| `components/layout/Navbar.tsx` | Medium | Active indicator, links |
| `components/layout/Footer.tsx` | Low | Border, text colors |
| `components/layout/SiteShell.tsx` | Low | Layout wrapper (minimal changes) |

---

## Task 9.1: Verify Home Component

### File: `components/landing/Home.tsx`

**Verification Focus:**
Most styling should already work due to CSS variable updates. Check:

```typescript
// Hero section - text should use foreground
"text-foreground" // Should render as #19170f light / #f8f6ef dark

// Accent elements - should use primary
"text-primary" // Should render as #566240 light / #6f7c5a dark
"bg-primary" // For accent lines/elements

// Links - hover should transition to primary
"hover:text-primary"

// Section backgrounds - alternating
"bg-background" // #f8f6ef
"bg-secondary" // #f1eee5 (muted)
```

**Potential Updates:**
- If any hardcoded colors exist, replace with CSS variables
- Verify accent line uses `bg-primary`

---

## Task 9.2: Update Contact Component

### File: `components/landing/Contact.tsx`

**Link Styling:**

```typescript
// Social icon links
const socialLinkClasses = cn(
  "inline-flex items-center justify-center",
  "size-10",
  "rounded-lg", // 8px
  "border border-border",
  "text-muted-foreground",
  // Hover - olive green
  "hover:text-primary hover:border-primary hover:bg-primary/10",
  "transition-all duration-200"
);

// Email link
const emailLinkClasses = cn(
  "text-foreground",
  "hover:text-primary",
  "underline underline-offset-4",
  "transition-colors duration-200"
);

// External links (GitHub, LinkedIn, etc.)
const externalLinkClasses = cn(
  "inline-flex items-center gap-2",
  "text-muted-foreground",
  "hover:text-primary",
  "transition-colors duration-200"
);
```

---

## Task 9.3: Update Header Component

### File: `components/layout/Header.tsx`

**Premium Morphing Navigation Updates:**

```typescript
// Container - glass effect with Oatmeal colors
const headerClasses = cn(
  "fixed top-4 left-1/2 -translate-x-1/2 z-50",
  "bg-card/80 backdrop-blur-md",
  "border border-border/50",
  "rounded-full", // Pill shape
  "shadow-sm",
  "px-4 py-2"
);

// Nav links
const navLinkClasses = cn(
  "text-sm font-medium",
  "text-muted-foreground",
  "hover:text-foreground",
  "transition-colors duration-200"
);

// Active nav link
const activeNavLinkClasses = cn(
  "text-foreground"
);

// CTA Button - should already use button component
// Verify it uses default variant (solid pill)
<Button size="sm">Get Started</Button>

// Theme toggle
const themeToggleClasses = cn(
  "size-8 rounded-full",
  "text-muted-foreground",
  "hover:text-foreground hover:bg-muted",
  "transition-all duration-200"
);
```

---

## Task 9.4: Update Navbar Component

### File: `components/layout/Navbar.tsx`

**Animated Navigation Updates:**

```typescript
// Nav container
const navbarClasses = cn(
  "fixed top-0 left-0 right-0 z-50",
  "bg-background/80 backdrop-blur-md",
  "border-b border-border/50",
  "h-16", // 64px
  "px-6"
);

// Animated indicator pill
const indicatorClasses = cn(
  "absolute bottom-0",
  "h-0.5 rounded-full",
  "bg-primary", // Olive green
  "transition-all duration-200"
);

// Nav link
const linkClasses = cn(
  "relative px-3 py-2",
  "text-sm font-medium",
  "text-muted-foreground",
  "hover:text-foreground",
  "transition-colors duration-200"
);

// Active link
const activeLinkClasses = cn(
  "text-foreground"
);
```

---

## Task 9.5: Update Footer Component

### File: `components/layout/Footer.tsx`

**Footer Updates:**

```typescript
// Footer container
const footerClasses = cn(
  "border-t border-border",
  "bg-background",
  "py-8 px-6"
);

// Copyright text
const copyrightClasses = cn(
  "text-sm text-muted-foreground"
);

// Back to top button
const backToTopClasses = cn(
  "inline-flex items-center gap-2",
  "text-sm text-muted-foreground",
  "hover:text-primary",
  "transition-colors duration-200"
);

// Footer links (if any)
const footerLinkClasses = cn(
  "text-sm text-muted-foreground",
  "hover:text-foreground",
  "transition-colors duration-200"
);
```

---

## Task 9.6: Verify SiteShell Component

### File: `components/layout/SiteShell.tsx`

**Minimal Changes Expected:**
SiteShell is a layout wrapper that uses CSS variables. Verify:

```typescript
// Background should use background variable
"bg-background" // Will be #f8f6ef or #0e0e0c

// Border colors
"border-border" // Will be #e3e0d5 or #2a2a26

// Text colors
"text-foreground" // Will be #19170f or #f8f6ef
```

---

## Visual Verification Checklist

### Homepage
- [ ] Hero text is near-black (light) / warm-white (dark)
- [ ] Accent line is olive green
- [ ] Section backgrounds alternate correctly
- [ ] Links hover to olive

### Contact Section
- [ ] Social icons are visible
- [ ] Hover state shows olive
- [ ] Email link underline is visible

### Header/Navbar
- [ ] Glass effect with warm tint
- [ ] Links transition smoothly
- [ ] Active indicator is olive
- [ ] CTA button is pill-shaped
- [ ] Theme toggle works

### Footer
- [ ] Border is subtle
- [ ] Text is muted-foreground
- [ ] Back to top hover is olive

---

## Common Patterns Used

| Pattern | Classes |
|---------|---------|
| Link hover | `text-muted-foreground hover:text-primary transition-colors` |
| Container bg | `bg-card/80 backdrop-blur-md` |
| Border | `border border-border` or `border-border/50` |
| Active state | `text-foreground` or `text-primary` |
| Icon button | `size-10 rounded-lg border hover:text-primary hover:border-primary` |

---

## Commit Strategy

```bash
git add components/landing/*.tsx components/layout/*.tsx
git commit -m "style(layout): verify and update landing/layout components

Home:
- Verified CSS variables render correctly
- Accent line uses primary (olive)

Contact:
- Social icons hover to primary
- Link underlines visible

Header/Navbar:
- Glass effect with card/80
- Active indicator: primary
- Links: muted-foreground → foreground on hover

Footer:
- Border uses border variable
- Text uses muted-foreground
- Back to top hovers to primary"
```

---

## Next Steps

After Phase 9 completes:
- Phase 10 (Cleanup) is the final phase
- Full visual QA across all pages
