import assert from "node:assert/strict";
import test from "node:test";

import { provJsonToAgl } from "../adapters/prov/src/prov-to-agl.mjs";

const START = "2026-10-06T20:00:00Z";
const USED_AT = "2026-10-06T20:00:05Z";
const GENERATED_AT = "2026-10-06T20:00:10Z";
const END = "2026-10-06T20:00:15Z";

function officialProvJson() {
  return {
    prefix: {
      ex: "https://example.com/",
      other: "https://other.example/"
    },
    entity: {
      "ex:input": { "prov:type": "input" },
      "ex:result": { "prov:type": "result" },
      "ex:plan": { "prov:type": { $: "prov:Plan", type: "xsd:QName" } }
    },
    activity: {
      "ex:verify": {
        "prov:startTime": START,
        "prov:endTime": END,
        "prov:type": "verification"
      }
    },
    agent: {
      "ex:abos": { "prov:type": { $: "prov:SoftwareAgent", type: "xsd:QName" } },
      "ex:owner": { "prov:type": { $: "prov:Person", type: "xsd:QName" } }
    },
    used: {
      "_:u1": {
        "prov:activity": "ex:verify",
        "prov:entity": "ex:input",
        "prov:time": USED_AT,
        "prov:role": "source"
      }
    },
    wasGeneratedBy: {
      "_:g1": {
        "prov:entity": "ex:result",
        "prov:activity": "ex:verify",
        "prov:time": GENERATED_AT
      }
    },
    wasAssociatedWith: {
      "_:a1": {
        "prov:activity": "ex:verify",
        "prov:agent": "ex:abos",
        "prov:plan": "ex:plan",
        "prov:role": "operator"
      }
    },
    wasDerivedFrom: {
      "_:d1": {
        "prov:generatedEntity": "ex:result",
        "prov:usedEntity": "ex:input",
        "prov:activity": "ex:verify",
        "prov:generation": "_:g1",
        "prov:usage": "_:u1"
      }
    },
    wasAttributedTo: {
      "_:at1": {
        "prov:entity": "ex:result",
        "prov:agent": "ex:abos",
        "prov:type": "authorship"
      }
    },
    actedOnBehalfOf: {
      "_:del1": {
        "prov:delegate": "ex:abos",
        "prov:responsible": "ex:owner",
        "prov:activity": "ex:verify"
      }
    },
    bundle: {
      "ex:bundle": {
        entity: { "ex:result": {} },
        wasAttributedTo: {
          "_:bundle-attribution": {
            "prov:entity": "ex:result",
            "prov:agent": "ex:abos"
          }
        }
      }
    }
  };
}

function legacyAdapterFixture() {
  return {
    entity: {
      "ex:input": {},
      "ex:result": {},
      "other:result": {}
    },
    activity: { "ex:verify": {} },
    agent: { "ex:abos": {} },
    used: {
      "usage:1": { activity: "ex:verify", entity: "ex:input" },
      "usage:2": { activity: "ex:verify", entity: "other:result" }
    },
    wasGeneratedBy: {
      "generation:1": { entity: "ex:result", activity: "ex:verify" }
    },
    wasAssociatedWith: {
      "association:1": { activity: "ex:verify", agent: "ex:abos" }
    }
  };
}

test("produces the top-level fields required by the AGL Execution Graph schema", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  for (const key of ["agl_version", "execution_id", "service", "execution", "nodes", "edges", "evidence"]) {
    assert.ok(Object.hasOwn(graph, key), `missing required property ${key}`);
  }
});

test("maps declared PROV entities, activities and agents to AGL node classes", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  assert.equal(graph.nodes.find((node) => node.node_id === "entity:ex:input")?.node_type, "data");
  assert.equal(graph.nodes.find((node) => node.node_id === "activity:ex:verify")?.node_type, "execution");
  assert.equal(graph.nodes.find((node) => node.node_id === "agent:ex:abos")?.node_type, "actor");
});

test("preserves declared qualified names and activity attributes on nodes", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  const activity = graph.nodes.find((node) => node.node_id === "activity:ex:verify");
  assert.ok(activity.external_refs.some((ref) => ref.ref === "ex:verify"));
  assert.equal(activity.attributes["prov:startTime"], START);
  assert.equal(activity.attributes["prov:endTime"], END);
});

test("maps official PROV-JSON usage as activity consumes entity", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  assert.ok(graph.edges.some((edge) =>
    edge.source === "activity:ex:verify" && edge.relation === "consumes" && edge.target === "entity:ex:input"
  ));
});

test("maps official PROV-JSON generation as activity produces entity", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  assert.ok(graph.edges.some((edge) =>
    edge.source === "activity:ex:verify" && edge.relation === "produces" && edge.target === "entity:ex:result"
  ));
});

test("maps official PROV-JSON association as activity executed by agent", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  assert.ok(graph.edges.some((edge) =>
    edge.source === "activity:ex:verify" && edge.relation === "executed_by" && edge.target === "agent:ex:abos"
  ));
});

test("maps official PROV-JSON derivation from generated entity to used entity", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  assert.ok(graph.edges.some((edge) =>
    edge.source === "entity:ex:result" && edge.relation === "derived_from" && edge.target === "entity:ex:input"
  ));
});

test("maps official PROV-JSON attribution from entity to responsible agent", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  assert.ok(graph.edges.some((edge) =>
    edge.source === "entity:ex:result" && edge.relation === "authored_by" && edge.target === "agent:ex:abos"
  ));
});

test("preserves actedOnBehalfOf delegation and its activity context", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  assert.ok(graph.edges.some((edge) =>
    edge.source === "agent:ex:abos" && edge.relation === "delegated_by" && edge.target === "agent:ex:owner"
  ));
  assert.ok(graph.evidence.some((item) =>
    item.external_refs?.some((ref) => ref.ref === "_:del1") && item.subject === "agent:ex:abos"
  ));
});

test("preserves a named bundle for provenance-of-provenance reconstruction", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  assert.ok(graph.nodes.some((node) =>
    node.external_refs?.some((ref) => ref.ref === "ex:bundle" && ref.relation === "bundle")
  ));
});

test("creates evidence for every mapped official PROV relation", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  for (const relationId of ["_:u1", "_:g1", "_:a1", "_:d1", "_:at1", "_:del1"]) {
    assert.ok(graph.evidence.some((item) =>
      item.external_refs?.some((ref) => ref.ref === relationId)
    ), `missing relation evidence ${relationId}`);
  }
});

test("preserves PROV relation time as the edge observation time", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  const usage = graph.edges.find((edge) => edge.relation === "consumes");
  const generation = graph.edges.find((edge) => edge.relation === "produces");
  assert.equal(usage?.observed_at, USED_AT);
  assert.equal(generation?.observed_at, GENERATED_AT);
});

test("preserves association plan and role semantics", () => {
  const graph = provJsonToAgl(officialProvJson(), { executionId: "prov:document:1", createdAt: START });
  assert.ok(graph.edges.some((edge) =>
    edge.source === "activity:ex:verify" && edge.relation === "uses" && edge.target === "entity:ex:plan"
  ));
  assert.ok(graph.evidence.some((item) =>
    item.external_refs?.some((ref) => ref.ref === "_:a1") && item.external_refs?.some((ref) => ref.ref === "operator")
  ));
});

test("makes every endpoint of an accepted relation resolve to a graph node", () => {
  const graph = provJsonToAgl(legacyAdapterFixture(), { executionId: "prov:document:1", createdAt: START });
  const nodeIds = new Set(graph.nodes.map((node) => node.node_id));
  for (const edge of graph.edges) {
    assert.ok(nodeIds.has(edge.source), `missing edge source ${edge.source}`);
    assert.ok(nodeIds.has(edge.target), `missing edge target ${edge.target}`);
  }
});

test("keeps generation direction correct for the adapter's legacy field spelling", () => {
  const graph = provJsonToAgl(legacyAdapterFixture(), { executionId: "prov:document:1", createdAt: START });
  assert.ok(graph.edges.some((edge) =>
    edge.source === "activity:ex:verify" && edge.relation === "produces" && edge.target === "entity:ex:result"
  ));
});

test("does not collapse different qualified names to the same relation endpoint", () => {
  const graph = provJsonToAgl(legacyAdapterFixture(), { executionId: "prov:document:1", createdAt: START });
  const usageTargets = graph.edges.filter((edge) => edge.relation === "consumes").map((edge) => edge.target);
  assert.equal(new Set(usageTargets).size, usageTargets.length);
  assert.ok(usageTargets.includes("entity:ex:input"));
  assert.ok(usageTargets.includes("entity:other:result"));
});

test("does not fabricate an epoch-started completed execution for an unscoped PROV document", () => {
  assert.throws(() => provJsonToAgl(officialProvJson()));
});

test("uses selected PROV activity lifecycle rather than a document ingestion timestamp", () => {
  const graph = provJsonToAgl(officialProvJson(), {
    executionId: "activity:ex:verify",
    createdAt: "2026-10-06T21:00:00Z"
  });
  assert.equal(graph.execution.started_at, START);
  assert.equal(graph.execution.ended_at, END);
});

test("rejects an identifier declared as both entity and activity", () => {
  assert.throws(() => provJsonToAgl({
    entity: { "ex:conflict": {} },
    activity: { "ex:conflict": {} }
  }, { executionId: "prov:document:1", createdAt: START }));
});
