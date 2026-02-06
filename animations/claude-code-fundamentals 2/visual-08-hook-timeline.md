# Visual 08 - Hook Timeline

Lesson: `content/courses/claude-code-fundamentals/lessons/10-hooks-automation.mdx`
Placement: After "The Core Events"

## Goal
Show when hooks fire relative to tool execution.

## Why This Visual
Without a timeline, hook events feel abstract. A sequence clarifies the mental model.

## What It Must Communicate
- PreToolUse occurs before a tool runs.
- PostToolUse and PostToolUseFailure happen after.
- Stop is the terminal event for the response.

## Narrative (Steps)
1. Timeline appears with nodes: PreToolUse -> Tool -> PostToolUse -> Stop.
2. A highlight moves across the line, stopping briefly at each node.

## Layout
- Horizontal timeline with evenly spaced nodes.
- Short one-line label below each node.

## Motion
- A progress highlight travels along the line.
- Nodes glow as the highlight hits them.

## Interaction
- Optional: click a node to show a tiny example payload snippet.

## Reduced Motion
- Static timeline with all nodes visible and labeled.

## Implementation Notes
- Suggested component name: `HookTimeline`.
- Keep labels concise and aligned.
- Use a single accent for the highlight line.
