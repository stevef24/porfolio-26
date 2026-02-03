---
date: 2026-01-11T13:05:41Z
session_name: scrollyCoding
researcher: Claude
git_commit: d90cd9a
branch: scrollyCoding
repository: porfolio-26
topic: "Canvas Code Stage UI Overhaul - Phase 1-2 Implementation Started"
tags: [implementation, magic-move, shiki, canvas, code-animation, phase-1, phase-2]
status: in_progress
last_updated: 2026-01-11
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: Canvas Magic Move Phase 1-2 - Implementation Started

## Task(s)

| Task | Status |
|------|--------|
| Phase 1: Read existing token compilation patterns | In Progress |
| Phase 1: Add `compileCodeStepsToTokens()` function | Pending |
| Phase 1: Support multi-file steps with tokens per file | Pending |
| Phase 2: Extract Magic Move renderer from ScrollyStage | Pending |
| Phase 2: Create standalone `MagicMoveCode` component | Pending |
| Phase 2: Test Magic Move component in isolation | Pending |

**Working from plan:** `.claude/plans/polished-rolling-wave.md`

## Critical References

1. **Implementation Plan**: `.claude/plans/polished-rolling-wave.md` - Full 8-phase plan
2. **Token compilation pattern**: `lib/scrolly/compile-steps.ts:95-118` - `compileStep()` with `codeToKeyedTokens`
3. **HTML compilation (to extend)**: `lib/compile-code-steps.ts:80-134` - Current `compileCodeSteps()`

## Recent Changes

No code changes yet - just read existing files to understand patterns.

## Learnings

### Two Compilation Systems Exist

| File | Purpose | Output |
|------|---------|--------|
| `lib/compile-code-steps.ts` | Canvas code steps | HTML string |
| `lib/scrolly/compile-steps.ts` | ScrollyCoding steps | `KeyedTokensInfo` tokens |

### Key Patterns from ScrollyCoding

**Token compilation** (`lib/scrolly/compile-steps.ts:104-110`):
```typescript
const tokens = codeToKeyedTokens(highlighter, step.code, {
  lang: step.lang as BundledLanguage,
  themes: {
    light: themes.light as BundledTheme,
    dark: themes.dark as BundledTheme,
  },
}, lineNumbers);
```

**Highlighter caching** (`lib/scrolly/compile-steps.ts:46-84`):
- Uses per-process singleton `highlighterPromise`
- Loads default languages upfront
- Can lazy-load additional languages on demand

### CanvasCodeStage Current Architecture

- `lib/compile-code-steps.ts` compiles to HTML via `codeToHtml()`
- `lib/shiki.ts:30-49` handles HTML generation with dual themes
- `CanvasCodeStage` uses `dangerouslySetInnerHTML` - no animation possible

### What Needs to Change for Phase 1

1. Add `compileCodeStepsToTokens()` to `lib/compile-code-steps.ts`
2. Import `codeToKeyedTokens` from `shiki-magic-move/core`
3. Create parallel types: `CompiledTokenStep`, `CompiledTokenFile`
4. Support both single-file and multi-file modes

## Post-Mortem

### What Worked
- **Parallel exploration**: Used 3 Explore agents to quickly understand ScrollyCoding, Magic Move, and Mobile patterns
- **User clarification**: AskUserQuestion tool resolved key decisions (Magic Move, no width control, mobile snippet-only)
- **Tracing the real component**: Found that blog uses `CanvasCodeStage` not `ScrollyCoding`

### What Failed
- Initial assumption that Magic Move was "broken" - it was a completely different component
- The two systems (ScrollyCoding vs CanvasCodeStage) exist independently with different architectures

### Key Decisions
- **Decision**: Hybrid refactor - extract Magic Move from ScrollyStage into reusable component
  - Alternatives: Full reuse (too coupled), complete rewrite (too much work)
  - Reason: Reuses proven Magic Move logic while preserving CanvasCodeStage's multi-file tabs

- **Decision**: Add token compilation alongside HTML (not replace)
  - Alternatives: Replace HTML compilation entirely
  - Reason: Other consumers may use HTML mode; additive is safer

## Artifacts

### Created This Session
- `.claude/plans/polished-rolling-wave.md` - 8-phase implementation plan
- `thoughts/shared/handoffs/scrollyCoding/2026-01-11_20-00-01_canvas-magic-move-phase1-2.md` - Previous handoff

### To Create (Phase 1-2)
- `components/ui/code/MagicMoveCode.tsx` - Standalone Magic Move renderer (Phase 2)
- Types in `lib/compile-code-steps.ts` - Token compilation types (Phase 1)

### Files Read (Context Gathered)
- `lib/compile-code-steps.ts` - Current HTML compilation (144 lines)
- `lib/scrolly/compile-steps.ts` - Token compilation pattern (193 lines)
- `lib/shiki.ts` - Shiki highlighter setup (74 lines)
- `components/blog/CanvasCodeStage.tsx` - Static HTML rendering (556 lines)
- `components/blog/BlogWithCanvas.tsx` - Layout orchestrator (615 lines)
- `components/ui/scrolly/ScrollyStage.tsx` - Working Magic Move (469 lines)

## Action Items & Next Steps

### Phase 1: Token Compilation Infrastructure

1. **Add types to `lib/compile-code-steps.ts`**:
   ```typescript
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
     tokens?: KeyedTokensInfo;  // Single-file mode
     rawCode?: string;
     file?: string;
     focusLines?: number[];
     files?: CompiledTokenFile[];  // Multi-file mode
   }
   ```

2. **Add `compileCodeStepsToTokens()` function**:
   - Use `codeToKeyedTokens` from `shiki-magic-move/core`
   - Follow pattern from `lib/scrolly/compile-steps.ts:95-118`
   - Support dual-theme compilation
   - Handle both single-file and multi-file modes

3. **Add highlighter caching**:
   - Copy pattern from `lib/scrolly/compile-steps.ts:46-84`
   - Or import shared highlighter from scrolly module

### Phase 2: Magic Move Renderer Extraction

1. **Extract `ScrollyMagicMovePrecompiled`** from `ScrollyStage.tsx:65-101`:
   - Remove `useScrollyContext` dependency
   - Accept `steps`, `activeIndex`, `options` as props
   - Keep `syncTokenKeys`, `dedupeTokenKeys` logic

2. **Create `components/ui/code/MagicMoveCode.tsx`**:
   - Standalone component
   - Props: `steps: KeyedTokensInfo[]`, `activeIndex: number`
   - Optional: `onStart`, `onEnd` animation callbacks
   - Optional: `options` for duration/stagger

3. **Test in isolation** before integrating with CanvasCodeStage

## Other Notes

### Files to Reference During Implementation

| Purpose | File | Lines |
|---------|------|-------|
| Token compilation | `lib/scrolly/compile-steps.ts` | 95-118 |
| Magic Move wrapper | `components/ui/scrolly/ScrollyStage.tsx` | 65-101 |
| HTML compilation (extend) | `lib/compile-code-steps.ts` | 80-134 |
| Highlighter setup | `lib/shiki.ts` | 24-52 |
| Type exports | `lib/scrolly/utils.ts` | Full file |

### Import Patterns

```typescript
// For token compilation
import { codeToKeyedTokens, type KeyedTokensInfo } from "shiki-magic-move/core";
import { createHighlighter, type BundledLanguage, type BundledTheme } from "shiki";

// For Magic Move rendering
import { ShikiMagicMoveRenderer } from "shiki-magic-move/react";
import { syncTokenKeys, toKeyedTokens } from "shiki-magic-move/core";
```

### Build Verification
After Phase 1-2: `pnpm build` must pass with no errors.
