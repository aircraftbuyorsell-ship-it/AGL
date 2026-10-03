import assert from "node:assert/strict";
import fs from "node:fs";

const graph = JSON.parse(
  fs.readFileSync(new URL("../examples/agl-execution-graph.example.json", import.meta.url), "utf8")
);

const nodes = new Map(graph.nodes.map((node) => [node.node_id, node]));

function reconstructBackwards(startNodeId) {
  const result = [];
  const visited = new Set();

  function walk(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodes.get(nodeId);
    assert.ok(node, `missing node: ${nodeId}`);
    result.push(node);

    for (const edge of graph.edges.filter((candidate) => candidate.target === nodeId)) {
      walk(edge.source);
    }
  }

  walk(startNodeId);
  return result;
}

const outputId = graph.edges.find(
  (edge) =>
    edge.source === graph.execution.graph_root &&
    edge.relation === "produces"
)?.target;

assert.ok(outputId, "execution graph must expose a produced output");

const lineage = reconstructBackwards(outputId);
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
  assert.ok(lineageIds.has(required), `lineage missing expected node: ${required}`);
}

const governanceContext = new Set([
  graph.execution.authorization_decision,
  graph.execution.root_policy
]);

assert.ok(
  governanceContext.has("authz-demo-001"),
  "execution must retain its authorization decision"
);
assert.ok(
  governanceContext.has("policy-aircraft-verification-v1"),
  "execution must retain its governing policy"
);

for (const contextual of [
  "model-verification-llm",
  "code-verification-adapter",
  "data-aircraft-listing",
  "environment-abos-production"
]) {
  assert.ok(
    graph.edges.some(
      (edge) =>
        edge.source === graph.execution.graph_root &&
        edge.target === contextual
    ) ||
    graph.edges.some(
      (edge) =>
        edge.source === "agent-abos-verification" &&
        edge.target === contextual
    ),
    `execution context missing: ${contextual}`
  );
}

assert.ok(
  graph.evidence.some((evidence) => evidence.subject === "node-execution-001"),
  "execution evidence must reference the execution"
);

console.log("AGL reconstruction test: PASS");
console.log("lineage nodes:", lineage.length);
console.log("output:", outputId);
console.log("execution:", graph.execution.graph_root);
