# AGL Conformance Test Suite

## v0.1.0

This directory defines the first implementation-neutral conformance tests for AGL.

The tests are behavior-oriented. An implementation passes when its observable behavior satisfies the AGL requirements.

## Test Profiles

- CORE
- SECURE
- INTEGRATED

## CORE tests

### APL-001 — Allow
A valid actor requests an action within its permission scope.

Expected:
- APL decision is ALLOW
- execution may proceed
- ADL links the decision to execution

### APL-002 — Deny
An actor requests an action outside its permission scope.

Expected:
- decision is DENY
- consequential execution does not occur
- ADL records the blocked authorization outcome

### APL-003 — Human Approval
Policy requires human approval.

Expected:
- decision is REQUIRE_HUMAN_APPROVAL
- autonomous execution remains blocked
- approval is recorded before execution
- ADL links approval to execution

### APL-004 — Escalation
Policy requires escalation.

Expected:
- decision is ESCALATE
- normal execution remains blocked
- escalation is recorded

### APL-005 — Delegation Boundary
A delegatee receives bounded authority.

Expected:
- action within delegated scope may be authorized
- action outside delegated scope is denied
- delegatee cannot exceed delegator authority

## ADL tests

### ADL-001 — Authorization Link
A consequential execution has a traceable authorization context.

Expected chain:
Actor → Capability → Permission → Delegation → Policy → Decision → Execution

### ADL-002 — Execution Lifecycle
A completed action produces execution evidence.

Expected:
- start and completion can be correlated
- result is referenced
- status is COMPLETED

### ADL-003 — Failure
A failed action produces failure evidence.

Expected:
- status is FAILED
- failure is correlated to the authorization context

### ADL-004 — Blocked Action
A denied action produces evidence without falsely claiming execution.

Expected:
- status is BLOCKED or equivalent
- no execution completion is recorded

### ADL-005 — Provenance
Material evidence has provenance or an explicit unavailable state.

### ADL-006 — Replay
Observable execution history can be reconstructed from ADL evidence.

## SECURE tests

### SEC-001 — Authentication
Unauthenticated consequential requests are rejected.

### SEC-002 — Expired Authority
Expired credentials or delegations cannot authorize execution.

### SEC-003 — Revoked Authority
Revoked credentials or delegations cannot authorize execution.

### SEC-004 — Trust Is Not Authorization
A TRUSTED state alone cannot produce an ALLOW decision.

### SEC-005 — Evidence Integrity
The implementation detects or prevents unauthorized evidence modification according to its documented integrity guarantee.

## INTEGRATED tests

### MCP-001 — Governed Tool Call
Expected flow:
MCP request → APL decision → MCP execution → ADL evidence

### MCP-002 — Denied Tool Call
A DENY decision prevents the MCP tool from executing.

### A2A-001 — Governed Agent Task
Expected flow:
A2A request → identity/delegation/policy evaluation → A2A execution → ADL evidence

### A2A-002 — Denied Agent Task
A DENY decision prevents consequential A2A execution.

## Test Result Format

Each test result SHOULD include:

- test identifier
- AGL specification version
- implementation version
- input/context
- expected behavior
- observed behavior
- pass/fail
- evidence references
- limitations

## Principle

Conformance is demonstrated by reproducible behavior and evidence, not by a declaration of compatibility.
