import { ViewTransition } from "react";
import { TechBadge } from "./TechBadge";
import { cn } from "@/lib/utils";
import type { Experiment } from "@/data/experiments";

interface ExperimentDetailProps {
  experiment: Experiment;
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
        <h1 className="text-2xl md:text-3xl font-medium text-foreground mb-4 leading-tight">
          {title}
        </h1>
      </ViewTransition>

      {/* Description */}
      <ViewTransition name={`experiment-description-${slug}`}>
        <p className="text-base text-muted-foreground mb-8 leading-relaxed">
          {description}
        </p>
      </ViewTransition>

      {/* Tech Stack */}
      {tech.length > 0 && (
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Built with</p>
          <div className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <TechBadge key={t.name} name={t.name} category={t.category} url={t.url} />
            ))}
          </div>
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
        <p className="text-base text-foreground/70 leading-relaxed">{body}</p>
      )}
    </article>
  );
}
