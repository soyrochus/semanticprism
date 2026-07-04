# R1 Technical Implementation Guide

This guide describes the current R1 implementation of Semantic Prism: a local, read-only semantic workbench over a sample Java Struts application. It covers the running topology, service boundaries, data contracts, routes, extraction pipeline, frontend integration, tests, and known implementation gaps.

R1 is intentionally read-only. It supports authentication, project-scoped access, adapter binding, repository snapshotting, Struts artefact discovery, semantic extraction, canonical object and relationship queries, source trace, and read-only source viewing. It does not generate diffs, run validation, apply changes, create change sets, invoke runtimes, or modify source repositories.

## Runtime And Local Topology

The local stack is defined in `docker-compose.yml` and is run with Podman in this repository.

Use:

```bash
podman compose up -d --build --force-recreate
```

Useful service URLs:

- UI: `http://localhost:5173`
- Semantic Prism Core: `http://localhost:4000`
- Struts Adapter: `http://localhost:4100`
- PostgreSQL: `localhost:5432`

The Compose file keeps Docker-compatible filenames and image references so Podman can consume standard Compose definitions. Images are fully qualified:

- `docker.io/library/postgres:16-alpine`
- `docker.io/library/node:22-alpine`

Services:

- `semantic-prism-ui`: React/Vite workbench served from `semantic-prism-mock/`.
- `semantic-prism-core`: Node/TypeScript core API built from `Dockerfile.core`.
- `struts-adapter-service`: Node/TypeScript Struts adapter built from `Dockerfile.struts-adapter`.
- `semantic-prism-db`: PostgreSQL 16 with migrations and seeds mounted read-only.

The sample repository is mounted read-only into the core and adapter containers:

```text
./sample-struts-repo:/sample-struts-repo:ro
```

The seeded adapter binding points to `/sample-struts-repo`.

## Demo Credentials

All seeded users use this local password:

```text
semantic-prism
```

Seeded accounts:

- `admin@semantic-prism.local`: global admin role and project-owner membership.
- `owner@semantic-prism.local`: project owner for the sample project.
- `analyst@semantic-prism.local`: analyst for the sample project.
- `viewer@semantic-prism.local`: read-only viewer for the sample project.

The seeded project is:

```text
prj-retail-orders
```

Display name:

```text
Retail Orders Struts
```

## Workspace Layout

The root package is an npm workspace:

```text
packages/*
semantic-prism-mock
```

Main packages:

- `packages/shared-contracts`: shared R1 DTOs, canonical kinds, relationship vocabulary, JSON Schemas, and OpenAPI document.
- `packages/core`: Semantic Prism Core API.
- `packages/struts-adapter`: read-only Java Struts adapter service.
- `semantic-prism-mock`: React/Vite frontend, now wired to the R1 core APIs.
- `sample-struts-repo`: stable local Struts fixture used for repeatable extraction.
- `infra/postgres-init`: PostgreSQL initialization wrapper that applies mounted migrations and seeds.
- `docs`: R1 acceptance checklist, known gaps, and this guide.

Root scripts:

```bash
npm run build
npm test
npm run dev:core
npm run dev:adapter
npm run dev:ui
```

`npm run build` compiles shared contracts, core, adapter, and the Vite UI.

`npm test` compiles shared contracts, core, and adapter, then runs Node tests for core and adapter:

```text
packages/core/dist/tests/*.test.js
packages/struts-adapter/dist/tests/*.test.js
```

## Shared Contracts

Shared contracts live in `packages/shared-contracts/src`.

`index.ts` defines the canonical R1 object kinds:

```text
Application
Module
Screen
UserAction
ApplicationAction
BusinessRule
ValidationRule
Entity
Field
DataAccessOperation
Message
Artefact
ProvenanceRecord
```

It also defines the constrained relationship vocabulary:

```text
contains
triggers
reads
writes
evaluates
validates
emits
affects
implemented-by
supported-by
declared-in
calls
renders
navigates-to
has-provenance
```

R1 adapter capabilities are limited to:

```text
discoverArtefacts
readArtefact
extractSemanticObjects
```

Forbidden R1 capabilities include:

```text
generateArtefactDiff
runValidation
applyChangeSet
invokeRuntime
createChangeBasket
commitChangeSet
```

The shared package also exports:

- `R1User`, `ProjectSummary`, and `ProjectStatus`.
- `AdapterDefinition`.
- `RepositorySnapshot`.
- `ArtefactRecord`.
- `SemanticObject`.
- `SemanticRelationship`.
- `ProvenanceRecord`.
- `ExtractionDiagnostic`.
- `AdapterSemanticPayload`.
- `isCanonicalObjectKind`.
- `isRelationshipKind`.
- `assertR1Capability`.
- `r1OpenApiDocument`.

`jsonSchemas.ts` and `openapi.ts` provide runtime schema/OpenAPI contract definitions used by the core contract route.

## Semantic Prism Core

The core service is a small Node HTTP service, not Fastify/NestJS. It uses the local `Router` in `packages/core/src/http/router.ts`, which supports:

- `GET`
- `POST`
- `PUT`
- path parameters such as `/projects/:projectId`
- JSON responses and error helpers
- CORS preflight through `OPTIONS`

The core app is assembled in `packages/core/src/app.ts`:

```text
registerHealthRoutes
registerContractRoutes
registerAuthRoutes
registerAdminRoutes
registerProjectRoutes
registerAdapterRoutes
registerSnapshotRoutes
registerExtractionRoutes
registerSemanticQueryRoutes
```

Configuration and logging:

- `packages/core/src/config/config.ts`
- `packages/core/src/config/logger.ts`

Important environment variables:

- `CORE_PORT`, defaulted by container to `4000`.
- `DATABASE_URL`, used by PostgreSQL connection/migration code.
- `STRUTS_ADAPTER_URL`, set in Compose to `http://struts-adapter-service:4100`.
- `SAMPLE_REPOSITORY_PATH`, set in Compose to `/sample-struts-repo`.

### Current Persistence Mode

SQL migrations and seeds are present for the intended PostgreSQL schema, but the current HTTP routes use `SeedStore` in `packages/core/src/projects/seedStore.ts` as an in-memory local-demo store.

This store contains seeded users, memberships, the sample project, adapter definition, adapter binding, repository snapshots, artefacts, semantic objects, relationships, provenance, extraction jobs, and workspace layouts.

This is an R1 implementation gap before production use. See `docs/r1-known-gaps.md`.

### PostgreSQL Schema

Migrations:

- `packages/core/migrations/001_auth_projects.sql`
- `packages/core/migrations/002_adapters.sql`
- `packages/core/migrations/003_snapshots_artefacts.sql`
- `packages/core/migrations/004_semantic_store.sql`
- `packages/core/migrations/005_extraction_jobs.sql`

Seed data:

- `packages/core/seeds/r1_demo.sql`

PostgreSQL init:

- `infra/postgres-init/001_apply_schema.sh`

Database helpers:

- `packages/core/src/db/connection.ts`
- `packages/core/src/db/migrations.ts`
- `packages/core/src/scripts/migrate.ts`

The DB connection uses a dynamic `pg` import so local code can compile in environments where database access is not exercised.

## Core HTTP API

The core exposes these route groups.

### Health And Contracts

- `GET /health`
- `GET /openapi.json`

### Authentication

Implemented in `packages/core/src/auth`.

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

Password hashing uses PBKDF2 in `password.ts`. JWT signing/verification uses local HS256 helpers in `jwt.ts`. Session routes are implemented in `session.ts`.

Auth responses include a JWT and the authenticated user with project memberships. The frontend stores this session in `localStorage` under `semantic-prism-session`.

### Authorization

Implemented in `packages/core/src/auth/authorization.ts`.

R1 roles:

- `admin`
- `project-owner`
- `analyst`
- `viewer`

Important helpers:

- `requireAdmin`
- `requireProjectAccess`
- `requireProjectManager`
- `requireExtractionRunner`
- `canRunExtraction`

Viewers can read assigned project data but cannot run extraction. Analysts and project owners can run extraction. Project owners and admins can manage project adapter bindings. Admins can manage users, projects, and memberships.

### Admin APIs

Implemented in `packages/core/src/projects/adminRoutes.ts`.

- `GET /admin/users`
- `POST /admin/users`
- `GET /admin/projects`
- `POST /admin/projects`
- `GET /admin/projects/:projectId/memberships`
- `POST /admin/projects/:projectId/memberships`
- `POST /admin/projects/:projectId/memberships/remove`

### Project APIs

Implemented in `packages/core/src/projects/projectRoutes.ts`.

- `GET /projects`
- `GET /projects/:projectId`
- `GET /projects/:projectId/status`

`GET /projects` is membership-scoped. Project status reports:

- adapter binding readiness
- snapshot availability
- latest extraction status

### Adapter APIs

Implemented in `packages/core/src/adapters/adapterRoutes.ts`.

- `GET /adapter-definitions`
- `GET /projects/:projectId/adapter-bindings`
- `POST /projects/:projectId/adapter-bindings`
- `POST /projects/:projectId/unsupported-capability`

The seeded `java-struts` adapter definition has only read-only R1 capabilities:

```text
discoverArtefacts
readArtefact
extractSemanticObjects
```

Unsupported capability requests return an R1 guardrail error.

### Snapshot And Artefact APIs

Implemented in `packages/core/src/snapshots`.

- `GET /projects/:projectId/snapshots`
- `POST /projects/:projectId/snapshots`
- `GET /projects/:projectId/artefacts`
- `GET /projects/:projectId/artefacts/:artefactId`
- `GET /projects/:projectId/artefacts/:artefactId/content`

`repositoryScanner.ts` captures a local repository snapshot, computes a tree hash, records artefacts, and protects read paths against path escape.

Artefact content reads are read-only. The core compares the current content hash with the captured artefact hash and returns `409 repository_drift` if the source file has changed since the snapshot.

### Extraction APIs

Implemented in `packages/core/src/extraction/extractionRoutes.ts`.

- `GET /projects/:projectId/extraction-jobs`
- `GET /projects/:projectId/extraction-jobs/:jobId`
- `POST /projects/:projectId/extraction-jobs`

Status values:

```text
queued
running
completed
completed-with-warnings
failed
cancelled
```

The current orchestration is synchronous inside the POST request, even though the job model uses asynchronous lifecycle states. The route creates the job, moves it to `running`, captures or reuses a snapshot, calls the adapter, validates the adapter payload, persists accepted semantic data, stores diagnostics, and returns the completed job.

The core validates adapter output before persistence:

- every object, relationship, and provenance record must match the requested project and snapshot scope
- object kinds must be canonical
- relationship kinds must be in the constrained vocabulary
- relationship endpoints must refer to emitted objects
- non-synthetic objects must have provenance

Validation is implemented in `packages/core/src/semantic/semanticValidation.ts`.

### Semantic Query APIs

Implemented in `packages/core/src/semantic/queryRoutes.ts`.

- `GET /projects/:projectId/objects`
- `GET /projects/:projectId/objects?kind=BusinessRule`
- `GET /projects/:projectId/objects/:objectId`
- `GET /projects/:projectId/objects/:objectId/related`
- `GET /projects/:projectId/subgraph`
- `GET /projects/:projectId/search?q=...`
- `GET /projects/:projectId/provenance/:objectId`
- `GET /projects/:projectId/source-trace/:objectId`
- `GET /projects/:projectId/workspace-layouts/:workspaceId`
- `PUT /projects/:projectId/workspace-layouts/:workspaceId`

Default semantic projections are filtered to the latest project snapshot so repeat extraction produces a stable current view instead of duplicating older snapshots into the UI.

Workspace layout persistence stores UI layout only. It does not mutate semantic objects or source artefacts.

## Struts Adapter Service

The adapter lives in `packages/struts-adapter`.

Entrypoints:

- `src/index.ts`
- `src/app.ts`

Configuration:

- `src/config/config.ts`

Routes:

- `GET /health`
- `POST /discover`
- `POST /read-artefact`
- `POST /extract-semantic-objects`
- `POST /generate-artefact-diff`
- `POST /run-validation`
- `POST /apply-change-set`
- `POST /invoke-runtime`

The last four endpoints return `400 unsupported_capability`.

### Discovery

Implemented in `src/discovery/discover.ts`.

The adapter walks the repository and classifies:

- Struts config XML
- `web.xml`
- validation XML
- JSP files
- Java Action classes
- Java ActionForm/form classes
- service classes
- DAO classes
- Java domain/entity classes
- properties/message files
- SQL files
- test files

Discovery returns artefact path, type, language, content hash, size, encoding, metadata, and diagnostics. Unclassified artefacts produce diagnostics instead of failing the entire discovery.

### Read Artefact

Implemented in `src/discovery/readArtefact.ts`.

The route returns content, content hash, language, encoding, and metadata. It is read-only and guards against path traversal outside the repository root.

### Semantic Extraction

Implemented in `src/extract/extract.ts`.

The adapter emits a canonical semantic payload:

- `objects`
- `relationships`
- `provenance`
- `diagnostics`

Extraction behavior:

- creates one synthetic `Application` object
- creates `Artefact` objects for discovered artefacts
- parses Struts action mappings, form beans, forwards, message resources, and validation config
- scans JSP files for screens, forms, fields, submit actions, links, and navigation candidates
- scans Java Action classes for `ApplicationAction` objects and service/DAO calls
- scans ActionForm/form classes for `Entity` and `Field` objects
- scans service and DAO methods for `DataAccessOperation` objects
- parses validation XML into `ValidationRule` objects
- parses properties files into `Message` objects
- derives a conservative `BusinessRule` candidate for the sample credit-limit check using deterministic evidence
- attaches provenance with source artefact, source range where available, extraction type, extractor id, confidence, and evidence
- emits diagnostics for parse failures, uncertain business rules, and other non-fatal issues

Relationship output uses the canonical vocabulary, including structural and traceability links such as `contains`, `triggers`, `implemented-by`, `evaluates`, and related R1 relationship kinds.

The adapter is intentionally deterministic and fixture-oriented in R1. It is not a complete Java parser.

## Sample Struts Repository

The sample fixture lives in `sample-struts-repo`.

Key files:

- `src/main/webapp/WEB-INF/web.xml`
- `src/main/webapp/WEB-INF/struts-config.xml`
- `src/main/webapp/WEB-INF/validation.xml`
- `src/main/webapp/WEB-INF/jsp/order.jsp`
- `src/main/webapp/WEB-INF/jsp/confirmation.jsp`
- `src/main/java/com/example/orders/OrderForm.java`
- `src/main/java/com/example/orders/SubmitOrderAction.java`
- `src/main/java/com/example/orders/OrderService.java`
- `src/main/java/com/example/orders/OrderDao.java`
- `src/main/java/com/example/orders/Customer.java`
- `src/main/resources/messages.properties`
- `src/main/resources/schema.sql`

The fixture is stable and read-only in the local stack. Extraction currently produces the seeded demo flow around the retail order credit-limit validation rule.

## Frontend Workbench

The frontend remains in `semantic-prism-mock`, but R1 replaces the scripted mock data path with backend-driven state for the main workbench.

Important files:

- `src/api/r1Client.ts`
- `src/store/r1Store.ts`
- `src/App.tsx`
- `src/components/WorkspaceContext.tsx`
- `src/components/TopBar.tsx`
- `src/components/ObjectExplorer.tsx`
- `src/components/ImpactGraph.tsx`
- `src/components/CodeTabs.tsx`
- `src/components/CodeSurface.tsx`
- `src/components/AiAnalysisPanel.tsx`
- `src/components/ChangeProposalPanel.tsx`
- `src/components/ChangeBasketPanel.tsx`

### API Client

`src/api/r1Client.ts` talks only to Semantic Prism Core. It never calls the Struts adapter service directly.

Default core URL:

```text
http://localhost:4000
```

Override with:

```text
VITE_CORE_API_URL
```

Client operations:

- login
- current user
- list projects
- project status
- list objects
- object detail
- subgraph
- source trace
- artefact content
- run extraction

### Zustand Store And Command Router

`src/store/r1Store.ts` uses Zustand for R1 shared state:

- selected object
- graph mode
- active bottom tab
- theme
- session
- projects
- current project
- project status
- semantic objects
- grouped semantic objects
- relationships
- selected object detail
- source trace
- artefact content
- loading/error state

Allowed R1 commands:

- `SelectObject`
- `OpenSourceTrace`
- `OpenArtefact`
- `RunExtraction`
- `SaveWorkspaceLayout`
- `ResetWorkspaceLayout`

Forbidden commands:

- `ProposeBusinessRuleChange`
- `CreateChangeBasket`
- `CommitChangeSet`
- `GenerateArtefactDiff`
- `RunValidation`
- `ApplyChangeSet`
- `ApproveChangeSet`
- `RejectChangeSet`
- `RollbackChangeSet`

Forbidden commands set a UI error and do not execute.

### UI Behavior

`App.tsx` shows a login screen when there is no session and the authenticated workbench after login.

`TopBar.tsx` includes:

- project selector from `GET /projects`
- workspace selector
- user/session area
- project status
- role/read-only indicator
- extraction action when the role permits it
- logout

`ObjectExplorer.tsx` groups backend semantic objects by canonical kind.

`ImpactGraph.tsx` renders backend semantic objects and relationships with D3 and Dagre. It no longer uses the scripted mock highlight flow.

`CodeTabs.tsx` and `CodeSurface.tsx` show backend source trace and read-only source content. Source ranges from provenance are highlighted when available. Semantic DSL, generated diff, and validation tabs are unavailable in R1.

`AiAnalysisPanel.tsx` shows selected object detail, relationships, provenance summary, confidence, evidence, and source trace actions from backend data.

`ChangeProposalPanel.tsx` and `ChangeBasketPanel.tsx` are disabled/unavailable for R1 mutation workflows.

## Acceptance And Verification

Primary verification commands:

```bash
npm run build
npm test
```

Known latest verification:

- `npm run build` passed.
- `npm test` passed 25 tests.
- Podman stack started successfully.
- Full demo flow completed from login through extraction, explorer, graph, source trace, and source viewer.
- Role behavior was verified for viewer, analyst, project owner, and admin.
- Unsupported capability checks returned the expected R1 guardrail response.
- Repeat extraction produced a stable semantic signature.
- CORS preflight and browser-style login were verified.

Observed full-flow acceptance values on the local stack:

```text
project: prj-retail-orders
job status: completed-with-warnings
objects: 31
edges: 27
trace count: 1
source bytes: 300
```

Role/provenance/repeatability verification:

```text
viewer extraction: 403
analyst extraction: completed-with-warnings
admin users API: 200
unsupported applyChangeSet: 400
all non-synthetic provenance: true
repeatable signature: true
objects: 31
```

The acceptance checklist is in `docs/r1-acceptance-checklist.md`.

## Known Gaps

The implementation is a working R1 local slice, not a production deployment.

Tracked gaps:

- Frontend coverage currently relies on TypeScript/Vite build plus backend and adapter tests. Browser-level Playwright or Vitest coverage is still needed for OpenSpec task 9.12.
- Core HTTP routes currently use the in-memory `SeedStore`; PostgreSQL migrations and seeds exist, but the routes are not yet wired directly to PostgreSQL.
- Struts extraction is deterministic and fixture-oriented. It captures the current sample patterns and emits diagnostics for uncertain business-rule candidates, but it is not a full Java/Struts parser.

See `docs/r1-known-gaps.md` for the concise current gap list.

## Operational Notes

Use Podman for local container operations in this repository:

```bash
podman compose ps
podman compose logs semantic-prism-core
podman compose logs struts-adapter-service
podman compose down
```

If `podman compose` cannot find a Compose provider, install or configure `podman-compose` on `PATH`.

The UI is intentionally isolated from the adapter. Any source trace, artefact content, or extraction action should go through Semantic Prism Core so project membership, role checks, snapshot semantics, and R1 capability guardrails stay centralized.
