# Task 05: Implement globalFiles useMemo Computation

**Status:** Pending
**File:** `components/blog/CanvasCodeStage.tsx`
**Lines:** After state declarations (~line 445)

## Objective

Compute a memoized list of all unique files across all steps, tracking which steps contain each file.

## Implementation

```typescript
/**
 * Compute global files across all steps
 * Memoized to prevent recalculation on every render
 *
 * @vercel-best-practice rerender-memo - Extract expensive computation
 * @vercel-best-practice rerender-dependencies - Primitive deps only
 */
const globalFiles = useMemo((): GlobalFile[] => {
  const fileMap = new Map<string, number[]>();

  steps.forEach((step, stepIdx) => {
    // Handle both single-file and multi-file steps
    const files = step.files?.map(f => f.name) || (step.file ? [step.file] : []);

    files.forEach(name => {
      const existing = fileMap.get(name) || [];
      existing.push(stepIdx);
      fileMap.set(name, existing);
    });
  });

  // Sort by first appearance (maintains logical order)
  // @vercel-best-practice js-tosorted-immutable
  return Array.from(fileMap.entries())
    .sort((a, b) => a[1][0] - b[1][0])
    .map(([name, stepIndices]) => ({
      name,
      stepIndices,
      isActiveInStep: stepIndices.includes(activeIndex),
    }));
}, [steps, activeIndex]);
```

## Computed Values

Add derived values for current file selection:

```typescript
// Get current file index from global files
const currentFileIndex = useMemo(() => {
  if (!activeFileName) return 0;
  const idx = globalFiles.findIndex(f => f.name === activeFileName && f.isActiveInStep);
  return idx >= 0 ? idx : 0;
}, [activeFileName, globalFiles]);

// Get the actual file to display
const displayFileName = useMemo(() => {
  const activeInStep = globalFiles.filter(f => f.isActiveInStep);
  if (activeFileName && activeInStep.some(f => f.name === activeFileName)) {
    return activeFileName;
  }
  return activeInStep[0]?.name || null;
}, [activeFileName, globalFiles]);
```

## Update Step Change Effect (replace lines 454-477)

```typescript
// Sync active file when step changes
const prevStepRef = useRef(activeIndex);
useLayoutEffect(function syncActiveFileName() {
  if (prevStepRef.current === activeIndex) return;

  prevStepRef.current = activeIndex;

  // If current activeFileName is available in new step, keep it
  // Otherwise, reset to first available file
  const availableInNewStep = globalFiles.filter(f => f.isActiveInStep);
  const currentStillAvailable = availableInNewStep.some(f => f.name === activeFileName);

  if (!currentStillAvailable && availableInNewStep.length > 0) {
    setActiveFileName(availableInNewStep[0].name);
  }
}, [activeIndex, globalFiles, activeFileName]);
```

## Vercel Best Practices Applied

- `rerender-memo`: globalFiles extracted to useMemo
- `rerender-dependencies`: Uses primitive `activeIndex` not object reference
- `js-index-maps`: Uses Map for O(1) file lookup during construction
- `js-tosorted-immutable`: Could use toSorted() for immutability (optional)

## Verification

1. Console.log `globalFiles` - should show all unique files across steps
2. Files ordered by first appearance
3. `isActiveInStep` updates correctly as `activeIndex` changes
