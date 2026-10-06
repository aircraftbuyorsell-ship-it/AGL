# COMMAND-03 / I-01 — OpenTelemetry integration audit

## Checkpoint

- Command: `COMMAND-03` for `I-01 OpenTelemetry` only.
- Observation timestamp: `2026-10-06T22:09:44Z`.
- AGL working branch: `agl/command-01-inventory-2026-10-06`.
- AGL input HEAD: `61f26a3799523b63a2be348c782f4e2ccd4cf193`.
- AGL source baseline: `9c4c5f3eb54a363faee2fdf6aaed82884bb82e80`.
- ABOS current reference: `005c9aeb31782f4a0fcbf00f21e30b592cc60db4`.
- ABOS historical reference: `401dabfea8db375ae65f82df4f4f1e7fea294dee`.
- Requested/recommended model: `gpt-5.6 / medium`.
- Scope stop: no adapter, mapping, schema, CI or runtime fix was implemented;
  `I-02` and `COMMAND-04` were not started.

## Result

**I-01 is IMPLEMENTED as a narrow trace-to-fragment converter, but it is not
conformant with its declared OTLP/HTTP JSON and AGL mapping contracts.**

The adapter can turn one simple trace fixture into execution metadata and AEL-like
evidence references. It preserves a valid trace ID and span ID and reads
`service.name`, `service.version`, `agl.execution_id` and `agl.agent_id` from
simple scalar attributes. The repository smoke test passes.

The verified boundary is substantially narrower than the repository's `ADAPTER`
label and interoperability mapping. In particular, the adapter does not correctly
interpret normative numeric OTLP/JSON status enums, converts `UNSET`, unknown and
numeric `ERROR` to `completed`, collapses multiple traces and resources into one
execution/service attribution, invents identifiers and wall-clock time when input
is absent, loses span topology and most of the OTLP span model, and returns a
fragment for which no machine schema exists. Its output is not a complete AGL
Execution Graph.

Evidence scope:

| Scope | Result | Basis |
|---|---|---|
| `STATIC` | **FAIL** | Code and documentation exist, but the declared OTLP/HTTP JSON contract, status semantics, no-invention statement, full mapping and schema boundary are not met. |
| `REFERENCE` | **FAIL** | Existing smoke test: PASS. Focused characterization: 11 tests, 2 PASS and 9 FAIL. Current ABOS snapshot has no OpenTelemetry/OTLP correlation implementation; historical ABOS contains only nullable trace/span fields and static missing-field checks. |
| `ABOS_RUNTIME` | **BLOCKED** | No attributable ABOS OTLP payload, exporter/collector configuration, ingestion receipt, trace backend record or AEL graph generated from an actual ABOS run was available. No production action was invoked. |

Overall project status for I-01: **IMPLEMENTED (partial), not TESTED against the
declared contract, not CONFORMANT**.

## Official source baseline

Primary sources were observed at the checkpoint time. AGL does not pin an
OpenTelemetry version, so the comparison uses the then-current official releases:

| Source | Observed official version/status | Audit use |
|---|---|---|
| [OpenTelemetry specification releases](https://github.com/open-telemetry/opentelemetry-specification/releases/tag/v1.61.0) | Specification `v1.61.0` | Trace API and status semantics. |
| [OTLP specification](https://opentelemetry.io/docs/specs/otlp/) | OTLP `1.11.0`; traces, metrics and logs marked stable | OTLP/HTTP JSON encoding and transport envelope. |
| [OpenTelemetry protocol releases](https://github.com/open-telemetry/opentelemetry-proto/releases/tag/v1.11.1) | Protocol `v1.11.1` | Current protobuf model; patch release explicitly retains integer-based JSON enums and integer timestamps. |
| [Trace API](https://opentelemetry.io/docs/specs/otel/trace/api/) | Current official trace specification | ID size/validity, parent topology, events, links, timestamps and `StatusCode`. |
| [Service semantic conventions](https://opentelemetry.io/docs/specs/semconv/resource/service/) | `service` stable | `service.name`, `service.version` and fallback spelling. |
| [Semantic Conventions releases](https://github.com/open-telemetry/semantic-conventions/releases/tag/v1.44.0) | Semantic Conventions `v1.44.0` | Resource conventions and the move of GenAI conventions to their official dedicated repository. |

Normative facts used in the audit:

- OTLP/HTTP JSON is proto3 JSON with deviations: `traceId` and `spanId` are
  hexadecimal strings, enum fields **must be integers**, lowerCamelCase field
  names are required, and 64-bit integer values are encoded as decimal strings.
- A valid trace ID is 16 bytes/non-zero and a valid span ID is 8 bytes/non-zero;
  their hexadecimal API forms are 32 and 16 lowercase characters respectively.
- Span status defaults to `Unset`. `Ok` means explicitly validated success and
  `Error` means an error; `Unset` is not an implicit success signal.
- A span contains name, context, parent, kind, timestamps, attributes, links,
  events and status. Those fields are part of reconstruction, not interchangeable
  with one trace-level evidence record.
- `service.name` is stable and required at the resource/SDK boundary. The official
  SDK fallback is `unknown_service[:executable]`, not `unknown-service`.

## Contract comparison

| Area | Existing AGL behavior | Finding |
|---|---|---|
| OTLP envelope | Reads `resourceSpans → scopeSpans → spans` from an already parsed object. | **PARTIAL.** This is a converter, not an OTLP receiver/exporter. It does not process the `ExportTraceServiceRequest` boundary, HTTP metadata, partial success, rejection or delivery evidence. |
| Trace/span identity | Copies root `traceId` and each `spanId` into external references. | **PARTIAL.** Valid IDs are preserved, but format/non-zero validity is never checked. The committed test uses invalid `trace-001` / `span-001`. Missing trace ID becomes `unknown`. |
| OTLP/JSON enums | `spanStatus` recognizes strings `OK`, `ERROR`, `UNSET`. | **FAIL.** Normative OTLP JSON uses integers `0/1/2`. Numeric `ERROR` becomes `completed`; all unknown values also become `completed`. The smoke fixture's string `OK` is not valid OTLP/JSON. |
| Status semantics | String `UNSET` and every unrecognized/missing status become `completed`. | **FAIL.** `Unset` is the default absence of a status decision, not explicit success. This can fabricate successful execution evidence. |
| Trace partitioning | Selects one root and one trace ID after flattening every resource/scope/span. | **FAIL.** Multiple traces are collapsed; every evidence item receives the root trace reference and one execution ID. |
| Resource/service attribution | Creates one service from root span/resource attributes. | **PARTIAL/FAIL.** `service.name` and version work for the root, but spans from other resources are attributed to it. Namespace, instance, deployment, scope and `schemaUrl` are discarded. Missing service becomes the non-standard invented `unknown-service`. |
| Span model and topology | Creates one evidence record per span and a trace/span external reference. | **PARTIAL/FAIL.** Span name, kind, parent relation, trace state, flags, events, links, attributes, status message and dropped counts are not represented. Parent/child reconstruction is impossible. |
| Timestamps | Converts nanosecond decimal strings through JavaScript `Number` to an ISO date. | **PARTIAL/FAIL.** Sub-millisecond precision and exact 64-bit representation are lost. Missing timestamps cause current wall-clock time to be inserted, contrary to the adapter's no-invention contract. |
| Attribute values | Selects the first property of each `AnyValue`. | **PARTIAL.** Scalar strings/numbers work by convention; arrays, key-value lists and bytes are not decoded recursively or type-validated. |
| Execution correlation | Prefers `agl.execution_id`, otherwise uses trace ID. | **PARTIAL.** The custom correlation is useful, but no semantic-convention/schema contract for the `agl.*` attributes is pinned and missing trace IDs can yield `execution_id: unknown`. |
| Evidence | Emits an AEL-compatible-looking record per span with trace/span references. | **PARTIAL.** All evidence uses one producer/subject, integrity remains `unknown`, and the span content needed to substantiate the evidence is not preserved. Telemetry remains observation, not authorization proof. |
| Measurements, logs, metrics | GenAI token attributes add only a `measurement_source` external reference; README says metrics/logs are follow-up. | **NOT IMPLEMENTED** for the broader mapping. No AGL measurement object/value is emitted and no log or metric OTLP signal is accepted. |
| AGL schema | Returns `execution_id`, `execution`, `nodes`, `edges`, `evidence`. | **FAIL** as a full graph: required `agl_version` and `service` are absent. No fragment schema exists, so the stated fragment contract is not machine-validatable. |
| Test/CI coverage | Runs one assertion script after separately validating only the canonical example graph. | **FAIL** for conformance. Adapter output is not schema-validated; status/error, IDs, multiple traces/resources, topology, missing data, AnyValue variants, measurements and ABOS correlation are untested. |

## Executed tests

Node runtime: `v24.19.0`.

Existing repository smoke test:

```text
node adapters/opentelemetry/test/otel-to-agl.test.mjs
```

Result: exit `0`; PASS. This verifies only one span and four output assertions.
Its IDs and string status enum are not valid OTLP/HTTP JSON representations.

Focused audit characterization:

```text
node --test reference/COMMAND-03-I-01-OPENTELEMETRY.characterization.test.mjs
```

Result: exit `1`; 11 tests, 2 PASS and 9 FAIL.

| # | Requirement | Result | Observed behavior |
|---:|---|---|---|
| 1 | Preserve valid trace/span IDs | PASS | Both external references are retained. |
| 2 | Numeric `STATUS_CODE_OK (1)` becomes completed | PASS* | Output is completed, but only because every unknown status defaults to completed; this does not prove enum parsing. |
| 3 | Numeric `STATUS_CODE_ERROR (2)` becomes failed | FAIL | Becomes completed. |
| 4 | Numeric `STATUS_CODE_UNSET (0)` does not claim success | FAIL | Becomes completed. |
| 5 | Unknown numeric status fails closed | FAIL | Becomes completed. |
| 6 | Preserve per-span trace attribution in multi-trace input | FAIL | Second span is attributed to the root trace. |
| 7 | Missing trace ID is not invented | FAIL | `unknown` is used. |
| 8 | Missing service ID is not invented | FAIL | `service:unknown-service` is used. |
| 9 | Missing timestamps are not invented | FAIL | Current wall-clock time is used. |
| 10 | Produce full-graph required fields | FAIL | `agl_version` and `service` are absent. |
| 11 | Preserve parent-child topology | FAIL | No span nodes or parent edge exists. |

`PASS*` is a coincidental output match, not evidence of correct OTLP enum support.

## Evidence classification

### STATIC

Verified repository artifacts:

- [adapter implementation](../adapters/opentelemetry/src/otel-to-agl.mjs);
- [adapter contract](../adapters/opentelemetry/README.md);
- [smoke test](../adapters/opentelemetry/test/otel-to-agl.test.mjs);
- [interoperability mapping](AGL-INTEROPERABILITY-STANDARDS-MAPPING-v1.md);
- [runtime observability mapping](AGL-RUNTIME-OBSERVABILITY-v1.md);
- [Execution Graph schema](../schemas/agl-execution-graph.schema.json);
- [CI workflow](../.github/workflows/agl-execution-graph-validation.yml).

STATIC evidence proves implementation intent and a narrow converter. It does not
prove protocol interoperability, ABOS use or conformance.

### REFERENCE

The committed AGL fixture passes its smoke test, while the official-format
characterization fails 9 of 11 checks. The previously verified current ABOS
snapshot contains no `OpenTelemetry`, `OTLP`, `traceparent`, `trace_id` or
`span_id` integration. The historical ABOS reference contains nullable
`trace_id`/`span_id` fields and tests/documents them as absent runtime fields;
that is static historical correlation scaffolding, not emitted telemetry.

REFERENCE evidence therefore remains FAIL. A passing assertion over a synthetic
fixture is not ABOS runtime evidence.

### ABOS_RUNTIME

No attributable runtime chain was available for:

```text
ABOS governed request
→ instrumented execution span
→ OTLP export/collector receipt
→ AGL adapter conversion
→ schema-valid graph/evidence
→ trace/span lookup and reconstruction
```

ABOS_RUNTIME is BLOCKED. This audit did not query or mutate production systems.

## Gaps and blockers

- No pinned OpenTelemetry Specification, OTLP/proto or Semantic Conventions
  version/schema URL makes the mapping reproducible over time.
- Numeric OTLP/JSON enum handling and span status semantics are incorrect and can
  turn errors or unknowns into claimed success.
- ID, timestamp and input envelope validation do not fail closed.
- Multiple traces/resources are collapsed and span topology/content is lost.
- The converter invents missing trace/service/time values despite its documented
  no-invention rule.
- No machine schema exists for the returned fragment; it fails the required-field
  boundary of the full AGL Execution Graph schema.
- Metrics, logs and actual AGL measurements are not implemented.
- CI does not validate adapter output or use an official-format conformance fixture.
- No ABOS runtime instrumentation/export/ingestion/evidence chain is attributable.

## Changed

Added this audit, its worklog checkpoint and one focused characterization test.
No adapter, mapping, schema, CI, ABOS code or production/runtime behavior changed.

## ONE next_action

Run **COMMAND-03 for I-02 OpenLineage only**. Use official OpenLineage
specifications and repositories, compare them with the existing AGL adapter,
mapping, schemas and tests, keep `STATIC` / `REFERENCE` / `ABOS_RUNTIME`
separate, save the checkpoint, and stop before I-03 and COMMAND-04.

Recommended model/reasoning: `gpt-5.6 / medium`.
