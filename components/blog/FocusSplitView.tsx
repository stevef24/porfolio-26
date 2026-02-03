"use client";

import { useEffect, useState, type ReactNode } from "react";
import { FocusSplitLayout } from "@/components/blog/FocusSplitLayout";
import { FocusModeToggle } from "@/components/blog/FocusModeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface FocusSplitViewProps {
	left: ReactNode;
	right: ReactNode;
	panelWidth?: number;
	className?: string;
}

export function FocusSplitView({
	left,
	right,
	panelWidth = 420,
	className,
}: FocusSplitViewProps): JSX.Element {
	const isMobile = useIsMobile();
	const [mode, setMode] = useState<"split" | "read">("split");

	useEffect(() => {
		if (isMobile && mode !== "read") {
			setMode("read");
		}
	}, [isMobile, mode]);

	const handleToggle = () => {
		if (isMobile) return;
		setMode((prev) => (prev === "split" ? "read" : "split"));
	};

	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex items-center justify-end">
				<FocusModeToggle
					mode={mode}
					onToggle={handleToggle}
					disabled={isMobile}
				/>
			</div>
			<FocusSplitLayout
				mode={mode}
				left={left}
				right={right}
				panelWidth={panelWidth}
			/>
		</div>
	);
}
