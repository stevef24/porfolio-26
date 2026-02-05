# Visual 06 - MCP Architecture Map

Lesson: `content/courses/claude-code-fundamentals/lessons/07-mcp-servers.mdx`
Placement: After "MCP in One Sentence"

## Goal
Clarify the MCP data flow at a glance.

## Why This Visual
MCP can feel abstract. A simple map makes the role of each piece concrete.

## What It Must Communicate
- Claude Code is the caller.
- MCP server is the bridge.
- External tools are the destination.

## Narrative (Steps)
1. Claude Code node appears.
2. Arrow animates to MCP Server.
3. Arrow animates to External Tool/API node.

## Layout
- Three nodes aligned left-to-right.
- Minimal labels and thin arrows.

## Motion
- Arrows animate in sequence.
- Nodes fade in with slight scale-up.

## Interaction
- Optional hover states that reveal brief descriptions.

## Reduced Motion
- Static diagram with all nodes and arrows visible.

## Implementation Notes
- Suggested component name: `McpArchitectureMap`.
- Use a single accent color for arrows.
- Avoid extra details or secondary paths.
