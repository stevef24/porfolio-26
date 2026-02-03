---
date: 2026-01-06T12:03:00Z
session_name: scrolly-coding
researcher: Claude
git_commit: c629cf7
branch: scrollyCoding
repository: porfolio-26
topic: "Design System Overhaul & Enhanced ScrollyCoding Canvas"
tags: [design-system, scrollycoding, fonts, animations, motion, itshover, canvas-controls]
status: planning-complete
last_updated: 2026-01-06
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: Design System Overhaul & Enhanced ScrollyCoding Canvas

## Task(s)

### Completed
1. **Research & Analysis**: Thoroughly analyzed Devouring Details (https://devouringdetails.com/prototypes/nextjs-dev-tools) design patterns via browser automation
2. **User Requirements Gathered**: Font (Inter), roundness (4-8px), keep lime green accent, ItsHover icons
3. **Motion Best Practices Research**: Researched Motion 2026 best practices - time-based springs with `visualDuration` and `bounce`
4. **ItsHover Icons Research**: Identified 6 icons needed for canvas controls
5. **Comprehensive 10-Phase Plan**: Created detailed implementation plan with code examples

### Planned (Ready for Implementation)
- **Phase 1**: Design System Foundation (fonts, radius tokens, motion variants)
- **Phase 2**: Typography Refresh (Swiss typography classes)
- **Phase 3**: Component Border Radius Migration (rounded-none → rounded-sm/lg)
- **Phase 4**: Install ItsHover Icons (6 animated icons)
- **Phase 5**: Extended ScrollyCoding Types (code, playground, image, images, iframe, custom)
- **Phase 6**: Canvas Controls Component (expand, refresh, source toggle, link)
- **Phase 7**: Fullscreen Modal (portal-based with spring animations)
- **Phase 8**: Stage Renderers (CodeRenderer, PlaygroundRenderer, ImageRenderer)
- **Phase 9**: ScrollyStage Integration (controls + renderers)
- **Phase 10**: Testing & Polish (visual comparison with Devouring Details)

## Critical References

1. **Implementation Plan**: `/Users/stavfernandes/.claude/plans/rosy-herding-puzzle.md` - Contains ALL phase details with code examples
2. **Continuity Ledger**: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Previous scrolly work context
3. **Existing Scrolly Docs**: `docs/scrolly-coding-plan/` - Original phase docs (may need updating)

## Recent Changes

No code changes made - this was a planning session. The existing scrolly implementation is complete from previous work:
- `components/ui/scrolly/ScrollyCoding.tsx` - Main component
- `components/ui/scrolly/ScrollyStage.tsx` - Code stage with Shiki Magic Move
- `components/ui/scrolly/ScrollyStep.tsx` - Step cards
- `lib/scrolly/types.ts` - Current type definitions

## Learnings

### Devouring Details Design Analysis
- **Font**: Custom "DD" font, 20px body, 500 weight, 38px line-height (similar to Inter)
- **Colors**: Dark bg `rgb(10, 10, 10)`, light text `rgb(237, 237, 237)`, ORANGE accent (user wants lime green)
- **Border Radii**: 4px, 6px, 8px, 12px, 9999px (pills)
- **Canvas Controls**: 4 buttons in top-right (expand, refresh, link, code)

### Motion 2026 Best Practices
- Use **time-based springs** with `visualDuration` and `bounce` (NOT physics-based)
- Example: `{ type: "spring", visualDuration: 0.3, bounce: 0.15 }`
- CSS spring for focus lines: `350ms linear(0, 0.3667, 0.8271, 1.0379, 1.0652, 1.0332, 1.006, 0.9961, 0.996, 0.9984, 0.9999, 1)`

### ItsHover Icons
- Install via: `npx shadcn@latest add https://itshover.com/r/[icon-name].json`
- Icons needed: `expand-icon`, `refresh-icon`, `code-icon`, `link-icon`, `copy-icon`, `layout-bottombar-collapse-icon`
- They're React components with Motion animations built-in

### Current State Issues
- `--font-display` CSS variable referenced but NEVER defined (falls back to Georgia)
- JetBrains Mono is primary font (user wants Inter)
- All components use `rounded-none` (user wants 4-8px roundness)

## Post-Mortem

### What Worked
- **Browser automation research**: Using Claude-in-Chrome to inspect actual computed styles was invaluable
- **Motion MCP tools**: `search-motion-codex` and `visualise-spring` gave accurate 2026 best practices
- **Parallel research agents**: Running multiple research tasks simultaneously saved time
- **ItsHover discovery**: Found the exact icon library and installation method

### What Failed
- **WebFetch limitations**: Initial fetches didn't capture detailed CSS - browser inspection was necessary
- **Canvas button clicking**: The Devouring Details canvas buttons didn't visibly respond (demo-specific)

### Key Decisions
- **Decision**: Keep lime green accent, not switch to orange like Devouring Details
  - Alternatives: Orange (match DD exactly), custom color
  - Reason: User preference + existing brand consistency

- **Decision**: Use Inter font (not custom font like DD's "DD" font)
  - Alternatives: System fonts, keep JetBrains Mono
  - Reason: Inter is the closest open-source equivalent to premium sans-serifs

- **Decision**: Time-based springs over physics-based
  - Alternatives: stiffness/damping/mass parameters
  - Reason: Motion v12+ recommends `visualDuration` for predictable timing

## Artifacts

### Primary Plan Document
- `/Users/stavfernandes/.claude/plans/rosy-herding-puzzle.md` - **READ THIS FIRST** - Complete 10-phase plan with code

### Supporting Documents
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Previous scrolly implementation context
- `docs/scrolly-coding-plan/phase-5-motion-choreography.md` - Original motion choreography spec

### Files to Modify (Summary)
```
app/layout.tsx                           # Font imports (Inter, Playfair, JetBrains)
app/globals.css                          # Radius tokens + typography classes
lib/motion-variants.ts                   # 2026 spring configs
lib/scrolly/types.ts                     # Extended stage content types
components/ui/scrolly/ScrollyStage.tsx   # Renderer + controls integration
components/ui/scrolly/ScrollyContext.tsx # Stage control state
components/ui/button.tsx                 # rounded-sm (4px)
components/ui/card.tsx                   # rounded-lg (8px)
components/ui/input.tsx                  # rounded-sm
components/ui/badge.tsx                  # rounded-sm
```

### New Files to Create
```
components/ui/scrolly/StageControls.tsx
components/ui/scrolly/StageFullscreen.tsx
components/ui/scrolly/renderers/types.ts
components/ui/scrolly/renderers/CodeRenderer.tsx
components/ui/scrolly/renderers/PlaygroundRenderer.tsx
components/ui/scrolly/renderers/ImageRenderer.tsx
components/ui/scrolly/renderers/StageRenderer.tsx
```

## Action Items & Next Steps

### Immediate (Phase 1-4)
1. **Update fonts in `app/layout.tsx`**: Replace JetBrains Mono with Inter as `--font-sans`, add Playfair as `--font-display`, keep JetBrains as `--font-code`
2. **Update radius tokens in `app/globals.css`**: Add refined scale (2px, 4px, 6px, 8px, 12px)
3. **Update motion variants in `lib/motion-variants.ts`**: Add 2026 time-based springs
4. **Install ItsHover icons**: Run 6 shadcn add commands

### Core Implementation (Phase 5-9)
5. **Extend `lib/scrolly/types.ts`**: Add `StageContentType` union type
6. **Create `StageControls.tsx`**: 4 buttons with ItsHover icons
7. **Create `StageFullscreen.tsx`**: Portal modal with spring animations
8. **Create stage renderers**: CodeRenderer, PlaygroundRenderer, ImageRenderer
9. **Integrate into ScrollyStage**: Add controls + renderer routing

### Polish (Phase 10)
10. **Update all UI components**: Change `rounded-none` to `rounded-sm`/`rounded-lg`
11. **Visual testing**: Compare with Devouring Details screenshots
12. **Accessibility verification**: Keyboard nav, screen readers, reduced motion

## Other Notes

### User Preferences (Confirmed)
- Accent color: **Lime green** (keep current)
- Font: **Inter** (body) + Playfair (headings) + JetBrains Mono (code)
- Roundness: **Subtle 4-8px** (not sharp corners, not too rounded)
- Canvas behavior: **Slide-in panel** like Devouring Details

### Dependencies Already Installed
- `motion` (Framer Motion v12) - for animations
- `@codesandbox/sandpack-react` - for playground renderer
- `next-themes` - for dark/light mode

### Reference URLs
- Devouring Details: https://devouringdetails.com/prototypes/nextjs-dev-tools
- ItsHover Icons: https://www.itshover.com/icons
- Motion Docs: https://motion.dev

### Spring Configurations (Copy-Paste Ready)
```typescript
// 2026 Best Practice Springs
export const springSnappy = { type: "spring", visualDuration: 0.2, bounce: 0 };
export const springSmooth = { type: "spring", visualDuration: 0.3, bounce: 0.15 };
export const springGentle = { type: "spring", visualDuration: 0.35, bounce: 0.1 };
export const springBouncy = { type: "spring", visualDuration: 0.4, bounce: 0.3 };

// CSS Spring for focus lines
export const cssSpringSmooth = "350ms linear(0, 0.3667, 0.8271, 1.0379, 1.0652, 1.0332, 1.006, 0.9961, 0.996, 0.9984, 0.9999, 1)";
```

### Implementation Tip
Use multiple subagents for parallel implementation:
- Agent 1: Design system (Phases 1-3)
- Agent 2: Icons + Types (Phases 4-5)
- Agent 3: Canvas components (Phases 6-9)
