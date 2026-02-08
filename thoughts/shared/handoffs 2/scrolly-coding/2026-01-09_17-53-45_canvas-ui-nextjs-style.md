---
date: 2026-01-09T17:53:45+07:00
session_name: scrolly-coding
researcher: Claude
git_commit: b39eee8
branch: scrollyCoding
repository: porfolio-26
topic: "Canvas UI Redesign - Next.js DevTools Style"
tags: [ui-design, canvas, scrolly-stage, next-js-devtools]
status: complete
last_updated: 2026-01-09
last_updated_by: Claude
type: implementation_strategy
---

# Handoff: Canvas UI Redesign to Match Next.js DevTools

## Task(s)
1. **Remove global reading highlight** - COMPLETED
   - Removed `ReadingParagraph` override from `lib/custom-components.tsx`
   - Removed `ReadingProseWrapper` from blog pages
   - Reading highlight now only available inside CanvasZone (opt-in)

2. **Make RenderCanvas transitions instant** - COMPLETED
   - Removed AnimatePresence and motion animations from RenderCanvas
   - Step transitions are now instant with no fade

3. **Fix GradualBlur footer overlay** - COMPLETED
   - Fixed inverted easing formula that kept blur visible at bottom
   - Now properly fades out as user scrolls to footer

4. **Canvas UI Redesign (Next.js DevTools Style)** - COMPLETED
   - Removed filename badge from top-right
   - Redesigned StageControls as floating pill toolbar
   - Added filename as tab at bottom
   - Centered toolbar at top (like Next.js DevTools)
   - Fixed theme flash by removing conflicting wrapper background

## Critical References
- `components/ui/scrolly/ScrollyStage.tsx` - Main canvas component
- `components/ui/scrolly/StageControls.tsx` - Floating pill toolbar
- `components/blog/BlogWithCanvas.tsx` - Canvas sidebar wrapper

## Recent changes
- `lib/custom-components.tsx:24-26` - Removed ReadingParagraph import and p override
- `app/blog/[slug]/page.tsx:70-73` - Replaced ReadingProseWrapper with plain div
- `components/blog/RenderCanvas.tsx:1-71` - Simplified to instant transitions (no animation)
- `components/ui/blog/GradualBlur.tsx:39-49` - Fixed easing formula for proper fade-out
- `components/ui/scrolly/StageControls.tsx:40-215` - Redesigned as floating pill
- `components/ui/scrolly/ScrollyStage.tsx:236-314` - New canvas structure with tab bar
- `components/blog/BlogWithCanvas.tsx:569-576` - Removed conflicting bg-background wrapper

## Learnings
1. **Theme flash cause**: Nested background layers cause flash - BlogWithCanvas had `bg-background/80` wrapper that briefly showed before ScrollyStage's background applied. Removing wrapper background fixes flash.

2. **Easing formula inversion**: The GradualBlur had inverted easing - was calculating `1 - easedFade` when it should have been using eased value directly. Proper formula: `eased = 1 - (1 - clamped) * (1 - clamped); opacity = 1 - eased;`

3. **Next.js DevTools pattern**:
   - Floating pill toolbar centered at top
   - Light neutral background (`bg-muted`)
   - Filename as tab at bottom (not badge at top)
   - Subtle borders and shadows

## Post-Mortem

### What Worked
- **Removing wrapper backgrounds**: Letting ScrollyStage own its styling eliminates flash
- **CSS-based backgrounds**: Using `bg-muted` instead of JS-computed backgrounds for instant theme response
- **Floating pill pattern**: Compact rounded container with backdrop blur looks professional

### What Failed
- **Initial filename badge placement**: Top-right dark badge looked heavy and inconsistent
- **Nested backgrounds**: BlogWithCanvas wrapper added extra layer causing theme flash

### Key Decisions
- Decision: Move filename from badge to tab at bottom
  - Alternatives: Keep as badge, hide entirely
  - Reason: Matches Next.js DevTools, cleaner look, logical placement

- Decision: Center toolbar at top instead of top-right
  - Alternatives: Keep top-right, bottom position
  - Reason: Matches Next.js DevTools reference, more balanced appearance

## Artifacts
- `components/ui/scrolly/ScrollyStage.tsx` - Main canvas with new structure
- `components/ui/scrolly/StageControls.tsx` - Floating pill toolbar
- `components/blog/RenderCanvas.tsx` - Simplified instant transitions
- `components/blog/BlogWithCanvas.tsx` - Fixed canvas wrapper

## Action Items & Next Steps
1. **Test theme switching** - Verify canvas updates instantly when toggling light/dark
2. **Mobile testing** - Ensure canvas looks good on mobile inline view
3. **Consider adding more toolbar actions** - Refresh, external link like Next.js DevTools
4. **User testing** - Get feedback on new canvas appearance

## Other Notes
- Dev server: `pnpm dev` on port 3000
- Test page: `/canvas-test` shows canvas with stepped content
- The `bg-muted` color is defined in CSS variables and auto-switches with theme
- StageControls now uses smaller 36px buttons (was 44px) to fit pill better
