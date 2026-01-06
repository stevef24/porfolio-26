/**
 * Motion variants - Swiss minimalism animation system
 * 2026 Best Practices: Time-based springs with visualDuration and bounce
 * @see https://motion.dev/docs/react-transitions#spring
 */

import type { Transition, Variants } from "motion/react";

// ==========================================
// SPRING PHYSICS PRESETS (2026 Time-Based)
// ==========================================

/** Snappy spring - toggles, buttons, micro-interactions */
export const springSnappy: Transition = {
	type: "spring",
	visualDuration: 0.2,
	bounce: 0,
};

/** Smooth spring - RECOMMENDED DEFAULT for most UI transitions */
export const springSmooth: Transition = {
	type: "spring",
	visualDuration: 0.3,
	bounce: 0.15,
};

/** Gentle spring - cards, panels, content reveals */
export const springGentle: Transition = {
	type: "spring",
	visualDuration: 0.35,
	bounce: 0.1,
};

/** Bouncy spring - playful elements, success states */
export const springBouncy: Transition = {
	type: "spring",
	visualDuration: 0.4,
	bounce: 0.3,
};

/** Stiff spring - quick, controlled (legacy alias for springSnappy) */
export const springStiff: Transition = springSnappy;

// ==========================================
// CSS SPRING FOR NON-JS ANIMATIONS
// ==========================================

/** CSS spring for focus lines - 350ms, bounce: 0.15 */
export const cssSpringSmooth =
	"350ms linear(0, 0.3667, 0.8271, 1.0379, 1.0652, 1.0332, 1.006, 0.9961, 0.996, 0.9984, 0.9999, 1)";

// ==========================================
// EASING PRESETS
// ==========================================

/** Standard easeOut cubic bezier */
export const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

/** Standard easeIn cubic bezier */
export const easeIn = [0.55, 0.06, 0.68, 0.19] as const;

/** Standard easeInOut cubic bezier */
export const easeInOut = [0.65, 0.05, 0.36, 1] as const;

// ==========================================
// BASIC ANIMATION VARIANTS
// ==========================================

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.2, ease: "easeOut" },
	},
};

export const slideUp: Variants = {
	hidden: { opacity: 0, y: 8 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.2, ease: "easeOut" },
	},
};

export const slideUpSubtle: Variants = {
	hidden: { opacity: 0, y: 4 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.15, ease: "easeOut" },
	},
};

export const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.98 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.15, ease: "easeOut" },
	},
};

export const slideFromLeft: Variants = {
	hidden: { opacity: 0, x: -8 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.2, ease: "easeOut" },
	},
};

export const slideFromRight: Variants = {
	hidden: { opacity: 0, x: 8 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.2, ease: "easeOut" },
	},
};

// ==========================================
// STAGGER CONTAINERS
// ==========================================

export const staggerContainer: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.02,
		},
	},
};

export const staggerFast: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.03,
			delayChildren: 0.01,
		},
	},
};

export const staggerItem: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.15, ease: "easeOut" },
	},
};

// ==========================================
// TOC RAIL VARIANTS
// ==========================================

/** TOC vertical indicator bar - scales from top */
export const tocIndicator: Variants = {
	hidden: { scaleY: 0, opacity: 0 },
	visible: {
		scaleY: 1,
		opacity: 1,
		transition: springGentle,
	},
};

/** TOC item entrance (use with custom prop for index) */
export const tocItem: Variants = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: {
			delay: i * 0.05,
			duration: 0.2,
			ease: easeOut,
		},
	}),
};

/** TOC container for stagger orchestration */
export const tocContainer: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.1,
		},
	},
};

// ==========================================
// SIDEBAR VARIANTS
// ==========================================

/** Sidebar module group entrance */
export const sidebarModule: Variants = {
	hidden: { opacity: 0 },
	visible: (i: number) => ({
		opacity: 1,
		transition: {
			delay: i * 0.08,
			duration: 0.2,
			ease: "easeOut",
		},
	}),
};

/** Sidebar lesson item entrance */
export const sidebarItem: Variants = {
	hidden: { opacity: 0, x: -8 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.15,
			ease: "easeOut",
		},
	},
};

/** Sidebar container for stagger */
export const sidebarContainer: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.03,
		},
	},
};

/** View toggle content transition (AnimatePresence) */
export const viewToggleContent: Variants = {
	hidden: { opacity: 0, y: 8 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.2,
			ease: "easeOut",
		},
	},
	exit: {
		opacity: 0,
		y: -8,
		transition: {
			duration: 0.15,
			ease: "easeIn",
		},
	},
};

// ==========================================
// SEGMENTED CONTROL
// ==========================================

/** Segmented control indicator spring */
export const segmentedIndicatorSpring: Transition = springSmooth;

// ==========================================
// CODE PLAYGROUND VARIANTS
// ==========================================

/** Playground entrance animation */
export const playgroundEntrance: Variants = {
	hidden: { opacity: 0, y: 8 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.2,
			ease: "easeOut",
		},
	},
};

/** Playground header actions */
export const playgroundAction: Variants = {
	initial: { scale: 1 },
	hover: { scale: 1.05 },
	tap: { scale: 0.95 },
};

// ==========================================
// INTERACTIVE ELEMENTS
// ==========================================

/** Button press effect */
export const buttonPress: Variants = {
	initial: { scale: 1 },
	tap: { scale: 0.98 },
};

/** Icon button hover/tap */
export const iconButton: Variants = {
	initial: { scale: 1 },
	hover: { scale: 1.05 },
	tap: { scale: 0.95 },
};

/** Link underline reveal (scaleX from left) */
export const linkUnderline: Variants = {
	initial: { scaleX: 0, originX: 0 },
	hover: { scaleX: 1 },
};

// ==========================================
// LAYOUT TRANSITIONS
// ==========================================

/** Main content area transition */
export const layoutTransition: Transition = {
	duration: 0.2,
	ease: "easeOut",
};

/** Sidebar toggle transition */
export const sidebarToggleTransition: Transition = springGentle;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Create a custom stagger delay based on index
 */
export const createStaggerDelay = (index: number, baseDelay = 0.05) => ({
	delay: index * baseDelay,
});

/**
 * Get reduced motion safe transition
 * Returns instant transition when reduced motion is preferred
 */
export const getReducedMotionTransition = (
	transition: Transition,
	prefersReducedMotion: boolean | null
): Transition => {
	if (prefersReducedMotion) {
		return { duration: 0 };
	}
	return transition;
};

/**
 * Get reduced motion safe variants
 * Returns variants with instant transitions when reduced motion is preferred
 */
export const getReducedMotionVariants = (
	variants: Variants,
	prefersReducedMotion: boolean | null
): Variants => {
	if (!prefersReducedMotion) return variants;

	const reducedVariants: Variants = {};
	for (const [key, value] of Object.entries(variants)) {
		if (typeof value === "object" && value !== null) {
			reducedVariants[key] = {
				...(value as Record<string, unknown>),
				transition: { duration: 0 },
			};
		} else {
			reducedVariants[key] = value;
		}
	}
	return reducedVariants;
};

/**
 * Create custom item variants with specific stagger timing
 */
export const createItemVariants = (staggerDelay = 0.05): Variants => ({
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: {
			delay: i * staggerDelay,
			duration: 0.2,
			ease: easeOut,
		},
	}),
});
