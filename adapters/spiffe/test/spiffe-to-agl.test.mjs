import assert from "node:assert/strict";
import { spiffeIdentityToAgl } from "../src/spiffe-to-agl.mjs";

const graph = spiffeIdentityToAgl({
  spiffeId: "spiffe://abos.example/agent/verification",
  serviceName: "aircraft-verification",
  agentId: "abos-verification",
  svidType: "spiffe.x509-svid",
  validationStatus: "verified",
  observedAt: "2026-10-03T05:40:00Z",
  svidRef: "svid:001"
});

assert.equal(graph.execution.status, "authorized");
assert.equal(graph.execution.root_actor, "spiffe-id:spiffe://abos.example/agent/verification");
assert.ok(graph.nodes.some((n) => n.node_type === "actor"));
assert.ok(graph.nodes.some((n) => n.node_type === "service"));
assert.ok(graph.nodes.some((n) => n.node_type === "agent"));
assert.ok(graph.edges.some((e) => e.relation === "executed_by"));
assert.ok(graph.evidence[0].external_refs.some((r) => r.relation === "svid"));
assert.equal(graph.evidence[0].integrity_status, "verified");

assert.throws(
  () => spiffeIdentityToAgl({ spiffeId: "not-a-spiffe-id" }),
  /valid spiffe/
);

console.log("SPIFFE adapter test passed");
