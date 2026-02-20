# AGENTS.md

These instructions guide agents (including Codex) working in this repo.

## Priorities
- Builder first, teacher second. Implement, then explain briefly.
- Keep course writing minimal, blog-style, and scannable.
- Prefer short sections and tight examples over long lists.

## Repo Basics
- Package manager: `pnpm`.
- Dev server: `pnpm dev`.
- Content lives in `content/` (courses + blog).
- Course routes are generated from MDX in `content/courses/`.

## Course Content Rules
- Course structure: `content/courses/<slug>/index.mdx` + `lessons/*.mdx`.
- Every lesson frontmatter must include: `title`, `description`, `duration`, `module`, `order`.
- Keep modules consistent and ordered (0..N).
- Add `<InlineTOC />` for longer lessons.
- End every lesson with **Key Takeaways**.
- Prefer `Callout`, `Steps`, `Tabs`, `Files` when they improve clarity.
- Avoid editing `transcripts/` unless explicitly requested.
- Do not place citation markers inside MDX content.

## Source Hygiene
- For Codex/OpenAI topics, prefer official docs (developers.openai.com) and OpenAI GitHub repos.
- Add official links to the course appendix resources when relevant.

## Visual Aids Rules
- Visual briefs live in `animations/<course>/` (one file per visual).
- Each brief must include:
  - What it is
  - Goal
  - Why it exists
  - What it should show
  - How it works (visual + motion)
  - Steps (if multi-step)
  - Placement (lesson + section)
  - Motion + Reduced-motion behavior
- Shared design system lives in `animations/visual-aids.md`.
- Blog visual animation rules live in `ANIMATION-RULEBOOK.md` (canonical for blog visuals).
- For blog visuals, storyboard-first is mandatory before implementation (stage-based orchestration + reduced-motion plan).

## Codex/GitHub Review Guidance
- For review tasks, prioritize P0/P1 issues over style nits.
- Keep feedback actionable and concise.
- Respect `AGENTS.md` rules closest to the files being reviewed.

## Safety
- Default to safer permissions and sandboxing.
- Avoid destructive commands unless explicitly asked.
- Never commit secrets or `.env` files.
