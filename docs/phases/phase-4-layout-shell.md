# Phase 4: Layout Shell Refinements

## Overview

Polish the SiteShell layout component to ensure consistent spacing, smooth responsive transitions, and proper sticky positioning across all layout configurations. This phase focuses on refinement rather than new features.

---

## Current Implementation Analysis

### File Location
`components/layout/SiteShell.tsx`

### Current Layout Configurations

#### 1. Simple Layout (No sidebar, no TOC)
- Used by: Home page, standalone pages
- Width: `max-w-[var(--content-width)]`
- Structure: Single content column

#### 2. TOC Layout (No sidebar, with TOC)
- Used by: Blog posts
- Width: `max-w-[calc(var(--content-width)+var(--toc-width)+var(--content-gap))]`
- Structure: Content + TOC rail in CSS Grid

#### 3. Full Layout (Sidebar + TOC)
- Used by: Course lessons
- Width: Full width with sidebar
- Structure: Sidebar + Content + TOC rail

### Current Code
```tsx
export function SiteShell({
  children,
  sidebar,
  toc,
  className,
  contentClassName,
}: SiteShellProps) {
  const hasSidebar = Boolean(sidebar);
  const hasToc = Boolean(toc);
  const layoutWidth = hasToc
    ? "max-w-[calc(var(--content-width)+var(--toc-width)+var(--content-gap))]"
    : "max-w-[var(--content-width)]";

  return (
    <SidebarProvider defaultOpen={false}>
      {sidebar}
      <SidebarInset className={cn("min-h-svh", className)}>
        <Navbar ... />
        <div className={cn("flex-1", contentClassName)}>
          {hasToc ? (
            <div className={cn("mx-auto w-full px-4 lg:px-6", layoutWidth)}>
              <div className="grid gap-[var(--content-gap)] lg:grid-cols-[minmax(0,var(--content-width))_var(--toc-width)]">
                <div className="min-w-0">{children}</div>
                <aside className="hidden lg:block">{toc}</aside>
              </div>
            </div>
          ) : (
            <div className={cn("mx-auto w-full px-4 lg:px-6", layoutWidth)}>
              {children}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### Issues to Address
1. No consistent padding bottom for content
2. Sidebar/content transition could be smoother
3. Missing explicit container max-width on sidebar layouts
4. Grid gap might not feel consistent across breakpoints

---

## CSS Variables Review

### Current Variables (globals.css)
```css
:root {
  --content-width: 65ch;        /* ~650px at 16px base */
  --toc-width: 14rem;           /* 224px */
  --content-gap: 4rem;          /* 64px */
  --navbar-height: 4rem;        /* 64px */
}
```

### Sidebar Variables (from shadcn)
```css
:root {
  --sidebar-width: 16rem;       /* 256px */
  --sidebar-width-icon: 3rem;   /* 48px collapsed */
  --sidebar-width-mobile: 18rem; /* 288px mobile sheet */
}
```

---

## Refinements to Implement

### 1. Content Padding Consistency

Add consistent bottom padding to prevent content from ending abruptly:

```tsx
<div className={cn("flex-1 pb-16 lg:pb-24", contentClassName)}>
```

### 2. Smooth Layout Transitions

Add transition for content area when sidebar toggles:

```css
/* globals.css */
[data-slot="sidebar-inset"] {
  transition: margin-left 0.2s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="sidebar-inset"] {
    transition: none;
  }
}
```

### 3. Grid Alignment Improvements

Ensure grid aligns properly with sidebar:

```tsx
// When sidebar present, adjust the TOC layout container
const layoutWidth = hasToc
  ? hasSidebar
    ? "max-w-none" // Full width in sidebar layout
    : "max-w-[calc(var(--content-width)+var(--toc-width)+var(--content-gap))]"
  : hasSidebar
    ? "max-w-none"
    : "max-w-[var(--content-width)]";
```

### 4. Responsive Gap Handling

Use responsive gap values:

```tsx
<div className="grid gap-8 lg:gap-[var(--content-gap)] lg:grid-cols-[minmax(0,var(--content-width))_var(--toc-width)]">
```

---

## Updated Implementation

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface SiteShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  toc?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SiteShell({
  children,
  sidebar,
  toc,
  className,
  contentClassName,
}: SiteShellProps) {
  const hasSidebar = Boolean(sidebar);
  const hasToc = Boolean(toc);

  // Determine max-width based on layout type
  const layoutWidth = React.useMemo(() => {
    if (hasSidebar) {
      // Sidebar layouts use full available width
      return "max-w-none";
    }
    if (hasToc) {
      // Blog posts with TOC
      return "max-w-[calc(var(--content-width)+var(--toc-width)+var(--content-gap))]";
    }
    // Simple content pages
    return "max-w-[var(--content-width)]";
  }, [hasSidebar, hasToc]);

  return (
    <SidebarProvider defaultOpen={false}>
      {sidebar}
      <SidebarInset className={cn("min-h-svh flex flex-col", className)}>
        <Navbar
          showSidebarTrigger={hasSidebar}
          fullBleed={hasSidebar}
          containerClassName={hasSidebar ? undefined : layoutWidth}
        />

        {/* Main content area */}
        <main
          className={cn(
            "flex-1",
            // Consistent bottom padding
            "pb-16 lg:pb-24",
            contentClassName
          )}
        >
          {hasToc ? (
            <div className={cn("mx-auto w-full px-4 lg:px-6", layoutWidth)}>
              <div
                className={cn(
                  "grid",
                  // Responsive gap
                  "gap-8 lg:gap-[var(--content-gap)]",
                  // Grid columns only on large screens
                  "lg:grid-cols-[minmax(0,var(--content-width))_var(--toc-width)]"
                )}
              >
                {/* Content column */}
                <div className="min-w-0">{children}</div>

                {/* TOC column - hidden on mobile */}
                <aside className="hidden lg:block">{toc}</aside>
              </div>
            </div>
          ) : (
            <div className={cn("mx-auto w-full px-4 lg:px-6", layoutWidth)}>
              {children}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default SiteShell;
```

---

## CSS Updates (globals.css)

### Layout Transition
```css
/* Smooth sidebar toggle transition */
[data-slot="sidebar-inset"] {
  transition: margin-left 0.2s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="sidebar-inset"] {
    transition: none;
  }
}
```

### Sticky TOC Positioning
```css
/* Ensure TOC stays below navbar */
.sticky-toc {
  position: sticky;
  top: calc(var(--navbar-height) + 1.5rem);
  max-height: calc(100vh - var(--navbar-height) - 3rem);
  overflow-y: auto;
}
```

### Content Area Minimum Height
```css
/* Ensure content fills viewport */
main {
  min-height: calc(100vh - var(--navbar-height));
}
```

### Responsive Adjustments
```css
/* Tighter padding on mobile */
@media (max-width: 1024px) {
  :root {
    --content-gap: 2rem;
  }
}
```

---

## Layout Diagram

### Simple Layout
```
┌─────────────────────────────────────────┐
│              Navbar                     │
├─────────────────────────────────────────┤
│                                         │
│         ┌───────────────┐               │
│         │               │               │
│         │   Content     │               │
│         │   (65ch max)  │               │
│         │               │               │
│         └───────────────┘               │
│                                         │
│              pb-16/24                   │
└─────────────────────────────────────────┘
```

### TOC Layout (Blog)
```
┌─────────────────────────────────────────┐
│              Navbar                     │
├─────────────────────────────────────────┤
│                                         │
│    ┌───────────────┬─────────┐          │
│    │               │         │          │
│    │   Content     │   TOC   │          │
│    │   (65ch max)  │ (14rem) │          │
│    │               │         │          │
│    │               │ sticky  │          │
│    └───────────────┴─────────┘          │
│           gap: 4rem                     │
│              pb-16/24                   │
└─────────────────────────────────────────┘
```

### Sidebar + TOC Layout (Courses)
```
┌─────────────────────────────────────────────────┐
│                    Navbar                       │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│          │    ┌───────────────┬─────────┐       │
│          │    │               │         │       │
│ Sidebar  │    │   Content     │   TOC   │       │
│ (16rem)  │    │   (65ch)      │ (14rem) │       │
│          │    │               │         │       │
│          │    └───────────────┴─────────┘       │
│          │                                      │
│          │              pb-16/24                │
└──────────┴──────────────────────────────────────┘
```

---

## Responsive Behavior

### Breakpoints
- **< 1024px (lg)**: TOC hidden, single column
- **< 768px (md)**: Sidebar becomes sheet modal
- **< 640px (sm)**: Tighter padding

### Mobile Layout
```
┌───────────────────┐
│      Navbar       │
│ [☰] Logo     [□] │
├───────────────────┤
│                   │
│     Content       │
│    (full width)   │
│                   │
│                   │
│                   │
│                   │
└───────────────────┘
```

---

## Testing Checklist

### Layout Tests
- [ ] Simple layout centers content correctly
- [ ] TOC layout shows grid on lg+ screens
- [ ] Sidebar layout fills available space
- [ ] Bottom padding consistent across layouts

### Responsive Tests
- [ ] TOC hides on screens < 1024px
- [ ] Sidebar becomes sheet on mobile
- [ ] Content width adjusts appropriately
- [ ] No horizontal scroll on any viewport

### Transition Tests
- [ ] Sidebar toggle animates smoothly
- [ ] Reduced motion disables transitions
- [ ] No layout shift during transitions

### Sticky Behavior Tests
- [ ] Navbar stays fixed on scroll
- [ ] TOC stays sticky within viewport
- [ ] Sidebar stays in place when scrolling content

---

## Files Modified

| File | Changes |
|------|---------|
| `components/layout/SiteShell.tsx` | Layout refinements |
| `app/globals.css` | Transition and spacing styles |

## Breaking Changes
- None (internal refinements only)

## Performance Notes
- Transition uses CSS, not JS animation
- Grid layout uses native CSS Grid
- No additional DOM elements added
