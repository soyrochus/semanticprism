## 1. Core service and local topology

- [x] 1.1 Create the R1 service layout for UI, core backend, Struts adapter, database migrations/seeds, shared contracts, and Docker Compose
- [x] 1.2 Bootstrap the Semantic Prism Core TypeScript service with health endpoint, configuration loading, structured logging, and test runner
- [x] 1.3 Add PostgreSQL connection management and migration tooling
- [x] 1.4 Add OpenAPI and JSON Schema contract generation/validation plumbing
- [x] 1.5 Create Docker Compose services for UI, core, PostgreSQL, Struts adapter, and mounted sample repository
- [x] 1.6 Verify the local stack starts and the core health endpoint is reachable from Compose

## 2. Auth, roles, and project access

- [x] 2.1 Add users, projects, project memberships, and role database migrations
- [x] 2.2 Seed R1 users, roles, project memberships, and a sample Struts project
- [x] 2.3 Implement password hashing or seeded credential verification for local R1 login
- [x] 2.4 Implement `POST /auth/login`, `POST /auth/logout`, and `GET /auth/me` with JWT authentication
- [x] 2.5 Implement project membership filtering for `GET /projects`
- [x] 2.6 Implement project detail and project status API skeletons
- [x] 2.7 Implement admin APIs for user/project membership setup
- [x] 2.8 Add authorization middleware for admin, project-owner, analyst, and viewer checks
- [x] 2.9 Add tests for login, project visibility, membership denial, and role-gated extraction permissions

## 3. Adapter registry and project binding

- [x] 3.1 Add adapter definition and project adapter binding migrations
- [x] 3.2 Seed an active `java-struts` adapter definition with R1 read-only capabilities
- [x] 3.3 Implement adapter binding list/create APIs under project scope
- [x] 3.4 Enforce project-owner/admin authorization for adapter binding creation
- [x] 3.5 Add capability guardrails rejecting generation, validation, apply, runtime invocation, and change-set mutation requests in R1
- [x] 3.6 Extend project status to report adapter binding readiness
- [x] 3.7 Add tests for binding creation, binding denial, seeded adapter capabilities, and unsupported capability rejection

## 4. Repository snapshots and artefact catalogue

- [x] 4.1 Add repository snapshot and artefact catalogue migrations
- [x] 4.2 Implement snapshot creation/list APIs tied to project and adapter binding
- [x] 4.3 Implement core-side repository snapshot metadata capture for local Git or mounted repository paths
- [x] 4.4 Implement artefact list/detail/content APIs with project membership checks
- [x] 4.5 Ensure artefact content access is read-only and preserves content hash, language, encoding, and metadata
- [x] 4.6 Add tests proving semantic and artefact records remain tied to the snapshot that produced them

## 5. Semantic metamodel persistence

- [x] 5.1 Add semantic object, semantic relationship, and provenance record migrations
- [x] 5.2 Define shared DTOs and runtime schemas for canonical semantic objects, relationships, provenance records, and diagnostics
- [x] 5.3 Implement allowed canonical object kind validation
- [x] 5.4 Implement constrained relationship vocabulary validation
- [x] 5.5 Enforce provenance presence for non-synthetic semantic objects before persistence
- [x] 5.6 Add tests for canonical kind acceptance, substrate-specific kind rejection, relationship kind rejection, and provenance enforcement

## 6. Struts adapter service

- [x] 6.1 Bootstrap the Struts adapter TypeScript service with health endpoint, configuration, logging, and tests
- [x] 6.2 Implement `POST /discover` for Struts config, web.xml, JSP, Java Action, ActionForm, service, DAO, properties, validation XML, SQL, and test artefact discovery
- [x] 6.3 Implement `POST /read-artefact` with read-only content, language, encoding, and content hash
- [x] 6.4 Parse Struts XML configuration for action paths, Action classes, forms, forwards, validation config, and message resources
- [x] 6.5 Scan JSP files for screens, form fields, submit/link/menu user actions, and source ranges where feasible
- [x] 6.6 Scan Java Action and ActionForm classes for application actions, field/property usage, validation methods, service/DAO calls, and error/message emissions
- [x] 6.7 Parse properties/message files into canonical `Message` objects
- [x] 6.8 Map raw technical graph output to canonical `Screen`, `UserAction`, `ApplicationAction`, `ValidationRule`, `BusinessRule`, `Entity`, `Field`, `DataAccessOperation`, `Message`, and `Artefact` objects
- [x] 6.9 Attach provenance records with source artefact, source range where available, extraction type, extractor id, confidence, and evidence
- [x] 6.10 Emit diagnostics for unclassified artefacts, parse failures, uncertain business rule candidates, and missing provenance
- [x] 6.11 Add adapter tests for discovery, read artefact, Struts flow extraction, validation extraction, business rule candidate extraction, provenance, and unsupported capabilities

## 7. Extraction orchestration

- [x] 7.1 Add extraction job migration and status model
- [x] 7.2 Implement extraction job create/list/detail APIs with project-owner/admin execution checks
- [x] 7.3 Implement job orchestration from snapshot to adapter discovery, artefact persistence, adapter extraction, schema validation, semantic persistence, diagnostics, and final counts
- [x] 7.4 Persist job statuses `queued`, `running`, `completed`, `completed-with-warnings`, `failed`, and `cancelled`
- [x] 7.5 Store extraction diagnostics and expose them through job detail responses
- [x] 7.6 Update project status with latest snapshot and extraction state
- [x] 7.7 Add tests for successful extraction, completed-with-warnings extraction, invalid adapter payload handling, failed extraction, and viewer denial

## 8. Core query APIs

- [x] 8.1 Implement `GET /projects/:projectId/objects` with canonical grouping/filtering support
- [x] 8.2 Implement `GET /projects/:projectId/objects/:objectId`
- [x] 8.3 Implement `GET /projects/:projectId/objects/:objectId/related`
- [x] 8.4 Implement `GET /projects/:projectId/subgraph` for graph rendering
- [x] 8.5 Implement `GET /projects/:projectId/search`
- [x] 8.6 Implement `GET /projects/:projectId/provenance/:objectId`
- [x] 8.7 Implement `GET /projects/:projectId/source-trace/:objectId`
- [x] 8.8 Implement workspace layout get/save APIs without semantic mutation
- [x] 8.9 Add API contract tests for auth, authorization, object query, subgraph, provenance, source trace, artefact content, and layout persistence

## 9. Backend-driven workbench UI

- [x] 9.1 Add frontend API client and generated/shared DTO bindings for R1 core APIs
- [x] 9.2 Replace mock-only shared state with Zustand store slices and command router wiring
- [x] 9.3 Implement login screen, JWT session persistence, logout, and current-user loading
- [x] 9.4 Implement authenticated shell with project selector, workspace selector, user/session area, project status, and role/mode indicator
- [x] 9.5 Populate Object Explorer from backend semantic objects grouped by canonical kind
- [x] 9.6 Populate Impact Graph from backend subgraph relationships and selected-object state
- [x] 9.7 Populate source trace panel from backend source trace responses
- [x] 9.8 Populate read-only source viewer from core artefact content APIs with provenance range highlighting where available
- [x] 9.9 Update control panels to show selected object details, relationships, provenance summary, confidence, evidence, and allowed actions
- [x] 9.10 Disable or mark unavailable future mutation actions including semantic change creation, generated diff, validation, apply, approval, rejection, and rollback
- [x] 9.11 Ensure the UI never calls the Struts adapter service directly
- [ ] 9.12 Add frontend tests for login, project selection, object selection, graph update, source trace, read-only source viewing, disabled actions, and role-specific extraction visibility

## 10. Demo hardening and acceptance

- [x] 10.1 Add or mount a stable sample Struts repository for local demo extraction
- [x] 10.2 Ensure seeded project binding points at the sample repository read-only
- [x] 10.3 Verify the full flow: login, project list, project open, snapshot, discovery, extraction, explorer, graph, source trace, and source viewer
- [x] 10.4 Verify role behavior for viewer, analyst, project-owner, and admin
- [x] 10.5 Verify all persisted semantic objects have provenance unless synthetic
- [x] 10.6 Verify no source modification operation exists or executes in R1
- [x] 10.7 Verify the sample Struts extraction is repeatable with stable semantic output
- [x] 10.8 Create the R1 acceptance checklist document or test script covering all 19 acceptance criteria
- [x] 10.9 Run backend, adapter, frontend, integration, and acceptance tests
- [x] 10.10 Document any remaining deferred decisions or known non-blocking gaps before implementation is considered complete
