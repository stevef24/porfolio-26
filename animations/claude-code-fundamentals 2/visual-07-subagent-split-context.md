# Visual 07 - Subagent Split Context

Lesson: `content/courses/claude-code-fundamentals/lessons/08-subagents.mdx`
Placement: After "What Subagents Are"

## Goal
Show that subagents have isolated context and only send back summaries.

## Why This Visual
Many users assume subagents share memory with the main session. This visual corrects that.

## What It Must Communicate
- Main session and subagent contexts are separate.
- Only a summary crosses the boundary.

## Narrative (Steps)
1. Two panels appear: Main Session (left) and Subagent (right).
2. Subagent panel fills with notes.
3. A summary card moves from subagent to main session.

## Layout
- Two side-by-side panels with a single arrow between.
- Summary card is centered on the arrow path.

## Motion
- Subagent notes fade in quickly.
- Summary card slides across with a soft ease-out.

## Interaction
- Optional: click summary to expand a short example.

## Reduced Motion
- Static panels with a summary card already in main session.

## Implementation Notes
- Suggested component name: `SubagentSplitContext`.
- Use a muted color for subagent notes and an accent for the summary card.
