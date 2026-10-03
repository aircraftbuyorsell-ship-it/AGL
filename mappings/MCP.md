# AGL ↔ MCP

MCP provides a protocol for connecting AI applications to tools and data sources.

AGL does not replace MCP.

AGL adds governance around MCP operations:

| MCP concern | AGL concern |
|---|---|
| Tool discovery | Capability registration |
| Tool invocation | Authorization decision |
| Tool input | Policy/context evaluation |
| Tool result | Evidence/provenance |
| Client/server identity | Actor/delegation chain |
| Execution | Trace and audit |

The key boundary is:

**MCP defines how a tool can be invoked. AGL defines whether, under which authority, and with which evidence that invocation is permitted.**
