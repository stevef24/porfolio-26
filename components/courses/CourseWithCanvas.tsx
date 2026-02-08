"use client";

import type { ReactNode } from "react";
import { BlogWithCanvas } from "@/components/blog/BlogWithCanvas";

interface CourseWithCanvasProps {
  children: ReactNode;
  className?: string;
  activationRootMargin?: string;
  minIntersectionRatio?: number;
  deactivateDelay?: number;
}

/**
 * CourseWithCanvas adapts BlogWithCanvas to the course shell layout.
 * It keeps the canvas interaction while reducing lateral shift so
 * fixed course navigation remains usable.
 */
export function CourseWithCanvas({
  children,
  className,
  activationRootMargin = "-32% 0px -32% 0px",
  minIntersectionRatio = 0.01,
  deactivateDelay = 100,
}: CourseWithCanvasProps): JSX.Element {
  return (
    <BlogWithCanvas
      className={className}
      activationRootMargin={activationRootMargin}
      minIntersectionRatio={minIntersectionRatio}
      deactivateDelay={deactivateDelay}
      fullBleed={false}
      activeShiftX="-14vw"
      canvasWidth="min(42vw, 700px)"
      contentMaxWidthClassName="max-w-none"
    >
      {children}
    </BlogWithCanvas>
  );
}

export default CourseWithCanvas;
