import assert from "node:assert/strict";
import { nistAiRmfToAgl } from "../src/nist-ai-rmf-to-agl.mjs";

const graph = nistAiRmfToAgl({
  function: "Govern",
  controlId: "GV.1.1",
  state: "implemented"
}, { integrityStatus: "verified" });

assert.equal(graph.nodes[1].attributes.function, "GOVERN");
assert.equal(graph.nodes[1].attributes.state, "implemented");
assert.equal(graph.evidence[0].source, "NIST AI RMF");
assert.equal(graph.evidence[0].integrity_status, "verified");
assert.throws(() => nistAiRmfToAgl({ function: "unknown", controlId: "x" }), /function/);
console.log("NIST AI RMF adapter test passed");
