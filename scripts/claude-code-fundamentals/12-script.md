# Video Script: Best Practices & Tips
Duration: 6 min estimated

## Hook (20 sec)
**Show on screen:** Claude Code given a vague prompt with full trust mode, editing files rapidly, then a `git diff` showing a mess of unintended changes
**Say:** "You gave Claude maximum autonomy, full trust, and a vague prompt. It worked -- until it didn't. The cleanup took longer than doing the task yourself. Let's talk about the line between productive delegation and dangerous autopilot."

## Setup (30 sec)
**Show on screen:** Title card: "Controlled Delegation > Maximum Autonomy"
**Say:**
- This lesson distills everything you've learned into four principles and five anti-patterns
- These are the guardrails that keep Claude Code effective day after day
- Think of it as the "things I wish someone told me" episode

## Main Content

### The Four Principles (Quick Hits)
**Show on screen:** Each principle as a card, flipping through them
**Say:**

**Principle 1: Keep Context Lean**
- New task = new session. Add specific files, not directories. /compact when it grows.
- If it won't improve Claude's next response, it shouldn't be in context.

**Principle 2: Choose the Smallest Agent Pattern**
- Main session handles most tasks. Subagent for focused delegation. Agent team only when workers need to talk.
- Each step up multiplies token usage.

**Principle 3: Keep Humans on Decisions**
- Let agents execute. Keep plan approval and merge decisions human-owned.
- This isn't about trust. It's about accountability.

**Principle 4: Manage Token Burn Intentionally**
- A three-agent team uses roughly 3x tokens. Sometimes more with coordination overhead.
- The cheapest prompt is the one you don't send. Invest in making the first prompt precise.

### The Five Anti-Patterns (Live Examples)
**Show on screen:** Terminal for each anti-pattern demo
**Say:**
- Let me show you the five most common ways people waste tokens and produce bad output.

**Demo 1: Kitchen Sink Prompt**
- Type: "Review my entire codebase, find all bugs, refactor everything, write tests"
- Show the vague, surface-level output
- Fix: "Review src/auth.ts for permission bypass bugs" -- show the focused, deep result

**Demo 2: Stale Session**
- Show a session from a previous task with leftover context
- Ask a question about a new task -- show Claude mixing old and new context
- Fix: /clear, start fresh

**Demo 3: Unscoped Agent Team**
- Describe: three teammates all editing index.ts. Merge conflicts everywhere.
- Fix: assign file ownership before starting

**Demo 4: Trust-Everything Workflow**
- Show: no hooks, no plan gating. Claude about to run a risky command.
- Fix: add a PreToolUse safety hook

**Demo 5: Token Bonfire**
- Show: using Opus for a simple rename
- Fix: Haiku for simple tasks, Sonnet for implementation, Opus for architecture only

### The Audit Checklist
**Show on screen:** Six-item checklist with checkboxes
**Say:**
- Walk through it with me for your own setup:
  1. Do you start fresh sessions for new tasks?
  2. Is your CLAUDE.md up to date?
  3. Do you have at least one PreToolUse safety hook?
  4. Are you using the right model for each task type?
  5. Is plan mode enabled for risky changes?
  6. Do agent teams have file ownership boundaries?
- If you said "no" to more than two, your workflow has room to improve.

## Exercise Walkthrough (60 sec)
**Show on screen:** Exercise steps
**Say:**
- Open your most recent Claude Code project
- Run through the audit checklist
- Identify your top anti-pattern
- Write one concrete change: a hook, a CLAUDE.md update, or a model strategy tweak
- Implement it in your next session
**Demo:** Quick run-through of the audit on a real project, identifying one gap and fixing it on the spot.

## Wrap Up (20 sec)
**Say:** "Controlled delegation beats autopilot every time. Four principles, five anti-patterns to avoid, one six-point checklist. Tape the checklist to your monitor for a week. Next up: how Claude Code itself evolves and how to stay current."
**Show on screen:** Key card: "Lean context. Smallest pattern. Human decisions. Intentional tokens."
