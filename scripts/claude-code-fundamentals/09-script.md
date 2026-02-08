# Video Script: GitHub Integration
Duration: 5 min estimated

## Hook (20 sec)
**Show on screen:** A GitHub PR with Claude Code automatically posting a review comment, catching a missing null check on a specific line
**Say:** "You push code. Within minutes, Claude has reviewed the diff, caught a bug on line 47, and posted a comment. No human reviewer needed to spend time on the obvious stuff."

## Setup (30 sec)
**Show on screen:** Diagram: Local Claude Code workflow extending to GitHub via Action
**Say:**
- You've been using Claude Code locally. This lesson takes it to GitHub.
- Claude Code integrates through a GitHub Action -- it reviews PRs, responds to @claude mentions, and can even push small fixes
- The same CLAUDE.md that guides your local workflow now guides automated reviews

## Main Content

### What GitHub Integration Can Do
**Show on screen:** List of capabilities with icons
**Say:**
- Review pull requests: flag bugs, check for consistency, spot style issues
- Respond to @claude mentions in issues and PRs
- Make small code fixes when someone comments "fix this typo"
- Triage issues: label, categorize, provide initial analysis
- The key idea: automate the first pass, keep humans for the final call

### Setup Walkthrough
**Show on screen:** Claude Code terminal
**Say:**
- The fastest path is the built-in installer
**Demo:** Run `/install-github-app` and walk through each step:
1. Install the Claude Code GitHub App on a test repository
2. Add the API key as a GitHub secret (show the GitHub settings page, blur the key)
3. Show the generated `.github/workflows/claude.yml` file
4. Walk through the YAML: triggers, conditions (the @claude filter), and configuration

### PR Review in Action
**Show on screen:** GitHub UI -- a real or staged PR
**Say:**
- Let's see it work end to end
**Demo:**
1. Create a branch with an intentional small bug (missing error handling, unused variable)
2. Open a PR
3. Wait for (or show pre-recorded footage of) Claude reviewing the diff
4. Show Claude's review comments appearing on specific lines
5. Reply to a comment with "@claude explain this further" -- show the contextual response
6. Show the overall review summary

### What to Automate (Decision Framework)
**Show on screen:** Table from the lesson: Automate vs. Don't
**Say:**
- PR review first pass: automate. Issue triage: automate. Small fixes from comments: automate.
- Architectural decisions: keep human. Security-sensitive changes: keep human. Breaking change approval: keep human.
- Good rule: Claude catches the typos and missing error handling. Humans decide on architecture and user experience.

### Cost and Latency Tips
**Show on screen:** Bullet list
**Say:**
- Scope your triggers. Use @claude mentions instead of running on every comment.
- Use path filters if Claude only needs to review certain directories.
- Sonnet is usually sufficient for reviews. Save Opus for complex analysis.
- Monitor API usage weekly during the first month to calibrate.

## Exercise Walkthrough (60 sec)
**Show on screen:** Exercise steps
**Say:**
- Start with a test repo, not production
- Open a PR with a deliberate small mistake
- Watch how Claude reviews it
- Try an @claude mention to test interactive responses
- Refine triggers and path filters based on what you see
**Demo:** Show the test PR workflow in fast-forward, highlighting the key moments.

## Wrap Up (20 sec)
**Say:** "Your CLAUDE.md does double duty: it guides your local workflow AND your GitHub reviews. Set up the integration on a test repo, tune it, then roll it out to your team. Next: hooks and automation for your local Claude Code sessions."
**Show on screen:** Key card: "Automate the first pass. Keep humans for the final call."
