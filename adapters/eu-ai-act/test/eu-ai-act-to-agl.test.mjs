import assert from "node:assert/strict";
import { euAiActToAgl } from "../src/eu-ai-act-to-agl.mjs";

const graph = euAiActToAgl({
  article: "Article 9",
  category: "high-risk",
  applicability: "applicable",
  state: "mapped"
}, { integrityStatus: "verified" });

assert.equal(graph.nodes[1].attributes.category, "high-risk");
assert.equal(graph.nodes[1].attributes.applicability, "applicable");
assert.equal(graph.evidence[0].source, "EUR-Lex");
assert.equal(graph.evidence[0].integrity_status, "verified");
assert.throws(() => euAiActToAgl({ category: "other" }), /requires article/);
console.log("EU AI Act adapter test passed");
