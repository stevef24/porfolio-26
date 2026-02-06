# Canvas Code Tutorial - Phase Plan

## Overview
Transform `canvas-test/page.tsx` from placeholder zones into a real code tutorial mimicking Devouring Details pattern with Magic Move animated code transitions, multi-step zones, and render mode support.

Reference: [Devouring Details - Next.js Dev Tools](https://devouringdetails.com/prototypes/nextjs-dev-tools)

---

## Phase Summary

### Foundation Phases (COMPLETED)

| Phase | Goal | Status |
|-------|------|--------|
| [Phase 1](./phase-1-tutorial-content.md) | Tutorial Content & Compilation | DONE |
| [Phase 2](./phase-2-code-canvas.md) | CodeCanvas Component | DONE |
| [Phase 3](./phase-3-page-integration.md) | Page Integration | DONE |
| [Phase 4](./phase-4-toolbar-actions.md) | Toolbar Actions | DONE |

### Enhancement Phases (PLANNED)

| Phase | Goal | Status |
|-------|------|--------|
| [Phase 5](./phase-5-multi-step-context.md) | Multi-Step Context & CanvasStep | Planned |
| [Phase 6](./phase-6-render-canvas.md) | RenderCanvas Component | Planned |
| [Phase 7](./phase-7-code-drawer.md) | CodeDrawer (Slide-up Panel) | Planned |
| [Phase 8](./phase-8-mobile-fallback.md) | Mobile Fallback | Planned |

---

## Completed Files (Phases 1-4)

| File | Phase | Description |
|------|-------|-------------|
| `content/tutorials/react-basics.steps.tsx` | 1 | Tutorial steps definition |
| `components/ui/scrolly/CodeCanvas.tsx` | 2 | Standalone code canvas |
| `app/canvas-test/page.tsx` | 3 | Test page with 3 zones |

## Planned Files (Phases 5-8)

| File | Phase | Description |
|------|-------|-------------|
| `components/blog/CanvasZoneContext.tsx` | 5 | Step tracking context |
| `components/blog/CanvasStep.tsx` | 5 | Scroll-triggered step wrapper |
| `components/blog/RenderCanvas.tsx` | 6 | Live component display |
| `components/blog/CodeDrawer.tsx` | 7 | Slide-up code panel |

---

## Reference Files

- `components/ui/scrolly/ScrollyStage.tsx` - Magic Move pattern
- `components/ui/scrolly/StageControls.tsx` - Toolbar styling
- `components/ui/scrolly/StageFullscreen.tsx` - Modal component
- `lib/scrolly/compile-steps.ts` - Server compilation
- `components/ui/scrolly/ScrollyStep.tsx` - Scroll-triggered step pattern

---

## Enhancement Features

### Multi-Step Within Zones
- Multiple steps within a single CanvasZone
- Scroll-triggered step progression (like Devouring Details)
- Visual hierarchy: active step 100% opacity, others 50%

### Canvas Modes
1. **Code mode** (`type="code"`): Magic Move animated code
2. **Render mode** (`type="render"`): Live pre-built React component

### Code Drawer
- Slides up from bottom of canvas when viewing rendered component
- Shows syntax-highlighted source code
- Copy button for easy code copying

### New API
```tsx
<CanvasZone
  id="tutorial"
  type="code"  // or "render"
  compiledSteps={compiled}
  steps={codeSteps}
  renderComponent={<Demo />}
  renderCode={sourceCode}
>
  <CanvasStep index={0}>
    <p>First paragraph triggers step 0...</p>
  </CanvasStep>
  <CanvasStep index={1}>
    <p>Second paragraph triggers step 1...</p>
  </CanvasStep>
</CanvasZone>
```

---

## Bug Fix Required

**Motion Error** in `components/ui/layout-bottombar-collapse-icon.tsx`:
- Line 23 animates `.bottombar` selector but element missing that class
- Fix: Add `className="bottombar"` to the bottom bar path element
