# APL Authority Attenuation Contract (draft)
Status: draft / not certified / no runtime conformance claim.
Source: COMMAND-02B (2026-10-06).

## Mandatory record
A trusted, persisted authorization record MUST carry:
- authorization_id, authorization_root_id and parent_authorization_id (null only for root)
- principal_id, delegator_id (null only for root), delegatee_id
- run_id, capabilities, resources, actions
- argument constraints or canonical arguments digest (SHA-256)
- valid_from, expires_at, status, revoked_at, can_delegate
- policy version and approving human/service mandate reference

All identifiers MUST be resolved server-side. Caller-supplied claims do not prove grants.
A root MUST be verified against human or service authority, never inferred from agent identity.
Children MUST refer to an existing parent and the same valid root.

## Pre-execution invariants
The authorization gate MUST deny by default, including failed persistence/read.
A child MUST NOT gain capabilities, actions, resources, argument scope, data access,
time validity or delegation rights beyond its immediate parent and human root.
Unknown or wildcard scope is not silently interpreted as narrower scope.
Equal-scope delegation requires an explicit parent policy.
The request MUST be rebound to actual agent, tenant, run, action, target resource,
canonical arguments and valid policy before every side effect.
Approval MUST bind exactly to authorization/run/action/resource/arguments and
must enforce expiration, revocation, consumption/replay policy.
Delegation must not be possible through arbitrary payload-subgoal creation.

## Evidence
AEL MUST record root and parent identifiers, evaluated request digest, decision,
policy version, execution reference, resulting side-effect observations and denial
reason, including denied and failed attempts. Failed audit persistence may not
convert an unauthorized operation into ALLOW.

## Required proof before certification
- narrower delegation allowed, when parent permits it
- privilege, resource, argument or duration expansion denied with no side effect
- broken lineage, absent/revoked/expired root or parent denied
- approval replay or mismatched action denied
- concurrent revocation and check-to-use behavior handled explicitly
- staging integration captures and reconstructs decision -> side effect -> AEL
- CI tests execute real evaluator, not merely source-text inspection

This specification does not authenticate Shopify tokens or replace OAuth/OIDC.
A provider-specific adapter may supply validated actor identity, but cannot
self-authorize capabilities without an independent APL policy decision.
