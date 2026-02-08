---
date: 2026-01-07T07:14:46Z
session_name: scrolly-coding
researcher: Claude
git_commit: d7efa1e45c7c1c1eae0872d289afa6c03956aba2
branch: scrollyCoding
repository: porfolio-26
topic: "ScrollyCoding Scroll Activation Redesign"
tags: [scrollytelling, scroll-activation, motion, ux]
status: partial
last_updated: 2026-01-07
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: ScrollyCoding scroll activation needs redesign

## Task(s)

| Task | Status |
|------|--------|
| Fix mobile layout (full-width code blocks) | Completed |
| Compact step heights (25vh → 18vh) | Completed |
| Fix fullscreen (expand from right) | Completed |
| Reduce spacer heights (30vh/50vh → 15vh/30vh) | Completed |
| **Redesign scroll activation approach** | **Planned - needs research** |

**Current phase:** Completed quick fixes, now needs deeper analysis of reference site for better scroll activation UX.

## Critical References

1. `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Full implementation history
2. `components/ui/scrolly/ScrollyCoding.tsx` - Main component with scroll activation logic
3. Reference site: https://devouringdetails.com/prototypes/nextjs-dev-tools (user wants to analyze this)

## Recent changes

- `components/ui/scrolly/ScrollyStageMobile.tsx:120-199` - Full-width mobile layout, removed horizontal scroll
- `components/ui/scrolly/ScrollyStep.tsx:109-110` - Reduced step height to `md:min-h-[18vh]`
- `components/ui/scrolly/StageFullscreen.tsx:121-145` - Changed from centered modal to expand-from-right animation
- `components/ui/scrolly/ScrollyCoding.tsx:107-108,136-137` - Reduced spacers (15vh/30vh)

## Learnings

### Current Scroll Activation Mechanism
The current approach uses **center-zone detection**:
```
useInView(stepsContainerRef, { margin: "-45% 0px -45% 0px" })
```

This means:
- Steps container must be 45% into viewport from BOTH top and bottom before triggering
- Requires spacer divs to create "scroll runway" before/after steps
- **Problem:** Spacers feel like wasted space, UX is disconnected

### Spacer Purpose (why they exist)
| Spacer | Height | Purpose |
|--------|--------|---------|
| Top | 15vh | Prevents drawer opening immediately when section enters viewport |
| Bottom | 30vh | Allows last step to reach viewport center for activation |

Without spacers, the `-45%` margin logic breaks - drawer would open/close erratically.

### Alternative Approaches to Consider
1. **Percentage-based trigger**: Open drawer when ANY part of steps visible, not just centered
2. **First step trigger**: Open when first step enters viewport, close when last step exits
3. **Intersection ratio**: Use `threshold` instead of `margin` for more natural feel
4. **Scroll position tracking**: Track scroll % through section, not binary in/out

## Post-Mortem

### What Worked
- Full-width mobile layout using `-mx-4` negative margin pattern
- Expand-from-right fullscreen animation feels more connected than modal
- Reducing `min-h` to 18vh makes steps feel less padded

### What Failed
- Tried to use WebFetch on devouringdetails.com but got documentation page, not the scrollytelling prototype
- The spacer approach works mechanically but feels arbitrary to users

### Key Decisions
- **Decision:** Use `useInView` with negative margin for activation
  - Alternatives: IntersectionObserver with threshold, scroll event listener
  - Reason: Motion's useInView is declarative and handles edge cases
  - **Revisit:** User wants to analyze reference site for better pattern

## Artifacts

- `components/ui/scrolly/ScrollyCoding.tsx` - Main container with scroll logic
- `components/ui/scrolly/ScrollyStep.tsx` - Step cards
- `components/ui/scrolly/ScrollyStage.tsx` - Code stage with Magic Move
- `components/ui/scrolly/ScrollyStageMobile.tsx` - Mobile code display
- `components/ui/scrolly/StageFullscreen.tsx` - Fullscreen modal
- `components/ui/scrolly/ScrollyDrawerContext.tsx` - Drawer open/close state
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Full history

## Action Items & Next Steps

### Immediate: Analyze Reference Site
User wants to understand how Devouring Details handles scroll activation.

**Recommended approach:**
1. Use `claude-in-chrome` MCP tools to open https://devouringdetails.com and find the scrollytelling prototype
2. Take screenshots at different scroll positions
3. Use `read_page` to inspect DOM structure
4. Use `javascript_tool` to check for:
   - IntersectionObserver usage
   - Scroll event listeners
   - CSS scroll-snap properties
   - Any scroll-driven animations API

### Then: Redesign Activation
Based on analysis:
1. Remove or minimize spacer divs
2. Implement smoother drawer open/close triggers
3. Consider scroll-snap for step snapping
4. Test on mobile and desktop

## Other Notes

### Browser Analysis Capability
Claude has access to `mcp__claude-in-chrome__*` tools that can:
- Navigate to URLs (`navigate`)
- Take screenshots (`computer` with action: screenshot)
- Read DOM/accessibility tree (`read_page`)
- Execute JavaScript (`javascript_tool`)
- Find elements (`find`)

This is the best way to analyze the reference site's scroll behavior - can inspect live JS state and DOM during scrolling.

### Key Files for Scroll Logic
- `ScrollyCoding.tsx:61-73` - The `useInView` and drawer open/close logic
- `ScrollyDrawerContext.tsx` - Drawer state management
- `lib/motion-variants.ts` - Spring animations used for drawer

### Git Status
Uncommitted changes in:
- ScrollyStageMobile.tsx (mobile layout)
- ScrollyStep.tsx (height reduction)
- StageFullscreen.tsx (expand animation)
- ScrollyCoding.tsx (spacer reduction)

Consider committing before major scroll activation redesign.
