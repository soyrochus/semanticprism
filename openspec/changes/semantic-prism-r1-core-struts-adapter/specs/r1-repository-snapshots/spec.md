## ADDED Requirements

### Requirement: Snapshot-based analysis
The system SHALL analyse repositories through explicit repository snapshots tied to project, adapter binding, branch, commit hash, creator, timestamp, and status.

#### Scenario: Snapshot is created
- **WHEN** an authorized user creates a snapshot for a project adapter binding
- **THEN** the core records the repository state and returns a snapshot id used by discovery and extraction

### Requirement: Artefact catalogue
The system SHALL persist discovered artefacts with project id, snapshot id, adapter binding id, path, artefact type, language, content hash, size, and metadata.

#### Scenario: Discovery returns artefacts
- **WHEN** the Struts adapter returns discovered artefacts for a snapshot
- **THEN** the core stores them in the artefact catalogue without treating the catalogue as the semantic model

### Requirement: Read-only artefact content
The system SHALL provide read-only artefact metadata and content APIs scoped by project membership.

#### Scenario: User opens source
- **WHEN** an authorized user requests `GET /projects/:projectId/artefacts/:artefactId/content`
- **THEN** the core returns artefact content with language, encoding, and content hash without allowing modification

### Requirement: Repository drift protection
The system SHALL tie persisted semantic objects, relationships, provenance, and extraction jobs to the snapshot that produced them.

#### Scenario: Repository changes after extraction
- **WHEN** the source repository changes after a completed extraction
- **THEN** existing semantic objects still reference the original snapshot id and commit hash
