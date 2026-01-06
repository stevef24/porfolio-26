"use client";

import * as React from "react";
import {
	PlayIcon,
	PauseIcon,
	CodeIcon,
	CpuIcon,
	ComputerIcon,
	FlashIcon,
	DocumentCodeIcon,
	Settings01Icon,
	PackageIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StepList from "./step-list";
import { Button } from "@/components/ui/button";
import { fadeIn, slideUpSubtle } from "@/lib/motion-variants";

interface Step {
	id: number;
	title: string;
	icon: typeof CodeIcon;
	description: string;
}

interface Flows {
	traditional: Step[];
	react19: Step[];
}

const CompilerComparison = () => {
	const [currentStep, setCurrentStep] = React.useState<number>(1);
	const [activeFlow, setActiveFlow] = React.useState<"traditional" | "react19">(
		"traditional"
	);
	const [isPlaying, setIsPlaying] = React.useState<boolean>(true);

	const flows: Flows = React.useMemo(
		() => ({
			traditional: [
				{
					id: 1,
					title: "JSX Writing",
					icon: CodeIcon,
					description:
						"Developers write components using JSX, a syntax extension that allows mixing HTML-like code with JavaScript.",
				},
				{
					id: 2,
					title: "Babel Transform",
					icon: DocumentCodeIcon,
					description:
						"Babel, a JavaScript compiler, converts JSX into standard JavaScript functions that browsers can interpret.",
				},
				{
					id: 3,
					title: "Bundler Process",
					icon: PackageIcon,
					description:
						"Tools like Webpack bundle JavaScript files, including transformed JSX, into build artifacts for deployment.",
				},
				{
					id: 4,
					title: "Manual Optimization",
					icon: CpuIcon,
					description:
						"Developers manually apply optimizations using React.memo, useMemo, and useCallback to prevent unnecessary re-renders.",
				},
				{
					id: 5,
					title: "Runtime Execution",
					icon: ComputerIcon,
					description:
						"The browser executes the bundled JavaScript, with performance depending on the effectiveness of manual optimizations.",
				},
				{
					id: 6,
					title: "Debug & Optimize",
					icon: Settings01Icon,
					description:
						"Developers monitor component behavior, using tools like React DevTools to identify and address unnecessary re-renders.",
				},
			],
			react19: [
				{
					id: 1,
					title: "JSX Writing",
					icon: CodeIcon,
					description: "Developers continue to write components using JSX.",
				},
				{
					id: 2,
					title: "Build Transform",
					icon: DocumentCodeIcon,
					description:
						"Babel, along with the new React Compiler, processes JSX and JavaScript code during the build, preparing it for optimization.",
				},
				{
					id: 3,
					title: "Compiler Optimization",
					icon: CpuIcon,
					description:
						"The compiler analyzes the code to identify components for optimization, automatically apply memoization, and enforce immutability rules.",
				},
				{
					id: 4,
					title: "Build Generation",
					icon: PackageIcon,
					description:
						"The build process produces JavaScript files that include these optimizations, ready for deployment.",
				},
				{
					id: 5,
					title: "Optimized Execution",
					icon: FlashIcon,
					description:
						"The browser runs the optimized code, resulting in fewer unnecessary re-renders and improved performance.",
				},
				{
					id: 6,
					title: "Optional Configuration",
					icon: Settings01Icon,
					description:
						"Developers can adjust compiler settings to control which components or hooks are optimized, providing flexibility as needed.",
				},
			],
		}),
		[]
	);

	React.useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isPlaying) {
			timer = setInterval(() => {
				setCurrentStep((prev) =>
					prev >= flows[activeFlow].length ? 1 : prev + 1
				);
			}, 3000);
		}
		return () => clearInterval(timer);
	}, [isPlaying, activeFlow, flows]);

	return (
		<motion.div initial="hidden" animate="show" variants={fadeIn}>
			<Card className="w-full max-w-3xl mx-auto">
				<CardContent className="p-6">
					<Tabs
						value={activeFlow}
						onValueChange={(value) =>
							setActiveFlow(value as "traditional" | "react19")
						}
					>
						<motion.div
							className="flex justify-between items-center mb-4"
							variants={slideUpSubtle}
						>
							<TabsList>
								<TabsTrigger value="traditional">Traditional React</TabsTrigger>
								<TabsTrigger value="react19">React 19</TabsTrigger>
							</TabsList>
							<div className="flex items-center gap-4">
								<Button
									variant={isPlaying ? "default" : "secondary"}
									size="sm"
									onClick={() => setIsPlaying(!isPlaying)}
								>
									{isPlaying ? (
										<HugeiconsIcon icon={PauseIcon} size={16} className="mr-2" />
									) : (
										<HugeiconsIcon icon={PlayIcon} size={16} className="mr-2" />
									)}
									{isPlaying ? "Pause" : "Play"}
								</Button>
								<span className="text-base text-muted-foreground">
									Step: {currentStep}/{flows[activeFlow].length}
								</span>
							</div>
						</motion.div>
						<TabsContent value="traditional">
							<StepList
								steps={flows.traditional}
								currentStep={currentStep}
								setCurrentStep={setCurrentStep}
								setIsPlaying={setIsPlaying}
							/>
						</TabsContent>
						<TabsContent value="react19">
							<StepList
								steps={flows.react19}
								currentStep={currentStep}
								setCurrentStep={setCurrentStep}
								setIsPlaying={setIsPlaying}
							/>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default CompilerComparison;
