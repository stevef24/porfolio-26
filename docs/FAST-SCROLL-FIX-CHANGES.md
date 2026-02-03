# Canvas Fast-Scroll Responsiveness Fix

## Summary

Fixed an issue where the canvas panel would get stuck open when scrolling quickly through the blog at `/blog/agent-sdk-deep-research`. The root cause was that IntersectionObserver could miss sentinel elements during fast scroll, leaving the canvas in a stuck state.

## File Changed

**`components/blog/BlogWithCanvas.tsx`**

---

## Detailed Changes

### 1. Added Tuning Constants for Scroll Thresholds

**Lines 106-111** - Extracted magic numbers into named constants:

```typescript
const FRAME_TIME_MS = 16.67;
const FAST_SCROLL_VELOCITY_PX_PER_FRAME = 80;
const SCROLL_IDLE_TIMEOUT_MS = 150;
const READING_LINE_RATIO = 0.35;
const BOTTOM_MARGIN_RATIO = 0.65;
const UP_SCROLL_CLOSE_OFFSET_PX = 50;
```

**Why:** Centralizes tuning and makes the scroll heuristics easier to audit and adjust.

---

### 2. Added Zone Element Lookup Map

**Lines 141-142** - Added a dedicated map of zone IDs to elements:

```typescript
const zoneElementsRef = useRef(new Map<string, Element>());
```

**Why:** Avoids scanning sentinels during position checks and enables O(1) lookup for the active zone element.

---

### 3. Added New Refs for Position-Based Closure System

**Lines 158-160** - Added three new refs to support the fallback closure mechanism:

```typescript
const checkPositionBasedClosureRef = useRef<(() => boolean) | null>(null);
const scheduleCloseRef = useRef<(() => void) | null>(null);
const scrollIdleTimerRef = useRef<NodeJS.Timeout | null>(null);
```

**Purpose:**
- `checkPositionBasedClosureRef`: Stores the position check function for access in the scroll handler
- `scheduleCloseRef`: Stores the close scheduler for access in the scroll handler
- `scrollIdleTimerRef`: Manages the idle detection timer

---

### 4. Replaced useEffect Ref Syncs with Direct Assignment

**Lines 242-246** - Changed from useEffect to direct assignment for state-to-ref syncing:

**Before (anti-pattern):**
```typescript
useEffect(() => { hasActiveZoneRef.current = hasActiveZone; }, [hasActiveZone]);
useEffect(() => { activeZoneIdRef.current = activeZoneId; }, [activeZoneId]);
useEffect(() => { canvasContentRef.current = canvasContent; }, [canvasContent]);
```

**After (React best practices):**
```typescript
// Sync refs with state - direct assignment during render is safe for refs
// (avoids unnecessary useEffect overhead per React best practices)
hasActiveZoneRef.current = hasActiveZone;
activeZoneIdRef.current = activeZoneId;
canvasContentRef.current = canvasContent;
```

**Why:** Per Vercel React best practices on handler refs, refs can be assigned directly during render. Using useEffect for this creates unnecessary effect overhead and can cause stale closure issues.

---

### 5. Added Position-Based Closure Check Function

**Lines 330-354** - New function that checks element positions directly:

```typescript
// Position-based closure check: returns true if no zones intersect the reading band
// This works independently of IntersectionObserver for fast-scroll scenarios
const checkPositionBasedClosure = useCallback(function checkPositionBasedClosure(): boolean {
  const readingLine = window.innerHeight * READING_LINE_RATIO;
  const bottomMargin = window.innerHeight * BOTTOM_MARGIN_RATIO;
  const activeZoneId = activeZoneIdRef.current;

  if (activeZoneId) {
    const activeElement = zoneElementsRef.current.get(activeZoneId);
    if (activeElement) {
      const rect = activeElement.getBoundingClientRect();
      if (rect.bottom > readingLine && rect.top < bottomMargin) {
        return false; // Active zone still visible
      }
    }
  }

  for (const [id, element] of zoneElementsRef.current) {
    if (id === activeZoneId) continue;
    const rect = element.getBoundingClientRect();
    // Zone is visible if bottom is below reading line AND top is above exit zone
    if (rect.bottom > readingLine && rect.top < bottomMargin) {
      return false; // Zone still visible
    }
  }
  return true; // No zones intersect the reading band
}, []);
```

**Why:** IntersectionObserver callbacks are batched and may miss elements that enter/exit the viewport within a single frame during fast scroll. This function uses `getBoundingClientRect()` for real-time position checking and closes in gaps or after the end.

---

### 6. Direct Ref Assignment for Callback Functions

**Lines 356-358** - Changed from useEffect to direct assignment:

**Before:**
```typescript
useEffect(() => {
  checkPositionBasedClosureRef.current = checkPositionBasedClosure;
}, [checkPositionBasedClosure]);

useEffect(() => {
  scheduleCloseRef.current = scheduleClose;
}, [scheduleClose]);
```

**After:**
```typescript
// Sync refs for use in scroll handler - direct assignment is safe for refs
checkPositionBasedClosureRef.current = checkPositionBasedClosure;
scheduleCloseRef.current = scheduleClose;
```

---

### 7. Enhanced Scroll Handler with Fast-Scroll Detection

**Lines 175-223** - Added idle timer clearing, active-zone gating, and position-based closure during fast scroll:

```typescript
const handleScroll = () => {
  // Cancel pending RAF
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }

  // NEW: Clear existing idle timer - will be reset after processing
  if (scrollIdleTimerRef.current) {
    clearTimeout(scrollIdleTimerRef.current);
    scrollIdleTimerRef.current = null;
  }

  rafId = requestAnimationFrame(() => {
    // ... velocity calculation ...

    // During fast scroll (above threshold), trigger immediate resolution
    if (velocity > FAST_SCROLL_VELOCITY_PX_PER_FRAME) {
      resolveActiveZoneRef.current?.();

      // NEW: Position-based closure during fast scroll down
      // Handles case where IntersectionObserver misses the sentinel
      if (scrollDirectionRef.current === "down" && hasActiveZoneRef.current) {
        if (checkPositionBasedClosureRef.current?.()) {
          scheduleCloseRef.current?.();
        }
      }
    }

    // NEW: Only schedule idle verification when a zone is active
    // This catches any missed observer events during rapid scrolling
    if (hasActiveZoneRef.current) {
      scrollIdleTimerRef.current = setTimeout(() => {
        if (hasActiveZoneRef.current && checkPositionBasedClosureRef.current?.()) {
          scheduleCloseRef.current?.();
        }
      }, SCROLL_IDLE_TIMEOUT_MS);
    }

    rafId = null;
  });
};
```

**Purpose:**
- **Immediate position check**: During fast scroll down, immediately check if no zones intersect the reading band (gaps/end)
- **Idle detection**: When scrolling stops (150ms timeout), verify canvas state is correct

---

### 8. Modified Asymmetric Hysteresis

**Lines 465-473** - Added position-based override to the hysteresis logic:

**Before:**
```typescript
// Asymmetric hysteresis: scrolling down through zone content keeps canvas open
if (scrollDirectionRef.current === "down" && hasActiveZoneRef.current) {
  return;
}
```

**After:**
```typescript
// Asymmetric hysteresis: scrolling down through zone content keeps canvas open
// UNLESS position-based check indicates no zones intersect the reading band
if (scrollDirectionRef.current === "down" && hasActiveZoneRef.current) {
  // Allow closing if position check indicates no zones intersect the reading band
  if (!checkPositionBasedClosure()) {
    return; // Keep open - still in zone content
  }
  // Fall through to scheduleClose()
}
```

**Why:** The original design kept the canvas open unconditionally while scrolling down. This created a problem when fast-scrolling beyond zones or into gaps - the canvas would never close. The new logic allows closing when position-based checks confirm no zones intersect the reading band.

---

### 9. Added resolveActiveZone Dependency

**Line 476** - Added `checkPositionBasedClosure` to the dependency array:

```typescript
}, [activateZone, clearCloseTimer, checkPositionBasedClosure, effectiveMinRatio, scheduleClose]);
```

---

### 10. Updated resolveActiveZoneRef Sync

**Lines 478-479** - Changed from useEffect to direct assignment:

**Before:**
```typescript
useEffect(() => {
  resolveActiveZoneRef.current = resolveActiveZone;
}, [resolveActiveZone]);
```

**After:**
```typescript
// Sync ref for scroll handler access - direct assignment is safe for refs
resolveActiveZoneRef.current = resolveActiveZone;
```

---

### 11. Added Cleanup for Scroll Idle Timer

**Lines 599-614** - Added cleanup for the new timer:

```typescript
useEffect(() => {
  return () => {
    clearCloseTimer();
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    // NEW: Clean up scroll idle timer
    if (scrollIdleTimerRef.current) {
      clearTimeout(scrollIdleTimerRef.current);
      scrollIdleTimerRef.current = null;
    }
  };
}, [clearCloseTimer]);
```

---

## Testing Scenarios

1. **Fast scroll down** through entire page → canvas should close at bottom
2. **Slow scroll down** → canvas should stay open while in zone content
3. **Scroll up past zones** → canvas should close (existing behavior)
4. **Fast scroll up** → canvas should close
5. **Stop mid-scroll** → canvas state should be correct after ~150ms (SCROLL_IDLE_TIMEOUT_MS) idle

## Performance Considerations

- Direct ref assignment during render is more performant than useEffect
- The position check only scans zone elements and short-circuits on the active zone
- The idle timer is scheduled only when a zone is active and keeps the fallback check responsive
- Threshold constants centralize tuning without scattering magic numbers
- RAF batching ensures scroll handler doesn't block the main thread

## React Best Practices Applied

1. **Eliminated unnecessary useEffect** - Direct ref assignment is safe and more performant
2. **Stable event subscriptions** - Handler refs pattern prevents re-subscription on callback changes
3. **Narrowed effect dependencies** - Used primitive dependencies where possible
