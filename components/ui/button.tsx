import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles - minimal, contrast-safe across light/dark
  [
    "cursor-pointer",
    "inline-flex items-center justify-center",
    "whitespace-nowrap",
    "font-medium text-sm", // 14px
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
        // Default: subtle filled pill
        default: [
          "border border-transparent",
          "bg-[var(--btn-subtle-bg)]",
          "text-[var(--btn-subtle-fg)]",
          "hover:bg-[var(--btn-subtle-bg-hover)]",
          "rounded-full",
        ],
        // CTA: high-contrast solid pill
        cta: [
          "border border-transparent",
          "bg-[var(--btn-solid-bg)]",
          "text-[var(--btn-solid-fg)]",
          "hover:bg-[var(--btn-solid-bg-hover)]",
          "rounded-full",
        ],
        // Outline: low-chroma stroke, subtle hover fill
        outline: [
          "border border-[var(--btn-outline-border)]",
          "bg-transparent",
          "text-[var(--btn-subtle-fg)]",
          "hover:bg-[var(--btn-subtle-bg)]",
          "rounded-full",
        ],
        // Secondary: slightly stronger subtle fill
        secondary: [
          "border border-transparent",
          "bg-[var(--btn-subtle-bg-hover)]",
          "text-[var(--btn-subtle-fg)]",
          "hover:bg-[var(--btn-subtle-bg)]",
          "rounded-full",
        ],
        // Ghost: text-first with light hover
        ghost: [
          "border border-transparent",
          "text-[var(--btn-subtle-fg)]",
          "hover:bg-[var(--btn-subtle-bg)]",
          "rounded-full",
        ],
        // Destructive
        destructive: [
          "border border-red-500/25",
          "bg-red-500/10 text-red-700",
          "hover:bg-red-500/18",
          "dark:text-red-300 dark:border-red-400/35",
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
        // OpenAI-inspired defaults: 40px baseline
        default: "h-10 px-5 gap-2",
        // Small: 36px
        sm: "h-9 px-4 gap-1.5 text-sm",
        // Large: 44px
        lg: "h-11 px-6 gap-2 text-sm",
        // Extra small
        xs: "h-8 px-3 gap-1 text-xs",
        // Icon buttons
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
        "icon-xs": "size-8",
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
