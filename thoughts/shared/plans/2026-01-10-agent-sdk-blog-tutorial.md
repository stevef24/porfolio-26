# Plan: Claude Agent SDK Tutorial Blog Post

## Overview

Create a comprehensive blog post teaching developers how to build a Deep Research Agent using the Anthropic Claude Agent SDK (V1, stable). The post will be placed in `content/blog/` as a real blog entry with interactive CanvasZone/CanvasStep components for code walkthroughs.

**Key Adjustments:**
- Focus on V1 SDK (stable `query()` API) with callout notes about V2 changes
- Real blog post at `content/blog/agent-sdk-deep-research.mdx`
- Delete `app/canvas-test/` (replaced by this real content)
- Use both ScrollyCoding and CanvasZone with stepped mode for variety

---

## Files to Create/Modify

### Create
1. `content/blog/agent-sdk-deep-research.mdx` - Main blog post
2. `content/blog/agent-sdk-deep-research.steps.tsx` - ScrollyCoding steps (8 progressive code examples)
3. `components/demos/AgentSDKDemo.tsx` - Interactive demo components for CanvasZone stepped mode

### Delete
4. `app/canvas-test/` - Remove test page (replaced by real blog content)

### Verify
5. `lib/custom-components.tsx` - Ensure `Scrolly` and `Callout` are registered
6. `components/blog/CanvasZone.tsx` - Verify stepped mode works

---

## Content Structure

### Blog Post Outline

```
1. Introduction
   - What is the Claude Agent SDK?
   - Why build a deep research agent?
   - What we'll build (preview)

2. Prerequisites
   - Node.js 18+, API key setup
   - Package installation

3. [SCROLLY] Building the Agent (8 steps)
   - Step 1: Hello Agent - Your First Query
   - Step 2: Configuring Agent Behavior
   - Step 3: Building Custom Tools
   - Step 4: Structured Output for Reports
   - Step 5: Subagent Architecture - The Searcher
   - Step 6: Multi-Agent Pipeline
   - Step 7: Streaming and Progress Tracking
   - Step 8: Production-Ready Agent

4. [CANVAS ZONE DEMO] Architecture Visualization
   - Stepped mode showing orchestrator → subagents flow
   - Visual diagrams that update with scroll

5. V2 Preview Notes
   - What's changing in V2
   - Migration path

6. What's Next
   - Extend with more tools
   - Production deployment
   - Resources
```

---

## Step Definitions (ScrollyCoding)

| Step | ID | Title | Focus Lines | V2 Note |
|------|----|-------|-------------|---------|
| 1 | `hello-agent` | Hello Agent | Lines 1-12 | V2: `unstable_v2_prompt()` |
| 2 | `agent-config` | Configuration | Lines 5-15 | V2: Options in `createSession()` |
| 3 | `custom-tools` | Custom Tools | Lines 18-35 | Same in V2 |
| 4 | `structured-output` | Structured Output | Lines 10-30 | Same in V2 |
| 5 | `subagent-searcher` | Searcher Subagent | Lines 20-35 | Same pattern |
| 6 | `multi-agent` | Multi-Agent Pipeline | Lines 25-50 | Same pattern |
| 7 | `streaming` | Streaming Progress | Lines 15-40 | V2: `session.stream()` |
| 8 | `production` | Production Agent | Full file | Class pattern |

---

## V1 vs V2 Callout Strategy

Add `<Callout type="info" title="V2 Preview">` boxes after relevant sections:

**Step 1 (Hello Agent):**
> In V2 (unstable preview), one-shot prompts use `unstable_v2_prompt()`:
> ```ts
> const result = await unstable_v2_prompt('What is 2+2?', { model: 'sonnet' })
> ```

**Step 2 (Configuration):**
> In V2, options are passed to `unstable_v2_createSession()`:
> ```ts
> const session = unstable_v2_createSession({ model: 'sonnet' })
> ```

**Step 7 (Streaming):**
> V2 separates sending and streaming:
> ```ts
> await session.send('Research this topic')
> for await (const msg of session.stream()) { ... }
> ```

---

## CanvasZone Stepped Demo

Create a 3-step architecture visualization using **React Flow** for node-based diagrams:

1. **Orchestrator** - Central coordinator receives research request
2. **Subagents Working** - source-finder, content-analyst, fact-checker in parallel
3. **Synthesis** - Final report generation with citations

**Diagram Library**: React Flow (`@xyflow/react`)
- Minimal node styling with OKLCH colors
- Clean connecting lines (no arrows, simple strokes)
- Swiss-style labels (Geist font, uppercase, 11px)
- Subtle animation on step transitions

**Example node styling**:
```tsx
const nodeStyle = {
  background: "oklch(0.98 0 0)",     // Near-white
  border: "1px solid oklch(0.85 0 0)", // Light gray
  borderRadius: "2px",                // Minimal rounding
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}
```

Use `CanvasZone mode="stepped"` with `CanvasStep` components.

---

## Writing Style Guidelines

Based on analysis of existing posts, match these patterns:

- **Personal and approachable**: "When I first learned about...", "Let me show you..."
- **Layered complexity**: Start simple, add concepts progressively
- **Before/after code pairs**: Show the problem first, then the solution
- **Honest about trade-offs**: "This approach has limitations..."
- **Analogies**: "Think of the SDK as a control panel for your agent"
- **Production-aware**: Consider scaling, cost, error handling

---

## Implementation Phases

### Phase 1: Setup & Structure
- [ ] Delete `app/canvas-test/` directory
- [ ] Create `content/blog/agent-sdk-deep-research.mdx` with frontmatter
- [ ] Create `content/blog/agent-sdk-deep-research.steps.tsx` with 8 steps
- [ ] Verify `lib/custom-components.tsx` has Scrolly + Callout

### Phase 2: Core Content
- [ ] Write Introduction section (What + Why)
- [ ] Write Prerequisites section
- [ ] Implement ScrollyCoding with all 8 steps
- [ ] Add V2 callout boxes after Steps 1, 2, and 7

### Phase 3: Interactive Demo
- [ ] Install React Flow: `pnpm add @xyflow/react`
- [ ] Create `components/demos/AgentArchitectureDiagram.tsx` with React Flow
- [ ] Style nodes with Swiss minimalism (OKLCH, Geist font, minimal borders)
- [ ] Create 3 diagram states (orchestrator, parallel work, synthesis)
- [ ] Add CanvasZone stepped mode section to blog post
- [ ] Wire up CanvasStep components with RenderCanvas for diagram transitions

### Phase 4: Polish & Test
- [ ] Write V2 Preview Notes section
- [ ] Write What's Next section
- [ ] Run `pnpm build` to verify compilation
- [ ] Manual test: scroll interactions, theme switching, mobile layout

---

## Code Examples Summary

**Step 1: Hello Agent (~15 lines)**
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk"

async function main() {
  for await (const message of query({
    prompt: "What are the key trends in AI?",
    options: { model: "sonnet" }
  })) {
    if (message.type === "assistant") {
      // Handle response
    }
  }
}
```

**Step 8: Production Agent (~180 lines)**
- Config and result types
- Error handling in tools
- Timeout with fallback model
- Cost tracking and limits

---

## Verification Checklist

- [ ] Blog post renders at `/blog/agent-sdk-deep-research`
- [ ] ScrollyCoding animates between 8 steps
- [ ] Focus lines highlight correctly
- [ ] CanvasZone stepped demo works
- [ ] V2 callout boxes display properly
- [ ] Light/dark theme works
- [ ] Mobile layout displays inline code
- [ ] Copy code button works
- [ ] `pnpm build` passes with no errors

---

## Dependencies

- Existing: ScrollyCoding, CanvasZone, CanvasStep, CodeCanvas, RenderCanvas
- **New**: `@xyflow/react` (React Flow v12) for architecture diagrams
- External: None (SDK code is illustrative, not executable in browser)

**Install command**:
```bash
pnpm add @xyflow/react
```

---

## Risk Mitigation

1. **Code correctness**: All SDK examples based on official V1 docs + the V2 preview page
2. **Canvas integration**: Following proven patterns from scrolly-demo and canvas-test
3. **Content accuracy**: V1 patterns verified against `agents-sdk.md` reference file

---

## Estimated Output

- Blog post: ~1500-2000 words of prose
- Code steps: 8 examples, ~15-180 lines each
- Interactive elements: 1 ScrollyCoding + 1 CanvasZone demo
- V2 callouts: 3-4 info boxes
