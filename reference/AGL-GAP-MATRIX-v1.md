# AGL Gap Matrix v1

**Date:** 2026-10-03  
**Status:** Research baseline  
**Classification:** FULL / PARTIAL / COMPLEMENTARY / GAP / OPEN

## Purpose

This matrix tests the concrete AGL requirements against existing standards and frameworks. It deliberately distinguishes an existing capability from a missing AGL-specific integration contract.

A GAP does not mean that no implementation exists. It means that the current research has not identified a sufficiently direct, common, implementation-neutral specification covering the requirement in the AGL sense.

## Matrix

| # | AGL requirement | Relevant existing standards | Classification | Finding |
|---:|---|---|---|---|
| 1 | ADL — agent definition | Established ADL specifications, A2A Agent Card, PROV Agent | FULL / COMPLEMENTARY | Public ADL specifications already provide machine-readable agent-definition semantics. AGL should reference/map to ADL rather than claim a new agent-definition language; AGL's contribution is the linkage from definition to policy, execution and evidence. |
| 2 | APL — policy layer | ODRL, OAuth/OIDC, policy engines | PARTIAL | Policy, permissions and identity mechanisms exist. AGL-specific binding of identity → capability → authority → policy → decision → execution remains broader. |
| 3 | AEL — evidence layer | W3C PROV, OpenTelemetry | PARTIAL | Provenance and telemetry are mature building blocks. AGL needs an evidence contract tied to governance decisions and reconstructable service execution. |
| 4 | Relationship / dependency graph | PROV, Gaia-X | PARTIAL | PROV models influence, delegation, derivation and responsibility; Gaia-X models service composition and dependsOn. AGL needs a common execution-oriented graph spanning agentic components. |
| 5 | Agent identity | A2A, SPIFFE, OAuth/OIDC | FULL / COMPLEMENTARY | Strong existing mechanisms exist. AGL should reference rather than replace them. |
| 6 | Capability | A2A Agent Card, MCP, authorization systems | FULL / COMPLEMENTARY | Capabilities are represented in agent/tool ecosystems. AGL must bind them to authorization and execution evidence. |
| 7 | Authorization | OAuth/OIDC, MCP authorization, policy systems | FULL / COMPLEMENTARY | Authorization is well established. AGL adds the execution/evidence linkage. |
| 8 | Delegation | W3C PROV, OAuth/token delegation, authorization systems | PARTIAL | Delegation exists conceptually and technically, but AGL needs explicit bounded delegation semantics tied to consequential execution. |
| 9 | Policy decision | ODRL, Rego/policy engines, authorization systems | PARTIAL | Policy languages express rules; AGL requires a traceable decision record and its relation to the resulting execution. |
| 10 | Mission / use case | A2A Task, workflow systems, AI governance | PARTIAL | Tasks exist, but a mission/use-case object connecting service intent to downstream execution is not standardized across the ecosystem. |
| 11 | Execution | OpenTelemetry, OpenLineage, A2A Task | PARTIAL | Runtime events and tasks are represented. AGL requires a canonical execution object spanning governance context and outcome. |
| 12 | Pipeline | OpenLineage, workflow engines | FULL / COMPLEMENTARY | Pipeline lineage is well represented. AGL needs to connect it to agent/service governance. |
| 13 | Workflow | OpenTelemetry GenAI, workflow standards, A2A Task | FULL / COMPLEMENTARY | Workflow concepts and tracing exist. AGL's need is cross-layer linkage, not a new workflow engine. |
| 14 | Task | A2A Task, workflow engines | FULL / COMPLEMENTARY | A2A explicitly defines Task as a stateful unit of work with lifecycle and artifacts. |
| 15 | Skill | A2A Agent Card skills, agent frameworks | PARTIAL | A2A exposes skills for discovery, but a universal skill dependency/execution/evidence model is not established. |
| 16 | Tool | MCP | FULL / COMPLEMENTARY | MCP is the clear interoperability layer for tools. AGL should capture which tool was actually invoked and under which authorization/execution context. |
| 17 | Model / LLM / VLM | OpenTelemetry GenAI, model registries | PARTIAL | Model invocation is observable and model metadata can be managed. AGL needs model identity/version linked to the exact service execution and result. |
| 18 | Code / version | SLSA, in-toto, Git, SBOM ecosystems | FULL / COMPLEMENTARY | Software provenance is well established. AGL must connect build/deployment provenance to runtime execution. |
| 19 | Input / data | OpenLineage, W3C PROV | FULL / COMPLEMENTARY | Input/output lineage is mature. AGL needs the relevant data references in the service execution graph. |
| 20 | Environment | telemetry, infrastructure monitoring, Gaia-X resources | PARTIAL | Environment signals exist, but no common AGL execution record necessarily binds all material environmental conditions to an agentic service outcome. |
| 21 | Human intervention | A2A HITL patterns, AI governance, workflow systems | PARTIAL | Human approval/intervention is supported in multiple systems. AGL needs standardized evidence of who intervened, when, under what authority, and what changed. |
| 22 | Output / real-world effect | A2A Artifact, PROV Entity | PARTIAL | Digital outputs are represented. Physical/organizational real-world effects require a broader execution/evidence model. |
| 23 | Provenance | W3C PROV | FULL / COMPLEMENTARY | PROV is a mature generic provenance model. AGL should map to it rather than create a competing provenance theory. |
| 24 | Evidence integrity | SLSA, signed artifacts, VC ecosystems, audit systems | PARTIAL | Integrity mechanisms exist. AGL needs integrity tied to the complete service execution evidence set. |
| 25 | Incident | EU AI Act, NIST AI RMF, operational incident systems | PARTIAL | Incident governance exists, including regulatory obligations. AGL needs direct linkage from incident to execution lineage/evidence. |
| 26 | Claim | insurance/contract/incident systems, provenance | GAP / OPEN | The research has not identified a common machine-readable agentic service claim object that reconstructs the underlying execution evidence. |
| 27 | Responsibility analysis | W3C PROV responsibility/attribution, AI governance | PARTIAL | PROV explicitly supports responsibility and attribution. AGL's proposed causal classification and evidence-backed responsibility scope is broader and domain-oriented. |
| 28 | Service Execution Record | PROV, OpenTelemetry, OpenLineage, A2A, Gaia-X | GAP | Individual components exist, but no identified common record unifies contract/service context, agentic execution, policy, lineage, environment, outcome and evidence. |
| 29 | Service Execution Report | audit/incident/compliance reporting systems | GAP / OPEN | Reporting exists in many domains, but the AGL reconstruction-oriented report model has not been identified as a common standard. |
| 30 | AGL Certificate | ISO conformity/certification, Gaia-X labels/credentials, attestations | PARTIAL | Certification and attestations are mature concepts. AGL can define a conformance certificate for governance/evidence requirements without claiming legal liability or perfect correctness. |

## Key correction to the original gap hypothesis

The research shows that PROV and established ADL specifications cover more of the adjacent space than the initial hypothesis assumed.

PROV explicitly models Entity, Activity, Agent, responsibility, association, attribution, communication, delegation and derivation.

Gaia-X also explicitly models service composition and dependsOn, while service offerings can aggregate resources and specify policies and terms and conditions.

Therefore the AGL gap should NOT be stated as:

> No existing standard models dependencies, responsibility or provenance.

That statement would be false.

The more defensible gap is:

> No single identified standard in the reviewed set combines ADL-style agent definition, provenance, policy, identity, interoperability, lineage, observability, service composition and governance into one end-to-end, execution-oriented record and reconstruction contract for autonomous/agentic services.

## What AGL should NOT reinvent

AGL should not create replacement specifications for:

- provenance semantics already covered by W3C PROV
- telemetry already covered by OpenTelemetry
- data lineage already covered by OpenLineage
- tool interoperability already covered by MCP
- agent interoperability already covered by A2A
- software provenance already covered by SLSA/in-toto
- generic digital rights/policy semantics already covered by ODRL
- workload identity already covered by established identity systems

Instead, AGL should define how these references are connected to:

1. a service,
2. a mission/use case,
3. an authorized execution,
4. an execution graph,
5. an evidence set,
6. an outcome,
7. an incident/claim,
8. retrospective reconstruction.

## Candidate AGL execution graph

SERVICE
  |
  +-- CONTRACT / SLA
  +-- POLICY
  +-- MISSION / USE CASE
          |
          v
     AUTHORIZATION
          |
          v
     ORCHESTRATOR
          |
          v
        AGENT
       /  |  \
      /   |   \
 PIPELINE MODEL HUMAN
    |      |      |
 WORKFLOW  |   APPROVAL/
    |      |   OVERRIDE
   TASK    |
    |      |
  SKILL    |
    |      |
   TOOL -- CODE
    |
    v
  INPUT / DATA
    |
    v
 EXECUTION
    |
    +-- ENVIRONMENT
    +-- TELEMETRY
    +-- PROVENANCE
    +-- EVIDENCE
    |
    v
 OUTPUT / EFFECT
    |
    v
 INCIDENT / CLAIM
    |
    v
 RESPONSIBILITY ANALYSIS

## Important semantic boundary

An LLM or VLM is not automatically an AGL Agent.

Recommended relationships:

Agent --uses_model--> LLM / VLM
Agent --invokes-----> Tool
Orchestrator --coordinates--> Agent
Robot --controlled_by--> Agent
Human --approves/overrides--> Agent

This prevents the AGL graph from collapsing all computational components into agents.

## Status after v1

### Strongly existing building blocks

- identity
- authorization
- policy
- agent/tool interoperability
- agent/agent interoperability
- provenance
- telemetry
- data lineage
- software provenance
- AI governance
- service composition

### Main unresolved AGL layer

The current candidate AGL contribution is the cross-standard execution and evidence contract:

SERVICE
 → AUTHORITY
 → EXECUTION GRAPH
 → OUTCOME
 → EVIDENCE
 → RECONSTRUCTION
 → INCIDENT / CLAIM

This is the area requiring the next round of specification work and further prior-art research.

## Evidence basis

Primary references reviewed for this matrix include:

- W3C PROV / PROV-O
- OpenTelemetry GenAI conventions
- OpenLineage
- A2A
- MCP
- SLSA
- ODRL
- ISO/IEC 42001
- EU AI Act
- Gaia-X Trust Framework

The classification is a research assessment, not a legal opinion or a claim of absolute novelty.
