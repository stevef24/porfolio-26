import { PageHeaderShader } from "@/components/ui/PageHeaderShader";
import { Header } from "@/components/layout/Header";
import { ZenConsultation } from "@/components/ui/ZenConsultation";

// Clay blush · sage · lavender mist · warm honey
const FALLBACK_ZEN: [string, string, string, string] = [
  "rgb(242 218 205)",
  "rgb(205 222 215)",
  "rgb(220 212 235)",
  "rgb(238 225 205)",
];

export default function NotFound() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      {/* Full-page shader — absolute, behind everything */}
      <PageHeaderShader
        tokenPrefix="--not-found"
        fallbackMesh={FALLBACK_ZEN}
        className="absolute inset-0 w-full h-full"
      >
        <div />
      </PageHeaderShader>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-svh">
        <Header />

        <main className="flex-1 relative flex items-center justify-center px-4 py-16">
          {/* Ghost 404 — centered, fades in */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="ghost-404-text"
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: "clamp(180px, 32vw, 420px)",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                color: "currentColor",
              }}
            >
              404
            </span>
          </div>

          <ZenConsultation type="404" hideNumber />
        </main>
      </div>
    </div>
  );
}
