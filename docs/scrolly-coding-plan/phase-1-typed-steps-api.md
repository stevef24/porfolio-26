# Phase 1: Typed Steps API and Data Model

## Objective
Define a typed steps API that is stable, minimal, and friendly to MDX authoring.

## Detailed Plan
1. Define the step types
   - `ScrollyCodeStep` with strict required fields.
   - Optional fields for file labels, focus lines, and Magic Move overrides.
2. Define document-level configuration
   - `ScrollyCodeDoc` for theme pair and layout overrides.
   - Default theme pair: `vitesse-light` and `vitesse-dark`.
3. Establish file structure
   - `content/blog/<slug>.scrolly.tsx` exports `steps` and optional `doc` config.
   - Keep code samples small and incremental to favor Magic Move.
4. Authoring rules
   - `id` must be kebab-case and stable.
   - `body` must be simple React elements (paragraphs, lists, inline code).
   - `focusLines` is 1-based and must match the current `code` string.
   - If `file` is missing, derive `snippet.<ext>` from `lang`.
5. Validation strategy
   - Validate unique ids and `focusLines` bounds at compile time.
   - Fail gracefully with clear errors if a step is invalid.

## Proposed Types (Plan Only)
```ts
export type ScrollyCodeStep = {
  id: string
  title: string
  body: React.ReactNode
  code: string
  lang: string
  file?: string
  focusLines?: number[]
  annotations?: Array<{ line: number; label: string }>
  magicMove?: {
    duration?: number
    stagger?: number
    lineNumbers?: boolean
  }
}

export type ScrollyCodeDoc = {
  steps: ScrollyCodeStep[]
  theme?: { light: string; dark: string }
  stage?: { width?: string; stickyTop?: number; height?: string }
}
```

## Deliverables
- Finalized type definitions and naming conventions.
- Example `content/blog/<slug>.scrolly.tsx` file format.
- Authoring checklist (refer to LLM guide).

## Resources
- `CLAUDE.md`
- `content/blog`
- `lib/custom-components.tsx`
- https://codehike.org/docs/layouts/scrollycoding
