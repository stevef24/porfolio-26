# Video Script: CLAUDE.md Configuration
Duration: 6 min estimated

## Hook (20 sec)
**Show on screen:** Two Claude Code sessions side by side. Left one uses npm (wrong). Right one uses pnpm (correct).
**Say:** "Every new session, Claude forgets your project uses pnpm. Every time, you correct it. What if you could write it down once and never repeat yourself?"

## Setup (30 sec)
**Show on screen:** Empty CLAUDE.md file in an editor
**Say:**
- CLAUDE.md is a persistent instruction file that loads automatically every session
- Think of it as your project's constitution -- the rules that never change
- The goal is lean and specific, not long and obvious

## Main Content

### The /init Command
**Show on screen:** Claude Code session in a real project
**Say:**
- The fastest way to start is `/init` -- it scans your repo and drafts a CLAUDE.md
- But here's the important part: your job is to trim it, not accept it as-is
**Demo:** Run `/init` in a real project. Show the generated output. Highlight lines that are obvious ("React is a JavaScript library") and lines that are genuinely useful ("lib/source.ts is server-only").

### The Trimming Process (Live Edit)
**Show on screen:** Editor with the generated CLAUDE.md
**Say:**
- Delete anything Claude would figure out by reading your code
- Keep only what's specific to YOUR project
- The bar: would Claude get this wrong without being told?
**Demo:** Live-edit the generated file:
- Delete generic tech stack descriptions
- Keep the server-only file warning
- Keep the package manager preference
- Keep the "never do" rules
- Show the before (30+ lines) and after (15 lines) side by side

### Always-On vs. Task Context
**Show on screen:** Split screen table from the lesson
**Say:**
- CLAUDE.md is for invariants -- things true in every session
- Task-specific details go in your prompts, not in CLAUDE.md
- Putting task details in CLAUDE.md wastes context budget every session
**Demo:** Show a bad example: CLAUDE.md with "Fix the login bug in auth.ts" mixed in with conventions. Then show the clean version with that line removed.

### The Hierarchy
**Show on screen:** Directory tree showing three CLAUDE.md locations
**Say:**
- Global (~/.claude/CLAUDE.md) -- your personal preferences across all projects
- Project root (./CLAUDE.md) -- project-specific rules
- Subdirectory -- rules that apply only when working in that folder
**Demo:** Show a global CLAUDE.md with "always explain before editing" and a project CLAUDE.md with specific conventions. Demonstrate that both apply simultaneously.

## Exercise Walkthrough (90 sec)
**Show on screen:** Steps from the lesson exercise
**Say:**
- Run /init, read the output, and start cutting
- Apply the three-question test for each line: every session? Claude would get wrong? Still accurate?
- Target: under 50 lines. If it's over, keep cutting.
**Demo:** Walk through the three-question test on three example lines from a real CLAUDE.md, showing the decision for each.

## Wrap Up (20 sec)
**Say:** "A lean CLAUDE.md beats a long one every time. Every unnecessary line wastes context budget. Write it once, trim it hard, and Claude will follow your rules in every session."
**Show on screen:** The final trimmed CLAUDE.md file, clean and concise
