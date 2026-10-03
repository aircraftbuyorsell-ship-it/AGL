function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

/**
 * Map a normalized SPIFFE workload identity observation into an AGL
 * Execution Graph fragment.
 *
 * This adapter records identity evidence; it does not implement SVID
 * cryptographic validation. Validation is expected to occur in the
 * SPIFFE/SPIRE trust layer before this record is produced.
 */
export function spiffeIdentityToAgl(record, options = {}) {
  if (!record || typeof record !== "object") {
    throw new Error("SPIFFE identity record must be an object");
  }

  const spiffeId = firstDefined(record.spiffeId, record.id);
  if (!spiffeId || !spiffeId.startsWith("spiffe://")) {
    throw new Error("SPIFFE record requires a valid spiffe:// identity");
  }

  const executionId = firstDefined(
    options.executionId,
    record.executionId,
    `spiffe:identity:${spiffeId}`
  );
  const serviceName = firstDefined(record.serviceName, options.serviceName);
  const agentId = firstDefined(record.agentId, options.agentId);
  const observedAt = firstDefined(record.observedAt, options.observedAt, new Date().toISOString());
  const evidenceId = `spiffe:evidence:${encodeURIComponent(spiffeId)}`;
  const identityId = `spiffe-id:${spiffeId}`;

  const nodes = [
    {
      node_id: identityId,
      node_type: "actor",
      name: spiffeId,
      external_refs: [
        { system: "spiffe", ref: spiffeId, relation: "spiffe_id" }
      ],
      attributes: {
        identity_type: "SPIFFE_ID",
        trust_domain: spiffeId.split("/")[2]
      }
    },
    {
      node_id: executionId,
      node_type: "execution",
      name: executionId,
      external_refs: [
        { system: "spiffe", ref: spiffeId, relation: "identity_observation" }
      ]
    }
  ];

  const edges = [
    {
      edge_id: `execution-identity:${encodeURIComponent(spiffeId)}`,
      source: executionId,
      relation: "executed_by",
      target: identityId,
      observed_at: observedAt,
      evidence_refs: [evidenceId]
    }
  ];

  if (serviceName) {
    const serviceId = `service:${serviceName}`;
    nodes.push({
      node_id: serviceId,
      node_type: "service",
      name: serviceName
    });
    edges.push({
      edge_id: `identity-service:${encodeURIComponent(spiffeId)}`,
      source: identityId,
      relation: "deployed_as",
      target: serviceId,
      observed_at: observedAt,
      evidence_refs: [evidenceId]
    });
  }

  if (agentId) {
    const agentNodeId = `agent:${agentId}`;
    nodes.push({
      node_id: agentNodeId,
      node_type: "agent",
      name: agentId
    });
    edges.push({
      edge_id: `execution-agent:${encodeURIComponent(spiffeId)}`,
      source: executionId,
      relation: "executed_by",
      target: agentNodeId,
      observed_at: observedAt,
      evidence_refs: [evidenceId]
    });
  }

  const evidence = {
    evidence_id: evidenceId,
    producer: identityId,
    created_at: observedAt,
    subject: executionId,
    type: firstDefined(record.svidType, "spiffe.svid"),
    source: "SPIFFE",
    schema_ref: firstDefined(options.schemaRef, "https://spiffe.io/docs/latest/spiffe-specs/"),
    integrity_status: firstDefined(record.validationStatus, "unknown"),
    external_refs: [
      { system: "spiffe", ref: spiffeId, relation: "identity" },
      ...(record.svidRef ? [{ system: "spiffe", ref: record.svidRef, relation: "svid" }] : [])
    ]
  };

  return {
    agl_version: "0.1.0",
    execution_id: executionId,
    service: {
      service_id: firstDefined(options.serviceId, serviceName, identityId),
      ...(serviceName ? { name: serviceName } : {})
    },
    execution: {
      started_at: observedAt,
      status: "authorized",
      initiator: identityId,
      root_actor: identityId,
      graph_root: executionId,
      evidence_refs: [evidenceId]
    },
    nodes,
    edges,
    evidence: [evidence]
  };
}
