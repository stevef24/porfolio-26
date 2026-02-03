---
date: 2026-01-10T07:10:56Z
session_name: agent-sdk-blog
researcher: Claude
git_commit: 3da7397
branch: scrollyCoding
repository: porfolio-26
topic: "Claude Agent SDK Deep Research Tutorial Blog Post"
tags: [agent-sdk, blog, scrollycoding, canvas-zone, react-flow, tutorial]
status: planning_complete
last_updated: 2026-01-10
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: Agent SDK Blog Tutorial - Planning Complete

## Task(s)

| Task | Status |
|------|--------|
| Research V1/V2 SDK documentation | ✅ Completed |
| Analyze user's writing style from existing blogs | ✅ Completed |
| Research deep research agent patterns | ✅ Completed |
| Explore CanvasZone/ScrollyCoding components | ✅ Completed |
| Create comprehensive implementation plan | ✅ Completed |
| Create new continuity ledger | ✅ Completed |
| Implementation Phase 1-4 | 🔲 Not started |

**Current Phase**: Planning complete, ready for implementation

## Critical References

1. **Implementation Plan**: `thoughts/shared/plans/2026-01-10-agent-sdk-blog-tutorial.md`
2. **Continuity Ledger**: `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md`
3. **V2 SDK Documentation**: https://platform.claude.com/docs/en/agent-sdk/typescript-v2-preview

## Recent changes

- `thoughts/shared/plans/2026-01-10-agent-sdk-blog-tutorial.md` - Created comprehensive 4-phase implementation plan
- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - Created new continuity ledger for this work stream

## Learnings

### SDK Architecture
- **V1 (stable)**: Uses `query()` async generator pattern, `ClaudeAgentOptions`, `@tool` decorator
- **V2 (unstable preview)**: Separates `send()` and `stream()`, uses `unstable_v2_createSession()`
- Tutorial should focus on V1 with V2 callout boxes for future-proofing

### User Writing Style (from existing blog analysis)
- Personal and approachable ("When I first learned...", "Let me show you...")
- Layers complexity progressively (simple → advanced)
- Honest about trade-offs
- Uses analogies for complex concepts
- Production-aware (scaling, cost, error handling)

### Canvas System Architecture
- `CanvasZone mode="stepped"` with `CanvasStep` components for scroll-triggered content
- `ScrollyCoding` with `compileScrollySteps()` for code walkthroughs
- `CodeCanvas` for animated code, `RenderCanvas` for static content
- Mobile: inline rendering, Desktop: fixed sidebar

### Deep Research Agent Patterns
- Orchestrator → Subagent architecture (source-finder, content-analyst, fact-checker)
- Structured output with JSON Schema for reports
- Citation verification pipeline
- Cost tracking and execution limits

## Post-Mortem

### What Worked
- **Parallel agent research**: Launched 4-6 agents simultaneously to gather SDK docs, deep research patterns, writing style, and canvas architecture
- **Context7 + WebFetch combo**: Got V2 SDK docs directly from the platform URL
- **Existing pattern reuse**: scrolly-demo.mdx and canvas-test page provided clear templates to follow

### What Failed
- **Python vs TypeScript confusion**: Plan agent initially generated Python examples, but user blog uses TypeScript - had to clarify
- **React Flow not installed**: Will need `pnpm add @xyflow/react` in Phase 3

### Key Decisions
- **Decision**: Use V1 SDK as main tutorial, V2 as callout boxes
  - Alternatives: V2-only, dual tutorials
  - Reason: V2 is "unstable preview" - V1 is production-ready

- **Decision**: Use React Flow for architecture diagrams
  - Alternatives: Mermaid, custom SVG, Excalidraw
  - Reason: Interactive, customizable with Tailwind, fits Swiss minimalism

- **Decision**: Delete `app/canvas-test/` and replace with real blog content
  - Alternatives: Keep test page separate
  - Reason: User wants to test canvas with realistic educational content

## Artifacts

### Plans
- `thoughts/shared/plans/2026-01-10-agent-sdk-blog-tutorial.md` - Full implementation plan with 4 phases

### Ledgers
- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - Session continuity

### Research Outputs (cached)
- `.claude/cache/agents/research-agent/latest-output.md` - Deep research agent patterns

### Reference Files (existing)
- `agents-sdk.md` - Original V1 SDK guide (user provided, outdated)
- `content/blog/scrolly-demo.mdx` - Example ScrollyCoding blog post
- `content/blog/scrolly-demo.steps.tsx` - Example step definitions

## Action Items & Next Steps

### Phase 1: Setup & Structure
1. Delete `app/canvas-test/` directory
2. Create `content/blog/agent-sdk-deep-research.mdx` with frontmatter
3. Create `content/blog/agent-sdk-deep-research.steps.tsx` with 8 step definitions
4. Verify `lib/custom-components.tsx` has Scrolly + Callout registered

### Phase 2: Core Content
1. Write Introduction section (What is SDK, Why research agent, Preview)
2. Write Prerequisites section (Node.js, API key, packages)
3. Implement 8 ScrollyCoding steps with focus lines
4. Add V2 callout boxes after Steps 1, 2, and 7

### Phase 3: Interactive Demo
1. Install React Flow: `pnpm add @xyflow/react`
2. Create `components/demos/AgentArchitectureDiagram.tsx`
3. Style nodes with Swiss minimalism (OKLCH, Geist font)
4. Create 3 diagram states (orchestrator, parallel work, synthesis)
5. Wire up CanvasZone stepped mode with RenderCanvas

### Phase 4: Polish & Test
1. Write V2 Preview Notes section
2. Write What's Next section
3. Run `pnpm build` to verify
4. Manual test: scroll interactions, theme switching, mobile

## Other Notes

### Key Directories
- Blog content: `content/blog/`
- ScrollyCoding components: `components/ui/scrolly/`
- Canvas components: `components/blog/CanvasZone.tsx`, `CanvasStep.tsx`
- Custom MDX components: `lib/custom-components.tsx`

### V2 SDK Functions (for callouts)
```typescript
// One-shot
unstable_v2_prompt(prompt, options)

// Sessions
unstable_v2_createSession(options)
unstable_v2_resumeSession(sessionId, options)

// Session methods
session.send(message)
session.stream() // AsyncGenerator
session.close()
```

### Swiss Styling for React Flow Nodes
```tsx
const nodeStyle = {
  background: "oklch(0.98 0 0)",
  border: "1px solid oklch(0.85 0 0)",
  borderRadius: "2px",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}
```
