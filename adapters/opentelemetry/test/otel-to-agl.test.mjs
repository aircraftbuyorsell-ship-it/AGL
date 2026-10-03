import assert from "node:assert/strict";
import { otlpTraceToAgl } from "../src/otel-to-agl.mjs";

const payload = {
  resourceSpans: [{
    resource: { attributes: [
      { key: "service.name", value: { stringValue: "abos-gateway" } },
      { key: "agl.agent_id", value: { stringValue: "agent-abos" } }
    ] },
    scopeSpans: [{
      spans: [{
        traceId: "trace-001",
        spanId: "span-001",
        startTimeUnixNano: "1790990000000000000",
        endTimeUnixNano: "1790990001000000000",
        attributes: [
          { key: "agl.execution_id", value: { stringValue: "exec-001" } }
        ],
        status: { code: "OK" }
      }]
    }]
  }]
};

const graph = otlpTraceToAgl(payload);
assert.equal(graph.execution_id, "exec-001");
assert.equal(graph.execution.status, "completed");
assert.equal(graph.evidence.length, 1);
assert.equal(graph.evidence[0].external_refs[0].ref, "trace:trace-001");

console.log("OpenTelemetry to AGL adapter test passed");
