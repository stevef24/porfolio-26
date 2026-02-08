# Task 12: Test Reduced Motion and Build Verification

**Status:** Pending
**Files:** All modified files
**Depends on:** Tasks 01-11

## Objective

Verify all animations respect reduced motion preference and the build passes.

## Reduced Motion Testing

### 1. Enable Reduced Motion

**macOS:**
System Preferences → Accessibility → Display → Reduce motion

**Chrome DevTools:**
1. Open DevTools (F12)
2. Cmd+Shift+P → "Render"
3. Check "Emulate CSS media feature prefers-reduced-motion: reduce"

### 2. Test Each Feature

| Feature | Expected with Reduced Motion |
|---------|------------------------------|
| Canvas stretch | Instant width change (no spring) |
| Canvas content reveal | Instant opacity (no delay) |
| File tabs underline | Instant position (no slide) |
| Unavailable tab opacity | Instant change |
| TOC ruler-to-text | Instant state change (no morph) |
| TOC triangle marker | Instant position |

### 3. Code Patterns to Verify

Each animation should check `prefersReducedMotion`:

```typescript
// Motion component pattern
<motion.div
  animate={/* ... */}
  transition={prefersReducedMotion ? { duration: 0 } : springPreset}
>

// Or with initial
initial={prefersReducedMotion ? false : { opacity: 0 }}
```

## Build Verification

```bash
pnpm build
```

Expected: No errors, no warnings related to:
- TypeScript type errors
- Missing imports
- Unused variables
- Invalid motion props

## Visual Testing Checklist

Run dev server:
```bash
pnpm dev
```

Navigate to: `/blog/agent-sdk-deep-research`

### Canvas Stretch Animation
- [ ] Scroll to CanvasZone - canvas stretches from 0 to 50vw
- [ ] Content fades in after expansion starts
- [ ] Scroll past zone - canvas collapses smoothly
- [ ] No content flash during animation

### Cross-Step File Tabs
- [ ] All files from all steps visible as tabs
- [ ] Unavailable files dimmed (35% opacity)
- [ ] Can't click unavailable files
- [ ] Selecting file persists across steps (when available)
- [ ] Underline slides smoothly between tabs
- [ ] Availability dot shows on available-but-unselected tabs

### TOC Ruler-to-Text Morph
- [ ] Hover: Lines morph into text boxes
- [ ] Triangle marker animates to correct position
- [ ] Container gets background on expand
- [ ] Unhover: Text morphs back to lines
- [ ] Scroll progress bar shows below ruler

## Performance Check

Open DevTools → Performance tab:
1. Record while scrolling through CanvasZone
2. No excessive layout thrashing
3. Animations at 60fps (or close)

## Accessibility Check

1. Tab through file tabs - focus ring visible
2. Disabled tabs not focusable
3. Screen reader announces file names and availability

## Final Sign-off

- [ ] All visual tests pass
- [ ] Reduced motion tests pass
- [ ] `pnpm build` passes
- [ ] No console errors
- [ ] Performance acceptable
