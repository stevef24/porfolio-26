# Phase 2: Course Sidebar Enhancement

## Overview

Transform the course navigation sidebar to match animations.dev's polished module-based navigation system. This includes adding a view toggle (segmented control), module numbering, and enhanced lesson item styling with checkmarks on the right side.

---

## Current Implementation Analysis

### File Location
`components/courses/CourseLayout.tsx`

### Current Design
- **Module Headers**: Basic `SidebarGroupLabel` text
- **Lesson Items**: Icons on left (play, checkmark, number)
- **Status Indicators**: Play icon for current, checkmark for completed, number for upcoming
- **View Filtering**: None
- **Module Numbering**: None

### Current Code Structure
```tsx
function CourseSidebar({ courseSlug, lessons }) {
  const modules = groupLessonsByModule(lessons);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href={`/courses/${courseSlug}`}>
          <Home01Icon /> Course Overview
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {modules.map((module) => (
          <SidebarGroup key={module.name}>
            <SidebarGroupLabel>{module.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              {module.lessons.map((lesson) => (
                <SidebarMenuItem>
                  {/* Icon on LEFT */}
                  <PlayCircle02Icon /> or <CheckmarkCircle02Icon /> or {index}
                  <span>{lesson.title}</span>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
```

### Issues with Current Design
1. No way to filter content (Fundamentals vs Walkthroughs)
2. Module headers lack hierarchy (no "Module 01" numbering)
3. Icons on left feel cluttered
4. No entrance animations
5. Active state could be more refined

---

## Target Design (animations.dev Style)

### Visual Reference
Based on animations.dev analysis:
- **View Toggle**: Segmented control at sidebar top (Fundamentals | Walkthroughs)
- **Module Headers**: Two-line format with "Module 01" label + title
- **Lesson Items**: Clean text with checkmark on RIGHT side (completed only)
- **Active State**: Subtle background highlight
- **Staggered Animations**: Items fade in on sidebar open

### Key Visual Elements
1. **Segmented Control**: Pill-shaped toggle with active state background
2. **Module Label**: Small muted text "Module 01", "Module 02", etc.
3. **Module Title**: Medium weight text below label
4. **Lesson Items**: Just text + optional right-side checkmark
5. **Active Item**: Background highlight + foreground text

---

## Implementation Specification

### New Component: SegmentedControl

```tsx
// components/ui/segmented-control.tsx
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "flex rounded-full bg-muted p-1 relative",
        className
      )}
      role="radiogroup"
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors z-10",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segmented-control-indicator"
                className="absolute inset-0 bg-background rounded-full shadow-sm"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

### Updated Lesson Interface

```tsx
export interface Lesson {
  slug: string;
  title: string;
  module: string;
  order: number;
  url: string;
  access?: "public" | "paid";
  category?: "fundamentals" | "walkthroughs"; // NEW
  isCompleted?: boolean; // NEW - from progress tracking
}

interface ModuleGroup {
  name: string;
  index: number; // NEW - for "Module 01" numbering
  lessons: Lesson[];
}
```

### Full CourseLayout Implementation

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { StickyTOCSidebar } from "@/components/ui/blog/StickyTOCSidebar";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CheckmarkCircle02Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SiteShell from "@/components/layout/SiteShell";

export interface Lesson {
  slug: string;
  title: string;
  module: string;
  order: number;
  url: string;
  access?: "public" | "paid";
  category?: "fundamentals" | "walkthroughs";
  isCompleted?: boolean;
}

interface ModuleGroup {
  name: string;
  index: number;
  lessons: Lesson[];
}

interface TOCItem {
  title: string;
  url: string;
  depth: number;
}

interface CourseLayoutProps {
  courseSlug: string;
  lessons: Lesson[];
  tocItems?: TOCItem[];
  children: React.ReactNode;
  className?: string;
}

const VIEW_OPTIONS = [
  { value: "fundamentals", label: "Fundamentals" },
  { value: "walkthroughs", label: "Walkthroughs" },
];

function groupLessonsByModule(lessons: Lesson[]): ModuleGroup[] {
  const groups: Record<string, Lesson[]> = {};

  lessons.forEach((lesson) => {
    const moduleName = lesson.module || "Lessons";
    if (!groups[moduleName]) {
      groups[moduleName] = [];
    }
    groups[moduleName].push(lesson);
  });

  Object.values(groups).forEach((group) => {
    group.sort((a, b) => a.order - b.order);
  });

  return Object.entries(groups).map(([name, lessons], index) => ({
    name,
    index: index + 1,
    lessons,
  }));
}

function CourseSidebar({
  courseSlug,
  lessons,
}: {
  courseSlug: string;
  lessons: Lesson[];
}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [activeView, setActiveView] = useState<string>("fundamentals");

  // Filter lessons by category if categories are defined
  const filteredLessons = lessons.filter((lesson) => {
    if (!lesson.category) return true; // Show all if no category
    return lesson.category === activeView;
  });

  const modules = groupLessonsByModule(filteredLessons);

  // Check if any lessons have categories (to show/hide toggle)
  const hasCategories = lessons.some((lesson) => lesson.category);

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.15,
        ease: "easeOut",
      },
    },
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border">
        {/* View Toggle (if categories exist) */}
        {hasCategories && (
          <div className="p-3 pb-0">
            <SegmentedControl
              options={VIEW_OPTIONS}
              value={activeView}
              onChange={setActiveView}
            />
          </div>
        )}

        {/* Course Overview Link */}
        <SidebarMenu className="p-3">
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Course Overview">
              <Link href={`/courses/${courseSlug}`} className="cursor-pointer">
                <HugeiconsIcon icon={Home01Icon} size={16} />
                <span>Course Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            {modules.map((module) => (
              <SidebarGroup key={module.name}>
                {/* Enhanced Module Header */}
                <div className="px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    Module {String(module.index).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-medium text-foreground mt-0.5">
                    {module.name}
                  </h3>
                </div>

                <SidebarGroupContent>
                  <SidebarMenu>
                    {module.lessons.map((lesson) => {
                      const isActive = pathname === lesson.url;

                      return (
                        <motion.div key={lesson.slug} variants={itemVariants}>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              tooltip={lesson.title}
                            >
                              <Link
                                href={lesson.url}
                                className="cursor-pointer flex items-center justify-between"
                              >
                                <span className="truncate">{lesson.title}</span>
                                {/* Checkmark on RIGHT for completed */}
                                {lesson.isCompleted && (
                                  <HugeiconsIcon
                                    icon={CheckmarkCircle02Icon}
                                    size={14}
                                    className="text-primary shrink-0 ml-2"
                                  />
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </motion.div>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </motion.div>
        </AnimatePresence>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

export function CourseLayout({
  courseSlug,
  lessons,
  tocItems,
  children,
  className,
}: CourseLayoutProps) {
  const toc =
    tocItems && tocItems.length > 0 ? (
      <StickyTOCSidebar items={tocItems} />
    ) : null;

  return (
    <SiteShell
      sidebar={<CourseSidebar courseSlug={courseSlug} lessons={lessons} />}
      toc={toc}
      className={cn("relative", className)}
    >
      <div className="min-w-0">{children}</div>
    </SiteShell>
  );
}

export default CourseLayout;
```

---

## Segmented Control Styling

### Design Specifications
- **Container**: `rounded-full bg-muted p-1`
- **Active Button**: `bg-background shadow-sm text-foreground`
- **Inactive Button**: `text-muted-foreground hover:text-foreground`
- **Animation**: Spring layout animation on indicator

### Animation Details
```tsx
transition={{
  type: "spring",
  stiffness: 400,
  damping: 30,
}}
```

---

## Module Header Styling

### Design Specifications
- **Container**: `px-3 py-2`
- **Label**: `text-xs text-muted-foreground` ("Module 01")
- **Title**: `text-sm font-medium text-foreground mt-0.5`
- **Numbering Format**: Zero-padded (`01`, `02`, etc.)

### Example Output
```
Module 01
Animation Theory

Module 02
CSS Animations

Module 03
Framer Motion
```

---

## Lesson Item Styling

### Design Specifications
- **Layout**: `flex items-center justify-between`
- **Title**: `truncate` for overflow handling
- **Checkmark**: Right-aligned, `text-primary`, 14px size
- **Active State**: Handled by SidebarMenuButton `isActive` prop

### Checkmark Display Logic
```tsx
{lesson.isCompleted && (
  <HugeiconsIcon
    icon={CheckmarkCircle02Icon}
    size={14}
    className="text-primary shrink-0 ml-2"
  />
)}
```

---

## Animation Details

### View Toggle Animation
- **Type**: AnimatePresence with mode="wait"
- **Exit/Enter**: Fade + slide
- **Duration**: 150ms

### Lesson Item Stagger
- **Delay per item**: 30ms (0.03s)
- **Duration**: 150ms
- **Initial**: `opacity: 0, x: -8`
- **Animate**: `opacity: 1, x: 0`

### Segmented Control Indicator
- **Type**: Layout animation with layoutId
- **Spring**: stiffness 400, damping 30
- **Effect**: Indicator slides between options smoothly

---

## Data Flow

### Progress Tracking Integration
```tsx
// In page component, merge lesson data with progress
const lessonsWithProgress = lessons.map((lesson) => ({
  ...lesson,
  isCompleted: progressData[lesson.slug]?.completed ?? false,
}));

<CourseLayout lessons={lessonsWithProgress} ... />
```

### Category Assignment
Categories should be defined in lesson frontmatter:
```yaml
---
title: Spring Animations
module: Animation Theory
category: fundamentals  # or "walkthroughs"
order: 4
---
```

---

## Accessibility

### Segmented Control
- `role="radiogroup"` on container
- `role="radio"` on each button
- `aria-checked` indicates active state
- Keyboard: Arrow keys to navigate, Enter/Space to select

### Sidebar Navigation
- All items keyboard accessible
- Focus management preserved
- Screen reader announces module structure
- Active item indicated with `aria-current`

---

## Testing Checklist

### Functional Tests
- [ ] View toggle switches between categories
- [ ] Module numbering displays correctly (01, 02, etc.)
- [ ] Checkmarks appear for completed lessons
- [ ] Active state highlights current lesson
- [ ] Links navigate correctly

### Visual Tests
- [ ] Segmented control animates smoothly
- [ ] Lesson items stagger on view change
- [ ] Module headers have proper hierarchy
- [ ] Works in both light and dark themes
- [ ] Collapsed sidebar shows icons only

### Accessibility Tests
- [ ] Keyboard navigation through all items
- [ ] Screen reader announces structure
- [ ] Focus states visible
- [ ] Reduced motion respected

---

## Files Modified/Created

| File | Action | Changes |
|------|--------|---------|
| `components/ui/segmented-control.tsx` | Create | New component |
| `components/courses/CourseLayout.tsx` | Modify | Full enhancement |

## Dependencies
- Motion (existing)
- HugeIcons (existing)

## Breaking Changes
- Lesson interface extended (backward compatible)
- New optional `category` and `isCompleted` props
