# MCP → AGL Adapter

Maps a normalized Model Context Protocol tool invocation/result record into an AGL Execution Graph fragment.

The MCP protocol connects AI applications with servers exposing tools, resources and prompts. AGL does not replace MCP; it records the governed execution and evidence context around MCP tool use. The current MCP TypeScript SDK v2 implements the 2026-07-28 specification.

## Mapping

- MCP server → AGL tool node
- MCP tool → AGL tool node
- MCP tool invocation → AGL execution
- client agent, when declared → AGL agent
- execution → invokes → tool
- execution → runs_on → MCP server
- execution → executed_by → agent
- MCP call/result → AGL evidence

The adapter accepts a normalized call record so it can be fed by MCP SDK middleware, gateway telemetry, or an AGL-aware MCP client without coupling the graph model to one transport.

This is an evidence mapping, not an MCP protocol validator.
