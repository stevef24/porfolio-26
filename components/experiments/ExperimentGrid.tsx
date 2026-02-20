"use client";

import { ExperimentCard } from "./ExperimentCard";
import BlurFade from "@/components/shared/BlurFade";
import type { Experiment } from "@/data/experiments";

interface ExperimentGridProps {
  experiments: Experiment[];
  baseDelay?: number;
  stagger?: number;
}

export function ExperimentGrid({
  experiments,
  baseDelay = 0.2,
  stagger = 0.05,
}: ExperimentGridProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      /*
       * CSS subgrid: each card spans 3 implicit rows
       * [preview | title | description+actions]
       * so content aligns horizontally across cards in the same row.
       */
      style={{ gridAutoRows: "auto" }}
    >
      {experiments.map((exp, index) => (
        <BlurFade key={exp.slug} delay={baseDelay + index * stagger}>
          <ExperimentCard experiment={exp} />
        </BlurFade>
      ))}
    </div>
  );
}
