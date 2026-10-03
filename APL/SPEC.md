# APL Core Specification

**Status:** Draft
**Version:** 0.1.0
**Role:** Agent Policy Layer within AGL

## 1. Purpose

APL defines the governance contract for an AI agent before it performs a consequential operation. It answers:

- Who is acting?
- What capability is being requested?
- What authority has been delegated?
- What resource and context are in scope?
- Which policy applies?
- Is the operation allowed, denied, approved by a human, or escalated?

APL is model-independent and does not define how an AI model reasons.

## 2. Position in AGL

```text
Application / Agent
       |
       v
     A2A / MCP
       |
       v
      APL
  identity
  capability
  authorization
  delegation
  policy
  approval
  escalation
       |
       v
 governed execution
       |
       v
      ADL
 evidence / provenance / audit
```

**Authorization precedes execution. Evidence follows execution.**

## 3. Core Objects

### 3.1 Agent Identity

Every governed agent has a stable, versioned identifier and an associated provider or owner.

Required concepts:
- `id`
- `name`
- `version`
- `status`
- `provider`

The identity must be distinguishable from the underlying model.

### 3.2 Capability

A capability describes what an agent is technically able to do. Capability is not authority.

Examples of generic capability classes:
- `READ`
- `QUERY`
- `ANALYZE`
- `GENERATE`
- `CREATE`
- `UPDATE`
- `EXECUTE`
- `TRANSACT`
- `VERIFY`
- `AUDIT`
- `APPROVE`

Implementations may define domain-specific capabilities under a controlled namespace.

### 3.3 Permission

A permission grants bounded authority over a capability.

Conceptually:

`Permission = Capability + Scope + Conditions`

A permission should identify:
- action/capability
- target resource
- applicable conditions
- optional expiration
- optional delegation constraints

Least privilege is the default policy principle.

### 3.4 Delegation

An agent may act under authority delegated by another actor or agent.

A delegation record should identify:
- delegator
- delegatee
- delegated capability
- scope
- constraints
- validity period
- delegation identifier

Delegation must not silently expand the delegator's authority.

### 3.5 Policy

Policy determines whether a requested operation may proceed in its current context.

Policy evaluation may consider:
- agent identity
- capability
- permission
- target resource
- delegation chain
- trust state
- data/source requirements
- autonomy level
- risk/context
- human-approval requirements
- policy version

### 3.6 Policy Decision

The minimum interoperable decision vocabulary is:

- `ALLOW`
- `DENY`
- `REQUIRE_HUMAN_APPROVAL`
- `ESCALATE`

A decision should be bound to the evaluated request, policy version, actor and timestamp.

## 4. Agent Autonomy

Implementations may declare an autonomy level. AGL uses the following reference vocabulary:

- `A0` — informational
- `A1` — analytical
- `A2` — advisory
- `A3` — operational
- `A4` — autonomous within a defined policy domain

Autonomy is not permission. A high autonomy declaration does not grant authority by itself.

## 5. Human Oversight

Policies may require human intervention for defined actions or risk classes.

Reference modes:
- `AUTO`
- `ASSISTED`
- `HUMAN_REQUIRED`
- `FORBIDDEN`

Human approval is an authorization event and should therefore be recorded by ADL.

## 6. Trust and Identity

APL may consume an external trust mechanism for:
- identity verification
- developer/organization verification
- certificates
- manifest signatures
- revocation
- trust status

Trust is an input to policy evaluation; trust status alone does not authorize an action.

## 7. Manifest

An APL Agent Manifest is the machine-readable declaration of an agent's identity, capabilities, model metadata, permissions, trust metadata and audit requirements.

A minimal interoperable manifest is defined in `schemas/apl-agent-manifest.schema.json`.

The manifest MUST NOT be interpreted as proof that every declared permission is currently valid. Runtime authorization remains authoritative.

## 8. Enforcement Boundary

APL is enforced before a governed operation reaches its execution target.

For MCP:

`request → APL policy decision → MCP invocation → result → ADL evidence`

For A2A:

`request → identity/delegation/policy evaluation → A2A task/message → result → ADL evidence`

An implementation may enforce APL in a gateway, sidecar, middleware layer, agent runtime or equivalent control point.

## 9. Versioning

Agent identity, manifests and policies are versioned independently where practical.

A new agent version must not erase the identity or evidence history of a previous version.

Protocol-breaking changes require a new APL major version.

## 10. Error Vocabulary

Reference errors include:

- `APL_AUTH_FAILED`
- `APL_PERMISSION_DENIED`
- `APL_SKILL_NOT_FOUND`
- `APL_VERSION_ERROR`
- `APL_POLICY_BLOCKED`
- `APL_APPROVAL_REQUIRED`
- `APL_ESCALATION_REQUIRED`

Implementations may extend the vocabulary using namespaced error codes.

## 11. Security Requirements

A conforming implementation SHOULD:

1. authenticate the acting principal;
2. validate the requested capability;
3. evaluate permissions and scope;
4. validate delegation where present;
5. evaluate applicable policy;
6. enforce human approval where required;
7. reject expired or revoked authority;
8. record the decision in ADL;
9. prevent execution when the decision is `DENY`;
10. preserve sufficient identifiers to correlate execution evidence with the authorization decision.

## 12. Non-Goals

APL does not define:

- an AI model or model provider;
- model reasoning methodology;
- a domain-specific data model;
- a marketplace business model;
- a particular cloud provider;
- a particular database;
- legal compliance by itself;
- the transport semantics already defined by MCP or A2A.

## 13. Relationship to ABOS

ABOS is a reference implementation of these governance concepts in an aviation domain. Aviation-specific capabilities, resources, agents and policies MUST remain outside the generic APL core.

## 14. Source Lineage

This specification generalizes the governance concepts originally documented in RFC-001 ABOS Protocol Language (APL) Core Specification v0.1, including its milestones for identity, manifest, capability/permission, audit, communication and security/trust. The generic APL contract is now maintained as part of AGL.
