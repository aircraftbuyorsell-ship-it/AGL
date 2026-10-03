# AGL Runtime Observability & Measurement

**Status:** Draft v0.1.0

AGL MUST make governed execution observable after the fact. Runtime logs, traces, metrics and quantitative processing measurements are evidence-bearing execution data.

AGL does not replace OpenTelemetry or existing observability systems. It binds their identifiers and material measurements to governed execution.

## Stable correlation

Every governed execution SHOULD expose `execution_id`, `correlation_id`, `trace_id` where available, `span_id` where available, `service_id`, `agent_id` where applicable and `deployment_id` where applicable.

Internal logs MUST be attributable to a concrete execution or explicitly classified as system-level events.

## Processing measurements

AGL SHOULD distinguish volume (records, documents, tokens, bytes, images, tool calls, model calls, workflow steps and domain objects), time (wall-clock, queue, active execution, model/tool latency) and resources (CPU, memory, GPU, storage/network I/O, inference units and energy where available).

## Canonical Measurement Unit

A measurable service SHOULD define one or more explicit Measurement Units containing:

- `unit_id`
- definition/counting rule
- quantity and unit
- measurement method
- scope and time window
- execution references
- evidence references

Example: `aircraft_verification` = one completed governed aircraft-verification execution that reaches its defined terminal state.

## Quantification

For period T:

`Volume(T) = SUM(measured_units(T))`

Missing telemetry MUST NOT silently become zero. Measurement state SHOULD distinguish `measured`, `estimated`, `partial`, `unavailable`, `invalid` and `disputed`.

## Unit economics

Let V(T) be measured volume, C(T) attributable cost, R(T) attributed value/revenue and P(T) actual price/contract amount for the same scope:

`cost_per_unit = C(T) / V(T)`

`value_per_unit = R(T) / V(T)`

`price_per_unit = P(T) / V(T)`

If V(T) = 0, the ratio is undefined and MUST NOT be represented as zero.

AGL records the evidence required to reproduce these calculations. It does not prescribe pricing.

## Value proof chain

`CLAIM → MEASUREMENT → EXECUTIONS → RUNTIME TELEMETRY/LOGS → SOURCE EVIDENCE`

A quantified claim such as “1,240 aircraft verifications were completed during a defined period” must be reducible to trusted execution records or a reproducible aggregate derived from them.

## Aggregate

A measurement aggregate SHOULD contain `aggregate_id`, `unit_id`, period start/end, quantity, unit, execution count, source references, evidence references, calculation method/version, generation time and integrity status.

## Minimum conformance direction

A conforming implementation SHOULD demonstrate stable execution correlation, attributable runtime logs, at least one measurable processing unit, reproducible aggregation, explicit measurement state, traceability from aggregate to executions/evidence, no silent zero for missing data, and reproducible unit-cost/value calculations when inputs exist.
