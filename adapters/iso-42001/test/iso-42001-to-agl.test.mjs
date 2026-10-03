import assert from "node:assert/strict";
import { iso42001ToAgl } from "../src/iso-42001-to-agl.mjs";

const graph = iso42001ToAgl({
  version: "ISO/IEC 42001:2023",
  requirement: "6.1",
  state: "implemented"
}, { integrityStatus: "verified" });

assert.equal(graph.nodes[1].attributes.version, "ISO/IEC 42001:2023");
assert.equal(graph.nodes[1].attributes.state, "implemented");
assert.equal(graph.evidence[0].source, "ISO/IEC 42001");
assert.equal(graph.evidence[0].integrity_status, "verified");
assert.throws(() => iso42001ToAgl({}), /requires a control/);
console.log("ISO/IEC 42001 adapter test passed");
