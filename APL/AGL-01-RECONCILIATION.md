# AGL-01 Reconciliation

Status: Reconciled draft
Scope: APL Core only
Date: 2026-10-03

## 1. Source set

Primary source: RFC-001 ABOS Protocol Language (APL) Core Specification v0.1 from the project Library.

Implementation sources:
- ABOS `gateway/src/apl.js`
- ABOS `protocol/ADL-APL-V1.md`

AGL sources:
- `APL/SPEC.md`
- `mappings/MCP.md`
- `mappings/A2A.md`
- `APL/AGL-01-APL-Core-Spec.md`
- `APL/AGL-01-APL-MCP-Model.md`

The requested `APL_core_compact_pack.zip` was not found in the searchable Library. No compact-pack-only semantics are promoted to normative status.

## 2. Reconciled core

The common semantic chain is:

`Identity → Capability → Permission/Authority → Policy → Decision → Execution → Evidence`

RFC-001, the existing ABOS gateway and the AGL model agree that governance checks precede consequential execution.

## 3. Normative boundary

AGL APL Core defines governance semantics, not transport semantics.

In scope:
- actor identity;
- capability;
- permission and scope;
- authority/delegation;
- policy evaluation;
- authorization decision;
- human approval/escalation;
- trust as policy input;
- invocation governance;
- authorization/execution correlation;
- protocol/error vocabulary;
- runtime enforcement boundary.

Out of scope:
- MCP transport;
- A2A transport/task/message formats;
- domain schemas;
- aviation concepts;
- model reasoning;
- cloud/database implementation;
- registry implementation details.

## 4. Manifest versus runtime authorization

A manifest is declarative metadata. It describes identity, capabilities, permissions, trust and protocol bindings.

A manifest does not prove that a permission is valid for a particular runtime request.

Authoritative sequence:

`Manifest/metadata → Runtime request → Policy evaluation → APL decision → Execution gate`

## 5. Delegation

RFC-001 contains multi-agent and authority concepts, while the current ABOS gateway does not expose a complete generic delegation-chain input.

AGL therefore defines delegation semantically without claiming full adapter implementation.

Minimum rule:

`Delegatee authority ⊆ Delegator authority`

A delegation identifies delegator, delegatee, capability/action, scope, constraints, validity and delegation identifier.

## 6. MCP

The ABOS implementation validates:

`MCP request → identity/capability/permission/policy → decision → invocation → evidence`

Tool discovery is capability discovery, not authorization.

MCP transport and tool schemas remain outside APL Core.

## 7. A2A

RFC-001 contains agent-to-agent communication concepts, but the current ABOS `apl.js` runtime is MCP/tool oriented.

AGL defines the governance envelope without redefining A2A transport:

`A2A request → identity → capability → delegation → policy → decision → task → evidence`

Direct A2A runtime conformance remains open.

## 8. Correlation and session

APL Core requires authorization and execution to be correlatable.

A stateful session is not required.

Minimum requirement:
- request/correlation identifier;
- linkage from authorization decision to execution;
- linkage from execution to evidence.

Persistent audit state is an implementation concern.

## 9. Trust

RFC-001 identity verification, certificates, signatures, revocation and trust levels are retained as trust inputs.

`TRUSTED` does not imply `ALLOW`.

## 10. Evidence boundary

Evidence remains an ADL concern.

APL requires:

`Authorization decision → execution lifecycle → evidence`

An authorization record alone is not proof that execution occurred.

## 11. Formal grammar

The Library RFC-001 source provides structured examples and protocol concepts but not a sufficiently complete formal ABNF grammar for verbatim normative adoption.

AGL-01 therefore does not invent ABNF.

## 12. Conformance impact

Observable APL Core tests must cover:
- identity;
- capability;
- permission/scope;
- policy decision;
- denial blocking execution;
- approval blocking until approval;
- escalation blocking normal execution;
- bounded delegation;
- correlation;
- execution/evidence linkage.

The current ABOS source-level guards cover only part of this set and must not be described as complete CORE conformance.

## 13. Final reconciliation status

| Area | Result |
|---|---|
| Identity | ALIGNED |
| Capability | ALIGNED |
| Permission | ALIGNED |
| Policy | ALIGNED |
| Runtime execution gate | ALIGNED |
| Manifest/runtime distinction | RESOLVED |
| Trust | ALIGNED WITH BOUNDARY |
| MCP governance | ALIGNED |
| A2A governance envelope | ALIGNED / runtime GAP |
| Delegation | DEFINED / adapter GAP |
| Correlation | DEFINED / adapter GAP |
| Evidence binding | ALIGNED |
| Formal grammar | OPEN |
| Compact-pack validation | OPEN |

## 14. Release position

AGL-01 can move to a v1.0 release-candidate specification because the semantic core is reconciled.

It must not claim compact-pack validation, full ABOS CORE conformance, direct A2A runtime conformance, or a formal ABNF grammar.
