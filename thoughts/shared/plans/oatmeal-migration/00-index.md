# Oatmeal Design System Migration

## Overview

This migration transforms the portfolio from Swiss minimalism (OKLCH colors, Playfair Display, lime green accents) to the Oatmeal design system (hex colors, Instrument Serif, olive green accents).

## User Decisions

| Decision | Current | Target |
|----------|---------|--------|
| Display Font | Playfair Display | Instrument Serif |
| Body Font | Inter | Inter (unchanged) |
| Background | Canvas noise + grain | Clean, smooth |
| Accent Color | Lime green (oklch 0.65 0.2 125) | Olive green (#566240) |
| Scope | - | Update existing only |

## Phase Overview

| Phase | Name | Status | Dependencies |
|-------|------|--------|--------------|
| 1 | [Foundation Layer](./phase-01-foundation.md) | Pending | None |
| 2 | [Background Component](./phase-02-background.md) | Pending | Phase 1 |
| 3 | [Typography Classes](./phase-03-typography.md) | Pending | Phase 1 |
| 4 | [Core UI Components](./phase-04-core-components.md) | Pending | Phase 1 |
| 5 | [Complex UI Components](./phase-05-complex-components.md) | Pending | Phase 1 |
| 6 | [Custom Components](./phase-06-custom-components.md) | Pending | Phases 4-5 |
| 7 | [Blog Components](./phase-07-blog-components.md) | Pending | Phases 4-5 |
| 8 | [Scrolly System](./phase-08-scrolly-system.md) | Pending | Phases 4-5 |
| 9 | [Landing & Layout](./phase-09-landing-layout.md) | Pending | Phases 6-8 |
| 10 | [Cleanup & Verification](./phase-10-cleanup.md) | Pending | All |

## Execution Strategy

```
Phase 1 (Foundation) ─────────────────────────────────────────────┐
                                                                   │
├── Phase 2 (Background) ──────────────────┐                      │
├── Phase 3 (Typography) ──────────────────┼── Parallel Group A   │
├── Phase 4 (Core Components) ─────────────┤                      │
└── Phase 5 (Complex Components) ──────────┘                      │
                                                                   │
├── Phase 6 (Custom) ──────────────────────┐                      │
├── Phase 7 (Blog) ────────────────────────┼── Parallel Group B   │
├── Phase 8 (Scrolly) ─────────────────────┤                      │
└── Phase 9 (Landing/Layout) ──────────────┘                      │
                                                                   │
Phase 10 (Cleanup) ───────────────────────────────────────────────┘
```

## Critical Files

| File | Phase | Impact |
|------|-------|--------|
| `app/globals.css` | 1, 3, 8 | All color variables, typography, scrolly CSS |
| `app/layout.tsx` | 1 | Font loading configuration |
| `components/ui/SwissGridBackground.tsx` | 2 | Background overhaul |
| `components/ui/button.tsx` | 4 | Primary interaction element |
| `components/ui/scrolly/ScrollyStage.tsx` | 8 | Hardcoded color replacement |

## Dev Server

Run background dev server for live testing:
```bash
pnpm dev
```

## Verification Checklist (Final)

- [ ] All backgrounds: warm cream (light) / dark charcoal (dark)
- [ ] No lime green remaining - all accents are olive
- [ ] Headings use Instrument Serif (weight 400)
- [ ] Buttons have pill shape (border-radius: 9999px)
- [ ] Cards have 8px radius + subtle shadows
- [ ] Focus states use olive ring
- [ ] Scrolly focus lines are olive green
- [ ] Dark mode inverts correctly
- [ ] Build passes: `pnpm build`
