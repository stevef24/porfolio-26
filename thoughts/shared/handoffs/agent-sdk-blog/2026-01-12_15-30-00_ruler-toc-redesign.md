---
date: 2026-01-12T15:30:00Z
session_name: agent-sdk-blog
researcher: Claude
git_commit: d90cd9a (uncommitted changes pending)
branch: scrollyCoding
repository: porfolio-26
topic: "RulerTOC - Devouring Details Inspired Redesign"
tags: [toc, animation, motion, ui, devouring-details]
status: complete
last_updated: 2026-01-12
last_updated_by: Claude
type: feature
---

# Handoff: RulerTOC Redesign - Devouring Details Style

## Task(s)

Redesigned the desktop RulerTOC component to match the Devouring Details aesthetic with:
1. Triangle marker (▶) for active section indicator
2. Ultra-thin 1px ruler lines
3. Snappy spring animations (150ms)
4. Scrollable expanded view with fade masks

**All tasks completed this session.**

## Critical References

- `components/ui/blog/RulerTOC.tsx` - Complete rewrite with new design
- `app/globals.css` - Lines 1421-1432: TOC scroll container hidden scrollbar

## Recent changes

**`components/ui/blog/RulerTOC.tsx`:**
- Complete redesign inspired by Devouring Details
- Triangle marker (▶) animates to indicate active section
- Ultra-thin 1px lines (was 2-3px bars)
- Line widths: 32px (active), 24px (h2), 16px (h3), 10px (h4+)
- Snappy spring: `visualDuration: 0.15, bounce: 0.05`
- Smooth spring: `visualDuration: 0.2, bounce: 0.1`
- Tighter magnetic hover: 60px field, 2px raise, 1.08x scale
- Expanded view now shows ALL items in scrollable container
- Max height: 8 items × 28px = 224px before scroll
- Dynamic fade masks at top/bottom based on scroll position
- Triangle marker preserved in expanded view

**`app/globals.css`:**
- Added `.toc-scroll-container` class
- Hidden scrollbar for Firefox, IE/Edge, and WebKit browsers

## Learnings

1. **Triangle marker animation**: Using `AnimatePresence` with `motion.span` for the ▶ character creates smooth entry/exit animations. Position with `absolute -left-4` for collapsed, `-left-2.5` for expanded.

2. **Fade masks with CSS gradients**: Using `linear-gradient(to bottom, var(--background) 0%, transparent 100%)` with `pointer-events-none` creates non-interactive fade overlays. Animate opacity based on scroll state.

3. **Scroll state detection**: Track `scrollTop`, `scrollHeight`, and `clientHeight` to determine if more content exists above/below. Use 2px threshold to avoid false positives.

4. **Cross-browser scrollbar hiding**: Requires three declarations:
   - `scrollbar-width: none` (Firefox)
   - `-ms-overflow-style: none` (IE/Edge)
   - `::-webkit-scrollbar { display: none }` (Chrome/Safari/Opera)

## Post-Mortem

### What Worked
- **Triangle marker** - Clean visual indicator that matches Devouring Details
- **Snappy animations** - 150ms springs feel responsive without being jarring
- **Scrollable list** - Better UX for posts with many headings (14+ items)
- **Dynamic fade masks** - Clear affordance that more content is available

### Key Decisions
- **Decision:** Show ALL items in expanded view (was showing only 5)
  - Reason: Users want to see full TOC, scrolling is intuitive
- **Decision:** Use triangular marker (▶) instead of vertical bar
  - Reason: Matches Devouring Details reference, more distinctive
- **Decision:** 1px line height (was 2-3px)
  - Reason: Cleaner, more minimal ruler aesthetic

## Artifacts

- `components/ui/blog/RulerTOC.tsx` - Redesigned TOC component
- `app/globals.css` - Hidden scrollbar utility

## Action Items & Next Steps

**Remaining from original blog post task:**
1. V2 callout elevated cards with gradient styling
2. Polish canvas code blocks (Terminal Elegance refinement)
3. Apply same styling to mobile inline canvas
4. Test all interactions across devices

**TOC enhancements (optional):**
- Consider auto-scrolling expanded list to keep active item visible
- Add keyboard navigation (up/down arrows)
- Consider showing scroll progress in collapsed state

## Other Notes

**Animation timing comparison:**
```
Original:        visualDuration: 0.25-0.35
New (snappy):    visualDuration: 0.15, bounce: 0.05
New (smooth):    visualDuration: 0.2, bounce: 0.1
```

**Line width hierarchy:**
```
Active:   32px (longest)
h2:       24px (main sections)
h3:       16px (subsections)
h4+:      10px (nested)
```

**Scroll container limits:**
```
MAX_VISIBLE_ITEMS = 8
ITEM_HEIGHT = 28px
Max container height = 224px
```

**Build status:** `pnpm build` passes successfully

**Dev server:** Running at http://localhost:3000
