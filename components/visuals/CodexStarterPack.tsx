"use client";

/**
 * CodexStarterPack
 *
 * Generates downloadable shell setup scripts for Codex multi-agent
 * configuration. Two variants: Pro (GPT-5.4 + Spark for fast roles)
 * and Plus (GPT-5.4 everywhere).
 */

import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { VisualWrapper } from "./VisualWrapper";

// ─── TOML content per role ────────────────────────────────────────────────

interface RoleConfig {
  file: string;
  model: { pro: string; plus: string };
  reasoning: string;
  instructions: string;
}

const CONFIG_TOML = `# Enable multi-agent and set thread budget
[features]
multi_agent = true

[agents]
max_threads = 12

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

[agents.qa_test_author]
description = "Adds/strengthens tests and repro steps."
config_file = "agents/qa_test_author.toml"

[agents.release_manager]
description = "Release notes, rollout, rollback checklist."
config_file = "agents/release_manager.toml"

# Optional local security reviewer.
# If you want dedicated security scanning, consider Codex Security instead.
#
# [agents.security_reviewer]
# description = "Optional local security review for secrets, injection, auth mistakes."
# config_file = "agents/security_reviewer.toml"`;

const ROLES: RoleConfig[] = [
  {
    file: "orchestrator.toml",
    model: { pro: "gpt-5.4", plus: "gpt-5.4" },
    reasoning: "xhigh",
    instructions: `You are the Orchestrator.

Maintain plan.md at repo root.
Loop:
1) Update plan.md with atomic tasks and acceptance criteria.
2) Delegate independent tasks to implementer in parallel.
3) After each batch call: ci_runner, reviewer, qa_test_author.
4) If the change touches auth, secrets, external fetches, file access, permissions, or user data, trigger a security review step or use Codex Security.
5) Convert findings into new tasks. Repeat until green.

Rules:
- No scope creep. Put extras in Later.
- Small diffs. End with Done / Next / Risks.`,
  },
  {
    file: "explorer.toml",
    model: { pro: "gpt-5.3-codex-spark", plus: "gpt-5.4" },
    reasoning: "low",
    instructions: `Explore only.

Return:
- file paths and key symbols
- where CI workflows live
- local commands that mirror CI
- next probes

Do not implement changes unless explicitly asked.`,
  },
  {
    file: "implementer.toml",
    model: { pro: "gpt-5.4", plus: "gpt-5.4" },
    reasoning: "medium",
    instructions: `Implement one scoped task from plan.md.

Do:
- minimal change set
- run relevant commands (lint/typecheck/tests)
- iterate until green

Report:
- what changed
- commands run
- result summary`,
  },
  {
    file: "ci_runner.toml",
    model: { pro: "gpt-5.3-codex-spark", plus: "gpt-5.4" },
    reasoning: "low",
    instructions: `Mirror CI locally with the smallest deterministic command set.

Output:
1) Commands run
2) Pass/fail summary
3) Failure analysis (most likely root cause)
4) Smallest next fix`,
  },
  {
    file: "reviewer.toml",
    model: { pro: "gpt-5.4", plus: "gpt-5.4" },
    reasoning: "xhigh",
    instructions: `PR-grade review.

Output:
1) Must-fix issues (file/line refs if possible)
2) Regression risks and edge cases
3) Missing/weak tests
4) Risk assessment (ship or block)

Keep it short and actionable.`,
  },
  {
    file: "qa_test_author.toml",
    model: { pro: "gpt-5.4", plus: "gpt-5.4" },
    reasoning: "high",
    instructions: `Tests and validation.

Do:
- add/strengthen tests for changed behavior
- write minimal repro steps for bugs
- verify fix with commands + expected output

Output:
- tests changed
- commands run
- confidence + remaining risks`,
  },
  {
    file: "release_manager.toml",
    model: { pro: "gpt-5.4", plus: "gpt-5.4" },
    reasoning: "medium",
    instructions: `Release manager.

Output:
1) Release notes (user-facing + internal)
2) Rollout steps
3) Rollback plan
4) Pre-deploy checklist (migrations, env vars, flags, monitoring)`,
  },
];

type Tier = "pro" | "plus";

function generateToml(role: RoleConfig, tier: Tier): string {
  return `model = "${role.model[tier]}"
model_reasoning_effort = "${role.reasoning}"

approval_policy = "never"
sandbox_mode = "danger-full-access"

developer_instructions = """
${role.instructions}
"""`;
}

function generateSetupScript(tier: Tier): string {
  const lines = [
    "#!/bin/bash",
    `# Codex multi-agent setup — ${tier.toUpperCase()} tier`,
    "# Run: bash setup-codex-agents.sh",
    "",
    "set -e",
    "",
    "mkdir -p ~/.codex/agents",
    "",
    `cat > ~/.codex/config.toml << 'CODEX_EOF'`,
    CONFIG_TOML,
    "CODEX_EOF",
    "",
  ];

  for (const role of ROLES) {
    const toml = generateToml(role, tier);
    lines.push(`cat > ~/.codex/agents/${role.file} << 'CODEX_EOF'`);
    lines.push(toml);
    lines.push("CODEX_EOF");
    lines.push("");
  }

  // Add optional commented security_reviewer template
  lines.push("# Optional: uncomment to add a local security reviewer role.");
  lines.push("# If you want dedicated security scanning, consider Codex Security instead.");
  lines.push("#");
  lines.push("# cat > ~/.codex/agents/security_reviewer.toml << 'CODEX_EOF'");
  lines.push('# model = "gpt-5.4"');
  lines.push('# model_reasoning_effort = "high"');
  lines.push("#");
  lines.push('# approval_policy = "never"');
  lines.push('# sandbox_mode = "danger-full-access"');
  lines.push("#");
  lines.push('# developer_instructions = """');
  lines.push("# Security review only.");
  lines.push("#");
  lines.push("# Look for:");
  lines.push("# - secrets/credentials leakage");
  lines.push("# - injection risks");
  lines.push("# - authn/authz mistakes");
  lines.push("# - SSRF/unsafe fetch");
  lines.push("# - sensitive logging");
  lines.push("#");
  lines.push("# Output:");
  lines.push("# - Findings (severity + evidence)");
  lines.push("# - Fix recommendations");
  lines.push("# - Verification steps");
  lines.push('# """');
  lines.push("# CODEX_EOF");
  lines.push("");

  lines.push('echo "Done — codex multi-agent config written to ~/.codex/"');
  lines.push('echo "Agents: $(ls ~/.codex/agents/*.toml | wc -l | tr -d " ") role files"');

  return lines.join("\n");
}

function downloadScript(tier: Tier) {
  const content = generateSetupScript(tier);
  const blob = new Blob([content], { type: "text/x-shellscript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `setup-codex-agents-${tier}.sh`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────

export function CodexStarterPack({ className }: { className?: string }) {
  const reduced = !!useReducedMotion();
  const [copied, setCopied] = useState<Tier | null>(null);

  const handleCopy = useCallback(async (tier: Tier) => {
    const script = generateSetupScript(tier);
    await navigator.clipboard.writeText(script);
    setCopied(tier);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <VisualWrapper
      className={className}
      tone="neutral"
      showCaption={false}
    >
      <div className="flex flex-col gap-8 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["pro", "plus"] as const).map((tier) => (
            <div
              key={tier}
              className="flex flex-col gap-4 rounded-lg p-5"
              style={{ backgroundColor: "var(--sf-bg-subtle)" }}
            >
              <div className="flex flex-col gap-1">
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.12em] font-medium"
                  style={{ color: "var(--sf-text-primary)" }}
                >
                  {tier} tier
                </span>
                <span
                  className="font-mono text-[10px]"
                  style={{ color: "var(--sf-text-tertiary)" }}
                >
                  {tier === "pro" ? "GPT-5.4 + Spark for fast roles" : "GPT-5.4 for all roles"}
                </span>
              </div>

              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={() => downloadScript(tier)}
                  className={cn(
                    "flex-1 font-mono text-[11px] uppercase tracking-[0.08em]",
                    "px-4 py-2.5 rounded transition-colors cursor-pointer",
                  )}
                  style={{
                    color: "var(--sf-text-primary)",
                    backgroundColor: "var(--sf-bg-surface)",
                  }}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                >
                  Download setup script
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => handleCopy(tier)}
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-[0.08em]",
                    "px-4 py-2.5 rounded transition-colors cursor-pointer",
                  )}
                  style={{
                    color: copied === tier ? "var(--va-green)" : "var(--sf-text-tertiary)",
                    backgroundColor: "var(--sf-bg-surface)",
                  }}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                >
                  {copied === tier ? "Copied" : "Copy"}
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </VisualWrapper>
  );
}
