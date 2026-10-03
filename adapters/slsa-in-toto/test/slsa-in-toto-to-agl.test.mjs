import assert from "node:assert/strict";
import { slsaInTotoToAgl } from "../src/slsa-in-toto-to-agl.mjs";

const graph = slsaInTotoToAgl({
  predicateType: "https://slsa.dev/provenance/v1",
  builder: { id: "https://github.com/example/builder" },
  subject: [{ name: "abos-worker.js", digest: { sha256: "abc123" } }],
  uri: "urn:attestation:001",
  integrityStatus: "verified"
});

assert.ok(graph.nodes.some((n) => n.node_type === "actor"));
assert.ok(graph.nodes.some((n) => n.node_type === "code_artifact"));
assert.ok(graph.edges.some((e) => e.relation === "produces"));
assert.equal(graph.evidence[0].integrity_status, "verified");
assert.ok(graph.nodes.find((n) => n.node_type === "code_artifact").external_refs[0].ref.includes("abc123"));
assert.throws(() => slsaInTotoToAgl(null), /attestation/);
console.log("SLSA/in-toto adapter test passed");
