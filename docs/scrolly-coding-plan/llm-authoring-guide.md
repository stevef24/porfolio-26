# LLM Authoring Guide: Scrolly Steps Array

## Purpose
Provide a reliable template for generating typed scrolly steps arrays for blog posts.

## Output Requirements
- Export a `steps` array of `ScrollyCodeStep`.
- Each step must include: `id`, `title`, `body`, `code`, `lang`.
- Optional: `file`, `focusLines`, `annotations`, `magicMove`.

## Authoring Rules
1. Keep code changes incremental between steps.
2. Use 1-based `focusLines` and verify the line numbers match the `code` string.
3. Use two-space indentation inside `code` strings.
4. Use short, clear titles and 2 to 4 sentences per step.
5. Use kebab-case `id` values that do not change between drafts.
6. Always include `lang` as a valid Shiki language id.
7. Include `file` when possible; if missing, the UI will derive `snippet.<ext>`.

## Typed Array Template
```tsx
import type { ScrollyCodeStep } from "@/lib/scrolly/types"

export const steps = [
  {
    id: "create-state",
    title: "Create state",
    body: (
      <p>Start with a tiny state shape that is easy to expand later.</p>
    ),
    code: `type State = { count: number }\n\nexport const state: State = { count: 0 }`,
    lang: "ts",
    file: "state.ts",
    focusLines: [1, 3],
  },
  {
    id: "add-action",
    title: "Add an action",
    body: (
      <p>Add a small helper that mutates the state in a single place.</p>
    ),
    code: `type State = { count: number }\n\nexport const state: State = { count: 0 }\n\nexport const inc = () => {\n  state.count += 1\n}`,
    lang: "ts",
    file: "state.ts",
    focusLines: [5, 6],
  },
] satisfies ScrollyCodeStep[]
```

## Common Mistakes to Avoid
- Large code jumps that break Magic Move continuity.
- Mismatched `focusLines` or missing line numbers.
- Mixing tabs with spaces inside `code` strings.
- Using non-unique or unstable `id` values.

## Final Checklist
- [ ] All required fields are present.
- [ ] `id` values are unique and kebab-case.
- [ ] `focusLines` matches the visible code.
- [ ] `lang` is a supported Shiki language.
- [ ] Code changes are incremental.
