# AGL Architecture

## 1. Problem

MCP and A2A provide interoperability. They do not by themselves provide a single governance and evidence contract covering who may act, under which authority and policy, what actually executed, and how the execution can later be reconstructed.

AGL separates these concerns.

## 2. Model

```
Agent Definition / Service
        |
        v
      ADL
        |
        v
   MCP / A2A
        |
        v
+-------------------+
|      APL          |
| identity          |
| capability        |
| authority         |
| authorization     |
| delegation        |
| policy            |
| human approval    |
| escalation        |
+---------+---------+
          |
          v
     GOVERNED
     EXECUTION
          |
          v
+-------------------+
|      AEL          |
| execution evidence|
| provenance        |
| decision records  |
| human intervention|
| integrity         |
| replay / audit    |
+---------+---------+
          |
          v
Outcome / Effect / Incident / Claim
```

## 3. ADL — Agent Definition Language

ADL describes the agent and its declared boundaries.

AGL does not need to invent a new agent-definition semantics. Existing ADL specifications can be referenced or mapped where appropriate.

AGL uses ADL-level information such as:

- agent identity
- version
- provider
- capabilities
- declared permissions/boundaries
- model/runtime metadata
- lifecycle state

A declaration is not proof of runtime authorization or execution.

## 4. APL — Agent Policy Layer

APL answers:

- Who is acting?
- What capability is requested?
- What authority is available?
- Who delegated that authority?
- What policy applies?
- Is the requested operation authorized?
- Is human approval required?
- What escalation path applies?

Core invariant:

`Identity → Capability → Authority → Policy → Decision → Execution`

APL is the governance control point before consequential execution.

## 5. AEL — Agent Evidence Layer

AEL records:

- actor and delegation chain
- authorization and policy decision
- requested and executed action
- inputs and outputs or immutable references
- timestamps and correlation identifiers
- evidence and provenance references
- human approvals/interventions
- verification state
- failures and blocked actions
- replay metadata

AEL answers:

> What happened, under which authority, with what evidence and outcome?

## 6. Security & Trust

Security & Trust covers mechanisms such as:

- workload identity
- credentials
- certificates
- signatures
- revocation
- trust state
- evidence integrity

AGL should reuse established identity and attestation systems rather than define replacements.

## 7. Execution Graph

The execution graph connects:

`SERVICE → AUTHORITY → EXECUTION → COMPONENTS → OUTCOME → EVIDENCE`

Components may include:

`ACTOR → AGENT → ORCHESTRATOR → PIPELINE → WORKFLOW → TASK → SKILL → TOOL / MODEL / CODE → DATA / ENVIRONMENT`

Not every execution contains every component.

The graph MUST represent observed relationships and MUST NOT invent missing intermediate components.

## 8. Forward and backward reconstruction

Forward:

`Service → Mission → Execution → Components → Outcome → Evidence`

Backward:

`Output / Incident / Claim → Execution → Components → Inputs / Environment → Policy / Authorization → Authority`

The goal is reconstruction of observable execution and authority, not reproduction of private model reasoning.

## 9. Protocol boundaries

For MCP:

`Request → APL decision → MCP invocation → result → AEL evidence`

For A2A:

`Request → identity/delegation/policy evaluation → A2A task/message → result → AEL evidence`

The protocol remains responsible for its transport and interaction semantics.

## 10. Reference implementation

ABOS is the first reference implementation.

ABOS-specific domain logic remains outside the generic AGL core.

## 11. Design principle

**AGL connects existing mechanisms; it does not attempt to replace them.**
