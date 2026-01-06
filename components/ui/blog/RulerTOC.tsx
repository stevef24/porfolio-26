"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface TOCItem {
  title: string;
  url: string;
  depth: number;
}

interface RulerTOCProps {
  items: TOCItem[];
  className?: string;
}

/**
 * RulerTOC - iOS wheel-picker style table of contents
 * Fixed position on left side of screen, vertically centered
 * Default: shows horizontal bars
 * Hover: expands to show section names in wheel picker style
 */
export function RulerTOC({ items, className }: RulerTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Number of visible items (above + active + below)
  const VISIBLE_ITEMS = 5;

  // Track active heading via Intersection Observer
  useEffect(() => {
    if (!items?.length) return;

    const headingIds = items.map((item) => item.url.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find((entry) => entry.isIntersecting);
        if (intersecting) {
          setActiveId(intersecting.target.id);
        }
      },
      {
        rootMargin: "-20% 0% -60% 0%",
        threshold: 0,
      }
    );

    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  // Track overall scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle smooth scroll to heading
  const handleClick = useCallback(
    (url: string) => {
      const id = url.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [prefersReducedMotion]
  );

  if (!items?.length) return null;

  // Calculate which item index is active
  const activeIndex = items.findIndex(
    (item) => item.url.replace("#", "") === activeId
  );

  // Calculate visible items for wheel picker (centered on active)
  const getVisibleItems = () => {
    const half = Math.floor(VISIBLE_ITEMS / 2);
    const start = Math.max(0, activeIndex - half);
    const end = Math.min(items.length, start + VISIBLE_ITEMS);
    const adjustedStart = Math.max(0, end - VISIBLE_ITEMS);

    return items.slice(adjustedStart, end).map((item, idx) => ({
      ...item,
      originalIndex: adjustedStart + idx,
      distanceFromActive: adjustedStart + idx - activeIndex,
    }));
  };

  const visibleItems = getVisibleItems();

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed left-6 top-1/2 -translate-y-1/2 z-40",
        "hidden lg:block",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <nav aria-label="Article progress">
        <AnimatePresence mode="wait">
          {!isHovered ? (
            /* Collapsed state - horizontal bars */
            <motion.div
              key="bars"
              className="flex flex-col items-start gap-3"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: "easeOut" }
              }
            >
              {items.map((item, index) => {
                const isActive = activeId === item.url.replace("#", "");
                const isPast = activeIndex > index;
                const isNested = item.depth > 2;

                return (
                  <button
                    key={item.url}
                    onClick={() => handleClick(item.url)}
                    className={cn(
                      "cursor-pointer transition-all duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm",
                      isNested && "ml-2"
                    )}
                    aria-label={`Jump to ${item.title}`}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <motion.div
                      className={cn(
                        "rounded-full transition-colors duration-300",
                        isActive
                          ? "bg-foreground"
                          : isPast
                          ? "bg-foreground/50"
                          : "bg-foreground/20"
                      )}
                      initial={false}
                      animate={{
                        width: isActive ? 28 : isNested ? 14 : 20,
                        height: isActive ? 3 : 2,
                      }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 30 }
                      }
                    />
                  </button>
                );
              })}

              {/* Scroll progress indicator */}
              <div className="mt-4 w-7 h-px bg-border/30 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-primary/60 rounded-full"
                  style={{ width: `${scrollProgress * 100}%` }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 100, damping: 20 }
                  }
                />
              </div>
            </motion.div>
          ) : (
            /* Expanded state - wheel picker with section names */
            <motion.div
              key="wheel"
              className={cn(
                "flex flex-col items-start",
                "bg-background/80 backdrop-blur-md",
                "border border-border/30 rounded-lg",
                "py-3 px-4",
                "shadow-lg shadow-black/5"
              )}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, x: -12, filter: "blur(8px)" }
              }
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -12, filter: "blur(8px)" }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: "easeOut" }
              }
            >
              {/* Wheel picker items */}
              <div className="flex flex-col gap-0.5">
                {visibleItems.map((item) => {
                  const isActive = item.originalIndex === activeIndex;
                  const distance = Math.abs(item.distanceFromActive);

                  // Calculate opacity based on distance from active
                  const opacity = isActive ? 1 : Math.max(0.2, 1 - distance * 0.3);
                  // Calculate scale based on distance
                  const scale = isActive ? 1 : Math.max(0.85, 1 - distance * 0.05);

                  return (
                    <motion.button
                      key={item.url}
                      onClick={() => handleClick(item.url)}
                      className={cn(
                        "text-left py-1.5 px-2 -mx-2 rounded-md cursor-pointer",
                        "transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground/80 hover:bg-foreground/5"
                      )}
                      style={{ opacity }}
                      initial={false}
                      animate={{ scale }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 30 }
                      }
                      aria-label={`Jump to ${item.title}`}
                      aria-current={isActive ? "location" : undefined}
                    >
                      <span className="text-sm whitespace-nowrap max-w-[200px] truncate block">
                        {item.title}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Section counter */}
              <div className="mt-3 pt-3 border-t border-border/30 w-full">
                <span className="text-xs text-muted-foreground">
                  {activeIndex + 1} / {items.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}

export default RulerTOC;
