"use client";

import {
  useRef,
  useMemo,
  Children,
  isValidElement,
  type ReactNode,
} from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  Alert02Icon,
  CheckmarkCircle02Icon,
  BulbIcon,
} from "@hugeicons/core-free-icons";

type CalloutType = "note" | "warning" | "tip" | "important";

const CALLOUT_CONFIG: Record<
  CalloutType,
  {
    icon: typeof InformationCircleIcon;
    label: string;
    borderColor: string;
    bgColor: string;
    iconColor: string;
  }
> = {
  note: {
    icon: InformationCircleIcon,
    label: "Note",
    borderColor: "oklch(0.65 0.15 250 / 0.2)",
    bgColor: "oklch(0.65 0.15 250 / 0.03)",
    iconColor: "oklch(0.65 0.15 250 / 0.6)",
  },
  tip: {
    icon: BulbIcon,
    label: "Tip",
    borderColor: "oklch(0.7 0.17 155 / 0.2)",
    bgColor: "oklch(0.7 0.17 155 / 0.03)",
    iconColor: "oklch(0.7 0.17 155 / 0.6)",
  },
  warning: {
    icon: Alert02Icon,
    label: "Warning",
    borderColor: "oklch(0.75 0.15 75 / 0.2)",
    bgColor: "oklch(0.75 0.15 75 / 0.03)",
    iconColor: "oklch(0.75 0.15 75 / 0.6)",
  },
  important: {
    icon: CheckmarkCircle02Icon,
    label: "Important",
    borderColor: "oklch(0.65 0.2 25 / 0.2)",
    bgColor: "oklch(0.65 0.2 25 / 0.03)",
    iconColor: "oklch(0.65 0.2 25 / 0.6)",
  },
};

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    return extractText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function detectType(children: ReactNode): {
  type: CalloutType | null;
  strippedChildren: ReactNode;
} {
  const text = extractText(children);
  const match = text.match(
    /^\s*\*{0,2}(Note|Warning|Tip|Important):?\*{0,2}\s*/i,
  );

  if (!match) return { type: null, strippedChildren: children };

  const keyword = match[1].toLowerCase() as CalloutType;
  if (!(keyword in CALLOUT_CONFIG))
    return { type: null, strippedChildren: children };

  const childArray = Children.toArray(children);
  const stripped = childArray
    .map((child) => {
      if (!isValidElement(child)) return child;
      const props = child.props as { children?: ReactNode };
      if (!props.children) return child;

      const innerText = extractText(props.children);
      if (
        innerText.match(/^\s*\*{0,2}(Note|Warning|Tip|Important):?\*{0,2}\s*$/i)
      ) {
        return null;
      }
      return child;
    })
    .filter(Boolean);

  return { type: keyword, strippedChildren: stripped };
}

interface AnimatedBlockquoteProps {
  children: ReactNode;
  className?: string;
}

/**
 * AnimatedBlockquote — uses a <div> to fully escape prose/fumadocs
 * blockquote base styles. Inline styles guarantee no border-left leak.
 */
export function AnimatedBlockquote({
  children,
  className,
}: AnimatedBlockquoteProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const { type, strippedChildren } = useMemo(
    () => detectType(children),
    [children],
  );

  const config = type ? CALLOUT_CONFIG[type] : null;

  return (
    <motion.div
      ref={ref}
      role="blockquote"
      className={cn("not-prose relative my-10 rounded-lg px-5 py-4", className)}
      style={{
        border: `1px solid ${config ? config.borderColor : "color-mix(in oklch, var(--foreground) 10%, transparent)"}`,
        background: config
          ? config.bgColor
          : "color-mix(in oklch, var(--foreground) 2%, transparent)",
        borderLeft: undefined,
      }}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {config && (
        <div
          className="flex items-center gap-2 mb-3"
          style={{ color: config.iconColor }}
        >
          <HugeiconsIcon
            icon={config.icon}
            size={14}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="text-[10px] font-medium uppercase tracking-[0.1em]">
            {config.label}
          </span>
        </div>
      )}
      <div className="text-[14px] leading-relaxed text-foreground/60 [&>p]:m-0">
        {config ? strippedChildren : children}
      </div>
    </motion.div>
  );
}
