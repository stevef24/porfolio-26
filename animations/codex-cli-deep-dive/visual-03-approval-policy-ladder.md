# Visual 03 - Approval Policy Ladder

Lesson: `content/courses/codex-cli-deep-dive/lessons/04-approvals-sandbox-rules.mdx`
Placement: After "Approval Policies" section

## What This Is
A vertical ladder showing approval strictness from safest to loosest.

## Goal
Show how approval policies trade safety for speed.

## Why This Visual
Policy names are abstract. A ladder makes the trade-off intuitive.

## What It Must Show
- Untrusted is safest
- Never is fastest but riskiest
- Policies are a gradient, not binary

## How It Works (Visual)
- Five rungs labeled: Untrusted, On-Request, On-Failure, Never
- A marker highlights the recommended default
- Safety label on bottom, Speed label on top

## Steps (Multi-Step)
1. Ladder appears with labels.
2. Highlight slides to the recommended rung.
3. A subtle gradient shows increasing risk.

## Motion Notes
- Use a simple tween for the highlight bar.
- No looping.

## Reduced Motion
- Static ladder with highlight already placed.

## Implementation Notes
- Suggested component: `ApprovalPolicyLadder`.
- Keep labels left-aligned for readability.
