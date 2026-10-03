function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

const ALLOWED = new Set(["prohibited", "transparency", "high-risk", "gpai", "governance", "other"]);

export function euAiActToAgl(record, options = {}) {
  if (!record || typeof record !== "object") throw new Error("EU AI Act record must be an object");
  const reference = firstDefined(record.article, record.annex, record.reference);
  if (!reference) throw new Error("EU AI Act record requires article, annex, or reference");

  const category = String(firstDefined(record.category, "other")).toLowerCase();
  if (!ALLOWED.has(category)) throw new Error("Unsupported EU AI Act category");

  const framework = firstDefined(record.version, "Regulation (EU) 2024/1689");
  const policyId = "eu-ai-act:" + framework;
  const nodeId = "eu-ai-act:" + reference;
  const evidenceId = "eu-ai-act:evidence:" + encodeURIComponent(reference);

  return {
    agl_version: "0.1.0",
    nodes: [
      {
        node_id: "policy:" + policyId,
        node_type: "policy",
        name: policyId,
        external_refs: [{ system: "eur-lex", ref: framework, relation: "regulation" }]
      },
      {
        node_id: nodeId,
        node_type: "policy",
        name: reference,
        attributes: {
          framework: "EU AI Act",
          category,
          applicability: record.applicability ?? "unassessed",
          state: record.state ?? "unassessed"
        },
        external_refs: [{ system: "eur-lex", ref: reference, relation: "legal_reference" }]
      }
    ],
    edges: [{
      edge_id: "eu-ai-act-reference:" + encodeURIComponent(reference),
      source: "policy:" + policyId,
      relation: "contains",
      target: nodeId,
      evidence_refs: [evidenceId]
    }],
    evidence: [{
      evidence_id: evidenceId,
      producer: options.producer ?? "eu-ai-act-mapping",
      subject: nodeId,
      type: "eu-ai-act.legal-reference",
      source: "EUR-Lex",
      integrity_status: options.integrityStatus ?? "unknown",
      external_refs: [{ system: "eur-lex", ref: reference, relation: "legal_reference" }]
    }]
  };
}
