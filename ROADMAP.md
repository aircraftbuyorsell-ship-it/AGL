# AGL Roadmap — Document-to-Architecture Mapping

AGL is the implementation-neutral governance architecture above MCP and A2A.

> MCP connects agents to tools. A2A connects agents to agents. APL governs what they are allowed to do. ADL proves what happened.

## 1. Source documents

| Source | Relevant material | AGL destination | Status |
|---|---|---|---|
| RFC-001 APL Core v0.1 | identity, skills, permissions, communication, audit, trust, gateway, registry, certificate service, MCP | APL + ADL + MCP mapping | Extracted conceptually |
| ABOS Platform Specification v1.0 | identity, agent framework, capabilities, permissions, security, provenance, audit, conformance | APL + ADL + conformance | Extracted conceptually |
| ABOS Master Index | source-of-truth hierarchy, RFC lifecycle, terminology, implementation separation | AGL governance/document model | Extracted conceptually |
| RFC-003 AIGS material | aircraft graph, ownership, maintenance, market events, agents | ABOS reference implementation | Keep outside AGL core |

## 2. What already exists in AGL

### APL
The current APL layer covers:
- identity
- capabilities
- authorization
- delegation
- policy evaluation
- workflow constraints
- human approval
- escalation

Decision states:
- `ALLOW`
- `DENY`
- `REQUIRE_HUMAN_APPROVAL`
- `ESCALATE`

### ADL
The current ADL layer covers:
- actor/delegation chain
- execution trace
- provenance
- evidence references
- decision records
- verification
- replay
- audit

### Protocol mappings
- MCP → capability registration, authorization before invocation, result/evidence recording
- A2A → agent identity, capability scope, delegation, authorization, policy, approval, escalation and audit

## 3. Document-derived work still to formalize

### AGL-01 — APL Core Specification
Extract the strongest reusable parts of RFC-001 into an implementation-neutral APL specification:
- Agent Identity
- Capability/Skill model
- Permission model
- Delegation
- Policy evaluation
- Gateway/enforcement boundary
- Registry interface
- certificate/trust interface
- versioning

**Do not copy ABOS aircraft/business semantics into the core.**

### AGL-02 — ADL Evidence Specification
Formalize the audit concepts already present across RFC-001 and the Platform Specification:
- actor chain
- execution event
- policy decision
- tool/agent invocation
- evidence reference
- provenance
- human approval
- verification
- replay metadata

### AGL-03 — Security & Trust
The RFC-001 roadmap explicitly identifies security/trust as the next major APL milestone:
- cryptographic agent identity
- certificates
- manifest signatures
- revocation
- trust chain
- zero-trust enforcement
- key rotation
- security events

AGL should express these as generic governance primitives rather than ABOS-specific infrastructure.

### AGL-04 — Conformance
The Platform Specification defines conformance testing across APL, MCP, SDK, events, security and AI agents.

AGL should define a small conformance model:
- policy decision conformance
- delegation conformance
- audit/evidence conformance
- MCP enforcement conformance
- A2A delegation conformance

### AGL-05 — Developer Surface
RFC-001 contains an SDK/CLI concept:
- create agent
- validate
- publish
- certify
- manifest generation
- permission/audit configuration

For AGL this becomes an implementation/reference tooling track, not part of the protocol itself.

### AGL-06 — ABOS Reference Implementation
ABOS remains the first domain-specific implementation:
- aviation agents
- aircraft intelligence
- ATI
- aircraft identity/passport
- AIGS
- ABOS MCP/API
- production gateway

These belong under `examples/` or a dedicated reference implementation area, not inside the generic AGL core.

## 4. Dependency order

```text
APL Core
   |
   +--> Security & Trust
   |
   +--> ADL Evidence
   |
   +--> MCP Governance Mapping
   |
   +--> A2A Governance Mapping
   |
   +--> Conformance Tests
   |
   +--> Reference SDK / CLI
   |
   +--> ABOS Reference Implementation
```

## 5. What is deliberately NOT part of AGL core

The ABOS documents also contain substantial platform-specific material:
- aircraft identity
- ATI
- valuation
- marketplace
- aviation intelligence graph
- ABOS business services
- aircraft data models
- ABOS-specific API endpoints

These remain reference-implementation material.

## 6. Roadmap board mapping

Recommended GitHub Project flow:

`BACKLOG → FOUNDATION → SPECIFICATION → REFERENCE IMPLEMENTATION → INTEGRATIONS → ABOS REFERENCE → DONE`

Initial work items:
1. AGL Foundation / terminology
2. APL Core Specification
3. ADL Evidence Specification
4. Security & Trust Framework
5. MCP Governance Mapping
6. A2A Governance Mapping
7. Conformance Test Model
8. Reference SDK / CLI
9. ABOS Reference Implementation

## 7. Source-of-truth rule

AGL public specifications should become the canonical implementation-neutral layer.

ABOS documents remain the historical/design source for the ideas and the reference implementation.

When an ABOS concept is generalized for AGL, the AGL specification becomes authoritative for the generic concept; ABOS-specific behavior remains in ABOS.
