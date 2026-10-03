import assert from "node:assert/strict";
import { openShellDecisionToAgl } from "../src/openshell-to-agl.mjs";

const allowed = openShellDecisionToAgl({
  decision_id: "decision-001",
  sandbox_id: "sandbox-001",
  decision: "allow",
  policy_id: "policy-001",
  external_ref: "openshell:event:001",
  integrity_status: "unknown"
});

assert.equal(allowed.execution_id, "openshell:decision-001");
assert.equal(allowed.nodes.find((n) => n.type === "authorization_decision").attributes.decision, "allow");
assert.equal(allowed.nodes.find((n) => n.type === "execution").attributes.status, "completed");
assert.ok(allowed.edges.some((e) => e.relation === "constrained_by"));
assert.ok(allowed.edges.some((e) => e.relation === "evidenced_by"));
assert.equal(allowed.metadata.fabricated_evidence, false);

const denied = openShellDecisionToAgl({
  decision_id: "decision-002",
  sandbox_id: "sandbox-001",
  decision: "deny"
});

assert.equal(denied.nodes.find((n) => n.type === "execution").attributes.status, "denied");
assert.equal(denied.nodes.find((n) => n.type === "authorization_decision").attributes.decision, "deny");

assert.throws(() => openShellDecisionToAgl({
  decision_id: "decision-003",
  sandbox_id: "sandbox-001",
  decision: "maybe"
}));

console.log("OpenShell → AGL adapter test: PASS");
