import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-[4px]", // 4px radius
    "px-3 py-0.5",
    "text-sm font-medium", // 14px
    "whitespace-nowrap",
    "transition-colors",
    "w-fit",
    "border border-transparent",
    "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
    "shrink-0",
    "overflow-hidden",
    "group/badge",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.08)] text-foreground",
        ],
        secondary: [
          "bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.04)] text-secondary-foreground",
          "border-border",
        ],
        outline: [
          "bg-transparent text-foreground",
          "border-border",
        ],
        destructive: [
          "bg-[rgba(220,38,38,0.1)] text-destructive",
        ],
        // Muted/ghost style
        ghost: [
          "bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.04)] text-muted-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }): JSX.Element {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
