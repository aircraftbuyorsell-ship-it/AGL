const AGL_SCHEMA_REF = "https://github.com/aircraftbuyorsell-ship-it/AGL/blob/main/schemas/agl-execution-graph.schema.json";

function requireString(value, name) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name} is required`);
}

export function openShellDecisionToAgl(observation, options = {}) {
  requireString(observation?.decision_id, "decision_id");
  requireString(observation?.sandbox_id, "sandbox_id");
  requireString(observation?.decision, "decision");

  const decision = String(observation.decision).toLowerCase();
  if (!["allow", "deny"].includes(decision)) throw new Error("decision must be allow or deny");

  const executionId = observation.execution_id ?? `openshell:${observation.decision_id}`;
  const policyId = observation.policy_id ?? `openshell-policy:${observation.sandbox_id}`;
  const evidenceId = `evidence-openshell-${observation.decision_id}`;

  const nodes = [
    { id: executionId, type: "execution", label: "OpenShell runtime enforcement decision",
      attributes: { status: decision === "allow" ? "completed" : "denied", sandbox_id: observation.sandbox_id } },
    { id: `sandbox:${observation.sandbox_id}`, type: "environment", label: "OpenShell sandbox",
      attributes: { sandbox_id: observation.sandbox_id } },
    { id: policyId, type: "policy", label: "OpenShell effective policy",
      attributes: { policy_source: observation.policy_source ?? "unknown" } },
    { id: `authorization:${observation.decision_id}`, type: "authorization_decision", label: `OpenShell ${decision}`,
      attributes: { decision, decision_id: observation.decision_id } },
    { id: evidenceId, type: "evidence", label: "OpenShell enforcement evidence",
      attributes: { integrity: observation.integrity_status ?? "unknown", external_ref: observation.external_ref ?? observation.decision_id } }
  ];

  const edges = [
    { id: `edge-${observation.decision_id}-policy`, source: executionId, target: policyId, relation: "constrained_by" },
    { id: `edge-${observation.decision_id}-sandbox`, source: executionId, target: `sandbox:${observation.sandbox_id}`, relation: "runs_on" },
    { id: `edge-${observation.decision_id}-authorization`, source: executionId, target: `authorization:${observation.decision_id}`, relation: "authorized_by" },
    { id: `edge-${observation.decision_id}-evidence`, source: executionId, target: evidenceId, relation: "evidenced_by" }
  ];

  return {
    schema: AGL_SCHEMA_REF,
    execution_id: executionId,
    nodes,
    edges,
    evidence: [{
      id: evidenceId, type: "runtime-enforcement", subject: executionId,
      producer: `openshell:${observation.sandbox_id}`,
      integrity: observation.integrity_status ?? "unknown",
      external_refs: observation.external_ref ? [observation.external_ref] : [observation.decision_id],
      attributes: { decision, sandbox_id: observation.sandbox_id, policy_id: policyId }
    }],
    metadata: {
      adapter: "agl-openshell",
      adapter_version: options.adapter_version ?? "0.1.0",
      source: "NVIDIA OpenShell",
      fabricated_evidence: false
    }
  };
}
