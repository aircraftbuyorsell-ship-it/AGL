# A2A → AGL Adapter

Maps an A2A v1.0 task interaction into an AGL Execution Graph fragment.

A2A provides agent discovery, messages and stateful tasks. AGL records the execution/evidence context around that interaction; it does not replace A2A or validate every protocol binding.

## Mapping

- A2A Agent Card / remote agent → AGL agent
- A2A Task → AGL execution
- task status → AGL execution status
- contextId → execution attribute / evidence reference
- client agent, when declared → AGL agent
- execution → executed_by → remote agent
- execution → delegated_by → client agent
- task/context identifiers → AGL external evidence references

The adapter accepts a normalized interaction record so it can be fed by an A2A SDK, gateway, or protocol-aware middleware.

A2A v1.0 defines Agent Cards, Tasks, Messages and protocol operations independently of transport bindings. AGL preserves those identifiers as evidence references rather than inventing internal protocol semantics.
