/**
 * Projected Drag Steps - Interactive physics-based drag tutorial
 *
 * Import these steps in your MDX file and pass to the Scrolly component.
 */

import type { ScrollyCodeStep } from "@/lib/scrolly/types";

export const projectedDragSteps: ScrollyCodeStep[] = [
	{
		id: "physics-formula",
		title: "The Projection Formula",
		body: "At the heart of projected drag is a simple physics formula. Given an object's velocity and a deceleration rate, we can calculate where it would come to rest if it kept sliding. This is the same math behind iOS scroll momentum.",
		code: `// Projection Formula
// Calculate where an object would land based on its velocity

const DECELERATION_RATE = 0.996;
const TIME_CONSTANT = 1000; // milliseconds

function calculateProjectedDisplacement(velocity: number): number {
  return (velocity * TIME_CONSTANT * DECELERATION_RATE)
       / (1 - DECELERATION_RATE);
}

// Example calculations:
// 500 px/s → ~124,500 px projected displacement
// (clamped to bounds in practice)`,
		lang: "ts",
		file: "physics.ts",
		focusLines: [7, 8, 9],
	},
	{
		id: "velocity-tracking",
		title: "Tracking Velocity in Real-Time",
		body: "Motion's useVelocity hook derives velocity from any motion value. As the user drags, we get the current speed in pixels per second. This real-time tracking is what makes the projection feel responsive.",
		code: `import {
  useMotionValue,
  useVelocity,
  useMotionValueEvent
} from "motion/react";

// Track position with motion values
const x = useMotionValue(0);
const y = useMotionValue(0);

// Derive velocity from position changes
// Returns pixels per second, updated every frame
const xVelocity = useVelocity(x);
const yVelocity = useVelocity(y);

// Optional: Listen to velocity changes
useMotionValueEvent(xVelocity, "change", (latest) => {
  console.log(\`X velocity: \${latest} px/s\`);
});`,
		lang: "tsx",
		file: "hooks.tsx",
		focusLines: [12, 13, 14],
	},
	{
		id: "on-drag-end",
		title: "Calculating the Landing Position",
		body: "When the user releases the drag, we grab the final velocity from the event info and calculate where the element should land. The projection gives us the raw destination, then we clamp it to valid bounds.",
		code: `const handleDragEnd = (
  event: PointerEvent,
  info: PanInfo
) => {
  // Current position when released
  const currentX = x.get();
  const currentY = y.get();

  // info.velocity contains px/s at release
  const { velocity } = info;

  // Project where it would land
  const projectedX = currentX +
    calculateProjectedDisplacement(velocity.x);
  const projectedY = currentY +
    calculateProjectedDisplacement(velocity.y);

  // Clamp to canvas bounds
  const finalX = clamp(projectedX, 0, maxX);
  const finalY = clamp(projectedY, 0, maxY);

  // Animate to projected position...
};`,
		lang: "tsx",
		file: "handlers.tsx",
		focusLines: [12, 13, 14, 15, 16, 17],
	},
	{
		id: "spring-animation",
		title: "Spring Animation with Momentum",
		body: "The magic happens when we animate to the projected position using spring physics. By passing the release velocity into the spring config, the animation inherits the drag momentum—creating that satisfying iOS-like slide.",
		code: `import { animate } from "motion/react";

// Animate to projected position with spring physics
// Inheriting velocity creates natural momentum

const springConfig = {
  type: "spring" as const,
  stiffness: 300,  // Higher = snappier snap
  damping: 30,     // Higher = less bounce
  velocity: velocityX, // Inherit the momentum!
};

animate(x, targetX, springConfig);
animate(y, targetY, {
  ...springConfig,
  velocity: velocityY,
});

// Result: Element "slides" to its projected destination
// with natural deceleration and subtle spring settle`,
		lang: "tsx",
		file: "animation.tsx",
		focusLines: [6, 7, 8, 9, 10],
	},
	{
		id: "drop-zones",
		title: "Snapping to Drop Zones",
		body: "For practical UX, we check if the projected landing position falls inside any drop zones. If it does, we snap to the zone center instead of the raw projection. This combines momentum physics with intentional interaction design.",
		code: `// Check if projection lands in a drop zone
const getDropZoneAtPosition = (
  posX: number,
  posY: number
): DropZone | null => {
  // Use element center for hit testing
  const centerX = posX + elementHalfSize;
  const centerY = posY + elementHalfSize;

  for (const zone of dropZones) {
    if (
      centerX >= zone.x &&
      centerX <= zone.x + zone.width &&
      centerY >= zone.y &&
      centerY <= zone.y + zone.height
    ) {
      return zone; // Found target zone!
    }
  }
  return null;
};

// If landing in a zone, snap to its center
if (targetZone) {
  targetX = zone.x + zone.width / 2 - elementHalfSize;
  targetY = zone.y + zone.height / 2 - elementHalfSize;
}`,
		lang: "tsx",
		file: "dropzones.tsx",
		focusLines: [10, 11, 12, 13, 14, 15, 16, 17, 18],
	},
	{
		id: "visual-feedback",
		title: "Dynamic Visual Feedback",
		body: "The final touch is real-time visual feedback during the drag. We use useTransform to derive scale and rotation from velocity—faster drags create subtle tilting and scaling that makes the interaction feel physical and alive.",
		code: `import { useTransform } from "motion/react";

// Scale based on horizontal velocity
const scale = useTransform(
  xVelocity,
  [-2000, 0, 2000],  // Input range (px/s)
  [1.08, 1, 1.08],   // Output range (scale)
  { clamp: false }
);

// Tilt based on direction
const rotateZ = useTransform(
  xVelocity,
  [-1000, 0, 1000],
  [-3, 0, 3]  // degrees
);

// Apply to the draggable element
<motion.div
  style={{
    x, y,
    scale: isDragging ? scale : 1,
    rotateZ: isDragging ? rotateZ : 0,
  }}
  whileDrag={{ scale: 1.05 }}
  className="shadow-[0_0_30px_rgba(236,72,153,0.5)]"
/>`,
		lang: "tsx",
		file: "feedback.tsx",
		focusLines: [4, 5, 6, 7, 8, 9, 12, 13, 14, 15],
	},
];
