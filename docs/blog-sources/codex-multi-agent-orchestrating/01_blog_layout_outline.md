# Orchestrating Multi-Agent Flows in Kodaks (Codex)
Blog outline (500 to 800 words, excluding code blocks)

## 1) Hook + promise (60 to 90 words)
- Pain: one agent doing planning, coding, testing, review, security gets slow and drifts.
- Promise: a small “team” of roles that runs in parallel and converges on green CI.
- What readers get: install steps, rationale for settings, and two downloadable packs (Pro vs Plus).

Insert: 1 short diagram of the loop (ASCII or simple boxes).

## 2) Mental model (80 to 120 words)
Explain in plain terms:
- Your prompt goes to the main session.
- Codex spawns subagents when you explicitly call them or when descriptions match.
- Role files load on-demand, so the main context stays cleaner.

Insert: a 6-line flow diagram:
Main -> Orchestrator -> (Implementers in parallel) -> CI -> Review + Security -> Merge back.

## 3) Why multi-agent beats “one mega agent” for CI/CD (90 to 120 words)
3 bullets only:
- Separation of concerns: each role has one job.
- Faster iteration: parallel implementation for independent tasks.
- Quality gates: review and security happen every batch, not at the end.

## 4) Install and enable (90 to 120 words)
Keep this very practical:
- Where config lives: `~/.codex/config.toml` (global) and optional `.codex/config.toml` (project).
- Add roles in `[agents.<role>]` with `description` and `config_file`.
- Increase parallelism using `[agents].max_threads` (start with 12).

Insert code blocks:
- Minimal config skeleton (no secrets, no MCP list).
- Folder structure for `~/.codex/agents/`.

## 5) The “small team” roster (120 to 170 words)
Give each role 1 to 2 lines, plus when it runs:
- orchestrator: owns plan.md, delegates tasks, merges results.
- explorer: maps code, CI workflows, local equivalents.
- implementer: executes 1 atomic task, stays scoped.
- ci_runner: runs the minimal deterministic command set, isolates failures.
- reviewer: PR-grade correctness and regression check.
- security_auditor: secrets, injection, auth mistakes.
- qa_test_author: adds tests and repro steps when needed.
- release_manager: release notes, rollout and rollback checklist.

Insert code blocks:
- One full role file example (orchestrator).
- Very short snippets for 1 or 2 others (implementer, reviewer).

## 6) Rationale for the core settings (120 to 170 words)
Do this as a “Why these defaults?” list:
- max_threads: why 12 is a good starting ceiling, and when to reduce.
- on-demand role files: why it keeps sessions stable for long runs.
- approval_policy + sandbox_mode: why you chose autonomy, and the trade-off.
- history persistence: why it helps long-running loops.

Insert: a tiny “tune this if…” box:
- 429 errors -> reduce max_threads
- messy diffs -> reduce batch size
- drift -> tighten plan.md template

## 7) MCP strategy without context bloat (80 to 120 words)
Explain the pattern, not your personal MCP set:
- Do not attach every MCP to every role by default.
- Assign MCPs to the few roles that need them (UI agent gets shadcn, motion agent gets motion).
- Use env vars for secrets.

Insert: one generic MCP block example using env_vars.

## 8) The orchestration loop (80 to 120 words)
Describe one repeatable batch:
1) Orchestrator updates plan.md (atomic tasks).
2) Spawn 2 to 4 implementers in parallel.
3) ci_runner mirrors CI locally.
4) reviewer + security_auditor gate the batch.
5) qa_test_author adds tests if coverage is weak.
6) Repeat until green.

Insert: sample “first-run prompt” readers can copy.

## 9) Two download packs (Pro vs Plus) (80 to 120 words)
Keep it concrete:
- Pack includes: config.toml + agents/ folder + first-run prompt.
- Pro pack: Spark for explorer/implementer, 5.3 for orchestrator/reviewer/security.
- Plus pack: non-Spark alternatives and conservative defaults.

Insert: a role-to-model mapping table.

## 10) Close (30 to 60 words)
Recap the win:
- More speed where it helps (parallel implementation).
- More safety where it matters (repeatable gates).
- Less drift (plan.md as source of truth).
