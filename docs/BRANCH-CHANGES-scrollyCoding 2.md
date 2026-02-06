# Branch Changes: scrollyCoding

**Branch**: `scrollyCoding`
**Base**: `main`
**Last Updated**: 2026-01-11
**Status**: Ready for visual testing, canvas redesign pending

---

## Overview

This branch implements an interactive code walkthrough system for blog posts using a scroll-triggered canvas sidebar. The primary use case is the Claude Agent SDK tutorial at `/blog/agent-sdk-deep-research`.

---

## Key Features Implemented

### 1. BlogWithCanvas Layout System
**File**: `components/blog/BlogWithCanvas.tsx`

- Two-column layout with Motion.js animations
- Blog content shifts left when canvas activates
- Fixed-position canvas slides in from right
- IntersectionObserver-based zone detection
- Supports multiple zones with gap sentinels

### 2. CanvasZone Component
**File**: `components/blog/CanvasZone.tsx`

- Scroll-triggered canvas activation
- Stepped mode for code walkthroughs
- Mobile inline rendering (canvas hidden on mobile)
- Configurable deactivation delay

### 3. CanvasCodeStage Component
**File**: `components/blog/CanvasCodeStage.tsx` (616 lines)

Features:
- **Shiki Syntax Highlighting**: Dual-theme (light/dark) via CSS variables
- **Multi-File Tab Support**: Switch between files within a step
- **Fullscreen Mode**: Portal-based overlay with escape key
- **Copy to Clipboard**: One-click code copying
- **Focus Line Highlighting**: Highlight specific lines per step

### 4. Server-Side Shiki Compilation
**Files**:
- `lib/shiki.ts` - Shiki highlighter with dual-theme configuration
- `lib/compile-code-steps.ts` - Compiles code steps at build time
- `components/blog/AgentCodeWalkthroughServer.tsx` - Server wrapper

---

## File Changes Summary

### New Files Created

```
components/blog/
├── BlogWithCanvas.tsx       # Layout orchestrator
├── CanvasZone.tsx           # Scroll-triggered zones
├── CanvasStep.tsx           # Step wrapper for MDX
├── CanvasCodeStage.tsx      # Code display with tabs/fullscreen
├── AgentCodeWalkthrough.tsx # Client component
└── AgentCodeWalkthroughServer.tsx # Server component (Shiki)

lib/
├── shiki.ts                 # Shiki dual-theme highlighter
└── compile-code-steps.ts    # Server-side step compilation

content/blog/
├── agent-sdk-deep-research.mdx       # Main blog post
└── agent-sdk-deep-research.steps.tsx # 8 code steps
```

### Modified Files

```
lib/custom-components.tsx    # Added canvas components to MDX
app/globals.css              # Canvas CSS (~150 lines added)
```

### Deleted Files

```
components/ui/scrolly/*      # Old ScrollyCoding system (replaced)
lib/scrolly/*                # Old ScrollyCoding utilities
content/blog/projected-drag.*
content/blog/scrolly-demo.*
content/blog/example-scrolly.*
components/demos/AgentArchitectureDemo.tsx
components/demos/AgentArchitectureDiagram.tsx
```

---

## CSS Changes

### New CSS Classes

| Class | Purpose |
|-------|---------|
| `.canvas-code-stage` | Main canvas container |
| `.code-content` | Shiki HTML wrapper |
| `.line[data-focus="true"]` | Focus line highlighting |
| `.has-focus .line:not([data-focus])` | Dim unfocused lines |

### CSS Variables Added

```css
--canvas-bg
--canvas-border
--canvas-toolbar-bg
--canvas-toolbar-icon
--canvas-toolbar-icon-hover
--shiki-dark  /* For theme switching */
```

### Theme Switching Pattern

```css
/* Dark mode: instant switch via CSS variables */
.dark .code-content span[style*="color:"] {
  color: var(--shiki-dark) !important;
}
```

---

## Type Interfaces

### CodeStep (Raw)
```typescript
interface CodeStep {
  id: string;
  title: string;
  code?: string;           // Single-file mode
  lang: string;
  file?: string;           // Single-file name
  focusLines?: number[];
  files?: CodeFile[];      // Multi-file mode
}

interface CodeFile {
  name: string;
  code: string;
  lang?: string;
  focusLines?: number[];
}
```

### CompiledCodeStep (After Shiki)
```typescript
interface CompiledCodeStep {
  id: string;
  title: string;
  lang: string;
  html?: string;           // Compiled HTML
  rawCode?: string;        // For clipboard
  file?: string;
  focusLines?: number[];
  files?: CompiledCodeFile[];
}
```

---

## Component Hierarchy

```
BlogWithCanvas
  └─ CanvasZone (mode="stepped")
       └─ AgentCodeWalkthrough (MDX wrapper)
            └─ AgentCodeWalkthroughServer (Shiki compilation)
                 └─ CanvasCodeStage (UI with tabs/fullscreen)
```

---

## MDX Usage Example

```mdx
import { deepResearchSteps } from "./agent-sdk-deep-research.steps";

<BlogWithCanvas>

## Building the Agent

<AgentCodeWalkthrough steps={deepResearchSteps}>

<CanvasStep index={0}>
### Step 1: Your First Agent Query
Content explaining the code...
</CanvasStep>

<CanvasStep index={1}>
### Step 2: Configuring Agent Behavior
More content...
</CanvasStep>

</AgentCodeWalkthrough>

<CanvasGap>
Content between zones (canvas closes)
</CanvasGap>

<CanvasEnd />

</BlogWithCanvas>
```

---

## Recent Commits

| Commit | Description |
|--------|-------------|
| `d90cd9a` | Canvas zone stepped mode and scrolly drawer system |
| `3da7397` | Instant theme switching via Shiki dual-theme compilation |
| `b39eee8` | Improve entry/exit timing and fix gap sentinel bug |
| `81e3b3a` | Unify modal overlays with system colors |
| `5177980` | Oatmeal design system migration |

---

## Known Issues / TODO

1. **Canvas Visual Design**: User requested redesign - current styling "doesn't feel right"
2. **Visual Testing Needed**: Verify Shiki highlighting, tabs, and fullscreen in browser
3. **Multi-File Example**: Current steps are single-file; add multi-file step to test tabs

---

## Testing

```bash
# Build verification
pnpm build

# Visual testing
pnpm dev
# Navigate to: http://localhost:3000/blog/agent-sdk-deep-research
```

---

## Dependencies

No new npm dependencies added. Uses existing:
- `shiki` (already in project via Fumadocs)
- `motion/react` (Framer Motion v12)
- `react-dom` (for createPortal)
