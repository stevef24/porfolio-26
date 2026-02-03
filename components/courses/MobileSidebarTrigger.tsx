"use client";

import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileSidebarTriggerProps {
  onClick: () => void;
  className?: string;
}

export function MobileSidebarTrigger({
  onClick,
  className,
}: MobileSidebarTriggerProps): JSX.Element {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("md:hidden h-9 w-9", className)}
      aria-label="Open course navigation"
    >
      <HugeiconsIcon icon={Menu01Icon} size={20} />
    </Button>
  );
}

export default MobileSidebarTrigger;
