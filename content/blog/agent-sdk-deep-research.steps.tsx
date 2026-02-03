/**
 * Deep Research Agent - Code Steps for CanvasCodeStage
 *
 * Progressive code walkthrough for building a research agent with the Claude Agent SDK.
 * Uses Shiki Magic Move for animated token transitions between steps.
 */

import type { CodeStep } from "@/components/blog/CanvasCodeStage";

export const deepResearchSteps: CodeStep[] = [
  {
    id: "hello-agent",
    title: "Your first agent query",
    code: `import { query } from "@anthropic-ai/claude-agent-sdk"

async function main() {
  for await (const message of query({
    prompt: "What are the key trends in AI agents?",
    options: {
      model: "opus",
      allowedTools: ["WebSearch", "Read"],
      maxTurns: 50
    }
  })) {
    if (message.type === "assistant") {
      console.log("Claude is working...")
    }
    if (message.type === "result") {
      console.log("Done:", message.subtype)
    }
  }
}`,
    lang: "ts",
    file: "agent.ts",
  },
  {
    id: "agent-config",
    title: "Configuring agent behavior",
    code: `import { query } from "@anthropic-ai/claude-agent-sdk"

async function research(topic: string) {
  for await (const message of query({
    prompt: \`Research this topic thoroughly: \${topic}\`,
    options: {
      model: "opus",
      allowedTools: ["WebSearch", "WebFetch", "Read", "Glob"],
      maxTurns: 100,
      permissionMode: "bypassPermissions",
      systemPrompt: \`You are a research specialist.
        - Search multiple sources for comprehensive coverage
        - Verify claims across different sources
        - Note conflicting information when found
        - Always cite your sources\`
    }
  })) {
    handleMessage(message)
  }
}`,
    lang: "ts",
    file: "agent.ts",
  },
  {
    id: "custom-tools",
    title: "Adding custom tools with MCP",
    code: `import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk"
import { z } from "zod"

const researchTools = createSdkMcpServer({
  name: "research-tools",
  version: "1.0.0",
  tools: [
    tool(
      "format_citation",
      "Format a source as a proper citation",
      {
        url: z.string().url(),
        title: z.string(),
        author: z.string().optional(),
        date: z.string().optional()
      },
      async (args) => {
        const author = args.author || "Unknown"
        const date = args.date || new Date().getFullYear()
        return {
          content: [{
            type: "text",
            text: \`[\${author}] "\${args.title}" (\${date}). \${args.url}\`
          }]
        }
      }
    )
  ]
})`,
    lang: "ts",
    file: "tools.ts",
  },
  {
    id: "structured-output",
    title: "Getting structured reports",
    code: `const reportSchema = {
  type: "object",
  properties: {
    topic: { type: "string" },
    summary: { type: "string", maxLength: 500 },
    keyFindings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          finding: { type: "string" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          sources: { type: "array", items: { type: "string" } }
        },
        required: ["finding", "confidence", "sources"]
      }
    },
    controversies: { type: "array", items: { type: "string" } },
    suggestedFollowUp: { type: "array", items: { type: "string" } }
  },
  required: ["topic", "summary", "keyFindings"]
}

// Use it in query options
options: {
  outputFormat: {
    type: "json_schema",
    schema: reportSchema
  }
}`,
    lang: "ts",
    file: "schema.ts",
  },
  {
    id: "subagent-searcher",
    title: "Creating specialized subagents",
    code: `import { query, AgentDefinition } from "@anthropic-ai/claude-agent-sdk"

const sourceFinder: AgentDefinition = {
  description: "Find diverse, authoritative sources on a topic",
  prompt: \`You are a source-finding specialist. Your job is to:
    1. Generate varied search queries (academic, news, official)
    2. Search for sources across different perspectives
    3. Prioritize authoritative and recent sources
    4. Return URLs with brief descriptions

    Do NOT analyze content - just find and list sources.\`,
  tools: ["WebSearch"],
  model: "sonnet"  // Faster model for simpler task
}

// Register in query options
options: {
  agents: {
    "source-finder": sourceFinder
  },
  allowedTools: ["Task", "Read", "WebFetch"]  // Task enables subagents
}`,
    lang: "ts",
    file: "subagents.ts",
  },
  {
    id: "multi-agent",
    title: "Orchestrating multiple specialists",
    code: `import { query, AgentDefinition } from "@anthropic-ai/claude-agent-sdk"

const agents: Record<string, AgentDefinition> = {
  "source-finder": {
    description: "Find diverse sources on a topic",
    prompt: "Find authoritative sources. Return URLs only.",
    tools: ["WebSearch"],
    model: "sonnet"
  },
  "content-analyst": {
    description: "Extract key information from sources",
    prompt: "Read and summarize content. Extract facts and claims.",
    tools: ["WebFetch", "Read"],
    model: "sonnet"
  },
  "fact-checker": {
    description: "Verify claims across sources",
    prompt: "Cross-reference claims. Flag contradictions.",
    tools: ["WebSearch", "WebFetch"],
    model: "sonnet"
  }
}

// Orchestrator coordinates all specialists
for await (const message of query({
  prompt: \`Research "\${topic}" using your specialist subagents:
    1. Use source-finder to locate authoritative sources
    2. Use content-analyst to extract key findings
    3. Use fact-checker to verify controversial claims
    4. Synthesize into a final report\`,
  options: { agents, model: "opus", allowedTools: ["Task"] }
})) { /* ... */ }`,
    lang: "ts",
    file: "orchestrator.ts",
  },
  {
    id: "streaming",
    title: "Real-time progress tracking",
    code: `import { query } from "@anthropic-ai/claude-agent-sdk"

async function researchWithProgress(topic: string) {
  console.log(\`\\n🔍 Researching: \${topic}\\n\`)

  for await (const message of query({ prompt: topic, options })) {
    switch (message.type) {
      case "system":
        if (message.subtype === "init") {
          console.log(\`Session: \${message.session_id}\`)
          console.log(\`Tools: \${message.tools.join(", ")}\`)
        }
        break

      case "assistant":
        for (const block of message.message.content) {
          if ("name" in block) {
            // Tool being used
            console.log(\`📦 \${block.name}\`)
          } else if ("text" in block && block.text.length > 0) {
            // Claude's reasoning (truncate for display)
            console.log(\`💭 \${block.text.slice(0, 100)}...\`)
          }
        }
        break

      case "result":
        console.log(\`\\n✅ Done: \${message.subtype}\`)
        console.log(\`💰 Cost: $\${message.total_cost_usd.toFixed(4)}\`)
        break
    }
  }
}`,
    lang: "ts",
    file: "progress.ts",
  },
  {
    id: "production",
    title: "Production-ready research agent",
    code: `import { query, AgentDefinition } from "@anthropic-ai/claude-agent-sdk"

interface ResearchReport {
  topic: string
  summary: string
  keyFindings: Array<{
    finding: string
    confidence: "high" | "medium" | "low"
    sources: string[]
  }>
  suggestedFollowUp: string[]
}

async function deepResearch(topic: string): Promise<ResearchReport | null> {
  const agents: Record<string, AgentDefinition> = {
    "source-finder": { /* ... */ },
    "content-analyst": { /* ... */ },
    "fact-checker": { /* ... */ }
  }

  for await (const message of query({
    prompt: \`Conduct deep research on: \${topic}\`,
    options: {
      model: "opus",
      agents,
      allowedTools: ["Task", "Read", "WebSearch", "WebFetch"],
      permissionMode: "bypassPermissions",
      maxTurns: 200,
      outputFormat: { type: "json_schema", schema: reportSchema }
    }
  })) {
    if (message.type === "result" && message.subtype === "success") {
      return message.structured_output as ResearchReport
    }
  }
  return null
}

// Usage
const report = await deepResearch("AI agent architectures 2026")
console.log(report?.keyFindings)`,
    lang: "ts",
    file: "deep-research.ts",
  },
];
