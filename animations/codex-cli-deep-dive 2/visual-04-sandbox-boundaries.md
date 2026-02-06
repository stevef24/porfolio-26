# Visual 04 - Sandbox Boundaries

Lesson: `content/courses/codex-cli-deep-dive/lessons/04-approvals-sandbox-rules.mdx`
Placement: After "Sandbox Modes" section

## What This Is
Three nested boxes representing where commands can write.

## Goal
Make sandbox scope instantly clear.

## Why This Visual
"Read-only vs workspace-write vs full access" is hard to picture without a map.

## What It Must Show
- Read-only touches nothing
- Workspace-write stays inside repo
- Full access reaches outside the repo

## How It Works (Visual)
- Small box labeled "Read-Only"
- Medium box labeled "Workspace-Write"
- Large box labeled "Full Access"
- A repo icon centered inside

## Steps (Multi-Step)
1. Nested boxes appear.
2. Highlight expands from inner to outer box.

## Motion Notes
- Use a gentle scale or outline expansion.

## Reduced Motion
- Static nested boxes.

## Implementation Notes
- Suggested component: `SandboxBoundaries`.
- Use line weights consistent with other visuals.
