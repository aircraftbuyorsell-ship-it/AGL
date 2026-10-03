function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

export function gaiaXToAgl(record, options = {}) {
  if (!record || typeof record !== "object") throw new Error("Gaia-X record must be an object");
  const id = firstDefined(record.id, record["@id"], record.serviceId, record.participantId);
  if (!id) throw new Error("Gaia-X record requires an id");

  const type = firstDefined(record.type, record["@type"], "ServiceOffering");
  const nodeType = /participant/i.test(type) ? "actor" : /resource/i.test(type) ? "data" : "service";
  const nodeId = "gaia-x:" + id;
  const evidenceId = "gaia-x:evidence:" + encodeURIComponent(id);
  const nodes = [{
    node_id: nodeId,
    node_type: nodeType,
    name: id,
    attributes: { gaia_x_type: type, trust_state: record.trustState ?? "unknown" },
    external_refs: [{ system: "gaia-x", ref: id, relation: "self-description" }]
  }];
  const edges = [];

  if (record.providedBy) {
    const providerId = "gaia-x:" + record.providedBy;
    nodes.push({ node_id: providerId, node_type: "actor", name: record.providedBy, external_refs: [{ system: "gaia-x", ref: record.providedBy, relation: "provider" }] });
    edges.push({ edge_id: "gaia-x-provider:" + encodeURIComponent(id), source: nodeId, relation: "authored_by", target: providerId, evidence_refs: [evidenceId] });
  }

  for (const [index, dependency] of (Array.isArray(record.dependsOn) ? record.dependsOn : []).entries()) {
    const dep = typeof dependency === "string" ? dependency : dependency?.id ?? dependency?.["@id"];
    if (!dep) continue;
    const depId = "gaia-x:" + dep;
    nodes.push({ node_id: depId, node_type: "service", name: dep, external_refs: [{ system: "gaia-x", ref: dep, relation: "dependsOn" }] });
    edges.push({ edge_id: "gaia-x-dependency:" + index + ":" + encodeURIComponent(id), source: nodeId, relation: "depends_on", target: depId, evidence_refs: [evidenceId] });
  }

  const policyRefs = Array.isArray(record.policy) ? record.policy : [];
  for (const [index, policy] of policyRefs.entries()) {
    const ref = typeof policy === "string" ? policy : policy?.id ?? policy?.["@id"];
    if (!ref) continue;
    const policyId = "policy:gaia-x:" + ref;
    nodes.push({ node_id: policyId, node_type: "policy", name: ref, external_refs: [{ system: "gaia-x", ref, relation: "policy" }] });
    edges.push({ edge_id: "gaia-x-policy:" + index + ":" + encodeURIComponent(id), source: nodeId, relation: "constrained_by", target: policyId, evidence_refs: [evidenceId] });
  }

  return {
    agl_version: "0.1.0",
    nodes,
    edges,
    evidence: [{
      evidence_id: evidenceId,
      producer: options.producer ?? "gaia-x-mapping",
      subject: nodeId,
      type: "gaia-x.self-description",
      source: "Gaia-X",
      integrity_status: options.integrityStatus ?? "unknown",
      external_refs: [{ system: "gaia-x", ref: id, relation: "self-description" }]
    }]
  };
}
