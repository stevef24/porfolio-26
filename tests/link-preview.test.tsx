import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const nextImageSpy = vi.fn();

vi.mock("next/image", () => ({
  default: ({ loader, unoptimized, ...props }: Record<string, unknown>) => {
    nextImageSpy({ loader, unoptimized, ...props });
    // eslint-disable-next-line @next/next/no-img-element
    return <img data-testid="next-image" alt="" {...(props as object)} />;
  },
}));

import { LinkPreview } from "@/components/ui/blog/LinkPreview";

const metadataPayload = {
  title: "Example title",
  description: "Example description",
  image: "https://cdn.example.com/preview.png",
  favicon: "https://cdn.example.com/favicon.png",
  siteName: "Example",
};

describe("LinkPreview", () => {
  beforeEach(() => {
    nextImageSpy.mockClear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => metadataPayload,
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("treats external links as external even when current hostname appears in query params", async () => {
    render(
      <LinkPreview href="https://external.example.com?redirect=http://localhost:3000/home">
        External doc
      </LinkPreview>,
    );

    const link = await screen.findByRole("link", { name: /external doc/i });
    fireEvent.mouseEnter(link);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/link-preview?url=https%3A%2F%2Fexternal.example.com%3Fredirect%3Dhttp%3A%2F%2Flocalhost%3A3000%2Fhome",
      );
    });
  });

  it("announces when a link opens in a new tab", async () => {
    render(<LinkPreview href="https://example.com/docs">Docs</LinkPreview>);

    const link = await screen.findByRole("link", {
      name: /docs \(opens in new tab\)/i,
    });

    expect(link).toHaveAttribute("target", "_blank");
  });

  it("uses next/image for preview media", async () => {
    render(<LinkPreview href="https://example.com/docs">Docs</LinkPreview>);

    const link = await screen.findByRole("link", {
      name: /docs/i,
    });
    fireEvent.mouseEnter(link);

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(nextImageSpy).toHaveBeenCalled();
    });
  });
});
