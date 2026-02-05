# Visual 13 - AGENTS Proximity Map

Lesson: `content/courses/codex-cli-deep-dive/lessons/09-code-review-github.mdx`
Placement: After "Keep rules close to code" callout

## What This Is
A folder tree showing how the closest `AGENTS.md` applies to a file.

## Goal
Explain the proximity rule for instructions in a single image.

## Why This Visual
Teams often put one global rules file and expect it to apply everywhere. This shows why local rules matter.

## What It Must Show
- Root `AGENTS.md` affects everything
- Nested `AGENTS.md` overrides for its subtree
- The closest file wins

## How It Works (Visual)
- A simple tree: root -> src -> feature -> file.ts
- `AGENTS.md` shown at root and feature folder
- A highlight line from the nearest `AGENTS.md` to the file

## Steps (Multi-Step)
1. Tree appears.
2. Root rules highlight.
3. Local rules override highlight.

## Motion Notes
- Use a moving highlight to show override.

## Reduced Motion
- Static tree with nearest rules highlighted.

## Implementation Notes
- Suggested component: `AgentsProximityMap`.
- Use monospace for file names.
