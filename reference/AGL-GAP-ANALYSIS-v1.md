# AGL Gap Analysis v1

**Status:** Working baseline  
**Date:** 2026-10-03  
**Scope:** Evidence-based comparison of AGL against adjacent standards and frameworks.

## 1. Purpose

This document records the current evidence-based position of AGL.

AGL is **not** claiming that the individual mechanisms described by AGL are new. Many of them already exist in established standards, specifications, observability systems, provenance models, policy languages, security frameworks, and AI governance frameworks.

The question is narrower:

> Does an existing standard already provide a single, implementation-neutral model for reconstructing an autonomous or agentic service execution end-to-end across service expectations, authorization, actors, agents, orchestration, pipelines, workflows, tasks, skills, tools, models, code, data, environment, execution, outcomes, evidence, incidents, and responsibility analysis?

Current research has not identified such a single framework.

This is a **gap hypothesis**, not a claim that no related implementation exists anywhere.

## 2. AGL positioning

Current working definition:

> **AGL is a governance and evidence layer for reconstructing autonomous and agentic service execution across actors, agents, workflows, tools, models, software, data, policies, environments and outcomes.**

AGL should complement rather than replace existing standards.

### Existing interoperability layers

- **MCP** — agent ↔ tool interoperability
- **A2A** — agent ↔ agent interoperability

### AGL governance layers

- **ADL — Agent Definition Language** — defines the agent
- **APL — Agent Policy Layer** — determines what the agent may do
- **AEL — Agent Evidence Layer** — proves what happened
- **Security & Trust** — identity, credentials, trust and integrity
- **Relationship / Dependency / Composition Model** — describes how service components depend on and compose with each other
- **Execution Model** — mission/use case → execution → outcome
- **Environment / Runtime Context** — operational conditions relevant to execution
- **Claims / Incident Evidence** — structured retrospective analysis based on preserved evidence

## 3. The core reconstruction problem

AGL is concerned with both forward execution and backward reconstruction.

### Forward

```
SERVICE / CONTRACT / SLA
        ↓
MISSION / USE CASE
        ↓
ORCHESTRATOR
        ↓
AGENT
        ↓
PIPELINE
        ↓
WORKFLOW
        ↓
TASK
        ↓
SKILL
        ↓
TOOL / BACKEND CODE
        ↓
MODEL / LLM / VLM
        ↓
INPUT / DATA / ENVIRONMENT
        ↓
AUTHORIZATION / POLICY
        ↓
EXECUTION
        ↓
OUTPUT / REAL-WORLD EFFECT
        ↓
EVIDENCE
```

### Backward reconstruction

```
OUTPUT / INCIDENT / CLAIM
        ↓
EXECUTION
        ↓
ACTOR / AGENT
        ↓
ORCHESTRATOR / PIPELINE
        ↓
WORKFLOW / TASK
        ↓
SKILL / TOOL
        ↓
CODE / VERSION
        ↓
MODEL / LLM / VLM
        ↓
INPUT / DATA
        ↓
ENVIRONMENT
        ↓
POLICY / AUTHORIZATION
        ↓
SERVICE / CONTRACT / SLA
```

The desired property is:

> Given a consequential output, event, incident, or claim, the system can reconstruct the relevant execution chain and the evidence supporting each material step.

## 4. Relationship and dependency scope

AGL should model generic relationships rather than inventing a separate relationship type for every pair.

Examples include:

- Agent → uses → Skill
- Skill → invokes → Tool
- Skill → requires → Capability
- Workflow → contains → Task
- Pipeline → contains → Workflow
- Pipeline → depends_on → Pipeline
- Agent → participates_in → Workflow
- Agent → coordinates → Agent
- Orchestrator → coordinates → Agent
- Agent → uses_model → LLM/VLM
- Robot → controlled_by → Agent
- Human → supervises / approves / overrides → Agent
- Service → composed_of → Agent / Workflow / Pipeline
- Artifact → produced_by → Execution
- Output → derived_from → Inputs / Evidence

LLM/VLM should not automatically be classified as agents. They may be execution dependencies of an agent.

## 5. Comparison with existing standards

| Area | Existing standard/framework | Coverage relevant to AGL | AGL gap |
|---|---|---|---|
| General provenance | W3C PROV | Entities, activities, agents, derivation, provenance | Does not define agent-service governance or a complete autonomous execution contract |
| Runtime observability | OpenTelemetry | Traces, spans, logs, metrics; emerging GenAI/agent conventions | Observability is not the same as governance, authorization, contractual expectations, or responsibility analysis |
| Data/process lineage | OpenLineage | Jobs, runs, datasets, inputs/outputs and lineage events | Strong lineage model, but not a complete agentic service governance model |
| Agent ↔ tool | MCP | Standardized tool interoperability | Does not define end-to-end service execution governance |
| Agent ↔ agent | A2A | Agent Cards, tasks, messages, artifacts, lifecycle and HITL patterns | Agent collaboration can remain intentionally opaque; not a complete execution evidence graph |
| Workload identity | SPIFFE | Strong workload identity and attestation model | Identity alone does not reconstruct service execution |
| Software provenance | SLSA / in-toto | Build provenance, artifact integrity and supply-chain evidence | Primarily software/build provenance, not runtime service responsibility |
| Policy | ODRL | Permissions, prohibitions, duties, constraints and parties | Policy vocabulary does not by itself define agent runtime execution evidence |
| AI risk governance | NIST AI RMF | Governance, accountability, monitoring, risk management | Framework-level governance rather than a machine-readable execution lineage model |
| AI management system | ISO/IEC 42001 | Organizational AI management and governance | Management-system scope is broader/organizational; not a detailed execution graph |
| Regulation | EU AI Act | Logging, traceability, monitoring, incidents and lifecycle obligations for relevant AI systems | Regulatory requirements do not constitute a universal implementation-neutral execution graph |
| Digital trust/service composition | Gaia-X | Identity, credentials, service offerings, dependencies, policies and trust | Adjacent trust/composition model; runtime governance/evidence is not the complete target |
| Data rights/policy | ODRL | Machine-readable policy and obligations | Does not itself establish actual execution evidence |

## 6. Important conclusion from the comparison

The current evidence supports the following distinction:

### Already exists

The ecosystem already contains strong building blocks for:

- identity
- authorization
- policy
- agent interoperability
- tool interoperability
- telemetry
- provenance
- software provenance
- data lineage
- risk governance
- regulatory logging
- service trust
- human oversight

### Partially exists

There are substantial overlaps with:

- execution lineage
- workflow tracing
- agent tracing
- service composition
- policy enforcement
- provenance
- incident evidence

### Not yet identified as a single common model

The unresolved intersection is:

```
SERVICE / CONTRACT / SLA
        +
MISSION / USE CASE
        +
ACTOR / AGENT / ORCHESTRATOR
        +
PIPELINE / WORKFLOW / TASK / SKILL / TOOL
        +
MODEL / CODE / DATA
        +
POLICY / AUTHORIZATION
        +
ENVIRONMENT
        +
EXECUTION
        +
OUTPUT / REAL-WORLD EFFECT
        +
EVIDENCE / PROVENANCE
        +
INCIDENT / CLAIM
        +
RESPONSIBILITY ANALYSIS
```

AGL's potential contribution is therefore **integration and formalization of this intersection**, not replacement of the underlying standards.

## 7. AGL should reuse existing standards

AGL should avoid reinventing mechanisms that are already well specified.

Working mapping:

```
AGL
 │
 ├── Identity / Trust
 │      └── SPIFFE / OAuth / OIDC / VC where appropriate
 │
 ├── Policy
 │      └── ODRL / existing authorization mechanisms
 │
 ├── Provenance
 │      └── W3C PROV
 │
 ├── Runtime telemetry
 │      └── OpenTelemetry
 │
 ├── Data / process lineage
 │      └── OpenLineage
 │
 ├── Software provenance
 │      └── SLSA / in-toto
 │
 ├── Agent ↔ Tool
 │      └── MCP
 │
 ├── Agent ↔ Agent
 │      └── A2A
 │
 └── AI governance
        └── NIST / ISO / applicable regulation
```

AGL should define the relationships, governance semantics, execution record, evidence requirements, and reconstruction contract that connect these building blocks.

## 8. SEX Record

The working shorthand remains:

> **SEX = Service Execution**

> **SEX Record = Service Execution Record**

The formal specification should not depend on the mnemonic being understood by every audience. Enterprise, legal, regulatory and standards-facing documentation may use the full name **Service Execution Record (SER)** if necessary, while the project can retain SEX internally as the memorable shorthand.

A Service Execution Record should be capable of referencing:

- service
- contract / SLA
- use case / mission
- actors
- agents
- orchestrators
- pipelines
- workflows
- tasks
- skills
- tools
- models
- code and versions
- inputs and data
- policy
- authorization
- human intervention
- execution
- outputs
- environment
- deviations
- incidents
- evidence
- provenance
- claims

## 9. Responsibility analysis

AGL must distinguish evidence from legal conclusions.

A recorded failure does not automatically establish fault.

Possible causal classifications may include:

- defective input
- data quality issue
- retrieval error
- model limitation
- model error
- software defect
- prompt/policy error
- workflow error
- tool failure
- integration failure
- operator action
- human override
- unauthorized modification
- environmental condition
- hardware degradation
- communication failure
- unknown

AGL can preserve and analyze evidence relevant to these categories without making an automatic legal determination of liability.

## 10. Robots and physical systems

The same execution model can extend beyond software-only agents.

A physical execution chain may be:

```
MISSION / USE CASE
        ↓
ORCHESTRATOR
        ↓
AGENT
        ↓
LLM / VLM / PLANNER
        ↓
PIPELINE / WORKFLOW
        ↓
SKILL
        ↓
ROBOT / TOOL
        ↓
PERCEPTION / MOVEMENT / MANIPULATION
        ↓
REAL-WORLD EFFECT
        ↓
EVIDENCE
```

Relevant runtime context can include:

- temperature
- humidity
- rain / snow
- wind
- dust
- UV
- corrosive exposure
- terrain
- lighting
- electromagnetic conditions
- network availability
- human density
- obstacles
- battery state
- operating hours
- actuator condition
- sensor condition
- maintenance history
- hardware version
- software version
- exposure history

Manufacturer operating envelopes and expected service life can then be represented as declared constraints and compared with observed execution conditions.

A failure at a given operating hour is therefore evidence for analysis, not automatic proof of manufacturer, operator, software or model fault.

## 11. Certificate concept

An **AGL Certificate** should certify conformance to defined AGL governance/evidence requirements.

It should not imply:

- zero failures
- zero hallucinations
- perfect safety
- legal immunity
- guaranteed correctness
- automatic absence of liability

A certificate can instead attest to defined properties such as:

- identity controls
- policy enforcement
- authorization gates
- execution lineage
- evidence capture
- integrity controls
- version traceability
- conformance test results
- defined human-oversight controls

## 12. Current research conclusion

As of 2026-10-03:

> **AGL should be treated as a candidate integration specification at the intersection of agent governance, execution lineage, provenance, observability, policy, trust, and service accountability.**

The research does **not** justify the claim:

> "Nobody does this."

The research **does** justify the more precise working statement:

> **Existing standards solve substantial portions of the problem, but the current research has not identified one common, implementation-neutral standard that defines the complete end-to-end governance and evidence reconstruction model described by AGL.**

This statement remains subject to further research.

## 13. Next research phase

The next step is a detailed **AGL Gap Matrix v1** with one row per concrete AGL requirement:

1. ADL
2. APL
3. AEL
4. Relationship / Dependency Graph
5. Agent identity
6. Capability
7. Authorization
8. Delegation
9. Policy decision
10. Mission
11. Execution
12. Pipeline
13. Workflow
14. Task
15. Skill
16. Tool
17. Model / LLM / VLM
18. Code / version
19. Input / data
20. Environment
21. Human intervention
22. Output
23. Provenance
24. Evidence integrity
25. Incident
26. Claim
27. Responsibility analysis
28. Service Execution Record
29. Service Execution Report
30. AGL Certificate

Each row will be classified:

- **FULL** — existing standard covers the requirement directly
- **PARTIAL** — existing standard covers only part
- **COMPLEMENTARY** — another standard should be reused
- **GAP** — AGL-specific definition appears necessary
- **OPEN** — insufficient evidence; further research required

## Primary references

- W3C PROV — https://www.w3.org/TR/prov-overview/
- OpenTelemetry GenAI — https://opentelemetry.io/docs/specs/semconv/gen-ai/
- OpenLineage — https://openlineage.io/
- MCP — https://modelcontextprotocol.io/
- A2A — https://a2a-protocol.org/
- SLSA — https://slsa.dev/
- ODRL — https://www.w3.org/TR/odrl-model/
- NIST AI RMF — https://www.nist.gov/itl/ai-risk-management-framework
- ISO/IEC 42001 — https://www.iso.org/standard/42001.html
- EU AI Act — https://eur-lex.europa.eu/
- Gaia-X Trust Framework — https://gaia-x.eu/
