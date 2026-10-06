# COMMAND-02 — AGL CORE / ABOS verification

## Checkpoint

- Command: `COMMAND-02` only.
- Observation date: 2026-10-06 UTC.
- Gate: AGL issue #9, `AGL-09: Execute CORE conformance tests against ABOS adapters`.
- AGL working branch: `agl/command-01-inventory-2026-10-06`.
- AGL source baseline: `9c4c5f3eb54a363faee2fdf6aaed82884bb82e80`.
- ABOS current default-branch HEAD: `005c9aeb31782f4a0fcbf00f21e30b592cc60db4`.
- Historical ABOS reference tested: `401dabfea8db375ae65f82df4f4f1e7fea294dee`.
- Requested/recommended model for this command: `gpt-5.6 / high`.
- Scope stop: COMMAND-02B was not started. No attenuation implementation or production fix was made.

## Gate result

**CORE conformance: NOT CONFORMANT.**

- `REFERENCE`: **FAIL** for the current ABOS `main`. A historical commit has a
  successful source-contract workflow, but the current branch no longer contains
  that test or workflow. Replaying the historical nine-test guard against current
  source produces three failures.
- `ABOS_RUNTIME`: **BLOCKED / NO EVIDENCE CAPTURED**. No attributable deployed
  ALLOW, DENY, approval, escalation, blocked-action or failed-action execution
  record was available in the repository, issue, workflow artifacts or identified
  test boundary. No production action was invoked.
- The historical ABOS-to-AGL adapter output is invalid against the current AGL
  Execution Graph schema and does not satisfy the reference reconstruction test.

Passing source-text checks and pure governance-unit tests are useful regression
evidence. They are not proof of governed runtime behavior.

## Issue #9 references verified

Issue #9 names these ABOS commits:

| Reference | Verified object | Result |
|---|---|---|
| `98ed6f4` | `98ed6f449513a7e68431f593257d295a1ca1e12c`, `test: add AGL CORE governance contract guards` | Exists. Introduced six static source-text guards. |
| `a5bb81d` | `a5bb81dbeba067f076eff6e720e5c7666ff657bb`, `ci: run AGL CORE conformance contract guards` | Exists. Added `.github/workflows/agl-core-conformance.yml`. Its initial run failed. |
| Later repaired reference | `401dabfea8db375ae65f82df4f4f1e7fea294dee`, merge of ABOS PR #100 | Nine source guards pass; workflow run `37211520112` succeeded. |

The successful historical workflow installed dependencies and ran:

```text
node --test test/agl-core-governance.test.mjs
```

It did not execute a deployed ABOS request, capture external side effects, validate
an AGL Execution Graph, or perform forward/backward reconstruction.

## Current-main drift

The ABOS default branch now points to `005c9aeb31782f4a0fcbf00f21e30b592cc60db4`
(`Keep sandbox version after failover divergence (BUG-1005)`). Relative to the
latest green historical CORE reference, current `main` is diverged. It no longer
contains:

- `test/agl-core-governance.test.mjs`;
- `.github/workflows/agl-core-conformance.yml`;
- `adapters/agl/abos-verification-to-agl.mjs`;
- `src/lib/serviceExecutionRecord.js`;
- `base44/functions/recordServiceExecution/entry.ts`;
- `base44/entities/ServiceExecutionRecord.jsonc`;
- the related adapter and ServiceExecutionRecord tests and documentation.

Current `main` retains `test/abos-workflow-governance.test.mjs` and
`base44/functions/_shared/workflowGovernance.mjs`. Those tests exercise a pure,
dependency-free workflow state machine. They do not cross the ABOS execution
boundary or emit AEL evidence.

## Executed checks

All local ABOS files used below were fetched by exact GitHub commit SHA into an
isolated temporary workspace. No ABOS repository content was changed.

| Check | Source under test | Result | Interpretation |
|---|---|---:|---|
| Historical CORE guard | ABOS `401dabf` | 9/9 PASS | Historical source-contract baseline only. |
| Historical guard replay | ABOS current `005c9ae` | 6/9 PASS, 3 FAIL | Current APL source lacks the expected authorization decision builder, explicit missing-authorization handling, and approved-only risk check. |
| Current workflow governance tests | ABOS current `005c9ae` | 28/28 PASS | Pure transition/policy logic; no governed runtime execution. |
| Historical adapter + SER tests | ABOS `401dabf` | 4/4 PASS | Static adapter and source-boundary assertions. |
| Historical adapter output vs current AGL schema | ABOS `401dabf` + AGL `9c4c5f3` | FAIL | Top-level `metadata` violates `additionalProperties: false`. |
| Graph integrity and reconstruction | Same generated graph | FAIL | Evidence target node and subject are unresolved; no direct execution `produces` edge; reconstructed lineage from the claimed output contains only that output; `root_policy` is absent. |

The three current-main CORE characterization failures are:

1. authorization, delegation and human approval as first-class data;
2. explicit missing-authorization behavior without fabricated identity;
3. approval-required execution accepting only an `approved` state.

## REFERENCE versus ABOS_RUNTIME evidence

| Required behavior | REFERENCE evidence | ABOS_RUNTIME evidence | Result |
|---|---|---|---|
| ALLOW | Historical source guard passes; current pure workflow happy path passes. | No attributable deployed execution and AEL record. | BLOCKED |
| DENY | Historical/current source guard finds a deny return before execution; workflow unit transition passes. | No proof that a denied request caused no side effect. | BLOCKED |
| Unauthorized capability | Manifest/source and workflow policy unit checks pass. | No attempted runtime tool/capability expansion captured. | BLOCKED |
| Human approval | Historical source guard passes; current replay fails the required decision/approval representation; pure policy tests pass. | No pending→approved execution record or approval provenance. | FAIL / BLOCKED |
| Escalation | Current workflow state-machine unit test covers `escalate`. | No escalation decision, human handoff or AEL record. | BLOCKED |
| Blocked action | Source contains denial-record logic. | No executed block with verified absence of the protected side effect. | BLOCKED |
| Failed action | Workflow failure normalization and historical SER source-boundary checks pass. | No failed governed execution linked to evidence. | BLOCKED |
| Authorization/execution linkage | Historical adapter can add an `authorized_by` edge when authorization is supplied by the caller. | No captured APL decision linked to an actual execution; adapter is absent from current `main`. | FAIL / BLOCKED |
| Forward/backward reconstruction | AGL fixture reconstruction has historical CI coverage, but the ABOS-generated graph fails the current checks. | No runtime graph was captured. | FAIL / BLOCKED |

## Evidence quality limits

- The CORE guard reads source files and matches strings. It cannot establish that
  the checked branch was deployed or that a protected side effect was prevented.
- The workflow-governance tests call pure functions with constructed inputs.
- The adapter accepts caller-supplied authorization and explicitly avoids inferring
  missing runtime fields. That is safe behavior, but it does not prove that APL ran.
- The successful Actions run is attributable to historical commit `401dabf`; there
  is no current-main CORE workflow file or equivalent current-main run.
- No production write or destructive runtime probe was authorized or attempted.

## Gaps and blockers

1. Restore or intentionally replace the dedicated CORE test and workflow on the
   current ABOS line before a current-branch CI PASS can exist.
2. Supply a non-production ABOS test boundary that records the APL decision,
   attempted action, actual outcome, side-effect observation and AEL evidence.
3. Make the ABOS graph conform to the current schema and reconstruction contract:
   resolve evidence subjects/targets, connect the execution to its output, preserve
   policy context, and remove or standardize the extra `metadata` property.
4. Capture each required decision path rather than deriving it from source text.

## ONE next_action

Run **COMMAND-02B only** against the current ABOS `main` and the verified historical
reference. Inventory the existing authorization/delegation lineage and test whether
child authority can widen beyond its parent. Record gaps for
`authorization_root_id` and `parent_authorization_id`; do not implement them yet.

Recommended model/reasoning: `gpt-5.6 / high`.

## Evidence links

- [AGL issue #9](https://github.com/aircraftbuyorsell-ship-it/AGL/issues/9)
- [ABOS CORE test commit](https://github.com/aircraftbuyorsell-ship-it/Aircraft-Buy-Or-Sell-1.0/commit/98ed6f449513a7e68431f593257d295a1ca1e12c)
- [ABOS CORE workflow commit](https://github.com/aircraftbuyorsell-ship-it/Aircraft-Buy-Or-Sell-1.0/commit/a5bb81dbeba067f076eff6e720e5c7666ff657bb)
- [Initial workflow run 37091959948 — failed](https://github.com/aircraftbuyorsell-ship-it/Aircraft-Buy-Or-Sell-1.0/actions/runs/37091959948)
- [Latest verified green reference commit](https://github.com/aircraftbuyorsell-ship-it/Aircraft-Buy-Or-Sell-1.0/commit/401dabfea8db375ae65f82df4f4f1e7fea294dee)
- [Historical green workflow run 37211520112](https://github.com/aircraftbuyorsell-ship-it/Aircraft-Buy-Or-Sell-1.0/actions/runs/37211520112)
- [ABOS PR #100](https://github.com/aircraftbuyorsell-ship-it/Aircraft-Buy-Or-Sell-1.0/pull/100)
- [Current ABOS main](https://github.com/aircraftbuyorsell-ship-it/Aircraft-Buy-Or-Sell-1.0/commit/005c9aeb31782f4a0fcbf00f21e30b592cc60db4)

