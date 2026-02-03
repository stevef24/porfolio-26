"use client";

import {
  CheckmarkCircle02Icon,
  Home01Icon,
  LockIcon,
  PlayCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { AccessLevel } from "@/hooks/useAccess";
import { useCourseProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

export interface Lesson {
  slug: string;
  title: string;
  module: string;
  order: number;
  url: string;
  access?: AccessLevel;
}

interface ModuleGroup {
  name: string;
  lessons: Lesson[];
}

interface ModuleSidebarProps {
  courseSlug: string;
  lessons: Lesson[];
  className?: string;
}

interface ModuleSidebarContentProps {
  courseSlug: string;
  lessons: Lesson[];
}

function groupLessonsByModule(lessons: Lesson[]): ModuleGroup[] {
  const groups: Record<string, Lesson[]> = {};

  lessons.forEach((lesson) => {
    const moduleName = lesson.module || "Lessons";
    if (!groups[moduleName]) {
      groups[moduleName] = [];
    }
    groups[moduleName].push(lesson);
  });

  // Sort lessons within each module by order
  Object.values(groups).forEach((group) => {
    group.sort((a, b) => a.order - b.order);
  });

  return Object.entries(groups).map(([name, lessons]) => ({
    name,
    lessons,
  }));
}

function ModuleSidebarContent({
  courseSlug,
  lessons,
}: ModuleSidebarContentProps): JSX.Element {
  const pathname = usePathname();
  const modules = groupLessonsByModule(lessons);
  const { isLessonCompleted, completedLessonsCount } =
    useCourseProgress(courseSlug);

  // Calculate progress percentage
  const progressPercentage =
    lessons.length > 0
      ? Math.round((completedLessonsCount / lessons.length) * 100)
      : 0;

  return (
    <>
      <SidebarHeader className="border-b border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Course Overview">
              <Link href={`/courses/${courseSlug}`}>
                <HugeiconsIcon icon={Home01Icon} size={16} />
                <span>Course Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Progress indicator */}
        {lessons.length > 0 && (
          <div className="px-3 pb-3">
            <div className="flex items-center justify-between text-[15px] text-foreground/50 mb-1.5">
              <span>{completedLessonsCount} / {lessons.length} completed</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-1 bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {modules.map((module) => (
          <SidebarGroup key={module.name}>
            <SidebarGroupLabel>{module.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {module.lessons.map((lesson, index) => {
                  const isActive = pathname === lesson.url;
                  const isCompleted = isLessonCompleted(lesson.slug);
                  const isLocked = lesson.access === "paid";
                  let statusIcon: JSX.Element;

                  if (isLocked) {
                    statusIcon = (
                      <HugeiconsIcon
                        icon={LockIcon}
                        size={16}
                        className="text-foreground/40"
                      />
                    );
                  } else if (isCompleted) {
                    statusIcon = (
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={16}
                        className="text-primary"
                      />
                    );
                  } else if (isActive) {
                    statusIcon = (
                      <HugeiconsIcon
                        icon={PlayCircle02Icon}
                        size={16}
                        className="text-primary"
                      />
                    );
                  } else {
                    statusIcon = (
                      <span className="w-6 h-6 flex items-center justify-center text-[15px] text-foreground/50">
                        {index + 1}
                      </span>
                    );
                  }

                  return (
                    <SidebarMenuItem key={lesson.slug}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={
                          isLocked
                            ? `${lesson.title} (Locked)`
                            : lesson.title
                        }
                      >
                        <Link
                          href={lesson.url}
                          className={cn(
                            "cursor-pointer",
                            isLocked && "opacity-60"
                          )}
                        >
                          {/* Progress/status icon */}
                          {statusIcon}
                          <span className={cn("text-[15px]", isLocked && "text-foreground/40")}>
                            {lesson.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Rail for easy collapse/expand on hover */}
      <SidebarRail />
    </>
  );
}

export function ModuleSidebar({
  courseSlug,
  lessons,
  className,
}: ModuleSidebarProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon" className={className}>
        <ModuleSidebarContent courseSlug={courseSlug} lessons={lessons} />
      </Sidebar>
    </SidebarProvider>
  );
}

export default ModuleSidebar;
