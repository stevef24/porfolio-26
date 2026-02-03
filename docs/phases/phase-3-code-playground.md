# Phase 3: Code Playground Enhancement

## Overview

Enhance the Sandpack-based code playground with a header toolbar featuring title and action buttons (Reset, Line Numbers, Fullscreen, Refresh), matching the polished experience seen on animations.dev. This phase focuses on improving the playground's usability and visual refinement.

---

## Current Implementation Analysis

### File Locations
- `components/courses/CodePlaygroundClient.tsx` - Main implementation
- `components/courses/CodePlayground.tsx` - Lazy wrapper
- `app/globals.css` - Playground styles

### Current Features
- Sandpack integration with split editor/preview
- Resizable panels (drag to resize)
- OKLCH theme integration (light/dark)
- Cmd/Ctrl+S formatting via Prettier
- Lazy loading with Suspense fallback
- Template support (react, react-ts, nextjs, nextjs-ts, vanilla, vanilla-ts)

### Current Design
- No header toolbar
- Tabs visible but no control buttons
- Basic border styling
- Resize handle with primary color on drag

### What's Missing
1. Header toolbar with title
2. Reset code button
3. Toggle line numbers button
4. Fullscreen toggle button
5. Refresh preview button
6. Polish on overall container styling

---

## Target Design (animations.dev Style)

### Visual Reference
Based on animations.dev Code Playground:
- **Header Bar**: "Code Playground" title on left, action icons on right
- **Action Icons**: Reset, Line Numbers (#), Fullscreen (expand), Refresh
- **File Tabs**: Clean styling below header
- **Split Layout**: ~60% editor, ~40% preview
- **Border Radius**: Subtle rounding on container
- **Dark Theme**: Consistent with site theme

### Key Visual Elements
1. **Header**: Subtle background, border-bottom, consistent height
2. **Title**: "Code Playground" in medium weight
3. **Icons**: Small (14-16px), muted color, hover state
4. **Tooltips**: On hover for each action
5. **Container**: Rounded corners, consistent border

---

## Implementation Specification

### Dependencies
```tsx
import * as React from "react";
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
  useSandpackNavigation,
  // ... other imports
} from "@codesandbox/sandpack-react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowClockwise01Icon, // Refresh
  Maximize01Icon, // Fullscreen
  GridIcon, // Line numbers
  Undo01Icon, // Reset
} from "@hugeicons/core-free-icons";
```

### Extended Props Interface
```tsx
export interface CodePlaygroundProps {
  template?: PlaygroundTemplate;
  files?: SandpackFiles;
  showPreview?: boolean;
  showTabs?: boolean;
  showHeader?: boolean; // NEW - default true
  title?: string; // NEW - default "Code Playground"
  className?: string;
}
```

### Header Toolbar Component
```tsx
interface PlaygroundHeaderProps {
  title?: string;
  showLineNumbers: boolean;
  onToggleLineNumbers: () => void;
  onReset: () => void;
  onRefresh: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

function PlaygroundHeader({
  title = "Code Playground",
  showLineNumbers,
  onToggleLineNumbers,
  onReset,
  onRefresh,
  onToggleFullscreen,
  isFullscreen,
}: PlaygroundHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
      {/* Title */}
      <span className="text-sm font-medium text-foreground">
        {title}
      </span>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        {/* Reset Code */}
        <button
          onClick={onReset}
          className={cn(
            "p-1.5 rounded transition-colors",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          )}
          title="Reset code"
          aria-label="Reset code to initial state"
        >
          <HugeiconsIcon icon={Undo01Icon} size={14} />
        </button>

        {/* Toggle Line Numbers */}
        <button
          onClick={onToggleLineNumbers}
          className={cn(
            "p-1.5 rounded transition-colors",
            showLineNumbers
              ? "text-foreground bg-muted"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          )}
          title="Toggle line numbers"
          aria-label="Toggle line numbers"
          aria-pressed={showLineNumbers}
        >
          <HugeiconsIcon icon={GridIcon} size={14} />
        </button>

        {/* Toggle Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className={cn(
            "p-1.5 rounded transition-colors",
            isFullscreen
              ? "text-foreground bg-muted"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          )}
          title="Toggle fullscreen"
          aria-label="Toggle fullscreen mode"
          aria-pressed={isFullscreen}
        >
          <HugeiconsIcon icon={Maximize01Icon} size={14} />
        </button>

        {/* Refresh Preview */}
        <button
          onClick={onRefresh}
          className={cn(
            "p-1.5 rounded transition-colors",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          )}
          title="Refresh preview"
          aria-label="Refresh preview"
        >
          <HugeiconsIcon icon={ArrowClockwise01Icon} size={14} />
        </button>
      </div>
    </div>
  );
}
```

### Sandpack Actions Hook
```tsx
function useSandpackActions() {
  const { sandpack } = useSandpack();
  const { refresh } = useSandpackNavigation();

  const resetCode = React.useCallback(() => {
    sandpack.resetAllFiles();
  }, [sandpack]);

  const refreshPreview = React.useCallback(() => {
    refresh();
  }, [refresh]);

  return {
    resetCode,
    refreshPreview,
  };
}
```

### Fullscreen Logic
```tsx
const [isFullscreen, setIsFullscreen] = React.useState(false);
const containerRef = React.useRef<HTMLDivElement>(null);

const toggleFullscreen = React.useCallback(() => {
  if (!containerRef.current) return;

  if (!document.fullscreenElement) {
    containerRef.current.requestFullscreen();
    setIsFullscreen(true);
  } else {
    document.exitFullscreen();
    setIsFullscreen(false);
  }
}, []);

// Listen for fullscreen changes (e.g., Esc key)
React.useEffect(() => {
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  return () => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  };
}, []);
```

### Full Updated Component

```tsx
"use client";

import * as React from "react";
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
  useSandpackNavigation,
  type SandpackFiles,
  type SandpackPredefinedTemplate,
  type SandpackTheme,
} from "@codesandbox/sandpack-react";
import { githubLight, sandpackDark } from "@codesandbox/sandpack-themes";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowClockwise01Icon,
  Maximize01Icon,
  GridIcon,
  Undo01Icon,
} from "@hugeicons/core-free-icons";

type PlaygroundTemplate = SandpackPredefinedTemplate | "nextjs-ts";

export interface CodePlaygroundProps {
  template?: PlaygroundTemplate;
  files?: SandpackFiles;
  showPreview?: boolean;
  showTabs?: boolean;
  showHeader?: boolean;
  title?: string;
  className?: string;
}

const DEFAULT_TEMPLATE: SandpackPredefinedTemplate = "react";
const DEFAULT_HEIGHT = "420px";
const FULLSCREEN_HEIGHT = "100vh";

// ... (keep existing NEXT_TS_FILES, NEXT_TS_SETUP, resolveTemplate, createSwissTheme, etc.)

// Internal component that has access to Sandpack context
function PlaygroundInner({
  showPreview,
  showTabs,
  showHeader,
  title,
  className,
}: {
  showPreview: boolean;
  showTabs: boolean;
  showHeader: boolean;
  title: string;
  className?: string;
}) {
  const { sandpack } = useSandpack();
  const { refresh } = useSandpackNavigation();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [editorWidth, setEditorWidth] = React.useState(55);
  const [isResizing, setIsResizing] = React.useState(false);
  const [showLineNumbers, setShowLineNumbers] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Actions
  const resetCode = React.useCallback(() => {
    sandpack.resetAllFiles();
  }, [sandpack]);

  const refreshPreview = React.useCallback(() => {
    refresh();
  }, [refresh]);

  const toggleLineNumbers = React.useCallback(() => {
    setShowLineNumbers((prev) => !prev);
  }, []);

  const toggleFullscreen = React.useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, []);

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Resize logic (existing)
  const startResizing = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!showPreview || !containerRef.current) return;

      event.preventDefault();
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      setIsResizing(true);
      document.body.style.cursor = "col-resize";

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const next = ((moveEvent.clientX - rect.left) / rect.width) * 100;
        const bounded = Math.min(75, Math.max(25, next));
        setEditorWidth(bounded);
      };

      const stopResize = () => {
        setIsResizing(false);
        document.body.style.cursor = "";
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", stopResize);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", stopResize);
    },
    [showPreview]
  );

  const currentHeight = isFullscreen ? FULLSCREEN_HEIGHT : DEFAULT_HEIGHT;

  const editorStyle: React.CSSProperties = {
    height: currentHeight,
    flexGrow: showPreview ? editorWidth : 100,
    flexShrink: showPreview ? editorWidth : 100,
    flexBasis: 0,
  };

  const previewStyle: React.CSSProperties = {
    height: currentHeight,
    flexGrow: 100 - editorWidth,
    flexShrink: 100 - editorWidth,
    flexBasis: 0,
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "code-playground rounded-lg border border-border overflow-hidden",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
    >
      {/* Header Toolbar */}
      {showHeader && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={resetCode}
              className={cn(
                "p-1.5 rounded transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              )}
              title="Reset code"
              aria-label="Reset code to initial state"
            >
              <HugeiconsIcon icon={Undo01Icon} size={14} />
            </button>
            <button
              onClick={toggleLineNumbers}
              className={cn(
                "p-1.5 rounded transition-colors",
                showLineNumbers
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              )}
              title="Toggle line numbers"
              aria-label="Toggle line numbers"
              aria-pressed={showLineNumbers}
            >
              <HugeiconsIcon icon={GridIcon} size={14} />
            </button>
            <button
              onClick={toggleFullscreen}
              className={cn(
                "p-1.5 rounded transition-colors",
                isFullscreen
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              )}
              title="Toggle fullscreen"
              aria-label="Toggle fullscreen mode"
              aria-pressed={isFullscreen}
            >
              <HugeiconsIcon icon={Maximize01Icon} size={14} />
            </button>
            <button
              onClick={refreshPreview}
              className={cn(
                "p-1.5 rounded transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              )}
              title="Refresh preview"
              aria-label="Refresh preview"
            >
              <HugeiconsIcon icon={ArrowClockwise01Icon} size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Sandpack Layout */}
      <SandpackLayout className="code-playground__layout">
        <SandpackCodeEditor
          showTabs={showTabs}
          showLineNumbers={showLineNumbers}
          showInlineErrors
          wrapContent
          style={editorStyle}
          className={cn(
            "code-playground__editor",
            prefersReducedMotion ? "" : "transition-[flex-grow]"
          )}
        />
        {showPreview && (
          <>
            <button
              type="button"
              onPointerDown={startResizing}
              role="separator"
              aria-label="Resize code editor"
              aria-orientation="vertical"
              aria-valuemin={25}
              aria-valuemax={75}
              aria-valuenow={Math.round(editorWidth)}
              className={cn(
                "code-playground__resize-handle",
                isResizing && "is-resizing"
              )}
            />
            <SandpackPreview
              showNavigator={false}
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              showRestartButton={false}
              showOpenNewtab={false}
              style={previewStyle}
              className={cn(
                "code-playground__preview",
                prefersReducedMotion ? "" : "transition-[flex-grow]"
              )}
            />
          </>
        )}
      </SandpackLayout>
    </div>
  );
}

// Main component wrapper
const CodePlaygroundClient = ({
  template,
  files,
  showPreview = true,
  showTabs = true,
  showHeader = true,
  title = "Code Playground",
  className,
}: CodePlaygroundProps) => {
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const resolvedTemplate = resolveTemplate(template);
  const resolvedFiles =
    template === "nextjs-ts"
      ? { ...NEXT_TS_FILES, ...(files ?? {}) }
      : files;
  const customSetup = template === "nextjs-ts" ? NEXT_TS_SETUP : undefined;

  const theme = React.useMemo(() => {
    const mode = resolvedTheme === "dark" ? "dark" : "light";
    const baseTheme = mode === "dark" ? sandpackDark : githubLight;
    return createSwissTheme(baseTheme, mode);
  }, [resolvedTheme]);

  return (
    <motion.div
      className={className}
      style={{ "--sp-border-radius": "0" } as React.CSSProperties}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: "easeOut",
      }}
    >
      <SandpackProvider
        template={resolvedTemplate}
        files={resolvedFiles}
        customSetup={customSetup}
        theme={theme}
        options={{
          initMode: "lazy",
          recompileMode: "delayed",
          recompileDelay: 300,
        }}
      >
        <PlaygroundInner
          showPreview={showPreview}
          showTabs={showTabs}
          showHeader={showHeader}
          title={title}
        />
        <FormatOnSave />
      </SandpackProvider>
    </motion.div>
  );
};

export default CodePlaygroundClient;
```

---

## CSS Updates

### globals.css Additions
```css
/* Code Playground - Enhanced styling */
.code-playground {
  --sp-border-radius: 0;
  --sp-layout-height: 420px;
}

/* Remove internal borders, rely on container */
.code-playground .sp-layout {
  border: none;
  background: transparent;
}

/* Header styling */
.code-playground > div:first-child {
  background: var(--muted);
}

/* Fullscreen mode */
.code-playground:fullscreen {
  background: var(--background);
}

.code-playground:fullscreen .sp-layout {
  height: calc(100vh - 40px); /* Account for header */
}

/* Tab styling refinements */
.code-playground .sp-tabs {
  border-bottom: 1px solid var(--border);
  background: transparent;
  padding: 0 0.5rem;
}

.code-playground .sp-tab-button {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0;
  border-bottom: 2px solid transparent;
}

.code-playground .sp-tab-button[data-active="true"] {
  border-bottom-color: var(--primary);
}

/* Editor and preview areas */
.code-playground .sp-editor,
.code-playground .sp-preview,
.code-playground .sp-code-editor {
  background: var(--background);
}

/* Resize handle */
.code-playground__resize-handle {
  width: 8px;
  cursor: col-resize;
  background: var(--border);
  border: none;
  padding: 0;
  transition: background-color 0.15s;
}

.code-playground__resize-handle:hover {
  background: var(--muted-foreground);
}

.code-playground__resize-handle.is-resizing {
  background: var(--primary);
}

@media (max-width: 1024px) {
  .code-playground__resize-handle {
    display: none;
  }
}
```

---

## Icon Mapping

| Action | Icon | HugeIcons Name |
|--------|------|----------------|
| Reset | Undo arrow | `Undo01Icon` |
| Line Numbers | Grid/Hash | `GridIcon` |
| Fullscreen | Expand arrows | `Maximize01Icon` |
| Refresh | Circular arrow | `ArrowClockwise01Icon` |

---

## Keyboard Shortcuts

### Existing
- `Cmd/Ctrl + S`: Format code with Prettier

### Potential Additions (Optional)
- `Cmd/Ctrl + Shift + L`: Toggle line numbers
- `Cmd/Ctrl + Shift + F`: Toggle fullscreen
- `Cmd/Ctrl + Shift + R`: Refresh preview
- `Escape`: Exit fullscreen

---

## Accessibility

### Button Attributes
- `title` for tooltip on hover
- `aria-label` for screen readers
- `aria-pressed` for toggle states
- Focus ring visible on keyboard navigation

### Fullscreen
- Escape key exits fullscreen (browser default)
- Focus maintained within playground

### Resize Handle
- `role="separator"` for semantic meaning
- `aria-orientation="vertical"`
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` for slider semantics

---

## Testing Checklist

### Functional Tests
- [ ] Reset button resets all files to initial state
- [ ] Line numbers toggle on/off correctly
- [ ] Fullscreen enters and exits properly
- [ ] Refresh button reloads preview
- [ ] Resize handle adjusts panel widths
- [ ] Cmd+S formats code

### Visual Tests
- [ ] Header displays correctly
- [ ] Icons have proper hover states
- [ ] Active toggle states visible
- [ ] Works in both light and dark themes
- [ ] Fullscreen mode fills viewport

### Accessibility Tests
- [ ] All buttons keyboard accessible
- [ ] Screen reader announces actions
- [ ] Focus states visible
- [ ] Escape exits fullscreen

---

## Files Modified

| File | Changes |
|------|---------|
| `components/courses/CodePlaygroundClient.tsx` | Add header, actions, fullscreen |
| `app/globals.css` | Playground styling refinements |

## New Props
- `showHeader?: boolean` (default: true)
- `title?: string` (default: "Code Playground")

## Breaking Changes
- None (new props are optional with defaults)

---

## MDX Integration Notes

### Fence Metadata Support
The code playground can be invoked via MDX code fences with metadata:

```markdown
```jsx playground template=react
// Your code here
```
```

**Supported metadata options:**
- `playground` - Enables live sandbox mode
- `template=react|react-ts|nextjs|nextjs-ts|vanilla|vanilla-ts` - Template preset
- `file=/App.js` - Specify active file
- `preview=true|false` - Show/hide preview panel
- `tabs=true|false` - Show/hide file tabs

### MDX Component Registration
Located in `lib/custom-components.tsx`:
- `<CodePlayground />` registered for direct MDX usage
- `pre` component override upgrades code fences with `playground` meta

### Licensing Note
Sandpack `nextjs` templates run on Nodebox runtime and have separate licensing terms for commercial use. Review CodeSandbox licensing if using Next.js templates in production.
