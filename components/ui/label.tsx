"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>): JSX.Element {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-sm font-medium", // 14px, medium weight
        "text-foreground",
        "leading-none",
        "flex items-center gap-2",
        "select-none",
        // Peer disabled state
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        // Group disabled state
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
