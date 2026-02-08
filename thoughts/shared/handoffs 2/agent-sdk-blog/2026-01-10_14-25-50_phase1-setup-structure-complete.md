---
date: 2026-01-10T07:25:50Z
session_name: agent-sdk-blog
researcher: Claude
git_commit: 3da7397
branch: scrollyCoding
repository: porfolio-26
topic: "Claude Agent SDK Deep Research Tutorial - Phase 1 Complete"
tags: [agent-sdk, blog, scrollycoding, phase-1, setup]
status: phase_1_complete
last_updated: 2026-01-10
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: Phase 1 Complete - Setup & Structure

## Task(s)

| Task | Status |
|------|--------|
| Phase 1: Setup & Structure | ✅ Completed |
| Phase 2: Core Content (expand intro, V2 callouts) | 🔲 Not started |
| Phase 3: React Flow Architecture Diagrams | 🔲 Not started |
| Phase 4: Polish & Test | 🔲 Not started |

**Current Phase**: Phase 1 complete, ready for Phase 2

**Working from**: `thoughts/shared/plans/2026-01-10-agent-sdk-blog-tutorial.md`

## Critical References

1. **Implementation Plan**: `thoughts/shared/plans/2026-01-10-agent-sdk-blog-tutorial.md`
2. **Continuity Ledger**: `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md`
3. **SDK Reference**: `agents-sdk.md` (V1 patterns verified against this)

## Recent changes

- `app/canvas-test/` - Deleted entire directory (was test page, now replaced by real content)
- `content/blog/agent-sdk-deep-research.mdx:1-50` - Created MDX blog post with frontmatter, intro, Scrolly import, and V2 callout
- `content/blog/agent-sdk-deep-research.steps.tsx:1-150` - Created 8 ScrollyCoding steps with progressive code examples
- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md:28-41` - Updated State section to mark Phase 1 complete

## Learnings

### ScrollyCoding Pattern
- Steps file exports array of `ScrollyCodeStep` objects from `@/lib/scrolly/types`
- Each step requires: `id`, `title`, `body` (string), `code`, `lang`, `file`, `focusLines`
- MDX imports the steps and passes to `<Scrolly steps={...} />`
- Reference pattern: `content/blog/scrolly-demo.mdx` + `content/blog/scrolly-demo.steps.tsx`

### SDK V1 Patterns (verified against agents-sdk.md)
- `query()` returns async generator streaming messages
- Key options: `model`, `allowedTools`, `maxTurns`, `permissionMode`, `outputFormat`, `agents`
- Message types: `"system"` (init), `"assistant"` (tool use/text), `"result"` (final)
- Subagents defined in `agents` config as `AgentDefinition` objects
- Custom tools use `createSdkMcpServer()` + `tool()` decorator

### Custom Components Registration
- `Scrolly` registered at `lib/custom-components.tsx:243`
- `Callout` (from fumadocs-ui) registered at `lib/custom-components.tsx:200`
- No modifications needed - both already available in MDX

## Post-Mortem

### What Worked
- **Reference-first approach**: Reading `scrolly-demo.mdx` and `scrolly-demo.steps.tsx` first gave exact patterns to follow
- **SDK doc verification**: Cross-referenced `agents-sdk.md` to ensure code examples are accurate V1 patterns
- **Build verification**: Running `pnpm build` immediately after file creation caught any issues early

### What Failed
- Nothing significant - Phase 1 was straightforward structure setup

### Key Decisions
- **Decision**: Use `ScrollyCodeStep` (legacy format) instead of new `ScrollyStep` format
  - Alternatives: New `ScrollyStep` with `stage: { type: "code", ... }`
  - Reason: Matches existing `scrolly-demo.steps.tsx` pattern, less migration risk

- **Decision**: Include one V2 callout in the MDX now (after architecture section)
  - Alternatives: Wait for Phase 2 to add all callouts
  - Reason: Validates Callout component works with this content

## Artifacts

### Created
- `content/blog/agent-sdk-deep-research.mdx` - Main blog post (50 lines)
- `content/blog/agent-sdk-deep-research.steps.tsx` - 8 ScrollyCoding steps (150 lines)

### Updated
- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - Phase 1 marked complete

### Deleted
- `app/canvas-test/` - Entire directory removed

### Verified (no changes needed)
- `lib/custom-components.tsx` - Scrolly and Callout already registered

## Action Items & Next Steps

### Phase 2: Core Content
1. Expand introduction section with more context on what a Deep Research Agent does
2. Add V2 callout boxes after Steps 1, 2, and 7 (currently only one callout exists)
3. Review and potentially expand step body text for educational depth
4. Add Prerequisites section with code block for CLI installation

### Phase 3: Interactive Demo (depends on Phase 2)
1. Install React Flow: `pnpm add @xyflow/react`
2. Create `components/demos/AgentArchitectureDiagram.tsx` with React Flow
3. Style nodes with Swiss minimalism (OKLCH colors, Geist font, 2px border-radius)
4. Create 3 diagram states: orchestrator, parallel work, synthesis
5. Add CanvasZone stepped mode section to blog post

### Phase 4: Polish & Test
1. Write "What's Next" section with extension ideas
2. Run `pnpm build` final verification
3. Manual test: scroll interactions, theme switching, mobile layout

## Other Notes

### Key File Locations
- Blog content: `content/blog/`
- ScrollyCoding components: `components/ui/scrolly/`
- Canvas components: `components/blog/CanvasZone.tsx`, `CanvasStep.tsx`
- Custom MDX components: `lib/custom-components.tsx`
- Type definitions: `lib/scrolly/types.ts`

### Build Status
- `pnpm build` passes with blog post rendering at `/blog/agent-sdk-deep-research`
- 22 static pages generated successfully

### V2 SDK Quick Reference (for callouts)
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
