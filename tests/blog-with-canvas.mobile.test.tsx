import { useEffect } from "react";
import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlogWithCanvas, useCanvasLayout } from "@/components/blog/BlogWithCanvas";
import { useIsMobile } from "@/hooks/use-mobile";

vi.mock("@/hooks/use-mobile", () => ({
	useIsMobile: vi.fn(),
}));

const mockUseIsMobile = vi.mocked(useIsMobile);

function ActivateCanvasZone(): JSX.Element {
	const { setHasActiveZone, setActiveZoneId } = useCanvasLayout();

	useEffect(() => {
		setHasActiveZone(true);
		setActiveZoneId("test-zone");
	}, [setHasActiveZone, setActiveZoneId]);

	return <div data-testid="canvas-child">Canvas content</div>;
}

describe("BlogWithCanvas mobile behavior", () => {
	afterEach(() => {
		mockUseIsMobile.mockReset();
	});

	it("does not render desktop canvas rail or full-bleed breakout on mobile", async () => {
		mockUseIsMobile.mockReturnValue(true);

		const { container } = render(
			<BlogWithCanvas>
				<ActivateCanvasZone />
			</BlogWithCanvas>
		);

		await waitFor(() => {
			const layout = container.querySelector("[data-canvas-layout]");
			expect(layout?.getAttribute("data-active")).toBe("true");
		});

		const layout = container.querySelector("[data-canvas-layout]");
		expect(layout).toHaveClass("w-full");
		expect(layout).not.toHaveClass("w-screen");
		expect(container.querySelector("[data-canvas-column]")).not.toBeInTheDocument();
	});

	it("renders desktop canvas rail when active on desktop", async () => {
		mockUseIsMobile.mockReturnValue(false);

		const { container } = render(
			<BlogWithCanvas>
				<ActivateCanvasZone />
			</BlogWithCanvas>
		);

		await waitFor(() => {
			expect(container.querySelector("[data-canvas-column]")).toBeInTheDocument();
		});
	});
});
