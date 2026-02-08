---
date: 2026-01-12T13:45:26Z
session_name: agent-sdk-blog
researcher: Claude
git_commit: d90cd9a (uncommitted changes pending)
branch: scrollyCoding
repository: porfolio-26
topic: "V2PreviewCallout Labs Terminal Redesign"
tags: [ui, callout, animation, labs-aesthetic, v2-preview]
status: complete
last_updated: 2026-01-12
last_updated_by: Claude
type: feature
---

# Handoff: V2PreviewCallout Redesign with Labs Terminal Aesthetic

## Task(s)

1. **V2PreviewCallout Component Redesign** - COMPLETED
   - Redesigned the callout from generic gradient border to distinctive "Labs Terminal" aesthetic
   - Added pulsing dot indicator, monospace badges, left accent bar with glow
   - Dark/light mode support with amber accent color (hue 65)

2. **Floating Navbar Compaction** - PENDING (user requested)
   - Make navbar smaller width, more minimal
   - Keep existing transition animations

3. **Canvas/Column Timing Mismatch** - PENDING (user requested)
   - Fix delay between column centering and canvas hiding on exit
   - Synchronize the two animations

## Critical References

- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - Session continuity ledger
- `content/blog/agent-sdk-deep-research.mdx` - Blog post using V2PreviewCallout (lines 151-204)

## Recent changes

**`components/ui/blog/V2PreviewCallout.tsx`** - Complete rewrite:
- New "Labs Terminal" design with left accent bar
- Pulsing dot indicator in badge
- Version tag ("v2") separate from "Unstable" badge
- Flask/labs icon in corner
- Motion animation on scroll into view

**`app/globals.css`** (lines 1434-1610):
- New CSS classes: `.v2-preview-callout`, `.v2-preview-accent`, `.v2-preview-card`
- `.v2-preview-badge` with pulsing dot (`.v2-preview-dot`)
- `.v2-preview-version` tag styling
- Dark mode support with adjusted luminance
- `@keyframes v2-pulse` animation
- `prefers-reduced-motion` support

**`lib/custom-components.tsx`**:
- Added import for `V2PreviewCallout` (line 31)
- Added export in customComponents (line 290)

**`content/blog/agent-sdk-deep-research.mdx`**:
- Replaced 3 Fumadocs `<Callout>` components with `<V2PreviewCallout>`
- Lines 151-165, 167-183, 185-204

## Learnings

1. **Gradient borders on dark backgrounds fail** - The original purple gradient border was invisible on dark mode. Left accent bars with glow effects are more visible and distinctive.

2. **Use existing design system colors** - Initially used amber (hue 65) which conflicted with the Oatmeal Design System. Updated to use olive green (hue 125, `#566240`) for consistency. Always check `globals.css` for existing color tokens before introducing new hues.

3. **Leverage CSS variables** - Use `var(--card)`, `var(--border)`, `var(--muted-foreground)` etc. instead of hardcoding OKLCH values. This ensures automatic light/dark mode compatibility.

4. **Pulsing indicators need restraint** - 2s ease-in-out cycle with 60% opacity minimum keeps the pulse noticeable but not distracting.

5. **Monospace fonts for technical badges** - Using `var(--font-geist-mono)` for the badge text reinforces the "developer/technical" feel.

## Post-Mortem

### What Worked
- **Left accent bar design** - Much more visible than gradient border, especially in dark mode
- **Amber accent color** - Distinctive, signals "experimental" without being alarming
- **Pulsing dot indicator** - Subtle animation that draws attention without being annoying
- **Separate version tag** - "v2" badge separate from "Unstable" label provides clear hierarchy

### What Failed
- **Original gradient border approach** - Invisible on dark backgrounds, too subtle
- **Purple color scheme** - Blended into dark mode, didn't stand out
- **Amber color (first redesign)** - Didn't match Oatmeal Design System, introduced visual inconsistency
- **Full-border gradient** - Competed visually with code blocks inside the callout

### Key Decisions
- **Decision:** Use olive green (hue 125) from Oatmeal palette
  - Alternatives considered: Amber (hue 65), purple, new accent color
  - Reason: Maintains design system consistency, olive is the site's accent color

- **Decision:** Left accent bar instead of full border
  - Alternatives considered: Full gradient border, top accent, no border
  - Reason: Left bar is visible, doesn't compete with internal code blocks, matches terminal aesthetic

- **Decision:** Pulsing dot instead of static badge
  - Alternatives considered: Static badge, animated gradient, icon animation
  - Reason: Subtle movement signals "live/active" without being distracting

- **Decision:** Use CSS variables for colors
  - Reason: Automatic light/dark mode support, easier maintenance

## Artifacts

- `components/ui/blog/V2PreviewCallout.tsx` - New component
- `app/globals.css:1434-1610` - V2 Preview CSS styling
- `lib/custom-components.tsx:31,290` - Export additions
- `content/blog/agent-sdk-deep-research.mdx:151-204` - Updated MDX usage

## Action Items & Next Steps

**Priority (user requested):**
1. **Compact floating navbar** - Reduce width, make more minimal while keeping transitions
   - File: Likely `components/layout/Navbar.tsx` or similar
   - Goal: Smaller, more elegant floating nav

2. **Fix canvas/column exit timing** - Synchronize animations
   - File: `components/blog/BlogWithCanvas.tsx`
   - Issue: Delay between column centering and canvas hiding

**Remaining from original task:**
3. Polish canvas code blocks (Terminal Elegance refinement)
4. Apply same styling to mobile inline canvas
5. Test all interactions and animations

## Other Notes

**Design Direction Applied:** "Labs Terminal" aesthetic
- Inspired by: beta software, developer consoles, feature flags
- Key elements: monospace fonts, accent bar with glow, pulsing indicators
- Color: Olive green (OKLCH hue 125) matching Oatmeal Design System

**CSS Custom Properties Used:**
```css
--v2-accent: oklch(0.48 0.08 125);        /* #566240 equivalent */
--v2-accent-light: oklch(0.58 0.10 125);  /* Lighter for glow */
--v2-accent-glow: oklch(0.55 0.12 125 / 25%);
```

**Design System Integration:**
- Uses `var(--card)`, `var(--border)`, `var(--muted-foreground)`, `var(--foreground)`
- Automatically adapts to light/dark mode via CSS variables
- Accent bar uses custom `--v2-accent` to allow glow effects

**Animation Timing:**
- Pulse: `2s ease-in-out infinite`
- Entry: `0.5s cubic-bezier(0.16, 1, 0.3, 1)` with x: -8 → 0

**Build Status:** `pnpm build` passes successfully
**Dev Server:** Running at http://localhost:3000
