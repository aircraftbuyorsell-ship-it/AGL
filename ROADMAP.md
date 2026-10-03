# AGL Roadmap

AGL is the implementation-neutral governance and evidence architecture above MCP and A2A.

## 1. Canonical architecture

```
ADL → APL → EXECUTION → AEL
```

- **ADL — Agent Definition Language:** describes the agent and declared boundaries.
- **APL — Agent Policy Layer:** evaluates authority and policy before governed execution.
- **AEL — Agent Evidence Layer:** records observable execution and supporting evidence.
- **Security & Trust:** supplies identity, credentials, trust and integrity mechanisms.
- **MCP:** agent ↔ tool interoperability.
- **A2A:** agent ↔ agent interoperability.
- **Execution Graph:** connects these mechanisms into a reconstructable service execution.

## 2. Current state

### Completed foundation

- APL Core Specification v0.1.0
- APL grammar/schema baseline
- AEL Evidence Specification v0.1.0
- AEL evidence schema
- Security & Trust baseline
- AGL Conformance Model v0.1.0
- AGL Gap Analysis v1
- AGL Gap Matrix v1
- AGL Execution Graph v1 draft
- AGL Execution Graph JSON Schema
- Example execution graph
- Schema validation CI
- Forward/backward reconstruction test
- Runtime observability baseline
- Processing measurement unit baseline
- Execution-level measurement references

### Current validation result

The example execution graph and reconstruction path are passing CI.

This validates the graph mechanics only. It does **not** yet establish production conformance of ABOS.

## 3. Next work

### AGL-01 — Terminology and document baseline

- keep ADL, APL and AEL strictly separate;
- remove legacy ADL-as-evidence terminology;
- make README, Architecture, Roadmap and Conformance mutually consistent;
- identify external standards rather than claiming ownership of established terms.

### AGL-02 — Real ABOS execution adapter

Transform an actual governed ABOS execution into an AGL Execution Graph.

Required evidence:

`ABOS governed execution → APL decision → execution → AEL evidence → AGL graph`

The adapter MUST preserve real identifiers and MUST NOT fabricate missing evidence.

### AGL-03 — CORE conformance

Execute the AGL CORE negative and positive tests against the ABOS governance adapters.

Minimum cases:

- allowed action executes;
- unauthorized capability is blocked;
- DENY prevents execution;
- approval requirement blocks autonomous execution;
- escalation blocks normal execution;
- authorization is linked to execution evidence;
- failed/blocked actions leave evidence;
- replay reconstructs observable execution.

### AGL-04 — Execution Graph conformance

Formalize:

- graph reference integrity;
- forward traversal;
- backward reconstruction;
- authorization/execution linkage;
- evidence linkage;
- missing-data semantics;
- external provenance/telemetry references;
- measurement references and processing-volume semantics;
- explicit missing-data semantics (missing is not zero).

### AGL-05 — Runtime measurement and economics

Formalize the generic measurement path:

`USE CASE → EXECUTION → PROCESSING VOLUME → MEASUREMENT → NORMALIZED UNIT → AGGREGATE → ECONOMIC METRIC`

The provider may use processing volume, execution complexity and evidence-related governance cost in its own risk/economics model. AGL records the evidence basis; it does not determine legal liability, insurance decisions or commercial pricing.

### AGL-06 — MCP governance mapping

Document the exact mapping:

`MCP request → APL decision → tool invocation → AEL evidence`

### AGL-07 — A2A governance mapping

Document the exact mapping:

`A2A request → identity/delegation/policy → task execution → AEL evidence`

### AGL-08 — Security & Trust

Map established mechanisms for:

- workload identity;
- credentials;
- certificates;
- signatures;
- revocation;
- integrity;
- trust state.

### AGL-09 — SER

Define the **Service Execution Record (SER)** as the normalized record for one governed service execution.

Conceptual sections:

`service, authority, mission, actors, execution, graph, authorization, inputs, environment, interventions, outputs, incidents, evidence, provenance`

### AGL-10 — Reference implementation

ABOS remains the first reference implementation.

The reference implementation MUST demonstrate actual execution evidence before claiming conformance.

### AGL-11 — Non-ABOS validation

Test the generic graph against at least one non-ABOS implementation.

This is important for demonstrating that AGL is not simply an ABOS-specific architecture renamed as a generic standard.

## 4. GitHub Project mapping

Recommended flow:

`BACKLOG → FOUNDATION → SPECIFICATION → VALIDATION → REFERENCE IMPLEMENTATION → INTEGRATIONS → DONE`

## 5. Source-of-truth rule

AGL public specifications are authoritative for generic AGL concepts.

ABOS documents are historical/design source material and the first reference implementation.

External standards remain authoritative for their own semantics.

When AGL maps an external standard, the mapping belongs to AGL; the underlying standard is not redefined by AGL.

## 6. What is not AGL core

The following remain outside generic AGL:

- aircraft identity
- ATI
- valuation
- aviation marketplace
- aviation intelligence graph
- ABOS-specific data models
- ABOS-specific endpoints
- ABOS commercial logic
