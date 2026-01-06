# Scrolly Coding Authoring Guide

Interactive code walkthroughs with scroll-driven animations and Shiki Magic Move.

## Quick Start

### 1. Create a Steps File

Create a `*.steps.tsx` file alongside your MDX:

```tsx
// content/blog/my-post.steps.tsx
import type { ScrollyCodeStep } from "@/lib/scrolly/types";

export const mySteps: ScrollyCodeStep[] = [
  {
    id: "step-one",
    title: "First Step",
    body: "Explain what this code does.",
    code: `const x = 1`,
    lang: "ts",
  },
  {
    id: "step-two",
    title: "Second Step",
    body: "Add more code incrementally.",
    code: `const x = 1
const y = 2`,
    lang: "ts",
    focusLines: [2], // Highlight line 2
  },
];
```

### 2. Use in MDX

```mdx
---
title: My Post
---

import { mySteps } from "./my-post.steps";

<Scrolly steps={mySteps} />
```

## Step API Reference

```typescript
type ScrollyCodeStep = {
  // Required
  id: string;        // Unique kebab-case identifier
  title: string;     // Step heading
  body: ReactNode;   // Prose content (string or JSX)
  code: string;      // Code for this step
  lang: string;      // Shiki language ("ts", "tsx", "jsx", etc.)

  // Optional
  file?: string;           // Filename badge (e.g., "store.ts")
  focusLines?: number[];   // 1-based line numbers to highlight
  annotations?: Array<{
    line: number;          // 1-based line number
    label: string;         // Annotation text
  }>;
  magicMove?: {
    duration?: number;     // Animation duration in ms (default: 800)
    stagger?: number;      // Token stagger delay in ms (default: 4)
  };
};
```

## Focus Lines

Highlight specific lines to draw attention:

```tsx
{
  id: "highlight-return",
  title: "The Return Value",
  body: "Notice the return statement.",
  code: `function add(a, b) {
  const sum = a + b
  return sum  // <-- focus here
}`,
  lang: "js",
  focusLines: [3],  // 1-based: highlights "return sum"
}
```

**Visual effect:**
- Focused lines get a subtle background highlight and left border
- Non-focused lines dim to 50% opacity
- Transitions animate with spring physics

## Writing Incremental Code

Each step's code should build on the previous. Magic Move animates the diff:

```tsx
// Step 1: Start minimal
{
  code: `type State = {
  count: number
}`
}

// Step 2: Add more
{
  code: `type State = {
  count: number
}

function reducer(state: State) {
  // ...
}`
}
```

**Tips:**
- Keep diffs small for smoother animations
- Magic Move tracks tokens, so reordering works well
- Adding/removing lines animates naturally

## Keyboard Navigation

Users can navigate with keyboard:

| Key | Action |
|-----|--------|
| `Tab` | Focus step |
| `Arrow Down/Right` | Next step |
| `Arrow Up/Left` | Previous step |
| `Home` | First step |
| `End` | Last step |
| `Enter/Space` | Activate step |

## Accessibility

The component includes:
- **Live region** - Screen readers announce "Step N of M: Title"
- **ARIA roles** - Proper button/region roles
- **Focus indicators** - Visible focus ring for keyboard users
- **Reduced motion** - Respects `prefers-reduced-motion`

## Mobile Behavior

On screens < 768px:
- Two-column layout becomes single column
- Each step shows its code inline (no sticky stage)
- No Magic Move animation (static highlighted code)
- Copy button still works

## Customization

### Stage Position

```tsx
<Scrolly
  steps={steps}
  doc={{
    stage: {
      stickyTop: 100,  // Distance from viewport top (default: 80px)
    }
  }}
/>
```

### Theme

By default uses `vitesse-light` and `vitesse-dark`. Theme follows system/site preference.

## Troubleshooting

### Focus lines out of bounds

```
Error: focusLine 5 is out of bounds (code has 3 lines)
```

**Fix:** Ensure `focusLines` numbers match your code. Use 1-based indexing.

### Duplicate step IDs

```
Error: Duplicate step id: 'my-step'
```

**Fix:** Each step needs a unique `id`. Use descriptive kebab-case names.

### Code not animating

Check:
1. At least 2 steps with different code
2. Steps have unique `id` values
3. Not using `prefers-reduced-motion: reduce`

### Build errors with imports

**Problem:** Importing steps in a client component

**Fix:** Import steps only in server components (MDX files are server-rendered)

## Validation

Use the built-in validator during development:

```tsx
import { validateSteps } from "@/lib/scrolly/types";

const errors = validateSteps(mySteps);
if (errors.length > 0) {
  console.error("Step validation errors:", errors);
}
```

## Example Structure

```
content/blog/
  my-tutorial.mdx           # MDX file with <Scrolly>
  my-tutorial.steps.tsx     # Steps array export
```

## Full Example

See `content/blog/scrolly-demo.mdx` and `content/blog/scrolly-demo.steps.tsx` for a complete working example.
