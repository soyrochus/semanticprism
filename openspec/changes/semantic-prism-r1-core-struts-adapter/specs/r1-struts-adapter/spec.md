## ADDED Requirements

### Requirement: Discover Struts artefacts
The Struts adapter SHALL discover relevant Struts, Java, JSP, properties, validation, SQL, and test artefacts from a repository snapshot.

#### Scenario: Discovery scans repository
- **WHEN** the core calls `POST /discover` for a Struts project binding and snapshot
- **THEN** the adapter returns discovered artefacts including paths, artefact types, languages, content hashes, and diagnostics

### Requirement: Read source artefact
The Struts adapter SHALL provide read-only artefact content with content type, language, encoding, and content hash.

#### Scenario: Core reads artefact
- **WHEN** the core calls `POST /read-artefact` for a path in the repository snapshot
- **THEN** the adapter returns the file content and metadata without modifying the source repository

### Requirement: Extract canonical semantic objects
The Struts adapter SHALL map Struts/JSP/Java/properties source structures into canonical semantic objects rather than Struts-specific semantic kinds.

#### Scenario: Struts flow is extracted
- **WHEN** the adapter detects a JSP submit action, `struts-config.xml` action mapping, and Action class
- **THEN** it emits a `Screen`, `UserAction`, and `ApplicationAction` connected by canonical interaction relationships

### Requirement: Extract validation and business rule candidates
The Struts adapter SHALL extract validation rules deterministically where possible and emit business rules conservatively with confidence and evidence.

#### Scenario: Credit limit condition is found
- **WHEN** Java code checks order total against customer credit limit and emits a business-facing error message
- **THEN** the adapter emits a `BusinessRule` candidate with `reads`, `emits`, `affects` or related canonical relationships and provenance evidence

### Requirement: Emit provenance records
The Struts adapter SHALL attach provenance for emitted semantic objects and important relationships, including source artefact, source range where available, extraction type, extractor id, confidence, and evidence.

#### Scenario: Object is derived from Java source
- **WHEN** a semantic object is extracted or derived from Java source
- **THEN** the adapter includes provenance that identifies the source artefact and line range when available

### Requirement: R1 adapter capability limits
The Struts adapter SHALL NOT implement source diff generation, validation execution, apply operations, runtime invocation, or change-set mutation in R1.

#### Scenario: Unsupported endpoint is called
- **WHEN** a caller attempts a non-R1 adapter capability
- **THEN** the adapter or core reports the capability as unsupported
