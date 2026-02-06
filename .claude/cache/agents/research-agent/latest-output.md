# Research Report: animations.dev Course Page Layout Patterns

Generated: 2026-01-23

## Executive Summary

The animations.dev course pages use a sophisticated three-column CSS Grid layout with fixed 260px sidebars and a fluid center content area. The content is constrained to 700px within a nested grid that provides generous margins. Both sidebars use `position: sticky` with `top: 0` to remain fixed during scroll while the header scrolls away naturally.

## Research Question

Analyze the layout patterns used by animations.dev course pages, focusing on sidebar dimensions, content constraints, spacing, header behavior, and responsive breakpoints.

## Key Findings

### Finding 1: Three-Column Grid Layout

The main layout uses a CSS Grid with three columns at the 2xl breakpoint:

```css
/* Outer container */
.layout-container {
  display: grid;
  grid-template-columns: 260px 1fr 260px; /* 2xl breakpoint */
  border-top: 1px solid rgb(233, 233, 231);
}

/* Responsive variants */
@media (min-width: 1024px) { /* lg */
  grid-template-columns: 260px 1fr;
}

@media (min-width: 1536px) { /* 2xl */
  grid-template-columns: 260px 1fr 260px;
}
```

**Tailwind classes observed:**
```
lg:grid lg:grid-cols-[260px_1fr] 2xl:grid-cols-[260px_1fr_260px]
```

- Source: DOM inspection of main layout container

### Finding 2: Content Area Nested Grid

The center content area uses a nested grid to constrain prose to 700px:

```css
.content-area {
  display: grid;
  grid-template-columns: 1fr 700px 1fr; /* Creates centered 700px column */
  padding-top: 92px;
  padding-left: 48px;
  padding-right: 48px;
  padding-bottom: 48px;
}

/* All direct children go to center column */
.content-area > * {
  grid-column-start: 2;
}
```

**Tailwind classes observed:**
```
grid-cols-[1fr_700px_1fr] px-4 pt-16 *:col-start-2 lg:grid lg:p-12 lg:pt-[92px]
```

- The 92px top padding accounts for header height (72px) plus additional breathing room (20px)
- Content width on 1728px viewport: 1208px (center column)
- Prose width: 700px
- Side margins within content: 206px each (calculated: (1208 - 48 - 48 - 700) / 2)

- Source: DOM inspection of content grid container

### Finding 3: Sidebar Specifications

**Left Navigation Sidebar:**
```css
.left-sidebar {
  position: sticky;
  top: 0;
  width: 260px;
  padding: 24px;
  overflow-y: auto;
  overflow-x: visible;
  display: flex;
  flex-direction: column;
}
```

**Tailwind classes:**
```
sticky top-0 hidden flex-1 flex-col overflow-x-visible overflow-y-auto p-6 lg:flex
```

- Width: 260px (fixed)
- Padding: 24px (p-6)
- Hidden on mobile, visible on lg+ breakpoint
- Full height with scroll

**Right TOC Sidebar:**
```css
.right-sidebar {
  position: sticky;
  top: 0;
  width: 260px;
  padding: 24px;
  transform: translateX(-8px); /* -translate-x-2 = -0.5rem = -8px */
}
```

**Tailwind classes:**
```
sticky top-0 hidden h-fit -translate-x-2 p-6 2xl:block
```

- Only visible on 2xl+ (1536px+) breakpoint
- Height: fit-content (h-fit)
- Slight negative translate for visual alignment

- Source: DOM inspection of aside elements

### Finding 4: Header Specifications

```css
header {
  position: static; /* NOT fixed - scrolls with content */
  height: 72px;
  padding: 20px;
  background-color: rgb(253, 253, 252);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

**Tailwind classes:**
```
flex items-center justify-between bg-gray-100 p-4 antialiased md:p-5
```

- Height: 72px
- Padding: 20px (p-5 at md+)
- Static positioning (scrolls away)
- Background: rgb(253, 253, 252) - off-white/cream

- Source: DOM inspection of header element

### Finding 5: Typography Scale

| Element | Font Size | Font Weight | Line Height | Color |
|---------|-----------|-------------|-------------|-------|
| H1 (Lesson title) | 20px | 500 | 28px | rgb(33, 32, 28) |
| H2 (Section) | 16px | 500 | 24px | rgb(33, 32, 28) |
| Body text | 16px | 400 | 26.4px (1.65) | rgb(33, 32, 28) |
| Nav items | 14px | 400 | - | rgb(33, 32, 28) |
| TOC items | 13px | 400 | - | rgb(33, 32, 28) |
| Module label | 12px | 400 | - | rgb(130, 130, 124) |
| Code | 13px | - | normal | - |
| Header links | 16px | 500 | - | rgb(33, 32, 28) |

**Font family:** Inter (system font fallback)

- Source: Computed styles from DOM elements

### Finding 6: Interactive Component Specifications

**Demo containers (inline with content):**
```css
.demo-container {
  width: 700px; /* Same as prose */
  border-radius: 12px;
  background-color: rgb(255, 255, 255);
  margin-top: 28px;
  margin-bottom: 28px;
  overflow: hidden;
}
```

**Tailwind classes:**
```
mobile-full-width my-7 w-full overflow-hidden rounded-xl bg-white
md:rounded-xl border-b border-t border-gray-400
```

**Code playgrounds (breakout width):**
```css
.code-playground {
  width: 1112px; /* Breaks out of 700px prose */
  /* No explicit margins - uses grid placement */
}
```

- Code playgrounds span wider than prose content
- Width calculation: 1112px (approximately 700px + 206px + 206px - some padding)

- Source: DOM inspection of demo and playground containers

### Finding 7: Navigation Item Styling

**Active state:**
```css
.nav-item-active {
  background-color: rgb(241, 240, 239);
  border-radius: 6px;
  padding: 0 8px;
  height: 32px;
  font-size: 14px;
  font-weight: 400;
}
```

**Inactive state:**
```css
.nav-item {
  background-color: transparent;
  border-radius: 6px;
  padding: 0 8px;
  height: 32px;
}
```

**Module section:**
```css
.module-section {
  margin-bottom: 40px; /* mb-10 */
}

.module-section:last-of-type {
  margin-bottom: 0;
}
```

- Source: DOM inspection of navigation links

### Finding 8: TOC Active Indicator

```css
.toc-indicator {
  width: 3px;
  height: 20px;
  background-color: rgb(33, 32, 28); /* Dark gray/black */
  position: absolute;
  left: 0;
}
```

- Positioned to the left of active TOC item
- Solid dark color (matches text color)

- Source: DOM inspection of TOC indicator element

### Finding 9: Segmented Control (Tab Switcher)

```css
.segmented-control {
  background-color: rgb(255, 255, 255);
  border-radius: 9999px; /* Full pill shape */
  padding: 4px;
  width: 220px;
  height: 40px;
}

.segmented-tab {
  font-size: 13px;
  font-weight: 500;
  height: 32px;
}
```

- Source: DOM inspection of Fundamentals/Walkthroughs switcher

### Finding 10: Badge Styling

**"Updated" badge:**
```css
.update-badge {
  background-color: rgb(230, 244, 254); /* Light blue */
  color: rgb(94, 177, 239); /* Blue text */
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 6px;
}
```

- Source: DOM inspection of "Updated" badge

## Color Palette

| Usage | Color | RGB |
|-------|-------|-----|
| Background | Off-white | rgb(253, 253, 252) |
| Primary text | Dark charcoal | rgb(33, 32, 28) |
| Muted text | Gray | rgb(130, 130, 124) |
| Border | Light gray | rgb(233, 233, 231) |
| Nav active bg | Light gray | rgb(241, 240, 239) |
| Badge bg (blue) | Light blue | rgb(230, 244, 254) |
| Badge text (blue) | Blue | rgb(94, 177, 239) |
| White | Pure white | rgb(255, 255, 255) |

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Default | < 768px | Single column, no sidebars |
| md | 768px+ | Increased padding (p-5), rounded corners on demos |
| lg | 1024px+ | Two-column grid (260px + 1fr), left sidebar visible |
| 2xl | 1536px+ | Three-column grid (260px + 1fr + 260px), right TOC visible |

**Tailwind breakpoint classes used:**
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `2xl:` - Extra large screens (1536px+)

## Implementation Recommendations

### 1. Outer Layout Grid
```tsx
<div className="lg:grid lg:grid-cols-[260px_1fr] 2xl:grid-cols-[260px_1fr_260px]">
  <aside className="sticky top-0 hidden h-screen overflow-y-auto p-6 lg:flex lg:flex-col">
    {/* Left navigation */}
  </aside>

  <main className="lg:grid lg:grid-cols-[1fr_700px_1fr] lg:p-12 lg:pt-[92px] [&>*]:col-start-2">
    {/* Content */}
  </main>

  <aside className="sticky top-0 hidden h-fit p-6 2xl:block">
    {/* Right TOC */}
  </aside>
</div>
```

### 2. Key Spacing Values
- Sidebar width: 260px
- Content max-width: 700px
- Sidebar padding: 24px (p-6)
- Content top padding: 92px
- Content horizontal padding: 48px (p-12)
- Demo vertical margin: 28px (my-7)
- Module section bottom margin: 40px (mb-10)

### 3. Sticky Behavior
- Both sidebars use `position: sticky; top: 0`
- Header is static (scrolls away)
- Left sidebar needs `overflow-y: auto` for long navigation
- Right sidebar uses `h-fit` to only take needed height

### 4. Breakout Content
For code playgrounds that need to break out of the 700px prose width, use negative margins or grid column spanning:
```css
.breakout-content {
  grid-column: 1 / -1; /* Span all columns */
  max-width: 1112px;
  margin: 0 auto;
}
```

## Open Questions

- The exact mechanism for code playground breakout positioning needs verification (negative margins vs grid spanning)
- The scroll behavior on very long navigation lists may need additional testing
- Mobile navigation pattern (hamburger menu vs bottom sheet) not investigated

## Sources

- Direct DOM inspection of https://animations.dev/learn/animation-theory/intro
- Computed styles extracted via JavaScript
- Visual analysis via browser screenshots
