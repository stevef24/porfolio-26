# Visual 05 - MCP Bloat Meter

Lesson: `content/courses/claude-code-fundamentals/lessons/07-mcp-servers.mdx`
Placement: After "The Practical Rule" callout

## Goal
Show the cost of enabling too many MCP servers.

## Why This Visual
MCP is powerful but has hidden costs. This meter makes that cost visible instantly.

## What It Must Communicate
- A few servers is healthy.
- Too many servers reduce usable context.
- The curve shifts from lean to heavy.

## Narrative (Steps)
1. Meter starts in the Lean zone.
2. 2-3 tool icons stack; meter enters Balanced.
3. Many icons stack; meter enters Heavy and shows a "Context shrink" warning.

## Layout
- Horizontal meter with labeled zones.
- Tool icons stack above the meter as a visual "weight".

## Motion
- Icons slide in from above.
- Meter fill expands with each new icon.

## Interaction
- Optional toggle: "Add server" to push the meter.
- Default state should land in Balanced.

## Reduced Motion
- Static icons with meter already filled to Balanced or Heavy.

## Implementation Notes
- Suggested component name: `McpBloatMeter`.
- Keep icons minimal, monochrome.
- Only one warning label when in Heavy.
