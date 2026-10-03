# AGL OpenTelemetry Adapter

Maps OpenTelemetry OTLP trace JSON into an AGL Execution Graph fragment.

## Contract

Input: OTLP/HTTP JSON trace payload (`resourceSpans`).

Output:
- AGL execution metadata
- execution/service/agent nodes when identifiable
- OpenTelemetry external references
- AEL-compatible evidence records
- measurement-source references when GenAI token attributes are present

The adapter does not invent missing telemetry. Unknown fields remain absent.

## Correlation

Preferred attributes:
- `agl.execution_id`
- `service.name`
- `service.version`
- `agl.agent_id`
- `agl.status`

The adapter preserves `trace_id` and `span_id` as OpenTelemetry external references.

The first adapter is trace-focused. Metrics and logs are separate follow-up mappings.
