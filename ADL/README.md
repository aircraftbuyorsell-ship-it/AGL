# ADL — Agent Definition Language

## AGL integration layer

ADL describes an agent and its declared boundaries.

AGL does **not** claim to invent the Agent Definition Language concept or replace existing ADL specifications. Public ADL specifications already define machine-readable agent identity, capabilities, permissions, lifecycle and governance declarations.

Within AGL, ADL is the **agent-definition layer** that supplies declarations consumed by APL and referenced by AEL.

### AGL boundary

```
ADL
  ↓
agent definition / declared boundaries
  ↓
APL
  ↓
authorization and policy decision
  ↓
EXECUTION
  ↓
AEL
  ↓
evidence and reconstruction
```

### What AGL needs from ADL

At minimum, the execution graph should be able to reference:

- agent identity
- agent version
- provider/owner
- declared capabilities
- declared permissions or boundaries
- lifecycle state
- model/runtime metadata where available
- the exact ADL document/version used at execution time

### Important distinction

An ADL declaration is **not** runtime proof.

- ADL describes what an agent is and declares.
- APL determines what the agent may do in the current context.
- AEL records what actually happened.

### External compatibility

AGL should prefer compatibility and explicit mappings to established ADL specifications.

See the AGL Gap Analysis for the current prior-art position.
