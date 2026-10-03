# AGL — Reference Governed Flow

## v0.1.0

This example shows the minimum end-to-end governance flow for a consequential agent action.

### Scenario

An agent wants to invoke a tool that can modify an external resource.

### Flow

```
Agent
  |
  | request capability/action
  v
Identity + Security
  |
  | authenticate + validate authority
  v
APL Policy Engine
  |
  | ALLOW / DENY / REQUIRE_HUMAN_APPROVAL / ESCALATE
  v
MCP or A2A
  |
  | execute only after authorization
  v
External Tool / Agent / Resource
  |
  | result
  v
ADL
  |
  | evidence + provenance + execution trace
  v
Audit / Replay
```

### Example: Allowed MCP Action

```
1. Agent requests: UPDATE resource R
2. Security authenticates agent A
3. APL resolves capability UPDATE
4. APL validates permission and scope
5. APL validates delegation
6. Policy evaluates context
7. Decision = ALLOW
8. MCP tool is invoked
9. Tool returns result
10. ADL records authorization + execution + result references
```

### Example: Human Approval

```
1. Agent requests consequential action
2. APL evaluates policy
3. Decision = REQUIRE_HUMAN_APPROVAL
4. Execution remains blocked
5. Human reviews requested action and scope
6. Human grants approval
7. Approval is recorded in ADL
8. MCP/A2A execution proceeds
9. Result is recorded in ADL
```

### Example: Denial

```
1. Agent requests action
2. APL evaluates policy
3. Decision = DENY
4. Tool/agent execution does not occur
5. ADL records the authorization decision
```

### Example: Delegation

```
Originator
   |
   v
Delegator
   |
   | bounded delegation
   v
Delegatee
   |
   v
APL
   |
   v
Execution
   |
   v
ADL
```

The delegatee cannot receive authority greater than the delegator possesses.

### Evidence Chain

A consequential action SHOULD be reconstructable as:

```
Actor
  → Capability
  → Permission
  → Delegation
  → Policy
  → Decision
  → Execution
  → Result
  → Evidence
```

### Core Invariant

> Authorization precedes execution. Evidence follows execution.

An authorization record MUST NOT be interpreted as proof that execution occurred.

An execution record MUST remain linked to the authorization context that permitted it.

### Implementation Neutrality

This flow can be implemented with different gateways, runtimes, identity systems, databases, and cryptographic mechanisms.

AGL defines the governance boundary and observable behavior, not the infrastructure used to implement it.

### Status

Reference Governed Flow v0.1.0.
