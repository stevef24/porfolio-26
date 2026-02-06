# Visual 09 - GitHub Review Loop

Lesson: `content/courses/codex-cli-deep-dive/lessons/09-code-review-github.mdx`
Placement: After "The Review Loop" section

## What This Is
A loop diagram showing PR -> `@codex review` -> feedback -> apply.

## Goal
Make the review workflow feel like a closed loop, not a one-off action.

## Why This Visual
It shows that Codex review works best as a repeatable system with rules.

## What It Must Show
- PR triggers `@codex review`
- Review follows `AGENTS.md` rules
- Feedback returns to the PR

## How It Works (Visual)
- Circular loop with three nodes: PR, Codex Review, Feedback
- `AGENTS.md` shown as a small rule card beside the Codex node

## Steps (Multi-Step)
1. Nodes appear.
2. Arrows draw around the loop.
3. Rule card pops in.

## Motion Notes
- Use a single sweep around the loop.

## Reduced Motion
- Static loop with all labels visible.

## Implementation Notes
- Suggested component: `GitHubReviewLoop`.
- Use a subtle highlight on the Codex node.
