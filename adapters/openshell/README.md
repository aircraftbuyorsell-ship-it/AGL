# NVIDIA OpenShell → AGL adapter

This adapter maps runtime enforcement observations from NVIDIA OpenShell into an AGL Execution Graph fragment.

OpenShell is treated as a runtime enforcement mechanism, not as an AGL governance standard.

## Mapping

| OpenShell | AGL |
|---|---|
| Sandbox | environment |
| Effective policy | policy |
| Allow / deny decision | authorization_decision |
| Enforcement event | execution |
| Runtime evidence | evidence |
| External OpenShell event/reference | external_refs |

The adapter preserves the distinction:

APL authorization → OpenShell enforcement → actual execution → AEL evidence

OpenShell identity or policy enforcement does not by itself constitute an APL authorization decision. AGL records the runtime enforcement observation so that it can be correlated with the preceding APL decision and subsequent execution evidence.

The adapter does not perform cryptographic verification of OpenShell logs or policies. Integrity remains explicit as unknown unless verified upstream.

## Integration target

I-13 — NVIDIA OpenShell Runtime Enforcement.

Required gate:

DISCOVER → AUTHENTICATE → AUTHORIZE → EXECUTE/OBSERVE → RECORD → LINK → RECONSTRUCT
