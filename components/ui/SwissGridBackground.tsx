import { cn } from "@/lib/utils";

interface SwissGridBackgroundProps {
  /** Show subtle dot pattern (default: false) */
  showDots?: boolean;
  /** Additional className for customization */
  className?: string;
}

/**
 * SwissGridBackground - Minimal background component
 *
 * Design Philosophy (OpenAI-inspired):
 * - Clean, plain backgrounds
 * - Uses CSS variables for theme-aware colors
 * - Optional subtle dot pattern for texture
 * - No complex gradients or noise
 */
export function SwissGridBackground({
  showDots = false,
  className,
}: SwissGridBackgroundProps): JSX.Element {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 select-none pointer-events-none",
        "bg-background",
        className
      )}
      aria-hidden="true"
    >
      {showDots && (
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      )}
    </div>
  );
}

export default SwissGridBackground;
