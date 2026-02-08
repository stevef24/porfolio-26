# Task 07: Add CSS for Disabled/Unavailable Tabs

**Status:** Pending
**File:** `app/globals.css`
**Lines:** After existing canvas-code-stage styles (~line 1400)

## Objective

Add CSS for unavailable tab styling and availability dot indicator.

## CSS to Add

```css
/* ==========================================
   GLOBAL FILE TABS - Cross-Step Persistence
   ========================================== */

/* Unavailable tabs - files not in current step */
.canvas-code-stage-tab[data-available="false"] {
  opacity: 0.35;
  pointer-events: none;
  cursor: not-allowed;
}

/* Transition for availability state changes */
.canvas-code-stage-tab {
  transition: opacity 200ms ease-out;
}

/* Availability dot indicator for non-selected available files */
.canvas-code-stage-tab-dot {
  position: absolute;
  top: 50%;
  right: -2px;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: oklch(var(--primary));
  opacity: 0.6;
}

/* Hide dot when tab is selected */
.canvas-code-stage-tab[data-active="true"] .canvas-code-stage-tab-dot {
  display: none;
}

/* Hover state for available tabs only */
.canvas-code-stage-tab[data-available="true"]:hover {
  background-color: oklch(var(--foreground) / 0.05);
}

/* Focus visible for accessibility */
.canvas-code-stage-tab:focus-visible {
  outline: 1px solid oklch(var(--primary) / 0.5);
  outline-offset: 2px;
}

/* Disabled focus should not show outline */
.canvas-code-stage-tab[data-available="false"]:focus-visible {
  outline: none;
}
```

## Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .canvas-code-stage-tab {
    transition: none;
  }
}
```

## Design Rationale

- **35% opacity**: Clear visual distinction without being invisible
- **4px dot**: Subtle indicator that doesn't compete with text
- **Primary color dot**: Indicates "active in this step"
- **200ms transition**: Smooth state change, not distracting

## Verification

1. Unavailable tabs visually dimmed
2. Can't click unavailable tabs
3. Available but unselected tabs show green dot
4. Hover effect only on available tabs
5. Focus ring only on available tabs
