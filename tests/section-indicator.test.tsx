import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionIndicator } from "@/components/ui/blog/SectionIndicator";

type IoMock = {
  trigger: (
    target: Element,
    init: {
      isIntersecting: boolean;
      intersectionRatio?: number;
      top?: number;
      bottom?: number;
    }
  ) => void;
};

const getIoMock = () =>
  (globalThis as typeof globalThis & { __ioMock: IoMock }).__ioMock;

function createRect(top: number, height = 48): DOMRect {
  const bottom = top + height;
  return {
    top,
    bottom,
    left: 0,
    right: 0,
    width: 0,
    height,
    x: 0,
    y: top,
    toJSON: () => "",
  } as DOMRect;
}

function setHeadingTop(element: HTMLElement, top: number): void {
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => createRect(top),
  });
}

function getCollapsedTitle(container: HTMLElement): string {
  const node = container.querySelector(
    "nav span.text-swiss-caption.text-foreground.truncate.flex-1"
  );
  return node?.textContent?.trim() ?? "";
}

describe("SectionIndicator", () => {
  it("keeps collapsed title in sync with active TOC item during rapid scroll updates", async () => {
    const items = [
      { title: "Section one", url: "#section-one", depth: 2 },
      { title: "Section two", url: "#section-two", depth: 2 },
      { title: "Section three", url: "#section-three", depth: 2 },
    ];

    const { container } = render(
      <div>
        <SectionIndicator items={items} />
        <h2 id="section-one">Section one</h2>
        <h2 id="section-two">Section two</h2>
        <h2 id="section-three">Section three</h2>
      </div>
    );

    const one = document.getElementById("section-one");
    const two = document.getElementById("section-two");
    const three = document.getElementById("section-three");
    const sentinel = container.querySelector(".h-0.w-full");

    if (!one || !two || !three || !sentinel) {
      throw new Error("Failed to mount section indicator test elements");
    }

    setHeadingTop(one, 80);
    setHeadingTop(two, 420);
    setHeadingTop(three, 780);

    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => {
      expect(getCollapsedTitle(container)).toBe("Section one");
    });

    await act(async () => {
      getIoMock().trigger(sentinel, {
        isIntersecting: false,
        intersectionRatio: 0,
        top: -2,
        bottom: -1,
      });
    });

    const expandButton = await waitFor(() => {
      const button = container.querySelector(
        "button[aria-label='Expand table of contents']"
      );
      if (!button) throw new Error("Expand button not found");
      return button as HTMLButtonElement;
    });

    fireEvent.click(expandButton);

    await act(async () => {
      // First update points at section three, then quickly at section two.
      setHeadingTop(one, -920);
      setHeadingTop(two, 260);
      setHeadingTop(three, 100);
      window.dispatchEvent(new Event("scroll"));

      setHeadingTop(one, -920);
      setHeadingTop(two, 100);
      setHeadingTop(three, 300);
      window.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => {
      const activeItem = container.querySelector("ul button.text-foreground");
      expect(activeItem?.textContent?.trim()).toBe("Section two");
    });

    await waitFor(() => {
      expect(getCollapsedTitle(container)).toBe("Section two");
    });
  });
});
