"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  MotionConfig,
} from "motion/react";
import { cn } from "@/lib/utils";

interface TOCItem {
  title: string;
  url: string;
  depth: number;
}

interface MobileFloatingTOCProps {
  items: TOCItem[];
  className?: string;
}

/**
 * MobileFloatingTOC - Cinematic pill with vertical slide transitions
 * Inspired by Victor Williams' TOC Pill design
 * Features:
 * - Vertical slide animation when section changes
 * - Dual indicators: filled circle (left) + progress ring (right)
 * - Smooth morphing expansion to full TOC panel
 */
export function MobileFloatingTOC({
  items,
  className,
}: MobileFloatingTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [prevActiveId, setPrevActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Get active index for display
  const activeIndex = useMemo(() => {
    return items.findIndex((item) => item.url.replace("#", "") === activeId);
  }, [items, activeId]);

  const activeItem = useMemo(() => {
    return items.find((item) => item.url.replace("#", "") === activeId);
  }, [items, activeId]);

  // Track active heading via Intersection Observer
  useEffect(() => {
    if (!items?.length) return;

    const headingIds = items.map((item) => item.url.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find((entry) => entry.isIntersecting);
        if (intersecting) {
          const newId = intersecting.target.id;
          if (newId !== activeId) {
            setPrevActiveId(activeId);
            setActiveId(newId);
          }
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
  }, [items, activeId]);

  // Track scroll progress and direction (for section name animation)
  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));

      // Determine scroll direction for section name slide animation
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", handleClick);
    };
  }, [isExpanded]);

  // Handle smooth scroll to heading
  const handleClick = useCallback(
    (url: string) => {
      const id = url.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setIsExpanded(false);
        setTimeout(() => {
          element.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }, 200);
      }
    },
    [prefersReducedMotion]
  );

  if (!items?.length) return null;

  // Progress ring uses pathLength for smooth animation

  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 30 };

  const slideVariants = {
    enter: (direction: "up" | "down") => ({
      y: direction === "down" ? 20 : -20,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: "up" | "down") => ({
      y: direction === "down" ? -20 : 20,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  // Dynamic Island inspired spring configs
  const containerSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 35, bounce: 0.15 };

  const contentSpring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.8 };

  // Simplified crossfade morph variants (no scale to prevent bloating)
  const morphVariants = {
    initial: {
      opacity: 0,
      filter: "blur(4px)",
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.2,
        ease: [0.32, 0.72, 0, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(4px)",
      transition: {
        duration: 0.15,
        ease: [0.32, 0.72, 0, 1] as const,
      },
    },
  };

  return (
    <MotionConfig transition={springConfig}>
      {/* Blur overlay when expanded - click to close */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExpanded(false)}
            aria-label="Close table of contents"
          />
        )}
      </AnimatePresence>

      {/* Floating container - always visible */}
      <div
        className={cn(
          "fixed bottom-6 left-0 right-0 z-50 lg:hidden flex justify-center pointer-events-none",
          className
        )}
      >
        {/* Dynamic Island container - layout handles FLIP, borderRadius in style for smooth animation */}
        <motion.div
          ref={panelRef}
          layout
          className="pointer-events-auto bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl shadow-black/50 overflow-hidden"
          style={{
            // Put dimensions AND borderRadius in style - Motion handles smooth interpolation
            width: isExpanded ? "calc(100vw - 48px)" : "auto",
            maxWidth: isExpanded ? "24rem" : "none",
            borderRadius: isExpanded ? 20 : 9999,
          }}
          transition={{
            layout: {
              type: "spring",
              stiffness: 400,
              damping: 30,
            },
          }}
          onClick={!isExpanded ? () => setIsExpanded(true) : undefined}
          role={!isExpanded ? "button" : undefined}
          aria-label={!isExpanded ? "Open table of contents" : undefined}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!isExpanded ? (
              // Collapsed pill content - layout for counter-transform
              <motion.div
                key="pill-content"
                layout
                className="flex items-center gap-3 pl-2 pr-3 py-2 cursor-pointer"
                variants={morphVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* Left indicator - neutral circle (theme-aware) */}
                <motion.div
                  layoutId="toc-left-indicator"
                  className="relative w-7 h-7 flex-shrink-0 rounded-full bg-neutral-700 dark:bg-neutral-600"
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white">
                    {activeIndex >= 0 ? activeIndex + 1 : 1}
                  </span>
                </motion.div>

                {/* Center - Section name with vertical slide animation */}
                <div className="relative h-5 overflow-hidden min-w-[100px] max-w-[160px]">
                  <AnimatePresence
                    mode="popLayout"
                    custom={scrollDirection}
                    initial={false}
                  >
                    <motion.span
                      key={activeId || "default"}
                      custom={scrollDirection}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={contentSpring}
                      className="absolute inset-0 flex items-center text-sm font-medium text-neutral-100 truncate"
                    >
                      {activeItem?.title || items[0]?.title || "Contents"}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Right indicator - progress ring */}
                <motion.div
                  layoutId="toc-right-indicator"
                  className="relative w-6 h-6 flex-shrink-0"
                >
                  <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-neutral-700"
                    />
                    <motion.circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-neutral-100"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: scrollProgress }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 100, damping: 20 }
                      }
                    />
                  </svg>
                </motion.div>
              </motion.div>
            ) : (
              // Expanded panel content - layout for counter-transform
              <motion.div
                key="panel-content"
                layout
                variants={morphVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* TOC items list */}
                <nav className="px-3 py-3 max-h-[50vh] overflow-y-auto">
                  <motion.ul
                    className="space-y-0.5"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: prefersReducedMotion ? 0 : 0.04,
                          delayChildren: 0.1,
                        },
                      },
                    }}
                  >
                    {items.map((item) => {
                      const isActive = activeId === item.url.replace("#", "");
                      const isNested = item.depth > 2;

                      return (
                        <motion.li
                          key={item.url}
                          variants={{
                            hidden: prefersReducedMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: 8, filter: "blur(4px)" },
                            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                          }}
                        >
                          <button
                            onClick={() => handleClick(item.url)}
                            className={cn(
                              "w-full text-left py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 text-sm",
                              isActive
                                ? "bg-neutral-800 text-neutral-100 font-medium"
                                : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200",
                              isNested && "pl-8"
                            )}
                            aria-label={`Jump to ${item.title}`}
                            aria-current={isActive ? "location" : undefined}
                          >
                            {item.title}
                          </button>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </nav>

                {/* Bottom bar with title and indicators */}
                <div className="flex items-center justify-between px-3 py-2.5 border-t border-neutral-800">
                  <div className="flex items-center gap-3">
                    {/* Left indicator - neutral circle (theme-aware) */}
                    <motion.div
                      layoutId="toc-left-indicator"
                      className="relative w-7 h-7 flex-shrink-0 rounded-full bg-neutral-700 dark:bg-neutral-600"
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white">
                        {activeIndex >= 0 ? activeIndex + 1 : 1}
                      </span>
                    </motion.div>

                    {/* Title */}
                    <span className="text-sm font-medium text-neutral-300">
                      Table of Contents
                    </span>
                  </div>

                  {/* Right indicator - progress ring */}
                  <motion.div
                    layoutId="toc-right-indicator"
                    className="relative w-6 h-6 flex-shrink-0"
                  >
                    <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-neutral-700"
                      />
                      <motion.circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-neutral-100"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: scrollProgress }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 100, damping: 20 }
                        }
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

export default MobileFloatingTOC;
