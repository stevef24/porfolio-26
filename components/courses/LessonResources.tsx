"use client";

import {
  Github01Icon,
  File01Icon,
  Link01Icon,
  FolderZipIcon,
  CodeIcon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface Resource {
  label: string;
  url: string;
  type?: "github" | "file" | "link" | "zip" | "code" | "docs";
}

interface LessonResourcesProps {
  resources: Resource[];
  className?: string;
}

// Map resource types to icons
const iconMap = {
  github: Github01Icon,
  file: File01Icon,
  link: Link01Icon,
  zip: FolderZipIcon,
  code: CodeIcon,
  docs: BookOpen01Icon,
} as const;

// Infer resource type from URL if not provided
function inferResourceType(url: string, providedType?: string): string {
  if (providedType) return providedType;

  const lowercaseUrl = url.toLowerCase();

  if (lowercaseUrl.includes("github.com")) return "github";
  if (lowercaseUrl.endsWith(".zip") || lowercaseUrl.endsWith(".tar.gz"))
    return "zip";
  if (
    lowercaseUrl.endsWith(".pdf") ||
    lowercaseUrl.endsWith(".doc") ||
    lowercaseUrl.endsWith(".docx")
  )
    return "file";
  if (lowercaseUrl.includes("codesandbox") || lowercaseUrl.includes("stackblitz"))
    return "code";
  if (
    lowercaseUrl.includes("docs.") ||
    lowercaseUrl.includes("/docs/") ||
    lowercaseUrl.includes("documentation")
  )
    return "docs";

  return "link";
}

function ResourceItem({ resource }: { resource: Resource }): JSX.Element {
  const type = inferResourceType(resource.url, resource.type);
  const Icon = iconMap[type as keyof typeof iconMap] || Link01Icon;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-4 py-3 bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
    >
      <div className="w-8 h-8 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <HugeiconsIcon
          icon={Icon}
          size={16}
          className="text-primary"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[15px] text-foreground group-hover:text-primary transition-colors block truncate">
          {resource.label}
        </span>
        <span className="text-[15px] text-foreground/50 mt-0.5 block truncate">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
      <HugeiconsIcon
        icon={Link01Icon}
        size={14}
        className="text-foreground/50 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
      />
    </a>
  );
}

export function LessonResources({
  resources,
  className,
}: LessonResourcesProps): JSX.Element | null {
  const prefersReducedMotion = useReducedMotion();

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <motion.section
      className={cn("mt-8 pt-8 border-t border-border", className)}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h3 className="text-[15px] text-foreground/50 uppercase tracking-wide mb-4">
        Lesson Resources
      </h3>

      <div className="grid gap-2">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.url}
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <ResourceItem resource={resource} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default LessonResources;
