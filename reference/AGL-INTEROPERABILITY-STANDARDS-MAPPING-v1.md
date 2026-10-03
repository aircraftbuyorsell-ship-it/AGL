# AGL — Interoperability & Standards Mapping v1

## Purpose

AGL should not replace established standards. It should provide a common governance, execution, evidence and reconstruction contract that can consume, reference, validate and export data from them.

**API / SDK availability is a positive implementation criterion, but not a requirement for every standard.** A standard may contribute a vocabulary, schema, policy model or compliance control without exposing a runtime API.

## AGL integration pattern

```
External standard / protocol
        ↓
Adapter / mapper / reference
        ↓
AGL Execution Graph
        ↓
APL authorization
        ↓
Governed execution
        ↓
AEL evidence
        ↓
Reconstruction / claim / incident
```

The preferred rule is:

> **Use the external standard as the source of semantics or interoperability. Use AGL to connect it to a governed execution record.**

## Standards matrix

| Standard / mechanism | Domain | AGL layer | API / machine access | AGL artifact | Target integration | Status |
|---|---|---|---|---|---|---|
| W3C PROV | provenance | AEL / Graph | PROV-JSON / PROV-JSON-LD serializations and machine-readable schemas | provenance mapping | Export/import provenance entities, activities, agents and relations | REFERENCE |
| OpenTelemetry | telemetry | Execution / AEL | OTLP plus SDK/API ecosystem | telemetry refs | Map trace/span/log/metric context to execution_id and evidence | ADAPTER |
| OpenLineage | data/process lineage | Graph / AEL | HTTP/JSON event API and client ecosystem | lineage refs | Map run/job/dataset lineage into graph edges and evidence | ADAPTER |
| MCP | agent ↔ tool | Execution / Security | MCP protocol + SDK ecosystem | tool invocation mapping | Govern MCP tool discovery/invocation through APL and record evidence in AEL | ADAPTER |
| A2A | agent ↔ agent | Execution / Security | protocol + SDK ecosystem | agent interaction mapping | Govern remote-agent delegation/task exchange and record execution lineage | ADAPTER |
| SPIFFE | workload identity | Security & Trust | Workload API / SVID | identity refs | Bind workload identity to agent/service/execution records | ADAPTER |
| SLSA / in-toto | software/build provenance | Security / AEL | provenance attestations and schemas | build provenance refs | Link deployed code/build provenance to execution | ADAPTER |
| ODRL | policy / rights | APL | machine-readable policy vocabulary | policy mapping | Map permission/prohibition/duty constraints into authorization context | MAPPING |
| NIST AI RMF | AI governance | Governance | machine-readable supporting resources where applicable; primarily framework/control reference | control mapping | Map AGL evidence to governance/risk controls | MAPPING |
| ISO/IEC 42001 | AI management system | Governance | standard text is licensed; implementation uses control mapping rather than copied text | control mapping | Map AGL evidence to an organization's AI management controls | MAPPING |
| EU AI Act | regulation | Governance / Compliance | machine-readable EU legal publications and legal-data infrastructure | regulatory mapping | Map applicable obligations to evidence/control references; no legal interpretation in AGL core | MAPPING |
| Gaia-X | digital trust / data ecosystem | Security / Policy / Federation | specifications, schemas and ecosystem APIs vary by component | trust/policy mapping | Reference identity, policy, trust and service-composition mechanisms | MAPPING |

## API-first implementation rule

Where an official or stable machine interface exists, AGL should prefer it over scraping or manual transcription.

Priority:

1. **Official API / protocol**
2. **Official SDK / schema**
3. **Official machine-readable serialization**
4. **Official registry / structured dataset**
5. **Documented manual mapping**
6. **Web scraping only as a last resort**

The absence of an API does **not** make a standard unusable. For example, ISO/IEC 42001 is primarily a management-system standard; AGL should map controls and evidence rather than attempt to treat the standard itself as a runtime API.

## Recommended adapter contracts

### 1. OpenTelemetry → AGL

Input:
- trace_id
- span_id
- service.name
- deployment/environment attributes
- timestamps
- logs
- metrics

AGL output:
- execution_id correlation
- execution timing
- runtime evidence
- measurement references
- trace/evidence external references

Core invariant:

`telemetry → execution → measurement → evidence`

OpenTelemetry already defines propagation mechanisms such as W3C Trace Context and provides APIs/specifications for traces, metrics and logs.

### 2. OpenLineage → AGL

Input:
- job/run
- dataset
- input/output lineage
- facets

AGL output:
- data/process graph nodes
- consumes / produces / derived_from edges
- lineage evidence

Core invariant:

`data lineage → execution graph → evidence`

### 3. W3C PROV → AGL

Input:
- Entity
- Activity
- Agent
- provenance relations

AGL output:
- normalized execution/evidence graph
- provenance export

Core invariant:

`PROV semantics → AGL reconstruction`

PROV should remain a provenance interoperability layer; AGL should not redefine PROV.

### 4. MCP → AGL

Input:
- tool/resource/prompt interaction
- caller identity
- tool arguments
- result/error

AGL output:
- governed tool invocation
- APL authorization decision
- execution edge
- AEL evidence

Core invariant:

`MCP request → APL decision → execution → AEL evidence`

### 5. A2A → AGL

Input:
- agent identity
- task/message interaction
- delegation
- result/status

AGL output:
- agent-to-agent execution edge
- authorization/delegation evidence
- task/result lineage

Core invariant:

`A2A interaction → APL authority → execution → AEL evidence`

### 6. SPIFFE → AGL

Input:
- SPIFFE ID
- SVID / workload identity
- Workload API identity material

AGL output:
- authenticated service/agent identity reference
- identity-to-execution binding

Core invariant:

`workload identity → authority → execution`

### 7. SLSA / in-toto → AGL

Input:
- build provenance
- artifact identity
- builder
- source revision
- build metadata

AGL output:
- code_artifact provenance
- deployment provenance
- execution-to-build linkage

Core invariant:

`source → build → artifact → deployment → execution`

### 8. ODRL → AGL

Input:
- permission
- prohibition
- duty
- party
- asset
- constraint

AGL output:
- policy reference
- APL policy evaluation context
- authorization evidence

Core invariant:

`policy → authorization decision → execution`

### 9. Governance / regulatory mappings

NIST AI RMF, ISO/IEC 42001, EU AI Act and Gaia-X should be treated primarily as **control, trust, policy or compliance mapping targets**, not runtime protocols.

AGL records:
- applicable framework/control reference
- evidence supporting the control
- execution(s) covered
- evidence state
- mapping version
- source reference

AGL does not itself declare legal compliance.

## Common AGL external reference

The existing execution graph already provides a generic `external_refs` mechanism. Prefer that over adding one bespoke field for every ecosystem.

Example:

```json
{
  "external_refs": [
    {
      "system": "opentelemetry",
      "type": "trace",
      "id": "trace-123"
    },
    {
      "system": "openlineage",
      "type": "run",
      "id": "run-456"
    },
    {
      "system": "spiffe",
      "type": "workload_identity",
      "id": "spiffe://example.org/agent/abos"
    },
    {
      "system": "slsa",
      "type": "provenance",
      "id": "attestation-789"
    }
  ]
}
```

Exact field shape must follow the current AGL schema before implementation.

## ABOS reference implementation

The first real implementation target is the ABOS governed runtime.

Target chain:

```
ABOS SERVICE
  ↓
SPIFFE / identity
  ↓
APL authorization
  ↓
MCP / A2A interaction
  ↓
OpenTelemetry runtime telemetry
  ↓
OpenLineage / PROV provenance
  ↓
AGL Execution Graph
  ↓
AEL evidence
  ↓
Measurement
  ↓
Reconstruction
  ↓
Claim / Incident / Service Execution Report
```

This keeps ABOS-specific aircraft and valuation semantics outside the generic AGL core.

## Licensing and source discipline

- AGL may reference external standards and map to them.
- Do not copy proprietary ISO/IEC standard text into the repository.
- Do not present a framework mapping as certification or legal compliance.
- Prefer official schemas, APIs, protocol specifications and registries.
- Store source URL, version and mapping version with implementation metadata where appropriate.
- Keep external semantics attributable to the originating standard.

## Implementation sequence

### Phase 1 — machine interfaces
1. OpenTelemetry correlation
2. OpenLineage events
3. PROV export/import
4. MCP governed invocation
5. A2A governed interaction

### Phase 2 — trust and provenance
6. SPIFFE identity binding
7. SLSA/in-toto build provenance
8. ODRL policy mapping

### Phase 3 — governance mappings
9. NIST AI RMF
10. ISO/IEC 42001
11. EU AI Act
12. Gaia-X

### Phase 4 — ABOS CORE conformance

Execute the adapters against a real ABOS governed execution and prove:

`IDENTITY → AUTHORITY → POLICY → DECISION → EXECUTION → TELEMETRY → EVIDENCE → RECONSTRUCTION`

## Current conclusion

AGL should be an **integration and reconstruction layer**, not a competing replacement for the standards above.

The strongest technical differentiator is the ability to connect heterogeneous external evidence into one execution-oriented graph and reconstruct:

`SERVICE → AUTHORITY → EXECUTION → OUTCOME → EVIDENCE → CLAIM / INCIDENT`

API and SDK access should accelerate implementation wherever available, while standards without runtime APIs remain valid mapping targets.
