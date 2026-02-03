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
        "rounded-[6px]",
        "bg-transparent",
        "border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.12)]",
        "text-base text-foreground", // 16px
        "placeholder:text-muted-foreground/60",
        // Focus state
        "focus-visible:outline-none",
        "focus:border-[rgba(0,0,0,0.3)] dark:focus:border-[rgba(255,255,255,0.3)]",
        "focus-visible:ring-0",
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
