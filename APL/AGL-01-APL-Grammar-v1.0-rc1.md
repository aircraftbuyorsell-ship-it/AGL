# AGL-01 APL Core Grammar v1.0-rc1

Status: Normative release-candidate syntax
Scope: AGL APL Core

## 1. Permission expression

Canonical compact form: ACTION + RESOURCE + CONDITION

ABNF-style notation:

```abnf
permission = action "+" resource "+" condition
action = token
resource = token
condition = token / quoted-condition

token = 1*(ALPHA / DIGIT / "_" / "-" / "." / ":" / "/")
quoted-condition = DQUOTE 1*(%x20-21 / %x23-7E) DQUOTE
```

## 2. Governance request

Request = Identity + Capability + Permission + Target + Context + Correlation

The machine-readable representation is defined by schemas/apl-request.schema.json.

## 3. Authorization decision

```abnf
decision = "ALLOW" / "DENY" / "REQUIRE_HUMAN_APPROVAL" / "ESCALATE"
```

## 4. Communication envelope

The compact source defines version, message ID, sender, receiver, intent, context, security and payload. These are transport-neutral concepts; MCP/A2A bindings may map them into native envelopes.

## 5. Error vocabulary

```abnf
apl-error = "APL_AUTH_FAILED" / "APL_PERMISSION_DENIED" / "APL_SKILL_NOT_FOUND" / "APL_VERSION_ERROR" / "APL_POLICY_BLOCKED" / "APL_APPROVAL_REQUIRED" / "APL_ESCALATION_REQUIRED"
```

## 6. Normative ordering

Identity -> Capability -> Permission/Scope -> Policy -> Decision -> Execution -> Evidence

Execution MUST NOT occur before an applicable authorization decision. DENY, REQUIRE_HUMAN_APPROVAL and ESCALATE MUST prevent normal consequential execution until their conditions are resolved.

## 7. Boundary

This grammar defines APL governance semantics only. It does not define MCP wire format, A2A wire format, model reasoning, domain schemas, provider-specific authentication, or database/cloud implementation.

## 8. Conformance

An implementation claiming AGL-01 APL Core syntax conformance MUST validate requests against the machine-readable schema and MUST enforce the normative decision ordering above.
