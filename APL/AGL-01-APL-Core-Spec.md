# AGL-01: APL Core Specification — Track A Extraction

Status: Draft extraction
Source: RFC-001 ABOS Protocol Language (APL) Core Specification v0.1

## 1. Scope

This track extracts the protocol/governance concepts from RFC-001 and removes ABOS/aviation semantics from the core contract.

APL in AGL is the policy/authority layer governing consequential agent operations. It answers:

- Who is acting?
- What capability is requested?
- What authority permits the action?
- What scope and conditions apply?
- What policy decision results?
- What evidence must bind the decision to execution?

Domain data, model behavior, MCP transport semantics, and aviation-specific objects remain outside AGL core.

## 2. Core model

Identity → Capability → Permission/Authority → Policy Evaluation → Decision → Execution → Evidence

The RFC-001 material separates agent identity from skill/capability, capability from permission, trust from authorization, protocol access from business/domain data, and audit from execution itself.

## 3. Identity

RFC-001 defines an APL identity namespace using an apl:// URI pattern and identifies an agent through a stable identifier, provider/developer metadata, version and manifest information.

AGL generalization:

- actor.id
- actor.type
- actor.name
- actor.version
- provider/issuer metadata
- protocol/version metadata

The concrete ABOS namespace is reference-implementation material.

## 4. Capability

A capability describes what an agent/skill can technically perform.

AGL rule:

Capability is not authority.

An advertised or declared capability does not by itself authorize execution.

## 5. Permission and authority

RFC-001 defines allowed and denied permissions and uses permission checks before execution.

AGL generalization:

Permission = capability + scope + conditions + policy context.

Authority MAY be delegated, but delegation cannot expand the authority of the delegator.

## 6. Policy evaluation

RFC-001 places identity, permission, skill discovery and policy checks before execution.

AGL canonical decisions:

- ALLOW
- DENY
- REQUIRE_HUMAN_APPROVAL
- ESCALATE

A consequential operation MUST NOT execute before an applicable authorization decision.

## 7. Trust

RFC-001 introduces identity verification, developer verification, certificates, signatures, trust levels and revocation.

AGL rule:

Trust is a policy input, not authorization.

A trusted identity may still be denied by capability, permission, scope, policy or approval requirements.

## 8. Evidence and audit

RFC-001 requires auditability around requests, decisions and outputs. AGL separates this into ADL.

Authorization is not proof that execution occurred.

The AGL binding is:

Authorization decision → execution event → evidence/provenance.

Failed and blocked operations are evidence-bearing events as well.

## 9. Communication and invocation

RFC-001 defines an APL request/message concept and describes agent-to-agent communication, context exchange, discovery and error handling.

Transport remains implementation-specific. MCP and A2A mappings define how the governance contract is carried at those boundaries.

## 10. Errors

RFC-001 identifies:

- APL_AUTH_FAILED
- APL_PERMISSION_DENIED
- APL_SKILL_NOT_FOUND
- APL_VERSION_ERROR
- APL_POLICY_BLOCKED

AGL retains these as compatibility error codes where useful, while generic policy results use the APL decision model.

## 11. Conformance requirements extracted

An implementation claiming AGL APL CORE compatibility SHOULD demonstrate:

1. stable actor identity;
2. declared capability;
3. permission/authority evaluation;
4. policy evaluation before consequential execution;
5. denial preventing execution;
6. human approval when required;
7. bounded delegation;
8. correlation between authorization and execution;
9. evidence after execution;
10. recording of blocked/failed actions.

## 12. Grammar status

RFC-001 contains structured JSON examples and protocol message concepts, but the supplied source does not establish a sufficiently formal, complete ABNF grammar for direct adoption as a normative AGL grammar.

Therefore this extraction does NOT invent ABNF.

A formal grammar is a v1.0 work item to be derived from the reconciled semantic model and validated against the implementation model.

## 13. ABOS reference boundary

Aircraft valuation, maintenance, marketplace and aviation namespaces are reference implementation material and MUST NOT become requirements of generic AGL core.

## 14. Source note

RFC-001 contains later milestone material covering registry, SDK, security and reference architecture. This track separates generic governance semantics from ABOS product architecture.
