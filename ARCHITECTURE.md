# AGL Architecture

## Problem

Agent protocols solve interoperability, but interoperability alone does not define who may act, under which policy, with which authority, or how the resulting action can later be proven.

AGL separates these concerns.

## Model

Applications / Agents
        |
        v
   MCP / A2A
        |
        v
+-------------------+
|   AGL / APL       |
| policy            |
| authorization     |
| delegation        |
| workflow          |
| human approval    |
+---------+---------+
          |
          v
+-------------------+
|   AGL / AEL       |
| actor chain       |
| execution trace   |
| evidence          |
| provenance        |
| decision record   |
| replay / audit    |
+---------+---------+
          |
          v
Tools / APIs / Data / Transactions

## APL — control plane

APL answers:
- Who is the actor?
- What capabilities does it have?
- Who delegated authority?
- What policy applies?
- Is the requested action authorized?
- Is human approval required?
- What escalation path applies?

## AEL — evidence plane

AEL records:
- actor and delegation chain
- policy and policy version
- requested and executed action
- inputs and outputs
- evidence references
- timestamps and identifiers
- human interventions
- verification state
- replay metadata

## Principle

**Authorization precedes execution. Evidence follows execution.**

AGL does not replace MCP or A2A. It provides governance and evidence around them.
