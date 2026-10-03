function id(prefix, value) { return prefix + ":" + String(value); }
function entries(value) { return Object.entries(value ?? {}); }
export function provJsonToAgl(prov, options = {}) {
  if (!prov || typeof prov !== "object") throw new Error("PROV document must be an object");
  const nodes = [];
  const edges = [];
  const evidence = [];
  const executionId = options.executionId ?? "prov:document";
  const addNode = (node) => nodes.push(node);
  for (const [rawId, value] of entries(prov.entity)) {
    const nodeId = id("entity", rawId);
    addNode({ node_id: nodeId, node_type: "data", name: rawId, external_refs: [{ system: "w3c-prov", ref: rawId, relation: "entity" }], attributes: value ?? {} });
  }
  for (const [rawId, value] of entries(prov.activity)) {
    const nodeId = id("activity", rawId);
    addNode({ node_id: nodeId, node_type: "execution", name: rawId, external_refs: [{ system: "w3c-prov", ref: rawId, relation: "activity" }], attributes: value ?? {} });
  }
  for (const [rawId, value] of entries(prov.agent)) {
    const nodeId = id("agent", rawId);
    addNode({ node_id: nodeId, node_type: "actor", name: rawId, external_refs: [{ system: "w3c-prov", ref: rawId, relation: "agent" }], attributes: value ?? {} });
  }
  addNode({ node_id: executionId, node_type: "execution", name: executionId, external_refs: [{ system: "w3c-prov", ref: "prov-document", relation: "provenance" }] });
  const relationMap = [
    ["used", "consumes", "activity", "entity"],
    ["wasGeneratedBy", "produces", "entity", "activity"],
    ["wasAssociatedWith", "executed_by", "activity", "agent"],
    ["wasDerivedFrom", "derived_from", "entity", "entity"],
    ["wasAttributedTo", "authored_by", "entity", "agent"]
  ];
  for (const [provKey, relation, sourceType, targetType] of relationMap) {
    for (const [rawId, value] of entries(prov[provKey])) {
      const attrs = value ?? {};
      const sourceRaw = attrs.activity ?? attrs.generatedEntity ?? attrs.entity ?? attrs.informed ?? attrs.usedEntity ?? attrs.effect ?? attrs.target;
      const targetRaw = attrs.entity ?? attrs.agent ?? attrs.usedEntity ?? attrs.activity ?? attrs.influence ?? attrs.source;
      if (!sourceRaw || !targetRaw) continue;
      const source = id(sourceType, String(sourceRaw).replace(/^.*:/, ""));
      const target = id(targetType, String(targetRaw).replace(/^.*:/, ""));
      const evidenceId = "prov:evidence:" + rawId;
      evidence.push({ evidence_id: evidenceId, producer: executionId, created_at: options.createdAt ?? new Date(0).toISOString(), subject: source, type: "w3c.prov.relation", source: "W3C PROV", integrity_status: "unknown", external_refs: [{ system: "w3c-prov", ref: rawId, relation: provKey }] });
      edges.push({ edge_id: "prov:" + rawId, source, relation, target, evidence_refs: [evidenceId] });
    }
  }
  return { agl_version: "0.1.0", execution_id: executionId, service: { service_id: options.serviceId ?? "service:provenance" }, execution: { started_at: options.createdAt ?? new Date(0).toISOString(), status: "completed", graph_root: executionId, evidence_refs: evidence.map((e) => e.evidence_id) }, nodes, edges, evidence };
}
