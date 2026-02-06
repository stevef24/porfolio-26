"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";
import { tokenDrop, meterFill, fadeIn } from "@/lib/motion-variants";
import { VisualWrapper } from "./VisualWrapper";

interface McpBloatMeterProps {
  className?: string;
}

const INITIAL_SERVERS = [
  { id: 1, label: "FS" },
  { id: 2, label: "Git" },
];

const WAVE_2 = [
  { id: 3, label: "DB" },
  { id: 4, label: "K8s" },
  { id: 5, label: "CI" },
];

const EXTRA_SERVERS = [
  { id: 6, label: "Log" },
  { id: 7, label: "S3" },
  { id: 8, label: "DNS" },
  { id: 9, label: "Auth" },
];

type Zone = "lean" | "balanced" | "heavy";

function getZone(count: number): Zone {
  if (count <= 2) return "lean";
  if (count <= 5) return "balanced";
  return "heavy";
}

function getMeterFill(count: number): number {
  return Math.min(count / 9, 1);
}

const ZONE_COLORS: Record<Zone, string> = {
  lean: "var(--va-cyan)",
  balanced: "var(--va-yellow)",
  heavy: "var(--va-pink)",
};

export function McpBloatMeter({ className }: McpBloatMeterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [servers, setServers] = useState(INITIAL_SERVERS);
  const [phase, setPhase] = useState(0);
  const [extraIndex, setExtraIndex] = useState(0);

  // Auto-play phases on scroll
  const hasStarted = useRef(false);
  useEffect(() => {
    if (isInView && !hasStarted.current && !prefersReducedMotion) {
      hasStarted.current = true;
      const t1 = setTimeout(() => {
        setServers((prev) => [...prev, ...WAVE_2]);
        setPhase(1);
      }, 600);
      const t2 = setTimeout(() => {
        setServers((prev) => [...prev, ...EXTRA_SERVERS.slice(0, 2)]);
        setPhase(2);
        setExtraIndex(2);
      }, 1800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isInView, prefersReducedMotion]);

  const addServer = useCallback(() => {
    if (extraIndex < EXTRA_SERVERS.length) {
      setServers((prev) => [...prev, EXTRA_SERVERS[extraIndex]]);
      setExtraIndex((i) => i + 1);
      if (servers.length + 1 > 5) setPhase(2);
    }
  }, [extraIndex, servers.length]);

  const zone = prefersReducedMotion ? "balanced" : getZone(servers.length);
  const fill = prefersReducedMotion ? 0.55 : getMeterFill(servers.length);
  const activeColor = ZONE_COLORS[zone];

  // For reduced motion, show a static balanced state
  const displayServers = prefersReducedMotion
    ? [...INITIAL_SERVERS, ...WAVE_2]
    : servers;

  return (
    <VisualWrapper
      className={className}
      label="MCP Server Bloat Meter"
      tone="yellow"
    >
      <div ref={ref} className="flex flex-col gap-5">
        {/* Server icon grid */}
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {displayServers.map((server, i) => (
              <motion.div
                key={server.id}
                custom={i}
                variants={tokenDrop}
                initial={prefersReducedMotion ? "visible" : "hidden"}
                animate={
                  isInView || prefersReducedMotion ? "visible" : "hidden"
                }
                layout
                data-va-chip
                className={cn(
                  "flex h-[28px] w-[28px] items-center justify-center rounded",
                  "border border-[var(--sf-border-default)]",
                  "bg-[var(--sf-bg-subtle)]",
                  "text-[10px] font-medium text-[var(--sf-text-secondary)]",
                  "select-none",
                )}
              >
                {server.label}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Meter */}
        <div className="flex flex-col gap-2">
          {/* Meter track */}
          <div
            data-va-panel
            className="relative h-3 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--sf-bg-muted)" }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                backgroundColor: activeColor,
                originX: 0,
                width: "100%",
              }}
              variants={meterFill}
              initial="empty"
              animate={isInView || prefersReducedMotion ? "filled" : "empty"}
              custom={fill}
            />
          </div>

          {/* Zone labels */}
          <div className="flex justify-between">
            {(["lean", "balanced", "heavy"] as Zone[]).map((z) => (
              <span
                key={z}
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wider",
                  "transition-colors duration-200",
                  zone === z
                    ? "text-[var(--sf-text-primary)]"
                    : "text-[var(--sf-text-tertiary)]",
                )}
                style={zone === z ? { color: ZONE_COLORS[z] } : undefined}
              >
                {z}
              </span>
            ))}
          </div>
        </div>

        {/* Warning */}
        <AnimatePresence>
          {zone === "heavy" && (
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="text-[12px] font-medium"
              style={{ color: "var(--va-pink)" }}
            >
              High server count increases startup latency and token overhead.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Add server button */}
        {!prefersReducedMotion &&
          phase >= 1 &&
          extraIndex < EXTRA_SERVERS.length && (
            <button
              onClick={addServer}
              className={cn(
                "self-start rounded px-3 py-1.5",
                "border border-[var(--sf-border-default)]",
                "bg-[var(--sf-bg-subtle)]",
                "text-[11px] font-medium uppercase tracking-wider",
                "text-[var(--sf-text-secondary)]",
                "transition-colors hover:bg-[var(--sf-bg-muted)]",
                "cursor-pointer",
              )}
            >
              + Add server
            </button>
          )}
      </div>
    </VisualWrapper>
  );
}
