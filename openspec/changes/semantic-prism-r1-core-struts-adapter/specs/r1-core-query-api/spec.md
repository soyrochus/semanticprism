## ADDED Requirements

### Requirement: Core API surface
The core SHALL expose R1 HTTP APIs for auth, projects, admin membership management, adapter bindings, snapshots, extraction jobs, artefacts, semantic objects, relationships, subgraphs, search, provenance, source trace, and workspace layout.

#### Scenario: API contract is generated
- **WHEN** the core service starts or builds
- **THEN** the R1 API surface is available through documented OpenAPI contracts

### Requirement: Project-scoped authorization
The core SHALL enforce project membership and role checks on all project-scoped APIs.

#### Scenario: User accesses unassigned project
- **WHEN** an authenticated user requests data for a project without membership
- **THEN** the core denies the request

### Requirement: Semantic query APIs
The core SHALL support object listing, object detail, related object lookup, subgraph query, and search for assigned projects.

#### Scenario: UI loads impact graph
- **WHEN** the UI calls `GET /projects/:projectId/subgraph`
- **THEN** the core returns canonical semantic objects and relationships suitable for graph rendering

### Requirement: Provenance and source trace APIs
The core SHALL expose provenance and source trace APIs that connect semantic objects to artefacts, source ranges, extraction type, confidence, and evidence.

#### Scenario: UI opens source trace
- **WHEN** the UI requests `GET /projects/:projectId/source-trace/:objectId`
- **THEN** the core returns the selected semantic object and its traceable source artefacts, ranges, evidence, and confidence

### Requirement: Workspace layout persistence
The core SHALL persist R1 workspace layout only, without persisting semantic mutations or source changes.

#### Scenario: User saves layout
- **WHEN** the UI saves a workspace layout
- **THEN** the core stores the layout for that project/workspace and does not alter semantic objects
