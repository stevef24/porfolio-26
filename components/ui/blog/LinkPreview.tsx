"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
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
  children: React.ReactNode;
  className?: string;
}

/**
 * LinkPreview - Shows a preview card when hovering over links
 * Fetches Open Graph metadata for rich previews
 * Uses Portal to avoid hydration errors when inside <p> tags
 */
export function LinkPreview({ href, children, className }: LinkPreviewProps) {
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

    const fetchMetadata = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/link-preview?url=${encodeURIComponent(href)}`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setMetadata(data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(fetchMetadata, 300);
    return () => clearTimeout(timeout);
  }, [isHovered, href, metadata, isLoading, error, isExternal]);

  // Don't show preview for internal links or hash links
  if (!hasMounted || !isExternal || href.startsWith("#")) {
    return (
      <a href={href} className={className} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
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
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: position === "top" ? 8 : -8 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === "top" ? 8 : -8 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 25 }
          }
        >
          <div className="overflow-hidden rounded-none border border-border bg-card/95 backdrop-blur-sm shadow-lg">
            {isLoading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-3/4 rounded-none bg-muted" />
                  <div className="h-3 w-full rounded-none bg-muted" />
                  <div className="h-3 w-2/3 rounded-none bg-muted" />
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
                  <div className="relative h-36 w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={metadata.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    {metadata.favicon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={metadata.favicon}
                        alt=""
                        className="h-4 w-4 rounded-none"
                        loading="lazy"
                      />
                    )}
                    <span className="text-xs text-muted-foreground truncate">
                      {metadata.siteName || new URL(href).hostname}
                    </span>
                  </div>
                  {metadata.title && (
                    <h4 className="text-sm font-medium text-foreground leading-tight line-clamp-2">
                      {metadata.title}
                    </h4>
                  )}
                  {metadata.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
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
        className={cn("inline", className)}
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
