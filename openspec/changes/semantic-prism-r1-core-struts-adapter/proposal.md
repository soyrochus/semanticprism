## Why

Semantic Prism currently has a client-side mock-up and architecture prose, but no real product slice backed by authenticated users, assigned projects, repository data, semantic extraction, or provenance. R1 establishes the first working read-only semantic workbench over a Git-hosted Java Struts application so the product can prove its canonical metamodel, backend query path, and traceability loop against a real substrate.

## What Changes

- Add a backend-backed R1 topology: React UI, Semantic Prism Core service, PostgreSQL database, and read-only Struts Adapter service runnable locally through Docker Compose.
- Add real authentication, role-based access, project assignment, project selection, and project status.
- Add adapter definitions and project adapter bindings for a `java-struts` adapter with only `discoverArtefacts`, `readArtefact`, and `extractSemanticObjects` capabilities.
- Add snapshot-based repository analysis, artefact discovery, asynchronous extraction jobs, diagnostics, and persistence for artefacts, semantic objects, relationships, and provenance records.
- Add a canonical Semantic Prism metamodel and constrained relationship vocabulary used by the backend API and UI projections.
- Add a read-only Struts extraction pipeline that maps Struts/JSP/Java/properties artefacts into canonical semantic objects with provenance and confidence/evidence metadata.
- Replace the mock data path in the workbench with backend-driven object explorer, impact graph, source trace, source viewer, project status, and read-only control surfaces.
- Add explicit command and permission guardrails so R1 cannot modify source code, generate diffs, run validation, apply change sets, or invoke runtime behavior.

## Capabilities

### New Capabilities

- `r1-auth-project-access`: Login, JWT session state, roles, project assignment, project selector behavior, and permission enforcement.
- `r1-adapter-binding`: Adapter registry, `java-struts` adapter definition, project adapter binding, and project status for repository/extraction readiness.
- `r1-repository-snapshots`: Snapshot-based repository state, artefact catalogue, read-only artefact content access, and snapshot/artefact metadata.
- `r1-semantic-metamodel`: Canonical semantic object kinds, relationship vocabulary, semantic object contract, substrate-leakage guardrails, and provenance requirements.
- `r1-extraction-jobs`: Asynchronous extraction orchestration, job statuses, diagnostics, schema validation of adapter output, and persistence of extracted semantic data.
- `r1-struts-adapter`: Struts adapter API and extraction behavior for discovering artefacts, reading artefacts, parsing Struts/JSP/Java/properties sources, and emitting canonical objects, relationships, provenance, and diagnostics.
- `r1-core-query-api`: Core HTTP APIs for auth, projects, adapter bindings, snapshots, extractions, artefacts, semantic objects, relationships, subgraphs, provenance, source trace, and workspace layout persistence.
- `r1-local-demo-topology`: Local Docker Compose topology, seed users/projects/adapter definitions, sample Struts repository setup, repeatable demo path, and acceptance checklist.

### Modified Capabilities

- `workspace-shell`: Top bar gains auth/session area, project status indicator, and role/mode indicator; project selector is scoped to the authenticated user's assigned projects instead of the fixed "Retail Order Platform" mock value.
- `object-explorer`: Object tree is populated from `GET /projects/:projectId/objects` and grouped by canonical kind instead of the fixed mock hierarchy; the fixed-mock-item selection requirement is removed as inapplicable to arbitrary real projects.
- `impact-graph-canvas`: Graph is populated from `GET /projects/:projectId/subgraph` instead of the fixed mock dataset; the scripted highlight sets and the "Preview impact" overlay are removed since they belong to the mock's VIP-exception narrative, which R1 does not implement.
- `text-surface-dock`: Original Source and Trace tabs become backend-driven and read-only; Semantic DSL, Generated Diff, and Validation tabs are disabled/marked not available in R1 since they depend on commands (`GenerateArtefactDiff`, `RunValidation`) R1's command model excludes.
- `ai-control-panels`: AI Analysis panel becomes backend-driven; Change Proposal and Change Basket/Validation Summary panels are disabled/marked not available in R1 since they depend on commands (`ProposeBusinessRuleChange`, `CreateChangeBasket`, `CommitChangeSet`, `RunValidation`) R1's command model excludes.
- `mock-interaction-state`: The single shared client-side state object and local setters are replaced by Zustand store slices (`selection`, `workspace`, `changeBasket`, `validation`, `aiSession`, `objectCache`) mutated only via `dispatchCommand`/the Command Router; adds the R1 read-only command allowlist and the invariant that the UI never calls the Struts adapter service directly.

## Impact

- New application services and directories are expected for UI, core backend, PostgreSQL migrations/seeds, Struts adapter, OpenAPI/JSON Schema contracts, and Docker Compose.
- The existing `semantic-prism-mock/` behavior becomes a visual reference, but R1 replaces its mock data and local state shortcut with backend APIs, Zustand store slices, command routing, role-aware controls, and read-only source/provenance views.
- Adds durable API, database, and adapter contracts that later releases must preserve or evolve through spec changes.
- Keeps R1 intentionally read-only: no source modification, generated diffs, validation orchestration, apply operations, pull requests, runtime invocation, or AI autonomous actions.
