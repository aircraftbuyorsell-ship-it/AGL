# ADL — Agent Evidence Layer

ADL is the evidence and audit plane for agent execution.

## Responsibilities

- actor chain
- execution trace
- provenance
- evidence references
- decision records
- verification
- replay
- audit

## Minimal evidence record

A conforming implementation should be able to reconstruct:

1. who initiated the action
2. which agent acted
3. under whose authority
4. which policy was evaluated
5. which capability was invoked
6. what was executed
7. what evidence was produced
8. whether a human intervened
9. what the final outcome was
