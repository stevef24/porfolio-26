# Visual 01 - Context Budget Bucket

Lesson: `content/courses/codex-cli-deep-dive/lessons/00-context-primer.mdx`
Placement: After "The Context Budget" section

## What This Is
A bucket metaphor that fills with labeled context tokens and overflows when the limit is reached.

## Goal
Make the finite context window visible and memorable.

## Why This Visual
Most readers assume the model can "just hold more." This makes the limit concrete in a single glance.

## What It Must Show
- Context is a container with a hard limit
- Different inputs compete for the same space
- Overflow leads to lost detail

## How It Works (Visual)
- A bucket with a bold "Context Budget" label and a thin limit line near the top
- Tokens labeled: Conversation, Files, Tool Output, Rules
- One extra token spills into a "Lost Details" area below

## Steps (Multi-Step)
1. Empty bucket appears with limit line.
2. Tokens drop in one by one with labels.
3. Bucket fills to the limit line.
4. Final token overflows into the loss zone.

## Motion Notes
- Token drop uses a short spring.
- Overflow token uses a quick tween into the loss zone.
- No looping after the final state.

## Reduced Motion
- Static state with one overflow token already outside the bucket.

## Implementation Notes
- Suggested component: `ContextBudgetBucket`.
- Use neutral tokens and a single accent for overflow.
- Keep line weights 1-2px.
