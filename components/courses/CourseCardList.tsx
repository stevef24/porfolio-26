"use client";

import { useState } from "react";
import { LayoutGroup } from "motion/react";
import { LessonCard } from "@/components/courses/LessonCard";
import BlurFade from "@/components/shared/BlurFade";

interface CourseItem {
  slug: string;
  title: string;
  description: string;
  lessonCount: number;
  duration?: string;
  difficulty?: string;
}

interface CourseCardListProps {
  courses: CourseItem[];
  baseDelay?: number;
  stagger?: number;
}

export function CourseCardList({
  courses,
  baseDelay = 0.2,
  stagger = 0.05,
}: CourseCardListProps): JSX.Element {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <LayoutGroup id="course-cards">
      <div>
        {courses.map((course, index) => (
          <BlurFade key={course.slug} delay={baseDelay + index * stagger}>
            <LessonCard
              title={course.title}
              description={course.description}
              href={`/courses/${course.slug}`}
              lessonCount={course.lessonCount}
              duration={course.duration}
              difficulty={course.difficulty}
              isHovered={hoveredSlug === course.slug}
              onHoverChange={(hovered) =>
                setHoveredSlug(hovered ? course.slug : null)
              }
            />
          </BlurFade>
        ))}
      </div>
    </LayoutGroup>
  );
}
