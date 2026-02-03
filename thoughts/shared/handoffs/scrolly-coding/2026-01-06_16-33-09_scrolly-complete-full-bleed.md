---
date: 2026-01-06T09:33:09Z
session_name: scrolly-coding
researcher: Claude
git_commit: 70aa16b
branch: scrollyCoding
repository: porfolio-26
topic: "ScrollyCoding Component System - Full Implementation"
tags: [implementation, scrollytelling, shiki-magic-move, accessibility, full-bleed-layout]
status: complete
last_updated: 2026-01-06
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: ScrollyCoding Implementation Complete + Full-Bleed Enhancement

## Task(s)

| Task | Status |
|------|--------|
| Phase 0-8: Complete ScrollyCoding system | **Completed** |
| Full-bleed layout (Devouring Details style) | **Completed** |
| Hydration mismatch fix for mobile stage | **Completed** |

### Implementation Summary
Built a complete scrollytelling code walkthrough component system with:
- Typed steps API for MDX authoring
- Shiki Magic Move animated code transitions
- Two-column sticky layout with scroll-based step activation
- Spring physics motion choreography
- Full accessibility (keyboard nav, screen reader support)
- Mobile fallback with inline code stages
- Full-bleed immersive layout matching Devouring Details reference

## Critical References

1. **Continuity Ledger**: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Complete implementation history with all 8 phases documented
2. **Authoring Guide**: `docs/scrolly-authoring-guide.md` - Documentation for MDX authors
3. **Demo Post**: `content/blog/scrolly-demo.mdx` + `content/blog/scrolly-demo.steps.tsx` - Working example

## Recent Changes

### Full-Bleed Layout (`components/ui/scrolly/ScrollyCoding.tsx`)
- Changed container from constrained to full viewport width
- Applied negative margin technique: `w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]`
- Changed column split from 50/50 to 45/55 for more code space
- Added subtle background `bg-muted/30` on right column (code stage)
- Smart padding respecting max content width: `md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]`

### Hydration Fix (`components/ui/scrolly/ScrollyStageMobile.tsx:44-59`)
- Added `mounted` state pattern to prevent SSR/client theme mismatch
- Server renders with dark theme tokens (consistent)
- Theme-dependent rendering only after `useEffect` sets `mounted=true`

### Accessibility (`components/ui/scrolly/ScrollyStep.tsx`, `ScrollyLiveRegion.tsx`)
- Added `role="button"`, `tabIndex={0}`, `aria-pressed`, `aria-label`
- Keyboard handlers: Arrow keys, Home/End, Enter/Space
- Created `ScrollyLiveRegion` for screen reader announcements

## Learnings

### Shiki Magic Move Integration
- `ShikiMagicMovePrecompiled` requires precompiled tokens with `KeyedTokensInfo[]` structure
- Must compile both light and dark theme tokens server-side for instant theme switching
- Animation callbacks (`onStart`, `onEnd`) useful for coordinating focus line opacity

### Hydration Pattern for Theme-Aware Components
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
const theme = mounted && resolvedTheme === "light" ? "light" : "dark";
```
This is the standard fix for next-themes hydration mismatches - render consistent SSR, update after mount.

### Full-Bleed CSS Pattern
The negative margin technique `left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]` works reliably to break out of any container to full viewport width. Must be paired with `w-screen`.

### Fumadocs MDX Architecture
MDX components in Next.js App Router run server-side. This enables async server components like `<Scrolly>` to compile Shiki tokens at build time - no client WASM loading needed.

## Post-Mortem

### What Worked
- **Server-side compilation**: Precompiling Shiki tokens server-side eliminates client WASM loading, faster initial render
- **useInView for active step**: Simple intersection observer with `-45% 0px -45% 0px` margin reliably detects center-zone activation
- **CSS spring via Motion MCP**: Generated CSS `linear()` spring matches Motion spring physics without JS overhead
- **Separating mobile stage**: Dedicated `ScrollyStageMobile` component avoided complexity of conditional animation logic

### What Failed
- **Initial token structure assumption**: Assumed flat token array, but Magic Move needs `KeyedTokensInfo` with hash-based keys. Fixed by using `codeToKeyedTokens()`.
- **Wrong CSS selector for focus lines**: Initially targeted `.scrolly-magic-move` but container class was `.scrolly-stage-code`. Fixed by updating selector.
- **Hydration mismatch in mobile**: Theme colors differ between SSR and client. Fixed with mounted state pattern.

### Key Decisions
- **Decision**: Keep TOC visible during scrolly sections
  - Alternatives: Hide TOC, add scrolly steps to TOC
  - Reason: Simplest approach, non-breaking, scrolly is just content section

- **Decision**: Use CSS-based focus line highlighting (not JS animation)
  - Alternatives: Animate highlight position with Motion
  - Reason: CSS transitions sufficient, less JS overhead, works during Magic Move animation

- **Decision**: 45/55 column split (not 50/50)
  - Alternatives: 50/50, 40/60
  - Reason: Code needs more space than prose, 45% still comfortable for step cards

## Artifacts

### Core Components
- `components/ui/scrolly/ScrollyCoding.tsx` - Main container with full-bleed layout
- `components/ui/scrolly/ScrollyStep.tsx` - Step card with keyboard nav
- `components/ui/scrolly/ScrollyStage.tsx` - Desktop code stage with Magic Move
- `components/ui/scrolly/ScrollyStageMobile.tsx` - Mobile inline code stage
- `components/ui/scrolly/ScrollyContext.tsx` - State management context
- `components/ui/scrolly/ScrollyLiveRegion.tsx` - Screen reader announcements
- `components/ui/scrolly/ScrollyServer.tsx` - Async server wrapper for MDX
- `components/ui/scrolly/index.ts` - Exports

### Library Code
- `lib/scrolly/types.ts` - Type definitions and validation
- `lib/scrolly/compile-steps.ts` - Server-side Shiki compilation
- `lib/scrolly/utils.ts` - Client-safe utilities
- `lib/scrolly/index.ts` - Module exports

### Integration
- `lib/custom-components.tsx` - MDX component registration
- `app/globals.css` - Shiki Magic Move CSS import

### Documentation & Demo
- `docs/scrolly-authoring-guide.md` - Complete authoring guide
- `content/blog/scrolly-demo.mdx` - Demo blog post
- `content/blog/scrolly-demo.steps.tsx` - Demo steps array

### State Tracking
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Full implementation history

## Action Items & Next Steps

### Immediate (Testing)
1. **Manual testing**: Verify full-bleed layout works across viewport sizes
2. **Theme switching**: Test light/dark toggle doesn't cause hydration errors
3. **Mobile testing**: Verify inline code stages display correctly < 768px
4. **Accessibility testing**: Tab through steps, verify screen reader announces changes

### Future Enhancements
1. **Line numbers**: Add optional line number gutter (off by default)
2. **Annotations**: Implement inline code annotations with labels
3. **More examples**: Create additional demo posts showcasing different use cases
4. **Performance**: Consider lazy loading Magic Move for pages without scrolly sections

### Cleanup
1. **Commit changes**: Current work is uncommitted - run `/commit` to create commit
2. **Remove duplicate ledger**: `CONTINUITY_CLAUDE-scrolly-coding 2.md` appears to be duplicate

## Other Notes

### Key File Locations
- **Springs/Motion**: `lib/motion-variants.ts` has `springGentle`, `springBouncy`, `springSnappy` presets
- **Colors**: OKLCH system defined in `app/globals.css`
- **Typography**: Swiss classes like `text-swiss-title`, `text-swiss-body` in globals

### Reference Site
- Devouring Details: https://devouringdetails.com/prototypes/nextjs-dev-tools
- Inspired the full-bleed immersive layout pattern

### Testing Commands
```bash
pnpm dev          # Start dev server
pnpm build        # Verify production build
# Visit http://localhost:3000/blog/scrolly-demo
```
