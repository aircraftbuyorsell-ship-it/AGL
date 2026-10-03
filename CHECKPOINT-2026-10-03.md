# AGL Checkpoint — 2026-10-03

## Checkpoint purpose

Freeze the current AGL foundation before moving into real ABOS execution evidence.

## Canonical terminology

```
ADL — Agent Definition Language
APL — Agent Policy Layer
AEL — Agent Evidence Layer

ADL → APL → EXECUTION → AEL
```

- ADL describes the agent and declared boundaries.
- APL evaluates authority, policy and authorization before governed execution.
- AEL records observable execution and supporting evidence.
- MCP remains agent ↔ tool interoperability.
- A2A remains agent ↔ agent interoperability.

## Foundation reviewed

- README
- ARCHITECTURE
- ROADMAP
- APL specification
- AEL specification and README
- ADL integration/profile documents
- Conformance model
- Gap Analysis
- Gap Matrix
- Execution Graph specification
- Execution Graph JSON Schema
- Example Execution Graph
- Reconstruction test
- Execution Graph CI workflow

## Corrections made

1. Removed legacy ADL-as-evidence terminology from the active architecture.
2. Restored ADL as the agent-definition layer.
3. Made AEL the evidence layer consistently.
4. Added an explicit AGL ADL integration profile rather than inventing a replacement ADL language.
5. Marked the old ADL evidence schema as legacy; new evidence uses AEL.
6. Updated the gap analysis/matrix to acknowledge existing ADL prior art.
7. Aligned execution-graph relation direction with the generic source → relation → target model.
8. Added execution-level evidence references to the graph schema.
9. Kept ABOS-specific semantics outside the generic AGL core.
10. Preserved the distinction between declared capability/authority and observed execution.

## Validation state

The example Execution Graph and backward reconstruction test were already confirmed passing in CI before this documentation checkpoint.

This checkpoint does **not** claim production AGL conformance for ABOS.

## Additional requirement: Runtime Observability and Measurement

AGL must not stop at governance and provenance. A governed execution must also be quantitatively observable.

The current foundation therefore includes:

- `reference/AGL-RUNTIME-OBSERVABILITY-v1.md`
- `reference/AGL-MEASUREMENT-UNIT-v1.md`
- `schemas/agl-measurement.schema.json`

The canonical chain is:

`RUNTIME LOGS / METRICS / TRACES → EXECUTION → MEASUREMENT UNIT → AGGREGATE → VALUE / COST / PRICE METRIC`

The measurement layer must distinguish measured facts from derived economic calculations. Missing data is not zero, and every quantified claim must remain traceable to executions and evidence.

## Next gate

The next gate is real execution evidence:

```
ABOS governed execution
        ↓
APL decision
        ↓
actual execution
        ↓
AEL / audit evidence
        ↓
AGL Execution Graph
        ↓
schema + reference integrity
        ↓
forward / backward reconstruction
        ↓
AGL CORE conformance evidence
```

No new architecture should be introduced before this gate is tested.

## Acceptance condition for this checkpoint

The public AGL foundation is considered internally consistent when:

- ADL/APL/AEL terminology is consistent;
- active documents no longer describe ADL as the evidence layer;
- graph schema and example use the same relation direction;
- evidence references resolve;
- README accurately describes current status;
- the gap position does not claim novelty for mechanisms already covered elsewhere.

## Scope boundary

This checkpoint intentionally does not yet claim:

- production conformance;
- legal certification;
- universal agent governance;
- replacement of MCP, A2A, PROV, OpenTelemetry, OpenLineage, identity systems or policy languages;
- that AGL is the only implementation of an execution/evidence graph.

AGL remains an open-source integration and governance architecture under active validation.
