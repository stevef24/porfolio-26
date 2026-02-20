"use client";

import { ViewTransition, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Github01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TechBadge } from "./TechBadge";
import type { Experiment } from "@/data/experiments";

interface ExperimentCardProps {
  experiment: Experiment;
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const [hovered, setHovered] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { slug, title, description, preview, githubUrl, tech, body } =
    experiment;

  return (
    <>
      {/* Card — flex col so all rows stretch to same height in grid */}
      <article
        className={cn(
          "experiment-card",
          "flex flex-col",
          "border border-border/60 rounded-[6px] overflow-hidden",
          "bg-background transition-colors duration-200",
          "hover:border-border h-full"
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Preview — fixed aspect keeps image rows aligned */}
        <Link
          href={`/experiments/${slug}`}
          className="block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          tabIndex={0}
        >
          <ViewTransition name={`experiment-preview-${slug}`}>
            <div className="relative aspect-[4/3] bg-muted/30 overflow-hidden rounded-[6px]">
              {preview.type === "image" && (
                <img
                  src={preview.src}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              {preview.type === "video" && (
                <video
                  src={preview.src}
                  poster={preview.poster}
                  autoPlay={hovered}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              {preview.type === "gif" && (
                <img
                  src={preview.src}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </ViewTransition>
        </Link>

        {/* Text content — flex-1 so descriptions align at bottom across cards */}
        <div className="flex flex-col flex-1 p-4">
          <Link
            href={`/experiments/${slug}`}
            className="no-underline hover:no-underline focus-visible:outline-none"
            tabIndex={-1}
          >
            <ViewTransition name={`experiment-title-${slug}`}>
              <h3 className="text-swiss-body font-medium text-foreground mb-1.5 leading-snug group-hover:text-foreground/80">
                {title}
              </h3>
            </ViewTransition>
          </Link>
          <ViewTransition name={`experiment-description-${slug}`}>
            <p className="text-swiss-caption text-muted-foreground leading-relaxed line-clamp-2 flex-1">
              {description}
            </p>
          </ViewTransition>

          {/* Action row — always at bottom */}
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/40">
            {/* GitHub link */}
            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center justify-center w-8 h-8 rounded-[4px]",
                  "text-foreground/40 hover:text-foreground/80 hover:bg-muted/60",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                aria-label="View source on GitHub"
                title="View source on GitHub"
                onClick={(e) => e.stopPropagation()}
              >
                <HugeiconsIcon icon={Github01Icon} size={16} strokeWidth={1.5} aria-hidden="true" />
              </a>
            ) : (
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-[4px] text-foreground/20 cursor-not-allowed"
                title="No source available"
              >
                <HugeiconsIcon icon={Github01Icon} size={16} strokeWidth={1.5} aria-hidden="true" />
              </span>
            )}

            {/* Details modal trigger */}
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center w-8 h-8 rounded-[4px]",
                "text-foreground/40 hover:text-foreground/80 hover:bg-muted/60",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "cursor-pointer"
              )}
              aria-label="View experiment details"
              title="Details"
              onClick={(e) => {
                e.stopPropagation();
                setDetailsOpen(true);
              }}
            >
              <HugeiconsIcon icon={SourceCodeIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>

      {/* Details modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-4 space-y-4">
                <p className="text-swiss-body text-foreground/70 leading-relaxed">
                  {body}
                </p>

                {tech.length > 0 && (
                  <div>
                    <p className="text-swiss-label text-foreground/40 mb-2">
                      Built with
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tech.map((t) => (
                        <TechBadge key={t.name} name={t.name} category={t.category} url={t.url} />
                      ))}
                    </div>
                  </div>
                )}

                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-swiss-caption text-foreground/50 hover:text-foreground transition-colors no-underline"
                  >
                    <HugeiconsIcon icon={Github01Icon} size={14} strokeWidth={1.5} aria-hidden="true" />
                    View on GitHub
                  </a>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
