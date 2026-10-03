# AGL ↔ ABOS Adapter Contract v0.1

Status: Architectural contract / reference mapping

## 1. Purpose

This contract defines how existing ABOS governance runtimes map to the generic AGL contract without changing ABOS production semantics.

AGL remains implementation-neutral. ABOS-specific aviation semantics remain outside AGL core.

The contract establishes one governance boundary for two existing ABOS adapters:

1. `gateway/src/apl.js`
2. `base44/functions/governedSkillGateway/entry.ts`

They are adapters of the same AGL governance model, not separate governance systems.

## 2. Core invariant

> Authorization precedes execution. Evidence follows execution.

A consequential action MUST NOT execute before an applicable AGL authorization decision has been established.

An authorization record alone MUST NOT be treated as proof that execution occurred.

## 3. Canonical AGL request

An adapter SHOULD normalize an ABOS request into:

```json
{
  "actor": {
    "id": "stable-actor-id",
    "type": "agent"
  },
  "capability": "capability.id",
  "permission": {
    "scope": "resource-or-operation-scope"
  },
  "target": {
    "type": "resource",
    "id": "resource-id"
  },
  "delegation_chain": [],
  "context": {},
  "risk": {
    "level": "low"
  },
  "approval": {
    "required": false
  }
}
```

Adapters MAY retain additional ABOS fields, but those fields MUST NOT weaken the generic authorization contract.

## 4. Canonical decisions

The adapter MUST map its effective governance result to one of:

- `ALLOW`
- `DENY`
- `REQUIRE_HUMAN_APPROVAL`
- `ESCALATE`

Execution boundary:

- `ALLOW` permits execution subject to runtime checks.
- `DENY` blocks execution.
- `REQUIRE_HUMAN_APPROVAL` blocks execution until valid approval exists.
- `ESCALATE` blocks normal autonomous execution until escalation is resolved.

## 5. ABOS adapter A — gateway

Source:

`gateway/src/apl.js`

Current ABOS flow:

```
APL request
→ manifest lookup
→ validation
→ capability check
→ permission check
→ risk / approval policy
→ execution
→ evidence
→ audit
```

AGL mapping:

| ABOS runtime | AGL concept |
|---|---|
| manifest identity | Actor / capability metadata |
| declared capability | Capability |
| permission checks | Permission / scope |
| risk policy | Policy context |
| human approval requirement | Human approval gate |
| executor invocation | Consequential execution |
| provenance/evidence envelope | ADL evidence |
| audit event | ADL evidence record |
| correlation ID | ADL correlation |

The adapter MUST preserve the existing deny behavior.

## 6. ABOS adapter B — Base44 governed gateway

Source:

`base44/functions/governedSkillGateway/entry.ts`

Current ABOS flow:

```
authenticated caller
→ WorkflowRun
→ AgentWorkflow / AgentDefinition / AgentSkill
→ permission checks
→ prerequisite gates
→ approval gate
→ execution
→ evidence validation
→ WorkflowStep
→ WorkflowRun evidence
→ AgentAuditLog
```

AGL mapping:

| ABOS runtime | AGL concept |
|---|---|
| AgentDefinition | Actor / capability boundary |
| AgentSkill | Capability |
| AgentWorkflow | Policy / workflow scope |
| allowed_agents | Authorization boundary |
| allowed_tools / entities | Permission scope |
| delegation_path | Delegation chain |
| AgentApproval | Human approval evidence |
| AgentEscalation | Escalation record |
| WorkflowStep | Execution evidence |
| WorkflowRun | Correlated execution context |
| AgentAuditLog | Audit / evidence record |

## 7. Terminology compatibility

ABOS currently uses:

- **ADL = Agent Definition Language**
- **APL = Agent Protocol Layer**

AGL uses:

- **ADL = Agent Evidence Layer**
- **APL = Agent Policy Layer**

These names MUST NOT be silently treated as equivalent.

For the current integration, the compatibility rule is:

> ABOS ADL/APL are legacy/application protocol names; AGL ADL/APL are the generic governance concepts.

Production ABOS files SHOULD NOT be renamed solely to resolve this collision.

## 8. Evidence mapping

The Base44 adapter SHOULD map:

```
AgentApproval
AgentEscalation
WorkflowStep
WorkflowRun
AgentAuditLog
sources
evidence
conflicts
warnings
errors
```

into the corresponding ADL evidence lifecycle.

Minimum linkage:

```
Actor
→ Capability
→ Permission
→ Delegation
→ Policy
→ Decision
→ Execution
→ Evidence
```

The existing `correlation_id` SHOULD be preserved across the complete operation.

## 9. Current implementation gaps

This contract does not claim full AGL conformance.

Known gaps requiring tests or later adapter work:

1. `gateway/src/apl.js` currently contains ABOS-specific permission defaults rather than the full generic AGL scope/condition model.
2. The gateway path does not yet expose a complete generic delegation-chain input comparable to the AGL contract.
3. Direct A2A governance tests are still required.
4. Persistent hash chaining depends on the availability of the ABOS audit KV.
5. Base44 approval and permission semantics remain ABOS application policy.

These are adapter gaps, not reasons to rebuild the ABOS governance runtime.

## 10. Conformance target

The first target is **AGL CORE**.

Required adapter behavior:

- stable actor identity
- capability evaluation
- permission evaluation
- authorization before consequential execution
- `ALLOW`, `DENY`, `REQUIRE_HUMAN_APPROVAL`, `ESCALATE`
- bounded delegation
- execution lifecycle evidence
- correlation
- provenance or explicit unavailable state
- failed and blocked action evidence
- controlled audit/evidence access

The adapter MUST pass negative tests as well as positive tests.

## 11. First CORE test matrix

| Test | ABOS path | Expected |
|---|---|---|
| unauthenticated actor | Base44 gateway | DENY / blocked |
| unknown capability | gateway | DENY |
| unauthorized skill | Base44 gateway | DENY |
| out-of-scope action | either | DENY |
| approval-required action | Base44 | REQUIRE_HUMAN_APPROVAL |
| rejected approval | Base44 | BLOCKED |
| escalation | Base44 | ESCALATE / blocked |
| failed execution | either | FAILED + evidence |
| successful execution | either | COMPLETED + evidence |
| audit correlation | either | correlation preserved |

## 12. Non-goals

This adapter contract does not:

- replace MCP or A2A
- redefine ABOS domain logic
- create new Base44 entities
- create new Supabase tables
- rename existing ABOS production protocols
- claim legal or regulatory compliance
- claim current ABOS production conformance without executable evidence

## 13. Reference status

ABOS is the first reference implementation used to validate whether AGL can govern an existing agent system without requiring that system to be rebuilt.

The next implementation artifact is the executable AGL CORE adapter test suite against the existing ABOS gateway and Base44 governed gateway.
