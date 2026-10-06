import assert from "node:assert/strict";
import test from "node:test";

import { openLineageEventToAgl } from "../adapters/openlineage/src/openlineage-to-agl.mjs";

const RUN_ID = "018f0f9a-7b31-7cc2-a276-04d9ad2b7e91";
const PARENT_RUN_ID = "018f0f98-5662-7cc2-a276-04d9ad2b7e91";
const PRODUCER = "https://github.com/aircraftbuyorsell-ship-it/AGL/tree/9c4c5f3/adapters/openlineage";
const SCHEMA_URL = "https://openlineage.io/spec/2-0-2/OpenLineage.json#/$defs/RunEvent";

function event(overrides = {}) {
  return {
    eventTime: "2026-10-06T22:20:00.000Z",
    producer: PRODUCER,
    schemaURL: SCHEMA_URL,
    eventType: "COMPLETE",
    run: { runId: RUN_ID },
    job: { namespace: "abos", name: "aircraft-verification" },
    inputs: [{ namespace: "postgres://abos", name: "public.faa_aircraft" }],
    outputs: [{ namespace: "postgres://abos", name: "public.aircraft_verification" }],
    ...overrides
  };
}

test("maps a current-schema RunEvent to run, job and dataset references", () => {
  const graph = openLineageEventToAgl(event());
  assert.equal(graph.execution_id, `openlineage:run:${RUN_ID}`);
  assert.ok(graph.nodes.some((node) => node.node_id === "job:abos:aircraft-verification"));
  assert.ok(graph.nodes.some((node) => node.node_id === "dataset:postgres://abos:public.faa_aircraft"));
  assert.ok(graph.nodes.some((node) => node.node_id === "dataset:postgres://abos:public.aircraft_verification"));
});

test("produces the top-level fields required by the AGL Execution Graph schema", () => {
  const graph = openLineageEventToAgl(event());
  for (const key of ["agl_version", "execution_id", "service", "execution", "nodes", "edges", "evidence"]) {
    assert.ok(Object.hasOwn(graph, key), `missing required property ${key}`);
  }
});

test("preserves the supplied OpenLineage schema and producer in evidence", () => {
  const graph = openLineageEventToAgl(event());
  assert.equal(graph.evidence[0].schema_ref, SCHEMA_URL);
  assert.equal(graph.evidence[0].producer, PRODUCER);
});

test("rejects a runId that is not an OpenLineage UUID", () => {
  assert.throws(() => openLineageEventToAgl(event({ run: { runId: "run-001" } })));
});

test("requires the OpenLineage job namespace instead of inventing one", () => {
  assert.throws(() => openLineageEventToAgl(event({
    job: { name: "aircraft-verification" }
  })));
});

test("requires complete dataset namespace and name instead of inventing identity", () => {
  assert.throws(() => openLineageEventToAgl(event({
    inputs: [{ namespace: "postgres://abos" }]
  })));
});

test("requires the OpenLineage producer URI", () => {
  const input = event();
  delete input.producer;
  assert.throws(() => openLineageEventToAgl(input));
});

test("requires the event schemaURL instead of substituting a different version", () => {
  const input = event();
  delete input.schemaURL;
  assert.throws(() => openLineageEventToAgl(input));
});

test("rejects an invalid eventTime", () => {
  assert.throws(() => openLineageEventToAgl(event({ eventTime: "not-a-date" })));
});

test("rejects an eventType outside the OpenLineage enum", () => {
  assert.throws(() => openLineageEventToAgl(event({ eventType: "SUCCESS" })));
});

test("does not infer that an OTHER metadata event means the run is running", () => {
  assert.notEqual(openLineageEventToAgl(event({ eventType: "OTHER" })).execution.status, "running");
});

test("uses terminal eventTime as ended_at rather than fabricating started_at", () => {
  const graph = openLineageEventToAgl(event({ eventType: "COMPLETE" }));
  assert.equal(graph.execution.ended_at, "2026-10-06T22:20:00.000Z");
  assert.notEqual(graph.execution.started_at, "2026-10-06T22:20:00.000Z");
});

test("represents an input as execution consumes dataset", () => {
  const graph = openLineageEventToAgl(event());
  const datasetId = "dataset:postgres://abos:public.faa_aircraft";
  assert.ok(graph.edges.some((edge) =>
    edge.source === graph.execution_id &&
    edge.relation === "consumes" &&
    edge.target === datasetId
  ));
});

test("deduplicates a dataset observed as both input and output", () => {
  const shared = { namespace: "postgres://abos", name: "public.aircraft" };
  const graph = openLineageEventToAgl(event({ inputs: [shared], outputs: [shared] }));
  const ids = graph.nodes.map((node) => node.node_id);
  assert.equal(new Set(ids).size, ids.length);
});

test("preserves ParentRunFacet hierarchy for reconstruction", () => {
  const input = event({
    run: {
      runId: RUN_ID,
      facets: {
        parent: {
          _producer: PRODUCER,
          _schemaURL: "https://openlineage.io/spec/facets/1-2-0/ParentRunFacet.json",
          job: { namespace: "abos", name: "verification-pipeline" },
          run: { runId: PARENT_RUN_ID }
        }
      }
    }
  });
  const graph = openLineageEventToAgl(input);
  const parentId = `openlineage:run:${PARENT_RUN_ID}`;
  assert.ok(graph.nodes.some((node) => node.node_id === parentId));
  assert.ok(graph.edges.some((edge) =>
    edge.source === parentId && edge.relation === "parent_of" && edge.target === graph.execution_id
  ));
});

test("preserves dataset facets needed for data-lineage reconstruction", () => {
  const input = event({
    outputs: [{
      namespace: "postgres://abos",
      name: "public.aircraft_verification",
      facets: {
        schema: {
          _producer: PRODUCER,
          _schemaURL: "https://openlineage.io/spec/facets/1-1-1/SchemaDatasetFacet.json",
          fields: [{ name: "registration", type: "text" }]
        }
      }
    }]
  });
  const graph = openLineageEventToAgl(input);
  const output = graph.nodes.find((node) => node.node_id === "dataset:postgres://abos:public.aircraft_verification");
  assert.deepEqual(output?.attributes?.facets?.schema?.fields, [{ name: "registration", type: "text" }]);
});

test("makes the recorded evidence producer resolvable in the graph", () => {
  const graph = openLineageEventToAgl(event());
  assert.ok(graph.nodes.some((node) => node.node_id === graph.evidence[0].producer));
});
