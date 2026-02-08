# Video Script: Introduction & Setup
Duration: 5 min estimated

## Hook (15 sec)
**Show on screen:** Terminal with Claude Code already running, rapidly reading files, editing code, running tests -- sped up 2x
**Say:** "This isn't a chatbot. It's an AI agent that lives in your terminal and takes real actions on your codebase. Let's get it running."

## Setup (30 sec)
**Show on screen:** Clean terminal window
**Say:**
- Claude Code is a terminal-native AI agent -- it reads, edits, runs commands, and explains as it goes
- Three install paths exist, but only one is recommended
- By the end of this video you'll have it running in a real project

## Main Content

### Installation
**Show on screen:** Terminal, typing the install command
**Say:**
- The native installer is what you want -- auto-updates, fastest startup
- Homebrew works but you'll update manually
- npm is deprecated -- if you're on it, migrate with `claude install`
**Demo:** Run the native install command live:
```
curl -fsSL https://claude.ai/install.sh | bash
```
Show the output, then restart the terminal. Run `claude --version` to confirm.

### First Run
**Show on screen:** Navigate to a real project directory
**Say:**
- Pick a real project with actual code -- not an empty folder
- Just type `claude` and hit enter
**Demo:**
```
cd ~/projects/my-app
claude
```
Show Claude scanning the project, loading CLAUDE.md (if present), and waiting for input. Point out the tool indicators in the UI.

### Your First Prompt
**Show on screen:** Claude Code session ready for input
**Say:**
- Your first prompt should be small, specific, and read-only
- Don't ask it to refactor your codebase. Ask it to explain something.
- This is the "read-first, act-later" pattern
**Demo:** Type: "What is the main entry point of this project and what does it do?"
- Watch which files Claude reads (highlight the tool calls)
- Point out that it picked just the files it needed, not everything
- Show that it didn't make any changes -- just reported

### Troubleshooting Quick Hits
**Show on screen:** Table from the lesson (Symptom / Cause / Fix)
**Say:**
- If `claude` isn't found, restart your terminal after install
- If startup is slow, add a .claudeignore file for big directories like node_modules
- `claude doctor` is your diagnostic tool when things feel off
**Demo:** Run `claude doctor` and walk through the output briefly.

## Exercise Walkthrough (60 sec)
**Show on screen:** Steps list from the lesson
**Say:**
- Install it, navigate to a real project, run `claude`
- Ask "What is the main entry point?" and watch the tool calls
- Then ask "What dependencies does this project use?" -- see how it builds on existing context
**Demo:** Show the follow-up question and highlight how Claude uses context from the first response.

## Wrap Up (20 sec)
**Say:** "Claude Code reads, thinks, then reports. It doesn't guess, and it doesn't change anything unless you ask. Next up: we'll create a CLAUDE.md file so Claude remembers your project's rules across every session."
**Show on screen:** Preview of a CLAUDE.md file
