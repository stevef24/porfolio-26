import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function read(filePath: string): string {
  return readFileSync(join(process.cwd(), filePath), "utf8");
}

describe("experiments staggered blur wiring", () => {
  it("uses BlurFade stagger pattern for experiment cards", () => {
    const grid = read("components/experiments/ExperimentGrid.tsx");

    expect(grid).toContain('import BlurFade from "@/components/shared/BlurFade"');
    expect(grid).toContain("baseDelay");
    expect(grid).toContain("stagger");
    expect(grid).toContain("delay={baseDelay + index * stagger}");
    expect(grid).toContain("<BlurFade");
    expect(grid).toContain("<ExperimentCard");
    expect(grid).not.toContain("animejs");
    expect(grid).not.toContain("animate(cards");
  });
});
