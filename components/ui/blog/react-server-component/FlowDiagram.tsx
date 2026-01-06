"use client";

import * as React from "react";
import {
	ArrowRightIcon,
	ArrowDownIcon,
	DatabaseIcon,
	GlobeIcon,
	CpuIcon,
	PackageIcon,
	FlashIcon,
	PaintBrushIcon,
	PauseIcon,
	PlayIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fadeIn, slideUpSubtle, staggerContainer } from "@/lib/motion-variants";

interface StepExplanation {
	title: string;
	description: string;
}

interface StepExplanations {
	[key: number]: StepExplanation;
}

interface BoxProps {
	title: string;
	icon: IconSvgElement;
	isServer?: boolean;
	step: number;
	currentStep: number;
	onClick: (step: number) => void;
}

interface ArrowProps {
	direction?: "right" | "down";
	isActive: boolean;
}

const Box: React.FC<BoxProps> = ({
	title,
	icon,
	step,
	currentStep,
	onClick,
}) => {
	const isActive = currentStep === step;
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{
				duration: 0.3,
				delay: step * 0.1,
				ease: [0.165, 0.84, 0.44, 1],
			}}
		>
			<Card
				className={`w-24 h-24 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 ${
					isActive ? "border-primary" : "border-muted"
				}`}
				onClick={() => onClick(step)}
			>
				<CardContent className="p-2 text-center">
					<motion.div
						animate={{
							scale: isActive ? 1.1 : 1,
							rotate: isActive ? [0, -5, 5, 0] : 0,
						}}
						transition={{
							duration: 0.4,
							ease: [0.25, 0.46, 0.45, 0.94],
						}}
					>
						<HugeiconsIcon
							icon={icon}
							size={24}
							className={`mx-auto mb-2 ${
								isActive ? "text-primary" : "text-muted-foreground"
							}`}
						/>
					</motion.div>
					<p className="text-base">{title}</p>
				</CardContent>
			</Card>
		</motion.div>
	);
};

const Arrow: React.FC<ArrowProps> = ({ direction = "right", isActive }) => (
	<motion.div
		className="flex items-center justify-center p-1"
		initial={{ opacity: 0, scale: 0.5 }}
		animate={{
			opacity: 1,
			scale: 1,
			x: isActive && direction === "right" ? [0, 4, 0] : 0,
			y: isActive && direction === "down" ? [0, 4, 0] : 0,
		}}
		transition={{
			opacity: { duration: 0.3, delay: 0.2 },
			scale: { duration: 0.3, delay: 0.2 },
			x: {
				duration: 1,
				repeat: isActive ? Number.POSITIVE_INFINITY : 0,
				ease: "easeInOut",
			},
			y: {
				duration: 1,
				repeat: isActive ? Number.POSITIVE_INFINITY : 0,
				ease: "easeInOut",
			},
		}}
	>
		{direction === "right" ? (
			<HugeiconsIcon
				icon={ArrowRightIcon}
				size={20}
				className={isActive ? "text-primary" : "text-muted-foreground"}
			/>
		) : (
			<HugeiconsIcon
				icon={ArrowDownIcon}
				size={20}
				className={isActive ? "text-primary" : "text-muted-foreground"}
			/>
		)}
	</motion.div>
);

const FlowDiagram: React.FC = () => {
	const [currentStep, setCurrentStep] = React.useState<number>(1);
	const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
	const totalSteps = 6;

	const stepExplanations: StepExplanations = {
		1: {
			title: "Component Request",
			description:
				"The client initiates a request for a React Server Component. This is typically triggered by a user action or during the initial page load.",
		},
		2: {
			title: "Server-Side Rendering",
			description:
				"The server receives the request and begins the rendering process. React starts executing the server component code.",
		},
		3: {
			title: "Data Fetching",
			description:
				"During the server-side rendering process, the component can directly access databases, APIs, or other data sources.",
		},
		4: {
			title: "Serialization",
			description:
				"The server serializes the output into a format that can be efficiently transmitted to the client.",
		},
		5: {
			title: "Client Integration",
			description:
				"The client receives the serialized server component output and begins integrating it into the page.",
		},
		6: {
			title: "Interactive DOM",
			description:
				"The server component is fully integrated into the client-side DOM and becomes interactive.",
		},
	};

	React.useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isPlaying) {
			interval = setInterval(() => {
				setCurrentStep((prev) => (prev % totalSteps) + 1);
			}, 2000);
		}
		return () => clearInterval(interval);
	}, [isPlaying]);

	const handleStepClick = (step: number) => {
		setCurrentStep(step);
		setIsPlaying(false);
	};

	const isClientInitialActive = currentStep === 1;
	const isServerActive = currentStep >= 2 && currentStep <= 4;
	const isClientFinalActive = currentStep >= 5;

	return (
		<motion.div
			initial="hidden"
			animate="show"
			variants={fadeIn}
		>
			<Card className="w-full mx-auto">
				<CardContent className="p-6 space-y-6">
					<motion.div
						className="flex justify-center items-center space-x-4"
						variants={slideUpSubtle}
					>
						<Button
							onClick={() => setIsPlaying(!isPlaying)}
							variant="outline"
							size="sm"
							className="cursor-pointer"
						>
							{isPlaying ? (
								<HugeiconsIcon icon={PauseIcon} size={16} className="mr-2" />
							) : (
								<HugeiconsIcon icon={PlayIcon} size={16} className="mr-2" />
							)}
							{isPlaying ? "Pause" : "Play"}
						</Button>
						<p className="text-base">
							Step: <strong>{currentStep}</strong> of {totalSteps}
						</p>
					</motion.div>

					<motion.div
						className="space-y-4"
						variants={staggerContainer}
						initial="hidden"
						animate="show"
					>
						<motion.div variants={slideUpSubtle}>
							<Card className={isClientInitialActive ? "border-primary transition-colors duration-300" : "transition-colors duration-300"}>
								<CardHeader>
								<CardTitle className="text-base">Client - Initial</CardTitle>
								</CardHeader>
								<CardContent className="flex justify-center mb-4">
									<Box
										title="Component Request"
										icon={GlobeIcon}
										step={1}
										currentStep={currentStep}
										onClick={handleStepClick}
									/>
								</CardContent>
							</Card>
						</motion.div>

						<motion.div variants={slideUpSubtle}>
							<Card className={isServerActive ? "border-primary transition-colors duration-300" : "transition-colors duration-300"}>
								<CardHeader>
									<CardTitle className="text-base">Server Side</CardTitle>
								</CardHeader>
								<CardContent className="flex items-center justify-between mb-4">
									<Box
										title="Server-Side Rendering"
										icon={CpuIcon}
										isServer
										step={2}
										currentStep={currentStep}
										onClick={handleStepClick}
									/>
									<Arrow isActive={isServerActive} />
									<Box
										title="Data Fetching"
										icon={DatabaseIcon}
										isServer
										step={3}
										currentStep={currentStep}
										onClick={handleStepClick}
									/>
									<Arrow isActive={isServerActive} />
									<Box
										title="Serialization"
										icon={PackageIcon}
										isServer
										step={4}
										currentStep={currentStep}
										onClick={handleStepClick}
									/>
								</CardContent>
							</Card>
						</motion.div>

						<motion.div variants={slideUpSubtle}>
							<Card className={isClientFinalActive ? "border-primary transition-colors duration-300" : "transition-colors duration-300"}>
								<CardHeader>
									<CardTitle className="text-base">Client - Final</CardTitle>
								</CardHeader>
								<CardContent className="flex items-center justify-center space-x-4 mb-4">
									<Box
										title="Client Integration"
										icon={FlashIcon}
										step={5}
										currentStep={currentStep}
										onClick={handleStepClick}
									/>
									<Arrow isActive={isClientFinalActive} />
									<Box
										title="Interactive DOM"
										icon={PaintBrushIcon}
										step={6}
										currentStep={currentStep}
										onClick={handleStepClick}
									/>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>

					<AnimatePresence mode="wait">
						<motion.div
							key={currentStep}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="text-base">
										Step {currentStep}: {stepExplanations[currentStep].title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-base">
										{stepExplanations[currentStep].description}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					</AnimatePresence>

					<Separator />

					<motion.p
						className="text-base text-muted-foreground"
						variants={slideUpSubtle}
					>
						Flow: Request → Server Processing → Data → Serialization → Integration
						→ DOM
					</motion.p>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default FlowDiagram;
