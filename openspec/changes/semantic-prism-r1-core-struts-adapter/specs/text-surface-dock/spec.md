## MODIFIED Requirements

### Requirement: Original Source tab content
The Original Source tab SHALL display read-only source content for the selected object's provenance artefact, fetched from `GET /projects/:projectId/artefacts/:artefactId/content`, with source ranges highlighted where provenance is available.

#### Scenario: Source tab shows backend artefact content
- **WHEN** the user selects a semantic object with source provenance
- **THEN** the Original Source tab shows that artefact's real content read-only, with the provenanced range highlighted if available

### Requirement: Trace tab content
The Trace tab SHALL display traceability content fetched from `GET /projects/:projectId/source-trace/:objectId`: the semantic object, source artefact, line range, extraction type, confidence, and evidence signals.

#### Scenario: Trace tab shows backend provenance
- **WHEN** the user opens the Trace tab for a selected object
- **THEN** it shows that object's semantic object reference, source artefact, line range, extraction type, confidence, and evidence signals from the core's source trace API

### Requirement: Semantic DSL tab content
The Semantic DSL tab SHALL be disabled or marked as not available in R1, since R1 does not generate a semantic DSL projection.

#### Scenario: DSL tab shows unavailable state
- **WHEN** the user opens the bottom dock in R1
- **THEN** the Semantic DSL tab is disabled or visibly marked as not available, with a reason indicating it is planned for a later release

### Requirement: Generated Diff tab content
The Generated Diff tab SHALL be disabled or marked as not available in R1, since R1's command model excludes `GenerateArtefactDiff`.

#### Scenario: Diff tab shows unavailable state
- **WHEN** the user opens the bottom dock in R1
- **THEN** the Generated Diff tab is disabled or visibly marked as not available, with a reason indicating it is planned for a later release

### Requirement: Validation tab content and status transitions
The Validation tab SHALL be disabled or marked as not available in R1, since R1's command model excludes `RunValidation`.

#### Scenario: Validation tab shows unavailable state
- **WHEN** the user opens the bottom dock in R1
- **THEN** the Validation tab is disabled or visibly marked as not available, with a reason indicating it is planned for a later release
