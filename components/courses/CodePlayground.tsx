"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { CodePlaygroundProps } from "@/components/courses/CodePlaygroundClient";

const LazyCodePlayground = React.lazy(
  () => import("@/components/courses/CodePlaygroundClient")
);

export default function CodePlayground({
  className,
  ...props
}: CodePlaygroundProps): JSX.Element {
  return (
    <React.Suspense
      fallback={
        <div
          className={cn(
            "border border-border bg-background p-6 text-base text-muted-foreground min-h-[360px]",
            className
          )}
          aria-busy="true"
        >
          Loading playground...
        </div>
      }
    >
      <LazyCodePlayground {...props} className={className} />
    </React.Suspense>
  );
}
