function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function taskStatus(status) {
  return {
    submitted: "pending",
    working: "running",
    "input-required": "escalated",
    "auth-required": "escalated",
    completed: "completed",
    canceled: "aborted",
    rejected: "denied",
    failed: "failed",
    unknown: "running"
  }[status] ?? "running";
}

/**
 * Map an A2A v1.0 task/message interaction into an AGL Execution Graph fragment.
 *
 * This is an evidence adapter, not an A2A protocol validator.
 */
export function a2aTaskToAgl(record, options = {}) {
  if (!record || typeof record !== "object") throw new Error("A2A record must be an object");

  const agentName = firstDefined(record.agent?.name, record.agentCard?.name, options.agentName);
  const taskId = firstDefined(record.task?.id, record.taskId, options.taskId);
  if (!agentName) throw new Error("A2A record is missing agent identity");
  if (!taskId) throw new Error("A2A record is missing task.id");

  const executionId = firstDefined(options.executionId, `a2a:task:${taskId}`);
  const contextId = firstDefined(record.task?.contextId, record.contextId);
  const eventTime = firstDefined(
    record.task?.status?.timestamp,
    record.timestamp,
    options.timestamp,
    new Date().toISOString()
  );
  const statusName = firstDefined(record.task?.status?.state, "unknown");
  const evidenceId = `a2a:evidence:${taskId}:${eventTime}`;
  const remoteAgentId = `agent:a2a:${agentName}`;

  const nodes = [
    {
      node_id: executionId,
      node_type: "execution",
      name: executionId,
      external_refs: [
        { system: "a2a", ref: `task:${taskId}`, relation: "task" }
      ]
    },
    {
      node_id: remoteAgentId,
      node_type: "agent",
      name: agentName,
      external_refs: [
        { system: "a2a", ref: `agent:${agentName}`, relation: "agent_card" }
      ]
    }
  ];

  const edges = [
    {
      edge_id: `execution-agent:${taskId}`,
      source: executionId,
      relation: "executed_by",
      target: remoteAgentId,
      observed_at: eventTime,
      evidence_refs: [evidenceId]
    }
  ];

  if (contextId) {
    nodes[0].attributes = { context_id: contextId };
  }

  if (record.agentCard?.version) {
    nodes[1].version = record.agentCard.version;
  }

  if (record.clientAgentId) {
    const clientId = `agent:${record.clientAgentId}`;
    nodes.push({
      node_id: clientId,
      node_type: "agent",
      name: record.clientAgentId,
      external_refs: [
        { system: "a2a", ref: `client-agent:${record.clientAgentId}`, relation: "client" }
      ]
    });
    edges.push({
      edge_id: `client-agent:${taskId}`,
      source: executionId,
      relation: "delegated_by",
      target: clientId,
      observed_at: eventTime,
      evidence_refs: [evidenceId]
    });
  }

  const evidence = {
    evidence_id: evidenceId,
    producer: remoteAgentId,
    created_at: eventTime,
    subject: executionId,
    type: "a2a.task",
    source: "Agent2Agent Protocol",
    schema_ref: firstDefined(
      options.schemaRef,
      "https://a2a-protocol.org/v1.0.0/specification/"
    ),
    integrity_status: firstDefined(record.integrityStatus, "unknown"),
    external_refs: [
      { system: "a2a", ref: `task:${taskId}`, relation: "task" },
      ...(contextId ? [{ system: "a2a", ref: `context:${contextId}`, relation: "context" }] : [])
    ]
  };

  return {
    agl_version: "0.1.0",
    execution_id: executionId,
    service: {
      service_id: firstDefined(options.serviceId, remoteAgentId),
      name: agentName
    },
    execution: {
      started_at: firstDefined(record.task?.status?.timestamp, eventTime),
      status: taskStatus(statusName),
      graph_root: executionId,
      evidence_refs: [evidenceId]
    },
    nodes,
    edges,
    evidence: [evidence]
  };
}
