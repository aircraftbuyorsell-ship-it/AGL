import assert from "node:assert/strict";
import fs from "node:fs";

const graph = JSON.parse(
  fs.readFileSync(new URL("../examples/agl-execution-graph.example.json", import.meta.url), "utf8")
);

const nodes = new Map(graph.nodes.map((node) => [node.node_id, node]));
const outgoing = new Map();

for (const edge of graph.edges) {
  if (!outgoing.has(edge.source)) outgoing.set(edge.source, []);
  outgoing.get(edge.source).push(edge);
}

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

const outputId = graph.execution.graph_root
  ? graph.edges.find((edge) =>
      edge.source === graph.execution.graph_root &&
      edge.relation === "produces"
    )?.target
  : undefined;

assert.ok(outputId, "execution graph must expose a produced output");

const reconstructed = reconstructBackwards(outputId);
const reconstructedIds = new Set(reconstructed.map((node) => node.node_id));

for (const required of [
  "output-verification-result",
  "node-execution-001",
  "agent-abos-verification",
  "workflow-registry-check",
  "task-registry-lookup",
  "skill-aircraft-lookup",
  "tool-faa-registry",
  "model-verification-llm",
  "code-verification-adapter",
  "data-aircraft-listing",
  "environment-abos-production",
  "authz-demo-001",
  "policy-aircraft-verification-v1"
]) {
  assert.ok(
    reconstructedIds.has(required),
    `reconstruction missing expected node: ${required}`
  );
}

assert.ok(
  graph.evidence.some((evidence) => evidence.subject === "node-execution-001"),
  "execution evidence must reference the execution"
);

assert.equal(
  graph.execution.authorization_decision,
  "authz-demo-001",
  "execution must retain its authorization decision"
);

console.log("AGL reconstruction test: PASS");
console.log("reconstructed nodes:", reconstructed.length);
console.log("output:", outputId);
console.log("execution:", graph.execution.graph_root);
