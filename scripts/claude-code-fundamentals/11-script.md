# Video Script: Advanced Patterns
Duration: 8 min estimated

## Hook (20 sec)
**Show on screen:** Split screen -- left: an impressive single-session demo where Claude builds a feature. Right: a real-world project board with multiple files, multiple contributors, multiple days.
**Say:** "Single-session demos look amazing. But real projects span days, involve a team, and require coordination. These are the patterns that survive contact with reality."

## Setup (30 sec)
**Show on screen:** Overview card listing the six patterns
**Say:**
- This lesson gives you six production patterns for when the stakes are real and "just ask Claude" isn't a strategy
- We'll cover topology selection, lead orchestration, plan gating, session memory, file ownership, and verification loops
- Each one solves a specific coordination failure

## Main Content

### Pattern 1: Choose Your Topology
**Show on screen:** Three-option diagram: Main Session > Subagent > Agent Team
**Say:**
- Before writing a single prompt, answer: how many agents need to coordinate?
- Single task, single code path: main session. No overhead.
- Focused delegation: subagent. Isolated context.
- Multi-role parallel work: agent team. Peer communication.
- Most failures come from picking the wrong topology, not bad prompting
**Demo:** Show the same task planned three ways. A simple bug fix (main session). A codebase-wide search (subagent). A multi-file feature with tests and docs (agent team). Explain why each topology fits.

### Pattern 2: Lead-Only Orchestration
**Show on screen:** Construction site metaphor -- foreman directing crews
**Say:**
- When using an agent team, the lead's job is NOT to write code. It's to coordinate.
- Enable delegate mode with Shift+Tab so the lead assigns work instead of implementing
- Teammates implement, test, and self-review. The lead reviews output and resolves conflicts.
**Demo:** Show a brief agent team interaction where the lead assigns file ownership and reviews rather than writing code.

### Pattern 3: Plan-Gated Teammates
**Show on screen:** Flowchart: Teammate writes plan > Lead reviews > Approved? > Implement
**Say:**
- Some changes are too risky for "implement first, review later"
- Auth flows, billing logic, database migrations -- require the teammate to submit a plan before writing code
- The lead reviews each plan before approving implementation
**Demo:** Show the prompt that sets this up:
"Create an agent team for this auth refactor. Require plan approval before any teammate writes code."
Show the "When to Gate" table: UI tweaks (no gate), auth changes (gate), DB schema changes (gate).

### Pattern 4: Session Memory Files
**Show on screen:** A markdown file at `.claude/sessions/2026-02-05-auth-refactor.md`
**Say:**
- When a task spans multiple sessions, you lose continuity. Session memory files fix this.
- Include three things only: what changed, what failed, what's next
- The "what failed" section is the most valuable part -- it prevents the next session from repeating dead ends
**Demo:** Create a session memory file live. Show the three sections. Then start a new session, attach the file, and show Claude picking up right where you left off.

### Pattern 5: File Ownership Boundaries
**Show on screen:** File tree with colored ownership labels
**Say:**
- Parallel execution breaks when two teammates edit the same file
- Assign file ownership in your task prompts: teammate-a owns app/api/, teammate-b owns lib/auth/, teammate-c owns tests only
- If someone needs to edit outside their scope, they message the owner instead of editing directly
**Demo:** Show the prompt that establishes boundaries and explain how it prevents merge conflicts.

### Pattern 6: Verification Loops
**Show on screen:** Four-step cycle: Implement > Test > Self-review > Lead review
**Say:**
- For each piece of teammate output: implement, test, self-review, then lead review
- This catches integration bugs earlier than one big review at the end
- Each step has explicit ownership -- no ambiguity about who checks what

## Exercise Walkthrough (60 sec)
**Show on screen:** Exercise steps
**Say:**
- Pick a medium task touching 3+ files
- Write a session memory file: what changed, what failed, what's next
- Plan a team topology: who owns which files? Who needs plan gating?
- Execute and note where coordination helped vs. where it added friction
**Demo:** Show a real session memory file and the topology plan for a small feature.

## Wrap Up (20 sec)
**Say:** "Pick the simplest topology that fits, keep the lead out of implementation, gate risky changes, and write session memory files for anything that spans more than one sitting. These six patterns are what separate demo-grade work from production-grade work."
**Show on screen:** Key card listing all six patterns
