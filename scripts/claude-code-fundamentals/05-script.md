# Video Script: Planning & Thinking Modes
Duration: 5 min estimated

## Hook (20 sec)
**Show on screen:** Split screen. Left: Claude editing file 4 of 6 and clearly forgetting the schema from file 1. Right: A clean plan listing all 6 files with consistent schema.
**Say:** "You describe a feature that touches six files. By file four, Claude has forgotten what it decided in file one. The fix isn't a better prompt -- it's planning before executing."

## Setup (30 sec)
**Show on screen:** The Plan-Clear-Execute flow diagram
**Say:**
- The difference between developers who love Claude Code and those who rage-quit it usually comes down to one habit: planning first
- This lesson covers when to plan, how to plan, and the thinking keywords that give Claude deeper reasoning power

## Main Content

### When to Plan vs. When to Just Do
**Show on screen:** Decision table from the lesson
**Say:**
- Typo fix? Just do it. Style adjustment in one component? Just do it.
- New feature touching 2+ files? Plan first. Refactor of shared logic? Plan first.
- Rule of thumb: if you'd need more than two sentences to explain, plan it.
**Demo:** Show two quick examples. One simple rename (no plan needed -- just do it). One multi-file feature (definitely needs a plan).

### Planning Mode Live Demo
**Show on screen:** Claude Code terminal
**Say:**
- Toggle planning mode with Option+M (or Alt+M on Windows/Linux)
- Claude will read code, propose a plan, and wait for you to approve
- You verify intent BEFORE any code changes happen
**Demo:**
1. Type a multi-file feature request: "Add a search feature to the blog that filters posts by title and tag"
2. Toggle planning mode with Option+M
3. Show Claude reading files, proposing a step-by-step plan
4. Walk through the plan, noting which files it will touch and in what order
5. Approve the plan

### The Plan-Clear-Execute Workflow
**Show on screen:** Three-step flow highlighted
**Say:**
- Step 1: Plan the task. Review Claude's proposal. Adjust until it matches your intent.
- Step 2: Clear context with /clear. This removes the planning debate noise.
- Step 3: Paste the agreed plan and let Claude execute with clean context.
**Demo:**
1. After the planning conversation above, copy the final agreed plan
2. Run `/clear`
3. Paste the plan as the first prompt in the fresh session
4. Show Claude executing cleanly without the back-and-forth confusion

### Thinking Keywords
**Show on screen:** Keyword scale: think > think hard > think harder > ultrathink
**Say:**
- Sometimes you don't need a full plan. You just need Claude to think more carefully.
- "think" for moderate complexity. "think hard" for subtle bugs. "ultrathink" for the hardest problems.
- Each level uses more context budget but produces more thorough analysis.
**Demo:** Show the same tricky bug with just "fix this bug" vs. "think hard about this bug and explain the root cause before fixing it." Compare the depth of analysis.

## Exercise Walkthrough (60 sec)
**Show on screen:** Exercise steps
**Say:**
- Pick a real feature you've been meaning to add
- Enter planning mode with Option+M, review the plan, then clear and execute
- For the thinking exercise: take a stubborn bug, try "think" then "think hard" and notice the difference
**Demo:** Speed-run the plan-clear-execute loop on a small real task, showing the full cycle in 45 seconds.

## Wrap Up (20 sec)
**Say:** "Plan first for anything crossing file boundaries. Clear between planning and execution. And when you need deeper reasoning without a full plan, thinking keywords are your friend. Next up: slash commands -- the tiny set of commands you'll actually use every week."
**Show on screen:** Key card: "Plan > Clear > Execute"
