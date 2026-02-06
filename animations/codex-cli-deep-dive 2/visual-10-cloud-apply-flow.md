# Visual 10 - Cloud -> Apply Flow

Lesson: `content/courses/codex-cli-deep-dive/lessons/10-codex-cloud-apply.mdx`
Placement: After "The Flow" steps

## What This Is
A left-to-right flow showing Cloud task -> Diff -> `codex apply` -> Local repo.

## Goal
Explain the remote-to-local path clearly.

## Why This Visual
People confuse cloud execution with local changes. This makes the bridge explicit.

## What It Must Show
- Work happens in cloud
- Diff is the artifact
- `codex apply` brings it local

## How It Works (Visual)
- Cloud icon -> diff card -> terminal command -> repo icon

## Steps (Multi-Step)
1. Cloud icon appears.
2. Diff card slides in.
3. Command appears.
4. Repo icon highlights as final state.

## Motion Notes
- Short slide transitions between nodes.

## Reduced Motion
- Static flow with all nodes visible.

## Implementation Notes
- Suggested component: `CloudApplyFlow`.
- Use monospace for the command label.
