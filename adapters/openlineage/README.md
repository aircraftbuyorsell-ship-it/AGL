# OpenLineage → AGL Adapter

Maps OpenLineage RunEvents into an AGL Execution Graph fragment without fabricating missing evidence.

OpenLineage provides machine-readable run/job/dataset lineage events. AGL preserves the external run/job/dataset identifiers and connects them to its execution, evidence and reconstruction model.

Core mapping:

OpenLineage RunEvent → AGL execution → job/dataset nodes → lineage edges → AEL evidence
