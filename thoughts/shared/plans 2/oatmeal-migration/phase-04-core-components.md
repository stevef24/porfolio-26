# Phase 4: Core UI Components

## Overview

This phase updates the foundational shadcn/ui components (Button, Card, Badge, Input, Label) with Oatmeal styling specifications.

**Status**: Pending
**Dependencies**: Phase 1 (Foundation - CSS variables must be set)
**Estimated Effort**: Medium-High
**Risk Level**: Medium (high-usage components)

---

## Files to Modify

| File | Priority | Key Changes |
|------|----------|-------------|
| `components/ui/button.tsx` | Critical | Pill radius, height 48px, hover states |
| `components/ui/card.tsx` | Critical | 8px radius, shadow-sm, border |
| `components/ui/badge.tsx` | High | Pill radius, color variants |
| `components/ui/input.tsx` | High | 2px radius, 40px height |
| `components/ui/label.tsx` | Medium | Typography alignment |

---

## Oatmeal Button Specifications

### Primary Button
```
Height: 48px (h-12)
Padding: 0 24px (px-6)
Border-radius: 9999px (rounded-full / pill)
Background: color.text.primary (#19170f light / #f8f6ef dark)
Text: color.text.inverse (#ffffff light / #0e0e0c dark)
Font: Inter, 16px, medium (500)

Hover: bg → accent.primary (#566240 light / #6f7c5a dark)
Focus: 2px ring accent.secondary, 2px offset
Disabled: opacity 0.6, cursor not-allowed
```

### Secondary Button (Outline)
```
Height: 48px
Border-radius: pill
Background: transparent
Border: 1px solid border.strong
Text: text.primary

Hover: bg → muted, border → accent.primary
```

---

## Task 4.1: Update Button Component

### File: `components/ui/button.tsx`

**Replace buttonVariants:**

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Base styles
  [
    "cursor-pointer",
    "inline-flex items-center justify-center",
    "whitespace-nowrap",
    "font-medium text-base", // 16px
    "transition-all duration-200",
    "disabled:pointer-events-none disabled:opacity-60",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "select-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // Primary: Solid fill with inverted contrast
        default: [
          "bg-foreground text-background",
          "hover:bg-primary hover:text-primary-foreground",
          "rounded-full", // Pill shape
        ],
        // Secondary: Outline style
        outline: [
          "bg-transparent text-foreground",
          "border border-input",
          "hover:bg-muted hover:border-primary hover:text-primary",
          "rounded-full",
        ],
        // Secondary solid
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-muted",
          "rounded-full",
        ],
        // Ghost: No background
        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-muted",
          "rounded-full",
        ],
        // Destructive
        destructive: [
          "bg-destructive/10 text-destructive",
          "hover:bg-destructive/20",
          "rounded-full",
        ],
        // Link style
        link: [
          "text-primary underline-offset-4",
          "hover:underline",
          "p-0 h-auto",
        ],
      },
      size: {
        // Oatmeal default: 48px height
        default: "h-12 px-6 gap-2",
        // Small: 36px (header CTA)
        sm: "h-9 px-4 gap-1.5 text-sm",
        // Large: 56px
        lg: "h-14 px-8 gap-2",
        // Extra small
        xs: "h-7 px-3 gap-1 text-xs",
        // Icon buttons
        icon: "size-12",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
        "icon-xs": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## Task 4.2: Update Card Component

### File: `components/ui/card.tsx`

**Update Card base styles:**

```typescript
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Oatmeal card specs
        "bg-card text-card-foreground",
        "rounded-lg", // 8px - radius.md
        "border border-border", // 1px subtle border
        "shadow-sm", // Oatmeal shadow
        "overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5",
        "px-6 pt-6", // Oatmeal: 24px padding
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6 pb-6", // 24px padding
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center",
        "px-6 pb-6",
        "pt-0",
        className
      )}
      {...props}
    />
  );
}
```

---

## Task 4.3: Update Badge Component

### File: `components/ui/badge.tsx`

**Update badgeVariants:**

```typescript
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-full", // Pill shape per Oatmeal
    "px-3 py-0.5",
    "text-sm font-medium", // 14px
    "whitespace-nowrap",
    "transition-colors",
    "w-fit",
    "border border-transparent",
    "[&_svg]:size-3.5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground",
          "border-border",
        ],
        outline: [
          "bg-transparent text-foreground",
          "border-border",
        ],
        destructive: [
          "bg-destructive/10 text-destructive",
        ],
        // Muted/ghost style
        ghost: [
          "bg-muted text-muted-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

---

## Task 4.4: Update Input Component

### File: `components/ui/input.tsx`

**Update Input styles:**

```typescript
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Oatmeal input specs
        "flex w-full min-w-0",
        "h-10", // 40px height (slightly smaller than buttons)
        "px-3 py-2",
        "rounded-xs", // 2px radius per Oatmeal
        "bg-transparent",
        "border border-input", // border.strong
        "text-base text-foreground", // 16px
        "placeholder:text-muted-foreground/60",
        // Focus state
        "focus-visible:outline-none",
        "focus-visible:border-primary",
        "focus-visible:ring-2 focus-visible:ring-primary/20",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Transition
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}
```

---

## Task 4.5: Update Label Component

### File: `components/ui/label.tsx`

**Update Label styles:**

```typescript
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-sm font-medium", // 14px, medium weight
        "text-foreground",
        "leading-none",
        // Peer disabled state
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        // Group disabled state
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
    />
  );
}
```

---

## Verification Steps

### 1. Button Checks
- [ ] Default button has pill shape (fully rounded)
- [ ] Height is 48px (h-12)
- [ ] Dark bg on light mode, light bg on dark mode
- [ ] Hover transitions to olive green
- [ ] Focus ring is visible with offset

### 2. Card Checks
- [ ] Border radius is 8px (rounded-lg)
- [ ] Has subtle shadow
- [ ] Border is visible but subtle
- [ ] Padding is 24px (px-6, py-6)

### 3. Badge Checks
- [ ] Pill shape (fully rounded)
- [ ] Primary variant is olive green
- [ ] Text is 14px

### 4. Input Checks
- [ ] Border radius is 2px (rounded-xs)
- [ ] Height is 40px
- [ ] Focus shows primary color border
- [ ] Focus ring is subtle (20% opacity)

### 5. Label Checks
- [ ] Text is 14px medium weight
- [ ] Color is foreground (not muted)

### 6. Dark Mode
- [ ] All components invert correctly
- [ ] Sufficient contrast maintained

---

## Commit Strategy

```bash
git add components/ui/button.tsx components/ui/card.tsx components/ui/badge.tsx components/ui/input.tsx components/ui/label.tsx
git commit -m "style(ui): update core components with Oatmeal styling

Button:
- Pill radius (rounded-full) for all variants
- Default height 48px (h-12)
- Inverted contrast: dark bg on light, light on dark
- Hover transitions to primary (olive green)

Card:
- Border radius 8px (rounded-lg)
- Shadow-sm for subtle elevation
- 24px internal padding

Badge:
- Pill radius
- Updated color variants

Input:
- Border radius 2px (rounded-xs)
- Height 40px
- Focus ring with primary color

Label:
- 14px medium weight typography"
```

---

## Component Size Reference

| Component | Height | Padding | Radius |
|-----------|--------|---------|--------|
| Button (default) | 48px | 24px horizontal | pill |
| Button (sm) | 36px | 16px horizontal | pill |
| Button (lg) | 56px | 32px horizontal | pill |
| Input | 40px | 12px horizontal | 2px |
| Badge | auto | 12px horizontal | pill |
| Card | auto | 24px | 8px |

---

## Next Steps

After Phase 4 completes:
- Phase 5 (Complex Components) should proceed
- Phase 6 (Custom Components) can begin
