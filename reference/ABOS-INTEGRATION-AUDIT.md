# AGL — ABOS Integration Audit

## Snapshot

The current ABOS repository already contains a substantial APL/ADL governance runtime. The important finding is that **ABOS and AGL currently use the same acronyms for different concepts**.

This is a terminology/protocol-boundary issue, not a reason to rebuild the runtime.

## 1. Existing ABOS Runtime

The primary governance runtime is:

```
gateway/src/apl.js
```

It already implements:

- manifest lookup
- capability checks
- permission checks
- risk policy
- human-approval checks
- MCP tool exposure from manifests
- execution dispatch
- provenance/evidence envelope
- audit events
- hash chaining when `ABOS_AUDIT` KV is available

The runtime explicitly enforces the ordering:

```
governance checks
      ↓
execution
      ↓
evidence
      ↓
audit
```

This is strongly aligned with the AGL invariant:

> Authorization precedes execution. Evidence follows execution.

## 2. Existing ABOS Governance Gateway

ABOS also has:

```
base44/functions/governedSkillGateway/entry.ts
```

This gateway adds application-level governance around agent skills, including:

- authenticated human caller
- workflow/run validation
- agent/skill/workflow resolution
- permission checks
- prerequisite gates
- human approval checks
- retry policy
- execution
- evidence validation
- WorkflowStep recording
- WorkflowRun evidence/source/conflict accumulation
- AgentAuditLog recording

This is a second important implementation boundary and should be treated as an ABOS adapter/runtime component rather than duplicated inside AGL.

## 3. Existing ABOS Governance Entities

Relevant entities already exist:

- AgentApproval
- AgentAuditLog
- AgentEscalation
- WorkflowRun
- WorkflowStep
- AgentDefinition
- AgentSkill
- AgentWorkflow

These provide useful application storage for AGL concepts such as approval, audit, escalation and execution lifecycle.

## 4. Terminology Collision

### ABOS currently uses

**ADL = Agent Definition Language**

ABOS ADL describes the executor:

- identity
- skill
- capabilities
- permissions
- autonomy
- trust
- risk
- evidence requirements
- MCP tool schema

**APL = Agent Protocol Layer**

ABOS APL describes governed invocation and response behavior.

### AGL currently uses

**APL = Agent Policy Layer**

APL governs:

- authorization
- permission
- delegation
- policy decisions
- human approval
- escalation

**ADL = Agent Evidence Layer**

ADL records:

- execution
- evidence
- provenance
- approvals
- failures
- blocked actions
- correlation
- replay

## 5. Required Boundary

Do NOT copy the ABOS terminology into the generic AGL specification.

The generic AGL terminology remains authoritative:

```
APL = Policy / Authorization
ADL = Evidence / Execution Record
```

ABOS should become the reference implementation by introducing an explicit compatibility mapping.

## 6. Compatibility Mapping

| Current ABOS concept | AGL concept |
|---|---|
| ABOS ADL manifest | AGL agent/capability manifest + policy inputs |
| ABOS APL request | AGL policy authorization request |
| ABOS APL response | AGL governed response envelope |
| AgentApproval | AGL human approval event |
| AgentAuditLog | AGL evidence/audit record |
| AgentEscalation | AGL escalation event |
| WorkflowStep | AGL execution lifecycle evidence |
| WorkflowRun | AGL correlated execution context |
| provenance/sources | AGL provenance |
| hash-chained audit | AGL integrity boundary |

## 7. Important Architectural Finding

There are currently **two governance paths** in ABOS:

```
Path A
MCP / gateway
    ↓
gateway/src/apl.js
    ↓
ABOS executors
    ↓
audit/evidence
```

and

```
Path B
Base44 agent workflow
    ↓
governedSkillGateway
    ↓
invokeSkill / Base44 function
    ↓
WorkflowStep + WorkflowRun + AgentAuditLog
```

These should not be duplicated.

The target architecture should make them two ABOS adapters implementing the same AGL governance contract.

## 8. Current AGL Conformance Position

### CORE

The ABOS runtime visibly demonstrates most CORE primitives:

- identity
- capabilities
- permissions
- policy blocking
- human approval mechanism
- execution evidence
- correlation
- provenance
- blocked/failed recording

### SECURE

The runtime contains several security controls:

- authentication at the Base44 governed gateway
- trust metadata in manifests
- approval enforcement
- deny-default actions
- audit recording
- hash chaining in the Cloudflare gateway when persistent KV exists

The exact production security boundary still needs implementation-level verification before claiming SECURE conformance.

### INTEGRATED

MCP integration is already explicitly represented by the ABOS gateway.

A2A integration exists conceptually in the ABOS architecture, but should be tested against the AGL A2A conformance vectors before claiming integrated conformance.

## 9. Next Implementation Step

Do not rebuild the ABOS governance layer.

Instead:

1. Treat `gateway/src/apl.js` as the first AGL runtime adapter.
2. Treat `governedSkillGateway` as the second AGL runtime adapter.
3. Define one small compatibility contract between them and AGL.
4. Add AGL conformance tests against the existing runtime.
5. Resolve the APL/ADL naming collision through documentation and compatibility aliases before changing production semantics.
6. Only then consider SDK/CLI work.

## Status

**AGL reference architecture:** defined.

**ABOS reference runtime:** already substantially present.

**Main gap:** formal AGL conformance boundary and acronym/semantic alignment.

**Recommended next artifact:** an ABOS AGL adapter contract plus the first executable CORE conformance tests.
