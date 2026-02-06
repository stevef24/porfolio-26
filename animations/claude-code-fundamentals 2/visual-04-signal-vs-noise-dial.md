# Visual 04 - Signal vs Noise Dial

Lesson: `content/courses/claude-code-fundamentals/lessons/03-understanding-context.mdx`
Placement: After "Signal vs. Noise" section

## Goal
Show that more context can reduce clarity.

## Why This Visual
The most common mistake is assuming more context always helps. This visual makes the tradeoff obvious.

## What It Must Communicate
- There is a balance point.
- Too much context pushes outcomes toward noise.
- The system reacts as tokens accumulate.

## Narrative (Steps)
1. Dial starts near the "Signal" side.
2. Token count increments (small counter).
3. Needle moves toward "Noise" as count increases.
4. A small warning label appears near Noise: "Quality drops".

## Layout
- Semi-circular dial with left = Signal, right = Noise.
- Small numeric token counter below the dial.

## Motion
- Needle movement uses a gentle ease-out.
- Counter increments in sync with the needle.

## Interaction
- Optional slider controlling token count.
- Default state should land slightly right of center to show risk.

## Reduced Motion
- Static dial with the needle at mid-to-noise position.

## Implementation Notes
- Suggested component name: `SignalNoiseDial`.
- Use one accent color for the needle tip.
- Keep text minimal and legible.
