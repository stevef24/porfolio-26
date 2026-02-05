# Visual 02 - Context Composition Stack

Lesson: `content/courses/claude-code-fundamentals/lessons/00-context-primer.mdx`
Placement: After "What Counts as Context" list

## Goal
Show that multiple sources compete inside the same context window.

## Why This Visual
Readers often think files are the only context. This stack proves the mix is broader.

## What It Must Communicate
- Context is made of multiple layers.
- Each layer has weight and cost.
- The stack is shared, not separate.

## Narrative (Steps)
1. Title "Context" appears at top-left of the frame.
2. Cards slide in and stack: Conversation, Files, Tool Output, CLAUDE.md, Skills.
3. The stack settles with slight offset so all labels remain visible.

## Layout
- Stacked cards with consistent spacing.
- Slight perspective or offset to show depth.
- Labels aligned left.

## Motion
- Each card slides in from the left with a short ease-out.
- Final stack holds with no looping.

## Interaction
- Hover a card to reveal a one-line explanation.
- Hover should not move layout; only reveal text.

## Reduced Motion
- All cards visible and stacked without animation.

## Implementation Notes
- Suggested component name: `ContextCompositionStack`.
- Use a consistent corner radius across all cards.
- Keep color contrast subtle; one accent on the top card.
