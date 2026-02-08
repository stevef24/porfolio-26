# Phase 7: Blog Components

## Overview

This phase updates the blog-specific UI components (RulerTOC, MobileFloatingTOC, StickyTOCSidebar, GradualBlur) with Oatmeal styling.

**Status**: Pending
**Dependencies**: Phases 1, 4 (Foundation and Core Components)
**Estimated Effort**: Medium
**Risk Level**: Low-Medium

---

## Files to Modify

| File | Priority | Key Changes |
|------|----------|-------------|
| `components/ui/blog/RulerTOC.tsx` | High | Active indicator, backgrounds |
| `components/ui/blog/MobileFloatingTOC.tsx` | High | Pill styling, colors |
| `components/ui/blog/StickyTOCSidebar.tsx` | Medium | Indicator bar, hover states |
| `components/ui/blog/GradualBlur.tsx` | Low | Gradient colors |

---

## Task 7.1: Update RulerTOC Component

### File: `components/ui/blog/RulerTOC.tsx`

**Key Updates:**

```typescript
// Expanded state container
const expandedClasses = cn(
  "fixed left-0 top-0 h-screen w-64",
  "bg-card/95 backdrop-blur-md",
  "border-r border-border/50",
  "p-6",
  "z-40"
);

// Active indicator - olive green
const activeIndicator = cn(
  "absolute left-0 w-1 rounded-full",
  "bg-primary", // Olive green
  "transition-all duration-300"
);

// TOC item base
const tocItemClasses = cn(
  "text-sm",
  "text-muted-foreground",
  "hover:text-foreground",
  "transition-colors duration-200"
);

// TOC item active state
const tocItemActiveClasses = cn(
  "text-primary", // Olive green
  "font-medium"
);

// Collapsed state - ruler marks
const rulerMarkClasses = cn(
  "h-3 w-0.5 rounded-full",
  "bg-border", // Default mark
  "transition-all duration-200"
);

const rulerMarkActiveClasses = cn(
  "bg-primary", // Olive when active
  "scale-y-150"
);
```

---

## Task 7.2: Update MobileFloatingTOC Component

### File: `components/ui/blog/MobileFloatingTOC.tsx`

**Key Updates:**

```typescript
// Floating pill container
const pillClasses = cn(
  "fixed bottom-6 left-1/2 -translate-x-1/2",
  "z-50",
  // Oatmeal styling
  "bg-card/95 backdrop-blur-md",
  "border border-border",
  "rounded-full", // Pill shape
  "shadow-lg",
  "px-4 py-2",
  "flex items-center gap-3"
);

// Current section text
const sectionTextClasses = cn(
  "text-sm font-medium",
  "text-foreground",
  "max-w-[200px] truncate"
);

// Progress indicator
const progressClasses = cn(
  "h-1 w-12 rounded-full",
  "bg-muted",
  "overflow-hidden"
);

const progressBarClasses = cn(
  "h-full rounded-full",
  "bg-primary", // Olive green fill
  "transition-all duration-300"
);

// Expand button
const expandButtonClasses = cn(
  "size-8",
  "flex items-center justify-center",
  "rounded-full",
  "text-muted-foreground",
  "hover:bg-muted hover:text-foreground",
  "transition-colors duration-200"
);
```

---

## Task 7.3: Update StickyTOCSidebar Component

### File: `components/ui/blog/StickyTOCSidebar.tsx`

**Key Updates:**

```typescript
// Sidebar container
const sidebarClasses = cn(
  "sticky top-24",
  "h-fit max-h-[calc(100vh-8rem)]",
  "overflow-y-auto",
  "pr-4"
);

// Animated indicator bar (left side)
const indicatorBarClasses = cn(
  "absolute left-0 w-0.5 rounded-full",
  "bg-primary", // Olive green
  "transition-transform duration-300",
  // Use spring animation from motion-variants
);

// TOC link base
const tocLinkClasses = cn(
  "block py-1.5 pl-4",
  "text-sm",
  "text-muted-foreground",
  "hover:text-foreground",
  "border-l border-transparent",
  "transition-all duration-200"
);

// TOC link active
const tocLinkActiveClasses = cn(
  "text-primary", // Olive
  "font-medium",
  "border-l-2 border-primary"
);

// Depth-based indentation (for nested headings)
const getIndentClass = (depth: number) => {
  const indents = ["pl-4", "pl-8", "pl-12"];
  return indents[Math.min(depth, 2)];
};
```

---

## Task 7.4: Update GradualBlur Component

### File: `components/ui/blog/GradualBlur.tsx`

**Key Updates:**

```typescript
export function GradualBlur({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 h-32",
        "pointer-events-none z-30",
        className
      )}
      aria-hidden="true"
    >
      {/* Gradient overlay - uses background color */}
      <div
        className="h-full w-full"
        style={{
          background: `linear-gradient(
            to top,
            var(--background) 0%,
            var(--background) 20%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
}
```

**Note:** The gradient now uses `var(--background)` which will be:
- Light: `#f8f6ef` (warm cream)
- Dark: `#0e0e0c` (deep charcoal)

This ensures the blur matches the Oatmeal background colors automatically.

---

## Color Reference for Blog Components

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Active indicator | `#566240` (primary) | `#6f7c5a` |
| Active text | `#566240` (primary) | `#6f7c5a` |
| Container bg | `#ffffff` (card) at 95% | `#1e1e1b` at 95% |
| Container border | `#e3e0d5` (border) at 50% | `#2a2a26` at 50% |
| Inactive text | `#5f5a48` (muted-fg) | `#a19b86` |
| Hover text | `#19170f` (foreground) | `#f8f6ef` |
| Progress bg | `#e8e5da` (muted) | `#1e1e1b` |
| Progress fill | `#566240` (primary) | `#6f7c5a` |
| Blur gradient | to `#f8f6ef` | to `#0e0e0c` |

---

## Verification Steps

### 1. RulerTOC Checks
- [ ] Collapsed state shows ruler marks
- [ ] Active mark is olive and scaled
- [ ] Expanded state has warm background
- [ ] Active item is olive colored
- [ ] Smooth transition between states

### 2. MobileFloatingTOC Checks
- [ ] Pill has card background with blur
- [ ] Border is subtle
- [ ] Progress bar fills with olive color
- [ ] Current section text is visible
- [ ] Shadow provides elevation

### 3. StickyTOCSidebar Checks
- [ ] Indicator bar is olive
- [ ] Active link is olive with left border
- [ ] Hover state works
- [ ] Scroll tracking is smooth
- [ ] Spring animation feels natural

### 4. GradualBlur Checks
- [ ] Gradient matches background color
- [ ] Fade is smooth from transparent to solid
- [ ] Works in both light and dark modes
- [ ] Doesn't interfere with content

### 5. Dark Mode
- [ ] All components invert correctly
- [ ] Olive tones visible on dark
- [ ] Blur effect works with dark background
- [ ] Sufficient contrast maintained

---

## Commit Strategy

```bash
git add components/ui/blog/RulerTOC.tsx components/ui/blog/MobileFloatingTOC.tsx components/ui/blog/StickyTOCSidebar.tsx components/ui/blog/GradualBlur.tsx
git commit -m "style(blog): update blog TOC components with Oatmeal styling

RulerTOC:
- Active indicator: primary (olive)
- Expanded bg: card/95 with blur
- Border: border/50

MobileFloatingTOC:
- Pill: card/95 with blur and shadow-lg
- Progress fill: primary (olive)
- Rounded-full for pill shape

StickyTOCSidebar:
- Indicator bar: primary (olive)
- Active link: primary with left border
- Preserved spring animation

GradualBlur:
- Gradient uses var(--background)
- Auto-adapts to light/dark"
```

---

## Next Steps

After Phase 7 completes:
- Phase 8 (Scrolly System) can proceed
- Phase 9 (Landing/Layout) can proceed
