## ADDED Requirements

### Requirement: Adapter registry
The system SHALL persist adapter definitions with adapter type, display name, service endpoint, supported capabilities, status, and version.

#### Scenario: Struts adapter is registered
- **WHEN** the R1 seed data or admin setup registers the Java Struts adapter
- **THEN** the registry contains an active `java-struts` adapter with `discoverArtefacts`, `readArtefact`, and `extractSemanticObjects` capabilities

### Requirement: Project adapter binding
The system SHALL bind projects to adapter definitions with repository configuration, branch, root path, credentials reference, and binding status.

#### Scenario: Project owner creates binding
- **WHEN** a `project-owner` creates a Struts adapter binding for an assigned project
- **THEN** the core stores the binding and associates subsequent snapshots and extraction jobs with it

#### Scenario: Unauthorized binding creation is rejected
- **WHEN** an `analyst` or `viewer` attempts to create an adapter binding
- **THEN** the core rejects the request

### Requirement: Adapter capability guardrail
The system SHALL prevent R1 project bindings from exposing unsupported adapter capabilities as executable actions.

#### Scenario: Unsupported capability is requested
- **WHEN** a caller attempts `generateArtefactDiff`, `runValidation`, `applyChangeSet`, or `invokeRuntime` through an R1 adapter binding
- **THEN** the core rejects the operation as unsupported in R1

### Requirement: Project status from binding state
The system SHALL expose project status that includes adapter binding readiness, repository snapshot state, and latest extraction state.

#### Scenario: Project status is requested
- **WHEN** the UI requests `GET /projects/:projectId/status`
- **THEN** the response includes whether a binding exists, whether a snapshot is available, and the latest extraction job status
