# Visual 06 - Command Surface Map

Lesson: `content/courses/codex-cli-deep-dive/lessons/06-commands-that-matter.mdx`
Placement: After "The Top 6" list

## What This Is
A map showing the three main Codex surfaces: Interactive, Non-interactive, Cloud.

## Goal
Show how commands cluster into workflows rather than a flat list.

## Why This Visual
Readers remember workflows better than command lists.

## What It Must Show
- `codex` for interactive work
- `codex exec` for scripts
- `codex cloud` + `codex apply` for remote tasks

## How It Works (Visual)
- Three columns with labels: Interactive, Scripted, Cloud
- Each column lists the 2-3 core commands
- A subtle connector line shows the "apply" step returning to local

## Steps (Multi-Step)
1. Columns appear.
2. Commands fade in.
3. Connector line draws from Cloud to Local.

## Motion Notes
- Line-draw animation for the connector.

## Reduced Motion
- Static columns with the connector already drawn.

## Implementation Notes
- Suggested component: `CommandSurfaceMap`.
- Keep typography small and tidy.
