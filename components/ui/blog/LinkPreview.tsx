"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
}

interface LinkPreviewProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * LinkPreview - Shows a preview card when hovering over links
 * Fetches Open Graph metadata for rich previews
 * Uses Portal to avoid hydration errors when inside <p> tags
 */
export function LinkPreview({
  href,
  children,
  className,
}: LinkPreviewProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const [isExternal, setIsExternal] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isHttpLink = href.startsWith("http");
  const hoverOffset = position === "top" ? 8 : -8;

  // Check if it's an external link (client-side only)
  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined") {
      const external = href.startsWith("http") && !href.includes(window.location.hostname);
      setIsExternal(external);
    }
  }, [href]);

  // Calculate preview position based on available space
  useEffect(() => {
    if (isHovered && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const showAbove = spaceBelow < 250 && spaceAbove > spaceBelow;
      setPosition(showAbove ? "top" : "bottom");

      // Calculate fixed position for portal (relative to viewport)
      setPopoverPosition({
        top: showAbove ? rect.top - 8 : rect.bottom + 8,
        left: Math.min(Math.max(rect.left + rect.width / 2, 160), window.innerWidth - 160),
      });
    }
  }, [isHovered]);

  // Fetch metadata on hover
  useEffect(() => {
    if (!isHovered || metadata || isLoading || error || !isExternal) return;

    function fetchMetadata(): void {
      setIsLoading(true);

      void fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch");
          }
          return response.json();
        })
        .then((data) => {
          setMetadata(data);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    const timeout = setTimeout(fetchMetadata, 300);
    return () => clearTimeout(timeout);
  }, [isHovered, href, metadata, isLoading, error, isExternal]);

  // Don't show preview for internal links or hash links
  if (!hasMounted || !isExternal || href.startsWith("#")) {
    return (
      <a
        href={href}
        className={cn(
          "underline underline-offset-[3px] decoration-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
          className
        )}
        target={isHttpLink ? "_blank" : undefined}
        rel={isHttpLink ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  // Preview card content (rendered via portal)
  const previewContent = (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          className="fixed z-50 w-72 pointer-events-none"
          style={{
            top: position === "bottom" ? popoverPosition.top : "auto",
            bottom: position === "top" ? `calc(100vh - ${popoverPosition.top + 16}px)` : "auto",
            left: popoverPosition.left,
            transform: "translateX(-50%)",
          }}
          initial={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: hoverOffset }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: hoverOffset }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 25 }
          }
        >
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl shadow-black/10 dark:shadow-black/30">
            {isLoading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-2/3 rounded bg-muted" />
                </div>
              </div>
            ) : error ? (
              <div className="p-4">
                <span className="text-sm text-muted-foreground">
                  {new URL(href).hostname}
                </span>
              </div>
            ) : metadata ? (
              <>
                {metadata.image && (
                  <div className="relative h-32 w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={metadata.image}
                      alt=""
                      width={640}
                      height={320}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center gap-2">
                    {metadata.favicon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={metadata.favicon}
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4 rounded"
                        loading="lazy"
                      />
                    )}
                    <span className="text-swiss-meta truncate">
                      {metadata.siteName || new URL(href).hostname}
                    </span>
                  </div>
                  {metadata.title && (
                    <h4 className="text-swiss-caption font-medium text-foreground leading-snug line-clamp-2">
                      {metadata.title}
                    </h4>
                  )}
                  {metadata.description && (
                    <p className="text-swiss-caption text-foreground/50 leading-relaxed line-clamp-2">
                      {metadata.description}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="p-4">
                <span className="text-sm text-muted-foreground">
                  {new URL(href).hostname}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <a
        ref={triggerRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline underline underline-offset-[3px] decoration-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        {children}
      </a>
      {hasMounted && createPortal(previewContent, document.body)}
    </>
  );
}

export default LinkPreview;
