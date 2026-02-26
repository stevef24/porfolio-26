# Storyboards for animations (multi-agent + MCP)
Keep visuals minimal, high contrast, and readable at small sizes.

## Storyboard A: MCP bloat vs scoped MCP per role (12 to 18s)
Goal: show why “one agent with all MCPs” is noisy, and how splitting roles keeps tool context clean.

1) Shot 1 (2s): “One agent, everything attached”
- Visual: big Main Agent box
- MCP icons stack inside (Notion, Linear, DevTools, Docs, UI libs)
- Motion: icons keep piling in

2) Shot 2 (2s): “Bloat symptoms”
- Visual: box subtly bulges, clutter overlay increases
- Motion: slow spinner, hesitant progress bar

3) Shot 3 (3s): “Split into roles”
- Visual: big box splits into 4 boxes:
  - Orchestrator
  - Implementer
  - UI Agent
  - Docs/PM Agent
- Motion: clean split, clutter fades

4) Shot 4 (3s): “Tools follow responsibility”
- Visual: each role gets 1 to 2 MCP icons only
- Motion: icons snap onto correct role like magnets

5) Shot 5 (3s): “Cleaner context, faster work”
- Visual: smaller boxes run quickly, green checks appear
- Text: “Enable MCPs per role, not globally.”

6) Shot 6 (2s): Rule card
- Text: “Attach tools where they are needed. Keep the rest clean.”

Optional voiceover line:
“Split cognition first, then attach tools only where they pay for themselves.”

## Storyboard B1: Parallel work with quality gates (Control Tower metaphor, 15 to 20s)
Goal: show parallelism plus serial gates.

1) Shot 1: Control tower = Orchestrator
- Visual: tower with plan.md cards

2) Shot 2: Plan cards become flights (A, B, C)
- Motion: 3 flights depart to Implementers

3) Shot 3: All flights land at CI runway (ci_runner)
- Motion: quick test scan, some flights get red flags

4) Shot 4: Reviewer gate then Security gate
- Motion: stamps “Approved” or “Fix”

5) Shot 5: Merge back to Main Branch hangar
- Motion: green deploy button appears

On-screen caption:
“Parallel execution. Serial quality gates.”

## Storyboard B2: Parallel work with quality gates (Assembly Line metaphor, 15 to 20s)
Goal: technical CI/CD feel.

1) Shot 1: Conveyor belt of atomic tasks (plan.md)
2) Shot 2: Tasks split into parallel lanes (Implementers)
3) Shot 3: Lanes converge into CI station (ci_runner)
4) Shot 4: Two stamp stations:
- Reviewer
- Security
5) Shot 5: Release Manager prints notes and checklist
6) Shot 6: “Ship” box with green status

On-screen caption:
“Small tasks. Parallel build. Repeatable gates.”
