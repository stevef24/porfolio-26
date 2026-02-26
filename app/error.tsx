"use client";

import { useEffect } from "react";
import { PageHeaderShader } from "@/components/ui/PageHeaderShader";
import { Header } from "@/components/layout/Header";
import { ZenConsultation } from "@/components/ui/ZenConsultation";

const FALLBACK_AMBER: [string, string, string, string] = [
  "rgb(254 226 210)",
  "rgb(252 200 180)",
  "rgb(255 235 220)",
  "rgb(248 215 195)",
];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <Header />

      {/* Decorative shader stripe — subtle top accent, not full-page */}
      <PageHeaderShader
        tokenPrefix="--error-page"
        fallbackMesh={FALLBACK_AMBER}
        className="h-36 shrink-0"
      >
        <div />
      </PageHeaderShader>

      {/* Content on clean background */}
      <main className="flex-1 relative flex items-center justify-center px-4 py-16">
        {/* Ghost "error" — very faint background texture */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "clamp(80px, 18vw, 200px)",
              lineHeight: 1,
              opacity: 0.04,
              letterSpacing: "-0.03em",
              color: "currentColor",
            }}
          >
            error
          </span>
        </div>

        <ZenConsultation
          type="error"
          errorMessage={error.message || undefined}
          onReset={reset}
        />
      </main>
    </div>
  );
}
