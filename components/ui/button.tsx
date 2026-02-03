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
        // Default: Subtle opacity-based background
        default: [
          "bg-[rgba(0,0,0,0.04)] hover:bg-[rgba(0,0,0,0.08)]",
          "dark:bg-[rgba(255,255,255,0.04)] dark:hover:bg-[rgba(255,255,255,0.08)]",
          "text-foreground",
          "rounded-full",
        ],
        // CTA: Solid fill with inverted contrast
        cta: [
          "bg-foreground text-background",
          "hover:opacity-90",
          "rounded-full",
        ],
        // Outline: Border with transparent background
        outline: [
          "border border-border bg-transparent",
          "hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]",
          "text-foreground",
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
          "hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]",
          "text-foreground",
          "rounded-full",
        ],
        // Destructive
        destructive: [
          "bg-red-500/10 text-red-600",
          "hover:bg-red-500/20",
          "dark:text-red-400",
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
