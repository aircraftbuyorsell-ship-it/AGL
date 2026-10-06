# COMMAND-02B — Authority attenuation against ABOS

## Checkpoint

- Command: `COMMAND-02B` only.
- Observation timestamp: `2026-10-06T21:28:53Z`.
- AGL working branch: `agl/command-01-inventory-2026-10-06`.
- AGL input HEAD: `e8a9fe18b37a0a6ca8fedeed5e0a00f2db477f7f`.
- AGL source baseline: `9c4c5f3eb54a363faee2fdf6aaed82884bb82e80`.
- ABOS current default-branch HEAD: `005c9aeb31782f4a0fcbf00f21e30b592cc60db4`.
- ABOS historical reference: `401dabfea8db375ae65f82df4f4f1e7fea294dee`.
- Requested/recommended model: `gpt-5.6 / high`.
- Scope stop: no runtime or schema fix was implemented; COMMAND-03 was not started.

## Result

**Authority attenuation: FAIL.**

ABOS currently enforces agent/skill/workflow membership, active states,
delegation loop protection, maximum delegation depth and basic approval state
and expiry. It does not represent or enforce:

```text
child_authority ⊆ parent_authority ⊆ human_authorized_root
```

Neither `authorization_root_id` nor `parent_authorization_id` exists in the
current ABOS repository or in the tested historical reference. The current AGL
checkout also contains neither identifier. Two identifiers alone would still
be insufficient: the runtime must resolve the parent and root, validate the
chain and compare the effective scopes before the governed side effect.

Evidence scope:

- `STATIC`: **FAIL** — semantic requirements exist in AGL documents, but the
  current request/evidence/graph schemas do not define the required lineage or
  an enforceable attenuation contract.
- `REFERENCE`: **FAIL** — current and historical snapshots each pass 3 of 15
  secure characterization checks and fail 12.
- `ABOS_RUNTIME`: **BLOCKED** — no identified test/staging execution supplied
  attributable authorization records or a deployed lineage decision. No
  production action was invoked.

## Existing implementation

The current ABOS implementation has useful controls, but they enforce workflow
membership and loop safety rather than authority attenuation.

| Surface | Existing behavior | Limit |
|---|---|---|
| `checkDelegation` | Rejects a repeated agent and depth above `maxDepth`; returns an extended agent path. | Does not read a parent authorization, root, capability, resource, arguments, validity, conditions, approval or delegation rights. |
| `checkSkillPermission` | Rejects unknown/disabled agents and skills, skills not granted to the agent, and agents/skills outside a workflow. | Does not compare requested resource, tool arguments or data scope with parent authority. |
| `workflowEngine.dispatchTask` | Requires an existing run and active recipient, then applies loop/depth protection. | Queues arbitrary `requested_action` and `payload`; does not bind the claimed sender to the run or authorize the generated subgoal. Access is operator-only, but operator authentication is not delegation lineage. |
| `governedSkillGateway` | Checks skill membership, prerequisites, approval presence, retries and evidence before/after execution. | Does not require an authorization record or apply attenuation before `executeSkill`. |
| `isApprovalUsable` | Requires `approved`, `decided_by` and an unexpired record. | Does not bind approval to run, skill, action category, payload/arguments, authorization or one-time consumption. |
| Audit/task/run records | Preserve correlation, agent path, skills, inputs, outputs and selected approval references. | Cannot reconstruct a human root or parent authorization chain. |

The `workflowEngine`, `AgentApproval`, `WorkflowRun`, `WorkflowStep`,
`AgentSkill`, `AgentWorkflow`, `AgentAuditLog`, `AgentTask` and governed gateway
are functionally the same at the current and historical revisions for this
assessment. The historical Cloudflare APL gateway adds caller-supplied
authorization/delegation data to the audit response **after execution**. It does
not validate those claims and accepts `not_captured`. Current `main` has removed
even that post-execution capture.

## Characterization results

Test artifact:
[`COMMAND-02B-AUTHORITY-ATTENUATION.characterization.test.mjs`](COMMAND-02B-AUTHORITY-ATTENUATION.characterization.test.mjs).

| # | Required behavior | Current `005c9ae` | Historical `401dabf` | Finding |
|---:|---|---|---|---|
| 1 | Valid narrowed delegation | FAIL | FAIL | Acyclic path is admitted, but root/parent IDs and narrowed scope are ignored and not preserved. |
| 2 | Equal-scope delegation controlled by parent policy | FAIL | FAIL | Equal scope is admitted without checking whether the parent may delegate equal authority. |
| 3 | Privilege expansion fails closed | FAIL | FAIL | A child with extra capability and wildcard resource is admitted when path/depth are valid. |
| 4 | Nested delegation preserves root/parent continuity | FAIL | FAIL | Agent path is preserved; authorization root and immediate parent are not. |
| 5 | Generated subgoal remains bounded | FAIL | FAIL | `requested_action` and `payload` are queued without attenuation evaluation. |
| 6 | Unauthorized tool/capability/resource expansion | PARTIAL/FAIL | PARTIAL/FAIL | Undeclared skill is denied; expansion through resources or arguments of an allowed skill is accepted. |
| 7 | Approval boundary and action/argument binding | FAIL | FAIL | An approved record for a different run/skill/action/payload is considered usable. |
| 8 | Evidence and lineage reconstruction | FAIL | FAIL | Persisted records and APL evidence lack root/parent identifiers and parent/root validation decisions. |

Additional fail-closed checks also fail: authorization is not evaluated before
the governed side effect; missing/unverifiable authorization does not block the
APL executor; the delegator identity is not bound to the run; revocation,
authorization validity, replay and consumption controls are absent.

Controls confirmed as passing in both revisions:

1. circular and over-depth delegation is denied;
2. an undeclared skill is denied;
3. rejected and expired approvals are denied.

## Executed tests

Node runtime: `v24.19.0`.

```text
ABOS_SNAPSHOT_ROOT=.../current node --test \
  reference/COMMAND-02B-AUTHORITY-ATTENUATION.characterization.test.mjs
```

Result: exit `1`; 15 tests, 3 PASS, 12 FAIL.

```text
ABOS_SNAPSHOT_ROOT=.../historical node --test \
  reference/COMMAND-02B-AUTHORITY-ATTENUATION.characterization.test.mjs
```

Result: exit `1`; 15 tests, 3 PASS, 12 FAIL.

The pre-existing ABOS workflow-governance suite was also run at both exact
snapshots:

```text
node --test test/abos-workflow-governance.test.mjs
```

Current result: exit `0`; 28/28 PASS. Historical result: exit `0`; 28/28 PASS.
Those tests confirm the existing controls; they contain no authority-scope
comparison and therefore do not contradict the characterization failures.

## AGL contract gaps

AGL documents already state that delegation cannot expand authority and that
scope can contain action, resource, condition, data boundary and validity. The
machine contracts are incomplete:

- `schemas/apl-request.schema.json` leaves `delegation` open and does not require
  authorization lineage, parent/root existence or a comparable scope object;
- `schemas/ael-evidence-record.schema.json` permits generic extra fields but does
  not require root/parent lineage on delegation or authorization events;
- `schemas/agl-execution-graph.schema.json` provides an `authority` object and
  `delegated_by` relation, but no canonical parent/root authorization fields;
- current AGL prose uses AEL for evidence while older rc1 text still says ADL
  evidence. This terminology conflict must not be encoded into the fix.

## Smallest necessary implementation

This is a recorded COMMAND-06 candidate, not an implementation performed here.
It requires no new protocol or architectural layer.

1. Add one durable ABOS `AgentAuthorization` record for root and delegated
   grants. A child record must carry `authorization_id`,
   `authorization_root_id`, `parent_authorization_id`, principal, delegator,
   delegatee, effective capability/action, resources, argument/data constraints,
   conditions, validity, status/revocation, delegation rights and any bound
   approval. Root records derive from a verified human/service mandate; historical
   roots must not be fabricated.
2. Add one pure `checkAuthorityAttenuation(parent, child, request, now)` function
   to the existing governance module. Default to DENY when a record, parent,
   common root, scope dimension, validity or policy decision is absent or invalid.
   Equal scope is allowed only when parent policy permits it.
3. Call that function before `dispatchTask`, before `executeSkill`, and before the
   Cloudflare APL executor. Re-evaluate the actual action/resource/arguments at
   execution time to close the check-to-execution gap.
4. Persist both identifiers and the attenuation decision on `WorkflowRun`,
   `AgentTask`, `WorkflowStep`, `AgentAuditLog` and the AEL/Execution Graph output.
   Bind approvals to the authorization, run, action, resource, arguments and
   expiry; define replay/consumption behavior.
5. Promote the characterization cases into ABOS tests and add no-side-effect
   assertions for every denial.

## Gaps and blockers

- The parent/root authorization store and scope comparator do not exist.
- Capability names are checked, but resources, tool arguments, data access,
  conditions, validity and delegation rights are not attenuated.
- The APL gateway executes without a required verifiable authorization decision.
- Approvals are reusable across mismatched execution context.
- Current records cannot reconstruct authorization lineage forward or backward.
- No authorized non-production ABOS boundary was identified for runtime proof.

## ONE next_action

Run **COMMAND-03 for I-01 OpenTelemetry only**. Compare the official
OpenTelemetry specification/semantic conventions with the existing AGL adapter,
mapping and tests. Save an evidence-scoped audit and stop before I-02.

Recommended model/reasoning: `gpt-5.6 / medium`.

## Evidence links

- [Current ABOS revision](https://github.com/aircraftbuyorsell-ship-it/Aircraft-Buy-Or-Sell-1.0/commit/005c9aeb31782f4a0fcbf00f21e30b592cc60db4)
- [Historical ABOS reference](https://github.com/aircraftbuyorsell-ship-it/Aircraft-Buy-Or-Sell-1.0/commit/401dabfea8db375ae65f82df4f4f1e7fea294dee)
- [AGL issue #9](https://github.com/aircraftbuyorsell-ship-it/AGL/issues/9)
