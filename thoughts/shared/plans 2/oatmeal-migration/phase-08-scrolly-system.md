# Phase 8: Scrolly Coding System

## Overview

This phase updates the scrolly coding components with Oatmeal colors, replacing all lime green accents with olive green.

**Status**: Pending
**Dependencies**: Phase 1 (Foundation)
**Estimated Effort**: High
**Risk Level**: Medium (hardcoded colors in multiple files)

---

## Files to Modify

| File | Priority | Key Changes |
|------|----------|-------------|
| `app/globals.css` | Critical | Scrolly CSS section (lines 755-888) |
| `components/ui/scrolly/ScrollyStage.tsx` | Critical | Hardcoded colors, focus lines |
| `components/ui/scrolly/ScrollyStageMobile.tsx` | High | Same as ScrollyStage |
| `components/ui/scrolly/ScrollyStep.tsx` | Medium | Step card styling |
| `components/ui/scrolly/StageControls.tsx` | Medium | Button colors |
| `components/ui/scrolly/StageFullscreen.tsx` | Medium | Fullscreen panel colors |

---

## Current Color Audit

### Colors to Replace

| Location | Current (Lime) | Target (Olive) |
|----------|----------------|----------------|
| Focus line bg | `oklch(0.65 0.2 125)` | `#566240` / `rgba(86,98,64,0.15)` |
| Focus line border | `oklch(0.65 0.2 125)` | `#566240` |
| Stage bg light | `#fafafa` | `#f8f6ef` or `#f1eee5` |
| Stage bg dark | `#121212`, `#161616` | `#0e0e0c`, `#1a1a17` |
| Badge bg | Various | `#19170f` light / dark text |

---

## Task 8.1: Update Scrolly CSS in globals.css

### File: `app/globals.css` (lines 755-888)

**Replace the scrolly section:**

```css
/* ═══════════════════════════════════════════════════════════════════
   SCROLLY CODING SYSTEM - OATMEAL PALETTE
   ═══════════════════════════════════════════════════════════════════ */

/* Scrolly Typography */
.scrolly-text-body {
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 1.25rem; /* 20px */
  line-height: 1.9; /* 38px for rhythm */
  color: var(--foreground);
}

/* Stage Background - Warm muted surface */
.scrolly-stage-bg {
  background-color: #f1eee5; /* bg.muted light - warm cream */
}

.dark .scrolly-stage-bg {
  background-color: #1a1a17; /* bg.muted dark */
}

/* Focus Line Highlighting - Olive Green */
.scrolly-stage-code .scrolly-focus-line {
  background-color: rgba(86, 98, 64, 0.12); /* #566240 at 12% */
  border-left: 3px solid #566240; /* Olive green border */
  margin-left: -1rem;
  padding-left: calc(1rem - 3px);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.dark .scrolly-stage-code .scrolly-focus-line {
  background-color: rgba(111, 124, 90, 0.15); /* #6f7c5a at 15% */
  border-left-color: #6f7c5a; /* Lighter olive for dark mode */
}

/* Non-focused Lines - Dimmed */
.scrolly-stage-code .scrolly-dim-line {
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

/* Stage Code Container */
.scrolly-stage-code {
  font-family: var(--font-mono), monospace;
  font-size: 0.875rem; /* 14px */
  line-height: 1.6;
}

/* Line Numbers - Muted */
.scrolly-stage-code .line-number {
  color: var(--muted-foreground);
  opacity: 0.5;
  width: 2rem;
  text-align: right;
  margin-right: 1rem;
  user-select: none;
}

/* Filename Badge */
.scrolly-filename-badge {
  background-color: rgba(25, 23, 15, 0.9); /* text.primary at 90% */
  color: rgba(248, 246, 239, 0.8); /* text.inverse at 80% */
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.dark .scrolly-filename-badge {
  background-color: rgba(248, 246, 239, 0.1); /* Inverted for dark */
  color: rgba(248, 246, 239, 0.7);
}

/* Step Cards */
.scrolly-step {
  padding: 1.5rem;
  border-radius: 0.5rem; /* 8px */
  background-color: transparent;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.scrolly-step:hover {
  background-color: var(--muted);
}

/* Step Card States */
.scrolly-step[data-state="active"] {
  opacity: 1;
}

.scrolly-step[data-state="past"] {
  opacity: 0.4;
}

.scrolly-step[data-state="future"] {
  opacity: 0.6;
}

/* Stage Controls */
.scrolly-controls {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: var(--card);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.scrolly-controls button {
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: var(--muted-foreground);
  transition: color 0.15s ease, background-color 0.15s ease;
}

.scrolly-controls button:hover {
  color: var(--primary);
  background-color: var(--muted);
}
```

---

## Task 8.2: Update ScrollyStage Component

### File: `components/ui/scrolly/ScrollyStage.tsx`

**Find and replace hardcoded colors:**

```typescript
// Replace stage background colors
// Before:
"bg-[#fafafa] dark:bg-[#121212]"
// After:
"bg-[#f1eee5] dark:bg-[#1a1a17]"

// Replace filename badge
// Before:
"bg-[#161616]/90 dark:bg-[#161616] text-white/80"
// After:
"bg-[#19170f]/90 dark:bg-[#f8f6ef]/10 text-[#f8f6ef]/80"

// Update generateFocusLineStyles function:
function generateFocusLineStyles(focusLines: number[] | undefined): string {
  if (!focusLines || focusLines.length === 0) return "";

  const lineSelectors = focusLines
    .map((line) => `.line:nth-child(${line})`)
    .join(", ");

  // Oatmeal olive colors
  return `
    .scrolly-stage-code .line {
      opacity: 0.5;
      transition: opacity 0.2s ease, background-color 0.2s ease;
    }
    .scrolly-stage-code ${lineSelectors} {
      opacity: 1;
      background-color: rgba(86, 98, 64, 0.12);
      border-left: 3px solid #566240;
      margin-left: -1rem;
      padding-left: calc(1rem - 3px);
    }
    .dark .scrolly-stage-code ${lineSelectors} {
      background-color: rgba(111, 124, 90, 0.15);
      border-left-color: #6f7c5a;
    }
  `;
}
```

---

## Task 8.3: Update ScrollyStageMobile Component

### File: `components/ui/scrolly/ScrollyStageMobile.tsx`

**Same color updates as ScrollyStage:**

```typescript
// Stage container background
"bg-[#f1eee5] dark:bg-[#1a1a17]"

// Badge styling
"bg-[#19170f]/90 dark:bg-[#f8f6ef]/10 text-[#f8f6ef]/80"

// Focus line styling (if inline)
// Use same olive colors as ScrollyStage
```

---

## Task 8.4: Update ScrollyStep Component

### File: `components/ui/scrolly/ScrollyStep.tsx`

**Update step card styling:**

```typescript
// Container classes
const stepClasses = cn(
  "scrolly-step",
  "p-6", // 24px padding
  "rounded-lg", // 8px
  "transition-all duration-200",
  // State-based opacity (handled by CSS or inline)
  isActive && "opacity-100",
  isPast && "opacity-40",
  !isActive && !isPast && "opacity-60",
  // Hover
  "hover:bg-muted/50"
);

// Title classes
const titleClasses = cn(
  "text-lg font-medium",
  "text-foreground",
  isActive && "text-primary" // Olive when active
);
```

---

## Task 8.5: Update StageControls Component

### File: `components/ui/scrolly/StageControls.tsx`

**Update button styling:**

```typescript
// Control button classes
const buttonClasses = cn(
  "p-2 rounded-md",
  "text-muted-foreground",
  "hover:text-primary hover:bg-muted",
  "transition-colors duration-150"
);

// Active state
const activeButtonClasses = cn(
  "text-primary bg-muted"
);
```

---

## Task 8.6: Update StageFullscreen Component

### File: `components/ui/scrolly/StageFullscreen.tsx`

**Update fullscreen panel:**

```typescript
// Backdrop
"fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"

// Panel
cn(
  "fixed inset-4 z-50",
  "bg-[#f1eee5] dark:bg-[#1a1a17]", // Oatmeal muted
  "rounded-xl", // 12px
  "border border-border",
  "shadow-lg",
  "overflow-hidden"
)

// Close button
"text-muted-foreground hover:text-foreground"
```

---

## Color Palette Reference

### Focus Lines
| State | Light Mode | Dark Mode |
|-------|------------|-----------|
| Background | `rgba(86, 98, 64, 0.12)` | `rgba(111, 124, 90, 0.15)` |
| Border | `#566240` | `#6f7c5a` |

### Stage Backgrounds
| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Stage bg | `#f1eee5` | `#1a1a17` |
| Badge bg | `#19170f` at 90% | `#f8f6ef` at 10% |
| Badge text | `#f8f6ef` at 80% | `#f8f6ef` at 70% |

### Step Cards
| State | Opacity |
|-------|---------|
| Active | 100% |
| Past | 40% |
| Future | 60% |

---

## Verification Steps

### 1. Focus Line Checks
- [ ] Focus lines have olive background
- [ ] Left border is olive (3px)
- [ ] Non-focused lines are dimmed (50%)
- [ ] Transitions are smooth

### 2. Stage Background Checks
- [ ] Light mode: warm cream (#f1eee5)
- [ ] Dark mode: muted dark (#1a1a17)
- [ ] No remaining #fafafa or #121212

### 3. Badge Checks
- [ ] Badge has correct inverted styling
- [ ] Text is readable on badge
- [ ] Position is correct (top-right)

### 4. Step Card Checks
- [ ] Active step is full opacity
- [ ] Past steps are dimmed
- [ ] Future steps are slightly dimmed
- [ ] Hover works on all steps

### 5. Controls Checks
- [ ] Buttons hover to olive
- [ ] Background is card color
- [ ] Icons are visible

### 6. Fullscreen Checks
- [ ] Panel has correct background
- [ ] Backdrop blur works
- [ ] Close button visible

### 7. No Lime Green
- [ ] Search for `oklch` in scrolly files - should be zero
- [ ] Search for `#f5f57` or similar lime - should be zero
- [ ] All greens are olive (#566240/#6f7c5a)

---

## Commit Strategy

```bash
git add app/globals.css components/ui/scrolly/*.tsx
git commit -m "style(scrolly): update scrolly system with Oatmeal colors

CSS (globals.css):
- Focus lines: olive green bg and border
- Stage bg: #f1eee5 light / #1a1a17 dark
- Filename badge: inverted text styling
- Step opacity states: 100%/40%/60%

ScrollyStage:
- Replace #fafafa → #f1eee5
- Replace #121212 → #1a1a17
- Update generateFocusLineStyles with olive

ScrollyStageMobile:
- Same color updates

ScrollyStep:
- Active title uses primary (olive)
- Opacity-based state indication

StageControls/StageFullscreen:
- Button hover: primary color
- Panel backgrounds: muted colors"
```

---

## Rollback Plan

If scrolly breaks:
```bash
git checkout HEAD~1 -- app/globals.css components/ui/scrolly/
```

---

## Next Steps

After Phase 8 completes:
- Phase 9 (Landing/Layout) can proceed
- Phase 10 (Cleanup) should begin
