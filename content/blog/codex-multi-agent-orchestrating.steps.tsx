import type { CodeStep } from "@/components/blog/CanvasCodeStage";

export const codexMultiAgentOrchestratingSteps: CodeStep[] = [
  {
    id: "config-foundation",
    title: "Start with a clean global config",
    file: "config.toml",
    lang: "toml",
    code: `[agents]
max_threads = 12

[agents.orchestrator]
description = "Owns plan.md, delegates scoped tasks, merges outcomes."
config_file = "~/.codex/agents/orchestrator.md"

[agents.implementer]
description = "Implements one atomic task, then reports exact file changes."
config_file = "~/.codex/agents/implementer.md"

[agents.ci_runner]
description = "Runs deterministic CI commands, isolates failures, reports logs."
config_file = "~/.codex/agents/ci_runner.md"`,
  },
  {
    id: "role-roster",
    title: "Define a small team with clear boundaries",
    file: "agents.md",
    lang: "md",
    code: `# Team Roles

- orchestrator: plan owner, batching, final synthesis
- explorer: map code paths and CI workflows
- implementer: one task per worker, no scope drift
- ci_runner: mirror CI locally and produce minimal repro logs
- reviewer: correctness + regression review
- security_auditor: secrets, injection, auth mistakes
- qa_test_author: add tests for weak or missing coverage
- release_manager: release notes + rollback checklist`,
  },
  {
    id: "parallel-batch",
    title: "Run a small parallel implementation batch",
    file: "orchestrate.ts",
    lang: "ts",
    code: `const tasks = [
  "Refactor sidebar loading state",
  "Fix flaky auth redirect test",
  "Add API retry backoff guard"
]

const workers = await Promise.all(
  tasks.map((task) =>
    spawn_agent({
      agent_type: "implementer",
      message: task
    })
  )
)

const ids = workers.map((worker) => worker.id)
const result = await wait({ ids, timeout_ms: 180000 })`,
  },
  {
    id: "quality-gates",
    title: "Gate every batch with CI, review, and security",
    file: "gates.ts",
    lang: "ts",
    code: `await spawn_agent({
  agent_type: "ci_runner",
  message: "Run pnpm lint && pnpm test && pnpm exec tsc --noEmit"
})

await spawn_agent({
  agent_type: "reviewer",
  message: "Check for correctness regressions in changed files"
})

await spawn_agent({
  agent_type: "security_auditor",
  message: "Audit touched auth/input/code paths for common risks"
})`,
  },
  {
    id: "green-loop",
    title: "Repeat the same convergence loop",
    file: "loop.md",
    lang: "md",
    code: `1. Update plan.md with atomic tasks
2. Run 2-4 implementers in parallel
3. Run ci_runner
4. Run reviewer + security_auditor
5. Add tests via qa_test_author if coverage is weak
6. Merge only green batches
7. Repeat until CI is fully green`,
  },
  {
    id: "first-run-prompt",
    title: "Use a deterministic first-run prompt",
    file: "first-run.txt",
    lang: "txt",
    code: `You are the orchestrator.

Read plan.md and execute only the first batch of 2-4 independent tasks.
For each task:
- assign one implementer
- keep file ownership explicit
- return changed files and verification output

After implementation:
- run ci_runner
- run reviewer and security_auditor
- update plan.md with pass/fail status

Do not expand scope beyond current batch.`,
  },
];

