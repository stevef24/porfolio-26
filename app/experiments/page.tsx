import { experiments } from "@/data/experiments";
import { ExperimentGrid } from "@/components/experiments/ExperimentGrid";
import { Header } from "@/components/layout/Header";
import { PageHeaderShader } from "@/components/ui/PageHeaderShader";

export const metadata = {
  title: "Experiments",
  description: "A lab of interactive demos, animations, and UI experiments.",
};

export default function ExperimentsPage() {
  return (
    <div className="min-h-svh flex flex-col bg-transparent">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>
      <Header />

      <main id="main-content" className="flex-1">
        {/* Full-bleed shader header */}
        <PageHeaderShader
          tokenPrefix="--experiments-hero"
          fallbackMesh={[
            "rgb(255 251 235)",
            "rgb(254 243 199)",
            "rgb(255 237 213)",
            "rgb(252 229 176)",
          ]}
          className="mb-10"
        >
          <div className="px-6 md:px-10 lg:px-16 pt-16 pb-12 md:pt-20 lg:pt-24">
            <div className="max-w-6xl mx-auto">
              <p className="text-swiss-label text-foreground/50 mb-2">Lab</p>
              <h1 className="text-swiss-section mb-4">Experiments</h1>
              <p className="text-swiss-body text-foreground/60 max-w-xl">
                Interactive demos, animations, and UI explorations. Each one
                built to understand something deeply.
              </p>
            </div>
          </div>
        </PageHeaderShader>

        {/* Grid — constrained to max-w-6xl to avoid feeling too stretched */}
        <div className="px-6 md:px-10 lg:px-16 pb-28">
          <div className="max-w-6xl mx-auto">
            <ExperimentGrid experiments={experiments} />
          </div>
        </div>
      </main>
    </div>
  );
}
