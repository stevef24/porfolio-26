# Visual 05 - Config Precedence Stack

Lesson: `content/courses/codex-cli-deep-dive/lessons/03-config-basics-profiles.mdx`
Placement: After "Precedence (Who Wins?)" section

## What This Is
A stacked deck of config layers showing priority order.

## Goal
Clarify which config wins when multiple sources exist.

## Why This Visual
Users get confused by overlapping config layers. A stack makes it obvious.

## What It Must Show
- CLI flags override everything
- Project config overrides user config
- Defaults sit at the bottom

## How It Works (Visual)
- Four cards stacked with labels: Defaults, User, Project, CLI
- The top card is highlighted as "active"

## Steps (Multi-Step)
1. Stack appears from bottom to top.
2. Top card highlights as the winner.

## Motion Notes
- Staggered stack entrance (40-60ms).

## Reduced Motion
- Static stack with top card highlighted.

## Implementation Notes
- Suggested component: `ConfigPrecedenceStack`.
- Use small labels; avoid long text.
