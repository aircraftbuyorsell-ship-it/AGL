function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function rules(policy, type) {
  const value = policy?.[type];
  return Array.isArray(value) ? value : value ? [value] : [];
}

export function odrlToAgl(policy, options = {}) {
  if (!policy || typeof policy !== "object") throw new Error("ODRL policy must be an object");
  const policyId = firstDefined(policy.uid, policy["@id"], options.policyId);
  if (!policyId) throw new Error("ODRL policy requires uid or @id");

  const nodes = [{
    node_id: `policy:${policyId}`,
    node_type: "policy",
    name: policyId,
    external_refs: [{ system: "odrl", ref: policyId, relation: "policy" }]
  }];
  const edges = [];
  const evidence = [];
  const addRules = (type, relation) => {
    for (const [index, rule] of rules(policy, type).entries()) {
      const action = firstDefined(rule.action?.["@id"], rule.action?.name, rule.action);
      if (!action) continue;
      const ruleId = firstDefined(rule.uid, rule["@id"], `${policyId}:${type}:${index}`);
      const ruleNode = `odrl-rule:${ruleId}`;
      const evidenceId = `odrl:evidence:${ruleId}`;
      nodes.push({
        node_id: ruleNode,
        node_type: "policy",
        name: ruleId,
        attributes: {
          rule_type: type,
          action
        },
        external_refs: [{ system: "odrl", ref: ruleId, relation: type }]
      });
      edges.push({
        edge_id: `policy-rule:${ruleId}`,
        source: `policy:${policyId}`,
        relation: "contains",
        target: ruleNode,
        evidence_refs: [evidenceId]
      });
      evidence.push({
        evidence_id: evidenceId,
        producer: `policy:${policyId}`,
        subject: ruleNode,
        type: `odrl.${type}`,
        source: "ODRL",
        integrity_status: firstDefined(options.integrityStatus, "unknown"),
        external_refs: [{ system: "odrl", ref: ruleId, relation: type }]
      });
    }
  };
  addRules("permission", "permission");
  addRules("prohibition", "prohibition");
  addRules("duty", "duty");

  return {
    agl_version: "0.1.0",
    policy: { policy_id: policyId },
    nodes,
    edges,
    evidence
  };
}
