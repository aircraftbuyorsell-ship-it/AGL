import assert from "node:assert/strict";
import { gaiaXToAgl } from "../src/gaia-x-to-agl.mjs";

const graph = gaiaXToAgl({
  id: "service:abos",
  type: "ServiceOffering",
  providedBy: "participant:abos",
  dependsOn: ["service:registry"],
  policy: ["policy:usage"],
  trustState: "verified"
}, { integrityStatus: "verified" });

assert.ok(graph.nodes.some((n) => n.node_type === "service"));
assert.ok(graph.nodes.some((n) => n.node_type === "actor"));
assert.ok(graph.nodes.some((n) => n.node_type === "policy"));
assert.ok(graph.edges.some((e) => e.relation === "depends_on"));
assert.ok(graph.edges.some((e) => e.relation === "constrained_by"));
assert.equal(graph.evidence[0].integrity_status, "verified");
assert.throws(() => gaiaXToAgl({ type: "ServiceOffering" }), /requires an id/);
console.log("Gaia-X adapter test passed");
