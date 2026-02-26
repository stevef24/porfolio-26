import { cn } from "@/lib/utils";

interface TechBadgeProps {
  name: string;
  category: "library" | "api" | "tool";
  url?: string;
  className?: string;
}

export function TechBadge({ name, category, url, className }: TechBadgeProps) {
  const content = (
    <span
      className={cn(
        "inline-flex flex-col gap-0.5 px-2.5 py-1.5",
        "border border-border/60 rounded-[4px]",
        "bg-muted/30 hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground leading-none">
        {category}
      </span>
      <span className="font-mono text-[11px] text-foreground leading-none">
        {name}
      </span>
    </span>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="no-underline">
        {content}
      </a>
    );
  }

  return content;
}
