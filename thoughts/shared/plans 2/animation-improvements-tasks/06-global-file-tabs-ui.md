# Task 06: Update Tab UI for Global Files

**Status:** Pending
**File:** `components/blog/CanvasCodeStage.tsx`
**Lines:** 637-680

## Objective

Replace per-step file tabs with global file tabs showing ALL files across all steps. Unavailable files are dimmed.

## Current Implementation (lines 637-658)

```typescript
{multiFile && currentStep.files ? (
  <div className="canvas-code-stage-tabs relative">
    {currentStep.files.map((file, idx) => (
      <button
        key={file.name}
        onClick={() => setActiveFileIndex(idx)}
        data-active={idx === activeFileIndex}
        className="canvas-code-stage-tab relative z-10"
      >
        {file.name}
        {idx === activeFileIndex && (
          <motion.div
            layoutId="tab-underline"
            className="canvas-code-stage-tab-underline"
            transition={prefersReducedMotion ? { duration: 0 } : springBouncy}
          />
        )}
      </button>
    ))}
  </div>
) : ( /* single file */ )}
```

## New Implementation

```typescript
{/* Global file tabs - always show all files across steps */}
{globalFiles.length > 1 ? (
  <div className="canvas-code-stage-tabs relative">
    {globalFiles.map((file) => {
      const isSelected = file.name === displayFileName;
      const isAvailable = file.isActiveInStep;

      return (
        <button
          key={file.name}
          onClick={() => isAvailable && setActiveFileName(file.name)}
          data-active={isSelected}
          data-available={isAvailable}
          disabled={!isAvailable}
          className="canvas-code-stage-tab relative z-10"
          aria-label={isAvailable ? `View ${file.name}` : `${file.name} (not in this step)`}
        >
          {file.name}

          {/* Availability dot for files that exist but aren't selected */}
          {isAvailable && !isSelected && (
            <span className="canvas-code-stage-tab-dot" />
          )}

          {/* Sliding underline indicator - uses global layoutId */}
          {isSelected && (
            <motion.div
              layoutId="global-tab-underline"
              className="canvas-code-stage-tab-underline"
              transition={prefersReducedMotion ? { duration: 0 } : springBouncy}
            />
          )}
        </button>
      );
    })}
  </div>
) : (
  // Single file indicator with change animation
  displayFileName && (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayFileName}
        className="canvas-code-stage-file"
        initial={prefersReducedMotion ? false : { opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={prefersReducedMotion ? { duration: 0 } : springSnappy}
      >
        <FileIcon />
        {displayFileName}
      </motion.div>
    </AnimatePresence>
  )
)}
```

## Motion Codex Pattern (Shared Layout Animation)

From `motion://examples/react/shared-layout-animation`:
```typescript
{item === selectedTab ? (
  <motion.div
    style={underline}
    layoutId="underline"
    id="underline"
  />
) : null}
```

We use `layoutId="global-tab-underline"` for the sliding indicator across all tabs.

## Visual Behavior

| File State | Visual |
|------------|--------|
| Selected + Available | Full opacity, underline indicator |
| Not Selected + Available | Full opacity, green dot indicator |
| Not Selected + Unavailable | 35% opacity, disabled, no click |

## Verification

1. All files from all steps appear as tabs
2. Unavailable files are dimmed and not clickable
3. Underline slides smoothly between tabs
4. Selecting a file persists when navigating to a step containing it
