---
date: 2026-01-07T05:05:00Z
session_name: scrolly-coding
researcher: Claude
git_commit: d7efa1e45c7c1c1eae0872d289afa6c03956aba2
branch: scrollyCoding
repository: porfolio-26
topic: "ScrollyCoding Left Panel Layout Improvements"
tags: [scrolly-coding, layout, ui, devouring-details]
status: ready_for_implementation
last_updated: 2026-01-07
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: ScrollyCoding Left Panel Layout Fixes

## Task(s)

| Task | Status |
|------|--------|
| Analyze Devouring Details left panel layout | Completed |
| Document visual differences from our implementation | Completed |
| Create requirements for left panel fixes | Completed |
| Implement left panel layout changes | **Ready for Implementation** |

## Critical References

1. **Reference site**: https://devouringdetails.com/prototypes/nextjs-dev-tools
2. **Current implementation**: `components/ui/scrolly/ScrollyStep.tsx`, `components/ui/scrolly/ScrollyCoding.tsx`
3. **Continuity ledger**: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

## Problem Analysis

### Current Issues (Our Implementation)

1. **Step cards take too much vertical space** - Each step is wrapped in a card container with excessive padding
2. **Only ~1 step visible at a time** - Due to large margins, users can't see context above/below
3. **Misaligned with article flow** - Steps don't integrate naturally with the reading experience
4. **Too much left margin** - Steps start too far from the left edge

### Reference Site (Devouring Details) Layout

From screenshot analysis at https://devouringdetails.com/prototypes/nextjs-dev-tools:

**Key Layout Characteristics:**

1. **Multiple steps visible simultaneously** (~4-6 text blocks visible in viewport)
2. **No card containers** - Steps are plain text paragraphs, no borders or backgrounds
3. **Tight vertical spacing** - Natural paragraph flow, minimal gaps between steps
4. **Minimal left margin** - Content starts ~78px from left edge
5. **Orange dot indicator** - Small circle to left of active step text
6. **Opacity-based active state**:
   - Active step: 100% opacity
   - Past steps: ~40% opacity (faded above)
   - Future steps: ~40% opacity (faded below)
7. **Section labels** - Uppercase, small, faded (e.g., "FOCUS RINGS", "STATE ANIMATIONS")
8. **Inline code blocks** - Code snippets can appear in left column with subtle background

**Column Split:**
- Left column: ~48-50% width
- Right column (canvas): ~50-52% width
- Clear vertical divider line between columns

## Requirements for Implementation

### Phase 1: Remove Card Containers

**File:** `components/ui/scrolly/ScrollyStep.tsx`

Current (problematic):
- Card-like container with padding
- Border/background styling
- Fixed height per step

Target:
- Remove card wrapper entirely
- Steps are just `<div>` with text content
- Natural paragraph flow

### Phase 2: Reduce Spacing

**File:** `components/ui/scrolly/ScrollyCoding.tsx`

Changes needed:
- Reduce step gap from current value to `gap-6` (24px) or less
- Remove excessive padding on left column
- Ensure left margin aligns with ~78px from viewport edge

### Phase 3: Active Step Indicator

**File:** `components/ui/scrolly/ScrollyStep.tsx`

Replace current left border indicator with:
```
- Small orange/primary dot (8px diameter)
- Positioned to left of text
- Only visible for active step
- Smooth fade transition
```

### Phase 4: Opacity-Based Fading

**File:** `components/ui/scrolly/ScrollyStep.tsx`

Implement gradient opacity:
```css
/* Active step */
.step-active { opacity: 1; }

/* Past steps (scrolled above) */
.step-past { opacity: 0.4; }

/* Future steps (scrolled below) */
.step-future { opacity: 0.4; }
```

Use step index vs active index to determine past/future.

### Phase 5: Typography Adjustments

**File:** `app/globals.css` or inline styles

Step text should use:
- Body text size (16-18px)
- Line height 1.6-1.7
- Muted foreground color for inactive
- Full foreground for active

### Phase 6: Section Labels (Optional)

If steps have titles/labels:
- Uppercase, small (11px)
- Letter-spacing 0.05em
- Muted gray color
- Above step content

## Visual Specifications

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Past step - 40% opacity]                    │                 │
│  Lorem ipsum dolor sit amet...                │                 │
│                                               │   ┌─────────┐   │
│  • [Active step - 100% opacity]               │   │         │   │
│  Current explanation text here...             │   │  CODE   │   │
│                                               │   │  STAGE  │   │
│  [Future step - 40% opacity]                  │   │         │   │
│  Upcoming content preview...                  │   └─────────┘   │
│                                               │                 │
│  [Future step - 40% opacity]                  │                 │
│  More content below...                        │                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
     ~78px margin                50/50 split
```

## Files to Modify

| File | Changes |
|------|---------|
| `components/ui/scrolly/ScrollyStep.tsx` | Remove card, add dot indicator, opacity states |
| `components/ui/scrolly/ScrollyCoding.tsx` | Reduce gaps, adjust column widths, fix margins |
| `app/globals.css` | Add `.scrolly-step-past`, `.scrolly-step-future` classes |

## Learnings

1. **Devouring Details uses opacity, not cards** - The visual hierarchy comes from opacity changes, not card containers with borders
2. **Multiple visible steps is key** - Users need context (what came before, what's next)
3. **Tight spacing creates flow** - Steps should feel like paragraphs in an article, not separate boxes
4. **Orange dot is subtle** - The active indicator is small and positioned to the side, not a border

## Post-Mortem

### What Worked
- Screenshot analysis of reference site was effective for understanding exact layout patterns
- Comparing viewport percentages helped identify spacing issues

### What Failed
- Initial implementation used card containers (copied from Code Hike style) which doesn't match Devouring Details
- Left border indicator takes up too much visual weight

### Key Decisions
- Decision: Use opacity-based active states instead of card backgrounds
  - Alternatives: Border highlight, background color change
  - Reason: Matches Devouring Details, allows seeing more steps at once
- Decision: Small dot indicator instead of left border
  - Alternatives: Full left border, background highlight
  - Reason: More subtle, doesn't interfere with text flow

## Artifacts

- Handoff: `thoughts/shared/handoffs/scrolly-coding/2026-01-07_05-05-00_left-panel-layout-fixes.md`
- Continuity ledger: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`
- Reference screenshots: Captured from https://devouringdetails.com/prototypes/nextjs-dev-tools

## Action Items & Next Steps

1. [ ] **Remove card containers from ScrollyStep** - Strip all card-like styling
2. [ ] **Add orange dot indicator** - Small primary-colored dot for active step
3. [ ] **Implement opacity states** - past (0.4), active (1.0), future (0.4)
4. [ ] **Reduce vertical spacing** - Change gap from current to ~24px
5. [ ] **Adjust left margin** - Align with ~78px from viewport edge
6. [ ] **Test with multiple steps** - Verify 4-6 steps visible in viewport
7. [ ] **Test scroll behavior** - Ensure smooth opacity transitions on scroll

## Other Notes

### Current ScrollyStep Structure (to be simplified)
```tsx
// Current: Card-based structure
<motion.div className="rounded-lg border p-4 ...">
  <div className="left-border-indicator" />
  <div className="content">...</div>
</motion.div>

// Target: Simple paragraph structure
<motion.div className="relative pl-6">
  {isActive && <span className="dot-indicator" />}
  <div className="content">...</div>
</motion.div>
```

### CSS Variables to Consider
```css
--scrolly-step-gap: 24px;
--scrolly-left-margin: 78px;
--scrolly-indicator-size: 8px;
--scrolly-inactive-opacity: 0.4;
```
