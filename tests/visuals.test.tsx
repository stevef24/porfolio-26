import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock motion/react hooks
vi.mock("motion/react", async () => {
	const actual = await vi.importActual("motion/react");
	return {
		...(actual as object),
		useReducedMotion: vi.fn(() => false),
		useInView: vi.fn(() => true),
	};
});

// Mock motion-variants to avoid import issues
vi.mock("@/lib/motion-variants", () => ({
	tokenDrop: { hidden: {}, visible: {} },
	overflowSpill: { hidden: {}, visible: {} },
	staggerContainer: { hidden: {}, visible: {} },
	sequentialHighlight: { active: {}, inactive: {} },
	arrowDraw: { hidden: {}, visible: {} },
	panelSlide: { hidden: {}, visible: {} },
	staggerFast: { hidden: {}, visible: {} },
	staggerItem: { hidden: {}, visible: {} },
	summaryTransfer: {},
	timelineProgress: { hidden: {}, visible: {} },
	nodeGlow: { dim: {}, glow: {} },
	layerStack: { hidden: {}, visible: {} },
	fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
	slideUpSubtle: { hidden: {}, visible: {} },
	checkmarkIn: { hidden: {}, visible: {} },
	cardEmphasis: { dim: {}, bright: {} },
	ladderHighlight: { hidden: {}, visible: {} },
	typingCursor: { blink: {} },
	meterFill: { empty: {}, filled: {} },
	springSmooth: { type: "spring", visualDuration: 0.35, bounce: 0.1 },
}));

import { ContextBudgetBucket } from "@/components/visuals/ContextBudgetBucket";
import { ContextCompositionStack } from "@/components/visuals/ContextCompositionStack";
import { PlanClearExecuteFlow } from "@/components/visuals/PlanClearExecuteFlow";
import { SignalNoiseDial } from "@/components/visuals/SignalNoiseDial";
import { McpBloatMeter } from "@/components/visuals/McpBloatMeter";
import { McpArchitectureMap } from "@/components/visuals/McpArchitectureMap";
import { SubagentSplitContext } from "@/components/visuals/SubagentSplitContext";
import { HookTimeline } from "@/components/visuals/HookTimeline";
import { ClaudeCodeStack } from "@/components/visuals/ClaudeCodeStack";
import { ChangelogScanChecklist } from "@/components/visuals/ChangelogScanChecklist";
import { ContextTrimComparison } from "@/components/visuals/ContextTrimComparison";
import { PermissionsSafetyLadder } from "@/components/visuals/PermissionsSafetyLadder";
import { SessionMemoryNote } from "@/components/visuals/SessionMemoryNote";

// ---------------------------------------------------------------------------
// 1. ContextBudgetBucket
// ---------------------------------------------------------------------------
describe("ContextBudgetBucket", () => {
	it("renders the wrapper label", () => {
		render(<ContextBudgetBucket />);
		expect(screen.getByText("Context Budget")).toBeInTheDocument();
	});

	it("renders token labels", () => {
		render(<ContextBudgetBucket />);
		expect(screen.getByText("Conversation")).toBeInTheDocument();
		expect(screen.getByText("Files")).toBeInTheDocument();
		expect(screen.getByText("Tool Output")).toBeInTheDocument();
		expect(screen.getByText("CLAUDE.md")).toBeInTheDocument();
	});

	it("renders the overflow lost details label", () => {
		render(<ContextBudgetBucket />);
		expect(screen.getByText("Lost Details")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 2. ContextCompositionStack
// ---------------------------------------------------------------------------
describe("ContextCompositionStack", () => {
	it("renders the context heading", () => {
		render(<ContextCompositionStack />);
		expect(screen.getByText("Context")).toBeInTheDocument();
	});

	it("renders all five card labels", () => {
		render(<ContextCompositionStack />);
		expect(screen.getByText("Conversation")).toBeInTheDocument();
		expect(screen.getByText("Files")).toBeInTheDocument();
		expect(screen.getByText("Tool Output")).toBeInTheDocument();
		expect(screen.getByText("CLAUDE.md")).toBeInTheDocument();
		expect(screen.getByText("Skills")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 3. PlanClearExecuteFlow
// ---------------------------------------------------------------------------
describe("PlanClearExecuteFlow", () => {
	it("renders three flow tiles", () => {
		render(<PlanClearExecuteFlow />);
		expect(screen.getByText("Plan")).toBeInTheDocument();
		expect(screen.getByText("Clear")).toBeInTheDocument();
		expect(screen.getByText("Execute")).toBeInTheDocument();
	});

	it("renders the sequential workflow caption", () => {
		render(<PlanClearExecuteFlow />);
		expect(screen.getByText("Sequential workflow")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 4. SignalNoiseDial
// ---------------------------------------------------------------------------
describe("SignalNoiseDial", () => {
	it("renders Signal and Noise labels", () => {
		render(<SignalNoiseDial />);
		expect(screen.getByText("Signal")).toBeInTheDocument();
		expect(screen.getByText("Noise")).toBeInTheDocument();
	});

	it("renders the noise ratio label", () => {
		render(<SignalNoiseDial />);
		expect(screen.getByText("Noise ratio")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 5. McpBloatMeter
// ---------------------------------------------------------------------------
describe("McpBloatMeter", () => {
	it("renders the wrapper label", () => {
		render(<McpBloatMeter />);
		expect(screen.getByText("MCP Server Bloat Meter")).toBeInTheDocument();
	});

	it("renders zone labels", () => {
		render(<McpBloatMeter />);
		expect(screen.getByText("lean")).toBeInTheDocument();
		expect(screen.getByText("balanced")).toBeInTheDocument();
		expect(screen.getByText("heavy")).toBeInTheDocument();
	});

	it("renders initial server icons", () => {
		render(<McpBloatMeter />);
		expect(screen.getByText("FS")).toBeInTheDocument();
		expect(screen.getByText("Git")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 6. McpArchitectureMap
// ---------------------------------------------------------------------------
describe("McpArchitectureMap", () => {
	it("renders all three node labels", () => {
		render(<McpArchitectureMap />);
		expect(screen.getByText("Claude Code")).toBeInTheDocument();
		expect(screen.getByText("MCP Server")).toBeInTheDocument();
		expect(screen.getByText("External Tool")).toBeInTheDocument();
	});

	it("has an accessible architecture description", () => {
		render(<McpArchitectureMap />);
		expect(
			screen.getByRole("img", {
				name: /Architecture flow: Claude Code connects to MCP Server/,
			})
		).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 7. SubagentSplitContext
// ---------------------------------------------------------------------------
describe("SubagentSplitContext", () => {
	it("renders panel headers", () => {
		render(<SubagentSplitContext />);
		expect(screen.getByText("Main Session")).toBeInTheDocument();
		expect(screen.getByText("Subagent")).toBeInTheDocument();
	});

	it("renders subagent task notes", () => {
		render(<SubagentSplitContext />);
		expect(screen.getByText("Searching for relevant files...")).toBeInTheDocument();
		expect(screen.getByText("Reading 12 source files")).toBeInTheDocument();
		expect(screen.getByText("Analyzing patterns found")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 8. HookTimeline
// ---------------------------------------------------------------------------
describe("HookTimeline", () => {
	it("renders all four node labels", () => {
		render(<HookTimeline />);
		expect(screen.getByText("PreToolUse")).toBeInTheDocument();
		expect(screen.getByText("Tool")).toBeInTheDocument();
		expect(screen.getByText("PostToolUse")).toBeInTheDocument();
		expect(screen.getByText("Stop")).toBeInTheDocument();
	});

	it("has an accessible timeline description", () => {
		render(<HookTimeline />);
		expect(
			screen.getByRole("img", {
				name: /Timeline showing hook lifecycle/,
			})
		).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 9. ClaudeCodeStack
// ---------------------------------------------------------------------------
describe("ClaudeCodeStack", () => {
	it("renders all layer labels", () => {
		render(<ClaudeCodeStack />);
		expect(screen.getByText("CLI")).toBeInTheDocument();
		expect(screen.getByText("Tools")).toBeInTheDocument();
		expect(screen.getByText("MCP")).toBeInTheDocument();
		expect(screen.getByText("Model")).toBeInTheDocument();
	});

	it("renders the sandbox label", () => {
		render(<ClaudeCodeStack />);
		expect(screen.getByText("Sandbox")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 10. ChangelogScanChecklist
// ---------------------------------------------------------------------------
describe("ChangelogScanChecklist", () => {
	it("renders all five category labels", () => {
		render(<ChangelogScanChecklist />);
		expect(screen.getByText("Commands")).toBeInTheDocument();
		expect(screen.getByText("Context")).toBeInTheDocument();
		expect(screen.getByText("Tools")).toBeInTheDocument();
		expect(screen.getByText("MCP")).toBeInTheDocument();
		expect(screen.getByText("Permissions")).toBeInTheDocument();
	});

	it("renders category icons", () => {
		render(<ChangelogScanChecklist />);
		expect(screen.getByText(">")).toBeInTheDocument();
		expect(screen.getByText("{}")).toBeInTheDocument();
		expect(screen.getByText("T")).toBeInTheDocument();
		expect(screen.getByText("M")).toBeInTheDocument();
		expect(screen.getByText("P")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 11. ContextTrimComparison
// ---------------------------------------------------------------------------
describe("ContextTrimComparison", () => {
	it("renders Before and After labels", () => {
		render(<ContextTrimComparison />);
		expect(screen.getByText("Before")).toBeInTheDocument();
		expect(screen.getByText("After")).toBeInTheDocument();
	});

	it("renders meter percentage labels", () => {
		render(<ContextTrimComparison />);
		expect(screen.getByText("80% of budget")).toBeInTheDocument();
		expect(screen.getByText("30% of budget")).toBeInTheDocument();
	});

	it("renders trimmed content lines", () => {
		render(<ContextTrimComparison />);
		expect(
			screen.getByText(/auth\.ts:42-68/)
		).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 12. PermissionsSafetyLadder
// ---------------------------------------------------------------------------
describe("PermissionsSafetyLadder", () => {
	it("renders all three rung labels", () => {
		render(<PermissionsSafetyLadder />);
		expect(screen.getByText("Default")).toBeInTheDocument();
		expect(screen.getByText("Allow Commands")).toBeInTheDocument();
		expect(screen.getByText("Accept Edits")).toBeInTheDocument();
	});

	it("renders rung descriptions", () => {
		render(<PermissionsSafetyLadder />);
		expect(screen.getByText("Safest")).toBeInTheDocument();
		expect(screen.getByText("Medium trust")).toBeInTheDocument();
		expect(screen.getByText("Highest trust")).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// 13. SessionMemoryNote
// ---------------------------------------------------------------------------
describe("SessionMemoryNote", () => {
	it("renders bullet markers", () => {
		render(<SessionMemoryNote />);
		expect(screen.getByText("Done:")).toBeInTheDocument();
		expect(screen.getByText("Blocked:")).toBeInTheDocument();
		expect(screen.getByText("Next:")).toBeInTheDocument();
	});

	it("renders bullet text content", () => {
		render(<SessionMemoryNote />);
		expect(screen.getByText("Migrated auth to v2")).toBeInTheDocument();
		expect(screen.getByText("CI timeout on deploy")).toBeInTheDocument();
		expect(screen.getByText("Add rate limiting")).toBeInTheDocument();
	});
});
