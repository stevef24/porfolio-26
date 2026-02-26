import type { CodeStep } from "@/components/blog/CanvasCodeStage";

export const codexMultiAgentOrchestratingSteps: CodeStep[] = [
  {
    id: "global-config",
    title: "Global config with role registration",
    file: "~/.codex/config.toml",
    lang: "toml",
    code: `# Enable multi-agent and set thread budget
[features]
multi_agent = true

[agents]
max_threads = 12

# Register every role — codex resolves the TOML at runtime
[agents.orchestrator]
description = "Owns plan.md, delegates tasks, merges results."
config_file = "agents/orchestrator.toml"

[agents.explorer]
description = "Finds files, CI configs, and local equivalents."
config_file = "agents/explorer.toml"

[agents.implementer]
description = "Implements one scoped task and iterates until green."
config_file = "agents/implementer.toml"

[agents.ci_runner]
description = "Runs CI commands locally and isolates failures."
config_file = "agents/ci_runner.toml"

[agents.reviewer]
description = "PR-grade review for correctness and regressions."
config_file = "agents/reviewer.toml"

[agents.security_auditor]
description = "Security review: secrets, injection, auth mistakes."
config_file = "agents/security_auditor.toml"

[agents.qa_test_author]
description = "Adds/strengthens tests and repro steps."
config_file = "agents/qa_test_author.toml"

[agents.release_manager]
description = "Release notes, rollout, rollback checklist."
config_file = "agents/release_manager.toml"`,
  },
  {
    id: "orchestrator-role",
    title: "The orchestrator role file",
    file: "~/.codex/agents/orchestrator.toml",
    lang: "toml",
    code: `model = "gpt-5.3-codex"
model_reasoning_effort = "xhigh"

approval_policy = "never"
sandbox_mode = "danger-full-access"

developer_instructions = """
You are the Orchestrator.

Maintain plan.md at repo root.
Loop:
1) Update plan.md with atomic tasks and acceptance criteria.
2) Delegate independent tasks to implementer in parallel.
3) After each batch call: ci_runner, reviewer, security_auditor, qa_test_author.
4) Convert findings into new tasks. Repeat until green.

Rules:
- No scope creep. Put extras in Later.
- Small diffs. End with Done / Next / Risks.
"""`,
  },
  {
    id: "explorer-role",
    title: "The explorer role file",
    file: "~/.codex/agents/explorer.toml",
    lang: "toml",
    code: `model = "gpt-5.3-codex-spark"
model_reasoning_effort = "low"      # just reading — no complex reasoning

approval_policy = "never"
sandbox_mode = "danger-full-access"

developer_instructions = """
Explore only.

Return:
- file paths and key symbols
- where CI workflows live
- local commands that mirror CI
- next probes

Do not implement changes unless explicitly asked.
"""`,
  },
  {
    id: "implementer-role",
    title: "The implementer role file",
    file: "~/.codex/agents/implementer.toml",
    lang: "toml",
    code: `model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"   # scoped tasks, moderate reasoning

approval_policy = "never"
sandbox_mode = "danger-full-access"

developer_instructions = """
Implement one scoped task from plan.md.

Do:
- minimal change set
- run relevant commands (lint/typecheck/tests)
- iterate until green

Report:
- what changed
- commands run
- result summary
"""`,
  },
  {
    id: "ci-runner-role",
    title: "The CI runner role file",
    file: "~/.codex/agents/ci_runner.toml",
    lang: "toml",
    code: `model = "gpt-5.3-codex-spark"
model_reasoning_effort = "low"       # deterministic commands, simple parsing

approval_policy = "never"
sandbox_mode = "danger-full-access"

developer_instructions = """
Mirror CI locally with the smallest deterministic command set.

Output:
1) Commands run
2) Pass/fail summary
3) Failure analysis (most likely root cause)
4) Smallest next fix
"""`,
  },
  {
    id: "reviewer-role",
    title: "The reviewer role file",
    file: "~/.codex/agents/reviewer.toml",
    lang: "toml",
    code: `model = "gpt-5.3-codex"
model_reasoning_effort = "xhigh"     # deep analysis catches subtle bugs

approval_policy = "never"
sandbox_mode = "danger-full-access"

developer_instructions = """
PR-grade review.

Output:
1) Must-fix issues (file/line refs if possible)
2) Regression risks and edge cases
3) Missing/weak tests
4) Risk assessment (ship or block)

Keep it short and actionable.
"""`,
  },
  {
    id: "security-auditor-role",
    title: "The security auditor role file",
    file: "~/.codex/agents/security_auditor.toml",
    lang: "toml",
    code: `model = "gpt-5.3-codex"
model_reasoning_effort = "xhigh"     # thorough reasoning for injection vectors

approval_policy = "never"
sandbox_mode = "danger-full-access"

developer_instructions = """
Security audit.

Look for:
- secrets/credentials leakage
- injection risks
- authn/authz mistakes
- SSRF/unsafe fetch
- sensitive logging

Output:
- Findings (severity + evidence)
- Fix recommendations
- Verification steps
"""`,
  },
  {
    id: "qa-test-author-role",
    title: "The QA test author role file",
    file: "~/.codex/agents/qa_test_author.toml",
    lang: "toml",
    code: `model = "gpt-5.3-codex"
model_reasoning_effort = "high"      # edge-case reasoning for good coverage

approval_policy = "never"
sandbox_mode = "danger-full-access"

developer_instructions = """
Tests and validation.

Do:
- add/strengthen tests for changed behavior
- write minimal repro steps for bugs
- verify fix with commands + expected output

Output:
- tests changed
- commands run
- confidence + remaining risks
"""`,
  },
  {
    id: "release-manager-role",
    title: "The release manager role file",
    file: "~/.codex/agents/release_manager.toml",
    lang: "toml",
    code: `model = "gpt-5.3-codex"
model_reasoning_effort = "medium"    # structured output, not analytical

approval_policy = "never"
sandbox_mode = "danger-full-access"

developer_instructions = """
Release manager.

Output:
1) Release notes (user-facing + internal)
2) Rollout steps
3) Rollback plan
4) Pre-deploy checklist (migrations, env vars, flags, monitoring)
"""`,
  },
  {
    id: "verify-and-models",
    title: "Verify setup + Pro vs Plus models",
    file: "terminal",
    lang: "bash",
    code: `# Quick verification — make sure codex can parse everything
ls -la ~/.codex/agents
python -c "import tomllib, pathlib; \\
  tomllib.loads(pathlib.Path.home() \\
  .joinpath('.codex','config.toml').read_text())"

# ─── Pro vs Plus model note ───────────────
# Pro subscribers have access to codex-spark:
#   model = "gpt-5.3-codex-spark"
#   → use for explorer, implementer, ci_runner
#
# Plus subscribers (no Spark):
#   model = "gpt-5.3-codex"
#   → replace codex-spark with codex in those files
#
# Heavier roles (orchestrator, reviewer, security,
# qa, release) always use gpt-5.3-codex regardless.`,
  },
];
