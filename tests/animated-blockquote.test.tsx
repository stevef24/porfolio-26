import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnimatedBlockquote } from "@/components/ui/blog/AnimatedBlockquote";

describe("AnimatedBlockquote", () => {
  it("uses valid oklch fallback styles for untyped blockquotes", () => {
    render(<AnimatedBlockquote>Fallback quote</AnimatedBlockquote>);

    const textNode = screen.getByText("Fallback quote");
    const fallbackContainer = textNode.closest("div")?.parentElement;

    expect(fallbackContainer).toBeTruthy();
    expect(fallbackContainer?.getAttribute("style")).toContain(
      "color-mix(in oklch",
    );
    expect(fallbackContainer?.getAttribute("style")).not.toContain(
      "oklch(var(--foreground)",
    );
  });
});
