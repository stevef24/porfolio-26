"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAccess, type AccessLevel } from "@/hooks/useAccess";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AccessGateProps {
  accessLevel: AccessLevel;
  lessonTitle: string;
  courseName?: string;
  className?: string;
  children: ReactNode;
}

/**
 * AccessGate Component
 *
 * Displays a paywall/lock overlay for paid lessons.
 * For Phase 4: Visual gate only, no actual payment blocking.
 * Phase 5 will add actual payment verification.
 */
export function AccessGate({
  accessLevel,
  lessonTitle,
  courseName,
  className,
  children,
}: AccessGateProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const { hasAccess, reason } = useAccess({ accessLevel });
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If user has access, just render the children
  if (hasAccess) {
    return <>{children}</>;
  }

  // Determine if we should show sign-in prompt vs purchase prompt
  const showSignInPrompt = !authLoading && !isAuthenticated;

  return (
    <div className={cn("relative", className)}>
      {/* Blurred/faded content preview */}
      <div className="pointer-events-none select-none">
        <div className="blur-sm opacity-30">{children}</div>
      </div>

      {/* Lock overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-md mx-auto px-6 py-8 bg-background/95 backdrop-blur-sm border border-border text-center">
          {/* Lock icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-muted flex items-center justify-center">
            <HugeiconsIcon
              icon={LockIcon}
              size={32}
              className="text-muted-foreground"
            />
          </div>

          {/* Title */}
          <h3 className="text-swiss-title mb-2">
            {showSignInPrompt ? "Sign In to Continue" : "Unlock This Lesson"}
          </h3>

          {/* Reason */}
          <p className="text-base text-muted-foreground mb-6 max-w-xs mx-auto">
            {showSignInPrompt
              ? "Sign in to track your progress and access premium content."
              : reason || "This lesson requires course purchase to access."}
          </p>

          {/* Lesson info */}
          <div className="mb-6 py-3 px-4 bg-muted/50 text-left">
            <p className="text-swiss-label text-muted-foreground mb-1">
              {courseName || "Course Lesson"}
            </p>
            <p className="text-base text-foreground font-medium">{lessonTitle}</p>
          </div>

          {/* CTA Button */}
          {showSignInPrompt ? (
            <>
              <button
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-swiss-label hover:bg-primary/90 transition-colors cursor-pointer w-full justify-center"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In with Email
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
              <AuthModal
                open={isAuthModalOpen}
                onOpenChange={setIsAuthModalOpen}
              />
            </>
          ) : (
            <button
              className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-swiss-label hover:bg-primary/90 transition-colors cursor-pointer w-full justify-center"
              onClick={() => {
                // Future: Integrate payment/checkout flow
                alert(
                  "Payment integration coming soon! For now, this is a visual demo."
                );
              }}
            >
              Get Full Access
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          )}

          {/* Alternative option */}
          <p className="text-base text-muted-foreground mt-4">
            Or continue browsing{" "}
            <Link
              href="/courses"
              className="text-primary hover:underline cursor-pointer"
            >
              free lessons
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default AccessGate;
