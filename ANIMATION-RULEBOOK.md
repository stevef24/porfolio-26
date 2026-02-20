# Animation Rulebook (Blog)

This is the source of truth for blog visual animations.

## Scope
- Applies to blog visual aids only.
- Applies to:
  - `components/visuals/*`
  - `content/blog/*`
  - blog visual briefs in `animations/*`
- Course visuals can follow their own briefs, but blog visuals must follow this rulebook.

## Core Style Rules
- Keep visuals minimalist and calm.
- Prefer monochrome by default.
- Use flat tokenized surfaces only.
- Remove decorative motion and decorative labels.
- If an element does not help understanding, remove it.

## Semantic Color Rules (Strict)
- Colors must have a purpose, never decoration.
- Default visual state is neutral:
  - `--va-fg`
  - `--va-fg-muted`
- Allowed semantic accents:
  - `--va-green`: success, pass, approved, healthy state
  - `--va-red`: error, fail, blocked, risky state
  - `--va-blue`: informational flow or active focus state (only when needed)
- If color does not change meaning, do not use it.
- Never use arbitrary hex/Tailwind color classes in blog visuals.
- Keep accent usage sparse:
  - one semantic accent family per scene unless contrast is required for meaning.

## Storyboard-First Rule (Mandatory)
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

## Orchestration Rules
- Use stage-driven sequencing, not decorative loops.
- One primary control max (usually replay).
- Place control in a low-noise corner (top-right preferred).
- Avoid duplicate labels (title + caption + inline label saying the same thing).
- Default to one clear message per visual.

## Replay / Refresh / Restart Button Rules
- **Always icon-only** — never text labels ("Replay", "Restart", etc.).
- Use a rotate/reload icon (e.g. `RotateLeft01Icon` from `@hugeicons/core-free-icons`).
- Size: `w-7 h-7` container, icon `size={14}` with `strokeWidth={1.5}`.
- Position: `absolute top-0 right-0` within the visual's container div.
- Always include `aria-label` + `title` for accessibility.
- Style: `border border-[var(--sf-border-subtle)] hover:border-[var(--va-blue)]` with `var(--sf-bg-subtle)` background.
- Only show after the animation has completed (e.g. `{hasPlayed && !isReduced && ...}`).

## Motion Rules
- Motion explains cause and effect.
- Prefer short spring transitions from `lib/motion-variants.ts`.
- Respect reduced motion with a complete static state.
- Avoid endless autoplay loops.

## Accessibility Rules
- Meaning must remain clear with motion disabled.
- Never rely on color alone; pair with position, text, or state.
- Keep labels readable and concise.

## Quick Checklist
- Is this visual mostly monochrome?
- Are green/red used only for success/error meaning?
- Does every colored element have semantic purpose?
- Does a storyboard exist before implementation?
- Is the sequence orchestrated and easy to follow?
- Does reduced-motion show the same meaning?
