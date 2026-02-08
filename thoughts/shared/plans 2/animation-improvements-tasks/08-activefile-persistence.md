# Task 08: Wire Up activeFileName Persistence

**Status:** Pending
**File:** `components/blog/CanvasCodeStage.tsx`
**Lines:** Various - update all references to activeFileIndex

## Objective

Update all code that uses `activeFileIndex` to use `activeFileName` and derived values.

## References to Update

### 1. handleCopy function (lines 505-524)

Before:
```typescript
code = getCodeForCopy(currentStep, activeFileIndex);
```

After:
```typescript
// Find the index of displayFileName in the current step's files
const fileIdx = multiFile && currentStep.files
  ? currentStep.files.findIndex(f => f.name === displayFileName)
  : 0;
code = getCodeForCopy(currentStep, Math.max(0, fileIdx));
```

### 2. Token mode file index (lines 510)

Before:
```typescript
code = getTokenCodeForCopy(currentTokenStep, activeFileIndex);
```

After:
```typescript
const tokenFileIdx = tokenMultiFile && currentTokenStep?.files
  ? currentTokenStep.files.findIndex(f => f.name === displayFileName)
  : 0;
code = getTokenCodeForCopy(currentTokenStep, Math.max(0, tokenFileIdx));
```

### 3. Code rendering section

Find where `activeFileIndex` is used to select which file's code to render.

Create helper:

```typescript
// Get current file index for rendering
const renderFileIndex = useMemo(() => {
  if (!displayFileName) return 0;

  if (multiFile && currentStep.files) {
    const idx = currentStep.files.findIndex(f => f.name === displayFileName);
    return Math.max(0, idx);
  }

  if (tokenMultiFile && currentTokenStep?.files) {
    const idx = currentTokenStep.files.findIndex(f => f.name === displayFileName);
    return Math.max(0, idx);
  }

  return 0;
}, [displayFileName, multiFile, tokenMultiFile, currentStep, currentTokenStep]);
```

Then use `renderFileIndex` where `activeFileIndex` was used.

### 4. Tab click handler

Already updated in Task 06:
```typescript
onClick={() => isAvailable && setActiveFileName(file.name)}
```

## Vercel Best Practices Applied

- `rerender-memo`: renderFileIndex is memoized
- `js-early-exit`: Early return when displayFileName is null
- `rerender-dependencies`: Only primitive deps in useMemo

## Verification

1. Select a file in step 1
2. Navigate to step 2 that has the same file → selection persists
3. Navigate to step 3 without that file → resets to first available
4. Navigate back to step 1 → original selection restored (if file still available)
5. Copy button copies correct file content
