# AGL — MCP Governance Mapping

## v0.1.0

MCP connects AI applications to tools and data sources. AGL does not replace MCP; it governs consequential MCP operations.

### Core Mapping

| MCP concern | AGL governance concern |
|---|---|
| Server/tool identity | APL actor and capability identity |
| Tool discovery | Capability registration |
| Tool invocation | Permission and policy evaluation |
| Tool input | Policy context and target scope |
| Tool result | ADL output/evidence reference |
| Errors | ADL execution failure/block record |
| Session/correlation | ADL correlation chain |

### Governed Flow

`MCP request → authenticate actor → resolve capability → evaluate APL → MCP invocation → result → ADL evidence`

A consequential MCP invocation MUST NOT execute before the applicable APL decision has been evaluated.

### Authorization

APL evaluates actor identity, requested capability, permission, target/resource, delegation chain, policy, security/trust context, human approval requirements, and execution context.

Possible outcomes are `ALLOW`, `DENY`, `REQUIRE_HUMAN_APPROVAL`, and `ESCALATE`.

### Tool Discovery Is Not Authorization

Discovering an MCP tool establishes that a capability is available. It does not establish that a particular actor is authorized to invoke it.

### Evidence

After invocation, ADL SHOULD record actor, capability/tool, authorization decision, policy version, delegation context, request/result references, execution status, provenance, and correlation identifier.

### Blocked Execution

For `DENY`, the MCP tool MUST NOT be invoked.

For `REQUIRE_HUMAN_APPROVAL`, autonomous invocation MUST remain blocked until the required approval is recorded.

For `ESCALATE`, normal autonomous execution MUST remain blocked until the escalation path resolves the action.

### Security Boundary

AGL MAY be implemented as a gateway, proxy, middleware, sidecar, MCP host integration, or runtime policy enforcement point.

The location is implementation-specific. The governance requirement is that authorization precedes consequential execution.

### Non-Goals

This mapping does not redefine MCP protocol semantics, tool schemas, transport, discovery mechanisms, or server implementation details.

### Status

MCP Governance Mapping v0.1.0 is an early open-source mapping between AGL and MCP.
