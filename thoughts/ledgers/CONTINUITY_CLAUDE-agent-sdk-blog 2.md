# Session: agent-sdk-blog
Updated: 2026-01-23T10:38:16.366Z

## Goal
Create a comprehensive blog post teaching developers to build a Deep Research Agent using the Claude Agent SDK. Done when:
- Blog post at `/blog/agent-sdk-deep-research` renders correctly
- 8-step CanvasZone walkthrough animates between code examples (using BlogWithCanvas)
- V2 callout boxes display with preview notes
- AgentArchitectureDemo shows in static canvas zone
- Mobile layout works (inline code/diagrams)
- `pnpm build` passes with no errors ✓

## Constraints
- Use Claude Agent SDK V1 (stable `query()` API) as main content
- Add V2 preview notes as callout boxes (not the main tutorial)
- TypeScript for all code examples
- Swiss minimalism styling (OKLCH, Geist font, minimal borders)
- Match user's writing tone (personal, approachable, production-aware)
- Real blog post in `content/blog/` (not a test page)

## Key Decisions
- **Language**: TypeScript (matches docs and user's blog style)
- **Architecture diagrams**: React Flow (`@xyflow/react`) with Swiss styling
- **V2 callouts**: After Steps 1, 2, and 7 only
- **Delete canvas-test**: Replace with real educational content
- **Example agent**: Deep Research Agent (search, extract, synthesize)

## State
- Done:
  - [x] Research V1/V2 SDK documentation
  - [x] Analyze user's writing style from existing blogs
  - [x] Research deep research agent patterns
  - [x] Explore CanvasZone/ScrollyCoding components
  - [x] Create implementation plan
  - [x] Phase 1: Delete canvas-test, create MDX + steps files
  - [x] Phase 2: Expand intro, add V2 callouts after Steps 1, 2, 7
  - [x] Phase 3: Create React Flow architecture diagrams
  - [x] Phase 4: Remove ScrollyCoding, use BlogWithCanvas exclusively
  - [x] **Canvas Redesign Phase 1:** Remove Architecture Section & Cleanup
  - [x] **Canvas Redesign Phase 2:** Shiki Infrastructure
  - [x] **Canvas Redesign Phase 3:** Redesign Canvas Header
  - [x] **Canvas Redesign Phase 4:** Multi-File Tab Support
    - Extended step interface with `files[]` array for multi-file steps
    - Added clickable file tabs UI with active state
    - Reset active file index on step change
  - [x] **Canvas Redesign Phase 5:** Code/Preview Toggle (removed - not applicable for code tutorials)
  - [x] **Canvas Redesign Phase 6:** Fullscreen Mode
    - Portal-based overlay with escape key listener
    - File tabs and copy button in fullscreen
    - Body scroll lock when active
  - [x] **Canvas Redesign Phase 7:** Clean Styling
    - Added `.code-content` CSS class for Shiki HTML
    - Dark mode theme switching via CSS variables
    - Focus line highlighting
  - [x] **Canvas Redesign Phase 8:** Light/Dark Mode Testing (CSS configured)
  - [x] **Bug Fix:** Shiki highlighting not visible
    - Changed MDX to use `AgentCodeWalkthroughServer` (compiles with Shiki)
    - Was using client component that only renders pre-compiled HTML
- Done (Visual Polish):
  - [x] Canvas visual redesign ("Terminal Elegance" design)
    - Updated CSS variables for warm parchment (light) and deep charcoal (dark)
    - Header bar with filename and toolbar icons
    - Refined syntax highlighting colors (OKLCH)
    - Subtle elevation and shadow effects
  - [x] Visual testing in browser (light/dark, tabs, step tracking)
  - [x] Canvas expansion animation (width from 0 to 50vw, overlays content)
  - [x] **Visual Indicators (2026-01-12):**
    - Sliding underline for multi-file tabs (Motion `layoutId`)
    - File change animation for single-file steps (slide + pulse)
    - Step indicator badge (`1/8` format)
    - Fixed Scrolly import for legacy blog posts
  - [x] **Step Opacity Highlighting (2026-01-12):**
    - Active step at full opacity, inactive at 0.45
    - Hover reveals dimmed steps to 0.75
    - CSS-only approach with 280ms ease-out transition
    - Reduced motion support
  - [x] **Blog Column Slide Fix (2026-01-12):**
    - Restored slide-left animation when canvas activates
    - Blog shifts -25vw, canvas expands to 50vw
    - Both animate with synchronized transition
  - [x] **RulerTOC Redesign (2026-01-12):**
    - Devouring Details inspired design
    - Triangle marker (▶) for active section
    - Ultra-thin 1px ruler lines
    - Snappy spring animations (150ms)
    - Scrollable expanded view with fade masks
    - Hidden scrollbar CSS utility
- Done (V2PreviewCallout):
  - [x] V2 callout elevated cards - Labs Terminal aesthetic
    - Left accent bar with olive green glow
    - Pulsing dot indicator, monospace badges
    - Uses Oatmeal Design System colors (hue 125)
  - [x] **Centered Floating Navbar (2026-01-12):**
    - Transformed full-width navbar into centered floating pill
    - `fixed top-4 left-1/2 -translate-x-1/2` positioning
    - `bg-background/80 backdrop-blur-xl rounded-full`
    - Preserved sidebar variant for courses section
    - Unique layoutIds per variant to prevent animation conflicts
  - [x] **V2PreviewCallout Color Fix (2026-01-12):**
    - Issue: Cached orange color from previous build
    - Fix: Cleared `.next` cache, verified olive green (hue 125)
  - [x] **Canvas/Column Exit Timing Fix (2026-01-12):**
    - Changed AnimatePresence `mode="wait"` to `mode="sync"`
    - Blog column shift and canvas close now animate simultaneously
  - [x] **TOC Simplification (2026-01-16):**
    - Deleted: RulerTOC (398 lines), MobileFloatingTOC (455 lines), StickyTOCSidebar (163 lines)
    - Created: SectionIndicator (~95 lines) - minimal AI Hero-inspired sticky indicator
    - Net reduction: ~920 lines removed
  - [x] **Canvas Step Transition Timing (2026-01-16):**
    - Transition lock: 500ms → 200ms (faster step changes)
    - Activation band: -45% → -35% (wider trigger zone)
    - Step detection: -40% → -30% (earlier detection)
    - Content reveal delay: 150ms → 50ms (snappier content)
- Now: [→] Ready for visual testing
- Remaining:
  - [ ] Test SectionIndicator animation in browser
  - [ ] Test canvas step transitions feel instant
  - [ ] Mobile testing

## Open Questions
- None currently open

## Working Set
- Branch: `scrollyCoding` (continue on same branch)
- Plan: `thoughts/shared/plans/2026-01-10-agent-sdk-blog-tutorial.md` (superseded)
- Key files created/modified:
  - `content/blog/agent-sdk-deep-research.mdx` - Main blog post (using BlogWithCanvas)
  - `content/blog/agent-sdk-deep-research.steps.tsx` - 8 code steps for CanvasCodeStage
  - `components/blog/CanvasCodeStage.tsx` - Code display for canvas sidebar
  - `components/blog/CanvasStep.tsx` - Step wrapper with opacity highlighting
  - `components/blog/BlogWithCanvas.tsx` - Layout orchestrator with column slide animation (line 539: AnimatePresence mode="sync")
  - `components/blog/AgentCodeWalkthrough.tsx` - MDX wrapper for stepped walkthrough
  - `components/layout/Navbar.tsx` - Redesigned floating pill navbar (two variants)
  - `lib/custom-components.tsx` - Updated exports
  - `app/globals.css` - Canvas step opacity CSS, TOC scroll container (lines 1340-1432)
  - `components/ui/blog/SectionIndicator.tsx` - Minimal AI Hero-inspired section indicator
- Key files deleted:
  - `components/ui/scrolly/*` - All ScrollyCoding components
  - `lib/scrolly/*` - ScrollyCoding utilities
  - `content/blog/projected-drag.*`, `scrolly-demo.*`, `example-scrolly.*`
  - `content/tutorials/react-basics.steps.tsx`
  - `components/ui/blog/RulerTOC.tsx` - Replaced with SectionIndicator
  - `components/ui/blog/MobileFloatingTOC.tsx` - Replaced with SectionIndicator
  - `components/ui/blog/StickyTOCSidebar.tsx` - Removed (courses use sidebar nav instead)
- Test: `pnpm build` passes ✓

---

## Research Summary

### V1 SDK Core Concepts
- `query()` - Async generator for agent invocation
- `ClaudeAgentOptions` - Configuration (model, tools, limits)
- `@tool` decorator + `create_sdk_mcp_server` - Custom MCP tools
- `agents` config - Subagent definitions
- `output_format` + JSON Schema - Structured output
- Message types: `AssistantMessage`, `SystemMessage`, `ResultMessage`

### V2 SDK Changes (Unstable Preview)
- `unstable_v2_prompt()` - One-shot prompts
- `unstable_v2_createSession()` / `unstable_v2_resumeSession()` - Session management
- `session.send()` / `session.stream()` - Separated input/output
- `await using` - TypeScript 5.2+ automatic cleanup

### Deep Research Agent Architecture
- Orchestrator → Subagent pattern
- Specialists: source-finder, content-analyst, fact-checker
- Structured output with JSON Schema for reports
- Cost tracking and execution limits

### User Writing Style
- Personal and approachable ("When I first learned...", "Let me show you...")
- Layered complexity (start simple, add concepts)
- Honest about trade-offs
- Production-aware (scaling, cost, errors)
- Uses analogies ("Think of it like...")
