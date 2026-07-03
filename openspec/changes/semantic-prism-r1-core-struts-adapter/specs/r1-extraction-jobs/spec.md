## ADDED Requirements

### Requirement: Asynchronous extraction jobs
The system SHALL run semantic extraction as asynchronous jobs with statuses `queued`, `running`, `completed`, `completed-with-warnings`, `failed`, or `cancelled`.

#### Scenario: Extraction is started
- **WHEN** an authorized user starts extraction for a project snapshot
- **THEN** the core creates an extraction job and exposes its status through project extraction APIs

### Requirement: Core-orchestrated extraction pipeline
The system SHALL orchestrate repository snapshot selection, artefact discovery, framework recognition, structural extraction, semantic normalization, provenance attachment, adapter output validation, and persistence.

#### Scenario: Extraction completes
- **WHEN** the adapter returns semantic objects, relationships, provenance records, and diagnostics
- **THEN** the core validates the output, persists accepted records, stores diagnostics, and updates object, relationship, and artefact counts on the job

### Requirement: Adapter output validation
The system SHALL validate adapter output against runtime schemas before persistence.

#### Scenario: Invalid adapter output
- **WHEN** the adapter returns an object, relationship, or provenance record that violates the contract
- **THEN** the core rejects or quarantines the invalid payload and records a failed or warning diagnostic without corrupting the semantic store

### Requirement: Extraction diagnostics
The system SHALL preserve extraction diagnostics for discovery, parsing, normalization, provenance, and persistence warnings or failures.

#### Scenario: Partial extraction warning
- **WHEN** the adapter cannot classify a discovered artefact or semantic candidate
- **THEN** the extraction job records a diagnostic and may complete with warnings
