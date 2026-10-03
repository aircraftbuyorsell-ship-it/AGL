# SPIFFE → AGL Adapter

Maps a normalized SPIFFE workload identity observation into an AGL Execution Graph fragment.

SPIFFE provides workload identity through SPIFFE IDs and Verifiable Identity Documents (SVIDs), with the Workload API used to retrieve identity material. AGL consumes the resulting identity evidence and binds it to governed execution; AGL does not replace SPIFFE/SPIRE trust or cryptographic validation.

## Mapping

- SPIFFE ID → AGL actor identity node
- SVID observation → AGL evidence
- execution → executed_by → SPIFFE identity
- workload/service → service node
- declared agent → agent node
- trust-domain identity → preserved external reference

The adapter expects a normalized record produced after the infrastructure identity layer has observed or validated the workload identity.

This is an evidence adapter, not a cryptographic SVID validator.
