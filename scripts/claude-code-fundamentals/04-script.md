# Video Script: Tools & Permissions
Duration: 6 min estimated

## Hook (20 sec)
**Show on screen:** Claude Code reading a test file, finding a bug, editing the source, running the test suite, confirming all pass -- all in one continuous flow
**Say:** "Claude just read the test, found the bug, fixed the source, and verified the tests pass. That's a lot of power. The question is: how much of it should you let it use unsupervised?"

## Setup (30 sec)
**Show on screen:** Simple diagram showing Claude's tools: Read, Glob, Grep, Edit, Write, Bash, Task
**Say:**
- Claude Code doesn't generate text about what it would do -- it actually takes actions
- Each action goes through a discrete tool: Read, Edit, Bash, and so on
- The permission system controls which of these tools require your approval
- Understanding this changes how you write prompts

## Main Content

### The Tool Categories
**Show on screen:** Two-column layout: Read-only tools (safe) vs. Write tools (need approval)
**Say:**
- Read-only tools -- Read, Glob, Grep, WebSearch -- happen automatically. No approval needed.
- Write tools -- Edit, Write, Bash -- ask you first by default
- This is a feature, not friction. Claude can explore freely while you control what changes.
**Demo:** Open Claude Code. Ask "show me all files that import auth.ts" -- watch Read and Grep run automatically with no approval prompt. Then ask "fix the typo on line 42" -- show the approval prompt for the Edit tool.

### The Three Permission Levels
**Show on screen:** Ladder or dial graphic showing Level 1 > Level 2 > Level 3
**Say:**
- Level 1: Ask every time. Best for learning and high-risk work.
- Level 2: Whitelist specific commands. The sweet spot for most developers.
- Level 3: Trust mode. Fast, but requires good git hygiene.
**Demo:** Show `/permissions` panel. Walk through adding common safe commands to the whitelist:
- `pnpm test`
- `pnpm build`
- `git status`
- `git diff`

### Permission Flow in Practice
**Show on screen:** Terminal showing a real fix-the-test workflow
**Say:**
- Watch the flow: Claude reads freely, asks before writing, runs whitelisted commands automatically
- You stay in control of the decisions that matter
**Demo:** Live walkthrough of the exact scenario from the lesson:
1. Ask Claude to fix a failing test
2. Watch it Read files automatically
3. See it ask permission to Edit
4. Approve the edit
5. Watch it run `pnpm test` automatically (whitelisted)
6. See "all tests pass"

### Commands You Should Never Auto-Allow
**Show on screen:** Red-flagged command list: rm -rf, git push --force, git reset --hard, DROP TABLE
**Say:**
- Some commands should always require manual approval, no matter how comfortable you get
- One wrong `rm -rf` or `git push --force` is all it takes
- If you're tempted to auto-allow any of these, stop and ask why

## Exercise Walkthrough (60 sec)
**Show on screen:** The exercise steps
**Say:**
- Start with defaults for a few sessions. Notice what you always approve.
- Those repetitive approvals are your whitelist candidates.
- Open /permissions, add them, and feel the flow improve.
**Demo:** Show the before (constant approval prompts for `pnpm test`) and after (test runs automatically while edits still require approval).

## Wrap Up (20 sec)
**Say:** "Start strict, relax with evidence. Good git hygiene is the prerequisite for relaxed permissions. Next lesson: planning and thinking modes, the technique that prevents Claude from making a mess on multi-file tasks."
**Show on screen:** Summary card: "Read freely, write carefully, never auto-allow destructive commands"
