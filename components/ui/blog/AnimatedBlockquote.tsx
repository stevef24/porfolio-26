"use client"

import { motion, useInView, useReducedMotion } from "motion/react"
import { useRef } from "react"

interface AnimatedBlockquoteProps {
	children: React.ReactNode
	className?: string
}

export function AnimatedBlockquote({ children, className = "" }: AnimatedBlockquoteProps) {
	const ref = useRef<HTMLQuoteElement>(null)
	const isInView = useInView(ref, { once: true, margin: "-100px" })
	const shouldReduceMotion = useReducedMotion()

	return (
		<motion.blockquote
			ref={ref}
			className={`relative my-8 pl-6 pr-4 py-4 border-l-4 border-primary/40 bg-gradient-to-r from-primary/5 to-transparent rounded-r-lg overflow-hidden ${className}`}
			initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
			animate={isInView ? (shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }) : {}}
			transition={{
				duration: 0.4,
				ease: [0.215, 0.61, 0.355, 1],
				delay: 0.08
			}}
		>
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-primary/8 to-transparent pointer-events-none"
				initial={{ scaleX: 0, transformOrigin: "left" }}
				animate={isInView && !shouldReduceMotion ? { scaleX: 1 } : {}}
				transition={{
					duration: 0.5,
					ease: [0.165, 0.84, 0.44, 1],
					delay: 0.05
				}}
			/>

			<motion.div
				className="relative z-10"
				initial={{ opacity: 0 }}
				animate={isInView ? { opacity: 1 } : {}}
				transition={{
					duration: 0.35,
					delay: shouldReduceMotion ? 0 : 0.15,
					ease: [0.25, 0.46, 0.45, 0.94]
				}}
			>
				<div className="text-lg text-foreground/90 italic font-display leading-relaxed">
					{children}
				</div>
			</motion.div>

			<motion.div
				className="absolute top-2 right-4 text-6xl text-primary/10 font-display leading-none pointer-events-none select-none"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={isInView && !shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1 }}
				transition={{
					duration: 0.4,
					delay: 0.25,
					ease: [0.165, 0.84, 0.44, 1]
				}}
			>
				&ldquo;
			</motion.div>
		</motion.blockquote>
	)
}
