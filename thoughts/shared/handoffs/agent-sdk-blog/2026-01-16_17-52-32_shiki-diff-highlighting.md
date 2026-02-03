---
date: 2026-01-16T17:52:32-08:00
session_name: agent-sdk-blog
researcher: Claude
git_commit: e55ce8062adb4ec7ae96e44cc47ac8d6aafb0229
branch: scrollyCoding
repository: porfolio-26
topic: "Shiki Diff Highlighting Implementation"
tags: [shiki, diff-highlighting, canvas-code-stage, code-tutorials]
status: complete
last_updated: 2026-01-16
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: Shiki Diff Highlighting for Canvas Code Steps

## Task(s)

**Completed:** Replaced Shiki Magic Move animated transitions with Shiki's built-in diff notation (`// [!code ++]`) for highlighting changed lines in code tutorials.

The user requested using Shiki's built-in highlighting features instead of custom runtime diff computation or Magic Move animations. This approach is:
- More performant (no animation overhead)
- Declarative (highlighting is in the code itself)
- Educational (users see exactly what's new in each step)

## Critical References

- `lib/shiki.ts` - Shiki highlighter with transformers configuration
- `app/globals.css:1373-1463` - CSS styles for diff/highlight classes
- `content/blog/agent-sdk-deep-research.steps.tsx` - Code steps with diff notation

## Recent Changes

1. `lib/shiki.ts:1-90` - Added `@shikijs/transformers` with `transformerNotationDiff`, `transformerNotationHighlight`, `transformerNotationFocus`

2. `lib/compile-code-steps.ts:1-153` - Simplified to remove all Magic Move token compilation (~200 lines removed)

3. `components/blog/CanvasCodeStage.tsx:1-481` - Simplified to remove runtime diff computation, now relies on Shiki's built-in notation

4. `components/blog/AgentCodeWalkthrough.tsx:1-49` - Removed `compiledTokens` prop (Magic Move removed)

5. `components/blog/AgentCodeWalkthroughServer.tsx:1-38` - Removed token compilation, only compiles HTML now

6. `app/globals.css:1373-1463` - Added CSS for:
   - `.diff.add` - Green background with "+" gutter indicator
   - `.diff.remove` - Red background with "-" gutter and strikethrough
   - `.highlighted` - Yellow highlight
   - `.focused` - Dims other lines

7. `content/blog/agent-sdk-deep-research.steps.tsx:1-286` - Updated all 8 code steps with `// [!code ++]` notation to highlight new lines in each step

8. `package.json` - Added `@shikijs/transformers@3.21.0` dependency

## Learnings

### Shiki Transformer Notation
Shiki has powerful built-in notation that gets **stripped from output**:
- `// [!code ++]` - marks line as added (adds `.diff.add` class)
- `// [!code --]` - marks line as removed (adds `.diff.remove` class)
- `// [!code highlight]` - highlights line (adds `.highlighted` class)
- `// [!code focus]` - focuses line, dims others (adds `.focused` class)

These are processed by `@shikijs/transformers` package transformers:
- `transformerNotationDiff()`
- `transformerNotationHighlight()`
- `transformerNotationFocus()`

### HTML Output Structure
Shiki with diff notation outputs:
```html
<pre class="shiki has-diff">
  <span class="line diff add">...</span>
  <span class="line diff remove">...</span>
</pre>
```

### File Cleanup Possible
The `components/ui/code/MagicMoveCode.tsx` component is now unused and could be deleted in a future cleanup.

## Post-Mortem

### What Worked
- **Shiki's built-in transformers** - The `@shikijs/transformers` package has exactly what we needed, no custom logic required
- **Declarative approach** - Adding `// [!code ++]` directly in code steps is cleaner than computing diffs at runtime
- **OKLCH colors** - Used the project's OKLCH color system for consistent light/dark mode diff styling

### What Failed
- **Initial approach** - I initially started implementing runtime diff computation between steps, but the user correctly pointed out Shiki already has this built-in
- **Context7 MCP** - Used to quickly find Shiki's documentation on transformers

### Key Decisions
- **Decision:** Use Shiki notation (`// [!code ++]`) instead of runtime diff computation
  - Alternatives considered: Runtime line-by-line comparison between steps
  - Reason: Declarative, no JS overhead, cleaner educational flow

- **Decision:** Remove Magic Move entirely instead of keeping as optional
  - Alternatives considered: Keep Magic Move behind a flag
  - Reason: Simplifies codebase significantly, instant code changes are more educational

## Artifacts

- `lib/shiki.ts` - Shiki highlighter with transformers
- `lib/compile-code-steps.ts` - Simplified HTML-only compilation
- `components/blog/CanvasCodeStage.tsx` - Simplified code stage
- `components/blog/AgentCodeWalkthrough.tsx` - Removed Magic Move props
- `components/blog/AgentCodeWalkthroughServer.tsx` - Simplified server component
- `app/globals.css:1373-1463` - Diff highlighting CSS
- `content/blog/agent-sdk-deep-research.steps.tsx` - Updated code steps with notation
- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - Continuity ledger (needs update)

## Action Items & Next Steps

1. **Visual Testing** - Visit http://localhost:3000/blog/agent-sdk-deep-research and verify:
   - Green highlighting on `// [!code ++]` lines
   - "+" indicators in the gutter
   - Light/dark mode switching works
   - Step transitions feel instant

2. **Optional Cleanup** - Delete unused Magic Move component:
   - `components/ui/code/MagicMoveCode.tsx`
   - Consider removing `shiki-magic-move` from package.json if not used elsewhere

3. **Update Continuity Ledger** - Mark this task as complete in `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md`

4. **Mobile Testing** - Verify diff highlighting works on mobile layouts

## Other Notes

### CSS Variable Support
The diff highlighting CSS supports custom CSS variables for theming:
- `--canvas-change-highlight` - Light mode add color
- `--canvas-change-highlight-dark` - Dark mode add color

### Dev Server Status
Dev server is running at http://localhost:3000. The blog post is accessible at `/blog/agent-sdk-deep-research`.

### Package Changes
Added dependency: `@shikijs/transformers@3.21.0`
