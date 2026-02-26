# Best practices to maximize a Codex multi-agent workflow (CI/CD focus)
Keep this section tight in the blog. This is about orchestration, not a deep dive into skills.

## 1) Start small, scale concurrency last
- Set `max_threads` as a ceiling, not a target. Start at 12.
- In practice, run batches of 2 to 4 implementers until you trust the loop.
- If you hit 429s, reduce threads first, not prompts.

## 2) Make tasks atomic or parallelism becomes chaos
- Each implementer should own one small change set.
- If two tasks touch the same files or module boundaries, keep them serial.
- Use a plan.md template with:
  - Task goal
  - Acceptance criteria
  - Files likely touched
  - “Done when” checks

## 3) Quality gates every batch, not at the end
- After each parallel batch:
  - ci_runner runs the minimal deterministic command set
  - reviewer checks correctness and regressions
  - security_auditor checks secrets, injection, auth mistakes
- Treat these as “must pass” before merging the batch.

## 4) Descriptions are routing metadata
- The `description` field is how Codex knows when a role fits.
- Write descriptions like dispatch rules:
  - “Runs CI commands locally, isolates failures, produces logs.”
  - Not: “Helps with CI.”

## 5) Use on-demand role files to keep sessions stable
- Keep the main session lean.
- Put heavy instructions in role files so they load only when needed.

## 6) Default to “team roles”, not “extra personalities”
Avoid role explosion early. A good baseline:
- orchestrator
- implementer
- ci_runner
- reviewer
- security_auditor
- qa_test_author
- release_manager

Add new roles only when:
- a task repeats often, or
- a failure mode repeats often, or
- a tool integration adds noise to other roles.

## 7) MCP strategy: tools follow responsibility
- Do not enable every MCP for every role.
- Assign MCPs to the few roles that need them.
- Prefer env vars for secrets (env_vars) so tokens are not in config.
- If a role does not need tools, keep it clean (reviewer/security often do not).

## 8) “Green loop” rule for long runs
Long runs fail when you keep expanding scope. Use a strict loop:
- Plan -> Implement -> CI -> Review/Security -> Update plan -> Repeat
If something is “nice-to-have”, push it into a Later section.

## 9) Make outputs predictable with short templates
In each role prompt, include a small output schema:
- What changed
- Commands run
- Result summary
- Next actions
This reduces noise and makes orchestration reliable.

## 10) Project scoping: keep risky config out of global scope
- Keep a minimal global config.
- Put project-specific overrides in `.codex/config.toml` in the repo when needed.
- Use AGENTS.md to encode repo conventions, commands, and guardrails.

Sources worth citing in the blog:
- Codex multi-agents docs
- Config reference
- MCP docs
- AGENTS.md guide
