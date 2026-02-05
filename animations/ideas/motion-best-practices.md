# Motion (React) Best Practices for Educational Visuals

This document targets Motion for React (the motion.dev library, imported from `motion/react`) and focuses on educational visuals.

## Library Target (Motion for React)

- Install: `npm install motion`.
- Import: `import { motion } from "motion/react"`.
- Use Motion components to animate React elements with `initial`, `animate`, and `exit`. [motion.dev](https://motion.dev/docs/react)

## Core Motion Building Blocks (Use These First)

- `motion` components for declarative animation. [motion.dev](https://motion.dev/docs/react-animation)
- `MotionConfig` to set global transitions and reduced-motion behavior. [motion.dev](https://motion.dev/docs/react-motion-config)
- `AnimatePresence` for exit animations. [motion.dev](https://motion.dev/docs/react-animate-presence)
- `layout` and `layoutId` for layout and shared-element transitions. [motion.dev](https://motion.dev/docs/react-layout-animations)
- `LayoutGroup` to synchronize layout animations across siblings. [motion.dev](https://motion.dev/docs/react-layout-animations)
- `useInView` for scroll-triggered reveals. [motion.dev](https://motion.dev/docs/react-use-in-view)
- `useReducedMotion` to respect user preferences. [motion.dev](https://motion.dev/motion/use-reduced-motion/)

## Educational Motion Principles (What Works)

- Purposeful motion only. Emil Kowalski emphasizes that every animation should have a purpose or it will feel slow, unpredictable, or annoying. [emilkowal.ski](https://emilkowal.ski/ui/you-dont-need-animations)
- Frequency matters. If users see it many times per day, animation should be minimal or removed. [emilkowal.ski](https://emilkowal.ski/ui/you-dont-need-animations)
- Keep UI animations fast. Emil suggests most UI animations should stay under ~300ms. [emilkowal.ski](https://emilkowal.ski/ui/you-dont-need-animations)
- Keep transitions short and readable. Material Motion recommends fast transitions that do not make users wait. [Material Motion](https://m1.material.io/motion/duration-easing.html)
- Use duration proportional to distance. Material Motion recommends dynamic durations that scale with travel distance. [Material Motion](https://m1.material.io/motion/duration-easing.html)

## Educational Motion Principles (What Does Not Work)

- Long or decorative animations that do not clarify the concept. [emilkowal.ski](https://emilkowal.ski/ui/you-dont-need-animations)
- Animations that slow repeated, high-frequency actions. [emilkowal.ski](https://emilkowal.ski/ui/you-dont-need-animations)
- Large scale, parallax, or depth shifts that can trigger discomfort. [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility)

## Accessibility Baseline (Non-Negotiable)

- Provide a reduced-motion mode. Use `MotionConfig` with `reducedMotion="user"` and/or `useReducedMotion` to remove transforms while keeping opacity or color changes. [motion.dev](https://motion.dev/docs/react-motion-config), [motion.dev](https://motion.dev/motion/use-reduced-motion/)
- Avoid motion that can cause discomfort (parallax, zooming, depth changes). Apple recommends reducing or replacing these effects and suggests fades or highlights instead. [Apple Reduced Motion](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- WCAG 2.3.3 requires a way to disable interaction-triggered motion unless essential. [WCAG 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions)

## Motion Defaults (Recommended Starting Point)

- Global `MotionConfig` transition: `duration: 0.35`, `ease: "easeInOut"`. [motion.dev](https://motion.dev/docs/react-motion-config), [motion.dev](https://motion.dev/docs/react-transitions)
- Spring defaults for small UI pieces: `type: "spring"`, `stiffness: 300`, `damping: 30` (adjust per visual). [motion.dev](https://motion.dev/docs/react-transitions)
- Stagger children: 30-60ms (keep subtle). [motion.dev](https://motion.dev/docs/react-transitions)
- Use tween for precision (meters, dials), spring for natural UI motion (cards, tokens). [motion.dev](https://motion.dev/docs/react-transitions)

## Motion Patterns We Will Use

- Variants for multi-step sequences (flows, timelines). [motion.dev](https://motion.dev/docs/react-animation)
- `layout` for stacking and bucket fills that should feel stable. [motion.dev](https://motion.dev/docs/react-layout-animations)
- `layoutId` for shared elements like moving summary cards. [motion.dev](https://motion.dev/docs/react-layout-animations)
- `AnimatePresence` for enter/exit states in comparisons. [motion.dev](https://motion.dev/docs/react-animate-presence)
- `useInView` to animate once when the visual enters the viewport. [motion.dev](https://motion.dev/docs/react-use-in-view)

## How This Applies to Our Course Visuals

- Each visual should teach one idea only.
- A cause -> effect animation should complete in under a second.
- Use interaction only when it helps the reader test a hypothesis (ex: adding tokens to see noise).
- Always ship a static fallback for reduced motion.
