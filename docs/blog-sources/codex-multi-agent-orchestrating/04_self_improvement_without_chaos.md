# Self-improvement without chaos (AGENTS.md + Evals)
Goal: let the system learn, without letting it rewrite itself into a mess.

## The rule
- Log everything.
- Promote only what proved valuable.
- Keep AGENTS.md short and curated.

If you keep appending forever, you get:
- instruction bloat
- worse retrieval
- conflicting rules
- slower sessions

Codex also has a size cap for project docs by default, so bloat hits a hard limit anyway.

## Recommended structure (two files, not one)
1) `AGENTS.md` (curated, stable)
- Only the rules that consistently improve outcomes.
- The commands that mirror CI.
- The repo conventions that prevent repeated mistakes.

2) `docs/agent-notes.md` (append-only log)
- Lessons learned after each run
- Failures, root causes, and what fixed them
- Candidate improvements for AGENTS.md

Promotion rule:
- Only copy a lesson from agent-notes.md into AGENTS.md if it repeats and measurably helps.

## Add a meta role, but keep it advisory
Create a role like `meta_optimizer` that:
- reads plan.md, CI logs, and diffs
- writes “recommendations” into docs/agent-notes.md
- does not edit config or role files automatically

This gives self-improvement with governance.

## Evals: how you prevent regressions
When you change AGENTS.md or role prompts:
- run a small eval set (3 to 10 tasks)
- compare success rate, time to green, and diff quality
- keep changes only if the metric improves

Simple rubric you can reuse:
- Plan quality: atomic tasks, clear acceptance criteria
- Convergence: how quickly you get to green
- Safety: reviewer/security catch rate
- Noise: output is concise and actionable

## Keep the blog point-focused
In the orchestration blog:
- Mention this section briefly as “how to improve over time”.
- Do not deep dive into eval tooling.
Save full eval workflow for a separate post.
