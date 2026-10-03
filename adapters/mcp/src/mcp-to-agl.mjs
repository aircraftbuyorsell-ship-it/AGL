function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function statusFromResult(result, error) {
  if (error) return "failed";
  if (result?.isError === true) return "failed";
  return "completed";
}

/**
 * Map an MCP tool invocation/result record into an AGL Execution Graph fragment.
 *
 * Expected input is a normalized MCP call record, not a transport-specific wire
 * packet:
 * {
 *   server: { name, version?, uri? },
 *   tool: { name },
 *   call: { id?, startedAt?, arguments? },
 *   result?: { isError?, content?, structuredContent? },
 *   error?: { code?, message? },
 *   client?: { name?, version?, agentId? },
 *   requestMeta?: object
 * }
 */
export function mcpToolCallToAgl(record, options = {}) {
  if (!record || typeof record !== "object") {
    throw new Error("MCP tool call record must be an object");
  }

  const serverName = firstDefined(record.server?.name, options.serverName);
  const toolName = firstDefined(record.tool?.name, options.toolName);
  if (!serverName) throw new Error("MCP tool call is missing server.name");
  if (!toolName) throw new Error("MCP tool call is missing tool.name");

  const callId = firstDefined(record.call?.id, options.callId, "anonymous");
  const executionId = firstDefined(
    options.executionId,
    `mcp:call:${serverName}:${toolName}:${callId}`
  );
  const startedAt = firstDefined(
    record.call?.startedAt,
    options.startedAt,
    new Date().toISOString()
  );
  const endedAt = firstDefined(record.call?.endedAt, options.endedAt, startedAt);
  const evidenceId = `mcp:evidence:${serverName}:${toolName}:${callId}`;
  const serverId = `mcp-server:${serverName}`;
  const toolId = `mcp-tool:${serverName}:${toolName}`;

  const nodes = [
    {
      node_id: executionId,
      node_type: "execution",
      name: executionId,
      external_refs: [
        { system: "mcp", ref: `call:${callId}`, relation: "invocation" }
      ]
    },
    {
      node_id: serverId,
      node_type: "tool",
      name: serverName,
      ...(record.server?.version ? { version: record.server.version } : {}),
      external_refs: [
        { system: "mcp", ref: `server:${serverName}`, relation: "server" }
      ]
    },
    {
      node_id: toolId,
      node_type: "tool",
      name: toolName,
      external_refs: [
        { system: "mcp", ref: `tool:${serverName}:${toolName}`, relation: "tool" }
      ]
    }
  ];

  const edges = [
    {
      edge_id: `execution-server:${callId}`,
      source: executionId,
      relation: "runs_on",
      target: serverId,
      observed_at: startedAt,
      evidence_refs: [evidenceId]
    },
    {
      edge_id: `execution-tool:${callId}`,
      source: executionId,
      relation: "invokes",
      target: toolId,
      observed_at: startedAt,
      evidence_refs: [evidenceId]
    }
  ];

  if (record.client?.agentId) {
    const agentId = `agent:${record.client.agentId}`;
    nodes.push({
      node_id: agentId,
      node_type: "agent",
      name: record.client.agentId,
      external_refs: [
        { system: "mcp", ref: `client-agent:${record.client.agentId}`, relation: "client" }
      ]
    });
    edges.push({
      edge_id: `execution-agent:${callId}`,
      source: executionId,
      relation: "executed_by",
      target: agentId,
      observed_at: startedAt,
      evidence_refs: [evidenceId]
    });
  }

  const status = statusFromResult(record.result, record.error);
  const evidence = {
    evidence_id: evidenceId,
    producer: serverId,
    created_at: endedAt,
    subject: executionId,
    type: "mcp.tool_call",
    source: "Model Context Protocol",
    schema_ref: firstDefined(
      options.schemaRef,
      "https://modelcontextprotocol.io/specification/2026-07-28"
    ),
    integrity_status: firstDefined(record.integrityStatus, "unknown"),
    external_refs: [
      { system: "mcp", ref: `server:${serverName}`, relation: "server" },
      { system: "mcp", ref: `tool:${serverName}:${toolName}`, relation: "tool" },
      { system: "mcp", ref: `call:${callId}`, relation: "invocation" }
    ]
  };

  if (record.error) {
    evidence.attributes = {
      error_code: record.error.code,
      error_message: record.error.message
    };
  }

  return {
    agl_version: "0.1.0",
    execution_id: executionId,
    service: {
      service_id: firstDefined(options.serviceId, serverId),
      name: serverName
    },
    execution: {
      started_at: startedAt,
      ended_at: endedAt,
      status,
      graph_root: executionId,
      evidence_refs: [evidenceId]
    },
    nodes,
    edges,
    evidence: [evidence]
  };
}
