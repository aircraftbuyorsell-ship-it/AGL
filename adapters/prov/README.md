# W3C PROV → AGL Adapter

Maps PROV-JSON-style entities, activities and agents into an AGL Execution Graph fragment while preserving provenance semantics and external identifiers.

W3C PROV-DM is the authoritative provenance model. AGL does not redefine it; the adapter normalizes provenance into AGL nodes, edges and evidence for reconstruction. citeturn0search0turn0search1

Core mapping:

PROV Entity / Activity / Agent → AGL data / execution / actor → PROV relation → AGL edge → evidence
