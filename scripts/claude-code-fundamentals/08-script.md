# Video Script: Subagents
Duration: 6 min estimated

## Hook (20 sec)
**Show on screen:** A Claude Code session with 15 file reads stacked up, context full, responses getting vague
**Say:** "You asked Claude to find how a function is used across your codebase. It read fifteen files, filled your context with code you don't need, and now your actual feature conversation is buried. There's a better way."

## Setup (30 sec)
**Show on screen:** Diagram -- main session stays clean, subagent does the research in its own context, returns a summary
**Say:**
- Subagents are separate Claude instances with their own context window
- They do focused work -- search, analyze, review -- and return only a summary
- Your main session stays clean. Think of it like sending someone to the library who comes back with a one-page brief.

## Main Content

### What Subagents Are
**Show on screen:** Side-by-side: Main session context (clean) vs. Subagent context (full of file reads)
**Say:**
- A subagent has its own context window, its own model, and restricted tools
- When it finishes, it returns a summary. The 15 files it read stay in its context, not yours.
- This is the key tradeoff: more total tokens used, but your main session stays focused
**Demo:** Show a codebase search done two ways:
1. In the main session: "Find all usages of validateToken" -- watch context fill up
2. Via subagent: "Use a subagent to find all usages of validateToken and summarize the patterns" -- watch the main context stay clean

### Built-In Subagents
**Show on screen:** Table: Explore, Plan, General-purpose
**Say:**
- Claude Code already uses three built-in subagents behind the scenes
- Explore: fast read-only codebase search
- Plan: research during planning mode
- General-purpose: full capability for complex delegated tasks
- These handle common patterns automatically. Custom subagents fill the gaps.

### Subagents vs. Agent Teams
**Show on screen:** Comparison table
**Say:**
- Subagents: one focused worker reporting back to you. Lower overhead.
- Agent teams: multiple workers coordinating with each other. Higher overhead.
- Start with subagents. Graduate to teams only when workers genuinely need to talk to each other.
**Demo:** Show the same task framed two ways. "This task is one researcher reporting back -- subagent. This task needs a researcher, an implementer, and a reviewer collaborating -- agent team."

### Creating a Custom Subagent
**Show on screen:** Editor showing a subagent definition file
**Say:**
- Use `/agents` for the fastest setup
- Project scope (.claude/agents/) is shared with your team via git
- User scope (~/.claude/agents/) is just for you
**Demo:** Create a real subagent live using `/agents`:
- Name it "api-reviewer"
- Give it Read, Glob, Grep tools only
- Set model to Sonnet
- Write focused instructions: "Review API changes for auth, validation, and error handling. Return concise findings with file paths."
- Show the generated file

### The Guardrails
**Show on screen:** Bullet list of rules
**Say:**
- One job per subagent. Two responsibilities? Make two subagents.
- Prefer read-only tools. Only grant write access when genuinely needed.
- Set the model intentionally. A search subagent doesn't need Opus.
- Commit project subagents to git so the whole team gets consistent behavior.

## Exercise Walkthrough (60 sec)
**Show on screen:** Exercise steps
**Say:**
- First: delegate a search. Ask Claude to use a subagent to find function usages. Notice your clean context.
- Second: create a custom subagent for a review task you repeat often.
- Third: compare context impact with /cost -- main session search vs. subagent search.
**Demo:** Quick /cost comparison showing the main session approach (high context usage) vs. subagent approach (low main context usage).

## Wrap Up (20 sec)
**Say:** "Subagents trade tokens for context cleanliness. The best ones are boringly specific -- one job, minimal tools, clear instructions. Start here before reaching for agent teams. Next: bringing Claude Code into your GitHub workflow."
**Show on screen:** Key card: "Narrow purpose. Restricted tools. Clean context."
