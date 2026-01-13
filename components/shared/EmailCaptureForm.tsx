"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EmailCaptureStatus = "idle" | "loading" | "success" | "exists" | "error";

type EmailCaptureFormProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  source?: string;
  className?: string;
};

function getStatusMessage(
  status: EmailCaptureStatus,
  errorMessage: string
): string {
  switch (status) {
    case "success":
      return "You're in. I'll send updates when new posts drop.";
    case "exists":
      return "You're already subscribed. Thanks for being here.";
    case "error":
      return errorMessage || "Something went wrong. Try again in a moment.";
    default:
      return "";
  }
}

export function EmailCaptureForm({
  title = "Get new posts in your inbox",
  description = "Short, practical notes on what I'm building and learning.",
  buttonLabel = "Subscribe",
  source = "blog-inline",
  className,
}: EmailCaptureFormProps): JSX.Element {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<EmailCaptureStatus>("idle");
  const [message, setMessage] = React.useState("");
  const [honeypot, setHoneypot] = React.useState("");
  const inputId = React.useId();

  const isLocked = status === "loading" || status === "success" || status === "exists";
  const statusMessage = getStatusMessage(status, message);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    void fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: trimmedEmail,
        source,
        website: honeypot,
      }),
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));

        if (!response.ok || payload?.ok === false) {
          setStatus("error");
          setMessage(payload?.error || "Unable to subscribe right now.");
          return;
        }

        if (payload?.status === "exists") {
          setStatus("exists");
          setEmail("");
          return;
        }

        setStatus("success");
        setEmail("");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Unable to subscribe right now.");
      });
  }

  return (
    <section
      className={cn(
        "not-prose my-8 border border-primary/30 bg-primary/5 p-8 rounded-xl",
        className
      )}
    >
      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <h3 className="text-2xl font-medium text-foreground">{title}</h3>
          <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <Input
            id={inputId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLocked}
            className="h-11 flex-1"
          />
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
          <Button
            type="submit"
            disabled={isLocked}
            className="h-11 px-8 cursor-pointer"
          >
            {status === "loading" ? "Subscribing..." : buttonLabel}
          </Button>
        </form>

        <div
          className="min-h-[1.5rem] text-base text-muted-foreground"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      </div>
    </section>
  );
}
