# Governed MCP + A2A Flow

1. Agent A receives a user request.
2. Agent A delegates a bounded task to Agent B through A2A.
3. APL validates Agent B's identity, capability, delegation scope, and applicable policy.
4. Agent B requests an MCP tool invocation.
5. APL evaluates the tool action.
6. If permitted, the tool is invoked.
7. ADL records the actor chain, policy decision, invocation, result, and evidence.
8. If the action crosses a defined risk threshold, APL requires human approval before execution.
9. The final decision and evidence remain replayable and auditable.

The separation is intentional:

**A2A = collaboration**

**MCP = tool interoperability**

**APL = authority and policy**

**ADL = evidence and audit**
