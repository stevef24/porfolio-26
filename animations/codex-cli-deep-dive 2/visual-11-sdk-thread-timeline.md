# Visual 11 - SDK Thread Timeline

Lesson: `content/courses/codex-cli-deep-dive/lessons/11-sdk-automation.mdx`
Placement: After "Tiny SDK Mental Model" section

## What This Is
A timeline showing Thread -> Run -> Resume cycles.

## Goal
Make the SDK mental model feel simple and linear.

## Why This Visual
Threads and runs are abstract. A timeline makes them concrete.

## What It Must Show
- Thread is the container
- Run executes work
- Resume continues the same thread

## How It Works (Visual)
- Horizontal line with three nodes: Thread, Run, Resume
- A small loop arrow from Resume back to Thread

## Steps (Multi-Step)
1. Timeline appears.
2. Nodes highlight in sequence.
3. Loop arrow appears to show continuity.

## Motion Notes
- Use a subtle glow on the active node.

## Reduced Motion
- Static timeline with all labels visible.

## Implementation Notes
- Suggested component: `SdkThreadTimeline`.
- Keep labels short and readable.
