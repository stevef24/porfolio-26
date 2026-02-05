# Visual 07 - Non-Interactive Pipeline

Lesson: `content/courses/codex-cli-deep-dive/lessons/07-non-interactive-mode.mdx`
Placement: After "Pipe It Like Any CLI" section

## What This Is
A left-to-right pipeline showing `codex exec` feeding an artifact.

## Goal
Make `codex exec` feel like a standard CLI tool in a pipeline.

## Why This Visual
It reframes Codex as composable infrastructure, not just a chat UI.

## What It Must Show
- Prompt in -> Codex exec -> output file
- Output is a normal artifact you can use in CI

## How It Works (Visual)
- Input box labeled "Prompt"
- Middle node labeled "codex exec"
- Output file icon labeled "RELEASE_NOTES.md"

## Steps (Multi-Step)
1. Prompt box appears.
2. Arrow animates into `codex exec`.
3. Output file animates in on the right.

## Motion Notes
- Use a simple arrow sweep to show flow.

## Reduced Motion
- Static pipeline.

## Implementation Notes
- Suggested component: `NonInteractivePipeline`.
- Use monospace labels for commands and filenames.
