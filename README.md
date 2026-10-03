# AGL — Agent Governance Layer

**The governance layer above MCP and A2A.**

AGL is an implementation-neutral governance and evidence architecture for reconstructing autonomous and agentic service execution across actors, agents, workflows, tools, models, software, data, policies, environments, outcomes and evidence.

> **MCP connects agents to tools. A2A connects agents to agents. ADL describes an agent. APL governs what may happen. AEL records what happened.**

## Core architecture

```
AGL
├── ADL — Agent Definition Language
│   └── agent identity, capabilities, declared boundaries
├── APL — Agent Policy Layer
│   └── authority, authorization, policy, delegation, approval
├── AEL — Agent Evidence Layer
│   └── execution evidence, provenance, audit, reconstruction
├── Security & Trust
│   └── identity, credentials, trust, integrity
├── MCP
│   └── agent ↔ tool interoperability
└── A2A
    └── agent ↔ agent interoperability
```

### Core invariant

`ADL → APL → EXECUTION → AEL`

Authorization precedes governed execution. Evidence follows execution.

## What AGL adds

AGL does not replace MCP, A2A, provenance, telemetry, lineage, identity, policy languages, or software provenance systems.

The AGL candidate contribution is the **cross-domain execution and evidence contract** that connects existing mechanisms into a reconstructable service execution:

```
SERVICE
  ↓
AUTHORITY
  ↓
EXECUTION GRAPH
  ↓
OUTCOME
  ↓
EVIDENCE
  ↓
RECONSTRUCTION
  ↓
INCIDENT / CLAIM
```

The graph supports both:

- **forward reconstruction** — what happened from service request to outcome;
- **backward reconstruction** — why a given output, incident or claim occurred.

## Existing standards AGL is designed to connect

- **ADL** — agent definition and declared boundaries
- **MCP** — agent/tool interoperability
- **A2A** — agent/agent interoperability
- **W3C PROV** — provenance
- **OpenTelemetry** — telemetry and traces
- **OpenLineage** — data/job lineage
- **SPIFFE** — workload identity
- **SLSA / in-toto** — software/build provenance
- **ODRL** — policy/rights semantics
- **NIST AI RMF / ISO/IEC 42001** — AI governance

AGL should reference and map to these mechanisms rather than recreate them.

## Specifications

- [Architecture](ARCHITECTURE.md)
- [APL Core Specification](APL/SPEC.md)
- [AEL Evidence Specification](AEL/SPEC.md)
- [Execution Graph](reference/AGL-EXECUTION-GRAPH-v1.md)
- [Runtime Observability](reference/AGL-RUNTIME-OBSERVABILITY-v1.md)
- [Measurement Unit](reference/AGL-MEASUREMENT-UNIT-v1.md)
- [Gap Analysis](reference/AGL-GAP-ANALYSIS-v1.md)
- [Gap Matrix](reference/AGL-GAP-MATRIX-v1.md)
- [Conformance Model](CONFORMANCE.md)
- [Roadmap](ROADMAP.md)
- [Current Checkpoint](CHECKPOINT-2026-10-03.md)

## Machine-readable artifacts

- `schemas/agl-execution-graph.schema.json`
- `schemas/ael-evidence-record.schema.json`
- `schemas/apl-agent-manifest.schema.json`
- `examples/agl-execution-graph.example.json`
- `examples/agl-measurement.example.json`
- `schemas/agl-measurement.schema.json`

## Reference implementation

ABOS (Aircraft Buy Or Sell) is the first reference implementation.

ABOS-specific aircraft, aviation, market, verification and valuation semantics remain outside the generic AGL core.

## Status

**Early open-source architecture — v0.1.x**

The execution graph, reconstruction path, and first-class processing measurement references are validated against the current example graph in CI. The next conformance step is execution against a real ABOS governed runtime.

## License

Apache License 2.0
