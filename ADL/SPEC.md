# ADL — Agent Evidence Layer

## Evidence Specification v0.1.0

### 1. Purpose
ADL defines the evidence layer for governed agent systems.
APL determines whether an agent is authorized to act. ADL records what happened, under which authority, with which inputs and outputs, and what evidence supports the execution.

Core principle:
> Authorization precedes execution. Evidence follows execution.

ADL is implementation-neutral and does not replace application logs, MCP, A2A, databases, or observability systems. It defines the minimum evidence contract needed to reconstruct and audit governed agent activity.

### 2. Scope
ADL covers actor and delegation chains, authorization and policy decisions, execution traces, inputs and outputs or references to them, evidence and provenance references, human approvals and escalations, verification results, errors and blocked actions, and correlation and replay information.
ADL does not define agent reasoning or chain-of-thought, model internals, transport protocols, domain-specific data models, storage technology, or legal compliance by itself.

### 3. Evidence Record
An ADL Evidence Record SHOULD contain:
- `id` — unique evidence record identifier
- `timestamp` — event time
- `event_type` — type of governed event
- `actor` — executing agent, human, service, or system actor
- `delegation_chain` — authority chain when delegation exists
- `apl_decision` — applicable authorization decision
- `action` — requested or executed capability/action
- `target` — resource or operation target
- `context` — relevant execution context
- `input_refs` — references to relevant inputs
- `output_refs` — references to outputs/results
- `evidence_refs` — supporting evidence/provenance references
- `approval` — human approval information when applicable
- `verification` — verification status/result when applicable
- `status` — execution outcome
- `correlation_id` — identifier linking related events
- `policy_version` — policy used for authorization
- `apl_version` — APL version used for the decision

Implementations MAY add additional fields.

### 4. Event Types
Initial vocabulary: `AUTHORIZATION_REQUEST`, `AUTHORIZATION_DECISION`, `DELEGATION_CREATED`, `DELEGATION_REVOKED`, `APPROVAL_REQUESTED`, `APPROVAL_GRANTED`, `APPROVAL_DENIED`, `EXECUTION_STARTED`, `EXECUTION_COMPLETED`, `EXECUTION_FAILED`, `EXECUTION_BLOCKED`, `EVIDENCE_ATTACHED`, `VERIFICATION_COMPLETED`, `ESCALATION_CREATED`.
Implementations MAY define domain-specific event types using namespaced identifiers.

### 5. Execution Status
Baseline status vocabulary: `PENDING`, `AUTHORIZED`, `RUNNING`, `COMPLETED`, `FAILED`, `BLOCKED`, `CANCELLED`, `ESCALATED`.
`AUTHORIZED` does not imply that execution occurred.

### 6. Provenance
Evidence SHOULD identify where material information originated.
A provenance reference MAY contain source identifier, source type, retrieval timestamp, content or object identifier, integrity/hash reference, issuer or provider, and transformation history.
Missing provenance MUST NOT be represented as proof that information is false. The absence of evidence is an evidence state, not automatically a negative finding.

### 7. Authorization Linkage
Every consequential execution governed by APL SHOULD be traceable to its authorization context.
At minimum, the trace SHOULD allow reconstruction of:
`Actor → Capability → Permission → Delegation → Policy → Decision → Execution`
If the action required human approval, the trace SHOULD additionally contain:
`Human → Approval Decision → Execution`
An `ALLOW` decision without a corresponding execution event means authorization was granted but execution is not proven.

### 8. Evidence Integrity
Implementations SHOULD provide integrity protection appropriate to their threat model.
Possible mechanisms include cryptographic hashes, digital signatures, signed event envelopes, append-only storage, trusted timestamps, and immutable or tamper-evident storage.
ADL does not mandate one cryptographic or storage mechanism in v0.1.0.

### 9. Replay
An ADL implementation SHOULD preserve sufficient information to reconstruct a governed action without requiring access to an agent's private reasoning.
Replay evidence SHOULD identify actor identity, authorization decision, policy version, relevant inputs or immutable references, executed capability/action, relevant outputs or immutable references, evidence/provenance, approvals and escalations, and execution result.
Replay is reconstruction of observable execution and authority, not reproduction of model reasoning.

### 10. Human Oversight
Human approvals and escalations are first-class evidence events.
A human approval record SHOULD identify approver identity, requested action, scope, decision, timestamp, applicable policy/context, and correlation identifier.
An approval MUST NOT silently expand the authority granted by the applicable policy unless the governance system explicitly permits such delegation.

### 11. MCP and A2A
For MCP:
`MCP request → APL decision → tool execution → result → ADL evidence`
For A2A:
`A2A request → identity/delegation/policy evaluation → task/message execution → result → ADL evidence`
ADL records governance and execution evidence around these protocols; it does not redefine their transport semantics.

### 12. Security and Privacy
ADL implementations SHOULD minimize sensitive data stored in evidence records.
Evidence SHOULD prefer immutable references, hashes, or redacted representations where storing the complete payload is unnecessary.
Access to evidence MUST itself be governed by appropriate authorization controls.

### 13. Minimum Conformance
An implementation claiming ADL v0.1 conformance SHOULD demonstrate: actor identification; authorization linkage; execution lifecycle recording; correlation across related events; provenance or explicit provenance-unavailable state; human approval recording when applicable; failed and blocked execution recording; an evidence integrity mechanism or documented integrity boundary; replay of observable execution history; controlled access to evidence.

### 14. Relationship to APL
APL is the control plane. ADL is the evidence plane.
APL answers: May this actor perform this action under this authority and policy?
ADL answers: What happened, under which authority, with what evidence and outcome?
Neither layer replaces the other.

### 15. ABOS Reference Implementation
ABOS may implement ADL using aviation-specific evidence, provenance, verification, registry, transaction, and market data.
Those domain-specific semantics remain outside the generic ADL core.

### 16. Status
ADL Evidence Specification v0.1.0 is an early open-source specification. The vocabulary and schemas are intentionally minimal and implementation-neutral.