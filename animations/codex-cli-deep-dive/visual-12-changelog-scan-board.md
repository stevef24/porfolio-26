# Visual 12 - Changelog Scan Board

Lesson: `content/courses/codex-cli-deep-dive/lessons/13-changelog-infrastructure.mdx`
Placement: After "How to Read the Changelog" section

## What This Is
A checklist board showing the five things to scan in updates.

## Goal
Teach a repeatable method for staying current without over-reading.

## Why This Visual
It turns a vague task ("read the changelog") into a concrete checklist.

## What It Must Show
- Default model changes
- Permission/approval changes
- Config precedence changes
- New commands/flags
- Skills/MCP changes

## How It Works (Visual)
- A board with five rows and checkboxes
- One checkbox animates at a time to show scanning order

## Steps (Multi-Step)
1. Board appears.
2. Checks animate down the list.

## Motion Notes
- Use a short stagger for checks (40-60ms).

## Reduced Motion
- Static checklist with all items visible.

## Implementation Notes
- Suggested component: `ChangelogScanBoard`.
