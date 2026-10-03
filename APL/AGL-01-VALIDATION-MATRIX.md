# AGL-01 Cross-Track Validation Matrix

Status: Preliminary validation
Sources: RFC-001 extraction + ABOS gateway/src/apl.js

| Concept | RFC-001 | ABOS implementation | AGL interpretation | Status |
|---|---|---|---|---|
| Identity | APL namespace / agent identity | apl_id, manifest identity | actor identity | ALIGN |
| Capability | capability declaration | capabilities | capability | ALIGN |
| Permission | allowed/denied permissions | permissions, checkPermissions() | permission/authority boundary | ALIGN |
| Policy | permission/risk/policy checks | validateManifest, checkCapability, checkPermissions, checkRisk | policy evaluation | ALIGN |
| Invocation | APL request/message | callAplTool() | governed operation | ALIGN |
| Execution gate | checks before execution | governance loop before execute() | authorization precedes execution | ALIGN |
| Denial | permission/policy errors | if(check) return | DENY blocks execution | ALIGN |
| Human approval | security/policy material | requires_human_approval + context gate | approval decision | PARTIAL |
| Delegation | multi-agent workflow / authority concepts | no complete generic delegation input | bounded delegation | GAP |
| Trust | verification/certificates/trust levels | trust manifest metadata | trust as policy input | PARTIAL |
| Evidence | audit/output concepts | provenance + confidence + audit envelope | ADL evidence | ALIGN |
| Audit integrity | audit trail/security | SHA-256 event chain; KV persistence optional | integrity boundary | PARTIAL |
| Correlation | workflow/request context | not fully represented in apl.js response | ADL correlation | GAP |
| A2A | explicit agent-to-agent communication | no direct A2A runtime in apl.js | A2A mapping | GAP |
| MCP | tool access layer | generated MCP surface | governed MCP boundary | ALIGN |
| Registry | RFC registry concept | in-process manifest registry | discovery/registry binding | PARTIAL |
| Errors | APL error codes | APL error objects | protocol/policy errors | ALIGN |
| Formal grammar | protocol/message concepts | JSON/tool schemas, no complete ABNF | normative grammar | GAP |
| Session/state | communication/context concepts | largely stateless gateway | correlation/execution context | PARTIAL |
| Provenance | source/trust/audit concepts | evidence provenance | evidence provenance | ALIGN |

## Reconciliation rules

1. RFC-001 semantics define source intent.
2. Existing ABOS behavior validates implementation feasibility but does not redefine generic AGL semantics.
3. ABOS-only aviation concepts remain outside AGL core.
4. Missing implementation behavior is recorded as GAP, not silently inferred.
5. Implementation extensions are documented separately from normative requirements.
6. No ABNF or A2A semantics are invented where source material is incomplete.

## Current conclusion

The tracks are consistent on the central governance invariant:

Identity → Capability → Permission/Policy → Decision → Execution → Evidence

Main unresolved areas before AGL-01 v1.0:

- formal grammar;
- generic delegation semantics;
- complete A2A model;
- correlation/session contract;
- exact compact-pack protocol definitions;
- precise distinction between manifest metadata and runtime authorization.

These are reconciliation items, not reasons to rebuild the existing ABOS gateway.
