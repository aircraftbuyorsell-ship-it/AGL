function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}
function eventStatus(eventType) {
  return ({ START: "running", RUNNING: "running", COMPLETE: "completed", FAIL: "failed", ABORT: "aborted", OTHER: "running" })[eventType] ?? "running";
}
function datasetId(dataset) { return "dataset:" + (dataset?.namespace ?? "unknown") + ":" + (dataset?.name ?? "unknown"); }
export function openLineageEventToAgl(event, options = {}) {
  if (!event || typeof event !== "object") throw new Error("OpenLineage event must be an object");
  if (!event.run?.runId) throw new Error("OpenLineage event is missing run.runId");
  if (!event.job?.name) throw new Error("OpenLineage event is missing job.name");
  if (!event.eventTime) throw new Error("OpenLineage event is missing eventTime");
  const runId = event.run.runId;
  const namespace = firstDefined(event.job.namespace, "unknown");
  const jobId = "job:" + namespace + ":" + event.job.name;
  const executionId = firstDefined(options.executionId, "openlineage:run:" + runId);
  const serviceId = firstDefined(options.serviceId, "service:" + namespace);
  const evidenceId = "openlineage:event:" + runId + ":" + (event.eventType ?? "OTHER") + ":" + event.eventTime;
  const schemaRef = firstDefined(event.schemaURL, "https://openlineage.io/spec/1-0-2/OpenLineage.json");
  const producer = firstDefined(event.producer, "unknown-producer");
  const nodes = [
    { node_id: executionId, node_type: "execution", name: executionId, external_refs: [{ system: "openlineage", ref: "run:" + runId, relation: "run" }] },
    { node_id: jobId, node_type: "workflow", name: event.job.name, external_refs: [{ system: "openlineage", ref: "job:" + namespace + ":" + event.job.name, relation: "job" }] },
    { node_id: serviceId, node_type: "service", name: namespace, external_refs: [{ system: "openlineage", ref: "namespace:" + namespace, relation: "namespace" }] }
  ];
  const edges = [
    { edge_id: "execution-job:" + runId, source: executionId, relation: "executed_by", target: jobId, observed_at: event.eventTime, evidence_refs: [evidenceId] },
    { edge_id: "execution-service:" + runId, source: executionId, relation: "runs_on", target: serviceId, observed_at: event.eventTime, evidence_refs: [evidenceId] }
  ];
  for (const dataset of event.inputs ?? []) {
    const id = datasetId(dataset);
    nodes.push({ node_id: id, node_type: "data", name: dataset.name ?? "unknown", external_refs: [{ system: "openlineage", ref: id, relation: "dataset" }] });
    edges.push({ edge_id: "input:" + runId + ":" + id, source: id, relation: "consumes", target: executionId, observed_at: event.eventTime, evidence_refs: [evidenceId] });
  }
  for (const dataset of event.outputs ?? []) {
    const id = datasetId(dataset);
    nodes.push({ node_id: id, node_type: "data", name: dataset.name ?? "unknown", external_refs: [{ system: "openlineage", ref: id, relation: "dataset" }] });
    edges.push({ edge_id: "output:" + runId + ":" + id, source: executionId, relation: "produces", target: id, observed_at: event.eventTime, evidence_refs: [evidenceId] });
  }
  return {
    agl_version: "0.1.0", execution_id: executionId, service: { service_id: serviceId, name: namespace },
    execution: { started_at: event.eventTime, status: eventStatus(event.eventType), graph_root: executionId, evidence_refs: [evidenceId] },
    nodes, edges,
    evidence: [{ evidence_id: evidenceId, producer, created_at: event.eventTime, subject: executionId, type: "openlineage.run_event", source: "OpenLineage", schema_ref: schemaRef, integrity_status: "unknown", external_refs: [{ system: "openlineage", ref: "run:" + runId, relation: "run" }, { system: "openlineage", ref: "job:" + namespace + ":" + event.job.name, relation: "job" }] }]
  };
}
