---
date: 2026-01-10T16:11:31+0700
session_name: agent-sdk-blog
researcher: Claude
git_commit: 3da7397
branch: scrollyCoding
repository: porfolio-26
topic: "Claude Agent SDK Deep Research Tutorial - Phase 3 Complete"
tags: [agent-sdk, blog, react-flow, architecture-diagram, phase-3]
status: phase_3_complete
last_updated: 2026-01-10
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: Phase 3 Complete - React Flow Architecture Diagrams

## Task(s)

| Task | Status |
|------|--------|
| Phase 1: Setup & Structure | Completed |
| Phase 2: Core Content (expand intro, V2 callouts) | Completed |
| Phase 3: React Flow Architecture Diagrams | Completed |
| Phase 4: Polish & Test | Not started |

**Current Phase**: Phase 3 complete, ready for Phase 4

**Working from**: `thoughts/shared/plans/2026-01-10-agent-sdk-blog-tutorial.md`

## Critical References

1. **Implementation Plan**: `thoughts/shared/plans/2026-01-10-agent-sdk-blog-tutorial.md`
2. **Continuity Ledger**: `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md`
3. **Previous Handoff**: `thoughts/shared/handoffs/agent-sdk-blog/2026-01-10_14-40-40_phase2-content-complete.md`

## Recent changes

- `components/demos/AgentArchitectureDiagram.tsx` - Created React Flow diagram with 3 step states, Swiss minimalism styling
- `components/demos/AgentArchitectureDemo.tsx` - Created self-contained stepped demo component (no BlogWithCanvas dependency)
- `lib/custom-components.tsx:25-28` - Added imports for CanvasZone, CanvasStep, AgentArchitectureDiagram, AgentArchitectureDemo
- `lib/custom-components.tsx:248-253` - Registered new MDX components
- `content/blog/agent-sdk-deep-research.mdx:51` - Added `<AgentArchitectureDemo />` component
- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md:28-41` - Updated State to mark Phase 3 complete
- `package.json` - Added `@xyflow/react` dependency

## Learnings

### MDX Function Props Limitation
- **Critical**: MDX cannot pass functions as props to components (they can't be serialized for SSR)
- **Error**: "Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'"
- **Solution**: Create self-contained wrapper components that manage render functions internally
- See: `components/demos/AgentArchitectureDemo.tsx` - handles `canvasContent={(step) => ...}` internally

### CanvasZone Context Requirement
- `CanvasZone` requires `BlogWithCanvas` provider context
- **Error**: "useCanvasLayout must be used within BlogWithCanvas"
- **Solution**: For simple blog posts without BlogWithCanvas, create standalone components that don't use CanvasZone
- The blog page at `app/blog/[slug]/page.tsx` uses SiteShell, not BlogWithCanvas

### React Flow Type Constraints
- Node data interfaces must extend `Record<string, unknown>` for React Flow v12 compatibility
- **Pattern**: `interface SwissNodeData extends Record<string, unknown> { ... }`
- Node types need explicit string literal: `type SwissNode = Node<SwissNodeData, "swiss">`

### Swiss Minimalism in React Flow
- Use CSS variables (`--border`, `--primary`, `--secondary`) for automatic dark mode support
- Handle elements: `!w-1.5 !h-1.5 !bg-border !border-0`
- Node borders: `2px` radius, `1px` stroke
- Typography: 11px uppercase, 600 weight, 0.05em letter-spacing

## Post-Mortem

### What Worked
- **Self-contained component approach**: Creating `AgentArchitectureDemo` with internal state management bypassed both the MDX function-prop limitation and the BlogWithCanvas context requirement
- **CSS variable-based theming**: Using design system variables (`--border`, `--primary`) for React Flow node styles enabled automatic dark mode without extra logic
- **Context7 MCP for React Flow docs**: Got current API patterns quickly for v12 (node types, edge configs)

### What Failed
- **Initial CanvasZone approach**: Tried to use CanvasZone directly in MDX with render function prop - failed on build due to SSR serialization
- **BlogWithCanvas assumption**: Assumed blog pages had BlogWithCanvas provider - they use SiteShell instead

### Key Decisions
- **Decision**: Create standalone `AgentArchitectureDemo` instead of using CanvasZone
  - Alternatives: Wrap blog page with BlogWithCanvas, use client-side dynamic import
  - Reason: Simpler, self-contained, no changes to blog page infrastructure required

- **Decision**: Embed step content in component rather than MDX children
  - Alternatives: Accept children and parse them programmatically
  - Reason: Full control over layout, avoids MDX serialization issues

## Artifacts

### Created
- `components/demos/AgentArchitectureDiagram.tsx` - React Flow diagram component (3 states)
- `components/demos/AgentArchitectureDemo.tsx` - Self-contained stepped demo with internal state

### Updated
- `lib/custom-components.tsx:25-28, 248-253` - MDX component registrations
- `content/blog/agent-sdk-deep-research.mdx:51` - Added architecture demo
- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - State update
- `package.json` - Added @xyflow/react dependency

## Action Items & Next Steps

### Phase 4: Polish & Test
1. **Run code-simplifier agent** - Review all changes for clarity and consistency (user explicitly requested this)
2. **Manual testing** - Start dev server, verify:
   - ScrollyCoding animates between 8 steps correctly
   - AgentArchitectureDemo step transitions work on click
   - Theme switching (light/dark) works for diagram
   - Mobile layout shows stacked diagram per step
3. **Final build verification** - `pnpm build` (already passing as of this handoff)

### Optional Enhancements
- Add subtle animation to React Flow node transitions between steps (currently instant)
- Consider adding keyboard navigation to AgentArchitectureDemo (arrow keys)

## Other Notes

### Key File Locations
- Blog content: `content/blog/agent-sdk-deep-research.mdx`
- ScrollyCoding steps: `content/blog/agent-sdk-deep-research.steps.tsx`
- React Flow diagram: `components/demos/AgentArchitectureDiagram.tsx`
- Demo wrapper: `components/demos/AgentArchitectureDemo.tsx`
- MDX components: `lib/custom-components.tsx`
- Design system: `app/globals.css` (OKLCH colors, CSS variables)

### Current Blog Structure
```
1. Introduction (expanded with context)
2. What We're Building
3. Prerequisites
4. Building the Agent (ScrollyCoding - 8 steps)
5. The Architecture in Action (AgentArchitectureDemo - 3 steps)
6. V2 Preview: What's Changing (3 callouts)
7. What's Next
8. Resources
```

### Build Status
- `pnpm build` passes (22 static pages generated)
- TypeScript: No errors
- Blog renders at `/blog/agent-sdk-deep-research`
