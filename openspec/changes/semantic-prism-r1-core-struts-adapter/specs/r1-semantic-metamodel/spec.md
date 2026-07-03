## ADDED Requirements

### Requirement: Canonical semantic object kinds
The system SHALL use the R1 canonical semantic object kinds for backend persistence and default UI projections.

#### Scenario: Adapter emits canonical objects
- **WHEN** the adapter maps Struts artefacts into semantic output
- **THEN** emitted objects use canonical kinds such as `Application`, `Module`, `Screen`, `UserAction`, `ApplicationAction`, `BusinessRule`, `ValidationRule`, `Entity`, `Field`, `DataAccessOperation`, `Message`, or `Artefact`

### Requirement: Substrate-specific concepts remain mappings
The system SHALL keep Struts-only, Java-only, JSP-only, Git-only, and other substrate-only concepts out of the canonical Tier 1 metamodel.

#### Scenario: Struts Action is extracted
- **WHEN** the adapter detects a Struts Action class
- **THEN** the persisted semantic object kind is `ApplicationAction` and Struts-specific details are stored as mapping/provenance metadata

### Requirement: Constrained relationship vocabulary
The system SHALL restrict persisted relationship kinds to the R1 structural, interaction, execution, rule, implementation, and provenance vocabularies.

#### Scenario: Extractor needs a relationship
- **WHEN** the adapter emits a relationship between semantic objects
- **THEN** the relationship kind is one of the reviewed R1 relationship names such as `contains`, `triggers`, `reads`, `evaluates`, `validates`, `implemented-by`, or `supported-by`

### Requirement: Provenance for semantic claims
The system SHALL require every persisted semantic object to have at least one provenance record unless it is explicitly marked synthetic or system-generated.

#### Scenario: Semantic object is persisted
- **WHEN** the core persists a non-synthetic semantic object
- **THEN** at least one provenance record links it to source artefact, extraction type, extractor id, confidence, and evidence where available

### Requirement: Semantic object API contract
The system SHALL expose normalized semantic objects with project id, snapshot id, kind, label, attributes, relationships, provenance references, and validation references where applicable.

#### Scenario: UI loads object detail
- **WHEN** the UI requests a semantic object detail
- **THEN** the response contains canonical fields and does not require the UI to parse Struts-specific adapter structures
