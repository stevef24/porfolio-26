# Visual Refinements - Motion (React) Specific Suggestions

These suggestions improve clarity and cohesion using Motion for React patterns.

## Global Improvements
- Use `MotionConfig` to unify timing and reduced-motion behavior across all visuals. [motion.dev](https://motion.dev/docs/react-motion-config)
- Use `variants` for multi-step sequences so parents control orchestration. [motion.dev](https://motion.dev/docs/react-animation)
- Use `layout` and `layoutId` for diagrams where items move or resize. [motion.dev](https://motion.dev/docs/react-layout-animations)
- Use `AnimatePresence` when showing or hiding elements. [motion.dev](https://motion.dev/docs/react-animate-presence)
- Use `useInView` to reveal visuals only once on scroll. [motion.dev](https://motion.dev/docs/react-use-in-view)
- Respect `useReducedMotion` for all animated visuals. [motion.dev](https://motion.dev/motion/use-reduced-motion/)

## Visual-Specific Notes

### Visual 01 - Context Budget Bucket
- Use `layout` for token positions so the stack feels stable as it fills.
- Use a short spring for the drop-in tokens; use a tween for overflow to feel like a spill.

### Visual 02 - Context Composition Stack
- Use parent/child variants with staggered entrance.

### Visual 03 - Plan -> Clear -> Execute Flow
- Use variants to sync arrow pulses and tile highlights.
- Use tweens for arrows to keep clarity.

### Visual 04 - Signal vs Noise Dial
- Use a tween for the needle to keep the movement readable.
- Tie the counter value to the needle animation.

### Visual 05 - MCP Bloat Meter
- Use `layout` for icon stacking so the meter feels stable.
- Only show warnings when entering Heavy.

### Visual 06 - MCP Architecture Map
- Use a line-draw animation for arrows.

### Visual 07 - Subagent Split Context
- Use `layoutId` for the summary card so it feels like the same object moving.

### Visual 08 - Hook Timeline
- Use a moving highlight across the line with node glow on arrival.

### Visual 09 - CLI + Tools + MCP Stack
- Use stacked `layout` transitions with a mild spring settle.

### Visual 10 - Changelog Scan Checklist
- Use a small stagger for checkmark appearance.

### Visual 11 - Context Trim Example
- Use a brightness or outline shift for the "After" card.

### Visual 12 - Permissions Safety Ladder
- Use a single highlight bar that moves upward.

### Visual 13 - Session Memory Note
- Use a short typing cursor reveal, then fade in the bullets.
