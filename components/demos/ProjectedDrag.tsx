"use client";

/**
 * ProjectedDrag - Interactive physics-based drag projection demo
 *
 * Demonstrates the projection formula: displacement = (velocity × decay) / (1 - decay)
 * When released, the draggable element "slides" to its projected destination.
 */

import { useRef, useState, useCallback, useMemo } from "react";
import {
	motion,
	useMotionValue,
	useVelocity,
	useTransform,
	useReducedMotion,
	animate,
	type PanInfo,
} from "motion/react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Physics Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Decay rate for projection formula (0.995-0.998 feels natural) */
const DECELERATION_RATE = 0.996;

/** Time constant for projection (1000ms = 1 second of decay) */
const TIME_CONSTANT = 1000;

/**
 * Calculate projected displacement using momentum physics.
 *
 * Formula: displacement = (velocity × timeConstant × decelerationRate) / (1 - decelerationRate)
 *
 * This approximates where an object would come to rest given its initial velocity
 * and a constant deceleration factor.
 */
function calculateProjectedDisplacement(velocity: number): number {
	return (velocity * TIME_CONSTANT * DECELERATION_RATE) / (1 - DECELERATION_RATE);
}

/**
 * Clamp a value between min and max bounds.
 */
function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

// ─────────────────────────────────────────────────────────────────────────────
// Component Types
// ─────────────────────────────────────────────────────────────────────────────

interface DropZone {
	id: string;
	label: string;
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
}

interface ProjectedDragProps {
	/** Additional CSS classes */
	className?: string;
	/** Show debug overlay with velocity/projection values */
	showDebug?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function ProjectedDrag({ className, showDebug = true }: ProjectedDragProps) {
	const constraintsRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();

	// Motion values for position tracking
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	// Velocity tracking (pixels per second)
	const xVelocity = useVelocity(x);
	const yVelocity = useVelocity(y);

	// State for UI feedback
	const [isDragging, setIsDragging] = useState(false);
	const [projectedPos, setProjectedPos] = useState({ x: 0, y: 0 });
	const [currentVelocity, setCurrentVelocity] = useState({ x: 0, y: 0 });
	const [lastLandedZone, setLastLandedZone] = useState<string | null>(null);

	// Visual feedback transforms
	const scale = useTransform(
		xVelocity,
		[-2000, 0, 2000],
		[1.08, 1, 1.08],
		{ clamp: false }
	);

	const rotateZ = useTransform(
		xVelocity,
		[-1000, 0, 1000],
		[-3, 0, 3],
		{ clamp: false }
	);

	// Drop zones - positioned relative to canvas
	const dropZones: DropZone[] = useMemo(
		() => [
			{
				id: "zone-1",
				label: "Zone A",
				x: 40,
				y: 40,
				width: 120,
				height: 120,
				color: "oklch(0.65 0.2 125)", // Lime green
			},
			{
				id: "zone-2",
				label: "Zone B",
				x: 200,
				y: 200,
				width: 120,
				height: 120,
				color: "oklch(0.65 0.15 280)", // Purple
			},
			{
				id: "zone-3",
				label: "Zone C",
				x: 350,
				y: 80,
				width: 120,
				height: 120,
				color: "oklch(0.65 0.18 30)", // Orange
			},
		],
		[]
	);

	/**
	 * Check if a point is inside a drop zone
	 */
	const getDropZoneAtPosition = useCallback(
		(posX: number, posY: number): DropZone | null => {
			const elementHalfSize = 28; // Half of 56px element
			const centerX = posX + elementHalfSize;
			const centerY = posY + elementHalfSize;

			for (const zone of dropZones) {
				if (
					centerX >= zone.x &&
					centerX <= zone.x + zone.width &&
					centerY >= zone.y &&
					centerY <= zone.y + zone.height
				) {
					return zone;
				}
			}
			return null;
		},
		[dropZones]
	);

	/**
	 * Handle drag start - track state for visual feedback
	 */
	const handleDragStart = useCallback(() => {
		setIsDragging(true);
		setLastLandedZone(null);
	}, []);

	/**
	 * Handle drag motion - update debug display
	 */
	const handleDrag = useCallback(() => {
		const vx = xVelocity.get();
		const vy = yVelocity.get();
		setCurrentVelocity({ x: vx, y: vy });

		// Calculate real-time projection
		const projX = x.get() + calculateProjectedDisplacement(vx);
		const projY = y.get() + calculateProjectedDisplacement(vy);
		setProjectedPos({ x: projX, y: projY });
	}, [x, y, xVelocity, yVelocity]);

	/**
	 * Handle drag end - apply projection physics
	 */
	const handleDragEnd = useCallback(
		(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
			setIsDragging(false);

			// Get current position and velocity
			const currentX = x.get();
			const currentY = y.get();
			const velocityX = info.velocity.x;
			const velocityY = info.velocity.y;

			// Calculate projected destination
			const projectedX = currentX + calculateProjectedDisplacement(velocityX);
			const projectedY = currentY + calculateProjectedDisplacement(velocityY);

			// Get canvas bounds for clamping
			const canvas = constraintsRef.current;
			if (!canvas) return;

			const bounds = canvas.getBoundingClientRect();
			const elementSize = 56; // px
			const maxX = bounds.width - elementSize;
			const maxY = bounds.height - elementSize;

			// Clamp to canvas bounds
			const finalX = clamp(projectedX, 0, maxX);
			const finalY = clamp(projectedY, 0, maxY);

			// Check if projection lands in a drop zone
			const targetZone = getDropZoneAtPosition(finalX, finalY);

			// Determine animation target
			let targetX = finalX;
			let targetY = finalY;

			if (targetZone) {
				// Snap to zone center
				const elementHalfSize = elementSize / 2;
				targetX = targetZone.x + targetZone.width / 2 - elementHalfSize;
				targetY = targetZone.y + targetZone.height / 2 - elementHalfSize;
				setLastLandedZone(targetZone.id);
			}

			// Update projected position for debug display
			setProjectedPos({ x: targetX, y: targetY });

			// Animate to projected position with spring physics
			const springConfig = prefersReducedMotion
				? { duration: 0 }
				: {
						type: "spring" as const,
						stiffness: 300,
						damping: 30,
						velocity: velocityX,
					};

			animate(x, targetX, springConfig);
			animate(y, targetY, {
				...springConfig,
				velocity: velocityY,
			});
		},
		[x, y, prefersReducedMotion, getDropZoneAtPosition]
	);

	/**
	 * Reset element to center
	 */
	const handleReset = useCallback(() => {
		const canvas = constraintsRef.current;
		if (!canvas) return;

		const bounds = canvas.getBoundingClientRect();
		const elementSize = 56;
		const centerX = (bounds.width - elementSize) / 2;
		const centerY = (bounds.height - elementSize) / 2;

		animate(x, centerX, { type: "spring", stiffness: 200, damping: 25 });
		animate(y, centerY, { type: "spring", stiffness: 200, damping: 25 });
		setLastLandedZone(null);
	}, [x, y]);

	return (
		<div className={cn("relative w-full", className)}>
			{/* Canvas container */}
			<div
				ref={constraintsRef}
				className={cn(
					"relative w-full aspect-[4/3] min-h-[400px]",
					"rounded-2xl overflow-hidden",
					"bg-[#080808] border border-white/10",
					"select-none"
				)}
			>
				{/* Drop zones */}
				{dropZones.map((zone) => (
					<div
						key={zone.id}
						className={cn(
							"absolute rounded-xl",
							"border-2 border-dashed",
							"flex items-center justify-center",
							"transition-all duration-200",
							lastLandedZone === zone.id
								? "border-opacity-100 bg-opacity-20"
								: "border-opacity-30 bg-opacity-5"
						)}
						style={{
							left: zone.x,
							top: zone.y,
							width: zone.width,
							height: zone.height,
							borderColor: zone.color,
							backgroundColor:
								lastLandedZone === zone.id
									? zone.color.replace(")", " / 20%)")
									: zone.color.replace(")", " / 5%)"),
						}}
					>
						<span
							className="text-xs font-medium uppercase tracking-wider"
							style={{
								color: zone.color,
								opacity: lastLandedZone === zone.id ? 1 : 0.5,
							}}
						>
							{zone.label}
						</span>
					</div>
				))}

				{/* Projection indicator (ghost) */}
				{isDragging && (
					<motion.div
						className="absolute w-14 h-14 rounded-xl border-2 border-dashed border-pink-400/30"
						style={{
							left: projectedPos.x,
							top: projectedPos.y,
						}}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 0.5, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
					/>
				)}

				{/* Draggable element */}
				<motion.div
					className={cn(
						"absolute w-14 h-14 rounded-xl cursor-grab active:cursor-grabbing",
						"flex items-center justify-center",
						"bg-gradient-to-br from-pink-500 to-purple-600",
						"shadow-lg transition-shadow duration-200",
						isDragging && "shadow-[0_0_30px_rgba(236,72,153,0.5)]"
					)}
					style={{
						x,
						y,
						scale: isDragging ? scale : 1,
						rotateZ: isDragging ? rotateZ : 0,
					}}
					drag
					dragMomentum={false}
					dragElastic={0}
					dragConstraints={constraintsRef}
					onDragStart={handleDragStart}
					onDrag={handleDrag}
					onDragEnd={handleDragEnd}
					whileDrag={{ scale: 1.05 }}
					initial={{ x: 200, y: 150 }}
				>
					{/* Inner icon */}
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						className="text-white"
					>
						<path
							d="M12 4L12 20M12 4L8 8M12 4L16 8M12 20L8 16M12 20L16 16"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</motion.div>

				{/* Reset button */}
				<button
					onClick={handleReset}
					className={cn(
						"absolute bottom-4 right-4",
						"px-3 py-1.5 rounded-lg",
						"bg-white/10 hover:bg-white/15",
						"text-white/70 text-xs font-medium",
						"transition-colors duration-150"
					)}
				>
					Reset
				</button>
			</div>

			{/* Debug overlay */}
			{showDebug && (
				<div
					className={cn(
						"mt-4 p-4 rounded-xl",
						"bg-[#0a0a0a] border border-white/10",
						"font-mono text-xs"
					)}
				>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<div className="text-white/40 mb-1">Velocity</div>
							<div className="text-white">
								x: {currentVelocity.x.toFixed(0)} px/s
								<br />
								y: {currentVelocity.y.toFixed(0)} px/s
							</div>
						</div>
						<div>
							<div className="text-white/40 mb-1">Projection</div>
							<div className="text-white">
								x: {projectedPos.x.toFixed(0)} px
								<br />
								y: {projectedPos.y.toFixed(0)} px
							</div>
						</div>
					</div>
					<div className="mt-3 pt-3 border-t border-white/10">
						<div className="text-white/40 mb-1">Formula</div>
						<code className="text-pink-400">
							displacement = (v × {TIME_CONSTANT} × {DECELERATION_RATE}) / (1 -{" "}
							{DECELERATION_RATE})
						</code>
					</div>
				</div>
			)}
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Code Blocks for Scrolly Steps
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECTED_DRAG_CODE = {
	physics: `// Projection Formula
// Calculate where an object would land based on its velocity
const DECELERATION_RATE = 0.996;
const TIME_CONSTANT = 1000;

function calculateProjectedDisplacement(velocity: number): number {
  return (velocity * TIME_CONSTANT * DECELERATION_RATE)
       / (1 - DECELERATION_RATE);
}

// Example: 500 px/s velocity → ~124,500 px displacement
// (with bounds clamping, it won't travel that far)`,

	velocityTracking: `import { useMotionValue, useVelocity } from "motion/react";

// Track position with motion values
const x = useMotionValue(0);
const y = useMotionValue(0);

// Derive velocity from position changes
// Returns pixels per second
const xVelocity = useVelocity(x);
const yVelocity = useVelocity(y);

// Use in drag handler
const handleDrag = () => {
  const vx = xVelocity.get();
  const vy = yVelocity.get();
  console.log(\`Velocity: \${vx}, \${vy} px/s\`);
};`,

	onDragEnd: `const handleDragEnd = (event, info) => {
  // Get current position
  const currentX = x.get();
  const currentY = y.get();

  // info.velocity contains px/s values
  const { velocity } = info;

  // Calculate projected destination
  const projectedX = currentX +
    calculateProjectedDisplacement(velocity.x);
  const projectedY = currentY +
    calculateProjectedDisplacement(velocity.y);

  // Clamp to bounds
  const finalX = clamp(projectedX, 0, maxX);
  const finalY = clamp(projectedY, 0, maxY);

  // Animate to projected position
  animate(x, finalX, springConfig);
  animate(y, finalY, springConfig);
};`,

	springAnimation: `import { animate } from "motion/react";

// Animate to projected position with spring physics
// Using stiffness/damping for organic feel
const springConfig = {
  type: "spring",
  stiffness: 300,  // Higher = snappier
  damping: 30,     // Higher = less bounce
  velocity: velocityX, // Inherit momentum
};

animate(x, targetX, springConfig);
animate(y, targetY, {
  ...springConfig,
  velocity: velocityY,
});

// Result: Element "slides" to its projected destination
// with natural deceleration and subtle bounce`,

	dropZones: `// Check if projection lands in a drop zone
const getDropZoneAtPosition = (x: number, y: number) => {
  const centerX = x + elementHalfSize;
  const centerY = y + elementHalfSize;

  for (const zone of dropZones) {
    if (
      centerX >= zone.x &&
      centerX <= zone.x + zone.width &&
      centerY >= zone.y &&
      centerY <= zone.y + zone.height
    ) {
      return zone; // Found target zone
    }
  }
  return null;
};

// If landing in a zone, snap to center
if (targetZone) {
  targetX = zone.x + zone.width / 2 - elementHalfSize;
  targetY = zone.y + zone.height / 2 - elementHalfSize;
}`,

	visualFeedback: `// Scale based on horizontal velocity
const scale = useTransform(
  xVelocity,
  [-2000, 0, 2000],  // Input range (px/s)
  [1.08, 1, 1.08],   // Output range (scale)
  { clamp: false }
);

// Rotate based on direction
const rotateZ = useTransform(
  xVelocity,
  [-1000, 0, 1000],
  [-3, 0, 3]
);

// Apply to draggable element
<motion.div
  style={{
    x, y,
    scale: isDragging ? scale : 1,
    rotateZ: isDragging ? rotateZ : 0,
  }}
  whileDrag={{ scale: 1.05 }}
  className="shadow-[0_0_30px_rgba(236,72,153,0.5)]"
/>`,
};
