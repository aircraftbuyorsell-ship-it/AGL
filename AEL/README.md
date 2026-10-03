# AEL — Agent Evidence Layer

AEL is the evidence and audit plane for governed agent execution.

## Responsibilities

- actor and delegation chain
- authorization and policy decision
- execution lifecycle
- provenance references
- evidence records
- human approvals and interventions
- verification
- failures and blocked actions
- replay
- audit

## Boundary

APL decides whether governed execution may proceed.

AEL records what happened and what evidence supports the observable execution.

`APL → EXECUTION → AEL`

AEL does not define agent identity, policy semantics, transport protocols, model reasoning, domain data models, storage technology, or legal compliance by itself.

## Standards relationship

AEL should reuse and reference established provenance and telemetry mechanisms, including W3C PROV, OpenTelemetry and OpenLineage.

## Status

AEL Evidence Specification v0.1.0.
