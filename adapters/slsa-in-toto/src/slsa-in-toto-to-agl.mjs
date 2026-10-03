function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

export function slsaInTotoToAgl(attestation, options = {}) {
  if (!attestation || typeof attestation !== "object") throw new Error("SLSA/in-toto attestation must be an object");
  const predicateType = firstDefined(attestation.predicateType, attestation.predicate_type, options.predicateType, "unknown");
  const statement = attestation.statement ?? attestation;
  const subjects = Array.isArray(statement.subject) ? statement.subject : [];
  const builder = firstDefined(attestation.builder?.id, attestation.predicate?.builder?.id);
  const executionId = firstDefined(options.executionId, attestation.executionId, "supply-chain:" + predicateType);
  const evidenceId = "slsa:evidence:" + encodeURIComponent(executionId);
  const nodes = [{ node_id: executionId, node_type: "execution", name: executionId, external_refs: [{ system: "slsa-in-toto", ref: predicateType, relation: "predicate_type" }] }];
  const edges = [];
  if (builder) {
    const builderId = "builder:" + builder;
    nodes.push({ node_id: builderId, node_type: "actor", name: builder, external_refs: [{ system: "slsa-in-toto", ref: builder, relation: "builder" }] });
    edges.push({ edge_id: "builder-exec:" + encodeURIComponent(executionId), source: executionId, relation: "executed_by", target: builderId, evidence_refs: [evidenceId] });
  }
  for (const [index, subject] of subjects.entries()) {
    if (!subject?.name) continue;
    const digest = subject.digest && typeof subject.digest === "object" ? Object.entries(subject.digest).map(([algorithm, value]) => algorithm + ":" + value).join(",") : undefined;
    const artifactId = "artifact:" + subject.name;
    nodes.push({ node_id: artifactId, node_type: "code_artifact", name: subject.name, external_refs: digest ? [{ system: "slsa-in-toto", ref: digest, relation: "subject_digest" }] : [], attributes: digest ? { digest } : {} });
    edges.push({ edge_id: "build-output:" + index + ":" + encodeURIComponent(executionId), source: executionId, relation: "produces", target: artifactId, evidence_refs: [evidenceId] });
  }
  const evidence = [{ evidence_id: evidenceId, producer: builder ?? "slsa-in-toto", created_at: firstDefined(attestation.createdAt, attestation.created_at, options.observedAt, new Date().toISOString()), subject: executionId, type: predicateType, source: "SLSA/in-toto", integrity_status: firstDefined(attestation.integrityStatus, "unknown"), external_refs: attestation.uri ? [{ system: "slsa-in-toto", ref: attestation.uri, relation: "attestation" }] : [] }];
  return { agl_version: "0.1.0", execution_id: executionId, nodes, edges, evidence };
}