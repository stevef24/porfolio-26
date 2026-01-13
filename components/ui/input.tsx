import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}: ComponentProps<"input">): JSX.Element {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Oatmeal input specs
        "flex w-full min-w-0",
        "h-10", // 40px height (slightly smaller than buttons)
        "px-3 py-2",
        "rounded-xs", // 2px radius per Oatmeal
        "bg-transparent",
        "border border-input", // border.strong
        "text-base text-foreground", // 16px
        "placeholder:text-muted-foreground/60",
        // Focus state
        "focus-visible:outline-none",
        "focus-visible:border-primary",
        "focus-visible:ring-2 focus-visible:ring-primary/20",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Transition
        "transition-[color,background-color,border-color,box-shadow,opacity] duration-200",
        className
      )}
      {...props}
    />
  )
}

export { Input }
