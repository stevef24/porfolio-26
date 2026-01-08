"use client";

/**
 * CanvasZone - Scroll-triggered canvas activation
 *
 * Registers a zone with the BlogWithCanvas provider, which owns the shared
 * IntersectionObserver. The provider resolves the active zone and keeps the
 * canvas state stable across transitions.
 *
 * @example
 * ```tsx
 * <CanvasZone id="intro" type="code" canvasContent={<CodeStage steps={...} />}>
 *   <p>Explanation text that appears alongside the code...</p>
 * </CanvasZone>
 * ```
 */

import { useEffect, useRef, useId, ReactNode } from "react";
import { useCanvasLayout } from "./BlogWithCanvas";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type CanvasZoneType = "code" | "demo" | "visualization";

interface CanvasZoneProps {
  /** Unique identifier for this zone (auto-generated if not provided) */
  id?: string;
  /** Type of canvas content - affects styling and behavior */
  type?: CanvasZoneType;
  /** Content to render in the canvas sidebar when this zone is active */
  canvasContent: ReactNode;
  /** Children to render in the blog column */
  children: ReactNode;
  /** Additional class names for the zone wrapper */
  className?: string;
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
// Component
// ============================================================================

export function CanvasZone(props: CanvasZoneProps) {
  const {
    id: providedId,
    type = "code",
    canvasContent,
    children,
    className,
    deactivateDelay = 150,
  } = props;

  const generatedId = useId();
  const zoneId = providedId ?? generatedId;
  const zoneRef = useRef<HTMLDivElement>(null);
  const configRef = useRef({ content: canvasContent, deactivateDelay });

  const { registerZone, updateZoneConfig, activeZoneId } = useCanvasLayout();

  // Track whether this zone is currently active
  const isActive = activeZoneId === zoneId;

  useEffect(() => {
    configRef.current = { content: canvasContent, deactivateDelay };
  }, [canvasContent, deactivateDelay]);

  useEffect(() => {
    const element = zoneRef.current;
    if (!element) return;
    return registerZone(zoneId, element, {
      content: configRef.current.content,
      deactivateDelay: configRef.current.deactivateDelay,
    });
  }, [registerZone, zoneId]);

  useEffect(() => {
    updateZoneConfig(zoneId, { content: canvasContent, deactivateDelay });
  }, [updateZoneConfig, zoneId, canvasContent, deactivateDelay]);

  return (
    <div
      ref={zoneRef}
      id={zoneId}
      data-canvas-zone
      data-zone-type={type}
      data-zone-active={isActive}
      className={cn(
        // Base styling
        "relative",
        // Visual indicator when active (subtle left border)
        isActive && "md:border-l-2 md:border-primary/30 md:pl-4 md:-ml-4",
        className
      )}
    >
      {children}

      {/* Mobile inline canvas - shows content below zone text on small screens */}
      <div className="md:hidden mt-6 rounded-lg border border-border/50 bg-muted/30 p-4 overflow-hidden">
        {canvasContent}
      </div>
    </div>
  );
}

export function CanvasGap({ id, className, children }: CanvasGapProps) {
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

export function CanvasEnd({ id, className }: CanvasEndProps) {
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
