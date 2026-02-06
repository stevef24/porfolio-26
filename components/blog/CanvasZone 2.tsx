"use client";

/**
 * CanvasZone - Scroll-triggered canvas activation
 *
 * Registers a zone with the BlogWithCanvas provider, which owns the shared
 * IntersectionObserver. The provider resolves the active zone and keeps the
 * canvas state stable across transitions.
 *
 * Two modes:
 * - `static` (default): Canvas content is fixed, doesn't react to scroll position within zone
 * - `stepped`: Canvas content updates based on which CanvasStep is in view
 *
 * @example Static mode (simple):
 * ```tsx
 * <CanvasZone id="intro" type="code" canvasContent={<CodeStage steps={...} />}>
 *   <p>Explanation text that appears alongside the code...</p>
 * </CanvasZone>
 * ```
 *
 * @example Stepped mode (interactive):
 * ```tsx
 * <CanvasZone
 *   id="demo"
 *   mode="stepped"
 *   totalSteps={3}
 *   canvasContent={(index) => <DemoRenderer step={index} />}
 * >
 *   <CanvasStep index={0}><p>Step 1 explanation...</p></CanvasStep>
 *   <CanvasStep index={1}><p>Step 2 explanation...</p></CanvasStep>
 *   <CanvasStep index={2}><p>Step 3 explanation...</p></CanvasStep>
 * </CanvasZone>
 * ```
 */

import { useEffect, useId, useMemo, useRef, type ReactNode } from "react";
import { useCanvasLayout } from "./BlogWithCanvas";
import { CanvasZoneProvider, useCanvasZoneContextOptional } from "./CanvasZoneContext";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type CanvasZoneType = "code" | "demo" | "visualization";
export type CanvasZoneMode = "static" | "stepped";

/** Canvas content can be static ReactNode or a render function receiving step index */
export type CanvasContentProp = ReactNode | ((activeStepIndex: number) => ReactNode);

interface CanvasZoneBaseProps {
  /** Unique identifier for this zone (auto-generated if not provided) */
  id?: string;
  /** Type of canvas content - affects styling and visual indicators */
  type?: CanvasZoneType;
  /** Children to render in the blog column */
  children: ReactNode;
  /** Additional class names for the zone wrapper */
  className?: string;
  /**
   * CSS selector for the trigger element within the zone.
   * If provided, this element will be observed instead of the whole zone.
   * Example: "h2" to trigger when the H2 heading reaches the activation point.
   */
  triggerSelector?: string;
  /**
   * Deprecated: entry/exit margins are now controlled by BlogWithCanvas.
   * These props are retained for backwards compatibility.
   */
  entryRootMargin?: string;
  /**
   * Deprecated: entry/exit margins are now controlled by BlogWithCanvas.
   * These props are retained for backwards compatibility.
   */
  exitRootMargin?: string;
  /**
   * Debounce delay (ms) before deactivating when zone exits.
   * Default: 150ms - prevents rapid on/off during scroll direction changes.
   */
  deactivateDelay?: number;
}

interface CanvasZoneStaticProps extends CanvasZoneBaseProps {
  /** Mode: static content that doesn't change with scroll position */
  mode?: "static";
  /** Content to render in the canvas sidebar when this zone is active */
  canvasContent: ReactNode;
  /** Not used in static mode */
  totalSteps?: never;
}

interface CanvasZoneSteppedProps extends CanvasZoneBaseProps {
  /** Mode: stepped content that updates based on active CanvasStep */
  mode: "stepped";
  /** Content to render - can be ReactNode or function receiving activeStepIndex */
  canvasContent: CanvasContentProp;
  /** Total number of steps (required for stepped mode) */
  totalSteps: number;
}

type CanvasZoneProps = CanvasZoneStaticProps | CanvasZoneSteppedProps;

interface CanvasGapProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

interface CanvasEndProps {
  id?: string;
  className?: string;
}

// ============================================================================
// Helper: Resolve canvas content (handle render prop vs static ReactNode)
// ============================================================================

function resolveCanvasContent(
  content: CanvasContentProp,
  activeStepIndex: number
): ReactNode {
  if (typeof content === "function") {
    return content(activeStepIndex);
  }
  return content;
}

// ============================================================================
// Internal: Stepped zone content wrapper
// ============================================================================

interface SteppedZoneContentProps {
  zoneId: string;
  zoneRef: React.RefObject<HTMLDivElement | null>;
  type: CanvasZoneType;
  isActive: boolean;
  className?: string;
  children: ReactNode;
  canvasContent: CanvasContentProp;
  deactivateDelay: number;
  updateZoneConfig: (
    id: string,
    config: { content: ReactNode; deactivateDelay?: number }
  ) => void;
}

/**
 * Inner component that has access to CanvasZoneContext.
 * Updates zone config whenever activeStepIndex changes.
 */
function SteppedZoneContent({
  zoneId,
  zoneRef,
  type,
  isActive,
  className,
  children,
  canvasContent,
  deactivateDelay,
  updateZoneConfig,
}: SteppedZoneContentProps): JSX.Element {
  const context = useCanvasZoneContextOptional();
  const activeStepIndex = context?.activeStepIndex ?? 0;

  // Track previous step to avoid unnecessary updates
  const prevStepRef = useRef<number | null>(null);

  // Update zone config ONLY when step index changes (not on every render)
  // This prevents infinite loops from render prop creating new ReactNode each time
  useEffect(() => {
    if (prevStepRef.current === activeStepIndex) return;
    prevStepRef.current = activeStepIndex;
    // Resolve content inside effect to avoid dependency on ReactNode
    const content = resolveCanvasContent(canvasContent, activeStepIndex);
    updateZoneConfig(zoneId, {
      content,
      deactivateDelay,
    });
  }, [updateZoneConfig, zoneId, activeStepIndex, canvasContent, deactivateDelay]);

  return (
    <div
      ref={zoneRef}
      id={zoneId}
      data-canvas-zone
      data-zone-type={type}
      data-zone-mode="stepped"
      data-zone-active={isActive}
      data-zone-step={activeStepIndex}
      className={cn(
        "relative",
        className
      )}
    >
      {children}
      {/* Mobile inline canvas is rendered inside each CanvasStep component */}
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

export function CanvasZone(props: CanvasZoneProps): JSX.Element {
  const {
    id: providedId,
    type = "code",
    canvasContent,
    children,
    className,
    triggerSelector,
    deactivateDelay = 150,
  } = props;

  // Extract mode-specific props with type narrowing
  const mode = props.mode ?? "static";
  const totalSteps = mode === "stepped" ? (props as CanvasZoneSteppedProps).totalSteps : 0;

  const generatedId = useId();
  const zoneId = providedId ?? generatedId;
  const zoneRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<Element | null>(null);
  const canvasContentRef = useRef(canvasContent);

  const { registerZone, updateZoneConfig, activeZoneId } = useCanvasLayout();

  // Track whether this zone is currently active
  const isActive = activeZoneId === zoneId;

  // For static mode, resolve content once (always use index 0)
  const staticResolvedContent = useMemo(() => {
    if (mode !== "static") return null;
    return resolveCanvasContent(canvasContent, 0);
  }, [canvasContent, mode]);

  // Find the trigger element if selector provided
  useEffect(() => {
    if (!triggerSelector || !zoneRef.current) {
      triggerElementRef.current = null;
      return;
    }
    const found = zoneRef.current.querySelector(triggerSelector);
    triggerElementRef.current = found;
  }, [triggerSelector]);

  useEffect(() => {
    canvasContentRef.current = canvasContent;
  }, [canvasContent]);

  // Register zone on mount
  useEffect(() => {
    const zoneElement = zoneRef.current;
    if (!zoneElement) return;

    // Use trigger element if found, otherwise use zone element
    const observeElement = (triggerSelector && triggerElementRef.current)
      ? triggerElementRef.current as HTMLElement
      : zoneElement;

    const initialContent = resolveCanvasContent(canvasContentRef.current, 0);
    return registerZone(zoneId, observeElement, {
      content: initialContent,
      deactivateDelay,
    });
  }, [registerZone, zoneId, deactivateDelay, triggerSelector]);

  // Update zone config when content changes (static mode only)
  useEffect(() => {
    if (mode !== "static") return;
    updateZoneConfig(zoneId, { content: staticResolvedContent, deactivateDelay });
  }, [updateZoneConfig, zoneId, mode, staticResolvedContent, deactivateDelay]);

  // ============================================================================
  // Render: Stepped mode (with CanvasZoneProvider wrapper)
  // ============================================================================
  if (mode === "stepped") {
    return (
      <CanvasZoneProvider totalSteps={totalSteps} canvasContent={canvasContent}>
        <SteppedZoneContent
          zoneId={zoneId}
          zoneRef={zoneRef}
          type={type}
          isActive={isActive}
          className={className}
          canvasContent={canvasContent}
          deactivateDelay={deactivateDelay}
          updateZoneConfig={updateZoneConfig}
        >
          {children}
        </SteppedZoneContent>
      </CanvasZoneProvider>
    );
  }

  // ============================================================================
  // Render: Static mode (original behavior)
  // ============================================================================
  return (
    <div
      ref={zoneRef}
      id={zoneId}
      data-canvas-zone
      data-zone-type={type}
      data-zone-mode="static"
      data-zone-active={isActive}
      className={cn(
        "relative",
        className
      )}
    >
      {children}

      {/* Mobile inline canvas - shows content below zone text on small screens */}
      <div className={cn(
        "md:hidden mt-6",
        // Match scrolly stage styling for consistency
        "rounded-2xl overflow-hidden",
        "bg-secondary",
        "p-4"
      )}>
        {staticResolvedContent}
      </div>
    </div>
  );
}

export function CanvasGap({
  id,
  className,
  children,
}: CanvasGapProps): JSX.Element {
  const generatedId = useId();
  const gapId = id ?? generatedId;
  const gapRef = useRef<HTMLDivElement>(null);

  const { registerSentinel } = useCanvasLayout();

  useEffect(() => {
    const element = gapRef.current;
    if (!element) return;
    return registerSentinel(gapId, element, "gap");
  }, [gapId, registerSentinel]);

  return (
    <div
      ref={gapRef}
      data-canvas-sentinel="gap"
      className={cn("relative", className)}
    >
      {children}
    </div>
  );
}

export function CanvasEnd({ id, className }: CanvasEndProps): JSX.Element {
  const generatedId = useId();
  const endId = id ?? generatedId;
  const endRef = useRef<HTMLDivElement>(null);

  const { registerSentinel } = useCanvasLayout();

  useEffect(() => {
    const element = endRef.current;
    if (!element) return;
    return registerSentinel(endId, element, "end");
  }, [endId, registerSentinel]);

  return (
    <div
      ref={endRef}
      data-canvas-sentinel="end"
      className={cn("h-px w-full", className)}
      aria-hidden="true"
    />
  );
}
