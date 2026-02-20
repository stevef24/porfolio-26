# Animation Design System — Blog Visuals

Minimal, purposeful motion. Notion restraint. Vercel precision. Every animation earns its place.

---

## Philosophy

- **Monochrome first.** `--va-fg` and `--va-fg-muted` for the overwhelming majority of elements. Colour only when it carries meaning.
- **No decoration.** Animations explain — they don't entertain. If removing the animation makes the diagram clearer, remove it.
- **Spring physics.** All motion uses `motion/react` spring presets. No `duration`-based CSS keyframes for interactive elements.
- **Scroll-triggered, once.** `useInView({ once: true })` with a 300ms lead-in delay. Never auto-plays on every render.
- **Reduced motion respected.** Every component checks `useReducedMotion()`. Pass `duration: 0` when true — never skip the animation entirely (still needs final state).

---

## Colour Tokens

All animation colours live in `app/globals.css` and flip automatically between light and dark mode.

### Monochrome base (use by default)

| Token | Value (light) | Value (dark) | Use for |
|---|---|---|---|
| `--va-fg` | `rgba(0,0,0,0.85)` | `rgba(255,255,255,0.85)` | Primary shapes, bars, lines, nodes |
| `--va-fg-muted` | `rgba(0,0,0,0.5)` | `rgba(255,255,255,0.5)` | Secondary / inactive elements |
| `--sf-border-subtle` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` | Dividers, grid lines, empty segments |
| `--sf-bg-subtle` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.04)` | Chip / tag backgrounds |
| `--sf-text-tertiary` | `rgba(0,0,0,0.54)` | `rgba(255,255,255,0.54)` | Labels, captions, axis text |
| `--sf-text-secondary` | `rgba(0,0,0,0.6)` | `rgba(255,255,255,0.6)` | Role names, secondary labels |

### Semantic accents (use with restraint)

Only add colour when it carries a specific meaning the reader needs to understand.

| Token | Light | Dark | Use for |
|---|---|---|---|
| `--va-blue` | `oklch(0.45 0.22 265)` | `oklch(0.68 0.18 265)` | Information flow, active/interactive, links, data paths |
| `--va-green` | `oklch(0.55 0.18 155)` | `oklch(0.7 0.16 155)` | Success states, CI pass, approved, confirmed |
| `--va-red` | `oklch(0.55 0.22 25)` | `oklch(0.7 0.2 25)` | Errors, warnings, rejection, security concerns |

### Never use

- Arbitrary hex values in components
- Tailwind colour classes (`text-blue-500`, `bg-red-200`) — use the token variables
- Decorative colours (purple, orange, pink) — these collapse to `--va-fg-muted`

---

## VisualWrapper — The Shell

Every blog animation lives inside `<VisualWrapper>`. Never render a diagram bare.

```tsx
import { VisualWrapper } from "@/components/visuals/VisualWrapper";

// Default (neutral — monochrome, no accent)
<VisualWrapper label="Caption text shown below the diagram">
  {/* your diagram here */}
</VisualWrapper>

// With semantic tone
<VisualWrapper tone="blue" label="Data flow diagram">
  {/* blue accent exposed as --va-accent */}
</VisualWrapper>
```

### Tone prop

| Tone | `--va-accent` resolves to | When to use |
|---|---|---|
| `neutral` (default) | `--va-fg` | Most diagrams — no semantic colour needed |
| `blue` | `--va-blue` | Flow diagrams, information architecture, active states |
| `green` | `--va-green` | Success paths, CI status, approval flows |
| `red` | `--va-red` | Error handling, security, warnings |

The `--va-accent` variable is only set on the `<figure>` element — use it inside your diagram for the one element that deserves an accent, nothing else.

The shell provides:
- Subtle gradient background (`va-shell__bg`)
- 24×24px grid texture (`va-shell__grid`)
- 1px top border
- Box shadow (none in dark mode)
- `MotionConfig` with `springSmooth` as default transition

---

## Spring Presets

All from `lib/motion-variants.ts`. Import directly — never hardcode spring values.

```ts
import {
  springSnappy,   // 0.2s, bounce: 0   — toggles, micro-interactions
  springSmooth,   // 0.3s, bounce: 0.15 — DEFAULT, most elements
  springGentle,   // 0.35s, bounce: 0.1 — cards, panel reveals
  springBouncy,   // 0.4s, bounce: 0.3  — playful, success pulses
} from "@/lib/motion-variants";
```

### Stagger timing

| Use case | Gap |
|---|---|
| Row-by-row (charts, lists) | `0.07s` per row |
| Node-by-node (flow graphs) | `0.4s` per node |
| Segment-by-segment (bars) | `0.04s` per segment |
| Group-by-group (tiers) | `0.15s` per group |

### Bar/segment fills

Always animate with `scaleX: 0 → 1` + `originX: 0` for a left-to-right draw effect. Pair with an `opacity` transition that starts 0 and settles at the final value.

```tsx
<motion.div
  style={{ originX: 0 }}
  initial={{ scaleX: 0, opacity: 0 }}
  animate={{ scaleX: 1, opacity: targetOpacity }}
  transition={{
    scaleX: { delay, type: "spring", visualDuration: 0.3, bounce: 0 },
    opacity: { delay, duration: 0.25, ease: "easeOut" },
  }}
/>
```

### Path drawing (SVG arrows, connectors)

```tsx
<motion.path
  initial={{ pathLength: 0, opacity: 0 }}
  animate={{ pathLength: 1, opacity: 1 }}
  transition={{
    pathLength: { delay, type: "spring", duration: 0.8, bounce: 0 },
    opacity: { delay, duration: 0.01 },
  }}
/>
```

---

## Component Conventions

### File location
`components/visuals/ComponentName.tsx`

### Required structure

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { VisualWrapper } from "./VisualWrapper";

export function MyDiagram({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const reduced = !!useReducedMotion();

  return (
    <VisualWrapper label="Descriptive caption" tone="neutral" className={className}>
      <div ref={ref}>
        {isInView && (
          // render diagram only when in view — avoids offscreen animation budget
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0 } : springSmooth}
          >
            {/* content */}
          </motion.div>
        )}
      </div>
    </VisualWrapper>
  );
}
```

### Typography inside visuals

| Purpose | Classes |
|---|---|
| Group/tier labels | `font-mono text-[9px] uppercase tracking-[0.12em]` |
| Role / item names | `font-mono text-[11px] tracking-wide` |
| Axis / level labels | `font-mono text-[10px] uppercase tracking-widest` |
| Node labels (SVG) | `fontSize: 10, fontFamily: "var(--code-font-family)"` |
| Captions (figcaption) | `text-[13px] italic` — handled by VisualWrapper |

Never use `font-display` (Playfair) inside visual animations. Monospace only.

---

## Existing Components

| Component | Tone | Type | Description |
|---|---|---|---|
| `CodexOrchestrationLoop` | neutral | SVG sequential | Plan → Implement → CI → Review → Repeat loop with arrow draws |
| `ReasoningComplexityChart` | neutral | Bar chart | model_reasoning_effort per agent role, grouped by tier |
| `HookTimeline` | neutral | Timeline | Claude Code hooks event sequence |
| `McpArchitectureMap` | neutral | Architecture | MCP server connection diagram |
| `ContextBudgetBucket` | neutral | Fill chart | Context window usage visualisation |
| `SubagentSplitContext` | neutral | Flow | Subagent context isolation diagram |
| `PlanClearExecuteFlow` | neutral | Flow | Three-phase AI workflow |
| `SignalNoiseDial` | neutral | Dial | Signal vs noise quality indicator |
| `PermissionsSafetyLadder` | neutral | Ladder | Claude permissions tier diagram |
| `ClaudeCodeStack` | neutral | Stack | Claude Code architecture layers |

---

## Segment Bar Opacity Scale

When using segmented bars (strength indicators), use this opacity scale for active segments — it creates a natural left-to-right weight taper.

| Level | Active segments | Fill opacity |
|---|---|---|
| xhigh | 4/4 | `0.85` (last: `0.77`) |
| high | 3/4 | `0.70` (last: `0.62`) |
| medium | 2/4 | `0.55` (last: `0.47`) |
| low | 1/4 | `0.38` |
| empty | 0/4 | `0.07` (structural ghost) |

---

## Adding to MDX

All visual components are registered in `lib/custom-components.tsx`. Import pattern:

```tsx
// 1. Add import at top of custom-components.tsx
import { MyDiagram } from "@/components/visuals/MyDiagram";

// 2. Add to the customComponents object
const customComponents = {
  // ...
  MyDiagram,
};

// 3. Use in MDX
<MyDiagram />
```

No props needed for basic usage. Pass `className` only for overriding margins.

---

## Anti-patterns

| ❌ Don't | ✅ Do |
|---|---|
| Animate on every render | `useInView({ once: true })` |
| Use `duration`-based easing for UI | Spring presets from `motion-variants.ts` |
| Use colour for decoration | Only for semantic meaning (success/error/info) |
| Hard-code colours in components | Use `--va-fg`, `--va-blue`, etc. |
| Nest `MotionConfig` inside `VisualWrapper` | `VisualWrapper` already provides it |
| Add `overflow-hidden` to blog article | Breaks BlogWithCanvas full-bleed layout |
| Skip `reduced` check | Always: `transition={reduced ? { duration: 0 } : springSmooth}` |
