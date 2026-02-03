# Task 04: Create GlobalFile Interface and State

**Status:** Pending
**File:** `components/blog/CanvasCodeStage.tsx`
**Lines:** 437-440

## Objective

Replace per-step `activeFileIndex` with persistent `activeFileName` that tracks files across all steps.

## Current State (lines 437-440)

```typescript
const prefersReducedMotion = useReducedMotion();
const [copied, setCopied] = useState(false);
const [activeFileIndex, setActiveFileIndex] = useState(0);
const [isFullscreen, setIsFullscreen] = useState(false);
```

## New Interface and State

Add interface above component:

```typescript
/**
 * Global file tracking for cross-step persistence
 * Enables IDE-like tab behavior where selecting a file persists across steps
 */
interface GlobalFile {
  /** File name (e.g., "agent.ts") */
  name: string;
  /** Which step indices contain this file */
  stepIndices: number[];
  /** Is this file available in the current step? */
  isActiveInStep: boolean;
}
```

Update state:

```typescript
const prefersReducedMotion = useReducedMotion();
const [copied, setCopied] = useState(false);
// Replace activeFileIndex with activeFileName for cross-step persistence
const [activeFileName, setActiveFileName] = useState<string | null>(null);
const [isFullscreen, setIsFullscreen] = useState(false);
```

## Vercel Best Practices

- `rerender-derived-state`: Store primitive `activeFileName` instead of derived index
- `rerender-lazy-state-init`: Initial state is null, no expensive computation

## Migration Notes

The `activeFileIndex` was reset on every step change (line 470):
```typescript
setActiveFileIndex(0);
```

With `activeFileName`, we'll preserve the selected file if it exists in the new step, otherwise reset to first file. This is handled in Task 05.

## Verification

1. TypeScript compiles with new interface
2. `activeFileName` state available in component
