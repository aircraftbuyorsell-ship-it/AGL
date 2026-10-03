# AGL — Conformance Model

## v0.1.0

### 1. Purpose
AGL Conformance defines the minimum testable requirements for an implementation claiming compatibility with the Agent Governance Layer.

Conformance is evidence-based: an implementation must demonstrate observable governance behavior, not merely declare support.

### 2. Conformance Scope
Conformance is divided into four areas:

- APL — authorization and policy behavior
- AEL — evidence and audit behavior
- Security & Trust — identity, credential, delegation, and integrity behavior
- Protocol integration — governed MCP and A2A execution

An implementation MAY claim conformance to individual profiles without claiming full AGL conformance.

### 3. Conformance Levels
AGL v0.1 defines three levels:

- `CORE` — APL + AEL minimum governance behavior
- `SECURE` — CORE plus Security & Trust requirements
- `INTEGRATED` — SECURE plus demonstrated MCP and/or A2A governance integration

An implementation must not claim a higher level without satisfying all lower levels.

### 4. CORE Requirements
A CORE implementation SHOULD demonstrate:

1. Stable actor identity.
2. Explicit capability and permission evaluation.
3. Authorization decision before consequential execution.
4. Support for ALLOW, DENY, REQUIRE_HUMAN_APPROVAL, and ESCALATE decisions.
5. Bounded delegation.
6. Execution lifecycle evidence.
7. Correlation between authorization and execution.
8. Provenance or explicit provenance-unavailable state.
9. Recording of blocked and failed actions.
10. Controlled access to evidence.

### 5. SECURE Requirements
A SECURE implementation SHOULD additionally demonstrate:

1. Actor authentication.
2. Credential or identity validation where applicable.
3. Rejection of expired or revoked authority.
4. Trust state as an authorization input rather than an authorization result.
5. Integrity protection or a documented integrity boundary.
6. Secure delegation validation.
7. Security event recording.
8. Credential/key lifecycle handling where cryptographic identity is used.

### 6. INTEGRATED Requirements
An INTEGRATED implementation SHOULD additionally demonstrate governance at a real protocol boundary.

For MCP:
`Request → APL decision → MCP execution → ADL evidence`

For A2A:
`Request → identity/delegation/policy evaluation → A2A execution → ADL evidence`

The protocol itself remains responsible for its transport semantics. AGL is responsible for governance and evidence.

### 7. Mandatory Negative Tests
Conformance testing MUST include denial cases, not only successful execution.

At minimum, an implementation SHOULD prove that:

- an unauthenticated actor cannot perform a consequential action
- an unauthorized capability is blocked
- an out-of-scope resource is blocked
- an expired delegation is blocked
- a revoked delegation is blocked
- a DENY decision prevents execution
- REQUIRE_HUMAN_APPROVAL prevents autonomous execution until approval
- an ESCALATE decision prevents normal autonomous execution
- an invalid or missing authorization context cannot silently become authorized
- execution evidence cannot falsely imply that an authorized-but-unexecuted action occurred

### 8. Human Approval Test
A conformant implementation supporting human approval SHOULD demonstrate:

`Request → Policy → REQUIRE_HUMAN_APPROVAL → Approval → Execution → Evidence`

The approval record must identify the approving human, action, scope, decision, timestamp, and correlation identifier.

### 9. Delegation Test
A conformant implementation SHOULD demonstrate:

`Delegator → Delegation → Delegatee → Authorization → Execution → Evidence`

The test must verify that the delegatee cannot exceed the delegator's authority.

### 10. Evidence Test
Every consequential test execution SHOULD produce an AEL record linking:

`Actor → Capability → Permission → Delegation → Policy → Decision → Execution`

The test should also verify correlation identifiers, execution status, provenance state, and integrity metadata where supported.

### 11. Replay Test
A conformant implementation SHOULD reconstruct the observable execution history from AEL evidence.

Replay must establish:

- who acted
- what authority was evaluated
- which policy version was used
- what action was requested/executed
- what evidence or provenance was available
- whether human approval was required
- what outcome occurred

Replay does not require reproduction of private model reasoning.

### 12. Conformance Evidence Package
A conformance submission SHOULD contain:

- implementation version
- AGL specification versions
- test environment
- test cases and results
- authorization decisions
- relevant ADL evidence records
- protocol traces where applicable
- security/integrity information
- known limitations

Sensitive payloads MAY be replaced with hashes, references, or redacted evidence.

### 13. Versioning
Conformance is always evaluated against explicit AGL specification versions.

An implementation claiming `AGL v0.1` conformance MUST identify the exact APL, AEL, and Security & Trust versions tested.

Breaking specification changes require a new conformance target.

### 14. No Self-Certification by Declaration
An implementation MUST NOT be considered conformant solely because its documentation states that it supports AGL.

Conformance requires reproducible tests or independently reviewable evidence.

AGL MAY later define a signed conformance statement, certification service, or public conformance registry.

### 15. Reference Test Matrix
| Area | Test | Expected result |
|---|---|---|
| Identity | valid actor | accepted |
| Authorization | permitted action | ALLOW |
| Authorization | forbidden action | DENY + no execution |
| Scope | out-of-scope target | DENY + no execution |
| Delegation | valid bounded delegation | allowed within scope |
| Delegation | expired/revoked delegation | blocked |
| Human oversight | approval required | no autonomous execution before approval |
| Escalation | escalation required | normal execution blocked |
| Evidence | completed action | ADL execution evidence |
| Failure | failed action | ADL failure evidence |
| Replay | recorded execution | observable history reconstructable |
| Integrity | modified evidence | detected or prevented according to implementation guarantee |
| MCP | governed tool call | APL before execution, ADL after |
| A2A | governed task/message | policy before execution, ADL after |

### 16. Status
AGL Conformance Model v0.1.0 is an early open-source test model. It defines observable behavior rather than prescribing a specific testing framework, language, database, or infrastructure.