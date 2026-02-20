import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollyCoding } from "@/components/ui/scrolly/ScrollyCoding";
import { useIsMobile } from "@/hooks/use-mobile";

vi.mock("@/hooks/use-mobile", () => ({
	useIsMobile: vi.fn(),
}));

vi.mock("@/components/ui/scrolly/ScrollyStage", () => ({
	ScrollyStage: () => <div data-testid="scrolly-stage-desktop">Desktop Stage</div>,
}));

vi.mock("@/components/ui/scrolly/ScrollyStageMobile", () => ({
	ScrollyStageMobile: () => <div data-testid="scrolly-stage-mobile">Mobile Stage</div>,
}));

const mockUseIsMobile = vi.mocked(useIsMobile);

const steps = [
	{
		id: "step-1",
		title: "Step 1",
		body: "Mobile behavior",
		code: "const answer = 42;",
		lang: "ts",
	},
];

const compiledSteps = {
	steps: [
		{
			index: 0,
			id: "step-1",
			lang: "ts",
			tokens: {
				tokens: [
					{
						content: "const answer = 42;",
						color: "oklch(0.2 0 0)",
						key: "t1",
					},
				],
			},
		},
	],
	errors: [],
};

describe("ScrollyCoding mobile behavior", () => {
	afterEach(() => {
		mockUseIsMobile.mockReset();
	});

	it("keeps single-column width on mobile (no full-bleed breakout)", async () => {
		mockUseIsMobile.mockReturnValue(true);

		const { container } = render(
			<ScrollyCoding
				steps={steps}
				compiledSteps={compiledSteps as never}
			/>
		);

		await waitFor(() => {
			expect(
				container.querySelector('[aria-label="Interactive code walkthrough"]')
			).toBeInTheDocument();
		});

		const section = container.querySelector(
			'[aria-label="Interactive code walkthrough"]'
		);
		expect(section).toHaveClass("w-full");
		expect(section).not.toHaveClass("w-screen");
		expect(section).not.toHaveClass("-ml-[50vw]");
		expect(section).not.toHaveClass("-mr-[50vw]");
	});
});
