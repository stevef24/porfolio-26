# Visual 01 - Orchestration Loop

## What it is
A compact, animated loop diagram that shows the codex multi-agent cycle: Plan -> Implement -> CI -> Review -> Repeat.

## Goal
Give readers an immediate mental model of batch-based orchestration before they read detailed snippets.

## Why it exists
The workflow is conceptually simple but hard to picture from text alone. This visual reduces cognitive load and anchors the rest of the article.

## What it should show
- Four sequential nodes: Plan, Implement, CI, Review.
- Forward arrows drawing left-to-right.
- One subtle loop-back arrow from Review to Plan labeled Repeat.
- A replay action for quick rewatch while reading.

## How it works (visual + motion)
- Visual language is monochrome first: neutral surface, neutral borders, neutral text.
- Accent color is used intentionally and sparingly: `var(--va-blue)`.
- Stage-driven sequence reveals one node/arrow at a time.
- Final stage reveals the loop-back path and Repeat label.
- The active node has a soft pulse to indicate current focus.

## Steps (if multi-step)
1. Stage 0: Plan node appears.
2. Stage 1: Plan -> Implement arrow draws, Implement appears.
3. Stage 2: Implement -> CI arrow draws, CI appears.
4. Stage 3: CI -> Review arrow draws, Review appears.
5. Stage 4: Loop-back arrow draws from Review to Plan.
6. Stage 5: Repeat label appears and sequence settles.

## Placement (lesson + section)
- File: `content/blog/codex-multi-agent-orchestrating.mdx`
- Section: right after `Think kitchen brigade, not lone chef`
- Component: `<CodexOrchestrationLoop />`

## Motion + Reduced-motion behavior
- Default: spring-based micro-motion with short, readable stage timing.
- Reduced motion: render final state immediately (all nodes/arrows visible, no timed transitions).
- Replay button is hidden in reduced-motion mode.
