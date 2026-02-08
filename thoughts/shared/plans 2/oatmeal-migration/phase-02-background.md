# Phase 2: Background Component

## Overview

This phase transforms the complex canvas-based SwissGridBackground (with noise, grain, and ambient glow) into a clean, smooth Oatmeal-style background.

**Status**: Pending
**Dependencies**: Phase 1 (Foundation)
**Estimated Effort**: Medium
**Risk Level**: Low (isolated component)

---

## Files to Modify

| File | Changes |
|------|---------|
| `components/ui/SwissGridBackground.tsx` | Complete rewrite - remove canvas, simplify |
| `app/globals.css` | Update `.dark body` background (if not done in Phase 1) |

---

## Current State Analysis

### SwissGridBackground.tsx Current Features:
1. **Canvas Noise Animation** - 512px procedural noise buffer, refreshes every 5 frames
2. **Grid Overlay** - 64px baseline grid with opacity masking
3. **Radial Gradient Spotlight** - Centered top-20%, lime green ambient glow
4. **Vignette Effect** - Linear fade to darker at bottom
5. **Theme-aware** - Different effects for light/dark modes

### Why Remove?
- Oatmeal design system uses clean, smooth backgrounds
- No grain or noise texture
- Simpler visual hierarchy
- Better performance (no canvas animation)

---

## Task 2.1: Rewrite SwissGridBackground

### File: `components/ui/SwissGridBackground.tsx`

**Complete Replacement:**

```typescript
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * OatmealBackground - Clean, smooth background
 *
 * Design Philosophy:
 * - No canvas noise or grain
 * - Warm cream (light) / deep charcoal (dark)
 * - Optional subtle depth gradient
 * - Respects prefers-reduced-motion
 */
export function SwissGridBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundColor: isDark ? "#0e0e0c" : "#f8f6ef",
      }}
    >
      {/* Subtle depth gradient - adds dimension without noise */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.15) 100%)"
            : "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.02) 100%)",
        }}
      />

      {/* Optional: Very subtle radial vignette for focus */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0, 0, 0, 0.2) 100%)"
            : "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0, 0, 0, 0.03) 100%)",
        }}
      />
    </div>
  );
}

export default SwissGridBackground;
```

---

## Task 2.2: Delete Duplicate Files (Optional Cleanup)

If duplicate background files exist, they should be removed:

```bash
# Check for duplicates
ls -la components/ui/SwissGridBackground*.tsx

# If found, delete:
# rm "components/ui/SwissGridBackground 2.tsx"
# rm "components/ui/SwissGridBackground 3.tsx"
# rm "components/ui/SwissGridBackground 4.tsx"
```

---

## Task 2.3: Verify Body Background

### File: `app/globals.css`

Ensure the body background matches (should be set in Phase 1):

```css
body {
  background-color: var(--background);
}

.dark body {
  background-color: #0e0e0c;
}
```

---

## Design Rationale

### Why This Approach?

1. **Clean Foundation**: Oatmeal's aesthetic is "muted sophistication" - noise/grain conflicts with this
2. **Performance**: No canvas animation = better performance on low-end devices
3. **Consistency**: Background now matches the overall refined feel
4. **Accessibility**: No motion for users who prefer reduced motion

### What We Keep:
- Fixed positioning (stays behind content)
- Theme-aware switching
- Hydration-safe rendering

### What We Remove:
- Canvas element and animation loop
- Grid overlay
- Grain/noise texture
- Complex radial gradients with colors

---

## Verification Steps

### 1. Visual Check - Light Mode
- [ ] Background is solid warm cream (#f8f6ef)
- [ ] No visible noise or grain texture
- [ ] No flickering or animation
- [ ] Subtle gradient barely perceptible (adds depth without distraction)

### 2. Visual Check - Dark Mode
- [ ] Background is solid deep charcoal (#0e0e0c)
- [ ] No visible noise or grain
- [ ] Subtle vignette adds focus to center content

### 3. Performance Check
- [ ] No canvas-related entries in browser DevTools Performance tab
- [ ] Smooth scrolling on all pages

### 4. Theme Toggle Check
- [ ] Switching themes updates background instantly
- [ ] No flash of incorrect color

### 5. Mobile Check
- [ ] Background renders correctly on mobile viewport
- [ ] No performance issues

---

## Commit Strategy

```bash
git add components/ui/SwissGridBackground.tsx
git commit -m "style(background): remove noise/grain, implement clean Oatmeal background

- Remove canvas-based noise animation
- Remove 64px grid overlay
- Remove lime green ambient glow
- Implement clean solid background with subtle depth gradient
- Maintain theme-aware switching and hydration safety"
```

---

## Before/After Comparison

| Aspect | Before | After |
|--------|--------|-------|
| Light BG | White with lime spotlight | Warm cream (#f8f6ef) |
| Dark BG | Black with noise + glow | Deep charcoal (#0e0e0c) |
| Texture | Canvas noise, grid | None (clean) |
| Animation | 5-frame noise refresh | None |
| Performance | Canvas overhead | Minimal CSS only |
| File Size | ~150 lines | ~50 lines |

---

## Rollback Plan

```bash
git checkout HEAD~1 -- components/ui/SwissGridBackground.tsx
```

---

## Next Steps

After Phase 2 completes, proceed to:
- Phase 3 (Typography) - if not already started in parallel
- Phase 4 (Core Components) - if not already started in parallel
