import * as React from "react";
import { cn } from "@/lib/utils";

interface V2PreviewCalloutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * V2PreviewCallout - Minimal callout for SDK V2 preview content
 *
 * Design: Clean left-border accent with subtle badge.
 * Matches the Swiss minimalist aesthetic of the app.
 */
export function V2PreviewCallout({
  title,
  children,
  className,
}: V2PreviewCalloutProps) {
  return (
    <aside className={cn("v2-preview-callout", className)}>
      {/* Header with badge */}
      <div className="v2-preview-header">
        <span className="v2-preview-badge">Preview</span>
      </div>

      {/* Title */}
      <h4 className="v2-preview-title">{title}</h4>

      {/* Content */}
      <div className="v2-preview-body">{children}</div>
    </aside>
  );
}
