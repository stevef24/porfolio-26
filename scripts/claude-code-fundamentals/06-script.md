# Video Script: Slash Commands
Duration: 4 min estimated

## Hook (15 sec)
**Show on screen:** Claude Code with a list of 20+ slash commands scrolling past
**Say:** "There are over twenty slash commands. You need six of them. Let me show you which ones."

## Setup (20 sec)
**Show on screen:** The six-command table from the lesson
**Say:**
- Slash commands are your workflow controls inside Claude Code
- Most people either memorize too many or don't learn any
- We're going to focus on the six that handle 90% of your needs

## Main Content

### The Big Six (Live Demo)
**Show on screen:** Terminal, real Claude Code session
**Say:**
- These six commands are your daily drivers. Let me show each one in action.
**Demo:** Run through each command in a live session:

1. **`/clear`** -- "You just finished a task. New task ahead." Run it. Show the clean slate. "This is the most underused command."

2. **`/compact`** -- "You're mid-task, context is getting heavy." Run it. Show the summary. "Notice what gets preserved and what gets compressed."

3. **`/model`** -- "You need heavier reasoning." Run it. Show the model picker. Switch from Sonnet to Opus. "Like choosing the right wrench from the toolbox."

4. **`/permissions`** -- "You keep approving `pnpm test`." Run it. Show the allow list. Add a command. "Now that runs without asking."

5. **`/mcp`** -- "A server is acting up." Run it. Show the status panel. "Green means connected. Red means restart."

6. **`/add-dir`** -- "Your task spans two repos." Run it. Show adding a second directory. "Now Claude can see both projects."

### The Decision Tree
**Show on screen:** The decision framework from the lesson
**Say:**
- Claude confused? Just started a new task? `/clear`
- Claude confused but you're deep in current task? `/compact`
- Output quality is low but context is fine? `/model` to a stronger model
- Tool not working? `/mcp` or `/permissions`
- Running out of context? `/clear` or `/compact` depending on continuity needs

### Model Switching Strategy
**Show on screen:** Task type to model mapping table
**Say:**
- Quick edits, renames, simple questions: Haiku
- Standard feature work, bug fixes: Sonnet
- Architecture decisions, complex refactors: Opus
- You can switch mid-conversation -- start with Sonnet, escalate to Opus for the hard part, drop back
**Demo:** Show a mid-conversation model switch. Ask a simple question on Sonnet, then switch to Opus and ask a complex architectural question. Briefly note the difference in depth.

## Exercise Walkthrough (45 sec)
**Show on screen:** Exercise steps
**Say:**
- For the next three tasks, start each one with /clear. Notice how much cleaner the first response is.
- Try model switching: ask the same question on Sonnet and Opus. Compare reasoning depth.
- Write down your three most-used commands and pin them visible for a week.
**Demo:** Quick side-by-side of Sonnet vs. Opus response depth on the same architectural question.

## Wrap Up (15 sec)
**Say:** "Six commands. That's all you need for daily workflow control. /clear is your best friend. /model is your power dial. Learn these six, look up the rest when needed."
**Show on screen:** Card: "/clear /compact /model /permissions /mcp /add-dir"
