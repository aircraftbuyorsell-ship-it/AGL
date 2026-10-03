# ODRL → AGL Adapter

Maps ODRL policy expressions into AGL policy nodes and evidence.

- ODRL Policy → AGL policy
- Permission → policy rule with `permission`
- Prohibition → policy rule with `prohibition`
- Duty → policy rule with `duty`
- ODRL identifiers → preserved external references

ODRL defines permissions, prohibitions, duties and constraints as policy semantics. AGL records the mapping and evidence; APL remains responsible for the actual authorization decision.

This adapter does not execute ODRL policy evaluation and does not replace APL.
