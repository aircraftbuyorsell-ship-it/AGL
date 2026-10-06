# COMMAND-03 / I-02 — OpenLineage integration audit

## Checkpoint

- Command: `COMMAND-03` for `I-02 OpenLineage` only.
- Observation timestamp: `2026-10-06T22:32:47Z`.
- AGL working branch: `agl/command-01-inventory-2026-10-06`.
- AGL input HEAD: `b9a025a7171ea2229ce5ad1ff589001604f748a2`.
- AGL source baseline: `9c4c5f3eb54a363faee2fdf6aaed82884bb82e80`.
- ABOS current reference: `005c9aeb31782f4a0fcbf00f21e30b592cc60db4`.
- ABOS historical reference: `401dabfea8db375ae65f82df4f4f1e7fea294dee`.
- Requested/recommended model: `gpt-5.6 / medium`.
- Scope stop: no adapter, mapping, schema, CI or runtime fix was implemented;
  `I-03` and `COMMAND-04` were not started.

## Result

**I-02 is IMPLEMENTED as a partial single-RunEvent snapshot converter, but it is
not tested against the current OpenLineage contract and is not conformant with
the declared AGL lineage/reconstruction contract.**

The adapter preserves valid run/job/dataset identifiers, maps the six recognized
RunEvent types to an execution status, emits workflow/service/data nodes and
produces a structurally complete AGL Execution Graph object. The existing smoke
test passes, and a current-schema happy-path fixture preserves the supplied
producer and schema URL.

The verified boundary is narrower than the repository's `ADAPTER` label. The
adapter accepts invalid UUIDs, event types and timestamps; invents missing
namespaces, dataset identity, producer and an older schema URL; treats `OTHER`
and unknown event types as `running`; records every event time as `started_at`;
reverses the input `consumes` edge under AGL's normative relationship direction;
duplicates data nodes; discards facets and parent-run hierarchy; and processes
each event as an isolated graph rather than accumulating the run lifecycle. The
recorded evidence producer does not resolve to a graph node.

Evidence scope:

| Scope | Result | Basis |
|---|---|---|
| `STATIC` | **FAIL** | Code, mapping and schema exist, but required OpenLineage validation, lifecycle aggregation, facet/hierarchy preservation and AGL relationship/reconstruction semantics are incomplete or violated. |
| `REFERENCE` | **FAIL** | Existing smoke test: PASS. Focused characterization: 17 tests, 3 PASS and 14 FAIL. Neither the current nor historical verified ABOS reference contains an attributable OpenLineage integration. |
| `ABOS_RUNTIME` | **BLOCKED** | No attributable ABOS RunEvent transport, backend receipt, adapter invocation or AEL graph/reconstruction from an actual ABOS execution was available. No production action was invoked. |

Overall project status for I-02: **IMPLEMENTED (partial), not TESTED against the
current OpenLineage contract, not CONFORMANT**.

## Official source baseline

Primary sources were observed at the checkpoint time. AGL does not pin an
OpenLineage release, so the audit uses the then-current official release and
schema repository:

| Source | Observed official version/status | Audit use |
|---|---|---|
| [OpenLineage releases](https://github.com/OpenLineage/OpenLineage/releases/tag/1.53.0) | OpenLineage `1.53.0` | Current project baseline. |
| [OpenLineage JSON schema](https://github.com/OpenLineage/OpenLineage/blob/main/spec/OpenLineage.json) | Schema `$id` is `https://openlineage.io/spec/2-0-2/OpenLineage.json` | Event envelope, required fields, enums, UUID and URI/date-time formats. |
| [Object Model](https://openlineage.io/docs/spec/object-model/) | Current official specification | Run/job/dataset identities and event updates. |
| [Run Cycle](https://openlineage.io/docs/spec/run-cycle/) | Current official specification | Accumulative lifecycle and terminal-state semantics. |
| [Naming](https://openlineage.io/docs/spec/naming/) | Documentation version `1.53.0` | Namespace/name uniqueness and maintained run UUID. |
| [Facets](https://openlineage.io/docs/spec/facets/) | Current official specification | Extensible run/job/input/output metadata. |
| [ParentRunFacet](https://openlineage.io/docs/spec/facets/run-facets/parent_run/) | Current official facet contract | Direct-parent/root hierarchy and reconstruction boundary. |

Normative facts used in the audit:

- A RunEvent requires `eventTime`, `producer`, `schemaURL`, `run` and `job`;
  `run.runId` is a UUID, and job/dataset identity requires namespace and name.
- RunEvent types are `START`, `RUNNING`, `COMPLETE`, `ABORT`, `FAIL` and `OTHER`;
  `COMPLETE`, `ABORT` and `FAIL` are terminal states.
- Events are additive observations. Consumers combine events for the same run to
  obtain complete lifecycle state; a terminal event does not itself establish
  when the run started.
- Facets carry extensible metadata for runs, jobs and input/output datasets. The
  ParentRunFacet carries direct-parent/root job and run identifiers.
- The top-level schema also supports JobEvent and DatasetEvent. The existing AGL
  adapter explicitly scopes itself to RunEvent, so their absence is reported as
  broader I-02 mapping coverage not implemented, not as an undeclared parser bug.

## Contract comparison

| Area | Existing AGL behavior | Finding |
|---|---|---|
| Event envelope | Requires an object, `run.runId`, `job.name` and `eventTime`. | **PARTIAL/FAIL.** `producer`, `schemaURL` and job namespace are required by the RunEvent schema but are defaulted rather than rejected. The converter is not an HTTP event endpoint or transport receipt. |
| Run identity | Copies `run.runId` into execution and external identifiers. | **PARTIAL/FAIL.** A valid UUID is preserved, but format is not validated. The smoke fixture uses invalid `run-001`. |
| Job/dataset identity | Builds IDs from namespace and name. | **PARTIAL/FAIL.** Missing values become `unknown`, silently creating identity not present in the event. Namespace/name syntax and uniqueness are not validated. |
| Event type/status | Maps the six named values; terminal states map to completed/failed/aborted. | **FAIL.** `OTHER` and every unknown/missing value become `running`, creating an execution-state assertion that OpenLineage did not provide. |
| Lifecycle/time | Converts one event to one graph and writes `eventTime` to `execution.started_at`. | **FAIL.** A terminal event time is observation/completion time, not start time. There is no event accumulation, transition validation or `ended_at`. |
| Job/run structure | Creates workflow and execution nodes. | **PARTIAL.** Each event is a standalone snapshot. ParentRunFacet, root hierarchy and nested run reconstruction are discarded. |
| Input lineage | Emits `dataset --consumes--> execution`. | **FAIL.** AGL declares `source --relation--> target` with source as subject; therefore the semantic relationship must be `execution --consumes--> dataset`. |
| Output lineage | Emits `execution --produces--> dataset`. | **PASS** for the narrow edge direction. Field/column lineage and transformation facets are not preserved. |
| Facets | Ignores run, job, input and output facets. | **FAIL.** Schema, parent, ownership and other source metadata required for useful lineage reconstruction are lost. |
| Node identity | Appends one node for each input and output occurrence. | **FAIL.** The same dataset present as input and output creates duplicate node IDs; the graph schema alone does not enforce uniqueness. |
| Evidence | Emits one evidence record with event/run/job references. | **PARTIAL/FAIL.** Valid producer/schema values are preserved, but missing values are invented. The producer URI has no corresponding graph node, so AGL producer reconstruction fails. Event payload/facets are not preserved. |
| AGL graph/schema | Returns all required top-level graph fields. | **PARTIAL.** Structural completeness is stronger than I-01, but the adapter output is never validated against the graph schema and semantic/referential constraints are not expressed by that schema. |
| Broader OpenLineage model | Accepts only a RunEvent-shaped object. | **NOT IMPLEMENTED** for JobEvent and DatasetEvent/design-time lineage. This is outside the README's narrow RunEvent parser claim but inside the broader I-02 mapping. |
| Authorization boundary | Represents data/process lineage after an observed event. | **COMPLEMENTARY ONLY.** OpenLineage evidence does not prove APL authorization or confer authority; authorization must still precede governed execution. |
| Test/CI coverage | CI runs one assertion script after separately validating the canonical example graph. | **FAIL** for conformance. Adapter output is not schema/reconstruction validated; UUIDs, required fields, lifecycle, event enum, facets, hierarchy, uniqueness and ABOS correlation are untested. |

## Executed tests

Node runtime: `v24.19.0`.

Existing repository smoke test:

```text
node adapters/openlineage/test/openlineage-to-agl.test.mjs
```

Result: exit `0`; PASS. It verifies one synthetic terminal event and eight
surface assertions. Its run ID is not a UUID and its schema URL is `1-0-2`.

Focused audit characterization:

```text
node --test --test-reporter=dot reference/COMMAND-03-I-02-OPENLINEAGE.characterization.test.mjs
```

Result: exit `1`; 17 tests, 3 PASS and 14 FAIL.

| # | Requirement | Result | Observed behavior |
|---:|---|---|---|
| 1 | Map current-schema run/job/dataset references | PASS | Valid source identifiers are preserved. |
| 2 | Produce required top-level AGL graph fields | PASS | All seven required fields exist. |
| 3 | Preserve supplied schema URL and producer | PASS | Both appear in the evidence record. |
| 4 | Reject non-UUID run ID | FAIL | `run-001` is accepted. |
| 5 | Require job namespace | FAIL | `unknown` is substituted. |
| 6 | Require complete dataset identity | FAIL | Missing name/namespace becomes `unknown`. |
| 7 | Require producer URI | FAIL | `unknown-producer` is substituted. |
| 8 | Require schema URL | FAIL | Old `1-0-2` schema URL is substituted. |
| 9 | Reject invalid event time | FAIL | Arbitrary text is accepted as a timestamp. |
| 10 | Reject event type outside enum | FAIL | Unknown type becomes `running`. |
| 11 | Do not interpret `OTHER` as running | FAIL | Status is `running`. |
| 12 | Place terminal event time at lifecycle end | FAIL | It is written as `started_at`; `ended_at` is absent. |
| 13 | Represent execution consuming its input | FAIL | Edge direction is reversed. |
| 14 | Deduplicate a dataset used as input and output | FAIL | Duplicate node IDs are emitted. |
| 15 | Preserve ParentRunFacet hierarchy | FAIL | Parent run/job are absent. |
| 16 | Preserve dataset schema facet | FAIL | Facet content is discarded. |
| 17 | Resolve evidence producer in the graph | FAIL | No producer node exists. |

The failing characterization is diagnostic evidence. It was not added to CI and
does not change runtime behavior.

## Evidence classification

### STATIC

Verified repository artifacts:

- [adapter implementation](../adapters/openlineage/src/openlineage-to-agl.mjs);
- [adapter contract](../adapters/openlineage/README.md);
- [smoke test](../adapters/openlineage/test/openlineage-to-agl.test.mjs);
- [interoperability mapping](AGL-INTEROPERABILITY-STANDARDS-MAPPING-v1.md);
- [Execution Graph contract](AGL-EXECUTION-GRAPH-v1.md);
- [Execution Graph schema](../schemas/agl-execution-graph.schema.json);
- [reconstruction test](../test/agl-execution-graph-reconstruction.test.mjs);
- [CI workflow](../.github/workflows/agl-execution-graph-validation.yml).

STATIC evidence proves implementation intent and a narrow converter. It does not
prove official-schema interoperability, event transport, lifecycle aggregation,
ABOS use or conformance.

### REFERENCE

The committed smoke fixture passes, while the current-schema characterization
fails 14 of 17 requirements. The previously verified current and historical ABOS
snapshots contain no OpenLineage-specific adapter invocation, RunEvent emission,
schema URL, event transport or lineage backend integration.

REFERENCE evidence therefore remains FAIL. A synthetic event transformed in
memory is not ABOS runtime evidence.

### ABOS_RUNTIME

No attributable runtime chain was available for:

```text
ABOS governed request
→ OpenLineage RunEvent emission
→ transport/backend receipt
→ AGL adapter conversion
→ schema/reconstruction validation
→ AEL evidence linked to authorization and execution
```

ABOS_RUNTIME is BLOCKED. This audit did not query or mutate production systems.

## Gaps and blockers

- No pinned OpenLineage release/schema and no HTTP event transport contract make
  the integration boundary incomplete and non-reproducible.
- Required fields, UUID/URI/date-time formats, event enum and dataset identity do
  not fail closed.
- Per-event conversion does not reconstruct the cumulative run lifecycle and can
  misstate terminal event time as start time.
- `OTHER` and unknown event types create unsupported `running` claims.
- Facets, parent/root hierarchy and broader JobEvent/DatasetEvent coverage are
  absent.
- Input lineage direction violates AGL's normative subject/object relationship
  rule; duplicate nodes and unresolved evidence producer break reconstruction
  invariants not enforced by the JSON schema.
- CI does not validate adapter output against the AGL schema, official OpenLineage
  fixtures or forward/backward reconstruction.
- No ABOS runtime event/export/backend/graph chain is attributable.

## Changed

Added this audit, its worklog checkpoint and one focused characterization test.
No adapter, mapping, schema, CI, ABOS code or production/runtime behavior changed.

## ONE next_action

Run **COMMAND-03 for I-03 W3C PROV only**. Use official W3C Recommendations and
official repositories, compare them with the existing AGL PROV adapter, mapping,
schemas and tests, keep `STATIC` / `REFERENCE` / `ABOS_RUNTIME` separate, save the
checkpoint, and stop before I-04 and COMMAND-04.

Recommended model/reasoning: `gpt-5.6 / medium`.
