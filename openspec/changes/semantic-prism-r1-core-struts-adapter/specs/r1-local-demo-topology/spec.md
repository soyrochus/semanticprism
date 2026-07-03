## ADDED Requirements

### Requirement: Docker Compose topology
The system SHALL provide a local Docker Compose topology for `semantic-prism-ui`, `semantic-prism-core`, `semantic-prism-db`, and `struts-adapter-service`.

#### Scenario: Local stack starts
- **WHEN** the user starts the R1 Docker Compose stack
- **THEN** the UI, core, database, and Struts adapter services start with network connectivity required for the demo flow

### Requirement: Seeded demo data
The system SHALL provide seed users, roles, projects, adapter definitions, memberships, and a configured sample Struts project for repeatable local demos.

#### Scenario: Seeded user logs in
- **WHEN** a seeded demo user logs in
- **THEN** the user can see only the seeded projects assigned to that user

### Requirement: Stable sample Struts repository
The system SHALL make a sample Struts repository or mounted local repository available read-only for the R1 demo.

#### Scenario: Demo extraction runs
- **WHEN** the project owner runs discovery and extraction against the sample repository
- **THEN** the operation can be repeated and produces stable semantic objects, relationships, provenance, and diagnostics

### Requirement: R1 acceptance checklist
The system SHALL include a demo acceptance checklist covering login, project assignment, binding, snapshot, discovery, extraction, semantic persistence, provenance, explorer, graph, source trace, read-only source viewing, role permissions, adapter isolation, and absence of source modification.

#### Scenario: Demo is accepted
- **WHEN** the checklist is run against the local stack
- **THEN** all R1 acceptance criteria pass or any gap is documented with a blocking/non-blocking status
