"use client";

import { motion, useReducedMotion } from "motion/react";
import { SidebarLeft01Icon, SidebarRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion-variants";

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Floating toggle button for course sidebar.
 * Shows at left edge when sidebar is collapsed.
 * Shows inside sidebar header when expanded.
 */
export function SidebarToggle({
  isCollapsed,
  onToggle,
  className,
}: SidebarToggleProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        "flex items-center justify-center",
        "w-8 h-8 rounded-md",
        "bg-background/80 backdrop-blur-sm",
        "border border-border",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-accent",
        "transition-colors duration-150",
        "cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      transition={springSnappy}
      aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
      title={isCollapsed ? "Open sidebar" : "Close sidebar"}
    >
      <HugeiconsIcon
        icon={isCollapsed ? SidebarRight01Icon : SidebarLeft01Icon}
        size={16}
      />
    </motion.button>
  );
}

export default SidebarToggle;
