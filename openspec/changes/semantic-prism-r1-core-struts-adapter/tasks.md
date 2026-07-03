## 1. Core service and local topology

- [ ] 1.1 Create the R1 service layout for UI, core backend, Struts adapter, database migrations/seeds, shared contracts, and Docker Compose
- [ ] 1.2 Bootstrap the Semantic Prism Core TypeScript service with health endpoint, configuration loading, structured logging, and test runner
- [ ] 1.3 Add PostgreSQL connection management and migration tooling
- [ ] 1.4 Add OpenAPI and JSON Schema contract generation/validation plumbing
- [ ] 1.5 Create Docker Compose services for UI, core, PostgreSQL, Struts adapter, and mounted sample repository
- [ ] 1.6 Verify the local stack starts and the core health endpoint is reachable from Compose

## 2. Auth, roles, and project access

- [ ] 2.1 Add users, projects, project memberships, and role database migrations
- [ ] 2.2 Seed R1 users, roles, project memberships, and a sample Struts project
- [ ] 2.3 Implement password hashing or seeded credential verification for local R1 login
- [ ] 2.4 Implement `POST /auth/login`, `POST /auth/logout`, and `GET /auth/me` with JWT authentication
- [ ] 2.5 Implement project membership filtering for `GET /projects`
- [ ] 2.6 Implement project detail and project status API skeletons
- [ ] 2.7 Implement admin APIs for user/project membership setup
- [ ] 2.8 Add authorization middleware for admin, project-owner, analyst, and viewer checks
- [ ] 2.9 Add tests for login, project visibility, membership denial, and role-gated extraction permissions

## 3. Adapter registry and project binding

- [ ] 3.1 Add adapter definition and project adapter binding migrations
- [ ] 3.2 Seed an active `java-struts` adapter definition with R1 read-only capabilities
- [ ] 3.3 Implement adapter binding list/create APIs under project scope
- [ ] 3.4 Enforce project-owner/admin authorization for adapter binding creation
- [ ] 3.5 Add capability guardrails rejecting generation, validation, apply, runtime invocation, and change-set mutation requests in R1
- [ ] 3.6 Extend project status to report adapter binding readiness
- [ ] 3.7 Add tests for binding creation, binding denial, seeded adapter capabilities, and unsupported capability rejection

## 4. Repository snapshots and artefact catalogue

- [ ] 4.1 Add repository snapshot and artefact catalogue migrations
- [ ] 4.2 Implement snapshot creation/list APIs tied to project and adapter binding
- [ ] 4.3 Implement core-side repository snapshot metadata capture for local Git or mounted repository paths
- [ ] 4.4 Implement artefact list/detail/content APIs with project membership checks
- [ ] 4.5 Ensure artefact content access is read-only and preserves content hash, language, encoding, and metadata
- [ ] 4.6 Add tests proving semantic and artefact records remain tied to the snapshot that produced them

## 5. Semantic metamodel persistence

- [ ] 5.1 Add semantic object, semantic relationship, and provenance record migrations
- [ ] 5.2 Define shared DTOs and runtime schemas for canonical semantic objects, relationships, provenance records, and diagnostics
- [ ] 5.3 Implement allowed canonical object kind validation
- [ ] 5.4 Implement constrained relationship vocabulary validation
- [ ] 5.5 Enforce provenance presence for non-synthetic semantic objects before persistence
- [ ] 5.6 Add tests for canonical kind acceptance, substrate-specific kind rejection, relationship kind rejection, and provenance enforcement

## 6. Struts adapter service

- [ ] 6.1 Bootstrap the Struts adapter TypeScript service with health endpoint, configuration, logging, and tests
- [ ] 6.2 Implement `POST /discover` for Struts config, web.xml, JSP, Java Action, ActionForm, service, DAO, properties, validation XML, SQL, and test artefact discovery
- [ ] 6.3 Implement `POST /read-artefact` with read-only content, language, encoding, and content hash
- [ ] 6.4 Parse Struts XML configuration for action paths, Action classes, forms, forwards, validation config, and message resources
- [ ] 6.5 Scan JSP files for screens, form fields, submit/link/menu user actions, and source ranges where feasible
- [ ] 6.6 Scan Java Action and ActionForm classes for application actions, field/property usage, validation methods, service/DAO calls, and error/message emissions
- [ ] 6.7 Parse properties/message files into canonical `Message` objects
- [ ] 6.8 Map raw technical graph output to canonical `Screen`, `UserAction`, `ApplicationAction`, `ValidationRule`, `BusinessRule`, `Entity`, `Field`, `DataAccessOperation`, `Message`, and `Artefact` objects
- [ ] 6.9 Attach provenance records with source artefact, source range where available, extraction type, extractor id, confidence, and evidence
- [ ] 6.10 Emit diagnostics for unclassified artefacts, parse failures, uncertain business rule candidates, and missing provenance
- [ ] 6.11 Add adapter tests for discovery, read artefact, Struts flow extraction, validation extraction, business rule candidate extraction, provenance, and unsupported capabilities

## 7. Extraction orchestration

- [ ] 7.1 Add extraction job migration and status model
- [ ] 7.2 Implement extraction job create/list/detail APIs with project-owner/admin execution checks
- [ ] 7.3 Implement job orchestration from snapshot to adapter discovery, artefact persistence, adapter extraction, schema validation, semantic persistence, diagnostics, and final counts
- [ ] 7.4 Persist job statuses `queued`, `running`, `completed`, `completed-with-warnings`, `failed`, and `cancelled`
- [ ] 7.5 Store extraction diagnostics and expose them through job detail responses
- [ ] 7.6 Update project status with latest snapshot and extraction state
- [ ] 7.7 Add tests for successful extraction, completed-with-warnings extraction, invalid adapter payload handling, failed extraction, and viewer denial

## 8. Core query APIs

- [ ] 8.1 Implement `GET /projects/:projectId/objects` with canonical grouping/filtering support
- [ ] 8.2 Implement `GET /projects/:projectId/objects/:objectId`
- [ ] 8.3 Implement `GET /projects/:projectId/objects/:objectId/related`
- [ ] 8.4 Implement `GET /projects/:projectId/subgraph` for graph rendering
- [ ] 8.5 Implement `GET /projects/:projectId/search`
- [ ] 8.6 Implement `GET /projects/:projectId/provenance/:objectId`
- [ ] 8.7 Implement `GET /projects/:projectId/source-trace/:objectId`
- [ ] 8.8 Implement workspace layout get/save APIs without semantic mutation
- [ ] 8.9 Add API contract tests for auth, authorization, object query, subgraph, provenance, source trace, artefact content, and layout persistence

## 9. Backend-driven workbench UI

- [ ] 9.1 Add frontend API client and generated/shared DTO bindings for R1 core APIs
- [ ] 9.2 Replace mock-only shared state with Zustand store slices and command router wiring
- [ ] 9.3 Implement login screen, JWT session persistence, logout, and current-user loading
- [ ] 9.4 Implement authenticated shell with project selector, workspace selector, user/session area, project status, and role/mode indicator
- [ ] 9.5 Populate Object Explorer from backend semantic objects grouped by canonical kind
- [ ] 9.6 Populate Impact Graph from backend subgraph relationships and selected-object state
- [ ] 9.7 Populate source trace panel from backend source trace responses
- [ ] 9.8 Populate read-only source viewer from core artefact content APIs with provenance range highlighting where available
- [ ] 9.9 Update control panels to show selected object details, relationships, provenance summary, confidence, evidence, and allowed actions
- [ ] 9.10 Disable or mark unavailable future mutation actions including semantic change creation, generated diff, validation, apply, approval, rejection, and rollback
- [ ] 9.11 Ensure the UI never calls the Struts adapter service directly
- [ ] 9.12 Add frontend tests for login, project selection, object selection, graph update, source trace, read-only source viewing, disabled actions, and role-specific extraction visibility

## 10. Demo hardening and acceptance

- [ ] 10.1 Add or mount a stable sample Struts repository for local demo extraction
- [ ] 10.2 Ensure seeded project binding points at the sample repository read-only
- [ ] 10.3 Verify the full flow: login, project list, project open, snapshot, discovery, extraction, explorer, graph, source trace, and source viewer
- [ ] 10.4 Verify role behavior for viewer, analyst, project-owner, and admin
- [ ] 10.5 Verify all persisted semantic objects have provenance unless synthetic
- [ ] 10.6 Verify no source modification operation exists or executes in R1
- [ ] 10.7 Verify the sample Struts extraction is repeatable with stable semantic output
- [ ] 10.8 Create the R1 acceptance checklist document or test script covering all 19 acceptance criteria
- [ ] 10.9 Run backend, adapter, frontend, integration, and acceptance tests
- [ ] 10.10 Document any remaining deferred decisions or known non-blocking gaps before implementation is considered complete
