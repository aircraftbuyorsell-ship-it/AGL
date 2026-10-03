import assert from "node:assert/strict";
import { openLineageEventToAgl } from "../src/openlineage-to-agl.mjs";
const event = {
  eventTime: "2026-10-03T05:02:00Z",
  producer: "https://github.com/example/lineage@abc123",
  schemaURL: "https://openlineage.io/spec/1-0-2/OpenLineage.json",
  eventType: "COMPLETE",
  run: { runId: "run-001" },
  job: { namespace: "abos", name: "aircraft-verification" },
  inputs: [{ namespace: "abos", name: "faa-aircraft-record" }],
  outputs: [{ namespace: "abos", name: "aircraft-verification-result" }]
};
const graph = openLineageEventToAgl(event);
assert.equal(graph.execution_id, "openlineage:run:run-001");
assert.equal(graph.execution.status, "completed");
assert.ok(graph.nodes.some((node) => node.node_type === "workflow"));
assert.ok(graph.nodes.some((node) => node.name === "faa-aircraft-record"));
assert.ok(graph.nodes.some((node) => node.name === "aircraft-verification-result"));
assert.ok(graph.edges.some((edge) => edge.relation === "produces"));
assert.ok(graph.edges.some((edge) => edge.relation === "consumes"));
assert.equal(graph.evidence.length, 1);
console.log("OpenLineage adapter: PASS");
