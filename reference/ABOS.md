# AGL — ABOS Reference Implementation

## v0.1.0

ABOS is the first reference implementation of AGL.

The purpose of this implementation is to demonstrate that AGL governance can operate in a real production-oriented agent architecture while keeping the generic AGL specification implementation-neutral.

## 1. Reference Boundary

AGL provides the generic governance contract:

- identity
- capabilities
- permissions
- delegation
- policy decisions
- security and trust inputs
- execution evidence
- provenance
- audit and replay
- conformance

ABOS provides the application-specific implementation:

- aviation agents
- aviation data
- aircraft verification
- market intelligence
- valuation
- marketplace workflows
- ABOS APIs and services

ABOS-specific semantics MUST NOT be required by the generic AGL core.

## 2. Conceptual Architecture

```
ABOS Agents / Applications
          |
          v
     MCP / A2A
          |
          v
       AGL / APL
 identity / capability
 permission / delegation
 policy / approval
          |
          v
       Execution
          |
          v
       AGL / ADL
 trace / evidence
 provenance / audit
          |
          v
 ABOS Services / Data / APIs
```

## 3. ABOS Mapping

| AGL concept | ABOS reference |
|---|---|
| Agent Identity | ABOS agent identity |
| Capability | ABOS skill/tool capability |
| Permission | ABOS permission and scope |
| Delegation | ABOS agent delegation |
| Policy | ABOS governance/policy layer |
| Human approval | ABOS approval workflow |
| Trust | ABOS identity/security/trust mechanisms |
| Execution | ABOS agent/tool/API execution |
| Evidence | ABOS audit/evidence records |
| Provenance | ABOS source and data provenance |
| Replay | ABOS execution/audit reconstruction |

## 4. Example Governed ABOS Action

A user requests a consequential ABOS operation.

```
User
  ↓
ABOS Agent
  ↓
Identity / Security
  ↓
APL capability + permission check
  ↓
Policy decision
  ↓
MCP / A2A / API execution
  ↓
ABOS result
  ↓
ADL evidence
```

The aviation meaning of the operation is outside the AGL core.

## 5. Reference Implementation Requirements

The ABOS reference implementation SHOULD demonstrate:

1. AGL agent identity
2. capability declaration
3. scoped permissions
4. bounded delegation
5. policy evaluation
6. human approval gates where required
7. MCP governance
8. A2A governance
9. ADL execution evidence
10. provenance
11. audit/replay
12. conformance tests

## 6. Source-of-Truth Boundary

The generic governance behavior is defined by the AGL specifications.

ABOS implementation details remain in the ABOS repository.

If an ABOS concept is generalized into the AGL core, the generalized AGL specification becomes authoritative for that generic concept.

ABOS remains authoritative for aviation-specific behavior.

## 7. What This Demonstrates

The reference implementation demonstrates the separation:

```
Interoperability
      ↓
   MCP / A2A

Governance
      ↓
      APL

Evidence
      ↓
      ADL

Application
      ↓
      ABOS
```

This separation allows other applications to implement AGL without adopting ABOS.

## 8. Status

ABOS Reference Implementation v0.1.0 is an architectural reference. It identifies the integration boundary; it does not claim that every ABOS component is already fully AGL-conformant.
