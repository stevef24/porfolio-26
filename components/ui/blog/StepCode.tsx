"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

interface CodeStep {
	title?: string;
	description?: string;
	code: string;
	highlightLines?: number[];
}

interface StepCodeProps {
	steps: CodeStep[];
	language?: string;
	className?: string;
}

const StepCode: React.FC<StepCodeProps> = ({
	steps,
	language = "tsx",
	className,
}) => {
	const [currentStep, setCurrentStep] = React.useState(0);
	const containerRef = React.useRef<HTMLDivElement>(null);

	const goToNext = React.useCallback(() => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	}, [currentStep, steps.length]);

	const goToPrev = React.useCallback(() => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	}, [currentStep]);

	// Keyboard navigation
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!containerRef.current?.contains(document.activeElement) &&
				document.activeElement !== containerRef.current) {
				return;
			}
			if (e.key === "ArrowRight" || e.key === "ArrowDown") {
				e.preventDefault();
				goToNext();
			} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				e.preventDefault();
				goToPrev();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [goToNext, goToPrev]);

	const step = steps[currentStep];

	return (
		<div
			ref={containerRef}
			tabIndex={0}
			className={cn("my-8 outline-none focus:ring-2 focus:ring-primary/20 rounded-lg", className)}
		>
			{/* Header with navigation */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					{/* Step indicators */}
					<div className="flex items-center gap-1.5">
						{steps.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentStep(index)}
								className={cn(
									"w-2 h-2 rounded-full transition-all duration-200",
									index === currentStep
										? "bg-primary w-4"
										: "bg-muted-foreground/30 hover:bg-muted-foreground/50"
								)}
								aria-label={`Go to step ${index + 1}`}
							/>
						))}
					</div>
					<span className="text-base text-muted-foreground font-mono">
						{currentStep + 1}/{steps.length}
					</span>
				</div>

				{/* Navigation buttons */}
				<div className="flex items-center gap-1">
					<button
						onClick={goToPrev}
						disabled={currentStep === 0}
						className={cn(
							"p-1.5 rounded-md transition-colors",
							currentStep === 0
								? "text-muted-foreground/30 cursor-not-allowed"
								: "text-muted-foreground hover:text-foreground hover:bg-muted"
						)}
						aria-label="Previous step"
					>
						<HugeiconsIcon icon={ArrowLeftIcon} size={16} />
					</button>
					<button
						onClick={goToNext}
						disabled={currentStep === steps.length - 1}
						className={cn(
							"p-1.5 rounded-md transition-colors",
							currentStep === steps.length - 1
								? "text-muted-foreground/30 cursor-not-allowed"
								: "text-muted-foreground hover:text-foreground hover:bg-muted"
						)}
						aria-label="Next step"
					>
						<HugeiconsIcon icon={ArrowRightIcon} size={16} />
					</button>
				</div>
			</div>

			{/* Step title and description */}
			<AnimatePresence mode="wait">
				{(step.title || step.description) && (
					<motion.div
						key={`info-${currentStep}`}
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 8 }}
						transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
						className="mb-3"
					>
						{step.title && (
							<h4 className="text-base font-medium text-foreground mb-1">
								{step.title}
							</h4>
						)}
						{step.description && (
							<p className="text-base text-muted-foreground leading-relaxed">
								{step.description}
							</p>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Code block */}
			<div className="relative rounded-lg border border-border bg-muted/50 overflow-hidden">
				{/* Language badge */}
				<div className="absolute top-2 right-2 z-10">
					<span className="px-2.5 py-1 text-base font-mono text-muted-foreground bg-background/80 rounded border border-border">
						{language}
					</span>
				</div>

				<AnimatePresence mode="wait">
					<motion.div
						key={`code-${currentStep}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
					>
						<pre className="p-4 pt-10 overflow-x-auto text-base">
							<code className="font-mono text-foreground/90">
								{step.code.split("\n").map((line, lineIndex) => {
									const isHighlighted = step.highlightLines?.includes(
										lineIndex + 1
									);
									return (
										<div
											key={lineIndex}
											className={cn(
												"px-2 -mx-2 transition-colors duration-200",
												isHighlighted &&
													"bg-primary/10 border-l-2 border-primary"
											)}
										>
											<span className="inline-block w-8 text-muted-foreground/50 select-none text-right mr-4 text-base">
												{lineIndex + 1}
											</span>
											{line || " "}
										</div>
									);
								})}
							</code>
						</pre>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Keyboard hint */}
			<div className="mt-2 flex justify-center">
				<span className="text-base text-muted-foreground/60">
					Use arrow keys or click to navigate
				</span>
			</div>
		</div>
	);
};

export default StepCode;
