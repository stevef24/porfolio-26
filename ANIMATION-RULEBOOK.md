# Animation Rulebook (Enhanced)

This is the source of truth for blog visual animations.

---

## Scope

- Applies to blog visual aids only.
- Applies to:
  - `components/visuals/*`
  - `content/blog/*`
  - blog visual briefs in `animations/*`

- Course visuals can follow their own briefs, but blog visuals must follow this rulebook.

---

## 1. Purpose First (Non-Negotiable)

Every animation must answer:

- What concept does this make clearer?
- What confusion does this remove?

If it does neither, it should not exist.

---

## 2. One Idea Per Visual

- Each visual should communicate a single idea.
- If you feel the need to explain multiple things, split it.

Bad:

- Loop + tools + context all in one visual

Good:

- One visual = loop
- One visual = tool execution
- One visual = context isolation

---

## 3. Core Style Rules

- Keep visuals minimalist and calm.
- Prefer monochrome by default.
- Use flat tokenized surfaces only.
- Remove decorative motion and decorative labels.
- If an element does not help understanding, remove it.

---

## 4. Semantic Color Rules (Strict)

- Colors must have a purpose, never decoration.
- Default visual state is neutral:
  - `--va-fg`
  - `--va-fg-muted`

- Allowed semantic accents:
  - `--va-green`: success, pass, approved, healthy state
  - `--va-red`: error, fail, blocked, risky state
  - `--va-blue`: informational flow or active focus state (only when needed)

- If color does not change meaning, do not use it.
- Never use arbitrary hex or Tailwind color classes in blog visuals.
- Keep accent usage sparse:
  - one semantic accent family per scene unless contrast is required for meaning.

---

## 5. Visual Hierarchy

There must always be a clear focal point.

Use this order:

1. Position
2. Motion
3. Color

What should the viewer notice first should be obvious from layout before anything else.

If everything moves, nothing matters.

---

## 6. Storyboard-First Rule (Mandatory)

- Every new blog animation starts with a storyboard before code.
- No implementation before storyboard exists.
- Storyboard must be stage-based and orchestrated.

Required storyboard format:

1. `Stage 0`: initial state
2. `Stage 1..N`: causal sequence with timing notes
3. `Final state`: what remains visible
4. `Replay behavior`: if replay exists
5. `Reduced motion`: static equivalent

Recommended placement:

- Visual brief file in `animations/<topic>/visual-xx-*.md`
- Or component header comment if brief already exists

---

## 7. Orchestration Rules

- Use stage-driven sequencing, not decorative loops.
- One primary control max, usually replay.
- Place control in a low-noise corner, top-right preferred.
- Avoid duplicate labels.
- Default to one clear message per visual.

---

## 8. Motion Rules

- Motion explains cause and effect.
- Prefer short spring transitions.
- Respect reduced motion with a complete static state.
- Avoid endless autoplay loops.

Rule:
If removing motion does not reduce understanding, the motion was unnecessary.

---

## 9. Causality Over Timing

Animations should feel like cause → effect, not timed choreography.

Avoid:

- “after 0.3s do this”

Prefer:

- “when tool is selected → show execution”

This makes animations feel logical instead of staged.

---

## 10. State Clarity

At any moment, the viewer should be able to answer:

- Where are we?
- What just happened?
- What is about to happen?

If that is not obvious within 1–2 seconds, simplify.

---

## 11. Text Usage Rules

- Text supports the visual, it should not carry it.
- Avoid repeating the same label in multiple places.
- Keep labels readable and concise.

Bad:

- Title, caption, and inline label all repeating the same thing

Good:

- One label max per concept when possible

---

## 12. Abstraction Level

Do not over-realise visuals.

Avoid:

- File icons, terminals, realistic UI, decorative chrome

Prefer:

- Abstract blocks like `User`, `Runtime`, `Model`, `Tool`

Reason:

- Keeps focus on system behavior, not surface details

---

## 13. Progressive Disclosure

Do not show everything at once.

Introduce elements only when they become relevant.

Example:

- Stage 0: User + Model
- Stage 1: Runtime appears
- Stage 2: Tool appears

This mirrors how understanding builds.

---

## 14. Constraint-Driven Design

Always define constraints before implementation:

- max elements per scene, ideally 3–5
- max colors, ideally 1 semantic accent family
- max motions per stage, ideally 1 primary action

Good visuals come from constraints, not freedom.

---

## 15. Replay / Refresh / Restart Button Rules

- Always icon-only, never text labels.
- Use a rotate/reload icon.
- Size: `w-7 h-7` container, icon `size={14}` with `strokeWidth={1.5}`.
- Position: `absolute right-3 top-3` inside the visual container.
- The visual container must be `relative`.
- Always include `aria-label` and `title`.
- Style: `border border-[var(--sf-border-subtle)] hover:border-[var(--va-blue)]` with `var(--sf-bg-subtle)` background.
- Only show after the animation has completed.

---

## 16. Reduced Motion = Truth Mode

Reduced motion is not a fallback.
It is the purest version of the idea.

If the static version is unclear, the animation is compensating for weak design.

---

## 17. Accessibility Rules

- Meaning must remain clear with motion disabled.
- Never rely on color alone.
- Pair color with position, text, or state.
- Keep labels concise and readable.

---

## 18. Mobile Responsiveness Rules

- Every blog visual must render correctly at 375px viewport width.
- Never use fixed pixel widths on the outer layout container.
- Use `w-full` and let content adapt.
- If a visual requires minimum width, wrap it in `overflow-x-auto`.
- Prefer responsive sizing classes over fixed sizes.
- Test at 375px and 768px before marking complete.

---

## 19. Mobile-First Thinking

Design for 375px first, then scale up.

Ask:

- Can this be understood in a narrow column?
- Are elements readable without crowding?

If not, simplify before scaling.

---

## 20. System Thinking

Each animation should reflect system behavior, not generic UI behavior.

Bad:

- button clicked

Good:

- runtime triggers tool execution

This keeps visuals aligned with how engineers think.

---

## 21. Final Test Before Shipping

Ask:

- Could someone explain this concept after watching once?
- Does this feel calm and intentional?
- Is anything here just nice to have?

If yes, remove it.

---

## Quick Checklist

- Is this visual mostly monochrome?
- Are green/red used only for success/error meaning?
- Does every colored element have semantic purpose?
- Does a storyboard exist before implementation?
- Is the sequence orchestrated and easy to follow?
- Does reduced motion show the same meaning?
- Does it render correctly at 375px?
- If motion is removed, does the meaning still hold?

---

## Guiding Principle

Animations are not decoration.
They are explanations.
