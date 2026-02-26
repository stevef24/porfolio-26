"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { springSnappy, springSmooth } from "@/lib/motion-variants";
import { useCourseProgress } from "@/hooks/useProgress";
import type { Lesson } from "@/components/courses/CourseSidebarDesktop";

// ==========================================
// TYPES
// ==========================================

interface CommandPaletteProps {
  courseSlug: string;
  lessons: Lesson[];
}

interface GroupedResult {
  module: string;
  lessons: Lesson[];
}

// ==========================================
// FUZZY MATCH
// ==========================================

function fuzzyMatch(query: string, text: string): boolean {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  // Check if all query characters appear in order
  let qi = 0;
  for (let ti = 0; ti < lowerText.length && qi < lowerQuery.length; ti++) {
    if (lowerText[ti] === lowerQuery[qi]) {
      qi++;
    }
  }
  return qi === lowerQuery.length;
}

function fuzzyScore(query: string, text: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  // Exact substring match gets highest score
  if (lowerText.includes(lowerQuery)) return 3;
  // Starts with query
  if (lowerText.startsWith(lowerQuery)) return 4;
  // Word boundary match
  const words = lowerText.split(/\s+/);
  if (words.some((w) => w.startsWith(lowerQuery))) return 2;
  // Fuzzy match
  if (fuzzyMatch(query, text)) return 1;
  return 0;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function CommandPalette({
  courseSlug,
  lessons,
}: CommandPaletteProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { isLessonCompleted } = useCourseProgress(courseSlug);

  // Filter and group lessons
  const filteredGroups = useMemo((): GroupedResult[] => {
    const filtered = query.trim()
      ? lessons
          .map((lesson) => ({
            lesson,
            score: Math.max(
              fuzzyScore(query, lesson.title),
              fuzzyScore(query, lesson.module)
            ),
          }))
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score)
          .map(({ lesson }) => lesson)
      : lessons;

    // Group by module
    const groups: Record<string, Lesson[]> = {};
    filtered.forEach((lesson) => {
      const mod = lesson.module || "Lessons";
      if (!groups[mod]) groups[mod] = [];
      groups[mod].push(lesson);
    });

    return Object.entries(groups).map(([module, lessons]) => ({
      module,
      lessons: lessons.sort((a, b) => a.order - b.order),
    }));
  }, [query, lessons]);

  // Flat list for index-based navigation
  const flatResults = useMemo(
    () => filteredGroups.flatMap((g) => g.lessons),
    [filteredGroups]
  );

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Global keyboard shortcut
  useEffect(() => {
    function handleGlobalKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      // Delay focus to allow animation
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // Navigate to selected lesson
  const navigateTo = useCallback(
    (lesson: Lesson) => {
      setOpen(false);
      router.push(lesson.url);
    },
    [router]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < flatResults.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : flatResults.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (flatResults[selectedIndex]) {
            navigateTo(flatResults[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
      }
    },
    [flatResults, selectedIndex, navigateTo]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={springSnappy}
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            className={cn(
              "fixed z-50 left-1/2 top-[20vh]",
              "w-[min(560px,calc(100vw-2rem))]",
              "-translate-x-1/2"
            )}
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.96, y: -8 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: -8 }
            }
            transition={springSnappy}
            role="dialog"
            aria-modal="true"
            aria-label="Search lessons"
          >
            <div className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={16}
                  className="text-foreground/40 shrink-0"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Jump to lesson..."
                  className={cn(
                    "flex-1 bg-transparent text-sm text-foreground",
                    "placeholder:text-foreground/40",
                    "outline-none"
                  )}
                  aria-label="Search lessons"
                  autoComplete="off"
                  spellCheck={false}
                />
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground/40">
                  Esc
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[min(400px,50vh)] overflow-y-auto py-2"
                role="listbox"
              >
                {flatResults.length === 0 ? (
                  <div className="px-4 py-8 text-center text-swiss-caption text-foreground/40">
                    No lessons found
                  </div>
                ) : (
                  filteredGroups.map((group) => (
                    <div key={group.module}>
                      {/* Module header */}
                      <div className="px-4 py-1.5">
                        <span className="text-swiss-label text-foreground/40">
                          {group.module}
                        </span>
                      </div>

                      {/* Lessons in module */}
                      {group.lessons.map((lesson) => {
                        const globalIndex = flatResults.indexOf(lesson);
                        const isSelected = globalIndex === selectedIndex;
                        const completed = isLessonCompleted(lesson.slug);

                        return (
                          <button
                            key={lesson.slug}
                            data-index={globalIndex}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            className={cn(
                              "relative w-full flex items-center gap-3 px-4 py-2 text-left",
                              "text-sm transition-colors",
                              isSelected
                                ? "text-foreground"
                                : "text-foreground/60 hover:text-foreground"
                            )}
                            onClick={() => navigateTo(lesson)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                          >
                            {/* Selected highlight */}
                            {isSelected && (
                              <motion.div
                                layoutId="command-active"
                                className="absolute inset-x-2 inset-y-0 bg-[var(--sf-bg-muted)] rounded-[4px]"
                                transition={
                                  prefersReducedMotion
                                    ? { duration: 0 }
                                    : springSmooth
                                }
                              />
                            )}

                            {/* Lesson number */}
                            <span className="relative z-10 w-6 shrink-0 text-center font-mono text-xs text-foreground/40">
                              {String(lesson.order).padStart(2, "0")}
                            </span>

                            {/* Title */}
                            <span className="relative z-10 flex-1 truncate">
                              {lesson.title}
                            </span>

                            {/* Completion indicator */}
                            {completed && (
                              <span className="relative z-10 w-2 h-2 rounded-full bg-foreground/30 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer with navigation hints */}
              <div className="flex items-center gap-4 border-t border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground/30">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted rounded">
                    &uarr;&darr;
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted rounded">&crarr;</kbd>
                  open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted rounded">esc</kbd>
                  close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
