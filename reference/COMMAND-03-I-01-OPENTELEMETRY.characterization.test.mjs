import assert from "node:assert/strict";
import test from "node:test";

import { otlpTraceToAgl } from "../adapters/opentelemetry/src/otel-to-agl.mjs";

const TRACE_A = "5b8efff798038103d269b633813fc60c";
const TRACE_B = "4bf92f3577b34da6a3ce929d0e0e4736";
const SPAN_ROOT = "00f067aa0ba902b7";
const SPAN_CHILD = "b7ad6b7169203331";

function payload({
  traceId = TRACE_A,
  spanId = SPAN_ROOT,
  statusCode = 1,
  serviceName = "abos-gateway",
  includeTimes = true,
  parentSpanId,
  extraSpans = []
} = {}) {
  const span = {
    traceId,
    spanId,
    name: "governed execution",
    ...(parentSpanId ? { parentSpanId } : {}),
    ...(includeTimes ? {
      startTimeUnixNano: "1790990000000000000",
      endTimeUnixNano: "1790990001000000000"
    } : {}),
    attributes: [{
      key: "agl.execution_id",
      value: { stringValue: "exec-otel-001" }
    }],
    status: { code: statusCode }
  };

  return {
    resourceSpans: [{
      resource: {
        attributes: serviceName === null ? [] : [{
          key: "service.name",
          value: { stringValue: serviceName }
        }]
      },
      scopeSpans: [{
        scope: { name: "agl-characterization", version: "1.0.0" },
        spans: [span, ...extraSpans]
      }]
    }]
  };
}

test("preserves valid OTLP trace and span identifiers as evidence references", () => {
  const graph = otlpTraceToAgl(payload());
  const refs = graph.evidence[0].external_refs.map((ref) => ref.ref);
  assert.ok(refs.includes(`trace:${TRACE_A}`));
  assert.ok(refs.includes(`span:${SPAN_ROOT}`));
});

test("maps OTLP/JSON numeric STATUS_CODE_OK (1) to completed", () => {
  assert.equal(otlpTraceToAgl(payload({ statusCode: 1 })).execution.status, "completed");
});

test("maps OTLP/JSON numeric STATUS_CODE_ERROR (2) to failed", () => {
  assert.equal(otlpTraceToAgl(payload({ statusCode: 2 })).execution.status, "failed");
});

test("does not claim completed for OTLP STATUS_CODE_UNSET (0)", () => {
  assert.notEqual(otlpTraceToAgl(payload({ statusCode: 0 })).execution.status, "completed");
});

test("fails closed for an unknown numeric status code", () => {
  assert.throws(() => otlpTraceToAgl(payload({ statusCode: 99 })));
});

test("keeps each span attributed to its own trace in a multi-trace envelope", () => {
  const second = {
    traceId: TRACE_B,
    spanId: SPAN_CHILD,
    name: "independent trace",
    startTimeUnixNano: "1790990002000000000",
    endTimeUnixNano: "1790990003000000000",
    status: { code: 1 }
  };
  const graph = otlpTraceToAgl(payload({ extraSpans: [second] }));
  const secondRefs = graph.evidence[1].external_refs.map((ref) => ref.ref);
  assert.ok(secondRefs.includes(`trace:${TRACE_B}`));
});

test("fails closed instead of inventing a missing trace identifier", () => {
  assert.throws(() => otlpTraceToAgl(payload({ traceId: null })));
});

test("does not invent an unknown service identifier", () => {
  const graph = otlpTraceToAgl(payload({ serviceName: null }));
  assert.ok(!graph.nodes.some((node) => node.node_id === "service:unknown-service"));
});

test("does not invent wall-clock execution time when telemetry timestamps are absent", () => {
  assert.throws(() => otlpTraceToAgl(payload({ includeTimes: false })));
});

test("produces the top-level fields required by the AGL Execution Graph schema", () => {
  const graph = otlpTraceToAgl(payload());
  for (const key of ["agl_version", "execution_id", "service", "execution", "nodes", "edges", "evidence"]) {
    assert.ok(Object.hasOwn(graph, key), `missing required property ${key}`);
  }
});

test("preserves parent-child span topology", () => {
  const child = {
    traceId: TRACE_A,
    spanId: SPAN_CHILD,
    parentSpanId: SPAN_ROOT,
    name: "child operation",
    startTimeUnixNano: "1790990000100000000",
    endTimeUnixNano: "1790990000900000000",
    status: { code: 1 }
  };
  const graph = otlpTraceToAgl(payload({ extraSpans: [child] }));
  assert.ok(graph.edges.some((edge) =>
    edge.relation === "parent_of" &&
    edge.source.includes(SPAN_ROOT) &&
    edge.target.includes(SPAN_CHILD)
  ));
});
