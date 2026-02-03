"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthModal } from "./AuthModal";

interface SignInButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "xs";
}

export function SignInButton({
  className,
  variant = "outline",
  size = "sm",
}: SignInButtonProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        className={cn(className)}
      >
        Sign In
      </Button>
      <AuthModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
