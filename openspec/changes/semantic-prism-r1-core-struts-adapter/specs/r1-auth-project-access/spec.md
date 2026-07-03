## ADDED Requirements

### Requirement: Authenticated sessions
The system SHALL provide login, logout, and current-user APIs backed by JWT authentication for R1 users.

#### Scenario: User logs in successfully
- **WHEN** a user submits valid credentials
- **THEN** the core returns a JWT session and `GET /auth/me` returns the authenticated user's identity and roles

#### Scenario: Unauthenticated request is rejected
- **WHEN** a request without a valid JWT calls a project-scoped API
- **THEN** the core rejects the request before returning project data

### Requirement: Project assignment visibility
The system SHALL return only projects assigned to the authenticated user.

#### Scenario: User lists projects
- **WHEN** an authenticated user calls `GET /projects`
- **THEN** the response contains only projects where the user has a project membership

### Requirement: Role permissions
The system SHALL enforce the R1 roles `admin`, `project-owner`, `analyst`, and `viewer` for visible and executable actions.

#### Scenario: Viewer cannot run extraction
- **WHEN** a `viewer` attempts to create an extraction job
- **THEN** the core rejects the request and the UI does not present extraction as an executable action

#### Scenario: Project owner can run extraction
- **WHEN** a `project-owner` assigned to the project starts extraction
- **THEN** the core authorizes the operation and creates an extraction job

### Requirement: Admin membership management
The system SHALL allow admins to create projects and manage project memberships through admin APIs.

#### Scenario: Admin assigns a user
- **WHEN** an `admin` adds a user membership to a project
- **THEN** the assigned user can see that project on the next project list request
