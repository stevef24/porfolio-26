---
date: 2026-01-16T15:36:18+0700
session_name: agent-sdk-blog
researcher: Claude
git_commit: e55ce80
branch: scrollyCoding
repository: porfolio-26
topic: "TOC Simplification & Bottom Navbar Implementation"
tags: [ui, navigation, toc, section-indicator, simplification]
status: complete
last_updated: 2026-01-16
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: TOC Simplification & Bottom Navbar

## Task(s)

**Completed:**
1. ✅ **Delete complex TOC components** - Removed RulerTOC (398 lines), MobileFloatingTOC (455 lines), StickyTOCSidebar (163 lines)
2. ✅ **Create minimal SectionIndicator** - AI Hero-inspired sticky indicator (~95 lines) that sits inside blog content
3. ✅ **Move navbar to bottom** - Compact bottom navigation instead of top
4. ✅ **Fix canvas step timing** - Reduced transition delays for snappier feel
5. ✅ **Fix hydration error** - EmailCaptureForm `useId()` mismatch fixed with stable ID
6. ✅ **Consolidate navigation** - Deleted unused `Navbar.tsx`, kept only `Header.tsx`

**Plan Reference:** Plan was provided inline by user (not a separate document)

## Critical References

- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - Session state tracking
- `components/layout/Header.tsx` - Single navigation component (bottom navbar)
- `components/ui/blog/SectionIndicator.tsx` - Minimal section indicator

## Recent changes

- `components/ui/blog/RulerTOC.tsx` - DELETED (398 lines)
- `components/ui/blog/MobileFloatingTOC.tsx` - DELETED (455 lines)
- `components/ui/blog/StickyTOCSidebar.tsx` - DELETED (163 lines)
- `components/layout/Navbar.tsx` - DELETED (unused duplicate of Header)
- `components/ui/blog/SectionIndicator.tsx:73-99` - Created minimal sticky indicator
- `components/layout/Header.tsx:126` - Changed `fixed top-0` to `fixed bottom-0`
- `components/layout/Header.tsx:128` - Changed `y: -100` to `y: 100` for hide animation
- `components/layout/Header.tsx:140-142` - Reduced padding from `gap-8 px-8 py-4 mt-5` to `gap-5 px-6 py-3 mb-4`
- `components/layout/Header.tsx:181` - Reduced text size to `text-[12px]`
- `components/layout/SiteShell.tsx:59` - Changed `pt-20` to `pb-20` for bottom navbar
- `app/blog/[slug]/page.tsx:97` - Moved SectionIndicator inside article content
- `components/shared/EmailCaptureForm.tsx:48` - Fixed hydration with stable ID
- `components/blog/BlogWithCanvas.tsx:118` - Widened activation band `-45%` → `-35%`
- `components/blog/BlogWithCanvas.tsx:223` - Reduced transition lock `500ms` → `200ms`
- `components/blog/CanvasZoneContext.tsx:82` - Step detection `-40%` → `-30%`
- `lib/motion-variants.ts:456` - Content reveal delay `0.15` → `0.05`

## Learnings

1. **Duplicate components existed**: `Navbar.tsx` and `Header.tsx` were nearly identical. `Header.tsx` is used by `SiteShell.tsx` while `Navbar.tsx` was never imported in actual code (only docs).

2. **Hydration mismatches from useId()**: React's `useId()` can generate different IDs server vs client. Fix by using stable IDs based on props (e.g., `email-capture-${source}`).

3. **Section indicator placement matters**: Placing it inside the article content means it:
   - Takes the same width as content (not full viewport)
   - Slides with content when canvas activates
   - Sticks to top when scrolled past header

4. **Canvas transition timing compounds**: Multiple delays (500ms lock + 150ms content delay + narrow activation bands) made transitions feel sluggish. Reducing each individually improved responsiveness.

## Post-Mortem (Required for Artifact Index)

### What Worked
- **Aggressive deletion**: Removing ~920 lines of complex TOC code simplified the codebase significantly
- **Contextual placement**: Moving section indicator inside article content solved multiple UX issues at once
- **Stable ID pattern**: Using `source` prop for ID generation is reliable and doesn't require additional state

### What Failed
- Tried: Editing `Navbar.tsx` for bottom positioning → Failed because: It wasn't even being used
- Error: Hydration mismatch with `useId()` → Fixed by: Using stable ID based on `source` prop

### Key Decisions
- Decision: Delete Navbar.tsx entirely
  - Alternatives considered: Consolidate both into one, keep both
  - Reason: Navbar was never imported in actual code, Header handles all navigation

- Decision: Section indicator inside article, not fixed at viewport top
  - Alternatives considered: Fixed position like before
  - Reason: User wanted it to match blog width and move with content during canvas transitions

- Decision: Bottom navbar instead of top
  - Alternatives considered: Keep at top, hide on scroll
  - Reason: User preference - frees up top for reading, mobile-friendly

## Artifacts

- `components/ui/blog/SectionIndicator.tsx` - New minimal component
- `components/layout/Header.tsx` - Updated to bottom position
- `components/layout/SiteShell.tsx:59` - Padding change
- `app/blog/[slug]/page.tsx` - Restructured with indicator inside article
- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - Updated state

## Action Items & Next Steps

1. **Visual testing needed**: Run dev server and test:
   - Section indicator sticks when scrolled
   - Bottom navbar shows/hides on scroll
   - Canvas transitions feel snappy
   - No hydration errors in console

2. **Courses section**: The courses pages may need attention - they used `StickyTOCSidebar` which was deleted. CourseLayout was updated to not pass `tocItems` anymore.

3. **Mobile testing**: Verify bottom navbar works well on mobile viewports

4. **Consider**: User mentioned wanting the section indicator to "move with the blog when canvas activates" - since it's now inside the article, this should work automatically, but verify.

## Other Notes

- Build passes: `pnpm build` completes successfully
- TypeScript passes: `pnpm tsc --noEmit` has no errors
- Net code reduction: ~825 lines (920 removed, 95 added)
- Branch: `scrollyCoding` - all changes are uncommitted
