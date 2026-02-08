---
date: 2026-01-10T04:22:41Z
session_name: scrolly-coding
researcher: Claude
git_commit: b39eee8
branch: scrollyCoding
repository: porfolio-26
topic: "Shiki Magic Move Dual Theme Enhancement"
tags: [shiki, magic-move, theme-switching, css-variables, scrolly-coding]
status: planned
last_updated: 2026-01-10
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: Shiki Magic Move Dual Theme Fix

## Task(s)

| Task | Status |
|------|--------|
| Research Shiki/Magic Move documentation | Completed |
| Identify root cause of theme transition bug | Completed |
| Design dual-theme solution | Completed |
| Create implementation plan | Completed |
| Implement Phase 1: Update compilation pipeline | Planned |
| Implement Phase 2: Add CSS for theme switching | Planned |
| Implement Phase 3: Simplify React components | Planned |
| Implement Phase 4: Update type definitions | Planned |

**Current Phase:** Ready to implement (plan approved)

## Critical References

1. **Implementation Plan:** `/Users/stavfernandes/.claude/plans/spicy-seeking-lark.md`
2. **Continuity Ledger:** `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

## Problem Summary

When switching themes (light/dark), the Shiki Magic Move code background animates/transitions instead of switching instantly. Root cause:

1. Current approach compiles **two separate token sets** (stepsLight, stepsDark)
2. On theme change, React swaps the entire token set
3. Magic Move interprets this as a code change and animates the transition

## Solution: Shiki Dual Theme Compilation

**Key Discovery:** Shiki's `codeToKeyedTokens` supports a `themes` option that embeds both colors in each token:

```typescript
// Each token contains both colors:
{
  "color": "#AB5959",           // Light theme (default)
  "--shiki-dark": "#CB7676"     // Dark theme (CSS variable)
}
```

**Approach:**
1. Compile tokens **once** with both themes embedded
2. Use CSS `.dark` class to switch colors instantly
3. Remove theme-swapping logic from React components

## Recent Changes

- `app/globals.css:889-911` - Added code background styling with rounded corners and `transition: none`
- `app/globals.css:908-910` - Added `.shiki-magic-move-container-restyle` transition override (partial fix, user wanted different approach)
- Reverted `components/ui/scrolly/ScrollyStage.tsx` theme detection changes

## Learnings

### Shiki Magic Move CSS Structure
The library's default CSS at `node_modules/shiki-magic-move/dist/style.css` has:
```css
.shiki-magic-move-container-restyle {
  transition: all var(--smm-duration,.5s) var(--smm-easing,"ease");
}
```
This `transition: all` is what causes background/color animations during theme switch.

### Shiki Dual Theme API
Tested and confirmed that `codeToTokens` with `themes` option works:
```typescript
highlighter.codeToTokens('const x = 1', {
  lang: 'javascript',
  themes: { light: 'vitesse-light', dark: 'vitesse-dark' }
});
// Output includes: { "color": "#AB5959", "--shiki-dark": "#CB7676" }
```

### Current Compilation Location
- Server-side compilation: `lib/scrolly/compile-steps.ts`
- Uses `codeToKeyedTokens` from `shiki-magic-move/core`
- Currently compiles twice (once per theme) in parallel

## Post-Mortem

### What Worked
- Context7 MCP for Shiki documentation lookup
- Direct testing of Shiki API via Node.js to confirm dual-theme support
- Exploring `node_modules/shiki-magic-move/dist/style.css` to understand transition behavior

### What Failed
- Tried: CSS `!important` overrides for backgrounds → Partially worked but didn't address token color transitions
- Tried: Theme transition detection with `isThemeTransitioning` state → Too complex, user preferred simpler approach
- Error: Initial assumption that only background was transitioning → Actually token colors also transition

### Key Decisions
- **Decision:** Use Shiki's native dual-theme feature instead of compiling twice
  - Alternatives considered: (1) CSS-only overrides, (2) Remove Magic Move entirely
  - Reason: Native dual-theme is cleaner, better performance, maintains all animations

- **Decision:** Keep Magic Move (Option 1) before considering removal (Option 2)
  - Alternatives: Remove Magic Move for simpler static code blocks
  - Reason: Animated step transitions are core feature of ScrollyCoding

## Artifacts

- Implementation plan: `/Users/stavfernandes/.claude/plans/spicy-seeking-lark.md`
- Continuity ledger: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

## Action Items & Next Steps

### Phase 1: Update Compilation Pipeline
**File:** `lib/scrolly/compile-steps.ts`
1. Modify `compileScrollySteps()` to use dual-theme compilation:
   ```typescript
   const tokensInfo = codeToKeyedTokens(highlighter, code, {
     lang: step.lang,
     themes: { light: themes.light, dark: themes.dark },
   }, lineNumbers);
   ```
2. Remove separate light/dark compilation loops
3. Update return type to single `steps` array

### Phase 2: Update CSS
**File:** `app/globals.css`
Add CSS variable switching:
```css
.dark .scrolly-stage-code .shiki-magic-move-item {
  color: var(--shiki-dark) !important;
}
```

### Phase 3: Simplify React Components
**Files:**
- `components/ui/scrolly/ScrollyStage.tsx`
- `components/ui/scrolly/ScrollyStageMobile.tsx`

Remove:
- `getTokensForTheme()` calls
- `stepsLight`/`stepsDark` selection logic
- Theme-based hydration workarounds

### Phase 4: Update Types
**File:** `lib/scrolly/utils.ts`
Simplify `CompilationResult`:
```typescript
export type CompilationResult = {
  steps: KeyedTokensInfo[];  // Single set with dual-theme tokens
  errors: CompilationError[];
};
```

### Verification
1. Run `pnpm build`
2. Test on `/blog/scrolly-demo` - toggle theme, verify instant switch
3. Verify step animations still work
4. Test mobile view

### Fallback
If Option 1 fails, proceed to Option 2: Remove Magic Move entirely for static code blocks.

## Other Notes

### Key Files
| File | Purpose |
|------|---------|
| `lib/scrolly/compile-steps.ts` | Server-side Shiki compilation |
| `lib/scrolly/utils.ts` | Type definitions, `getTokensForTheme()` |
| `components/ui/scrolly/ScrollyStage.tsx` | Desktop Magic Move renderer |
| `components/ui/scrolly/ScrollyStageMobile.tsx` | Mobile static token renderer |
| `app/globals.css:888-977` | Scrolly stage CSS styling |

### Shiki Magic Move Package
- Version: 1.2.1
- React exports: `ShikiMagicMove`, `ShikiMagicMovePrecompiled`, `ShikiMagicMoveRenderer`
- Core exports: `codeToKeyedTokens`, `syncTokenKeys`, `toKeyedTokens`

### CSS Variables from Shiki Dual Theme
When using `themes` option:
- `color` - Light theme color (default)
- `--shiki-dark` - Dark theme color
- `background-color` - Light background
- `--shiki-dark-bg` - Dark background
