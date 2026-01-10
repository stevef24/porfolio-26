"use client";

/**
 * AgentArchitectureDemo - Self-contained stepped architecture diagram
 *
 * This component manages its own step state via IntersectionObserver,
 * avoiding the need for BlogWithCanvas context.
 */

import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AgentArchitectureDiagram } from "./AgentArchitectureDiagram";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface StepData {
  title: string;
  content: ReactNode;
}

interface AgentArchitectureDemoProps {
  className?: string;
}

// ============================================================================
// Step Content
// ============================================================================

const steps: StepData[] = [
  {
    title: "Request Received",
    content: (
      <>
        <p className="text-swiss-body">
          The orchestrator is the entry point. When a research topic arrives, it parses the
          request, identifies key concepts, and generates targeted search queries. Think of it
          as the project manager planning the work before delegating.
        </p>
        <p className="text-swiss-body mt-4">
          At this stage, nothing has been searched yet - the orchestrator is purely strategic.
        </p>
      </>
    ),
  },
  {
    title: "Parallel Execution",
    content: (
      <>
        <p className="text-swiss-body">
          Now the real work begins. Three specialized subagents spin up simultaneously:
        </p>
        <ul className="mt-4 space-y-2">
          <li className="text-swiss-body">
            <strong>Source Finder</strong> - Searches the web for relevant articles, papers, and documentation
          </li>
          <li className="text-swiss-body">
            <strong>Content Analyst</strong> - Extracts key findings, quotes, and data points from each source
          </li>
          <li className="text-swiss-body">
            <strong>Fact Checker</strong> - Cross-references claims across multiple sources for accuracy
          </li>
        </ul>
        <p className="text-swiss-body mt-4">
          This parallel execution is why agents outperform sequential approaches - three workers are faster than one.
        </p>
      </>
    ),
  },
  {
    title: "Synthesis",
    content: (
      <>
        <p className="text-swiss-body">
          All findings converge into a structured research report. The orchestrator aggregates
          results, resolves conflicts between sources, and assigns confidence levels to each
          claim based on how many sources corroborated it.
        </p>
        <p className="text-swiss-body mt-4">
          The output is a typed <code className="text-sm bg-secondary px-1.5 py-0.5 rounded">ResearchReport</code> object
          with citations, not just raw text.
        </p>
      </>
    ),
  },
];

// ============================================================================
// Step Component
// ============================================================================

interface StepItemProps {
  index: number;
  isActive: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
}

function StepItem({ index, isActive, onClick, title, children }: StepItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "py-6 px-4 cursor-pointer transition-all duration-300 rounded-lg",
        "border border-transparent",
        isActive
          ? "bg-secondary/50 border-border"
          : "hover:bg-secondary/30"
      )}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {index + 1}
        </span>
        <h3 className="font-display text-lg font-medium">{title}</h3>
      </div>

      {/* Content */}
      <div className="pl-9">{children}</div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AgentArchitectureDemo({ className }: AgentArchitectureDemoProps) {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn("not-prose", className)}
    >
      {/* Desktop: Side-by-side layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-8 items-start">
        {/* Left: Steps */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <StepItem
              key={index}
              index={index}
              isActive={activeStep === index}
              onClick={() => setActiveStep(index)}
              title={step.title}
            >
              {step.content}
            </StepItem>
          ))}
        </div>

        {/* Right: Diagram (sticky) */}
        <div className="sticky top-24">
          <div className="bg-secondary rounded-lg overflow-hidden">
            <AgentArchitectureDiagram step={activeStep} className="h-[400px]" />
          </div>
        </div>
      </div>

      {/* Mobile: Stacked layout */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="space-y-4">
            {/* Step header */}
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </span>
              <h3 className="font-display text-lg font-medium">{step.title}</h3>
            </div>

            {/* Diagram for this step */}
            <div className="bg-secondary rounded-lg overflow-hidden">
              <AgentArchitectureDiagram step={index} className="h-[280px]" />
            </div>

            {/* Content */}
            <div className="pl-9">{step.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentArchitectureDemo;
