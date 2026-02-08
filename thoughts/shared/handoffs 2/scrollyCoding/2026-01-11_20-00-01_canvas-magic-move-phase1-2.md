---
date: 2026-01-11T13:00:01Z
session_name: scrollyCoding
researcher: Claude
git_commit: d90cd9a
branch: scrollyCoding
repository: porfolio-26
topic: "Canvas Code Stage UI Overhaul - Phase 1-2 Token Infrastructure"
tags: [implementation, magic-move, shiki, canvas, code-animation]
status: planned
last_updated: 2026-01-11
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: Canvas Code Stage Magic Move Integration - Phase 1-2

## Task(s)

| Task | Status |
|------|--------|
| Analyze current CanvasCodeStage vs ScrollyCoding | Completed |
| Design comprehensive 8-phase UI overhaul plan | Completed |
| **Phase 1: Token Compilation Infrastructure** | Planned |
| **Phase 2: Magic Move Renderer Extraction** | Planned |
| Phase 3-8: Integration, tabs, fullscreen, mobile, keyboard, polish | Planned (future) |

**Working from plan document:** `.claude/plans/polished-rolling-wave.md`

## Critical References

1. **Plan document**: `.claude/plans/polished-rolling-wave.md` - Full 8-phase implementation plan
2. **ScrollyStage Magic Move pattern**: `components/ui/scrolly/ScrollyStage.tsx:65-101` - Working Magic Move implementation to extract
3. **Token compilation reference**: `lib/scrolly/compile-steps.ts` - Dual-theme `codeToKeyedTokens` pattern

## Root Cause Analysis

**Why Magic Move doesn't work in CanvasCodeStage:**

The blog uses `CanvasCodeStage` (`components/blog/CanvasCodeStage.tsx`) which renders **pre-compiled HTML** via `dangerouslySetInnerHTML`. This is fundamentally incompatible with Magic Move, which requires:

1. `KeyedTokensInfo` tokens (not HTML strings)
2. `ShikiMagicMoveRenderer` component
3. `syncTokenKeys()` to compute token animations between steps

The working `ScrollyCoding` system (`components/ui/scrolly/`) has all this, but CanvasCodeStage was built separately with static HTML rendering.

## Learnings

### Two Separate Code Display Systems

| System | Location | Animation | Used For |
|--------|----------|-----------|----------|
| ScrollyCoding | `components/ui/scrolly/` | Magic Move | Scrolly demo posts |
| CanvasCodeStage | `components/blog/` | None (static HTML) | Agent SDK blog |

### Magic Move Token Flow (from ScrollyStage)

```
Server: codeToKeyedTokens() with dual-theme → KeyedTokensInfo[]
                ↓
Client: syncTokenKeys(previous, current) → { from, to }
                ↓
Render: ShikiMagicMoveRenderer(tokens, previous, options)
                ↓
Output: Animated token positions over 800ms
```

### CanvasCodeStage Current Flow (broken)

```
Server: codeToHtml() → HTML string
                ↓
Client: dangerouslySetInnerHTML={{ __html: html }}
                ↓
Output: Static code, no animation
```

### Key Files Understanding

- `lib/compile-code-steps.ts:37-74` - Uses `codeToHtml`, needs token alternative
- `lib/shiki.ts:16-42` - Highlighter initialization, theme configuration
- `components/blog/CanvasCodeStage.tsx:134-136` - Static HTML rendering
- `components/ui/scrolly/ScrollyStage.tsx:65-101` - Working Magic Move wrapper

## Post-Mortem

### What Worked
- **Parallel exploration agents**: Launched 3 agents to explore different aspects simultaneously - got comprehensive codebase understanding quickly
- **User clarification questions**: Using AskUserQuestion tool upfront clarified requirements (Magic Move, no width control, mobile snippet-only)
- **Tracing the actual component**: Found the real issue by tracing which component the blog actually uses (CanvasCodeStage, not ScrollyCoding)

### What Failed
- Initial assumption that "Magic Move doesn't work" was a bug - it was actually a different component entirely
- The two systems (ScrollyCoding vs CanvasCodeStage) were built independently with different architectures

### Key Decisions
- **Decision**: Hybrid refactor approach (extract and adapt)
  - Alternatives considered: Full reuse of ScrollyStage, complete rewrite
  - Reason: ScrollyStage is coupled to ScrollyContext, but its Magic Move logic is sound. Extract the renderer into a standalone component.

- **Decision**: Token compilation mode alongside HTML mode
  - Alternatives: Replace HTML mode entirely
  - Reason: Other consumers might still use HTML mode; additive change is safer

## Artifacts

### Created
- `.claude/plans/polished-rolling-wave.md` - Full 8-phase implementation plan

### To Create (Phase 1-2)
- `components/ui/code/MagicMoveCode.tsx` - Standalone Magic Move renderer
- `lib/compile-code-steps.ts` - Add `compileCodeStepsToTokens()` function

### To Modify (Phase 1-2)
- `lib/shiki.ts` - Export token utilities

## Action Items & Next Steps

### Phase 1: Token Compilation Infrastructure

1. **Read existing compilation code**:
   - `lib/compile-code-steps.ts` - Understand current HTML compilation
   - `lib/scrolly/compile-steps.ts` - Reference for token compilation

2. **Add token compilation function**:
   ```typescript
   // lib/compile-code-steps.ts
   export async function compileCodeStepsToTokens(
     steps: CodeStep[]
   ): Promise<CompiledTokenStep[]>
   ```

3. **Support multi-file mode**:
   - Each file in a step gets its own `KeyedTokensInfo`
   - Structure: `{ id, files: [{ name, tokens, focusLines }] }`

### Phase 2: Magic Move Renderer Extraction

1. **Extract from ScrollyStage**:
   - Copy `ScrollyMagicMovePrecompiled` component (`ScrollyStage.tsx:65-101`)
   - Remove `useScrollyContext` dependency
   - Accept `activeIndex`, `steps` as props

2. **Create standalone component**:
   - File: `components/ui/code/MagicMoveCode.tsx`
   - Props: `steps: KeyedTokensInfo[]`, `activeIndex: number`, `options?`
   - Expose `onStart`, `onEnd` callbacks for animation state

3. **Test with existing tokens**:
   - Import in a test page
   - Verify animation works standalone

### Verification

```bash
# After Phase 1-2
pnpm build  # Must pass
# Manually test MagicMoveCode component in isolation
```

## Other Notes

### Related Files for Context

- `components/blog/BlogWithCanvas.tsx` - Layout orchestrator (50/50 split animation)
- `components/blog/CanvasZone.tsx` - Zone detection for canvas activation
- `components/blog/CanvasZoneContext.tsx` - Step state management
- `content/blog/agent-sdk-deep-research.steps.tsx` - Example step definitions

### User Requirements Summary

| Requirement | Solution Phase |
|-------------|---------------|
| Magic Move animations | Phase 1-3 |
| Better tabs | Phase 4 |
| Layout animation fullscreen | Phase 5 |
| Mobile: focused lines only | Phase 6 |
| Basic keyboard nav (arrows) | Phase 7 |
| Visual polish | Phase 8 |

### Not Needed (confirmed by user)

- Width control (keep fixed 50/50)
- Code annotations (explanation is on left side)
- Advanced keyboard nav (vim-style)
