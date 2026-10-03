import assert from "node:assert/strict";
import { a2aTaskToAgl } from "../src/a2a-to-agl.mjs";

const graph = a2aTaskToAgl({
  agentCard: { name: "ABOS Verification Agent", version: "1.0" },
  task: {
    id: "task-001",
    contextId: "ctx-001",
    status: {
      state: "completed",
      timestamp: "2026-10-03T05:30:00Z"
    }
  },
  clientAgentId: "abos-orchestrator"
});

assert.equal(graph.execution_id, "a2a:task:task-001");
assert.equal(graph.execution.status, "completed");
assert.ok(graph.nodes.some((n) => n.node_id === "agent:a2a:ABOS Verification Agent"));
assert.ok(graph.nodes.some((n) => n.node_id === "agent:abos-orchestrator"));
assert.ok(graph.edges.some((e) => e.relation === "executed_by"));
assert.ok(graph.edges.some((e) => e.relation === "delegated_by"));
assert.equal(graph.evidence[0].type, "a2a.task");

const failed = a2aTaskToAgl({
  agent: { name: "Remote Agent" },
  task: {
    id: "task-002",
    status: { state: "failed", timestamp: "2026-10-03T05:31:00Z" }
  }
});
assert.equal(failed.execution.status, "failed");

console.log("A2A adapter test passed");
