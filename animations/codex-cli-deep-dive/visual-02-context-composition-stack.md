# Visual 02 - Context Composition Stack

Lesson: `content/courses/codex-cli-deep-dive/lessons/00-context-primer.mdx`
Placement: After "What Counts as Context" list

## What This Is
A vertical stack of context layers showing what actually enters the window.

## Goal
Explain that context is made of multiple sources, not just the prompt.

## Why This Visual
Readers underestimate the cost of files, tool output, and rules. The stack makes costs visible.

## What It Must Show
- Context is a layered stack (conversation, files, tools, rules)
- All layers share a single budget
- Heavier layers consume more space

## How It Works (Visual)
- Four stacked cards labeled: Conversation, Files, Tool Output, Rules
- Each card has a thin fill indicator to show "size"
- A single bracket on the side labeled "Context Window"

## Steps (Multi-Step)
1. Empty stack appears with labels only.
2. Each layer fills to a different height.
3. The bracket highlights the total budget.

## Motion Notes
- Staggered reveal of layers (40-60ms).
- Use a light fill animation to indicate size.

## Reduced Motion
- Static stack with all layers shown.

## Implementation Notes
- Suggested component: `ContextCompositionStack`.
- Keep labels short and aligned left.
