# Visual 01 - Context Budget Bucket

Lesson: `content/courses/claude-code-fundamentals/lessons/00-context-primer.mdx`
Placement: After "The Context Budget" paragraph

## Goal
Show that context is finite and that overflow causes loss of detail.

## Why This Visual
The reader often assumes the model can "just hold more". This visual makes the limit visible and memorable in one glance.

## What It Must Communicate
- Context is a container with a hard limit.
- Adding more items past the limit causes loss.
- Every item competes for the same budget.

## Narrative (Steps)
1. Empty bucket labeled "Context Budget" with a thin limit line.
2. Tokens fall in one by one with labels: Conversation, Files, Tool Output, CLAUDE.md.
3. The bucket fills to the limit line.
4. One extra token falls in and spills into a "Lost Details" zone below.
5. The overflow zone subtly highlights to show consequence.

## Layout
- Centered bucket with a clear top limit line.
- Tokens are small rounded rectangles with short labels.
- Overflow zone sits below with a faint border.

## Motion
- Drop tokens with a small bounce.
- Overflow token slides down into the loss zone.
- No looping after the final step.

## Interaction
- Optional: hover a token to show a tiny tooltip ("cost in context").
- Default state should already show the full idea without interaction.

## Reduced Motion
- Static state: bucket with tokens filled, one token in overflow zone.
- No animation required to understand the concept.

## Implementation Notes
- Suggested component name: `ContextBudgetBucket`.
- Use monochrome tokens with one accent for the overflow token.
- Keep line weights consistent with other visuals (1px or 2px).
