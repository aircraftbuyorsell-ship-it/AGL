# AGL — Security & Trust Framework

## v0.1.0

### 1. Purpose
This document defines the minimum security and trust model for AGL.
Security establishes whether an actor, authority, message, or evidence record can be trusted sufficiently for policy evaluation and execution.
Trust is an input to authorization. Trust is not authorization.

### 2. Core Principles
1. Authenticate the actor before consequential execution.
2. Authorize the requested capability through APL.
3. Validate delegation and scope before execution.
4. Reject expired or revoked authority.
5. Preserve the identity and correlation chain across execution.
6. Record security-relevant decisions and events in ADL.
7. Minimize privileges and evidence exposure.
8. Do not treat an agent's self-declared capability or identity as proof of authority.

### 3. Identity
An AGL implementation SHOULD provide a stable identity for each governed actor.
An actor MAY be an agent, human, service, or system.
Agent identity is independent from the underlying AI model or model provider.
An identity SHOULD support unique identifier, version or identity revision, issuer or owner, status, authentication method, and lifecycle state.

### 4. Authentication
Authentication establishes that an actor controls or represents the claimed identity.
Possible mechanisms include cryptographic keys, signed credentials, certificates, workload identity, platform-issued credentials, and federated identity.
AGL does not mandate a single authentication mechanism in v0.1.0.
Authentication failure MUST prevent consequential execution.

### 5. Credentials and Certificates
Implementations MAY use certificates or signed credentials to establish trust relationships.
A credential SHOULD provide subject identity, issuer, validity period, credential type, key or verification material, and status or revocation information.
Expired or revoked credentials MUST NOT be accepted as valid authority.

### 6. Signatures and Integrity
Security-sensitive manifests, policies, delegations, and evidence SHOULD support integrity protection.
Possible mechanisms include digital signatures, cryptographic hashes, signed envelopes, and certificate chains.
The selected mechanism is implementation-specific unless a future AGL profile defines a mandatory algorithm or format.

### 7. Trust State
An implementation MAY maintain a trust state for an actor or credential.
Example states: TRUSTED, UNTRUSTED, UNKNOWN, EXPIRED, REVOKED, SUSPENDED.
Trust state MUST be treated as policy input.
TRUSTED MUST NOT by itself produce an ALLOW decision.

### 8. Authorization Boundary
The security enforcement sequence SHOULD be:
Authenticate → Identify → Validate Credential → Resolve Capability → Validate Permission → Validate Delegation → Evaluate Policy → Execute → Record Evidence
A system MUST NOT rely on downstream tools or agents to compensate for a missing authorization decision at the governance boundary.

### 9. Delegation Security
Delegated authority MUST be bounded by the authority of the delegator.
A delegation MUST NOT expand the delegator's authority, exceed its declared scope, survive expiration, or remain valid after explicit revocation.
The delegation chain SHOULD remain available to ADL for audit and replay.

### 10. Key Lifecycle
Where cryptographic credentials are used, implementations SHOULD support key generation, secure key storage, rotation, expiration, revocation, and compromise response.
Key rotation MUST NOT silently destroy the historical identity and evidence chain.

### 11. Manifest Security
An agent manifest MAY declare identity, capabilities, permissions, model metadata, trust metadata, and audit requirements.
A manifest SHOULD be integrity-protected when it is used as a security-sensitive configuration artifact.
A manifest declaration is not proof of runtime authorization.
Runtime APL policy remains authoritative.

### 12. Evidence Security
ADL evidence SHOULD be protected against unauthorized modification and disclosure.
Implementations SHOULD consider append-only or tamper-evident storage, integrity hashes or signatures, access control, encryption where appropriate, retention and deletion policy, and redaction or reference-based storage for sensitive payloads.
Access to audit evidence MUST itself be governed.

### 13. Zero-Trust Model
AGL SHOULD follow a zero-trust assumption: identity is continuously validated; authority is explicit; permissions are scoped; delegation is bounded; trust is contextual; every consequential action is independently authorized.
Previous successful execution MUST NOT be treated as permanent authorization.

### 14. Security Events
Security-relevant events SHOULD be represented in ADL.
Examples include authentication failure, invalid credential, expired credential, revoked credential, invalid delegation, policy denial, approval bypass attempt, unauthorized execution attempt, evidence integrity failure, key rotation, key compromise, and trust-state change.

### 15. Minimum Security Conformance
An implementation claiming AGL security conformance SHOULD demonstrate: actor authentication; stable actor identification; credential validation where credentials are used; explicit authorization before consequential execution; bounded delegation; rejection of expired or revoked authority; evidence of security-relevant decisions; controlled access to evidence; integrity protection or documented integrity boundaries; credential/key lifecycle handling where cryptographic identity is used.

### 16. Relationship to APL and ADL
APL = authority and policy
Security & Trust = identity, credential, integrity and trust inputs
ADL = evidence of decisions and execution
The three layers form one governance loop:
Identity → Trust → APL Decision → Execution → ADL Evidence

### 17. Non-Goals
This framework does not define a specific PKI, mandatory cryptographic algorithm, specific identity provider, cloud security architecture, transport security for MCP or A2A, legal compliance requirements, or model safety/model alignment.

### 18. Status
AGL Security & Trust Framework v0.1.0 is an early open-source framework. It intentionally defines security boundaries and requirements without forcing a single infrastructure or cryptographic implementation.