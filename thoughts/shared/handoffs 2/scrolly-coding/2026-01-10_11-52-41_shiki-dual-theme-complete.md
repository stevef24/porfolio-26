---
date: 2026-01-10T04:52:41Z
session_name: scrolly-coding
researcher: Claude
git_commit: 3da7397
branch: scrollyCoding
repository: porfolio-26
topic: "Shiki Dual Theme Compilation Implementation"
tags: [shiki, magic-move, theme-switching, css-variables, scrolly-coding]
status: complete
last_updated: 2026-01-10
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: Shiki Dual Theme Fix Complete

## Task(s)

| Task | Status |
|------|--------|
| Implement Shiki dual-theme compilation | Completed |
| Add CSS for instant theme switching | Completed |
| Simplify React components (remove theme logic) | Completed |
| Update type definitions | Completed |
| Run code-simplifier cleanup | Completed |
| Create commit | Completed |

**Implementation Plan:** `/Users/stavfernandes/.claude/plans/spicy-seeking-lark.md`

## Critical References

1. **Implementation Plan:** `/Users/stavfernandes/.claude/plans/spicy-seeking-lark.md`
2. **Continuity Ledger:** `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

## Recent Changes

- `lib/scrolly/compile-steps.ts:96-119` - Changed `compileStep()` to use `themes` option instead of single theme
- `lib/scrolly/compile-steps.ts:167-191` - Simplified `compileScrollySteps()` to compile once with dual-theme
- `lib/scrolly/utils.ts:17-38` - Simplified `CompilationResult` type to single `steps` array
- `lib/scrolly/utils.ts` - Removed deprecated `getTokensForTheme()` function
- `app/globals.css:913-922` - Added CSS rules for `.dark` class to use `--shiki-dark` variable
- `components/ui/scrolly/ScrollyStage.tsx:12,18,56-68` - Removed `useTheme()`, simplified token extraction
- `components/ui/scrolly/ScrollyStageMobile.tsx:12,49-66` - Removed `useTheme()`, simplified token extraction
- `components/ui/scrolly/CodeDrawer.tsx:29,82-83,150-154` - Removed `useTheme()`, simplified token extraction

## Learnings

### Shiki Dual Theme API
Shiki's `codeToKeyedTokens` supports a `themes` option that embeds both colors in each token:
```typescript
codeToKeyedTokens(highlighter, code, {
  lang: 'typescript',
  themes: { light: 'vitesse-light', dark: 'vitesse-dark' }
});
// Output: { color: "#AB5959", "--shiki-dark": "#CB7676" }
```

### CSS Variable Switching
The `--shiki-dark` CSS variable is automatically set on each token span. Theme switching via:
```css
.dark .scrolly-stage-code span[style*="color:"] {
  color: var(--shiki-dark) !important;
}
```

### Magic Move Animation Trigger
Magic Move animates when the token set changes. Previously, swapping between `stepsLight` and `stepsDark` on theme change triggered animations. With dual-theme, the same tokens are used - only CSS changes.

## Post-Mortem

### What Worked
- Context7 MCP for Shiki documentation lookup
- Direct testing of Shiki API to confirm dual-theme support
- Incremental approach: compile pipeline → CSS → components → types
- Code-simplifier agent for cleanup pass

### What Failed
- Tried: CSS `!important` overrides for backgrounds → Partially worked but didn't address token color transitions
- Tried: Theme transition detection with `isThemeTransitioning` state → Too complex
- Error: Initial assumption that only background was transitioning → Actually token colors also transition

### Key Decisions
- **Decision:** Use Shiki's native dual-theme feature instead of compiling twice
  - Alternatives: (1) CSS-only overrides, (2) Remove Magic Move entirely
  - Reason: Native dual-theme is cleaner, better performance, maintains all animations

- **Decision:** Remove `getTokensForTheme()` entirely rather than deprecating
  - Alternatives: Keep as deprecated wrapper
  - Reason: Cleaner codebase, function no longer serves purpose

## Artifacts

- Implementation plan: `/Users/stavfernandes/.claude/plans/spicy-seeking-lark.md`
- Continuity ledger: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`
- Commit: `3da7397` - feat(scrolly): instant theme switching via Shiki dual-theme compilation

## Action Items & Next Steps

1. **Manual Testing** - Test theme switching on `/blog/scrolly-demo` to verify instant switch
2. **Mobile Testing** - Test on mobile viewport for drawer and inline code
3. **Push to Remote** - Branch is 21 commits ahead of origin

## Other Notes

### Key Files
| File | Purpose |
|------|---------|
| `lib/scrolly/compile-steps.ts` | Server-side Shiki compilation (now dual-theme) |
| `lib/scrolly/utils.ts` | Type definitions, helper functions |
| `components/ui/scrolly/ScrollyStage.tsx` | Desktop Magic Move renderer |
| `components/ui/scrolly/ScrollyStageMobile.tsx` | Mobile static token renderer |
| `components/ui/scrolly/CodeDrawer.tsx` | Mobile slide-up drawer |
| `app/globals.css:908-922` | Scrolly stage CSS with theme switching |

### Shiki Magic Move Package
- Version: 1.2.1
- Key exports: `ShikiMagicMovePrecompiled`, `codeToKeyedTokens`
- CSS variables from dual-theme: `color` (light), `--shiki-dark` (dark)
