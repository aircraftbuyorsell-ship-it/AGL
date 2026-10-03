import assert from "node:assert/strict";
import { mcpToolCallToAgl } from "../src/mcp-to-agl.mjs";

const graph = mcpToolCallToAgl({
  server: { name: "faa-registry", version: "1.0.0" },
  tool: { name: "lookup_aircraft" },
  call: {
    id: "call-001",
    startedAt: "2026-10-03T05:20:00Z",
    endedAt: "2026-10-03T05:20:01Z",
    arguments: { registration: "N7692J" }
  },
  result: { isError: false },
  client: { name: "ABOS", agentId: "abos-verification" }
});

assert.equal(graph.execution_id, "mcp:call:faa-registry:lookup_aircraft:call-001");
assert.equal(graph.execution.status, "completed");
assert.ok(graph.nodes.some((n) => n.node_id === "mcp-server:faa-registry"));
assert.ok(graph.nodes.some((n) => n.node_id === "mcp-tool:faa-registry:lookup_aircraft"));
assert.ok(graph.nodes.some((n) => n.node_id === "agent:abos-verification"));
assert.ok(graph.edges.some((e) => e.relation === "invokes"));
assert.ok(graph.edges.some((e) => e.relation === "executed_by"));
assert.equal(graph.evidence[0].type, "mcp.tool_call");

const failed = mcpToolCallToAgl({
  server: { name: "faa-registry" },
  tool: { name: "lookup_aircraft" },
  call: { id: "call-002" },
  error: { code: -32000, message: "registry unavailable" }
});
assert.equal(failed.execution.status, "failed");

console.log("MCP adapter test passed");
