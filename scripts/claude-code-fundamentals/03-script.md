# Video Script: Understanding Context
Duration: 6 min estimated

## Hook (20 sec)
**Show on screen:** Screen recording of a Claude Code session. First response is crisp and accurate. Fast-forward 20 prompts later -- Claude is forgetting earlier instructions and giving vague answers.
**Say:** "Your first few responses are always great. Then around prompt fifteen, things get fuzzy. This isn't a bug. It's context decay, and once you understand it, you can prevent it."

## Setup (30 sec)
**Show on screen:** Conveyor belt animation or diagram
**Say:**
- The context window is like a conveyor belt with a fixed length
- New items go on one end. When it's full, items on the other end fall off.
- But it's smarter than that -- Claude compresses old messages instead of just dropping them
- The skill is learning to work with this, not against it

## Main Content

### What Fills the Window
**Show on screen:** Table showing relative sizes of different context items
**Say:**
- Not all context items cost the same
- A short prompt is almost free. A 1,000-line file read is expensive.
- Here's the one that surprises people: Claude's own responses are often the biggest consumers
- A 300-word explanation takes the same space as a medium file read
**Demo:** Open Claude Code, run `/cost` to show token usage. Ask a question, check cost again. Read a large file, check cost. Show how quickly the budget fills.

### The Signal vs. Noise Problem
**Show on screen:** Two-column comparison
**Say:**
- High signal: the specific file with the bug, the exact error message, a clear one-sentence goal
- Noise: three files opened "just in case," old discussions from five prompts ago, a full test suite where 47 of 48 passed
- Noise isn't neutral -- it actively confuses Claude by creating false connections
**Demo:** Show a session where you open three unrelated files. Ask a question about one. Point out how Claude might reference patterns from the wrong file.

### /clear vs. /compact Live Demo
**Show on screen:** Claude Code session with ~10 exchanges of history
**Say:**
- `/clear` is a hard reset. Wipes everything, keeps CLAUDE.md
- `/compact` is a soft reset. Summarizes the conversation, keeps the gist but loses details
- When in doubt, `/clear` wins. It's almost always the right call.
**Demo:**
1. Show a session with history. Run `/compact`. Ask Claude to recall a specific detail from early in the conversation -- show what was preserved and what was lost.
2. Run `/clear`. Show the clean state. Ask the same question -- demonstrate the fresh, sharp response quality.

### The Context Budget Calculator
**Show on screen:** Pie chart showing budget allocation: CLAUDE.md (10%), Conversation (40%), File reads (30%), Commands (15%), Buffer (5%)
**Say:**
- Think of it as 100 credits per session
- CLAUDE.md always costs 10. Conversation grows over time. File reads are your main working material.
- If you're at 95 credits and about to open a 500-line file, something has to give
**Demo:** Show a real session approaching context limits. Demonstrate the decision: either clear and restart, or read only the specific function needed instead of the whole file.

## Exercise Walkthrough (60 sec)
**Show on screen:** The Context Audit exercise
**Say:**
- Start a session, have 8-10 exchanges, then test: can Claude recall something from your second prompt?
- Try /compact, test again. Then /clear and restart.
- The fresh session will outperform the cluttered one. That's the lesson.
**Demo:** Speed through the exercise showing the quality difference between prompt 10 in a cluttered session vs. prompt 1 in a fresh one.

## Wrap Up (20 sec)
**Say:** "Context decays. It's not a bug, it's physics. The fix is simple: start fresh often, read files surgically, and keep your prompts focused. Next up: the tools and permissions that control what Claude can actually do."
**Show on screen:** Key rule card: "When in doubt, /clear"
