# Deep Research Agent Tutorial: Architecture & Implementation Plan

Generated: 2026-01-10

## Goal

Build a "Deep Research Agent" tutorial using the Anthropic Claude Agent SDK that teaches readers how to create an autonomous research assistant. The agent accepts a research topic, searches the web for relevant sources, extracts key information, and synthesizes findings into a structured report with citations.

This tutorial will be delivered as a ScrollyCoding walkthrough with 8 progressive steps, each introducing new SDK concepts while building toward a complete, production-ready agent.

---

## SDK Features to Use

| Feature | Purpose | Tutorial Step |
|---------|---------|---------------|
| `query()` | One-shot agent invocation | Step 1 |
| `ClaudeAgentOptions` | Configuration (model, tools, limits) | Step 2 |
| `@tool` decorator | Custom tool definitions | Step 3 |
| `create_sdk_mcp_server` | Tool server registration | Step 3 |
| `output_format` + JSON Schema | Structured report output | Step 4 |
| `agents` config | Specialized subagents | Step 5-6 |
| Message type handling | Processing tool use and results | Step 7 |
| `max_turns` + `max_budget_usd` | Execution guardrails | Step 8 |

---

## Tutorial Structure: 8 Steps

### Step 1: Hello Agent - Your First Query

**What it teaches:** Basic SDK setup and the `query()` function.

**Concept:** The SDK provides a simple async generator that yields messages as the agent works. Start with the simplest possible invocation to understand the message flow.

```python
# step-1-hello-agent.py
import anyio
from claude_agent_sdk import query, AssistantMessage, TextBlock

async def main():
    """The simplest possible agent - just ask a question."""

    async for message in query(prompt="What are the key trends in AI for 2026?"):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)

anyio.run(main)
```

**Key Concepts Introduced:**
- `query()` as the entry point
- Async generator pattern
- `AssistantMessage` and `TextBlock` types
- Simple message processing loop

---

### Step 2: Configuring Agent Behavior

**What it teaches:** `ClaudeAgentOptions` for controlling agent behavior.

**Concept:** Agents need configuration - which model to use, what tools are available, how many turns to allow. The options object is your control panel.

```python
# step-2-agent-configuration.py
import anyio
from claude_agent_sdk import (
    query,
    ClaudeAgentOptions,
    AssistantMessage,
    ResultMessage,
    TextBlock
)

async def main():
    """Configure the agent with specific options."""

    options = ClaudeAgentOptions(
        # Model selection
        model="claude-sonnet-4-5",

        # Execution limits
        max_turns=5,
        max_budget_usd=0.50,

        # System behavior
        system_prompt="""You are a research assistant.
        When given a topic, provide a brief overview with key points.
        Be concise and factual."""
    )

    async for message in query(
        prompt="Research the current state of quantum computing",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)

        elif isinstance(message, ResultMessage):
            print(f"\n---\nTotal cost: ${message.total_cost_usd:.4f}")
            print(f"Tokens: {message.usage.get('input_tokens')} in / {message.usage.get('output_tokens')} out")

anyio.run(main)
```

**Key Concepts Introduced:**
- `ClaudeAgentOptions` configuration object
- Model selection and fallbacks
- Execution limits (`max_turns`, `max_budget_usd`)
- System prompts for behavior control
- `ResultMessage` for cost tracking

---

### Step 3: Building Custom Tools

**What it teaches:** Creating custom MCP tools with the `@tool` decorator.

**Concept:** Real research agents need to fetch data from external sources. We'll build web search and content extraction tools that the agent can invoke.

```python
# step-3-custom-tools.py
import anyio
import httpx
from typing import Any
from claude_agent_sdk import (
    query,
    tool,
    create_sdk_mcp_server,
    ClaudeAgentOptions,
    AssistantMessage,
    TextBlock,
    ToolUseBlock
)

# Tool 1: Web Search
@tool(
    "web_search",
    "Search the web for information on a topic. Returns a list of relevant results.",
    {"query": str, "num_results": int}
)
async def web_search(args: dict[str, Any]) -> dict[str, Any]:
    """Simulate web search (replace with real API in production)."""
    query_text = args["query"]
    num_results = args.get("num_results", 5)

    # In production, use a real search API (Brave, SerpAPI, etc.)
    results = [
        {
            "title": f"Result {i+1} for: {query_text}",
            "url": f"https://example.com/article-{i+1}",
            "snippet": f"This article discusses {query_text}..."
        }
        for i in range(num_results)
    ]

    formatted = "\n\n".join(
        f"**{r['title']}**\n{r['url']}\n{r['snippet']}"
        for r in results
    )

    return {
        "content": [{"type": "text", "text": formatted}]
    }


# Tool 2: Fetch and Extract Page Content
@tool(
    "fetch_page",
    "Fetch a web page and extract its main text content.",
    {"url": str}
)
async def fetch_page(args: dict[str, Any]) -> dict[str, Any]:
    """Fetch and extract content from a URL."""
    url = args["url"]

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()

        content = response.text[:5000]  # Truncate for demo

        return {
            "content": [{
                "type": "text",
                "text": f"Content from {url}:\n\n{content}"
            }]
        }
    except Exception as e:
        return {
            "content": [{"type": "text", "text": f"Error fetching {url}: {str(e)}"}],
            "is_error": True
        }


async def main():
    """Agent with custom research tools."""

    # Create MCP server with our tools
    research_server = create_sdk_mcp_server(
        name="research-tools",
        version="1.0.0",
        tools=[web_search, fetch_page]
    )

    options = ClaudeAgentOptions(
        model="claude-sonnet-4-5",
        max_turns=10,
        system_prompt="""You are a research agent.
        Use web_search to find relevant sources, then fetch_page to read them.
        Synthesize findings into a clear summary.""",
        mcp_servers={"research": research_server},
        allowed_tools=[
            "mcp__research__web_search",
            "mcp__research__fetch_page"
        ]
    )

    async for message in query(
        prompt="Research the latest developments in large language models",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(f"Agent: {block.text}")
                elif isinstance(block, ToolUseBlock):
                    print(f"\n[Using tool: {block.name}]")
                    print(f"Input: {block.input}")

anyio.run(main)
```

**Key Concepts Introduced:**
- `@tool` decorator syntax
- Tool schemas (name, description, parameters)
- `create_sdk_mcp_server` for tool registration
- `allowed_tools` whitelist pattern
- Tool naming convention (`mcp__server__tool`)
- `ToolUseBlock` for observing tool invocations
- Error handling in tools (`is_error: True`)

---

### Step 4: Structured Output for Reports

**What it teaches:** Using JSON Schema to enforce structured output.

**Concept:** Research reports need a consistent structure. The SDK's structured output feature validates the agent's response against a schema, ensuring we get properly formatted data.

```python
# step-4-structured-output.py
import anyio
from claude_agent_sdk import (
    query,
    ClaudeAgentOptions,
    ResultMessage
)

# Define the report schema
RESEARCH_REPORT_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": "The title of the research report"
        },
        "executive_summary": {
            "type": "string",
            "description": "A 2-3 sentence summary of key findings"
        },
        "key_findings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "finding": {"type": "string"},
                    "confidence": {
                        "type": "string",
                        "enum": ["high", "medium", "low"]
                    },
                    "source_url": {"type": "string"}
                },
                "required": ["finding", "confidence"]
            },
            "description": "List of key findings with confidence levels"
        },
        "sources": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "url": {"type": "string"},
                    "relevance": {"type": "string"}
                },
                "required": ["title", "url"]
            },
            "description": "Cited sources used in the research"
        },
        "methodology": {
            "type": "string",
            "description": "Brief description of how the research was conducted"
        },
        "limitations": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Known limitations or caveats of the research"
        }
    },
    "required": ["title", "executive_summary", "key_findings", "sources"]
}


async def main():
    """Generate a structured research report."""

    options = ClaudeAgentOptions(
        model="claude-sonnet-4-5",
        max_turns=1,
        system_prompt="""You are a research analyst.
        Analyze the given topic and produce a structured research report.
        Be thorough but concise. Cite sources where possible.""",
        output_format={
            "type": "json_schema",
            "schema": RESEARCH_REPORT_SCHEMA
        }
    )

    async for message in query(
        prompt="Analyze the impact of generative AI on software development workflows in 2025-2026",
        options=options
    ):
        if isinstance(message, ResultMessage):
            report = message.structured_output

            print(f"# {report['title']}\n")
            print(f"## Executive Summary\n{report['executive_summary']}\n")

            print("## Key Findings")
            for i, finding in enumerate(report['key_findings'], 1):
                confidence = finding['confidence'].upper()
                print(f"{i}. [{confidence}] {finding['finding']}")

            print("\n## Sources")
            for source in report['sources']:
                print(f"- [{source['title']}]({source['url']})")

anyio.run(main)
```

**Key Concepts Introduced:**
- `output_format` with JSON Schema
- Schema design for research reports
- `message.structured_output` for validated data
- Type-safe data extraction

---

### Step 5: Subagent Architecture - The Searcher

**What it teaches:** Defining specialized subagents for modular workflows.

**Concept:** Complex research benefits from specialized workers. We'll create a "Searcher" subagent focused solely on finding and ranking sources.

```python
# step-5-subagent-searcher.py
import anyio
from claude_agent_sdk import (
    query,
    tool,
    create_sdk_mcp_server,
    ClaudeAgentOptions,
    AssistantMessage,
    SystemMessage,
    TextBlock
)
from typing import Any

@tool("web_search", "Search the web for information", {"query": str, "num_results": int})
async def web_search(args: dict[str, Any]) -> dict[str, Any]:
    results = [
        {"title": f"Result {i+1}", "url": f"https://example.com/{i+1}", "snippet": "..."}
        for i in range(args.get("num_results", 5))
    ]
    formatted = "\n".join(f"- {r['title']}: {r['url']}" for r in results)
    return {"content": [{"type": "text", "text": formatted}]}


async def main():
    """Multi-agent research with a specialized searcher."""

    research_server = create_sdk_mcp_server(
        name="research",
        version="1.0.0",
        tools=[web_search]
    )

    options = ClaudeAgentOptions(
        model="claude-sonnet-4-5",
        max_turns=15,
        system_prompt="""You are a research coordinator.
        Delegate search tasks to the source-finder agent.
        Then synthesize findings into a comprehensive report.""",
        mcp_servers={"research": research_server},
        allowed_tools=["mcp__research__web_search"],

        # Define specialized subagent
        agents={
            "source-finder": {
                "description": """Expert at finding and evaluating sources.
                Use this agent to search for relevant articles and papers.""",
                "prompt": """You are a research librarian specialized in finding sources.
                Generate diverse search queries, execute searches, and rank results.""",
                "tools": ["mcp__research__web_search"],
                "model": "haiku"  # Faster model for search
            }
        }
    )

    async for message in query(
        prompt="Research best practices for building AI agents in production",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(f"Coordinator: {block.text}")

        elif isinstance(message, SystemMessage):
            if message.subtype == "subagent_start":
                print(f"\n--- Starting subagent: {message.data.get('agent_name')} ---")
            elif message.subtype == "subagent_end":
                print(f"--- Subagent completed ---\n")

anyio.run(main)
```

**Key Concepts Introduced:**
- `agents` configuration for subagents
- Subagent description (determines when coordinator invokes it)
- Subagent-specific prompts and tool access
- Model selection per subagent
- `SystemMessage` for agent lifecycle events

---

### Step 6: Multi-Agent Pipeline

**What it teaches:** Orchestrating multiple specialized subagents.

**Concept:** A complete research pipeline uses multiple specialists: one finds sources, another analyzes content, and the coordinator synthesizes everything.

```python
# step-6-multi-agent-pipeline.py
import anyio
from claude_agent_sdk import (
    query,
    tool,
    create_sdk_mcp_server,
    ClaudeAgentOptions,
    AssistantMessage,
    SystemMessage,
    ResultMessage,
    TextBlock
)
from typing import Any

@tool("web_search", "Search the web", {"query": str})
async def web_search(args: dict[str, Any]) -> dict[str, Any]:
    return {"content": [{"type": "text", "text": f"Results for: {args['query']}..."}]}

@tool("fetch_page", "Fetch page content", {"url": str})
async def fetch_page(args: dict[str, Any]) -> dict[str, Any]:
    return {"content": [{"type": "text", "text": f"Content from {args['url']}..."}]}

@tool("store_finding", "Store a research finding", {"finding": str, "source": str})
async def store_finding(args: dict[str, Any]) -> dict[str, Any]:
    return {"content": [{"type": "text", "text": f"Stored: {args['finding'][:50]}..."}]}


async def main():
    """Complete multi-agent research pipeline."""

    research_server = create_sdk_mcp_server(
        name="research",
        version="1.0.0",
        tools=[web_search, fetch_page, store_finding]
    )

    options = ClaudeAgentOptions(
        model="claude-sonnet-4-5",
        max_turns=20,
        max_budget_usd=2.00,
        system_prompt="""You are a research director coordinating a team:
        - source-finder: Discovers relevant sources
        - content-analyst: Deep-reads and extracts insights
        - fact-checker: Validates claims across sources""",
        mcp_servers={"research": research_server},
        allowed_tools=[
            "mcp__research__web_search",
            "mcp__research__fetch_page",
            "mcp__research__store_finding"
        ],

        agents={
            "source-finder": {
                "description": "Expert at discovering and ranking sources.",
                "prompt": "Find diverse, authoritative sources on the given topic.",
                "tools": ["mcp__research__web_search"],
                "model": "haiku"
            },
            "content-analyst": {
                "description": "Expert at deep-reading and extracting insights.",
                "prompt": "Read sources thoroughly and extract key claims.",
                "tools": ["mcp__research__fetch_page", "mcp__research__store_finding"],
                "model": "sonnet"
            },
            "fact-checker": {
                "description": "Expert at validating claims across sources.",
                "prompt": "Cross-reference claims and assign confidence levels.",
                "tools": ["mcp__research__web_search", "mcp__research__fetch_page"],
                "model": "sonnet"
            }
        }
    )

    async for message in query(
        prompt="Research the current state of autonomous AI agents",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)

        elif isinstance(message, SystemMessage):
            agent_name = message.data.get("agent_name", "unknown")
            if message.subtype == "subagent_start":
                print(f"\n[Delegating to {agent_name}...]")
            elif message.subtype == "subagent_end":
                print(f"[{agent_name} completed]\n")

        elif isinstance(message, ResultMessage):
            print(f"\nResearch complete. Cost: ${message.total_cost_usd:.4f}")

anyio.run(main)
```

**Key Concepts Introduced:**
- Multiple specialized subagents
- Agent descriptions that guide automatic delegation
- Different models per agent (cost optimization)
- Tool access control per agent

---

### Step 7: Streaming and Progress Tracking

**What it teaches:** Real-time message handling and progress visualization.

**Concept:** Users want to see research progress in real-time. Build proper message handling to show tool invocations, agent delegations, and partial results.

```python
# step-7-streaming-progress.py
import anyio
from claude_agent_sdk import (
    query,
    ClaudeAgentOptions,
    UserMessage,
    AssistantMessage,
    SystemMessage,
    ResultMessage,
    TextBlock,
    ThinkingBlock,
    ToolUseBlock,
    ToolResultBlock
)
from datetime import datetime


class ProgressTracker:
    def __init__(self):
        self.sources_found = 0
        self.pages_analyzed = 0
        self.current_agent = "coordinator"
        self.start_time = datetime.now()

    def print_status(self):
        elapsed = (datetime.now() - self.start_time).seconds
        print(f"\r[{elapsed}s] {self.current_agent} | Sources: {self.sources_found} | Analyzed: {self.pages_analyzed}", end="")


async def main():
    """Research with real-time progress tracking."""

    tracker = ProgressTracker()

    options = ClaudeAgentOptions(
        model="claude-sonnet-4-5",
        max_turns=15,
        include_partial_messages=True,  # Enable streaming
        extra_args={"replay-user-messages": None}
    )

    async for message in query(prompt="Research transformer architectures", options=options):
        if isinstance(message, UserMessage):
            for block in message.content if not isinstance(message.content, str) else []:
                if isinstance(block, ToolResultBlock):
                    tracker.print_status()

        elif isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    pass  # Store final report
                elif isinstance(block, ThinkingBlock):
                    print(f"\n[Thinking: {block.thinking[:100]}...]")
                elif isinstance(block, ToolUseBlock):
                    print(f"\n[Tool: {block.name}]")

        elif isinstance(message, SystemMessage):
            if message.subtype == "subagent_start":
                tracker.current_agent = message.data.get("agent_name", "coordinator")

        elif isinstance(message, ResultMessage):
            print(f"\n\nCompleted in {(datetime.now() - tracker.start_time).seconds}s")
            print(f"Cost: ${message.total_cost_usd:.4f}")

anyio.run(main)
```

**Key Concepts Introduced:**
- `include_partial_messages=True` for streaming
- All message types handling
- All content blocks: `TextBlock`, `ThinkingBlock`, `ToolUseBlock`, `ToolResultBlock`
- Progress tracking across tool invocations

---

### Step 8: Production-Ready Agent

**What it teaches:** Error handling, guardrails, and production patterns.

**Concept:** Production agents need error handling, cost controls, timeout management, and graceful degradation.

```python
# step-8-production-agent.py
import anyio
import httpx
from typing import Any
from datetime import datetime
from dataclasses import dataclass, field
from claude_agent_sdk import (
    query,
    tool,
    create_sdk_mcp_server,
    ClaudeAgentOptions,
    AssistantMessage,
    ResultMessage,
    TextBlock
)


@dataclass
class ResearchConfig:
    topic: str
    max_sources: int = 10
    max_budget_usd: float = 1.00
    max_turns: int = 20
    timeout_seconds: int = 300


@dataclass
class ResearchResult:
    success: bool
    report: str = ""
    sources: list[dict] = field(default_factory=list)
    cost_usd: float = 0.0
    duration_seconds: int = 0
    error: str | None = None


class DeepResearchAgent:
    def __init__(self, config: ResearchConfig):
        self.config = config
        self.sources: list[dict] = []
        self._setup_tools()

    def _setup_tools(self):
        @tool("web_search", "Search the web", {"query": str, "num_results": int})
        async def web_search(args: dict[str, Any]) -> dict[str, Any]:
            try:
                # Production: real search API here
                results = [{"title": f"R{i}", "url": f"https://example.com/{i}"} for i in range(args.get("num_results", 5))]
                self.sources.extend(results)
                return {"content": [{"type": "text", "text": str(results)}]}
            except Exception as e:
                return {"content": [{"type": "text", "text": f"Error: {e}"}], "is_error": True}

        @tool("fetch_page", "Fetch page content", {"url": str})
        async def fetch_page(args: dict[str, Any]) -> dict[str, Any]:
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    response = await client.get(args["url"], follow_redirects=True)
                    return {"content": [{"type": "text", "text": response.text[:8000]}]}
            except Exception as e:
                return {"content": [{"type": "text", "text": f"Error: {e}"}], "is_error": True}

        self.server = create_sdk_mcp_server("research", "1.0.0", [web_search, fetch_page])

    async def research(self) -> ResearchResult:
        start_time = datetime.now()
        report = ""

        options = ClaudeAgentOptions(
            model="claude-sonnet-4-5",
            fallback_model="claude-haiku-3-5",
            max_turns=self.config.max_turns,
            max_budget_usd=self.config.max_budget_usd,
            mcp_servers={"research": self.server},
            allowed_tools=["mcp__research__web_search", "mcp__research__fetch_page"]
        )

        try:
            with anyio.move_on_after(self.config.timeout_seconds):
                async for message in query(prompt=f"Research: {self.config.topic}", options=options):
                    if isinstance(message, AssistantMessage):
                        for block in message.content:
                            if isinstance(block, TextBlock):
                                report = block.text
                    elif isinstance(message, ResultMessage):
                        return ResearchResult(
                            success=True,
                            report=report,
                            sources=self.sources,
                            cost_usd=message.total_cost_usd,
                            duration_seconds=(datetime.now() - start_time).seconds
                        )

            return ResearchResult(success=False, report=report, error="Timeout")
        except Exception as e:
            return ResearchResult(success=False, error=str(e))


async def main():
    config = ResearchConfig(
        topic="AI code generation tools impact on developer productivity",
        max_budget_usd=0.75,
        timeout_seconds=180
    )

    agent = DeepResearchAgent(config)
    result = await agent.research()

    if result.success:
        print(f"Completed in {result.duration_seconds}s (${result.cost_usd:.4f})")
        print(result.report)
    else:
        print(f"Failed: {result.error}")

anyio.run(main)
```

**Key Concepts Introduced:**
- Production patterns: config classes, result types
- `fallback_model` for reliability
- Error handling in tools
- Timeout management with `anyio.move_on_after`
- Graceful degradation

---

## ScrollyCoding Step Breakdown

| Step | Title | Lines | SDK Concepts | Teaching Goal |
|------|-------|-------|--------------|---------------|
| 1 | Hello Agent | ~15 | `query()`, `AssistantMessage` | Message loop |
| 2 | Configuration | ~35 | `ClaudeAgentOptions`, limits | Agent control |
| 3 | Custom Tools | ~80 | `@tool`, MCP server | Extend capabilities |
| 4 | Structured Output | ~70 | JSON Schema | Enforce format |
| 5 | Subagent: Searcher | ~65 | `agents` basics | Delegation |
| 6 | Multi-Agent | ~90 | Multiple subagents | Orchestration |
| 7 | Streaming | ~100 | All message types | Real-time feedback |
| 8 | Production | ~180 | Full patterns | Production ready |

---

## Next Steps

1. Create MDX blog post with ScrollyCoding component
2. Build step files with highlighted code regions
3. Add interactive demos
4. Include architecture diagrams
5. Test all code examples end-to-end
