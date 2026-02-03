import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

function Card({
  className,
  ...props
}: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="card"
      className={cn(
        // Oatmeal card specs
        "bg-card text-card-foreground",
        "rounded-[6px]", // 6px radius
        "border border-border", // 1px subtle border
        "shadow-none", // No shadows - flat OpenAI style
        "overflow-hidden",
        "flex flex-col",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({
  className,
  ...props
}: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5",
        "px-6 pt-6", // Oatmeal: 24px padding
        className
      )}
      {...props}
    />
  )
}

function CardTitle({
  className,
  ...props
}: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="card-title"
      className={cn("text-base font-medium text-foreground", className)}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({
  className,
  ...props
}: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({
  className,
  ...props
}: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pb-6", className)} // 24px padding
      {...props}
    />
  )
}

function CardFooter({
  className,
  ...props
}: ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center",
        "px-6 pb-6",
        "pt-0",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
