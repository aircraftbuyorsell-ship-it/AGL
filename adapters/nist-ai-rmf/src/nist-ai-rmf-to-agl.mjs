const FUNCTIONS = new Set(["GOVERN", "MAP", "MEASURE", "MANAGE"]);

export function nistAiRmfToAgl(record, options = {}) {
  if (!record || typeof record !== "object") throw new Error("NIST AI RMF record must be an object");
  const functionName = String(record.function ?? record.rmfFunction ?? "").toUpperCase();
  if (!FUNCTIONS.has(functionName)) throw new Error("NIST AI RMF function must be Govern, Map, Measure, or Manage");

  const controlId = record.controlId ?? record.subcategory ?? record.reference;
  if (!controlId) throw new Error("NIST AI RMF record requires controlId, subcategory, or reference");

  const policyId = options.policyId ?? "nist-ai-rmf:1.0";
  const evidenceId = `nist-ai-rmf:evidence:${encodeURIComponent(controlId)}`;
  const controlNode = `nist-ai-rmf:${controlId}`;

  return {
    agl_version: "0.1.0",
    nodes: [
      {
        node_id: `policy:${policyId}`,
        node_type: "policy",
        name: policyId,
        external_refs: [{ system: "nist-ai-rmf", ref: "AI RMF 1.0", relation: "framework" }]
      },
      {
        node_id: controlNode,
        node_type: "policy",
        name: controlId,
        attributes: {
          framework: "NIST AI RMF",
          function: functionName,
          state: record.state ?? "unassessed"
        },
        external_refs: [{ system: "nist-ai-rmf", ref: controlId, relation: "subcategory" }]
      }
    ],
    edges: [{
      edge_id: `rmf-control:${encodeURIComponent(controlId)}`,
      source: `policy:${policyId}`,
      relation: "contains",
      target: controlNode,
      evidence_refs: [evidenceId]
    }],
    evidence: [{
      evidence_id: evidenceId,
      producer: options.producer ?? "nist-ai-rmf-mapping",
      subject: controlNode,
      type: `nist-ai-rmf.${functionName.toLowerCase()}`,
      source: "NIST AI RMF",
      integrity_status: options.integrityStatus ?? "unknown",
      external_refs: [{ system: "nist-ai-rmf", ref: controlId, relation: "control" }]
    }]
  };
}
