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
    # This is a placeholder demonstrating the pattern
    results = [
        {
            "title": f"Result {i+1} for: {query_text}",
            "url": f"https://example.com/article-{i+1}",
            "snippet": f"This article discusses {query_text} and its implications..."
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

        # In production, use a proper HTML parser (beautifulsoup, trafilatura)
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
        max_turns=1,  # Single turn for structured output
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

            # The output is validated JSON matching our schema
            print(f"# {report['title']}\n")
            print(f"## Executive Summary\n{report['executive_summary']}\n")

            print("## Key Findings")
            for i, finding in enumerate(report['key_findings'], 1):
                confidence = finding['confidence'].upper()
                print(f"{i}. [{confidence}] {finding['finding']}")

            print("\n## Sources")
            for source in report['sources']:
                print(f"- [{source['title']}]({source['url']})")

            if 'limitations' in report:
                print("\n## Limitations")
                for limitation in report['limitations']:
                    print(f"- {limitation}")

anyio.run(main)
```

**Key Concepts Introduced:**
- `output_format` with JSON Schema
- Schema design for research reports
- `message.structured_output` for validated data
- Type-safe data extraction
- Report formatting from structured data

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

# Reuse tools from Step 3
@tool("web_search", "Search the web for information", {"query": str, "num_results": int})
async def web_search(args: dict[str, Any]) -> dict[str, Any]:
    # Implementation from Step 3
    results = [
        {"title": f"Result {i+1}", "url": f"https://example.com/{i+1}", "snippet": "..."}
        for i in range(args.get("num_results", 5))
    ]
    formatted = "\n".join(f"- {r['title']}: {r['url']}" for r in results)
    return {"content": [{"type": "text", "text": formatted}]}


@tool("fetch_page", "Fetch web page content", {"url": str})
async def fetch_page(args: dict[str, Any]) -> dict[str, Any]:
    return {"content": [{"type": "text", "text": f"Content from {args['url']}..."}]}


async def main():
    """Multi-agent research with a specialized searcher."""

    research_server = create_sdk_mcp_server(
        name="research",
        version="1.0.0",
        tools=[web_search, fetch_page]
    )

    options = ClaudeAgentOptions(
        model="claude-sonnet-4-5",
        max_turns=15,
        system_prompt="""You are a research coordinator.
        Delegate search tasks to the source-finder agent.
        Then synthesize findings into a comprehensive report.""",
        mcp_servers={"research": research_server},
        allowed_tools=[
            "mcp__research__web_search",
            "mcp__research__fetch_page"
        ],

        # Define specialized subagent
        agents={
            "source-finder": {
                "description": """Expert at finding and evaluating sources.
                Use this agent to search for relevant articles, papers, and
                documentation on a specific topic. Returns ranked sources.""",
                "prompt": """You are a research librarian specialized in finding sources.

                Your workflow:
                1. Generate 3-5 search queries that cover different aspects of the topic
                2. Execute searches and collect results
                3. Evaluate sources for credibility and relevance
                4. Return a ranked list of the top 5-10 most valuable sources

                Focus on finding diverse, authoritative sources.""",
                "tools": ["mcp__research__web_search"],
                "model": "haiku"  # Use faster model for search
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
- Model selection per subagent (haiku for speed)
- `SystemMessage` for agent lifecycle events
- Coordinator/worker pattern

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

# Tools
@tool("web_search", "Search the web", {"query": str, "num_results": int})
async def web_search(args: dict[str, Any]) -> dict[str, Any]:
    # Simulated search results
    return {"content": [{"type": "text", "text": f"Results for: {args['query']}..."}]}

@tool("fetch_page", "Fetch page content", {"url": str})
async def fetch_page(args: dict[str, Any]) -> dict[str, Any]:
    return {"content": [{"type": "text", "text": f"Content from {args['url']}..."}]}

@tool("store_finding", "Store a research finding", {"finding": str, "source": str, "confidence": str})
async def store_finding(args: dict[str, Any]) -> dict[str, Any]:
    # In production, this would save to a database
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
        system_prompt="""You are a research director coordinating a team of specialists.

        Your team:
        - source-finder: Discovers relevant sources
        - content-analyst: Deep-reads and extracts insights
        - fact-checker: Validates claims across sources

        Workflow:
        1. Delegate source discovery to source-finder
        2. Have content-analyst read and summarize key sources
        3. Use fact-checker to validate controversial claims
        4. Synthesize everything into a final report

        Be strategic about which agents to invoke and when.""",
        mcp_servers={"research": research_server},
        allowed_tools=[
            "mcp__research__web_search",
            "mcp__research__fetch_page",
            "mcp__research__store_finding"
        ],

        agents={
            "source-finder": {
                "description": """Expert at discovering and ranking sources.
                Invoke when you need to find articles, papers, or documentation.""",
                "prompt": """Find diverse, authoritative sources on the given topic.
                Execute multiple search queries and rank results by relevance.""",
                "tools": ["mcp__research__web_search"],
                "model": "haiku"
            },

            "content-analyst": {
                "description": """Expert at deep-reading and extracting insights.
                Invoke when you need to analyze specific sources in detail.""",
                "prompt": """Read sources thoroughly and extract:
                - Key arguments and claims
                - Supporting evidence
                - Potential biases or limitations
                Store important findings using store_finding.""",
                "tools": ["mcp__research__fetch_page", "mcp__research__store_finding"],
                "model": "sonnet"
            },

            "fact-checker": {
                "description": """Expert at validating claims across multiple sources.
                Invoke when you need to verify controversial or important claims.""",
                "prompt": """Cross-reference claims against multiple sources.
                Look for:
                - Corroborating evidence
                - Contradicting information
                - Primary vs secondary sources
                Assign confidence levels: high, medium, low.""",
                "tools": ["mcp__research__web_search", "mcp__research__fetch_page"],
                "model": "sonnet"
            }
        }
    )

    async for message in query(
        prompt="""Research the current state of autonomous AI agents:
        - Key capabilities and limitations
        - Major players and their approaches
        - Production deployment challenges
        - Future trajectory and predictions""",
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
            print(f"\n---")
            print(f"Research complete. Cost: ${message.total_cost_usd:.4f}")

anyio.run(main)
```

**Key Concepts Introduced:**
- Multiple specialized subagents
- Agent descriptions that guide automatic delegation
- Different models per agent (cost optimization)
- Tool access control per agent
- Coordinator strategy and workflow design
- Cost tracking for complex pipelines

---

### Step 7: Streaming and Progress Tracking

**What it teaches:** Real-time message handling and progress visualization.

**Concept:** Users want to see research progress in real-time. We'll build proper message handling to show tool invocations, agent delegations, and partial results.

```python
# step-7-streaming-progress.py
import anyio
from claude_agent_sdk import (
    query,
    tool,
    create_sdk_mcp_server,
    ClaudeAgentOptions,
    UserMessage,
    AssistantMessage,
    SystemMessage,
    ResultMessage,
    StreamEvent,
    TextBlock,
    ThinkingBlock,
    ToolUseBlock,
    ToolResultBlock
)
from typing import Any
from datetime import datetime


class ResearchProgressTracker:
    """Track and display research progress."""

    def __init__(self):
        self.sources_found = 0
        self.pages_analyzed = 0
        self.findings_stored = 0
        self.current_agent = "coordinator"
        self.start_time = datetime.now()

    def print_status(self):
        elapsed = (datetime.now() - self.start_time).seconds
        print(f"\r[{elapsed}s] Agent: {self.current_agent} | "
              f"Sources: {self.sources_found} | "
              f"Analyzed: {self.pages_analyzed} | "
              f"Findings: {self.findings_stored}", end="", flush=True)


# Tools with progress tracking
tracker = ResearchProgressTracker()

@tool("web_search", "Search the web", {"query": str})
async def web_search(args: dict[str, Any]) -> dict[str, Any]:
    tracker.sources_found += 5
    return {"content": [{"type": "text", "text": f"Found 5 results for: {args['query']}"}]}

@tool("fetch_page", "Fetch page content", {"url": str})
async def fetch_page(args: dict[str, Any]) -> dict[str, Any]:
    tracker.pages_analyzed += 1
    return {"content": [{"type": "text", "text": f"Analyzed: {args['url']}"}]}

@tool("store_finding", "Store a finding", {"finding": str, "source": str})
async def store_finding(args: dict[str, Any]) -> dict[str, Any]:
    tracker.findings_stored += 1
    return {"content": [{"type": "text", "text": "Finding stored."}]}


async def main():
    """Research agent with real-time progress tracking."""

    research_server = create_sdk_mcp_server(
        name="research",
        version="1.0.0",
        tools=[web_search, fetch_page, store_finding]
    )

    options = ClaudeAgentOptions(
        model="claude-sonnet-4-5",
        max_turns=15,
        include_partial_messages=True,  # Enable streaming
        extra_args={"replay-user-messages": None},  # Get full message flow
        mcp_servers={"research": research_server},
        allowed_tools=[
            "mcp__research__web_search",
            "mcp__research__fetch_page",
            "mcp__research__store_finding"
        ],
        agents={
            "searcher": {
                "description": "Finds sources",
                "prompt": "Find relevant sources using web_search.",
                "tools": ["mcp__research__web_search"],
                "model": "haiku"
            }
        }
    )

    print("Starting research...\n")
    final_report = ""

    async for message in query(
        prompt="Research the evolution of transformer architectures in 2024-2025",
        options=options
    ):
        # User messages (including tool results)
        if isinstance(message, UserMessage):
            if not isinstance(message.content, str):
                for block in message.content:
                    if isinstance(block, ToolResultBlock):
                        tracker.print_status()

        # Assistant messages
        elif isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    final_report = block.text
                elif isinstance(block, ThinkingBlock):
                    print(f"\n[Thinking: {block.thinking[:100]}...]")
                elif isinstance(block, ToolUseBlock):
                    print(f"\n[Tool: {block.name}({list(block.input.keys())})]")

        # System events (agent lifecycle)
        elif isinstance(message, SystemMessage):
            agent = message.data.get("agent_name", "coordinator")
            if message.subtype == "subagent_start":
                tracker.current_agent = agent
                print(f"\n[Delegating to {agent}]")
            elif message.subtype == "subagent_end":
                tracker.current_agent = "coordinator"
                print(f"\n[{agent} completed]")

        # Streaming events
        elif isinstance(message, StreamEvent):
            # Handle partial message updates
            pass

        # Final result
        elif isinstance(message, ResultMessage):
            print(f"\n\n{'='*50}")
            print("RESEARCH COMPLETE")
            print(f"{'='*50}")
            print(f"Time: {(datetime.now() - tracker.start_time).seconds}s")
            print(f"Cost: ${message.total_cost_usd:.4f}")
            print(f"Sources found: {tracker.sources_found}")
            print(f"Pages analyzed: {tracker.pages_analyzed}")
            print(f"Findings stored: {tracker.findings_stored}")
            print(f"\n{'='*50}")
            print("FINAL REPORT")
            print(f"{'='*50}")
            print(final_report)

anyio.run(main)
```

**Key Concepts Introduced:**
- `include_partial_messages=True` for streaming
- `extra_args={"replay-user-messages": None}` for full message replay
- All message types: `UserMessage`, `AssistantMessage`, `SystemMessage`, `StreamEvent`, `ResultMessage`
- All content blocks: `TextBlock`, `ThinkingBlock`, `ToolUseBlock`, `ToolResultBlock`
- Progress tracking across tool invocations
- Real-time status updates

---

### Step 8: Production-Ready Agent

**What it teaches:** Error handling, guardrails, and production patterns.

**Concept:** Production agents need error handling, cost controls, timeout management, and graceful degradation. This final step shows the complete, robust implementation.

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
    SystemMessage,
    ResultMessage,
    TextBlock,
    ToolUseBlock
)


@dataclass
class ResearchConfig:
    """Configuration for the research agent."""
    topic: str
    max_sources: int = 10
    max_budget_usd: float = 1.00
    max_turns: int = 20
    timeout_seconds: int = 300


@dataclass
class ResearchResult:
    """Structured result from research."""
    success: bool
    report: str = ""
    sources: list[dict] = field(default_factory=list)
    cost_usd: float = 0.0
    duration_seconds: int = 0
    error: str | None = None


class DeepResearchAgent:
    """Production-ready deep research agent."""

    def __init__(self, config: ResearchConfig):
        self.config = config
        self.sources: list[dict] = []
        self.findings: list[dict] = []
        self._setup_tools()

    def _setup_tools(self):
        """Create MCP tools with proper error handling."""

        @tool("web_search", "Search the web for information", {
            "query": str,
            "num_results": int
        })
        async def web_search(args: dict[str, Any]) -> dict[str, Any]:
            try:
                query_text = args["query"]
                num_results = min(args.get("num_results", 5), self.config.max_sources)

                # Production: Replace with real search API
                async with httpx.AsyncClient(timeout=10.0) as client:
                    # response = await client.get(f"https://api.search.com/search?q={query_text}")
                    # results = response.json()["results"]

                    # Simulated results for demo
                    results = [
                        {"title": f"Result {i}", "url": f"https://example.com/{i}", "snippet": "..."}
                        for i in range(num_results)
                    ]

                self.sources.extend(results)
                formatted = "\n".join(f"- {r['title']}: {r['url']}" for r in results)
                return {"content": [{"type": "text", "text": formatted}]}

            except httpx.TimeoutException:
                return {
                    "content": [{"type": "text", "text": "Search timed out. Try a more specific query."}],
                    "is_error": True
                }
            except Exception as e:
                return {
                    "content": [{"type": "text", "text": f"Search failed: {str(e)}"}],
                    "is_error": True
                }

        @tool("fetch_page", "Fetch and extract page content", {"url": str})
        async def fetch_page(args: dict[str, Any]) -> dict[str, Any]:
            try:
                url = args["url"]

                async with httpx.AsyncClient(timeout=15.0) as client:
                    response = await client.get(url, follow_redirects=True)
                    response.raise_for_status()

                # Production: Use proper HTML parser
                content = response.text[:8000]  # Truncate for token limits
                return {"content": [{"type": "text", "text": content}]}

            except httpx.HTTPStatusError as e:
                return {
                    "content": [{"type": "text", "text": f"HTTP {e.response.status_code}: {url}"}],
                    "is_error": True
                }
            except Exception as e:
                return {
                    "content": [{"type": "text", "text": f"Fetch failed: {str(e)}"}],
                    "is_error": True
                }

        @tool("store_finding", "Store a research finding", {
            "finding": str,
            "source_url": str,
            "confidence": str
        })
        async def store_finding(args: dict[str, Any]) -> dict[str, Any]:
            self.findings.append({
                "finding": args["finding"],
                "source": args["source_url"],
                "confidence": args.get("confidence", "medium")
            })
            return {"content": [{"type": "text", "text": f"Stored finding ({len(self.findings)} total)"}]}

        self.server = create_sdk_mcp_server(
            name="research",
            version="1.0.0",
            tools=[web_search, fetch_page, store_finding]
        )

    async def research(self) -> ResearchResult:
        """Execute the research workflow."""
        start_time = datetime.now()
        report = ""

        options = ClaudeAgentOptions(
            model="claude-sonnet-4-5",
            fallback_model="claude-haiku-3-5",  # Fallback if primary unavailable
            max_turns=self.config.max_turns,
            max_budget_usd=self.config.max_budget_usd,
            system_prompt=f"""You are a thorough research agent.

Research topic: {self.config.topic}

Your workflow:
1. Generate diverse search queries covering different aspects
2. Search and identify the most authoritative sources
3. Fetch and analyze key sources (max {self.config.max_sources})
4. Extract and store important findings with confidence levels
5. Synthesize into a comprehensive report with citations

Be efficient with API calls. Prioritize quality over quantity.""",
            mcp_servers={"research": self.server},
            allowed_tools=[
                "mcp__research__web_search",
                "mcp__research__fetch_page",
                "mcp__research__store_finding"
            ],
            agents={
                "deep-reader": {
                    "description": "Specialized in deep analysis of individual sources",
                    "prompt": "Analyze source content thoroughly. Extract key claims, evidence, and potential biases.",
                    "tools": ["mcp__research__fetch_page", "mcp__research__store_finding"],
                    "model": "sonnet"
                }
            }
        )

        try:
            with anyio.move_on_after(self.config.timeout_seconds):
                async for message in query(
                    prompt=f"Research: {self.config.topic}",
                    options=options
                ):
                    if isinstance(message, AssistantMessage):
                        for block in message.content:
                            if isinstance(block, TextBlock):
                                report = block.text
                            elif isinstance(block, ToolUseBlock):
                                print(f"[{block.name}] ", end="", flush=True)

                    elif isinstance(message, SystemMessage):
                        if message.subtype == "subagent_start":
                            print(f"\n[Delegating to {message.data.get('agent_name')}]")

                    elif isinstance(message, ResultMessage):
                        duration = (datetime.now() - start_time).seconds
                        return ResearchResult(
                            success=True,
                            report=report,
                            sources=self.sources,
                            cost_usd=message.total_cost_usd,
                            duration_seconds=duration
                        )

            # Timeout reached
            return ResearchResult(
                success=False,
                report=report,
                sources=self.sources,
                duration_seconds=self.config.timeout_seconds,
                error="Research timed out"
            )

        except Exception as e:
            return ResearchResult(
                success=False,
                error=str(e),
                duration_seconds=(datetime.now() - start_time).seconds
            )


async def main():
    """Run the production research agent."""

    config = ResearchConfig(
        topic="The current state of AI code generation tools and their impact on developer productivity",
        max_sources=8,
        max_budget_usd=0.75,
        max_turns=15,
        timeout_seconds=180
    )

    print(f"Starting research: {config.topic}\n")
    print(f"Budget: ${config.max_budget_usd} | Timeout: {config.timeout_seconds}s\n")
    print("-" * 50)

    agent = DeepResearchAgent(config)
    result = await agent.research()

    print("\n" + "=" * 50)

    if result.success:
        print("RESEARCH COMPLETED SUCCESSFULLY")
        print(f"Duration: {result.duration_seconds}s | Cost: ${result.cost_usd:.4f}")
        print(f"Sources: {len(result.sources)}")
        print("=" * 50)
        print("\nREPORT:\n")
        print(result.report)
    else:
        print("RESEARCH FAILED")
        print(f"Error: {result.error}")
        if result.report:
            print(f"\nPartial report:\n{result.report}")


if __name__ == "__main__":
    anyio.run(main)
```

**Key Concepts Introduced:**
- Production patterns: config classes, result types
- `fallback_model` for reliability
- Error handling in tools
- Timeout management with `anyio.move_on_after`
- Graceful degradation (partial results on timeout)
- Cost and resource tracking
- Clean separation of concerns
- Complete, runnable agent

---

## ScrollyCoding Step Breakdown

| Step | Title | Lines of Code | SDK Concepts | Teaching Goal |
|------|-------|---------------|--------------|---------------|
| 1 | Hello Agent | ~15 | `query()`, `AssistantMessage` | Understand the message loop |
| 2 | Configuration | ~35 | `ClaudeAgentOptions`, limits | Control agent behavior |
| 3 | Custom Tools | ~80 | `@tool`, `create_sdk_mcp_server` | Extend capabilities |
| 4 | Structured Output | ~70 | `output_format`, JSON Schema | Enforce response format |
| 5 | Subagent: Searcher | ~65 | `agents` config basics | Introduce delegation |
| 6 | Multi-Agent Pipeline | ~90 | Multiple subagents | Orchestrate specialists |
| 7 | Streaming Progress | ~100 | All message types | Real-time feedback |
| 8 | Production Agent | ~180 | Full patterns | Production readiness |

---

## Persistent Copy

This plan should also be saved to the persistent location for future reference.

---

## Next Steps

1. Create MDX blog post with ScrollyCoding component
2. Build step files with highlighted code regions
3. Add interactive demos where possible
4. Include diagrams for agent architecture
5. Test all code examples end-to-end
