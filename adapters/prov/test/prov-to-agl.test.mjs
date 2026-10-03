import assert from "node:assert/strict";
import { provJsonToAgl } from "../src/prov-to-agl.mjs";
const graph = provJsonToAgl({
  entity: { "entity:result": { value: "verification-result" } },
  activity: { "activity:verify": { startedAtTime: "2026-10-03T05:03:00Z" } },
  agent: { "agent:abos": { type: "agent" } },
  used: { "usage:1": { activity: "activity:verify", entity: "entity:input" } },
  wasGeneratedBy: { "generation:1": { entity: "entity:result", activity: "activity:verify" } },
  wasAssociatedWith: { "association:1": { activity: "activity:verify", agent: "agent:abos" } },
  wasDerivedFrom: { "derivation:1": { generatedEntity: "entity:result", usedEntity: "entity:input" } }
}, { executionId: "prov:execution:001", createdAt: "2026-10-03T05:03:00Z" });
assert.equal(graph.execution_id, "prov:execution:001");
assert.ok(graph.nodes.some((n) => n.node_type === "data"));
assert.ok(graph.nodes.some((n) => n.node_type === "execution" && n.name === "activity:verify"));
assert.ok(graph.nodes.some((n) => n.node_type === "actor"));
assert.ok(graph.edges.some((e) => e.relation === "produces"));
assert.ok(graph.edges.some((e) => e.relation === "executed_by"));
assert.ok(graph.edges.some((e) => e.relation === "derived_from"));
assert.ok(graph.evidence.length >= 4);
console.log("W3C PROV adapter: PASS");
