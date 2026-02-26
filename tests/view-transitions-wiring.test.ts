import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function read(filePath: string): string {
  return readFileSync(join(process.cwd(), filePath), "utf8");
}

describe("view transitions wiring", () => {
  it("uses text-only ViewTransition names for blog card and blog hero", () => {
    const card = read("components/ui/MidCard.tsx");
    const hero = read("components/blog/BlogHeroHeader.tsx");

    expect(card).toContain("ViewTransition");
    expect(card).toContain("name={`blog-title-${slug}`}");
    expect(card).toContain("name={`blog-description-${slug}`}");
    expect(card).not.toContain("name={`blog-hero-");

    expect(hero).toContain("ViewTransition");
    expect(hero).toContain("name={`blog-title-${slug}`}");
    expect(hero).toContain("name={`blog-description-${slug}`}");
    expect(hero).not.toContain("name={`blog-hero-");
  });

  it("uses preview + text ViewTransition names for experiment card and detail", () => {
    const card = read("components/experiments/ExperimentCard.tsx");
    const detail = read("components/experiments/ExperimentDetail.tsx");

    expect(card).toContain("ViewTransition");
    expect(card).toContain("name={`experiment-preview-${slug}`}");
    expect(card).toContain("name={`experiment-title-${slug}`}");
    expect(card).toContain("name={`experiment-description-${slug}`}");

    expect(detail).toContain("ViewTransition");
    expect(detail).toContain("name={`experiment-preview-${slug}`}");
    expect(detail).toContain("name={`experiment-title-${slug}`}");
    expect(detail).toContain("name={`experiment-description-${slug}`}");
  });
});
