"use client";

import { useCallback, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthStep = "email" | "sent" | "error";

export function AuthModal({
  open,
  onOpenChange,
}: AuthModalProps): JSX.Element {
  const { signInWithEmail } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<AuthStep>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    function handleSubmit(e: FormEvent): Promise<void> {
      e.preventDefault();

      if (!email.trim()) return Promise.resolve();

      setIsLoading(true);
      setErrorMessage("");

      return signInWithEmail(email.trim()).then(({ error }) => {
        setIsLoading(false);

        if (error) {
          setErrorMessage(error.message);
          setStep("error");
          return;
        }

        setStep("sent");
      });
    },
    [email, signInWithEmail]
  );

  const handleReset = useCallback(function handleReset(): void {
    setEmail("");
    setStep("email");
    setErrorMessage("");
  }, []);

  const handleClose = useCallback(function handleClose(): void {
    onOpenChange(false);
    // Reset after animation completes
    setTimeout(handleReset, 200);
  }, [onOpenChange, handleReset]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        {step === "email" && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader>
              <DialogTitle className="text-swiss-title">Sign In</DialogTitle>
              <DialogDescription>
                Enter your email to receive a magic link. No password required.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-swiss-label">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner />
                    Sending...
                  </span>
                ) : (
                  "Send Magic Link"
                )}
              </Button>
            </form>
          </motion.div>
        )}

        {step === "sent" && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-4"
          >
            <div className="mb-4 inline-flex items-center justify-center size-12 bg-primary/10">
              <MailIcon className="size-6 text-primary" />
            </div>

            <DialogHeader className="text-center">
              <DialogTitle className="text-swiss-title">
                Check Your Email
              </DialogTitle>
              <DialogDescription className="mt-2">
                We sent a magic link to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Click the link in the email to sign in.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-2">
              <Button variant="outline" onClick={handleReset} className="w-full">
                Use a Different Email
              </Button>
              <p className="text-base text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder.
              </p>
            </div>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-4"
          >
            <div className="mb-4 inline-flex items-center justify-center size-12 bg-destructive/10">
              <ErrorIcon className="size-6 text-destructive" />
            </div>

            <DialogHeader className="text-center">
              <DialogTitle className="text-swiss-title">
                Something Went Wrong
              </DialogTitle>
              <DialogDescription className="mt-2">
                {errorMessage || "Failed to send magic link. Please try again."}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <Button onClick={handleReset} className="w-full">
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Simple inline icons to avoid external dependencies
function LoadingSpinner({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={cn("animate-spin size-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}
