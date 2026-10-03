import assert from "node:assert/strict";
import fs from "node:fs";

const graph = JSON.parse(
  fs.readFileSync(new URL("../examples/agl-execution-graph.example.json", import.meta.url), "utf8")
);

const nodes = new Map(graph.nodes.map((node) => [node.node_id, node]));
const edges = graph.edges;

// Basic graph integrity checks. JSON Schema validates shape; these checks validate references.
assert.equal(nodes.size, graph.nodes.length, "node IDs must be unique");
const edgeIds = new Set();
for (const edge of edges) {
  assert.ok(!edgeIds.has(edge.edge_id), `edge IDs must be unique: ${edge.edge_id}`);
  edgeIds.add(edge.edge_id);
  assert.ok(nodes.has(edge.source), `edge source missing: ${edge.source}`);
  assert.ok(nodes.has(edge.target), `edge target missing: ${edge.target}`);
}

for (const evidence of graph.evidence) {
  assert.ok(nodes.has(evidence.subject), `evidence subject missing: ${evidence.subject}`);
  assert.ok(nodes.has(evidence.producer), `evidence producer missing: ${evidence.producer}`);
}

const outgoing = new Map();
const incoming = new Map();

for (const edge of edges) {
  if (!outgoing.has(edge.source)) outgoing.set(edge.source, []);
  if (!incoming.has(edge.target)) incoming.set(edge.target, []);
  outgoing.get(edge.source).push(edge);
  incoming.get(edge.target).push(edge);
}

// Execution graphs contain two different traversal semantics:
// 1. causal/provenance edges point backwards from an output to its producers;
// 2. composition/dependency edges expand from a container/actor into the
//    workflow, task, skill and tool components that made the execution possible.
const expansionRelations = new Set([
  "contains",
  "composes",
  "uses",
  "invokes",
  "coordinates",
  "parent_of",
  "child_of",
  "executed_by"
]);

function reconstructExecution(startNodeId) {
  const result = [];
  const visited = new Set();

  function walk(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodes.get(nodeId);
    assert.ok(node, `missing node: ${nodeId}`);
    result.push(node);

    // Causal/provenance reconstruction: follow incoming edges.
    for (const edge of incoming.get(nodeId) ?? []) {
      walk(edge.source);
    }

    // Execution composition reconstruction: once a container/dependency node
    // is reached, expand its declared components.
    for (const edge of outgoing.get(nodeId) ?? []) {
      if (expansionRelations.has(edge.relation)) {
        walk(edge.target);
      }
    }
  }

  walk(startNodeId);
  return result;
}

const outputId = edges.find(
  (edge) =>
    edge.source === graph.execution.graph_root &&
    edge.relation === "produces"
)?.target;

assert.ok(outputId, "execution graph must expose a produced output");

const executionRoot = nodes.get(graph.execution.graph_root);
assert.ok(executionRoot, "execution graph root must resolve to a node");
assert.equal(executionRoot.node_type, "execution", "graph_root must be an execution node");

const lineage = reconstructExecution(outputId);
const lineageIds = new Set(lineage.map((node) => node.node_id));

for (const required of [
  "output-verification-result",
  "node-execution-001",
  "agent-abos-verification",
  "workflow-registry-check",
  "task-registry-lookup",
  "skill-aircraft-lookup",
  "tool-faa-registry"
]) {
  assert.ok(lineageIds.has(required), `reconstructed execution missing expected node: ${required}`);
}

// Governance context is explicit execution context and must survive reconstruction.
assert.ok(
  nodes.has(graph.execution.authorization_decision),
  "execution authorization decision must resolve to a graph node"
);
assert.ok(
  nodes.has(graph.execution.root_policy),
  "execution root policy must resolve to a graph node"
);

assert.ok(
  edges.some(
    (edge) =>
      edge.source === graph.execution.graph_root &&
      edge.relation === "authorized_by" &&
      edge.target === graph.execution.authorization_decision
  ),
  "execution must be authorized by its recorded authorization decision"
);

assert.ok(
  edges.some(
    (edge) =>
      edge.source === graph.execution.authorization_decision &&
      edge.relation === "constrained_by" &&
      edge.target === graph.execution.root_policy
  ),
  "authorization decision must be constrained by the governing policy"
);

// Runtime context must remain reconstructable.
for (const contextual of [
  "model-verification-llm",
  "code-verification-adapter",
  "data-aircraft-listing",
  "environment-abos-production"
]) {
  assert.ok(
    lineageIds.has(contextual) ||
      edges.some(
        (edge) =>
          edge.source === graph.execution.graph_root &&
          edge.target === contextual
      ) ||
      edges.some(
        (edge) =>
          edge.source === "agent-abos-verification" &&
          edge.target === contextual
      ),
    `execution context missing: ${contextual}`
  );
}

assert.ok(
  graph.evidence.some((evidence) => evidence.subject === graph.execution.graph_root),
  "execution evidence must reference the execution"
);

console.log("AGL reconstruction test: PASS");
console.log("reconstructed nodes:", lineage.length);
console.log("output:", outputId);
console.log("execution:", graph.execution.graph_root);
