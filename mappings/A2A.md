# AGL — A2A Governance Mapping

## v0.1.0

A2A provides interoperability between agents. AGL does not replace A2A; it governs authority, constraints, and evidence around agent-to-agent collaboration.

### Core Mapping

| A2A concern | AGL governance concern |
|---|---|
| Agent identity | APL actor identity |
| Agent capabilities | APL capability model |
| Task/message request | Permission and policy evaluation |
| Delegation | APL delegation chain |
| Task execution | ADL execution trace |
| Task result | ADL output/evidence |
| Human intervention | APL approval/escalation + ADL record |
| Correlation | ADL correlation chain |

### Governed Flow

`A2A request → authenticate actor → resolve capability → validate delegation → evaluate APL → A2A task/message → result → ADL evidence`

A consequential A2A task MUST NOT execute before the applicable governance decision has been evaluated.

### Identity Is Not Authorization

A2A identity identifies the communicating agent. AGL additionally evaluates whether that identity has authority to perform the requested action in the current context.

### Capability and Permission

An advertised A2A capability describes what an agent can technically provide. APL determines whether the actor is permitted to invoke that capability for the requested target and context.

### Delegation

Where one agent acts on behalf of another, ADL SHOULD preserve:

`Originator → Delegator → Delegatee → Action`

APL MUST ensure that delegated authority does not exceed the delegator's authority.

### Human Oversight

When policy requires human approval:

`A2A request → APL → REQUIRE_HUMAN_APPROVAL → human decision → A2A execution → ADL evidence`

The approval is itself an auditable governance event.

### Evidence

ADL SHOULD record communicating actors, capability/action, delegation chain, policy version, authorization decision, task/message reference, execution lifecycle, result reference, provenance, approvals or escalations, and correlation identifier.

### Blocked Execution

For `DENY`, the requested consequential task MUST NOT proceed.

For `REQUIRE_HUMAN_APPROVAL`, execution MUST remain blocked until approval.

For `ESCALATE`, execution MUST remain blocked until the escalation process resolves the request.

### Security Boundary

AGL MAY operate at an A2A gateway, agent runtime, orchestration layer, policy enforcement point, or equivalent governance boundary.

The implementation location is not normative. The authorization-before-execution invariant is.

### Non-Goals

This mapping does not redefine A2A transport, task lifecycle semantics, agent cards, message formats, or agent implementation details.

### Status

A2A Governance Mapping v0.1.0 is an early open-source mapping between AGL and A2A.
