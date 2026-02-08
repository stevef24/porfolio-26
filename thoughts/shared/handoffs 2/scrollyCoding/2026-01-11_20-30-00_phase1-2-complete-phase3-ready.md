---
date: 2026-01-11T13:30:00Z
session_name: scrollyCoding
researcher: Claude
git_commit: pending
branch: scrollyCoding
repository: porfolio-26
topic: "Canvas Magic Move - Phase 1-2 Complete, Phase 3 Ready"
tags: [implementation, magic-move, shiki, canvas, code-animation, phase-1, phase-2, phase-3]
status: ready_for_next_phase
last_updated: 2026-01-11
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: Canvas Magic Move - Phase 1-2 Complete

## Task(s)

| Task | Status |
|------|--------|
| Phase 1: Add token compilation types | ✅ Complete |
| Phase 1: Add `compileCodeStepsToTokens()` function | ✅ Complete |
| Phase 1: Support multi-file steps with tokens | ✅ Complete |
| Phase 2: Create `MagicMoveCode` component | ✅ Complete |
| Phase 2: Export from index.ts | ✅ Complete |
| Build verification | ✅ Passes |

## Recent Changes

### Phase 1: Token Compilation Infrastructure

**File: `lib/compile-code-steps.ts`**

Added new types and function alongside existing HTML compilation:

```typescript
// New types (lines 73-117)
interface CompiledTokenFile {
  name: string;
  tokens: KeyedTokensInfo;
  rawCode: string;
  lang: string;
  focusLines?: number[];
}

interface CompiledTokenStep {
  id: string;
  title: string;
  lang: string;
  tokens?: KeyedTokensInfo;      // Single-file mode
  rawCode?: string;
  file?: string;
  focusLines?: number[];
  files?: CompiledTokenFile[];   // Multi-file mode
}

interface TokenCompilationResult {
  steps: CompiledTokenStep[];
  errors: Array<{ stepId: string; message: string }>;
}
```

**New function: `compileCodeStepsToTokens()`** (lines 263-370):
- Uses `codeToKeyedTokens` from `shiki-magic-move/core`
- Dual-theme compilation (vitesse-light/vitesse-dark)
- Cached highlighter singleton for performance
- Handles both single-file and multi-file modes
- Error tracking per step

### Phase 2: MagicMoveCode Component

**File: `components/ui/code/MagicMoveCode.tsx`**

Standalone Magic Move renderer extracted from ScrollyStage:

```typescript
interface MagicMoveCodeProps {
  steps: KeyedTokensInfo[];
  activeIndex: number;
  animate?: boolean;
  options?: MagicMoveOptions;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  className?: string;
}
```

Key features:
- No context dependencies (fully standalone)
- Token key deduplication for React stability
- Memoized for performance
- Reduced motion support via `animate` prop
- Animation callbacks for UI coordination

**File: `components/ui/code/index.ts`**

Exports:
- `MagicMoveCode` component
- `extractTokensFromSteps` utility
- `MAGIC_MOVE_DEFAULTS` constants
- Types: `MagicMoveCodeProps`, `MagicMoveOptions`

## Learnings

### Token vs HTML Compilation

| Aspect | HTML (`compileCodeSteps`) | Tokens (`compileCodeStepsToTokens`) |
|--------|---------------------------|-------------------------------------|
| Output | HTML string | `KeyedTokensInfo` objects |
| Rendering | `dangerouslySetInnerHTML` | `ShikiMagicMoveRenderer` |
| Animation | None | Full morphing transitions |
| Theme switch | CSS-based | CSS-based (same tokens) |

### MagicMoveCode Architecture

The component is deliberately minimal:
1. **Input**: Array of `KeyedTokensInfo` + active index
2. **Processing**: `syncTokenKeys` for morphing, `dedupeTokenKeys` for React
3. **Output**: `ShikiMagicMoveRenderer` with from/to tokens

No knowledge of:
- Step metadata (title, focusLines, filename)
- Context providers
- UI chrome (toolbar, filename badge)

This makes it composable - consumers add their own UI around it.

## Artifacts

### Created This Session

| File | Purpose |
|------|---------|
| `lib/compile-code-steps.ts` | Extended with token compilation |
| `components/ui/code/MagicMoveCode.tsx` | Standalone Magic Move renderer |
| `components/ui/code/index.ts` | Module exports |

### Key Reference Files

| File | Purpose |
|------|---------|
| `components/ui/scrolly/ScrollyStage.tsx` | Original Magic Move implementation |
| `lib/scrolly/compile-steps.ts` | ScrollyCoding token compilation |
| `components/blog/CanvasCodeStage.tsx` | Target for Phase 3 integration |

## Action Items & Next Steps

### Phase 3: Integrate MagicMoveCode into CanvasCodeStage

**Goal**: Replace static HTML rendering with animated Magic Move in CanvasCodeStage.

#### Step 1: Update CanvasCodeStage to use tokens

Current flow (`components/blog/CanvasCodeStage.tsx`):
```typescript
// Server component compiles to HTML
const compiledSteps = await compileCodeSteps(steps);
// Client renders via dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: step.html }} />
```

New flow:
```typescript
// Server component compiles to tokens
const tokenResult = await compileCodeStepsToTokens(steps);
// Client renders via MagicMoveCode
<MagicMoveCode
  steps={tokenResult.steps.map(s => s.tokens)}
  activeIndex={activeStep}
/>
```

#### Step 2: Handle multi-file tabs

CanvasCodeStage supports multi-file steps with tabs. For each file:
- Extract tokens array per file: `step.files.map(f => f.tokens)`
- Active tab determines which file's tokens to show
- MagicMoveCode receives single-file tokens (for active tab)

#### Step 3: Preserve existing features

- [ ] Filename badge display
- [ ] Focus line highlighting (via CSS, same as ScrollyStage)
- [ ] Copy to clipboard
- [ ] Expand/collapse drawer
- [ ] Theme switching (CSS-based, already works)

#### Step 4: Server component changes

In the blog page or CanvasCodeStage server wrapper:
```typescript
// Call token compilation alongside or instead of HTML compilation
import { compileCodeStepsToTokens } from "@/lib/compile-code-steps";

const tokenResult = await compileCodeStepsToTokens(rawSteps);
return <CanvasCodeStageClient compiledTokens={tokenResult} ... />;
```

### Files to Modify in Phase 3

| File | Changes |
|------|---------|
| `components/blog/CanvasCodeStage.tsx` | Replace HTML rendering with MagicMoveCode |
| `components/blog/BlogWithCanvas.tsx` | Pass token compilation result |
| `app/blog/[slug]/page.tsx` | Call `compileCodeStepsToTokens()` |

### Import Patterns for Phase 3

```typescript
// In server component
import { compileCodeStepsToTokens, type TokenCompilationResult } from "@/lib/compile-code-steps";

// In client component
import { MagicMoveCode, extractTokensFromSteps } from "@/components/ui/code";
```

## Build Verification

```bash
pnpm build
# ✓ Compiled successfully
# ✓ 20 static pages generated
# No errors
```

## Other Notes

### CSS for Theme Switching

Both ScrollyStage and MagicMoveCode use the same dual-theme tokens. CSS handles switching:

```css
/* Dark mode: use --shiki-dark variable */
.dark .shiki-magic-move-container span[style*="color:"] {
  color: var(--shiki-dark) !important;
}
```

This CSS should already be in `app/globals.css` from ScrollyCoding work.

### Focus Line Highlighting

ScrollyStage uses CSS-based focus line highlighting (see `FocusLineHighlights` component). This same pattern can be adapted for CanvasCodeStage by:
1. Wrapping MagicMoveCode in a container with `data-focus-lines` attribute
2. Injecting the same CSS styles

### Multi-file Considerations

For multi-file steps, Magic Move should animate within a single file (tab). When switching tabs:
- **Option A**: Animate between files (tokens morph across files)
- **Option B**: Instant switch, animate only within same file

Recommend Option B for clearer UX - tabs represent different files, not code evolution.
