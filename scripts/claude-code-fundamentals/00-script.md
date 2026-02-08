# Video Script: Context Primer
Duration: 5 min estimated

## Hook (20 sec)
**Show on screen:** Split screen -- left side shows a messy desk overflowing with papers, right side shows a clean desk with just a laptop and one notebook.
**Say:** "What if the single biggest thing holding back your AI coding tool... is you giving it too much information?"

## Setup (30 sec)
**Show on screen:** Claude Code terminal, empty session
**Say:**
- This lesson is the foundation for everything in this course
- Context is Claude's working memory -- and it has a hard limit
- Understanding this one concept will make every other technique click

## Main Content

### The Backpack Mental Model
**Show on screen:** Simple animation or whiteboard sketch of a backpack being filled with items
**Say:**
- Context is a single backpack, not a filing cabinet
- Your prompts, Claude's responses, file contents, CLAUDE.md -- all share the same bag
- When the bag is full, older items get compressed or dropped
**Demo:** Open Claude Code in a real project. Type a few prompts. Point out that every exchange adds weight.

### Signal vs. Noise Live Demo
**Show on screen:** Two terminal windows side by side
**Say:**
- Watch what happens with a noisy prompt vs. a focused one
**Demo:**
- Left terminal: Paste the "noisy" prompt from the lesson -- "Here is my whole repo. Review all code, find issues, rewrite everything..."
- Right terminal: Paste the "focused" prompt -- "Here are two files: src/auth.ts and src/middleware.ts. Review for auth bugs only."
- Compare the quality and speed of responses

### The Simple Context Workflow
**Show on screen:** Four-step flow: Start fresh > Add only what's needed > Do the work > Clear or compact
**Say:**
- This four-step loop works for every task at every skill level
- The key habit: start fresh, stay focused, clean up after
**Demo:** Walk through one real task using the four steps. Show starting a new session, adding one file, asking a focused question, then using /clear.

## Exercise Walkthrough (60 sec)
**Show on screen:** The "Trim the Prompt" exercise from the lesson
**Say:**
- Take any recent prompt you gave to an AI tool
- Ask yourself: what files were actually relevant vs. what you dumped in "just in case"?
- The goal is to cut scope, not add more instructions
**Demo:** Take a real prompt from a past session and trim it live on screen, narrating what you're removing and why.

## Wrap Up (20 sec)
**Say:** "Context is a budget, not a library. Two relevant files beat an entire repo dump. Build this habit now -- every technique in the rest of this course depends on it."
**Show on screen:** Key takeaway card: "Sharp context = sharp output"
