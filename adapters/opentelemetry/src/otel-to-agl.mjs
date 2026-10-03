function attrsToObject(attributes = []) {
  const out = {};
  for (const item of attributes) {
    if (!item?.key) continue;
    const value = item.value ?? {};
    const key = Object.keys(value)[0];
    if (key !== undefined) out[item.key] = value[key];
  }
  return out;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function isoFromNano(value) {
  if (value === undefined || value === null) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  return new Date(n / 1e6).toISOString();
}

function spanStatus(span) {
  return ({ OK: "completed", ERROR: "failed", UNSET: "completed" })[span?.status?.code] ?? "completed";
}

export function otlpTraceToAgl(payload, options = {}) {
  const resourceSpans = payload?.resourceSpans ?? [];
  if (!Array.isArray(resourceSpans) || resourceSpans.length === 0) {
    throw new Error("OTLP payload contains no resourceSpans");
  }

  const spans = [];
  for (const resourceSpan of resourceSpans) {
    const resourceAttrs = attrsToObject(resourceSpan?.resource?.attributes);
    for (const scope of resourceSpan?.scopeSpans ?? []) {
      for (const span of scope?.spans ?? []) {
        spans.push({ ...span, _resourceAttrs: resourceAttrs });
      }
    }
  }
  if (spans.length === 0) throw new Error("OTLP payload contains no spans");

  const root = spans.find((span) => !span.parentSpanId) ?? spans[0];
  const rootAttrs = attrsToObject(root.attributes);
  const resourceAttrs = root._resourceAttrs ?? {};
  const traceId = firstDefined(root.traceId, options.traceId, "unknown");
  const executionId = firstDefined(
    options.executionId,
    rootAttrs["agl.execution_id"],
    resourceAttrs["agl.execution_id"],
    traceId
  );
  const serviceName = firstDefined(
    rootAttrs["service.name"],
    resourceAttrs["service.name"],
    options.serviceId,
    "unknown-service"
  );
  const serviceVersion = firstDefined(rootAttrs["service.version"], resourceAttrs["service.version"]);
  const agentId = firstDefined(rootAttrs["agl.agent_id"], resourceAttrs["agl.agent_id"]);

  const startTimes = spans.map((s) => isoFromNano(s.startTimeUnixNano)).filter(Boolean).sort();
  const endTimes = spans.map((s) => isoFromNano(s.endTimeUnixNano)).filter(Boolean).sort();
  const started = startTimes[0] ?? new Date().toISOString();
  const ended = endTimes.at(-1);

  const evidence = [];
  const nodes = [
    {
      node_id: executionId,
      node_type: "execution",
      name: executionId,
      external_refs: [{ system: "opentelemetry", ref: `trace:${traceId}`, relation: "observed_by" }]
    },
    {
      node_id: `service:${serviceName}`,
      node_type: "service",
      name: serviceName,
      ...(serviceVersion ? { version: serviceVersion } : {}),
      external_refs: [{ system: "opentelemetry", ref: `service:${serviceName}`, relation: "observed_by" }]
    }
  ];

  if (agentId) {
    nodes.push({
      node_id: `agent:${agentId}`,
      node_type: "agent",
      name: agentId,
      external_refs: [{ system: "opentelemetry", ref: `agent:${agentId}`, relation: "observed_by" }]
    });
  }

  const edges = [{
    edge_id: `execution-service:${executionId}`,
    source: executionId,
    relation: "runs_on",
    target: `service:${serviceName}`,
    observed_at: started
  }];

  if (agentId) {
    edges.push({
      edge_id: `execution-agent:${executionId}`,
      source: executionId,
      relation: "executed_by",
      target: `agent:${agentId}`,
      observed_at: started
    });
  }

  for (const span of spans) {
    const spanId = span.spanId;
    if (!spanId) continue;
    const attrs = attrsToObject(span.attributes);
    const evidenceId = `otel-span:${traceId}:${spanId}`;
    const createdAt = isoFromNano(span.endTimeUnixNano) ?? isoFromNano(span.startTimeUnixNano) ?? started;

    const externalRefs = [
      { system: "opentelemetry", ref: `trace:${traceId}`, relation: "trace" },
      { system: "opentelemetry", ref: `span:${spanId}`, relation: "span" }
    ];

    const inputTokens = Number(attrs["gen_ai.usage.input_tokens"]);
    const outputTokens = Number(attrs["gen_ai.usage.output_tokens"]);
    if (Number.isFinite(inputTokens) || Number.isFinite(outputTokens)) {
      externalRefs.push({
        system: "opentelemetry",
        ref: `span:${spanId}:gen_ai.usage`,
        relation: "measurement_source"
      });
    }

    evidence.push({
      evidence_id: evidenceId,
      producer: `service:${serviceName}`,
      created_at: createdAt,
      subject: executionId,
      type: "opentelemetry.span",
      source: "OpenTelemetry OTLP",
      schema_ref: "https://opentelemetry.io/docs/specs/otlp/",
      integrity_status: "unknown",
      external_refs: externalRefs
    });
  }

  return {
    execution_id: executionId,
    execution: {
      started_at: started,
      ...(ended ? { ended_at: ended } : {}),
      status: firstDefined(options.status, rootAttrs["agl.status"], spanStatus(root)),
      graph_root: executionId,
      evidence_refs: evidence.map((item) => item.evidence_id)
    },
    nodes,
    edges,
    evidence
  };
}
