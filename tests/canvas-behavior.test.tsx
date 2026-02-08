import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { BlogWithCanvas } from "@/components/blog/BlogWithCanvas";
import { CanvasGap, CanvasZone } from "@/components/blog/CanvasZone";
import { CanvasStep } from "@/components/blog/CanvasStep";

type IoMock = {
	isObserved: (target: Element) => boolean;
	trigger: (
		target: Element,
		init: {
			isIntersecting: boolean;
			intersectionRatio?: number;
			top?: number;
			bottom?: number;
		}
	) => void;
	reset: () => void;
};

const getIoMock = () => (globalThis as typeof globalThis & { __ioMock: IoMock }).__ioMock;

const hydrate = async () => {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 120));
	});
};

const flushRaf = async () => {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
};

const ensureObserved = async (target: Element) => {
	for (let attempt = 0; attempt < 5; attempt += 1) {
		if (getIoMock().isObserved(target)) return;
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
	}
	throw new Error("IntersectionObserver did not attach to element");
};

describe("canvas activation behavior", () => {
	beforeEach(() => {
		getIoMock().reset();
	});

	afterEach(() => {
		cleanup();
	});

	it("closes after transition lock when no zones remain", async () => {
		render(
			<BlogWithCanvas>
				<CanvasZone
					id="zone-basic"
					canvasContent={<div data-testid="canvas">Canvas</div>}
				>
					<article>
						<h2>Zone One</h2>
						<p>Intro</p>
					</article>
				</CanvasZone>
			</BlogWithCanvas>
		);

		await hydrate();

		const zone = document.getElementById("zone-basic");
		if (!zone) throw new Error("zone element missing");

		await ensureObserved(zone);

		await act(async () => {
			getIoMock().trigger(zone, {
				isIntersecting: true,
				intersectionRatio: 0.6,
				top: 120,
				bottom: 220,
			});
		});
		await flushRaf();

		await waitFor(() => {
			expect(
				document.querySelector("[data-canvas-layout]")?.getAttribute("data-active")
			).toBe("true");
		});

		await act(async () => {
			getIoMock().trigger(zone, {
				isIntersecting: false,
				intersectionRatio: 0,
				top: -500,
				bottom: -400,
			});
		});
		await flushRaf();

		await waitFor(() => {
			expect(
				document.querySelector("[data-canvas-layout]")?.getAttribute("data-active")
			).toBe("true");
		});

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 700));
		});

		await waitFor(() => {
			expect(
				document.querySelector("[data-canvas-layout]")?.getAttribute("data-active")
			).toBe("false");
		});
	});

	it("keeps canvas open when a gap is visible but a zone is still active", async () => {
		render(
			<BlogWithCanvas>
				<CanvasZone
					id="zone-active"
					canvasContent={<div data-testid="canvas">Canvas</div>}
				>
					<article>
						<h2>Zone Two</h2>
						<p>Body</p>
					</article>
				</CanvasZone>
				<CanvasGap>
					<div>Gap content</div>
				</CanvasGap>
			</BlogWithCanvas>
		);

		await hydrate();

		const zone = document.getElementById("zone-active");
		const gap = document.querySelector("[data-canvas-sentinel='gap']");
		if (!zone || !gap) throw new Error("zone or gap element missing");

		await ensureObserved(zone);
		await ensureObserved(gap);

		await act(async () => {
			getIoMock().trigger(zone, {
				isIntersecting: true,
				intersectionRatio: 0.8,
				top: 140,
				bottom: 240,
			});
		});
		await flushRaf();

		await waitFor(() => {
			expect(
				document.querySelector("[data-canvas-layout]")?.getAttribute("data-active")
			).toBe("true");
		});

		await act(async () => {
			getIoMock().trigger(gap, {
				isIntersecting: true,
				intersectionRatio: 0.6,
				top: 150,
				bottom: 250,
			});
		});
		await flushRaf();

		await waitFor(() => {
			expect(
				document.querySelector("[data-canvas-layout]")?.getAttribute("data-active")
			).toBe("true");
		});
	});

	it("keeps canvas active when trigger selector exits but zone body is still visible", async () => {
		render(
			<BlogWithCanvas>
				<CanvasZone
					id="zone-trigger"
					triggerSelector="h2"
					canvasContent={<div data-testid="canvas">Canvas</div>}
				>
					<article>
						<h2 id="zone-trigger-heading">Trigger Heading</h2>
						<p style={{ minHeight: "640px" }}>
							Large zone content to simulate a long walkthrough block.
						</p>
					</article>
				</CanvasZone>
			</BlogWithCanvas>
		);

		await hydrate();

		const zone = document.getElementById("zone-trigger");
		const trigger = document.getElementById("zone-trigger-heading");
		if (!zone || !trigger) throw new Error("zone or trigger element missing");

		await ensureObserved(trigger);

		let zoneTop = 120;
		let zoneBottom = 780;
		Object.defineProperty(zone, "getBoundingClientRect", {
			configurable: true,
			value: () =>
				({
					top: zoneTop,
					bottom: zoneBottom,
					left: 0,
					right: 0,
					width: 0,
					height: Math.max(0, zoneBottom - zoneTop),
					x: 0,
					y: zoneTop,
					toJSON: () => "",
				}) as DOMRect,
		});

		await act(async () => {
			getIoMock().trigger(trigger, {
				isIntersecting: true,
				intersectionRatio: 0.8,
				top: 120,
				bottom: 200,
			});
		});
		await flushRaf();

		await waitFor(() => {
			expect(
				document.querySelector("[data-canvas-layout]")?.getAttribute("data-active")
			).toBe("true");
		});

		// Trigger exits, but the full zone is still in the reading area.
		zoneTop = 90;
		zoneBottom = 620;
		await act(async () => {
			getIoMock().trigger(trigger, {
				isIntersecting: false,
				intersectionRatio: 0,
				top: -200,
				bottom: -120,
			});
		});
		await flushRaf();
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 260));
		});

		await waitFor(() => {
			expect(
				document.querySelector("[data-canvas-layout]")?.getAttribute("data-active")
			).toBe("true");
		});

		// Once the whole zone leaves, canvas should close.
		zoneTop = -640;
		zoneBottom = -520;
		await act(async () => {
			getIoMock().trigger(trigger, {
				isIntersecting: false,
				intersectionRatio: 0,
				top: -740,
				bottom: -680,
			});
		});
		await flushRaf();

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 300));
		});

		await waitFor(() => {
			expect(
				document.querySelector("[data-canvas-layout]")?.getAttribute("data-active")
			).toBe("false");
		});
	});

	it("selects the step closest to the viewport center", async () => {
		Object.defineProperty(window, "innerHeight", {
			value: 800,
			writable: true,
			configurable: true,
		});

		render(
			<BlogWithCanvas>
				<CanvasZone
					id="zone-stepped"
					mode="stepped"
					totalSteps={3}
					canvasContent={(index) => <div>Step {index}</div>}
				>
					<article>
						<h2>Stepped Zone</h2>
						<CanvasStep index={0}>Step A</CanvasStep>
						<CanvasStep index={1}>Step B</CanvasStep>
						<CanvasStep index={2}>Step C</CanvasStep>
					</article>
				</CanvasZone>
			</BlogWithCanvas>
		);

		await hydrate();

		const step0 = document.querySelector("[data-canvas-step-index='0']");
		const step1 = document.querySelector("[data-canvas-step-index='1']");
		const zone = document.getElementById("zone-stepped");
		if (!step0 || !step1 || !zone) throw new Error("step elements missing");

		await ensureObserved(step0);
		await ensureObserved(step1);

		await act(async () => {
			getIoMock().trigger(step0, {
				isIntersecting: true,
				intersectionRatio: 0.4,
				top: 0,
				bottom: 100,
			});
			getIoMock().trigger(step1, {
				isIntersecting: true,
				intersectionRatio: 0.4,
				top: 300,
				bottom: 400,
			});
		});

		expect(zone.getAttribute("data-zone-step")).toBe("1");

		await act(async () => {
			getIoMock().trigger(step0, {
				isIntersecting: false,
				intersectionRatio: 0,
				top: -200,
				bottom: -100,
			});
			getIoMock().trigger(step1, {
				isIntersecting: false,
				intersectionRatio: 0,
				top: -200,
				bottom: -100,
			});
		});

		expect(zone.getAttribute("data-zone-step")).toBe("1");
	});
});
