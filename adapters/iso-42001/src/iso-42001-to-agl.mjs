function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

export function iso42001ToAgl(record, options = {}) {
  if (!record || typeof record !== "object") throw new Error("ISO/IEC 42001 record must be an object");
  const reference = firstDefined(record.controlId, record.requirement, record.reference);
  if (!reference) throw new Error("ISO/IEC 42001 record requires a control or requirement reference");

  const version = firstDefined(record.version, "ISO/IEC 42001:2023");
  const frameworkId = "iso-42001:" + version;
  const controlId = "iso-42001:" + reference;
  const evidenceId = "iso-42001:evidence:" + encodeURIComponent(reference);

  return {
    agl_version: "0.1.0",
    nodes: [
      {
        node_id: "policy:" + frameworkId,
        node_type: "policy",
        name: frameworkId,
        external_refs: [{ system: "iso", ref: "ISO/IEC 42001:" + version.split(":").pop(), relation: "framework" }]
      },
      {
        node_id: controlId,
        node_type: "policy",
        name: reference,
        attributes: {
          framework: "ISO/IEC 42001",
          version,
          state: record.state ?? "unassessed"
        },
        external_refs: [{ system: "iso", ref: reference, relation: "requirement" }]
      }
    ],
    edges: [{
      edge_id: "iso-42001-control:" + encodeURIComponent(reference),
      source: "policy:" + frameworkId,
      relation: "contains",
      target: controlId,
      evidence_refs: [evidenceId]
    }],
    evidence: [{
      evidence_id: evidenceId,
      producer: options.producer ?? "iso-42001-mapping",
      subject: controlId,
      type: "iso-42001.requirement",
      source: "ISO/IEC 42001",
      integrity_status: options.integrityStatus ?? "unknown",
      external_refs: [{ system: "iso", ref: reference, relation: "requirement" }]
    }]
  };
}
