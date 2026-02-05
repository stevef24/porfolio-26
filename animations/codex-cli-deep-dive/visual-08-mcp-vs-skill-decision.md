# Visual 08 - MCP vs Skill Decision

Lesson: `content/courses/codex-cli-deep-dive/lessons/08-mcp-servers-skills.mdx`
Placement: After "The Practical Rule" section

## What This Is
A small decision tree that routes tasks to CLI, Skills, or MCP.

## Goal
Help readers choose the lightest tool that solves the problem.

## Why This Visual
Tool bloat hurts context and speed. A decision tree makes the trade-off easy.

## What It Must Show
- CLI first for local tasks
- Skills for repeated patterns
- MCP only for external systems

## How It Works (Visual)
- Top node: "What do you need?"
- Branch 1: "Local task" -> CLI
- Branch 2: "Reusable workflow" -> Skill
- Branch 3: "External system" -> MCP

## Steps (Multi-Step)
1. Root node appears.
2. Branches draw outward.
3. End nodes highlight in order.

## Motion Notes
- Line-draw animation for branches.

## Reduced Motion
- Static tree.

## Implementation Notes
- Suggested component: `ToolDecisionTree`.
- Keep labels short; use icons for CLI/Skill/MCP.
