# AGL ADL Integration Profile

**Role:** Agent Definition Language integration within AGL  
**Status:** Draft  
**Version:** 0.1.0

## 1. Purpose

This document defines how AGL consumes an Agent Definition Language (ADL) document.

It is an **integration profile**, not a replacement ADL language specification.

## 2. Separation of concerns

AGL uses three distinct layers:

- **ADL** — defines/describes the agent and its declared boundaries.
- **APL** — evaluates authority, policy and authorization for a concrete request.
- **AEL** — records observable execution and evidence.

The invariant is:

`ADL → APL → EXECUTION → AEL`

## 3. Minimum ADL information referenced by AGL

An AGL execution SHOULD be able to identify:

- ADL specification/version
- agent identifier
- agent version
- provider/owner
- declared capabilities
- declared permissions/boundaries
- lifecycle status
- model/runtime references where available

## 4. Runtime rule

An ADL declaration MUST NOT be interpreted as proof that an action was authorized or executed.

Runtime authority is established by APL.

Runtime execution is established by execution evidence in AEL.

## 5. Execution graph mapping

An AGL graph MAY represent the ADL document itself as an external reference:

`Agent → defined_by → ADL document/version`

The current generic execution graph schema uses external references for this purpose.

The graph SHOULD preserve the exact ADL version or document digest used for the governed execution where available.

## 6. Compatibility

AGL should map to established ADL specifications rather than redefine:

- agent identity
- capabilities
- permissions
- lifecycle
- governance declarations
- trust/attestation declarations

Where an ADL implementation provides stronger semantics than AGL requires, AGL should preserve the external reference instead of copying or weakening those semantics.

## 7. Status

This integration profile remains draft until tested against a concrete ADL document and the ABOS reference implementation.
