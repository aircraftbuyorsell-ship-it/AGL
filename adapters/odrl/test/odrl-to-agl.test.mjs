import assert from "node:assert/strict";
import { odrlToAgl } from "../src/odrl-to-agl.mjs";

const graph = odrlToAgl({
  uid: "policy:aircraft-read",
  permission: [{ uid: "perm:1", action: "read" }],
  prohibition: [{ uid: "prohibit:1", action: "delete" }],
  duty: [{ uid: "duty:1", action: "audit" }]
}, { integrityStatus: "verified" });

assert.equal(graph.policy.policy_id, "policy:aircraft-read");
assert.equal(graph.evidence.length, 3);
assert.ok(graph.nodes.some((n) => n.attributes?.rule_type === "permission"));
assert.ok(graph.nodes.some((n) => n.attributes?.rule_type === "prohibition"));
assert.ok(graph.nodes.some((n) => n.attributes?.rule_type === "duty"));
assert.equal(graph.evidence[0].integrity_status, "verified");
assert.throws(() => odrlToAgl({ permission: [] }), /requires uid/);
console.log("ODRL adapter test passed");
