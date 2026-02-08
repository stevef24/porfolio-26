# Video Script: Hooks & Automation
Duration: 7 min estimated

## Hook (20 sec)
**Show on screen:** Claude Code about to run `rm -rf /important-directory` -- then a hook blocks it with a red "DENIED" message
**Say:** "What if Claude tried to run a destructive command and your setup automatically stopped it -- before it executed? That's hooks. Let's build one."

## Setup (30 sec)
**Show on screen:** Timeline diagram showing hook events: PreToolUse > Tool runs > PostToolUse > Stop
**Say:**
- Hooks are scripts that fire when specific events happen inside Claude Code
- Think of them like event listeners for your AI: useEffect, addEventListener, same idea
- The difference: hooks can actually prevent things from happening
- By the end of this video, you'll have a safety hook blocking dangerous commands

## Main Content

### The Core Events
**Show on screen:** Five-event table from the lesson
**Say:**
- Five events cover everything you need
- PreToolUse: fires BEFORE a tool runs. The only one that can block actions.
- PostToolUse: fires after success. Great for logging and follow-ups.
- Stop: fires when Claude finishes responding. Perfect for validation.
- You don't need to memorize all of them. PreToolUse and Stop are your starting points.

### Build a Safety Hook Live
**Show on screen:** Terminal and editor side by side
**Say:**
- Let's build this for real. We're going to block any bash command containing `rm -rf`.
**Demo:**
1. Create the directory: `mkdir -p .claude/hooks`
2. Create the script file in an editor: `.claude/hooks/block-dangerous.sh`
3. Type the script line by line, explaining each part:
   - `jq -r '.tool_input.command'` -- reads the command Claude wants to run
   - The `grep -q 'rm -rf'` check -- tests for the dangerous pattern
   - The JSON output with `permissionDecision: "deny"` -- tells Claude Code to block it
4. Make it executable: `chmod +x .claude/hooks/block-dangerous.sh`
5. Register in `.claude/settings.json`:
   - Show the matcher: `"Bash"` -- only runs for shell commands
   - Show the hook config pointing to the script
6. **Test it:** Ask Claude to run a command with `rm -rf`. Show it getting blocked. Then ask it to run `ls` -- show it passing through normally.

### Three Recipes You Should Steal
**Show on screen:** Code snippets for each recipe
**Say:**
- Recipe 1: Auto-lint after every edit. PostToolUse matcher on Edit|Write.
- Recipe 2: Audit log every command. PostToolUse matcher on Bash. Appends to a log file.
- Recipe 3: Auto-run tests after Claude finishes. Stop event, runs your test suite.
**Demo:** Show Recipe 3 in action: Claude finishes a code change, the Stop hook automatically runs `pnpm test --run | tail -5`, results appear before the next prompt.

### Decision Framework: Should This Be a Hook?
**Show on screen:** Four-question flowchart
**Say:**
- Is it repetitive? You do it every session.
- Is it fast? Hooks run synchronously -- slow hooks tax every action.
- Is it safety-critical? If forgetting could break production, hook it.
- Is it tool-specific? Use a matcher to keep it narrow.
**Demo:** Walk through two examples: "Auto-lint after edit" (repetitive, fast, tool-specific -- good hook) vs. "Run a 30-second integration test" (slow -- bad for PreToolUse, okay for Stop).

## Exercise Walkthrough (90 sec)
**Show on screen:** Exercise steps
**Say:**
- Create `.claude/hooks/` in your project
- Write a PreToolUse hook blocking `git push --force`
- Register it with the Bash matcher
- Test by asking Claude to force push -- verify the block
- Bonus: add an audit log hook for all Bash commands
**Demo:** Speed-run the force-push blocker: create file, register, test, see it blocked. 60 seconds.

## Wrap Up (20 sec)
**Say:** "Hooks are event listeners for your AI workflow. Start with a safety hook on PreToolUse -- it's your most important guardrail. Keep hooks fast, keep matchers narrow, and automate the repetitive so you can focus on the creative."
**Show on screen:** Key card: "PreToolUse = safety net. Stop = automation. Keep hooks fast."
