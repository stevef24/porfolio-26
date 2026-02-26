import type * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { staggerContainer, slideUpSubtle } from "@/lib/motion-variants";
import type { CodeIcon } from "@hugeicons/core-free-icons";

interface StepProps {
	step: {
		id: number;
		title: string;
		icon: typeof CodeIcon;
		description: string;
	};
	isActive: boolean;
	onClick: () => void;
}

const Step: React.FC<StepProps> = ({ step, isActive, onClick }) => {
	return (
		<motion.div variants={slideUpSubtle} layout>
			<Card
				className={cn(
					"mb-4 cursor-pointer transition-colors duration-300",
					isActive ? "border-primary" : "border-muted"
				)}
				onClick={onClick}
			>
				<CardContent className="p-4 flex items-start gap-4">
					<motion.div
						className={cn(
							"p-2 rounded-full flex items-center justify-center",
							isActive
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground"
						)}
						animate={{
							scale: isActive ? 1.05 : 1,
						}}
						transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
					>
						<HugeiconsIcon icon={step.icon} size={20} />
					</motion.div>
					<div className="flex-1">
						<h3
							className={cn(
								"text-base font-medium mb-1 mt-2",
								isActive ? "text-primary" : "text-foreground"
							)}
						>
							{step.title}
						</h3>
						<AnimatePresence mode="wait">
							{isActive && (
								<motion.p
									className="text-base text-muted-foreground"
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{
										duration: 0.25,
										ease: [0.25, 0.46, 0.45, 0.94],
									}}
								>
									{step.description}
								</motion.p>
							)}
						</AnimatePresence>
					</div>
					<motion.div
						className={cn(
							"w-8 h-8 rounded-full flex items-center justify-center text-base font-bold",
							isActive
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground"
						)}
						animate={{
							scale: isActive ? 1.1 : 1,
						}}
						transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
					>
						{step.id}
					</motion.div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

interface StepListProps {
	steps: Array<{
		id: number;
		title: string;
		icon: typeof CodeIcon;
		description: string;
	}>;
	currentStep: number;
	setCurrentStep: (step: number) => void;
	setIsPlaying: (isPlaying: boolean) => void;
}

const StepList: React.FC<StepListProps> = ({
	steps,
	currentStep,
	setCurrentStep,
	setIsPlaying,
}) => {
	if (!steps || steps.length === 0) {
		return <div>No steps available.</div>;
	}

	return (
		<motion.div variants={staggerContainer} initial="hidden" animate="show">
			{steps.map((step) => (
				<Step
					key={step.id}
					step={step}
					isActive={currentStep === step.id}
					onClick={() => {
						setCurrentStep(step.id);
						setIsPlaying(false);
					}}
				/>
			))}
		</motion.div>
	);
};

export default StepList;
