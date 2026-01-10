"use client";

/**
 * AgentArchitectureDiagram - React Flow diagram for agent architecture.
 * Visualizes orchestrator, subagents, and report flow across 3 steps.
 */

import { useMemo, memo } from "react";
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
  ReactFlowProvider,
} from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import "@xyflow/react/dist/style.css";

interface AgentArchitectureDiagramProps {
  step: number;
  className?: string;
}

interface SwissNodeData extends Record<string, unknown> {
  label: string;
  type?: "orchestrator" | "subagent" | "output";
}

type SwissNode = Node<SwissNodeData, "swiss">;

function getNodeStyles(type?: "orchestrator" | "subagent" | "output"): string {
  switch (type) {
    case "orchestrator":
      return "bg-card border-border shadow-sm text-foreground";
    case "output":
      return "bg-primary/5 border-primary/30 dark:bg-primary/10 dark:border-primary/40 text-primary";
    default:
      return "bg-secondary border-border text-muted-foreground";
  }
}

const SwissNode = memo(function SwissNode({ data }: NodeProps<SwissNode>) {
  return (
    <div
      className={`px-4 py-2.5 border transition-all duration-300 font-sans text-[11px] font-semibold uppercase tracking-[0.05em] ${getNodeStyles(data.type)}`}
      style={{ borderRadius: "2px" }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1.5 !h-1.5 !bg-border !border-0 !-top-[3px]"
      />
      <span>{data.label}</span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-1.5 !h-1.5 !bg-border !border-0 !-bottom-[3px]"
      />
    </div>
  );
});

const nodeTypes = { swiss: SwissNode };

// Layout constants
const LAYOUT = {
  baseY: 50,
  subagentOffset: 100,
  outputOffset: 200,
  centerX: 200,
  spread: 140,
} as const;

function createNodesForStep(step: number): SwissNode[] {
  const { baseY, subagentOffset, outputOffset, centerX, spread } = LAYOUT;
  const subagentY = baseY + subagentOffset;
  const outputY = baseY + outputOffset;

  const orchestrator: SwissNode = {
    id: "orchestrator",
    type: "swiss",
    position: { x: centerX, y: step === 0 ? baseY + 60 : baseY },
    data: { label: "Orchestrator", type: "orchestrator" },
  };

  if (step === 0) return [orchestrator];

  const subagents: SwissNode[] = [
    { id: "source-finder", type: "swiss", position: { x: centerX - spread, y: subagentY }, data: { label: "Source Finder", type: "subagent" } },
    { id: "content-analyst", type: "swiss", position: { x: centerX, y: subagentY }, data: { label: "Content Analyst", type: "subagent" } },
    { id: "fact-checker", type: "swiss", position: { x: centerX + spread, y: subagentY }, data: { label: "Fact Checker", type: "subagent" } },
  ];

  if (step === 1) return [orchestrator, ...subagents];

  const report: SwissNode = {
    id: "report",
    type: "swiss",
    position: { x: centerX, y: outputY },
    data: { label: "Research Report", type: "output" },
  };

  return [orchestrator, ...subagents, report];
}

const EDGE_STYLE = { stroke: "var(--border)", strokeWidth: 1 };
const EDGE_STYLE_PRIMARY = { stroke: "var(--primary)", strokeWidth: 1, opacity: 0.6 };

function createEdgesForStep(step: number): Edge[] {
  if (step === 0) return [];

  const orchestratorEdges: Edge[] = [
    { id: "e-orch-source", source: "orchestrator", target: "source-finder", animated: true, style: EDGE_STYLE },
    { id: "e-orch-content", source: "orchestrator", target: "content-analyst", animated: true, style: EDGE_STYLE },
    { id: "e-orch-fact", source: "orchestrator", target: "fact-checker", animated: true, style: EDGE_STYLE },
  ];

  if (step === 1) return orchestratorEdges;

  const reportEdges: Edge[] = [
    { id: "e-source-report", source: "source-finder", target: "report", animated: true, style: EDGE_STYLE_PRIMARY },
    { id: "e-content-report", source: "content-analyst", target: "report", animated: true, style: EDGE_STYLE_PRIMARY },
    { id: "e-fact-report", source: "fact-checker", target: "report", animated: true, style: EDGE_STYLE_PRIMARY },
  ];

  return [...orchestratorEdges, ...reportEdges];
}

const STEP_LABELS = [
  { title: "Request Received", subtitle: "Orchestrator parses the research topic" },
  { title: "Parallel Execution", subtitle: "Subagents search, analyze, and verify" },
  { title: "Synthesis", subtitle: "Findings converge into structured report" },
] as const;

const PRO_OPTIONS = { hideAttribution: true };

function DiagramInner({ step, className }: AgentArchitectureDiagramProps) {
  const nodes = useMemo(() => createNodesForStep(step), [step]);
  const edges = useMemo(() => createEdgesForStep(step), [step]);
  const label = STEP_LABELS[step];

  return (
    <div className={`relative w-full h-full min-h-[320px] ${className || ""}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute top-4 left-4 z-10"
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Step {step + 1}
          </div>
          <div className="text-sm font-medium text-foreground mt-0.5">{label?.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{label?.subtitle}</div>
        </motion.div>
      </AnimatePresence>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        proOptions={PRO_OPTIONS}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        minZoom={0.5}
        maxZoom={1}
        className="!bg-transparent"
      >
        <Background gap={24} size={1} color="var(--border)" style={{ opacity: 0.4 }} />
      </ReactFlow>

      <div
        className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--secondary), transparent)" }}
      />
    </div>
  );
}

export function AgentArchitectureDiagram(props: AgentArchitectureDiagramProps) {
  return (
    <ReactFlowProvider>
      <DiagramInner {...props} />
    </ReactFlowProvider>
  );
}
