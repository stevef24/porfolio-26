"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Header } from "@/components/layout/Header";
import { CourseSidebarDesktop, type Lesson } from "@/components/courses/CourseSidebarDesktop";
import { CourseSidebarMobile } from "@/components/courses/CourseSidebarMobile";
import { MobileSidebarTrigger } from "@/components/courses/MobileSidebarTrigger";
import { LessonTOC, type TOCItem } from "@/components/courses/LessonTOC";
import { MobileTOCFAB } from "@/components/courses/MobileTOCFAB";
import { MobileTOCSheet } from "@/components/courses/MobileTOCSheet";
import { SidebarToggle } from "@/components/courses/SidebarToggle";
import { CommandPalette } from "@/components/courses/CommandPalette";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion-variants";

// ==========================================
// TYPES
// ==========================================

interface CourseShellProps {
  courseSlug: string;
  courseName: string;
  lessons: Lesson[];
  tocItems?: TOCItem[];
  children: ReactNode;
  className?: string;
}

// ==========================================
// FAR-RIGHT TOC COMPONENT
// ==========================================

/**
 * Fixed-position TOC at the far right of viewport.
 * Positioned adjacent to scrollbar like animations.dev.
 * Hidden on tablet/mobile (< xl breakpoint).
 */
function FarRightTOC({ items }: { items: TOCItem[] }): JSX.Element | null {
  // Filter to H2 and H3 only
  const headings = items.filter((item) => item.depth === 2 || item.depth === 3);

  // Don't render if fewer than 3 headings
  if (headings.length < 3) return null;

  return (
    <div
      className={cn(
        // Fixed position at viewport right edge, aligned with content top
        "fixed right-8 top-8",
        // Scroll containment - prevent overflow at bottom
        "max-h-[calc(100vh-4rem)] overflow-y-auto",
        // Only show on xl+ screens (sidebar + content + toc all visible)
        "hidden xl:block",
        // Width and z-index
        "w-[var(--course-toc-width)]",
        "z-30"
      )}
    >
      <LessonTOC items={items} />
    </div>
  );
}

// ==========================================
// MOBILE HEADER BAR WITH SCROLL-AWARE SECTION
// ==========================================

function MobileHeader({
  courseName,
  tocItems,
  onMenuClick,
}: {
  courseName: string;
  tocItems?: TOCItem[];
  onMenuClick: () => void;
}): JSX.Element {
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  useEffect(() => {
    if (!tocItems || tocItems.length === 0) return;

    const headings = tocItems
      .filter((item) => item.depth === 2)
      .map((item) => ({
        id: item.url.replace("#", ""),
        title: item.title,
      }));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const heading = headings.find((h) => h.id === visibleEntry.target.id);
          if (heading) {
            setCurrentSection(heading.title);
          }
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    // Observe all headings
    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  return (
    <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <MobileSidebarTrigger onClick={onMenuClick} />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium truncate block">
            {currentSection || courseName}
          </span>
          {currentSection && (
            <span className="text-xs text-muted-foreground truncate block">
              {courseName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

/**
 * CourseShell - Dedicated course layout with far-right TOC
 *
 * Layout structure:
 * - Desktop XL+: [240px Sidebar] [Centered Content] [Fixed-right TOC at viewport edge]
 * - Desktop LG: [240px Sidebar] [Centered Content] (no TOC - not enough space)
 * - Tablet: [240px Sidebar] [Full-width Content]
 * - Mobile: [Full-width Content] + Sheet Sidebar
 *
 * Key differences from typical layouts:
 * - TOC is fixed-positioned at viewport right edge (like animations.dev)
 * - Content stays centered regardless of TOC visibility
 * - Sheet sidebar for mobile
 */
export function CourseShell({
  courseSlug,
  courseName,
  lessons,
  tocItems,
  children,
  className,
}: CourseShellProps): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTOCOpen, setMobileTOCOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [canvasActive, setCanvasActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Check if TOC should be shown (3+ headings)
  const showTOC = tocItems && tocItems.filter((item) => item.depth === 2 || item.depth === 3).length >= 3;

  useEffect(() => {
    const syncCanvasState = () => {
      setCanvasActive(document.documentElement.dataset.canvasActive === "true");
    };

    syncCanvasState();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-canvas-active") {
          syncCanvasState();
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

  useEffect(() => {
    if (canvasActive) {
      setMobileTOCOpen(false);
    }
  }, [canvasActive]);

  const showTocRail = Boolean(showTOC && tocItems && !canvasActive);

  return (
    <div className="min-h-screen bg-background" data-course-canvas-active={canvasActive}>
      {/* Command palette - Cmd+K search */}
      <CommandPalette courseSlug={courseSlug} lessons={lessons} />

      {/* Global header */}
      <Header />

      {/* Mobile header with menu trigger */}
      <MobileHeader
        courseName={courseName}
        tocItems={tocItems}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      {/* Mobile sidebar sheet */}
      <CourseSidebarMobile
        courseSlug={courseSlug}
        courseName={courseName}
        lessons={lessons}
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
      />

      {/* Far-right fixed TOC (XL+ screens only) */}
      {showTocRail && tocItems && <FarRightTOC items={tocItems} />}

      {/* Mobile TOC FAB + Sheet (< XL screens only) */}
      {showTocRail && tocItems && (
        <>
          <MobileTOCFAB onClick={() => setMobileTOCOpen(true)} />
          <MobileTOCSheet
            open={mobileTOCOpen}
            onOpenChange={setMobileTOCOpen}
            items={tocItems}
          />
        </>
      )}

      {/* Floating sidebar toggle - visible when sidebar is collapsed (md+ only) */}
      <AnimatePresence>
        {sidebarCollapsed && (
          <motion.div
            className="hidden md:block fixed left-4 top-4 z-50"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={springSnappy}
          >
            <SidebarToggle
              isCollapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - fixed position, overlays content */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            className="hidden md:block fixed left-0 top-0 z-40"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -240 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -240 }}
            transition={springSnappy}
          >
            <CourseSidebarDesktop
              courseSlug={courseSlug}
              lessons={lessons}
              onCollapse={() => setSidebarCollapsed(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area - always centered in viewport */}
      <main
        className={cn(
          "w-full min-w-0",
          // Bottom padding for floating navbar
          "pb-16",
          className
        )}
      >
        {/* Content container - consistent with SiteShell padding */}
        <div
          className={cn(
            "mx-auto px-4 lg:px-6",
            // Max width to keep content readable
            "max-w-[var(--course-content-width)]"
          )}
        >
          {/* Main prose content */}
          <div className="min-w-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseShell;
