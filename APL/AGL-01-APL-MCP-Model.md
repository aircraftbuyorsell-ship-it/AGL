# AGL-01: APL MCP/A2A Protocol Model — Track B

Status: Draft extraction / implementation validation
Primary implementation source: ABOS gateway/src/apl.js
Secondary source requested: APL_core_compact_pack.zip

## 1. Purpose

This track validates the APL semantic model against the concrete ABOS gateway and protocol surface.

The current implementation contains ADL manifests, MCP tool schemas, capability declarations, permission declarations, autonomy, trust metadata, risk level, human-approval requirements, evidence/provenance requirements, execution dispatch and audit events.

## 2. Current MCP tool manifest model

The ABOS gateway derives its MCP tool surface from ADL_MANIFESTS.

Observed fields include:

- adl_version
- id
- apl_id
- type
- owner
- skill
- description
- capabilities
- permissions
- autonomy
- trust
- audit
- risk_level
- requires_human_approval
- supported_protocols
- evidence
- status
- mcp.name
- mcp.inputSchema

AGL interpretation:

| ABOS field | AGL meaning |
|---|---|
| apl_id | actor/agent identity |
| capabilities | declared capability |
| permissions | declared permission boundary |
| autonomy | autonomy metadata, not authorization |
| trust | trust input |
| risk_level | policy/risk context |
| requires_human_approval | approval policy input |
| supported_protocols | protocol compatibility |
| evidence | evidence requirements |
| mcp.name | MCP tool binding |
| mcp.inputSchema | invocation input contract |
| status | manifest lifecycle state |

## 3. Invocation protocol

Current ABOS flow:

MCP tool request
→ manifest lookup
→ manifest validation
→ capability check
→ permission check
→ risk/approval policy
→ execution
→ evidence/audit

This validates the AGL invariant:

Authorization precedes execution. Evidence follows execution.

## 4. MCP mapping

| MCP concept | AGL/APL representation |
|---|---|
| Tool identity | actor/tool binding |
| Tool declaration | capability/manifest |
| Tool input | policy context + target |
| Tool invocation | consequential operation |
| Tool result | execution output |
| Tool error | failure evidence / protocol error |
| Session/correlation | ADL correlation context |
| Tool discovery | capability discovery, NOT authorization |

MCP discovery MUST NOT be treated as authorization.

## 5. A2A model

RFC-001 describes agent-to-agent communication, identity, context exchange, discovery, security handshake and multi-agent workflows.

The current apl.js implementation is MCP/tool oriented and does not provide a complete direct A2A runtime model.

Therefore:

- A2A semantics can be extracted from RFC-001;
- direct A2A implementation conformance remains open;
- A2A behavior must not be inferred from MCP behavior alone.

## 6. Resource/evidence model

The current gateway returns evidence containing provenance, confidence, audit event ID, current hash, audit level, chain status and a degradation warning when persistent audit storage is unavailable.

This maps to AGL ADL evidence.

The MCP tool surface does not itself define the complete AGL evidence model. Evidence remains an execution/audit concern surrounding invocation.

## 7. Session/state

The gateway is compatible with stateless execution. Persistent audit continuity depends on the ABOS_AUDIT KV binding.

AGL therefore separates request correlation, execution lifecycle and persistent audit state.

A stateless gateway MUST NOT claim persistent hash-chain continuity when persistence is absent.

## 8. Registry bindings

RFC-001 proposes an APL registry for agent/skill discovery, verification and distribution.

The current apl.js implementation has an in-process manifest registry (ADL_MANIFESTS and MCP-name mapping), not a complete distributed registry.

This is an implementation extension, not a contradiction.

## 9. Compact-pack validation status

The requested APL_core_compact_pack.zip was not available in the current searchable file library, and it was not found as a visible root artifact during the initial ABOS repository inspection.

Therefore compact-pack-derived claims are explicitly pending rather than invented.

## 10. Required next validation

When the compact pack is available, compare:

1. tool manifest schema;
2. capability/resource types;
3. request/invocation grammar;
4. A2A agent capability model;
5. session/state semantics;
6. event types;
7. registry bindings;
8. versioning/error semantics.

Only matching elements should be promoted into the normative AGL-01 core.
