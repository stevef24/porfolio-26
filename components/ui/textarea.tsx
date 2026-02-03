import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}: ComponentProps<"textarea">): JSX.Element {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Match input styling
        "flex w-full min-w-0",
        "min-h-16 field-sizing-content",
        "px-3 py-2",
        "rounded-[6px]",
        "bg-transparent",
        "border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.12)]",
        "text-base text-foreground",
        "placeholder:text-muted-foreground/60",
        // Focus state
        "focus-visible:outline-none",
        "focus-visible:border-primary",
        "focus-visible:ring-2 focus-visible:ring-primary/20",
        // Invalid state
        "aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Transition
        "transition-[color,background-color,border-color,box-shadow,opacity] duration-200",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
