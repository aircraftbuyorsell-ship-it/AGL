# AGL-01 Cross-Track Validation Matrix

Status: Reconciled release-candidate validation
Date: 2026-10-03

| Concept | RFC-001 | ABOS implementation | AGL Core | Status |
|---|---|---|---|---|
| Identity | APL namespace / agent identity | manifest identity / apl_id | actor identity | ALIGN |
| Capability | capability declaration | capabilities | capability | ALIGN |
| Permission | allowed/denied permissions | permission checks | bounded authority | ALIGN |
| Policy | policy/permission/risk checks | validate/check functions | policy evaluation | ALIGN |
| Invocation | APL request/message | callAplTool | governed operation | ALIGN |
| Execution gate | pre-execution checks | governance before execute | authorization precedes execution | ALIGN |
| Denial | permission/policy errors | early return | DENY blocks execution | ALIGN |
| Human approval | security/policy material | approval gate exists | approval is authorization event | PARTIAL |
| Delegation | multi-agent authority concepts | incomplete generic chain | bounded delegation | DEFINED / GAP |
| Trust | verification/certificates/trust | manifest trust metadata | trust is policy input | ALIGN |
| Evidence | audit/output concepts | evidence/audit envelope | ADL binding | ALIGN |
| Audit integrity | audit/security | hash chain, persistence optional | integrity boundary | PARTIAL |
| Correlation | request/workflow context | incomplete in apl.js | required linkage | DEFINED / GAP |
| A2A | agent communication | no direct runtime | governance envelope | DEFINED / GAP |
| MCP | tool access | generated MCP surface | governed MCP boundary | ALIGN |
| Registry | registry concept | in-process manifest registry | discovery binding | PARTIAL |
| Errors | APL error concepts | APL errors | compatibility vocabulary | ALIGN |
| Formal grammar | structured protocol examples + ACTION/RESOURCE/CONDITION | compact skill/JSON defines permission pattern, but not a complete transport grammar | OPEN |
| Session/state | context concepts | largely stateless | correlation, no session requirement | ALIGN |
| Provenance | source/trust/audit | evidence provenance | ADL provenance | ALIGN |
| Manifest/runtime distinction | manifest declaration | manifest drives checks | runtime decision authoritative | RESOLVED |

## Compact-source reconciliation

The Library compact source confirms identity, manifest, capability/permission separation, `ACTION + RESOURCE + CONDITION`, A0-A4 autonomy, APL-A0-A3 audit levels, APL-T0-T4 trust levels, trust/security inputs, communication envelope fields, canonical error vocabulary, and APL/MCP/API separation. ABOS aviation objects and ABOS-specific deny defaults remain reference-implementation material rather than AGL Core.

## Reconciliation rules

1. RFC-001 establishes source intent.
2. ABOS implementation establishes implementation evidence, not generic AGL semantics.
3. AGL core remains domain-neutral.
4. Missing behavior is a GAP, not an inferred capability.
5. MCP/A2A transport semantics remain outside APL Core.
6. Manifest declarations do not substitute for runtime authorization.
7. No formal grammar is invented where the source is insufficient.

## Release-candidate conclusion

The semantic APL Core is reconciled. Remaining OPEN/GAP items are implementation/source-closure work and remain explicitly labeled.
