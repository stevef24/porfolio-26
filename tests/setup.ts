import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

type MockIOInstance = {
	callback: IntersectionObserverCallback;
	elements: Set<Element>;
	observer: IntersectionObserver;
};

const ioInstances: MockIOInstance[] = [];

function createRect(top: number, bottom: number): DOMRectReadOnly {
	const height = Math.max(0, bottom - top);
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
	} as DOMRectReadOnly;
}

function createEntry(
	target: Element,
	init: {
		isIntersecting: boolean;
		intersectionRatio?: number;
		top?: number;
		bottom?: number;
	}
): IntersectionObserverEntry {
	const top = init.top ?? 0;
	const bottom = init.bottom ?? top;
	const rect = createRect(top, bottom);
	return {
		time: performance.now(),
		target,
		isIntersecting: init.isIntersecting,
		intersectionRatio: init.intersectionRatio ?? (init.isIntersecting ? 1 : 0),
		boundingClientRect: rect,
		intersectionRect: rect,
		rootBounds: null,
	} as IntersectionObserverEntry;
}

class MockIntersectionObserver {
	readonly root: Element | Document | null;
	readonly rootMargin: string;
	readonly thresholds: ReadonlyArray<number>;
	private instance: MockIOInstance;

	constructor(
		callback: IntersectionObserverCallback,
		options: IntersectionObserverInit = {}
	) {
		this.root = options.root ?? null;
		this.rootMargin = options.rootMargin ?? "0px";
		const threshold = options.threshold ?? 0;
		this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
		this.instance = {
			callback,
			elements: new Set<Element>(),
			observer: this as unknown as IntersectionObserver,
		};
		ioInstances.push(this.instance);
	}

	observe = (element: Element) => {
		this.instance.elements.add(element);
	};

	unobserve = (element: Element) => {
		this.instance.elements.delete(element);
	};

	disconnect = () => {
		this.instance.elements.clear();
	};

	takeRecords = () => [];
}

const ioMock = {
	instances: ioInstances,
	isObserved: (target: Element) =>
		ioInstances.some((instance) => instance.elements.has(target)),
	trigger: (
		target: Element,
		init: {
			isIntersecting: boolean;
			intersectionRatio?: number;
			top?: number;
			bottom?: number;
		}
	) => {
		const entry = createEntry(target, init);
		for (const instance of ioInstances) {
			if (instance.elements.has(target)) {
				instance.callback([entry], instance.observer);
			}
		}
	},
	reset: () => {
		ioInstances.length = 0;
	},
};

afterEach(() => {
	cleanup();
	ioMock.reset();
});

Object.defineProperty(globalThis, "__ioMock", {
	value: ioMock,
	configurable: true,
});

Object.defineProperty(window, "IntersectionObserver", {
	writable: true,
	configurable: true,
	value: MockIntersectionObserver,
});

if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (callback: FrameRequestCallback) => {
		callback(performance.now());
		return 0;
	};
}

if (!window.cancelAnimationFrame) {
	window.cancelAnimationFrame = () => undefined;
}

Object.defineProperty(window, "matchMedia", {
	writable: true,
	configurable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
	}),
});
