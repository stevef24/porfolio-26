# Visual System Overview

This folder holds animation and visual briefs for every course.

## Why This Folder Exists
- Centralize all visuals outside lesson content.
- Keep a single design system so every visual feels like one family.
- Make it easy to build and swap visuals without editing lesson text.

## Why This Lives at the Repo Root
- It keeps the visual system discoverable for anyone working on content or UI.
- It avoids mixing visuals with course prose, which keeps lessons clean.
- It makes it easier to reuse visuals across future courses without moving files.

## Folder Layout

- `animations/visual-aids.md` (this file) - design system + index
- `animations/ideas/` - research notes and inspiration
- `animations/claude-code-fundamentals/` - one file per visual
- `animations/codex-cli-deep-dive/` - one file per visual

## Visual Brief Template (Required)

Every visual brief must include:
- **What this is**
- **Goal**
- **Why this visual**
- **What it must show**
- **How it works (visual + motion)**
- **Steps** (if multi-step)
- **Placement** (lesson + section)
- **Motion notes + Reduced-motion behavior**
- **Implementation notes** (component name, layout hints)

## Design System (Single Source of Truth)

### Visual Style
- Swiss-minimal, precise, and calm.
- Use the same typefaces as the site (display + body).
- Prefer monochrome with one accent color for emphasis.
- Keep shapes geometric: rectangles, circles, simple strokes.
- Use 1px or 2px lines consistently; avoid heavy borders.

### Canvas and Scale
- Default canvas: 960x320 for desktop, 720x280 for tablet, 360x220 for mobile.
- Internal padding: 24-32px.
- Corner radius: 6-10px across all cards and tokens.
- Icon size: 16-20px, consistent across visuals.

### Typography
- Title labels: 14-16px, medium weight.
- Supporting labels: 12-13px, normal weight.
- Keep line length short; visuals should not read like paragraphs.

### Color Usage
- Base: use neutral text + border colors from the site.
- Accent: use the same primary accent used in buttons/links.
- Warnings: use muted accent, not bright red.

### Layout
- Use a 12-column grid, aligned to the content width in lessons.
- Most visuals should be wide but short (landscape), so they sit between paragraphs without breaking flow.
- Keep generous whitespace and avoid visual noise.

### Motion Principles (Aligned with animations.dev)
- Motion should explain, not decorate.
- Every animation must show cause -> effect.
- Avoid constant looping unless it teaches a concept.
- Prefer short, purposeful transitions rather than long timelines.
- Provide a reduced-motion fallback (static frame).

### Motion Best Practices (Research Summary)
- Use `MotionConfig` to unify timing and reduced-motion behavior across visuals. [motion.dev](https://motion.dev/docs/react-motion-config)
- Use `variants` for orchestration and multi-step sequences. [motion.dev](https://motion.dev/docs/react-animation)
- Use `layout` and `layoutId` for smooth diagram transitions. [motion.dev](https://motion.dev/docs/react-layout-animations)
- Use `AnimatePresence` for enter/exit transitions. [motion.dev](https://motion.dev/docs/react-animate-presence)
- Use `useInView` for scroll-based reveal animations. [motion.dev](https://motion.dev/docs/react-use-in-view)
- Keep motion fast and readable, with durations proportional to distance. [Material Duration & Easing](https://m1.material.io/motion/duration-easing.html)
- Respect OS settings and provide a reduced-motion fallback. [WCAG 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions), [web.dev Motion](https://web.dev/learn/accessibility/motion)
- Avoid motion types that can cause discomfort (parallax, scaling, spinning). [Apple Reduced Motion Criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria)

### Where to Read More
- Motion for React docs: [motion.dev](https://motion.dev/docs/react)
- Material Design motion principles: [Material Motion](https://m1.material.io/motion/material-motion.html)
- Accessibility guidance: [WCAG 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions)

### Interaction Rules
- If interactive, provide a default state that already communicates the idea.
- Hover or click should reveal detail, not hide it.
- Keep controls minimal: one slider, one toggle, or one play button.

### Accessibility
- All visuals should remain understandable when motion is disabled.
- Use clear labels for every element.
- Avoid relying on color alone to show state.

## Visual Index - Claude Code Fundamentals

1. `animations/claude-code-fundamentals/visual-01-context-budget-bucket.md`
2. `animations/claude-code-fundamentals/visual-02-context-composition-stack.md`
3. `animations/claude-code-fundamentals/visual-03-plan-clear-execute-flow.md`
4. `animations/claude-code-fundamentals/visual-04-signal-vs-noise-dial.md`
5. `animations/claude-code-fundamentals/visual-05-mcp-bloat-meter.md`
6. `animations/claude-code-fundamentals/visual-06-mcp-architecture-map.md`
7. `animations/claude-code-fundamentals/visual-07-subagent-split-context.md`
8. `animations/claude-code-fundamentals/visual-08-hook-timeline.md`
9. `animations/claude-code-fundamentals/visual-09-cli-tools-mcp-stack.md`
10. `animations/claude-code-fundamentals/visual-10-changelog-scan-checklist.md`
11. `animations/claude-code-fundamentals/visual-11-context-trim-example.md`
12. `animations/claude-code-fundamentals/visual-12-permissions-safety-ladder.md`
13. `animations/claude-code-fundamentals/visual-13-session-memory-note.md`

## Visual Index - Codex CLI Deep Dive

1. `animations/codex-cli-deep-dive/visual-01-context-budget-bucket.md`
2. `animations/codex-cli-deep-dive/visual-02-context-composition-stack.md`
3. `animations/codex-cli-deep-dive/visual-03-approval-policy-ladder.md`
4. `animations/codex-cli-deep-dive/visual-04-sandbox-boundaries.md`
5. `animations/codex-cli-deep-dive/visual-05-config-precedence-stack.md`
6. `animations/codex-cli-deep-dive/visual-06-command-surface-map.md`
7. `animations/codex-cli-deep-dive/visual-07-non-interactive-pipeline.md`
8. `animations/codex-cli-deep-dive/visual-08-mcp-vs-skill-decision.md`
9. `animations/codex-cli-deep-dive/visual-09-github-review-loop.md`
10. `animations/codex-cli-deep-dive/visual-10-cloud-apply-flow.md`
11. `animations/codex-cli-deep-dive/visual-11-sdk-thread-timeline.md`
12. `animations/codex-cli-deep-dive/visual-12-changelog-scan-board.md`
13. `animations/codex-cli-deep-dive/visual-13-agents-proximity-map.md`
