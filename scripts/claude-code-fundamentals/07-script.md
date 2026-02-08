# Video Script: MCP Servers
Duration: 6 min estimated

## Hook (20 sec)
**Show on screen:** Claude Code querying a Postgres database mid-conversation, showing table schemas inline
**Say:** "What if your code editor could talk directly to your database, your browser, your Figma files -- all inside the same conversation? That's MCP. But there's a catch most people miss."

## Setup (30 sec)
**Show on screen:** Architecture diagram: Claude Code <-> MCP Server <-> External Tool
**Say:**
- MCP stands for Model Context Protocol -- it's a standardized way to plug external tools into Claude Code
- Each MCP server exposes a set of tools. Claude uses them like its built-in tools.
- The catch: every enabled server costs context space, even when idle
- The art is knowing what to connect and what to leave off

## Main Content

### How MCP Works (Visual Walkthrough)
**Show on screen:** The architecture diagram from the lesson, animated if possible
**Say:**
- Your Claude Code session talks to MCP servers -- small programs running as separate processes
- Each server exposes tools. Database server exposes "query" and "schema" tools. Browser server exposes "navigate" and "screenshot" tools.
- Claude Code manages the connections. You just enable the ones you need.
**Demo:** Run `claude mcp list` to show currently configured servers. Point out what each one provides.

### The Context Cost Problem
**Show on screen:** Bar chart showing context usage with 0, 2, 4, and 6 MCP servers enabled
**Say:**
- Every enabled server adds its tool definitions to your context -- whether you use those tools or not
- Three servers might add 2,000 tokens of tool descriptions before you've typed a single prompt
- That's context budget you can't use for actual code
**Demo:** Show `/cost` with no MCP servers. Then add two servers, restart, and show `/cost` again. Highlight the token difference.

### The Practical Rule: 2-4 Servers
**Show on screen:** The decision table from the lesson
**Say:**
- Can you do it with a shell command? Use the shell instead.
- Will you use this tool more than 3 times this session? Worth the context cost.
- Already near context limits? Skip it.
**Demo:** Show a practical example: instead of adding a filesystem MCP server to copy a file, just use `cp` via Bash. Same result, no context cost.

### Adding and Managing Servers
**Show on screen:** Terminal
**Say:**
- Adding a server is one command. Removing it is one command. Checking status is /mcp.
**Demo:** Walk through the full lifecycle:
```
claude mcp add postgres npx @modelcontextprotocol/server-postgres
claude mcp list
claude mcp get postgres
```
Then inside a session, run `/mcp` to check status. Show a green (connected) vs. red (error) server.

### Project-Shared vs. Personal
**Show on screen:** Two file paths: `.mcp.json` (project) and `~/.claude/` (personal)
**Say:**
- Project-shared servers go in `.mcp.json` at your project root -- committed to git, everyone gets them
- Personal servers go in your user config -- just for you
- Think of `.mcp.json` like `.eslintrc` -- it defines shared tooling conventions
**Demo:** Show a minimal `.mcp.json` with one server. Explain that any teammate who clones the repo gets this server automatically.

## Exercise Walkthrough (60 sec)
**Show on screen:** Exercise steps
**Say:**
- First, audit: run `claude mcp list` and count your servers. More than four? Remove the ones you haven't used recently.
- Second, add one server intentionally for a real task. Use it. Check the context cost with /cost.
- Third, create a .mcp.json if your project doesn't have one. Just the servers your whole team needs.
**Demo:** Quick demo of removing an unused server: `claude mcp remove unused-server`

## Wrap Up (20 sec)
**Say:** "MCP is powerful but expensive in context terms. Keep 2-4 servers per project, prefer shell commands for simple tasks, and audit regularly. Next up: subagents -- how to delegate work without polluting your main context."
**Show on screen:** Key card: "Enable intentionally. Audit regularly. Prefer the shell when it works."
