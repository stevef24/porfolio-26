# Visual 09 - CLI + Tools + MCP Stack

Lesson: `content/courses/claude-code-fundamentals/lessons/13-changelog-infrastructure.mdx`
Placement: After "How Claude Code is Structured"

## Goal
Clarify the system layers and how they fit together.

## Why This Visual
The words "CLI", "tools", and "MCP" often blur together. This stack makes the structure clear.

## What It Must Communicate
- The CLI is the top-level interface.
- Tools execute actions.
- MCP connects external services.
- Models provide intelligence.
- Sandbox isolates risk.

## Narrative (Steps)
1. Base layer appears (CLI).
2. Tools layer stacks above.
3. MCP layer stacks above tools.
4. Model layer stacks above MCP.
5. Sandbox layer appears as a wrapper or base boundary.

## Layout
- Vertical stack of rectangular blocks.
- Labels centered in each block.

## Motion
- Layers slide in from bottom to top.
- A subtle settle/bounce after the final layer.

## Interaction
- Optional: hover a layer to show a one-line description.

## Reduced Motion
- Static stacked blocks with labels.

## Implementation Notes
- Suggested component name: `ClaudeCodeStack`.
- Keep spacing consistent between blocks.
- Use a single accent for the active layer on hover.
