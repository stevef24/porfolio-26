# Task 09: Add TOC Morph Spring Preset

**Status:** Pending
**File:** `lib/motion-variants.ts`
**Lines:** Already added in Task 01

## Objective

Verify the TOC morph spring preset is correctly configured for snappy line-to-text morphing.

## Spring Configuration

```typescript
/** TOC ruler-to-text morph - snappy line expansion */
export const springTocMorph: Transition = {
  type: "spring",
  visualDuration: 0.25,
  bounce: 0.1,
};
```

## Motion MCP CSS Spring Output

For reference (0.25s, bounce 0.1):
```
250ms linear(0, 0.6559, 1.005, 1.0216, 1.0032, 0.9992, 0.9997, 1)
```

This shows a slight overshoot at ~1.02 then settling - perfect for morphing effect.

## Usage in RulerTOC

Will be imported and used for:
1. Line width animation (1px → full text width)
2. Line height animation (1px → text height)
3. Container width animation

## Verification

Import in RulerTOC.tsx:
```typescript
import { springTocMorph } from "@/lib/motion-variants";
```

TypeScript should autocomplete and no errors.
