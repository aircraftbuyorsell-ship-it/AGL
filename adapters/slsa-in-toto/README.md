# SLSA / in-toto → AGL Adapter

Maps software supply-chain provenance into the AGL Execution Graph.

- source revision → code artifact
- build invocation → execution
- built artifact → output
- provenance predicate → evidence
- builder identity → actor
- subject digest → preserved integrity reference

The adapter preserves provenance identifiers and does not independently verify signatures or attestations. Verification remains the responsibility of the SLSA/in-toto trust and verification layer.

Reconstruction target:

`source → build execution → artifact → deployment → governed execution`
