# AGL-01: APL Core Specification v1.0-rc1

Status: Release candidate
Scope: AGL APL Core
Source lineage: RFC-001 ABOS Protocol Language (APL) Core Specification v0.1, reconciled against the ABOS governance runtime and AGL mappings.

## 1. Purpose

APL is the governance layer that determines whether an actor is authorized to perform a consequential operation.

Core invariant:

**Authorization precedes execution. Evidence follows execution.**

## 2. Core model

`Identity → Capability → Permission/Authority → Policy → Decision → Execution → Evidence`

## 3. Actor identity

A governed actor has a stable identifier and sufficient metadata to distinguish the actor from the underlying model.

Reference fields:
- `id`
- `type`
- `name`
- `version`
- `provider`

An implementation may use an `apl://` namespace or another stable namespace.

## 4. Capability

A capability describes what an actor is technically able to perform. Capability is not authority.

Reference capabilities include `READ`, `QUERY`, `ANALYZE`, `GENERATE`, `CREATE`, `UPDATE`, `EXECUTE`, `TRANSACT`, `VERIFY`, `AUDIT`.

## 5. Permission and authority

A permission grants bounded authority over a capability.

`Permission = Capability + Scope + Conditions`

Scope may include target/resource, action, data/source boundary, time/validity and contextual constraints.

Least privilege is the default.

## 6. Delegation

Authority may be delegated.

A delegation identifies:
- delegator;
- delegatee;
- capability/action;
- scope;
- constraints;
- validity;
- delegation identifier.

Delegation must not expand the delegator's authority:

`Delegatee authority ⊆ Delegator authority`

## 7. Policy evaluation

Policy evaluation may consider actor identity, capability, permission, target/resource, delegation chain, trust, autonomy, risk/context, human-approval requirements, policy version and data/source requirements.

## 8. Decisions

The interoperable vocabulary is:
- `ALLOW`
- `DENY`
- `REQUIRE_HUMAN_APPROVAL`
- `ESCALATE`

A consequential operation must have an applicable decision before execution.

`DENY`, `REQUIRE_HUMAN_APPROVAL` and `ESCALATE` block normal consequential execution until their conditions are resolved.

## 9. Human approval

Human approval is an authorization event. Where required, execution remains blocked until applicable approval is recorded.

Approval evidence belongs to ADL.

## 10. Trust

Trust mechanisms may include identity verification, certificates, signatures, revocation, trust status and provider/developer verification.

Trust is a policy input. Trust status alone must not produce authorization.

## 11. Manifest

A manifest is declarative metadata describing identity, capabilities, permissions, trust metadata, protocol bindings and evidence requirements.

A manifest is not runtime authorization.

Authoritative sequence:

`Manifest → Request → Policy Evaluation → Decision → Execution Gate`

## 12. MCP governance boundary

`MCP request → APL decision → MCP invocation → result → ADL evidence`

Tool discovery is not authorization.

APL does not redefine MCP transport or tool schemas.

## 13. A2A governance boundary

`A2A request → identity → capability → delegation → policy → decision → task → ADL evidence`

APL does not redefine A2A transport, task lifecycle, agent cards or message formats.

## 14. Correlation

APL requires sufficient correlation to link authorization request, authorization decision, consequential execution and resulting evidence.

A stateful session is not required.

## 15. Evidence binding

ADL defines the evidence layer.

APL requires execution to be distinguishable from authorization. An authorization record is not proof that execution occurred.

## 16. Error vocabulary

Reference errors:
- `APL_AUTH_FAILED`
- `APL_PERMISSION_DENIED`
- `APL_SKILL_NOT_FOUND`
- `APL_VERSION_ERROR`
- `APL_POLICY_BLOCKED`
- `APL_APPROVAL_REQUIRED`
- `APL_ESCALATION_REQUIRED`

Implementations may add namespaced errors.

## 17. Enforcement

APL may be enforced at a gateway, proxy, middleware, sidecar, agent runtime, orchestration layer or equivalent policy enforcement point.

The location is implementation-specific; authorization-before-execution is normative.

## 18. Non-goals

APL does not define model reasoning, model/provider selection, domain schemas, marketplace behavior, cloud/database architecture, MCP transport, A2A transport or legal compliance by itself.

## 19. Conformance boundary

A CORE implementation must provide observable behavior demonstrating:
- stable actor identity;
- capability evaluation;
- permission/scope evaluation;
- policy decision;
- denial blocking execution;
- required human approval blocking execution until approval;
- escalation blocking normal execution;
- bounded delegation;
- authorization/execution correlation;
- execution/evidence linkage.

The current ABOS implementation is a reference adapter and is not declared fully CORE-conformant solely by source-level guards.

## 20. Open source-closure items

1. normative grammar and machine-readable request syntax are now defined in APL/AGL-01-APL-Grammar-v1.0-rc1.md and schemas/apl-request.schema.json;
2. generic delegation runtime conformance;
3. direct A2A runtime conformance;
4. complete correlation enforcement in every adapter.

These do not alter the reconciled semantic core.


## 21. Compact Source Alignment

The Library compact source set is now available and has been reconciled into this release candidate:
- `apl_core_skill.md`
- `apl_core_compact.pretty.json`
- `apl_core_compact.min.json`
- `apl_core_compact.min.json.gz`

The compact source confirms the following original APL concepts:
- APL identity namespace and manifest structure;
- capability/permission separation;
- permission scope expressed as action + resource + condition;
- autonomy levels A0-A4;
- audit levels APL-A0 through APL-A3;
- trust levels APL-T0 through APL-T4;
- identity verification, manifest signature, certificate, permission check, runtime monitoring and revocation as trust/security inputs;
- APL communication envelope fields: version, message ID, sender, receiver, intent, context, security and payload;
- canonical APL error vocabulary;
- explicit APL/MCP/API layer separation.

ABOS-specific material in the compact source, including aviation namespaces, aircraft objects, ATI Passport, ABOS agent names, transaction-specific deny defaults and ABOS MVP build order, remains outside generic AGL Core.

The compact source therefore closes the previous `compact-pack unavailable` source gap. It does not by itself establish runtime conformance.

## 22. Source-Closure Status

The compact source is now considered part of the AGL-01 source set. The remaining open items are:
1. normative grammar and machine-readable request syntax closure is complete;
2. generic delegation runtime conformance;
3. direct A2A runtime conformance;
4. complete correlation enforcement in every adapter.
