import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles - Oatmeal design system
  [
    "cursor-pointer",
    "inline-flex items-center justify-center",
    "whitespace-nowrap",
    "font-medium text-base", // 16px
    "transition-colors duration-200",
    "disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "select-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "shrink-0",
    "outline-none",
    "group/button",
  ],
  {
    variants: {
      variant: {
        // Primary: Solid fill with inverted contrast
        default: [
          "bg-foreground text-background",
          "hover:bg-primary hover:text-primary-foreground",
          "rounded-full", // Pill shape
        ],
        // Secondary: Outline style
        outline: [
          "bg-transparent text-foreground",
          "border border-input",
          "hover:bg-muted hover:border-primary hover:text-primary",
          "rounded-full",
        ],
        // Secondary solid
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-muted",
          "rounded-full",
        ],
        // Ghost: No background
        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-muted",
          "rounded-full",
        ],
        // Destructive
        destructive: [
          "bg-destructive/10 text-destructive",
          "hover:bg-destructive/20",
          "rounded-full",
        ],
        // Link style
        link: [
          "text-primary underline-offset-4",
          "hover:underline",
          "p-0 h-auto",
        ],
      },
      size: {
        // Oatmeal default: 48px height
        default: "h-12 px-6 gap-2",
        // Small: 36px (header CTA)
        sm: "h-9 px-4 gap-1.5 text-sm",
        // Large: 56px
        lg: "h-14 px-8 gap-2",
        // Extra small
        xs: "h-7 px-3 gap-1 text-xs",
        // Icon buttons
        icon: "size-12",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
        "icon-xs": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }): JSX.Element {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
