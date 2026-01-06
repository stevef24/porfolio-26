# Session: scrolly-coding
Updated: 2026-01-06T15:34:59.028Z

## Goal
Implement ScrollyCoding component system for interactive code walkthroughs. Done when:
- Typed steps API works with MDX authoring
- Shiki Magic Move animates code transitions
- Two-column sticky layout with scroll-based activation
- Motion choreography with spring physics
- Blog integration without breaking existing TOC
- Mobile fallback for smaller screens
- Accessible with reduced motion support

## Constraints
- Use Motion (Framer Motion v12) with spring physics from `lib/motion-variants.ts`
- Respect `prefers-reduced-motion`
- Server-only compilation for Shiki Magic Move tokens
- Swiss minimalism styling (OKLCH colors, minimal borders)
- No horizontal scroll for typical code examples
- Compatible with Fumadocs MDX system

## Key Decisions
- **Theme pair**: vitesse-light and vitesse-dark (Shiki)
- **Active step detection**: useInView with rootMargin "-45% 0px -45% 0px"
- **Mobile breakpoint**: 768px switches to single-column stack
- **Step cards**: Left border indicator for active state (Code Hike style)
- **Stage**: Minimal frame, no toolbar, filename badge top-right
- **Focus line highlighting**: CSS-based with highlight band + left border (CONFIRMED)
- **TOC strategy**: Keep TOC visible during scrolly sections (simplest, non-breaking)
- **MDX integration**: Async server component (`<Scrolly>`) compiles at build time

## State
- Done:
  - [x] Phase 0: Visual direction reference (documented in plan)
  - [x] Phase 1: Typed steps API and data model (commit: dcf4c3e)
  - [x] Phase 2: Shiki Magic Move pipeline (commit: 9b44dcf)
  - [x] Phase 3: Scrolly layout and active-step engine (commit: 338a1ce)
  - [x] Phase 4: Stage UI and Magic Move integration
  - [x] Phase 5: Motion choreography
  - [x] Phase 6: Blog integration and TOC strategy
  - [x] Phase 7: Mobile fallback and performance
  - [x] Phase 8: QA, accessibility, authoring docs
  - [x] Phase 9: Canvas controls and fullscreen mode
- Now: COMPLETE - Ready for manual testing
- Remaining: (none)

## Open Questions
- None currently open

## Working Set
- Branch: `scrollyCoding`
- Key files:
  - `lib/scrolly/types.ts` - Type definitions (DONE)
  - `lib/scrolly/index.ts` - Module exports (DONE)
  - `lib/scrolly/utils.ts` - Client-safe utilities (DONE)
  - `lib/scrolly/compile-steps.ts` - Server-side token compiler (DONE)
  - `components/ui/scrolly/ScrollyCoding.tsx` - Main component (DONE)
  - `components/ui/scrolly/ScrollyStep.tsx` - Step card (DONE)
  - `components/ui/scrolly/ScrollyContext.tsx` - State context (DONE)
  - `components/ui/scrolly/ScrollyStage.tsx` - Code stage with Magic Move (DONE)
  - `components/ui/scrolly/ScrollyServer.tsx` - Async server wrapper for MDX (DONE)
  - `components/ui/scrolly/index.ts` - Exports (DONE)
  - `lib/custom-components.tsx` - MDX component registration (DONE)
  - `content/blog/scrolly-demo.mdx` - Demo blog post (DONE)
  - `content/blog/scrolly-demo.steps.tsx` - Demo steps (DONE)
- Test: `pnpm build` passes, `/blog/scrolly-demo` included in build
- Build: Verified ✓

---

## Phase 4 Completion Notes

### What Was Built
Created `ScrollyStage.tsx` with full Shiki Magic Move integration:

1. **ShikiMagicMovePrecompiled** integration
   - Props: `steps` (KeyedTokensInfo[]), `step` (activeIndex), `animate`, `options`
   - Animation callbacks: `onStart`, `onEnd` for tracking animation state

2. **Theme-aware rendering**
   - Uses `useTheme()` from next-themes
   - Selects `stepsLight` or `stepsDark` based on `resolvedTheme`
   - Theme changes trigger re-render with correct tokens

3. **Filename badge**
   - Positioned top-right with `absolute` positioning
   - Uses `deriveFilename()` helper to generate from step or lang
   - Fades slightly during animations

4. **Focus line highlighting**
   - CSS-based approach using dynamic `<style>` injection
   - Highlights focused lines with `bg-muted` + left border
   - Dims non-focused lines to 50% opacity
   - Respects animation state (full opacity during transitions)

### Key Files Modified
- `components/ui/scrolly/ScrollyStage.tsx` - NEW: Full stage implementation
- `components/ui/scrolly/ScrollyCoding.tsx` - Replaced StagePlaceholder with ScrollyStage
- `components/ui/scrolly/index.ts` - Added ScrollyStage export
- `app/globals.css` - Added shiki-magic-move CSS import and scrolly stage styling

### ShikiMagicMovePrecompiled API (Confirmed)
```tsx
<ShikiMagicMovePrecompiled
  steps={KeyedTokensInfo[]}  // Array of precompiled tokens
  step={number}              // Current step index
  animate={boolean}          // Enable/disable animations
  options={{
    duration: number,        // Animation duration in ms
    stagger: number,         // Token stagger delay in ms
  }}
  onStart={() => void}       // Animation start callback
  onEnd={() => void}         // Animation end callback
/>
```

---

## Phase 5 Handoff: Motion Choreography

### What to Build
Add spring physics and choreographed animations for step transitions:

1. **Stage entrance animation**
   - Initial fade + scale from `lib/motion-variants.ts`
   - Spring physics for natural feel

2. **Step transition choreography**
   - Coordinate step card fade with code stage update
   - Potential: Stagger step content changes

3. **Focus line animation**
   - Smooth transition for highlight band movement
   - Consider spring-based highlight position

### Key Integration Points
- Import spring presets from `lib/motion-variants.ts`
- Use `useReducedMotion()` to disable all motion when needed
- Coordinate with Magic Move's built-in animation timing

### Files to Modify
```
components/ui/scrolly/
  ScrollyStage.tsx     - Add entrance animation
  ScrollyStep.tsx      - Refine step transition timing
  ScrollyCoding.tsx    - Orchestrate overall choreography
```

### Reference
- `lib/motion-variants.ts` - Spring presets: `springGentle`, `springBouncy`, `springSnappy`
- Motion library: `motion/react` for animations

---

## Phase 5 Completion Notes

### What Was Built
Added spring physics and choreographed animations throughout ScrollyCoding:

1. **Stage entrance animation**
   - `motion.div` wrapper with `initial={{ opacity: 0, scale: 0.98 }}`
   - Uses `springGentle` transition for natural settle
   - Respects `useReducedMotion()` - instant when preferred

2. **Step transition choreography**
   - Step cards animate with `springGentle` physics
   - Active state: opacity 1, x: 4px (subtle shift right)
   - Inactive state: opacity 0.5, x: 0
   - Left border indicator: animated width (2px → 3px when active)

3. **Focus line highlighting with CSS spring**
   - Generated CSS spring via Motion MCP: `350ms linear(0, 0.3566, ...)`
   - Applied to background-color, opacity, padding, margin transitions
   - Matches springGentle feel in pure CSS
   - Fixed selector from `.scrolly-magic-move` to `.scrolly-stage-code`

### Key Files Modified
- `components/ui/scrolly/ScrollyStage.tsx` - Entrance animation + CSS spring constant
- `components/ui/scrolly/ScrollyStep.tsx` - Spring-based step transitions

### Animation Coordination
- Stage entrance: spring (300 stiffness, 30 damping)
- Step transitions: spring (same params)
- Magic Move: duration-based (500ms with 3ms stagger)
- Focus lines: CSS spring (350ms with subtle bounce)

---

## Phase 6 Handoff: Blog Integration and TOC Strategy

### What to Build
Integrate ScrollyCoding into the blog system with proper TOC handling:

1. **MDX integration**
   - Create `<Scrolly>` wrapper component for MDX usage
   - Handle server-side compilation in blog page
   - Pass compiled tokens to client component

2. **TOC strategy**
   - Decide: hide TOC during scrolly sections, or keep visible
   - Option A: Use `position: fixed` overlay for scrolly
   - Option B: Add scrolly steps as pseudo-headings to TOC

3. **Example blog post**
   - Create `content/blog/scrolly-demo.mdx`
   - Showcase all features: multiple steps, focus lines, themes

### Key Integration Points
- `app/blog/[slug]/page.tsx` - Server component for compilation
- `lib/custom-components.tsx` - MDX component overrides
- `components/blog/StickyTOCSidebar.tsx` - May need adjustments

### Files to Create/Modify
```
content/blog/scrolly-demo.mdx          - Demo blog post
components/blog/ScrollyWrapper.tsx     - MDX wrapper (NEW)
app/blog/[slug]/page.tsx               - Add compilation
lib/custom-components.tsx              - Register Scrolly component
```

---

## Phase 6 Completion Notes

### What Was Built
Integrated ScrollyCoding into the blog MDX system:

1. **Server component wrapper (`ScrollyServer.tsx`)**
   - Async server component that compiles steps with Shiki
   - Wraps client-side `ScrollyCoding` with compiled tokens
   - Auto-warns on compilation errors in dev mode

2. **Client-safe utilities (`lib/scrolly/utils.ts`)**
   - Moved `getTokensForTheme`, `extractTokensForPrecompiled` out of server-only file
   - Types `CompiledStep`, `CompilationResult` now defined in client-safe module
   - Server file (`compile-steps.ts`) re-exports from utils for backwards compatibility

3. **MDX registration**
   - Added `Scrolly` to `lib/custom-components.tsx`
   - MDX usage: `<Scrolly steps={stepsArray} />`

4. **TOC strategy decision**
   - Kept TOC visible during scrolly sections (simplest approach)
   - Scrolly is just another content section, TOC reflects page headings
   - No modification to `RulerTOC` or `MobileFloatingTOC` needed

5. **Demo blog post**
   - Created `content/blog/scrolly-demo.mdx` - Type-safe store tutorial
   - Created `content/blog/scrolly-demo.steps.tsx` - 4-step state management example

### Key Architecture Insight
MDX components run server-side in Next.js App Router. This means:
- `<Scrolly>` is an async server component
- Shiki compilation happens at build/request time
- Client gets pre-compiled tokens (no WASM loading)

### Files Created/Modified
- `components/ui/scrolly/ScrollyServer.tsx` - NEW: Async server wrapper
- `lib/scrolly/utils.ts` - NEW: Client-safe utilities
- `lib/scrolly/compile-steps.ts` - Removed duplicate functions, re-exports from utils
- `lib/scrolly/index.ts` - Updated exports
- `components/ui/scrolly/index.ts` - Added Scrolly export
- `components/ui/scrolly/ScrollyStage.tsx` - Fixed import from utils
- `components/ui/scrolly/ScrollyCoding.tsx` - Fixed import from utils
- `lib/custom-components.tsx` - Added Scrolly component
- `content/blog/scrolly-demo.mdx` - NEW: Demo blog post
- `content/blog/scrolly-demo.steps.tsx` - NEW: Demo steps

### Build Verification
- `pnpm build` passes with no errors
- `/blog/scrolly-demo` included in static generation

---

## Phase 7 Handoff: Mobile Fallback and Performance

### What to Build
Mobile-responsive design and performance optimizations:

1. **Mobile fallback (< 768px)**
   - Currently: Stage hidden on mobile (`hidden md:block`)
   - Options:
     - A) Single-column stack with code inline between steps
     - B) Collapsible code block that expands on tap
     - C) Fixed bottom sheet with code that syncs with scroll
   - Recommendation: Option A (simplest, most accessible)

2. **Performance optimizations**
   - Lazy load Magic Move component with dynamic import
   - Consider intersection observer for step visibility
   - Memoize expensive renders in ScrollyStage

3. **Code stage improvements**
   - Horizontal scroll for wide code (currently may overflow)
   - Line number gutter (optional, off by default)
   - Copy code button

### Key Files to Modify
```
components/ui/scrolly/
  ScrollyCoding.tsx    - Mobile layout logic
  ScrollyStage.tsx     - Lazy loading, copy button
  ScrollyStep.tsx      - Mobile step card styling
```

### Mobile Layout Pattern (Option A)
```tsx
// On mobile: render stage inline after each step
{isMobile && (
  <div className="md:hidden mt-4">
    <ScrollyStage ... />
  </div>
)}
```

### Reference
- Current mobile breakpoint: `md:` (768px)
- Motion reduced motion: Already implemented
- Lazy imports: `next/dynamic` with `{ ssr: false }`

---

## Phase 7 Completion Notes

### What Was Built
Mobile fallback and performance optimizations for ScrollyCoding:

1. **Mobile layout (< 768px)**
   - Created `ScrollyStageMobile` component for inline code display
   - Each step followed by its corresponding code stage (no animation)
   - Static token rendering with theme support
   - Focus line highlighting preserved

2. **Copy to clipboard**
   - Added copy button to both desktop and mobile stages
   - Header bar with filename + copy button
   - Visual feedback ("Copied!") with 2s timeout

3. **Horizontal scroll**
   - Desktop stage: `overflow-x-auto` on code container
   - Mobile stage: Same overflow behavior
   - Wide code scrolls horizontally without breaking layout

4. **Performance optimizations**
   - `FocusLineHighlights` wrapped in `React.memo`
   - CSS style generation memoized with `useMemo`
   - Token line splitting memoized in mobile stage

### Key Files Created/Modified
- `components/ui/scrolly/ScrollyStageMobile.tsx` - NEW: Mobile-specific stage
- `components/ui/scrolly/ScrollyCoding.tsx` - Integrated mobile stages inline
- `components/ui/scrolly/ScrollyStage.tsx` - Added copy button, flex layout, memo
- `components/ui/scrolly/index.ts` - Exported ScrollyStageMobile

### Mobile Architecture
```tsx
// On mobile: each step followed by inline code
{steps.map((step, index) => (
  <div key={step.id}>
    <ScrollyStep ... />
    <div className="md:hidden">
      <ScrollyStageMobile step={step} stepIndex={index} />
    </div>
  </div>
))}
```

### Build Verification
- `pnpm build` passes with no errors
- All 20 static pages generated including `/blog/scrolly-demo`

---

## Phase 8 Handoff: QA, Accessibility, Authoring Docs

### What to Build
Final polish and documentation:

1. **Accessibility audit**
   - Keyboard navigation through steps
   - Screen reader announcements for step changes
   - ARIA labels on interactive elements
   - Focus management

2. **Visual QA**
   - Test in Chrome, Firefox, Safari
   - Test light/dark theme switching
   - Test reduced motion preference
   - Verify mobile breakpoint behavior

3. **Authoring documentation**
   - Document steps API in README or docs
   - Usage examples for MDX authors
   - Document focus line syntax
   - Troubleshooting common issues

### Key Files to Create
```
docs/scrolly-coding.md     - Authoring guide (or in content/blog/)
```

### Testing Checklist
- [ ] Desktop: Two-column layout works
- [ ] Desktop: Sticky stage tracks scroll
- [ ] Desktop: Magic Move animations play
- [ ] Desktop: Copy button works
- [ ] Mobile: Inline code stages visible
- [ ] Mobile: Each step has its code block
- [ ] Mobile: Copy button works
- [ ] Theme: Light/dark switching works
- [ ] Theme: Focus line colors adapt
- [ ] A11y: Tab navigation works
- [ ] A11y: Screen reader announces steps
- [ ] Reduced motion: Animations disabled

---

## Phase 8 Completion Notes

### What Was Built
Accessibility improvements and authoring documentation:

1. **ScrollyLiveRegion component**
   - New component for screen reader announcements
   - Uses `aria-live="polite"` to announce step changes
   - Announces "Step N of M: Title" when active step changes
   - Only announces on actual changes (not initial render)

2. **Extended ScrollyContext**
   - Added `goToNextStep()` and `goToPrevStep()` navigation helpers
   - Added `scrollyId` (via `useId()`) for unique ARIA relationships
   - Extended interface maintains backwards compatibility

3. **ScrollyStep accessibility**
   - Added `role="button"` with `aria-pressed` for active state
   - Added `tabIndex={0}` for keyboard focus
   - Added `aria-label` with "Step N of M: Title" format
   - Added keyboard handlers:
     - Arrow keys (Up/Down/Left/Right) for navigation
     - Home/End to jump to first/last step
     - Enter/Space to activate and scroll into view
   - Added focus-visible ring styling
   - Click handler activates step and scrolls into view

4. **ScrollyCoding structure**
   - Changed `<div>` to `<section>` with `aria-label` and `aria-roledescription`
   - Added `role="list"` and `role="listitem"` for step hierarchy
   - Integrated `ScrollyLiveRegion` for announcements

5. **ScrollyStage accessibility**
   - Added `role="region"` with dynamic `aria-label`
   - Added `aria-live="polite"` for code changes
   - Added unique `id` for ARIA relationships

6. **Authoring documentation**
   - Created `docs/scrolly-authoring-guide.md`
   - Covers: Quick Start, Step API, Focus Lines, Keyboard Nav
   - Includes: Mobile behavior, Customization, Troubleshooting

### Key Files Created/Modified
- `components/ui/scrolly/ScrollyLiveRegion.tsx` - NEW: Screen reader announcements
- `components/ui/scrolly/ScrollyContext.tsx` - Extended with navigation helpers
- `components/ui/scrolly/ScrollyStep.tsx` - Full keyboard + ARIA support
- `components/ui/scrolly/ScrollyCoding.tsx` - Semantic structure + live region
- `components/ui/scrolly/ScrollyStage.tsx` - ARIA region + label
- `components/ui/scrolly/index.ts` - Export ScrollyLiveRegion
- `docs/scrolly-authoring-guide.md` - NEW: Complete authoring guide

### Accessibility Features Summary
| Feature | Implementation |
|---------|---------------|
| Keyboard navigation | Arrow keys, Home/End, Enter/Space |
| Focus indicators | `focus-visible:ring-2` styling |
| Screen reader support | Live region announcements |
| ARIA roles | button, region, list, listitem |
| Reduced motion | Respects `prefers-reduced-motion` |

### Build Verification
- `pnpm build` passes with no errors
- All 20 static pages generated including `/blog/scrolly-demo`

---

## Implementation Complete

All 9 phases of the ScrollyCoding system have been implemented:

1. Phase 0: Visual direction reference
2. Phase 1: Typed steps API and data model
3. Phase 2: Shiki Magic Move compilation pipeline
4. Phase 3: Scrolly layout and active-step engine
5. Phase 4: Stage UI with Magic Move integration
6. Phase 5: Motion choreography with spring physics
7. Phase 6: Blog integration and TOC strategy
8. Phase 7: Mobile fallback and performance
9. Phase 8: QA, accessibility, authoring docs

**Ready for manual testing and review.**

---

## Post-Implementation: Full-Bleed Layout Enhancement

### Reference
Adapted layout to match Devouring Details (https://devouringdetails.com/prototypes/nextjs-dev-tools) immersive scrollytelling style.

### What Was Built

1. **Full-bleed container**
   - `w-screen` with negative margin technique (`left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]`)
   - Scrolly expands beyond article container to full viewport width
   - More immersive reading experience when entering code walkthrough

2. **Optimized column split**
   - Changed from 50/50 to 45/55 split (`md:grid-cols-[45fr_55fr]`)
   - More space for code stage, comfortable step card width
   - Smart padding that respects max content width

3. **Subtle stage background**
   - Right column (code stage) has subtle gray background (`bg-muted/30`)
   - Visual distinction between narrative and code areas
   - Matches Devouring Details aesthetic

### Files Modified
- `components/ui/scrolly/ScrollyCoding.tsx` - Full-bleed layout pattern

### CSS Pattern (Full-Bleed)
```tsx
<section className={cn(
  "relative w-screen",
  "left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]",
  "md:grid md:grid-cols-[45fr_55fr]",
  "flex flex-col"
)}>
```

---

## Post-Implementation: Hydration Fix for Mobile Stage

### Problem
Hydration mismatch error when theme colors differ between SSR and client:
- Server renders with dark theme hex colors (e.g., `#CB7676`)
- Client hydrates with resolved theme RGB colors (e.g., `rgb(171, 89, 89)`)

### Solution
Applied `mounted` state pattern to delay theme-dependent rendering:

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

const tokensInfo = useMemo(() => {
  // Use dark as default for SSR, actual theme after mount
  const theme = mounted && resolvedTheme === "light" ? "light" : "dark";
  const steps = theme === "light" ? compiledSteps.stepsLight : compiledSteps.stepsDark;
  return steps[stepIndex]?.tokens ?? null;
}, [compiledSteps, stepIndex, resolvedTheme, mounted]);
```

### Files Modified
- `components/ui/scrolly/ScrollyStageMobile.tsx` - Added mounted state pattern

### Why This Works
- Server always renders with dark theme tokens (consistent SSR)
- After hydration, `useEffect` sets `mounted=true`
- Theme-dependent rendering only happens client-side after mount
- Prevents React hydration mismatch warnings

---

## Phase 9: Canvas Controls and Fullscreen Mode

### What Was Built
Added canvas controls toolbar and fullscreen mode to ScrollyStage:

1. **StageControls component** (previously created)
   - ItsHover animated icons for all buttons
   - Fullscreen toggle (expand/collapse icons)
   - Copy code button
   - Copy link button (generates URL with step hash)
   - Motion entrance animation with spring physics
   - Fully accessible with ARIA labels

2. **StageFullscreen component** (previously created)
   - Portal-based modal rendering to document.body
   - Escape key to close
   - Click outside to dismiss
   - Body scroll lock with scrollbar compensation
   - Spring animations (reduced motion aware)

3. **ScrollyStage integration**
   - Replaced inline copy button with StageControls toolbar
   - Added fullscreen state management
   - Copy link generates URL hash: `#step-{id}`
   - "Copied!" feedback appears next to filename
   - Fullscreen renders same Magic Move content in modal

### Files Modified
- `components/ui/scrolly/ScrollyStage.tsx` - Integrated StageControls + StageFullscreen

### Key Props Added to ScrollyStage
```tsx
interface ScrollyStageProps {
  showControls?: boolean;    // Default: true
  showCopyLink?: boolean;    // Default: true
}
```

### Build Status
- `pnpm build` passes
- All 20 static pages generated
