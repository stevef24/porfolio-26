# Video Script: Changelog & Infrastructure
Duration: 5 min estimated

## Hook (20 sec)
**Show on screen:** A workflow that was working last week suddenly behaving differently. A developer looking confused at changed output.
**Say:** "A workflow that worked last Tuesday broke this Tuesday. No code changed. Claude Code updated. This happens every week if you're not paying attention. Let's fix that."

## Setup (30 sec)
**Show on screen:** The six-layer architecture stack diagram
**Say:**
- Claude Code ships updates weekly, sometimes multiple times a week
- New models, changed behaviors, renamed settings -- it moves fast
- Understanding the architecture helps you predict where updates will land
- And a 60-second changelog scan keeps you ahead of surprises

## Main Content

### The Six-Layer Architecture
**Show on screen:** Stack diagram with layers labeled, animated to highlight each one
**Say:**
- CLI: sessions, settings, auth. This is where flags and settings change.
- Tool runtime: Read, Edit, Bash. The most stable layer.
- Agent layer: subagents and teams. Coordination logic evolves here.
- MCP layer: external tool connections. Protocol updates land here.
- Model layer: routes to Claude models. New models, alias changes, pricing shifts.
- Sandbox: isolates risky commands. Permission defaults change here.
**Demo:** Show a real changelog entry and map it to a layer. "New --plan flag" = CLI layer. "Opus 4.6 available" = Model layer. This mental mapping tells you immediately what part of your workflow is affected.

### How to Read a Changelog in 60 Seconds
**Show on screen:** The five-category checklist
**Say:**
- Don't read line by line. Scan for five categories:
  1. New or changed commands and flags -- will your muscle memory break?
  2. Agent and subagent behavior -- did delegation change?
  3. Model defaults and aliases -- did the default model change?
  4. Permission and sandbox updates -- do you need to re-approve anything?
  5. Cost or context handling -- did pricing or compaction change?
- If none of these five have entries, skim and move on.
**Demo:** Pull up a real (or simulated) Claude Code changelog on screen. Speed-scan it using the five categories. Point out one relevant entry and one that's safe to skip. Time it -- show it takes under 60 seconds.

### The Staying Current Framework
**Show on screen:** Four-step cycle: Weekly scan > Test after updates > Update CLAUDE.md > Share with team
**Say:**
- Weekly scan: two minutes, five-category filter. Set a calendar reminder.
- Test after updates: run your most common workflow once. If something feels different, check the changelog.
- Update CLAUDE.md: when a feature changes how you work, save the adaptation in your instructions.
- Share with team: a one-line summary in your team channel saves everyone the scan.
**Demo:** Show setting a calendar reminder titled "Scan Claude Code changelog (2 min)".

### What Changed Recently
**Show on screen:** Release highlights from the lesson
**Say:**
- Opus 4.6 is now available
- Agent teams landed as a research preview
- Automatic memory was added -- Claude records and recalls across sessions
- Token costs: agent teams can use roughly 7x tokens vs. standard sessions
- Model strategy matters more than ever: opus for complex work, sonnet for daily implementation, haiku for fast lookups
**Demo:** Run `/model` and show the current available models and aliases.

## Exercise Walkthrough (45 sec)
**Show on screen:** Exercise steps
**Say:**
- Open the Claude Code changelog right now
- Use the five-category scan to find the last change affecting your workflow
- Check your CLAUDE.md for stale references to settings or model names
- Set a weekly reminder for a 2-minute scan
**Demo:** Quick scan of the changelog, identifying one relevant change.

## Wrap Up (20 sec)
**Say:** "Claude Code moves fast. A two-minute weekly scan keeps you ahead. Map changes to layers, filter with five categories, and update your CLAUDE.md when things shift. Last lesson: the complete resource appendix for everything in this course."
**Show on screen:** Key card: "Weekly scan. Five categories. Two minutes."
