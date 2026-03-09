import { describe, expect, it, vi } from "vitest";
import {
  parseShaderColor,
  resolveCssColorToShaderColor,
} from "@/lib/shader-colors";

describe("shader color conversion", () => {
  it("parses CSS Color 4 space-separated rgb syntax into shader tuples", () => {
    expect(parseShaderColor("rgb(45 120 80)")).toEqual([
      45 / 255,
      120 / 255,
      80 / 255,
      1,
    ]);

    expect(parseShaderColor("rgb(45 120 80 / 0.4)")).toEqual([
      45 / 255,
      120 / 255,
      80 / 255,
      0.4,
    ]);
  });

  it("resolves browser-computed colors into shader-safe tuples", () => {
    const getComputedStyleMock = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation((element: Element) => {
        if ((element as HTMLElement).dataset.shaderProbe === "true") {
          return {
            color: "rgb(45 120 80)",
          } as CSSStyleDeclaration;
        }

        return {
          color: "",
        } as CSSStyleDeclaration;
      });

    expect(resolveCssColorToShaderColor("oklch(0.86 0.14 155)")).toEqual([
      45 / 255,
      120 / 255,
      80 / 255,
      1,
    ]);

    getComputedStyleMock.mockRestore();
  });
});
