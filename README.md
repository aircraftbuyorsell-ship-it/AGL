# AGL — Agent Governance Layer

**The governance layer above MCP and A2A.**

AGL is an open architecture for governing AI agent systems across interoperability, authorization, execution, evidence, and human oversight.

> MCP connects agents to tools. A2A connects agents to agents. APL governs what they are allowed to do. AEL proves what happened.

## Core layers

- **MCP** — agent ↔ tool interoperability
- **A2A** — agent ↔ agent interoperability
- **APL** — Agent Policy Layer: identity, capability, authorization, delegation, policy, workflow, approval, escalation
- **AEL** — Agent Evidence Layer: actor chain, execution trace, provenance, evidence, decision records, replay, audit

## Design goals

1. Explicit authorization before consequential actions.
2. Least-privilege capabilities and scoped delegation.
3. Human approval gates for defined risk classes.
4. Traceable execution and evidence.
5. Explainable policy decisions and replayable workflows.
6. Compatibility with existing MCP and A2A systems.

## Architecture

**Authorization precedes execution. Evidence follows execution.**

AGL does not replace MCP or A2A. It provides governance and evidence around them.

## Origin

AGL originated from work on ABOS (Aircraft Buy Or Sell) and is developed as an implementation-neutral open architecture.

## Status

Early open-source architecture. Specifications are intentionally small and implementation-neutral.

## License

Apache License 2.0
