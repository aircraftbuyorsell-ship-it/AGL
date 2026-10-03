# Gaia-X → AGL Adapter

Maps Gaia-X Self-Descriptions and service-composition references into the AGL Execution Graph.

- Participant → actor
- Service Offering → service
- Resource → data/resource context
- providedBy → provider relation
- dependsOn → AGL `depends_on`
- policy → AGL `constrained_by`
- Self-Description / trust information → evidence

Gaia-X defines a Trust Framework with machine-readable, verifiable claims, identity/trust mechanisms, policies and service composition. AGL preserves those references and connects them to execution evidence without redefining Gaia-X semantics.

The adapter does not perform Gaia-X cryptographic or compliance validation. Validation remains with the applicable Gaia-X trust/compliance services.
