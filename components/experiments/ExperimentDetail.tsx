import { ViewTransition } from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ReactIcon,
  FramerIcon,
  NextIcon,
  Motion01Icon,
  Typescript01Icon,
  JavaScriptIcon,
  PythonIcon,
  ApiIcon,
  Package01Icon,
} from "@hugeicons/core-free-icons";
import type { Experiment } from "@/data/experiments";

const TECH_META: Record<string, { icon: IconSvgElement; color: string }> = {
  motion: { icon: FramerIcon, color: "#9b5de5" },
  react: { icon: ReactIcon, color: "#61dafb" },
  "next.js": { icon: NextIcon, color: "#888888" },
  "anime.js": { icon: Motion01Icon, color: "#ff7c3a" },
  typescript: { icon: Typescript01Icon, color: "#3178c6" },
  javascript: { icon: JavaScriptIcon, color: "#f7df1e" },
  python: { icon: PythonIcon, color: "#3776ab" },
  api: { icon: ApiIcon, color: "#888888" },
  default: { icon: Package01Icon, color: "#888888" },
};

interface ExperimentDetailProps {
  experiment: Experiment;
}

function formatTechLine(t: Experiment["tech"][number]) {
  if (t.category === "library") {
    return (
      <span>
        <span className="text-muted-foreground/70">import</span>{" "}
        <span className="text-muted-foreground/70">{"{ "}</span>
        <span className="text-foreground">{t.name}</span>
        <span className="text-muted-foreground/70">{" }"}</span>{" "}
        <span className="text-muted-foreground/70">from</span>{" "}
        <span className="text-muted-foreground/70">&quot;{t.name.toLowerCase()}&quot;</span>
      </span>
    );
  }
  if (t.category === "api") {
    return (
      <span className="text-muted-foreground/70">
        {"// uses: "}
        <span className="text-foreground">{t.name}</span>
        {" API"}
      </span>
    );
  }
  // tool
  return (
    <span className="text-muted-foreground/70">
      {"// tool: "}
      <span className="text-foreground">{t.name}</span>
    </span>
  );
}

export function ExperimentDetail({ experiment }: ExperimentDetailProps) {
  const { slug, title, description, preview, tech, githubUrl, demoUrl, body } = experiment;

  return (
    <article className="max-w-3xl mx-auto">
      {/* Preview */}
      <ViewTransition name={`experiment-preview-${slug}`}>
        <div className="relative aspect-video bg-muted/30 rounded-[6px] overflow-hidden mb-8 border border-border/60">
          {preview.type === "image" && (
            <img
              src={preview.src}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
          {preview.type === "video" && (
            <video
              src={preview.src}
              poster={preview.poster}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          {preview.type === "gif" && (
            <img src={preview.src} alt={title} className="w-full h-full object-cover" />
          )}
        </div>
      </ViewTransition>

      {/* Title */}
      <ViewTransition name={`experiment-title-${slug}`}>
        <h1 className="text-swiss-hero mb-4">
          {title}
        </h1>
      </ViewTransition>

      {/* Description */}
      <ViewTransition name={`experiment-description-${slug}`}>
        <p className="text-swiss-body mb-8">
          {description}
        </p>
      </ViewTransition>

      {/* Tech Stack */}
      {tech.length > 0 && (
        <div className="mb-8">
          <p className="text-swiss-label mb-3">Built with</p>
          <pre className="bg-muted/40 border border-border/50 rounded-[4px] p-4 font-mono text-[12px] leading-relaxed overflow-x-auto">
            <code>
              {tech.map((t, i) => {
                const meta = TECH_META[t.name.toLowerCase()];
                return (
                  <div key={t.name} className="flex items-center gap-2">
                    {meta && (
                      <HugeiconsIcon
                        icon={meta.icon}
                        size={12}
                        strokeWidth={1.5}
                        style={{ color: meta.color, opacity: 0.7 }}
                        aria-hidden="true"
                      />
                    )}
                    {formatTechLine(t)}
                    {i < tech.length - 1 && "\n"}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      )}

      {/* Links */}
      {(githubUrl || demoUrl) && (
        <div className="flex gap-3 mb-8">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2",
                "border border-border/60 rounded-[6px]",
                "text-sm text-foreground/70 hover:text-foreground",
                "bg-muted/20 hover:bg-muted/40 transition-colors",
                "no-underline"
              )}
            >
              GitHub
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2",
                "border border-border/60 rounded-[6px]",
                "text-sm text-foreground/70 hover:text-foreground",
                "bg-muted/20 hover:bg-muted/40 transition-colors",
                "no-underline"
              )}
            >
              Live Demo
            </a>
          )}
        </div>
      )}

      {/* Body */}
      {body && (
        <p className="text-swiss-body">{body}</p>
      )}
    </article>
  );
}
