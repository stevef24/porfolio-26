"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FocusModeToggleProps {
	mode: "split" | "read";
	onToggle: () => void;
	disabled?: boolean;
	className?: string;
	label?: string;
}

export function FocusModeToggle({
	mode,
	onToggle,
	disabled = false,
	className,
	label = "Focus mode",
}: FocusModeToggleProps): JSX.Element {
	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onClick={onToggle}
			aria-pressed={mode === "read"}
			aria-disabled={disabled}
			disabled={disabled}
			className={cn(className)}
		>
			{label}
		</Button>
	);
}
