# AGL Measurement Model v1

A **Measurement** quantifies the processing actually performed by a governed service execution. The business object is not the unit of measurement.

`USE CASE → EXECUTION → PROCESSING VOLUME → MEASUREMENT → NORMALIZED UNIT → AGGREGATE → ECONOMIC METRIC`

## Core principle

One business object does not equal one processing unit. Two aircraft, documents, claims, transactions or other objects may require radically different processing volumes and therefore represent different amounts of governed work.

## Processing volume

For AI and agentic services, **processed tokens** are the primary generic quantitative basis where tokenization is available.

A measurement SHOULD distinguish input tokens, output tokens, total processed tokens, and the tokenization method/version.

Other processing dimensions MAY be recorded where materially relevant: bytes, documents, images, events, tool calls, model calls, workflow steps, records/domain objects and compute/resource consumption.

These are measurements of processing, not business-object identities.

## Normalized Processing Unit

AGL MAY define a normalized unit for aggregation within a declared profile.

Example: `1 AGL Processing Unit (PU) = 1,000 processed tokens`.

`processing_units = total_processed_tokens / normalization_factor`

The normalization factor MUST be explicitly declared, versioned and reproducible. AGL does not require 1,000 tokens as a universal constant; profiles MAY define another factor.

## Example

```text
Aircraft A
85,000 input tokens
21,000 output tokens
106,000 total processed tokens
106 PU

Aircraft B
410,000 input tokens
73,000 output tokens
483,000 total processed tokens
483 PU
```

Both executions concern one aircraft, but they are not equivalent processing units.

## Economic layer

For a defined scope `T`:

`V(T) = sum(normalized_processing_units(T))`

`cost_per_unit(T) = attributable_cost(T) / V(T)`

`value_per_unit(T) = attributed_value(T) / V(T)`

`price_per_unit(T) = charged_amount(T) / V(T)`

The numerator and denominator MUST have the same declared scope. If processing volume is unavailable, the resulting ratio is **undefined**, not zero.

## Governance economics

Governance overhead should be attributable to the execution that generated it, rather than assigned uniformly to an agent or business object.

`governance_cost_per_unit = attributable_governance_cost / V(T)`

Providers MAY combine processing volume, execution complexity, evidence coverage and residual evidence gaps in their own risk models. AGL records the evidence needed for such analysis; it does not determine legal liability, probability of loss or an insurer's decision.

## Measurement state

`measured | estimated | partial | unavailable | invalid | disputed`

Missing telemetry MUST NOT silently become zero.

## Evidence chain

`CLAIM → ECONOMIC/RISK METRIC → MEASUREMENT → EXECUTION → RUNTIME TELEMETRY / LOGS → SOURCE EVIDENCE`

This makes the quantitative claim reconstructable at execution level.