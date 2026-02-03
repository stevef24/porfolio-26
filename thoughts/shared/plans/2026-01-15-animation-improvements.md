# Animation Improvements Plan

**Date:** 2026-01-15
**Branch:** scrollyCoding
**Status:** Ready for implementation

## Overview
Three animation enhancements for the blog canvas system:
1. **Canvas Stretch** - Width expansion instead of slide-in
2. **Cross-Step File Tabs** - IDE-like persistent file tabs
3. **TOC Ruler-to-Text Morph** - Layout animation morphing

---

## 1. Canvas Stretch Animation

**File:** `components/blog/BlogWithCanvas.tsx` (lines 538-572)

### Changes
Replace `x` transform with width animation:

```typescript
// Before: x: "100%" → x: 0
// After: width: 0 → width: "50vw"

<motion.div
  className={cn(
    "fixed top-0 right-0 h-screen",
    "hidden md:flex",
    "z-40",
    "overflow-hidden"  // NEW: clip content during expansion
  )}
  initial={{ width: 0 }}
  animate={{ width: "50vw" }}
  exit={{ width: 0 }}
  transition={springCanvasStretch}
  style={{ willChange: "width" }}
>
  {/* Content wrapper with delayed fade-in */}
  <motion.div
    className="w-full h-full"
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={canvasContentReveal}  // 0.15s delay
  >
    {canvasContent}
  </motion.div>
</motion.div>
```

### New Spring Presets (lib/motion-variants.ts)
```typescript
export const springCanvasStretch: Transition = {
  type: "spring",
  visualDuration: 0.35,
  bounce: 0.06,
};

export const canvasContentReveal: Transition = {
  duration: 0.2,
  ease: [0.25, 0.46, 0.45, 0.94],
  delay: 0.15,
};
```

---

## 2. Cross-Step File Tabs

**File:** `components/blog/CanvasCodeStage.tsx`

### State Changes (lines 437-440)
```typescript
// Before: activeFileIndex (per-step index)
// After: activeFileName (persistent across steps)

const [activeFileName, setActiveFileName] = useState<string | null>(null);
```

### New Data Structure
```typescript
interface GlobalFile {
  name: string;
  stepIndices: number[];      // Which steps contain this file
  isActiveInStep: boolean;    // Is it in the current step?
}

const globalFiles = useMemo((): GlobalFile[] => {
  const fileMap = new Map<string, number[]>();

  steps.forEach((step, stepIdx) => {
    const files = step.files?.map(f => f.name) || (step.file ? [step.file] : []);
    files.forEach(name => {
      const existing = fileMap.get(name) || [];
      existing.push(stepIdx);
      fileMap.set(name, existing);
    });
  });

  return Array.from(fileMap.entries())
    .sort((a, b) => a[1][0] - b[1][0])
    .map(([name, stepIndices]) => ({
      name,
      stepIndices,
      isActiveInStep: stepIndices.includes(activeIndex),
    }));
}, [steps, activeIndex]);
```

### Tab UI Changes (lines 637-658)
- Show ALL files across steps as tabs
- Dim tabs for files not in current step (`opacity-40`, `disabled`)
- Add dot indicator for available-but-not-selected files
- Update `layoutId` to `"global-tab-underline"`

### CSS Additions (globals.css)
```css
.canvas-code-stage-tab[data-available="false"] {
  opacity: 0.35;
  pointer-events: none;
}
```

---

## 3. TOC Ruler-to-Text Morph

**File:** `components/ui/blog/RulerTOC.tsx`

### Architecture Change
Replace dual-view AnimatePresence with unified items using `layoutId`:

```typescript
<LayoutGroup id="ruler-toc">
  {items.map((item) => (
    <motion.button key={item.url} ...>
      {/* THE KEY: morphing content */}
      <motion.div
        layoutId={`toc-item-${item.url}`}
        animate={{
          width: isHovered ? "auto" : getLineWidth(item.depth),
          height: isHovered ? "auto" : 1,
        }}
        transition={springTocMorph}
      >
        {isHovered && <span>{item.title}</span>}
      </motion.div>
    </motion.button>
  ))}
</LayoutGroup>
```

### New Spring Preset
```typescript
export const springTocMorph: Transition = {
  type: "spring",
  visualDuration: 0.25,
  bounce: 0.1,
};
```

### Key Details
- Each ruler line has `layoutId={`toc-item-${item.url}`}`
- Container uses `layout` prop for smooth resize
- Text fades in after container expands (nested AnimatePresence)
- Maintain magnetic hover effect on expanded items

---

## Files to Modify

| File | Changes |
|------|---------|
| `components/blog/BlogWithCanvas.tsx` | Width animation, content wrapper |
| `components/blog/CanvasCodeStage.tsx` | Global files state, tab UI |
| `components/ui/blog/RulerTOC.tsx` | Unified items with layoutId |
| `lib/motion-variants.ts` | 3 new spring presets |
| `app/globals.css` | Disabled tab styling |

---

## Verification

1. **Canvas stretch**: Dev server → navigate to blog post → scroll to canvas zone → verify width expands smoothly, content fades in after
2. **File tabs**: Add multi-step content with shared files → verify all tabs visible, dimmed when not in step
3. **TOC morph**: Hover over ruler → verify lines morph into text, triangle marker animates correctly
4. **Reduced motion**: Enable reduced motion → verify instant state changes
5. **Build**: `pnpm build` passes with no errors

---

## Animation Configuration Reference

| Feature | Spring Preset | Duration | Bounce | Notes |
|---------|--------------|----------|--------|-------|
| Canvas Stretch | `springCanvasStretch` | 0.35s | 0.06 | Width animation |
| Canvas Content | `canvasContentReveal` | 0.2s | - | 0.15s delay |
| File Tabs | `springBouncy` (existing) | 0.4s | 0.3 | Underline slide |
| TOC Morph | `springTocMorph` | 0.25s | 0.1 | Line-to-text |
