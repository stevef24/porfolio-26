---
date: 2026-01-07T07:53:23Z
session_name: scrolly-coding
researcher: Claude
git_commit: d7efa1e45c7c1c1eae0872d289afa6c03956aba2
branch: scrollyCoding
repository: porfolio-26
topic: "CanvasZone Architecture - Phase 1: Core Layout Foundation"
tags: [implementation, canvas-zone, layout-animation, scrollytelling]
status: planning_complete
last_updated: 2026-01-07
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: CanvasZone Phase 1 - Core Layout Foundation

## Task(s)

| Task | Status |
|------|--------|
| Research Devouring Details layout pattern | Completed |
| Design sibling-based layout architecture | Completed |
| Create phased implementation plan | Completed |
| Phase 1: Core Layout Foundation | **Just Started** |

Working from:
- Plan overview: `.claude/plans/parallel-sprouting-cocoa.md`
- Phase 1 detail: `.claude/plans/phase-1-core-layout.md`
- Continuity ledger: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

## Critical References

1. **Devouring Details Reference**: https://devouringdetails.com/prototypes/nextjs-dev-tools
   - Key pattern: Sibling flex layout with CSS `translate` animation
   - Timing: `0.35s cubic-bezier(0.23, 0.88, 0.26, 0.92)`

2. **Phase 1 Plan**: `.claude/plans/phase-1-core-layout.md`
   - Full component spec with code examples
   - Test checklist and acceptance criteria

## Recent changes

- `components/blog/BlogWithCanvas.tsx:1-198` - Created (but user wants to clear context before continuing)

## Learnings

### Devouring Details Layout Architecture (Confirmed via Browser Inspection)

The key insight is that they use **CSS `translate` on sibling elements**, NOT embedded sections:

```
Section (display: flex; flex-direction: row)
├── Left (blog): width 50%, translate 0% → 50% when canvas closes
└── Right (canvas): width 50%, sticky, translate 0% → 100% when collapsed
```

**Measured values at different scroll positions:**
| State | left `data-expand` | left `translate` | right `data-collapse` | right `translate` |
|-------|-------------------|------------------|----------------------|-------------------|
| Normal (mid-scroll) | false | 12.77% | false | 25.54% |
| Notes section (exit) | true | **50%** | true | **100%** |

**Key implementation details:**
- Data attributes (`data-expand`, `data-collapse`) control state
- CSS transitions animate the translate property
- IntersectionObserver toggles the data attributes
- Canvas uses `position: sticky` (not fixed)
- Animation is GPU-accelerated (translate, not width)

### Current ScrollyCoding Issues
Our current implementation uses:
- `width` animation (triggers layout recalculation)
- `position: fixed` drawer (not sibling layout)
- Embedded section (interrupts blog flow)

The new architecture makes blog and canvas **siblings** that push each other.

## Post-Mortem

### What Worked
- **Browser automation for research**: Used Chrome MCP to navigate, scroll, and inspect DOM
- **JavaScript execution**: Extracted exact CSS values, data attributes, and element dimensions
- **Incremental scroll testing**: Tracked state changes at different scroll positions
- **Phased planning**: Breaking into 6 phases with separate docs helped structure the work

### What Failed
- **Initial click targeting**: Had to use JavaScript to find exact button coordinates
- **Synchronous scroll testing**: `window.scrollTo()` didn't trigger IntersectionObservers - needed to use actual scroll or click navigation links

### Key Decisions
- **Decision**: Rename from "ScrollyCoding" to "CanvasZone"
  - Alternatives: InteractiveSection, ScrollySection
  - Reason: Better reflects zone-based triggering vs embedded component

- **Decision**: Use CSS `translate` instead of Motion `width` animation
  - Alternatives: Continue with current width animation
  - Reason: GPU-accelerated, no layout recalculation

- **Decision**: Multiple canvas types per post (code, demo, visualization)
  - Alternatives: Single type per post
  - Reason: User wants flexibility for different interactive content

- **Decision**: Include code slide-up panel in canvas
  - Reason: Matches Devouring Details `</>` button behavior

- **Decision**: Immediate exit (no delay when leaving zone)
  - Alternatives: 200ms delay to prevent flickering
  - Reason: User preference for responsive feel

## Artifacts

### Plans
- `.claude/plans/parallel-sprouting-cocoa.md` - Master plan with phase breakdown
- `.claude/plans/phase-1-core-layout.md` - Detailed Phase 1 specification

### Code (Started)
- `components/blog/BlogWithCanvas.tsx` - Core layout component (created but review before using)

### Ledger
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Continuity ledger (needs update for new CanvasZone work)

## Action Items & Next Steps

### Phase 1: Core Layout Foundation (Current)

1. **Review `BlogWithCanvas.tsx`** - File created at `components/blog/BlogWithCanvas.tsx`
   - Verify implementation matches Phase 1 spec
   - May need adjustments based on testing

2. **Add CSS variables** to `app/globals.css`:
   ```css
   :root {
     --canvas-translate-duration: 0.35s;
     --canvas-translate-timing: cubic-bezier(0.23, 0.88, 0.26, 0.92);
   }
   ```

3. **Add motion preset** to `lib/motion-variants.ts`:
   ```ts
   export const springCanvasSlide: Transition = {
     type: "spring",
     visualDuration: 0.35,
     bounce: 0.12,
   };
   ```

4. **Create test page** at `app/canvas-test/page.tsx`
   - Simple page with toggle button
   - Verify animation behavior

5. **Test checklist**:
   - [ ] Toggle shows canvas sliding in
   - [ ] Toggle hides canvas sliding out
   - [ ] Blog content shifts left/right
   - [ ] Animation is smooth (60fps)
   - [ ] Reduced motion: instant toggle
   - [ ] Mobile: single column, no animation

### After Phase 1

- Phase 2: CanvasZone component (IntersectionObserver triggers)
- Phase 3: Canvas component (toolbar, code slide-up)
- Phase 4: Migrate existing Shiki Magic Move code
- Phase 5: Navbar scroll-direction behavior
- Phase 6: Polish & accessibility

## Other Notes

### File Locations
- Current ScrollyCoding: `components/ui/scrolly/` (will be deprecated after migration)
- New CanvasZone components: `components/blog/` (new location)
- Motion variants: `lib/motion-variants.ts`
- CSS variables: `app/globals.css`

### Dev Server
- Running on port 3000 (background task be16975)
- Test page will be at `http://localhost:3000/canvas-test`

### Reference Site
- Devouring Details: https://devouringdetails.com/prototypes/nextjs-dev-tools
- Use Chrome MCP to inspect if needed

### User Preferences
- Use Context7 MCP for library documentation
- Always ask about manual vs Playwright testing
- Kill port 3000 if busy before starting dev server
