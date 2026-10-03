# AGL Execution Graph v1

Status: Draft v0.1  
Scope: AGL governance and evidence model  
Purpose: define the minimum neutral graph needed to reconstruct an autonomous or agentic service execution.

## 1. Position

AGL does not replace existing interoperability, observability, provenance, lineage, identity, or policy standards.

It provides a governance-oriented execution graph that connects those existing signals into one reconstructable service execution record.

The target reconstruction is:

SERVICE
→ AUTHORITY
→ EXECUTION GRAPH
→ OUTCOME
→ EVIDENCE
→ RECONSTRUCTION
→ INCIDENT / CLAIM

The graph MUST support both forward reconstruction (what happened next?) and backward reconstruction (why did this output happen?).

## 2. Design rule

AGL SHOULD reuse existing identifiers, events, provenance records, telemetry, policy objects, and attestations instead of copying their semantics.

Examples:

- W3C PROV: provenance, entities, activities, agents, delegation and responsibility.
- OpenTelemetry: runtime traces, spans and GenAI/tool/workflow telemetry.
- OpenLineage: jobs, runs, datasets, lineage and parent-run hierarchy.
- A2A: agent identity, tasks, contexts and artifacts.
- MCP: tool interoperability and tool invocation.
- SPIFFE: workload identity and verifiable workload credentials.
- SLSA/in-toto: software/build provenance.

AGL adds the cross-domain governance relationship and reconstruction contract.

## 3. Minimum graph nodes

An implementation MAY support more node types, but the following semantic classes are the minimum useful set.

| Node | Purpose |
|---|---|
| Service | Contracted or offered service being executed |
| Authority | Contract, SLA, policy or delegated authority governing the service |
| Mission | Requested objective/use case |
| Execution | One concrete execution instance |
| Actor | Human, organization, service, agent or physical system participating in execution |
| Agent | Autonomous/software agent participating in execution |
| Orchestrator | Component coordinating agents or execution units |
| Pipeline | Higher-level execution composition |
| Workflow | Ordered/conditional execution composition |
| Task | Concrete unit of work |
| Skill | Reusable agent capability |
| Tool | External/internal callable capability |
| Model | LLM, VLM or other model used by an agent |
| CodeArtifact | Versioned executable/configuration artifact |
| Data | Input, retrieved data, intermediate data or output data |
| Environment | Runtime and physical operating context |
| Policy | Rule set applied to the execution |
| AuthorizationDecision | Allow, deny, approval or escalation decision |
| HumanIntervention | Human approval, override, correction or intervention |
| OutputEffect | Produced artifact, response or real-world effect |
| Evidence | Evidence proving an execution fact |
| Incident | Observed deviation, failure or unexpected event |
| Claim | Post-execution assertion requiring evidence/review |

## 4. Generic relationship model

AGL SHOULD use a generic typed relationship rather than defining a separate schema for every pair.

Conceptual form:

`source --[relation]--> target`

Minimum relation vocabulary:

- `contains`
- `uses`
- `invokes`
- `depends_on`
- `composes`
- `coordinates`
- `parent_of`
- `child_of`
- `produces`
- `consumes`
- `derived_from`
- `authorized_by`
- `constrained_by`
- `approved_by`
- `overridden_by`
- `delegated_by`
- `executed_by`
- `runs_on`
- `controlled_by`
- `caused`
- `observed_by`
- `evidenced_by`
- `claims_about`
- `authored_by`
- `modified_by`
- `deployed_as`

An implementation MAY introduce domain-specific relation types, but the core graph MUST remain interoperable with the generic model.

## 5. Important semantic boundaries

### Model is not automatically an Agent

An LLM/VLM is a model node unless it is explicitly represented as an autonomous agent.

Typical relation:

`Agent --uses_model--> Model`

### Tool is not automatically a Skill

A skill is an agent capability; a tool is a callable execution interface.

Typical relations:

`Agent --uses--> Skill`
`Skill --invokes--> Tool`

### Robot is not automatically an Agent

A robot can be an actor or physical system controlled by an agent.

Typical relation:

`Robot --controlled_by--> Agent`

### Orchestrator is not automatically an Agent

An orchestrator coordinates execution and may itself be software, an agent, or another service. Its identity is determined by the actual implementation.

## 6. Execution record

Every governed execution SHOULD have one stable execution identifier.

Minimum execution envelope:

- `execution_id`
- `service_id`
- `mission_id`
- `started_at`
- `ended_at` when complete
- `status`
- `initiator`
- `root_actor`
- `root_policy`
- `authorization_decision`
- `graph_root`
- `evidence_refs`

The execution graph is then a set of nodes and typed edges associated with `execution_id`.

## 7. Governance sequence

The minimum governed path is:

`IDENTITY → CAPABILITY → AUTHORITY → POLICY → DECISION → EXECUTION → EVIDENCE`

Authorization MUST be evaluated before the governed action is executed.

An ALLOW decision MUST NOT by itself imply that execution occurred.

Execution MUST generate or reference evidence sufficient to distinguish:

- authorized but not executed
- attempted
- executed successfully
- executed with deviation
- failed
- aborted
- denied
- escalated
- human-approved
- human-overridden

## 8. Forward reconstruction

Given a service or mission, an implementation SHOULD reconstruct:

`Service → Mission → Execution → Actor/Agent → Orchestrator → Pipeline → Workflow → Task → Skill → Tool/Model/Code → Data/Environment → OutputEffect → Evidence`

Not every execution contains every node.

The graph MUST preserve actual observed relationships rather than inventing missing intermediate nodes.

## 9. Backward reconstruction

Given an output, incident or claim, an implementation SHOULD reconstruct:

`OutputEffect → Execution → Task/Workflow/Pipeline → Agent → Skill/Tool/Model/Code → Inputs/Data → Environment → Policy → AuthorizationDecision → Actor/Authority`

Where provenance exists, the graph SHOULD also identify:

- artifact/version
- repository and commit
- model/provider/version
- tool version
- configuration
- deployment
- relevant telemetry
- evidence records
- human interventions.

## 10. Authoring provenance

AGL SHOULD distinguish runtime execution from creation or modification of the system being executed.

Example:

`Skill --authored_by--> Human`

or

`CodeArtifact --modified_by--> AIBuilder`

An AI-assisted authoring record SHOULD identify, where available:

- authoring actor
- AI provider
- model
- repository
- commit
- artifact digest
- generation/modification event
- human review
- deployment event.

AGL MUST NOT infer authorship solely from the presence of generated code.

## 11. Physical execution

For physical systems, `Environment` MAY contain operating conditions such as:

- temperature
- humidity
- precipitation
- wind
- dust
- UV
- terrain
- lighting
- electromagnetic conditions
- network availability
- human/obstacle density.

A physical system MAY additionally expose:

- operating hours
- battery/energy state
- actuator condition
- sensor health
- maintenance history
- hardware/software version
- exposure history.

This enables comparison of actual execution conditions with declared operating envelopes without automatically determining legal fault.

## 12. Responsibility analysis

AGL SHOULD record evidence relevant to responsibility analysis but SHOULD NOT make an intrinsic legal determination of liability.

Potential cause categories include:

- input/data defect
- retrieval error
- model limitation/error
- tool failure
- software defect
- workflow error
- configuration error
- policy error
- unauthorized modification
- human action/override
- environmental condition
- hardware degradation
- communication failure
- unknown.

A later analysis MAY map these facts to contractual, operational, insurance or legal responsibility frameworks.

## 13. Service Execution Record

The AGL Service Execution Record (SER) is the normalized record of one governed service execution.

Minimum conceptual sections:

`service`
`authority`
`mission`
`actors`
`execution`
`graph`
`authorization`
`inputs`
`environment`
`interventions`
`outputs`
`deviations`
`incidents`
`evidence`
`provenance`

The informal mnemonic `SEX = Service Execution` MAY be used in non-formal communication, but `Service Execution Record (SER)` is the recommended formal name.

## 14. Service Execution Report

A Service Execution Report is an analysis of one or more Service Execution Records.

It MAY answer:

- What was requested?
- What authority governed it?
- What actually executed?
- Which agents/components participated?
- Which data, tools and models were used?
- Which policy decisions occurred?
- Where did execution deviate?
- What evidence supports each material fact?
- What incident occurred?
- What cause candidates are supported or unsupported?
- What contractual/SLA conditions were met or breached?
- What responsibility scope can be evidenced?

The report MUST distinguish observed facts, inferred relationships and unresolved uncertainty.

## 15. Integrity and provenance

Evidence SHOULD be referenceable by stable identifiers and, where appropriate, protected by cryptographic integrity mechanisms.

AGL SHOULD reference existing provenance and attestation mechanisms rather than defining a competing software supply-chain provenance system.

The minimum useful integrity metadata is:

- evidence identifier
- producer
- creation time
- schema/specification version
- subject/execution reference
- content digest where applicable
- source/reference
- integrity/verification status.

## 16. Relationship to existing standards

AGL is not intended to replace:

- W3C PROV for provenance semantics.
- OpenTelemetry for telemetry and distributed traces.
- OpenLineage for data/job/run lineage.
- A2A for agent-to-agent communication.
- MCP for agent/tool interoperability.
- SPIFFE for workload identity.
- SLSA/in-toto for software provenance and attestations.
- ODRL or other policy languages for policy expression.
- AI governance standards such as ISO/IEC 42001 or NIST AI RMF.

The AGL graph is an integration and governance contract across these domains.

## 17. Candidate minimum graph

A minimal real execution can therefore be represented as:

`Service`
→ `Authority`
→ `Mission`
→ `Execution`
→ `Agent`
→ `Workflow`
→ `Task`
→ `Skill`
→ `Tool`
→ `OutputEffect`
→ `Evidence`

With optional branches:

`Agent → Model`
`Execution → Data`
`Execution → Environment`
`Execution → HumanIntervention`
`Execution → Incident`
`OutputEffect → Claim`

## 18. Conformance direction

A future AGL Execution Graph conformance suite SHOULD verify at minimum:

1. Every governed execution has a stable execution identity.
2. Authorization is recorded before governed execution.
3. An authorization ALLOW cannot be interpreted as execution evidence.
4. Executions reference their participating actors/components.
5. Material outputs reference their execution.
6. Evidence can be traced to the execution and its producer.
7. Parent/child execution relationships are preserved.
8. Model/tool/code/data/environment references are distinguishable.
9. Human interventions are explicit.
10. Missing information is represented as unknown/unavailable rather than silently fabricated.
11. The graph can be traversed both forward and backward.
12. Existing external provenance/telemetry identifiers can be referenced without semantic duplication.

## 19. Current conclusion

The strongest AGL candidate is not a new trace format, agent protocol, provenance language, identity system or policy language.

The candidate contribution is the normalized governance graph that connects:

`SERVICE → AUTHORITY → EXECUTION → COMPONENTS → OUTCOME → EVIDENCE`

and makes that graph reconstructable after the fact for operations, audit, incident analysis, quality, contractual review and claims.

This specification remains a draft until tested against concrete ABOS executions and at least one non-ABOS reference implementation.
