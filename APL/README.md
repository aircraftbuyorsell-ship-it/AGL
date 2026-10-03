# APL — Agent Policy Layer

APL is the governance and control plane for agent actions.

## Responsibilities

- identity
- capability definition
- authorization
- delegation
- policy evaluation
- workflow constraints
- human approval
- escalation

## Minimal decision

Every consequential action should produce an explicit policy decision:

- ALLOW
- DENY
- REQUIRE_HUMAN_APPROVAL
- ESCALATE

A policy decision should be bound to the actor, requested capability, target resource, context, policy version, and timestamp.
