"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { transitionCanvasSlide } from "@/lib/motion-variants";

interface TOCItem {
  title: string;
  url: string;
  depth: number;
}

interface SectionIndicatorProps {
  items: TOCItem[];
  className?: string;
}

/**
 * Minimal sticky section indicator inspired by AI Hero.
 * Shows current section with slide animation on change.
 * Expands to show full TOC when arrow is clicked.
 * Shifts left with blog content when canvas is active.
 */
export function SectionIndicator({ items, className }: SectionIndicatorProps) {
  const [activeSectionUrl, setActiveSectionUrl] = useState<string>("");
  const [canvasActive, setCanvasActive] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Detect when sticky element becomes "stuck" using a sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is NOT intersecting (scrolled past), we're stuck
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Listen for canvas active state changes (set by BlogWithCanvas on document.documentElement)
  useEffect(() => {
    const checkCanvasState = () => {
      const isActive = document.documentElement.dataset.canvasActive === "true";
      setCanvasActive(isActive);
    };

    // Initial check
    checkCanvasState();

    // Observe changes to the data attribute
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-canvas-active") {
          checkCanvasState();
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-canvas-active"],
    });

    return () => observer.disconnect();
  }, []);

  // Find section titles (only H2s for cleaner display) — memoized to keep
  // the scroll listener stable across re-renders
  const sections = useMemo(
    () => items.filter((item) => item.depth === 2),
    [items]
  );
  const activeSectionTitle = useMemo(() => {
    if (sections.length === 0) return "";
    const matched = sections.find((section) => section.url === activeSectionUrl);
    return matched?.title ?? sections[0].title;
  }, [sections, activeSectionUrl]);

  const updateActiveSection = useCallback(() => {
    if (sections.length === 0) return;

    // Build paired section-heading objects to preserve alignment even if some headings are missing
    const sectionHeadings = sections
      .map((section) => {
        const id = section.url.replace("#", "");
        const element = document.getElementById(id);
        return element ? { section, element } : null;
      })
      .filter((item): item is { section: TOCItem; element: HTMLElement } => item !== null);

    if (sectionHeadings.length === 0) return;

    // Fixed threshold: a heading is "active" once it has scrolled to within 120px of the
    // viewport top. This is precise enough that scrolling back up immediately switches to
    // the previous section rather than holding the current one for a large scroll range.
    const threshold = 120;

    let currentUrl = sectionHeadings[0].section.url;

    for (const { section, element } of sectionHeadings) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= threshold) {
        currentUrl = section.url;
      } else {
        break;
      }
    }

    setActiveSectionUrl(currentUrl);
  }, [sections]);

  // Stable ref so the scroll listener never needs to be torn down / re-attached
  // when React re-renders from activeSection state updates
  const updateRef = useRef(updateActiveSection);
  updateRef.current = updateActiveSection;

  useEffect(() => {
    if (sections.length === 0) return;

    // Initial check
    updateRef.current();

    // Stable handler via ref — survives re-renders without re-registration
    const handleScroll = () => updateRef.current();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Don't render if no sections
  if (sections.length === 0) return null;

  const handleSectionClick = (url: string) => {
    setIsExpanded(false);
    const id = url.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Sentinel - when this scrolls out of view, the nav is "stuck" */}
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />

      <motion.nav
        className={cn(
          "sticky top-0 z-40 py-3 mb-6",
          "bg-background",
          className
        )}
        animate={{
          // Shift left with blog content when canvas is active (-25vw matches BlogWithCanvas)
          x: canvasActive ? "-25vw" : 0,
        }}
        transition={prefersReducedMotion ? { duration: 0 } : transitionCanvasSlide}
        style={{ willChange: canvasActive ? "transform" : "auto" }}
      >
        {/* Collapsed state - current section indicator */}
        <div className="flex items-center gap-2 relative z-10">
          <span className="text-foreground/50 text-swiss-caption shrink-0">
            On this page
          </span>
          <span className="text-foreground/30">›</span>
          <motion.span
            key={activeSectionUrl || activeSectionTitle}
            initial={prefersReducedMotion ? false : { y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="text-swiss-caption text-foreground truncate flex-1"
          >
            {activeSectionTitle}
          </motion.span>

          {/* Expand/collapse button - only show when stuck */}
          {isStuck && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-foreground/40 hover:text-foreground/70 transition-colors rounded"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse table of contents" : "Expand table of contents"}
            >
              <HugeiconsIcon
                icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
                size={16}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {/* Fade gradient when stuck - covers content below */}
        {isStuck && (
          <div
            className="absolute left-0 right-0 top-full h-8 pointer-events-none bg-gradient-to-b from-background to-transparent"
            aria-hidden="true"
          />
        )}

        {/* Expanded TOC dropdown - overlays content */}
        <AnimatePresence>
          {isExpanded && isStuck && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full z-50 bg-background pt-2 pb-4"
            >
              {/* Fade at bottom of dropdown */}
              <div
                className="absolute left-0 right-0 bottom-0 h-8 pointer-events-none bg-gradient-to-b from-transparent to-background translate-y-full"
                aria-hidden="true"
              />
              <ul className="space-y-0.5">
                {sections.map((section) => (
                  <li key={section.url}>
                    <button
                      type="button"
                      onClick={() => handleSectionClick(section.url)}
                      className={cn(
                        "text-swiss-caption w-full text-left py-1.5 transition-colors",
                        section.url === activeSectionUrl
                          ? "text-foreground"
                          : "text-foreground/50 hover:text-foreground/70"
                      )}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
