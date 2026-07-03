## Context

Semantic Prism currently has prose specifications and a client-side mock-up that demonstrates the intended workspace composition with static data. R1 is the first real product slice: an authenticated, multi-project, read-only semantic workbench over a Git-hosted Java Struts application.

The source architecture document fixes several constraints for this design:

- The Semantic Prism Core is authoritative for users, projects, adapter bindings, snapshots, semantic objects, relationships, provenance, extraction jobs, workspace layout, and API permissions.
- Adapter services are capability providers. The core may know a project is bound to `java-struts`, but Struts parsing and extraction mechanics belong to the adapter.
- The UI must render canonical semantic objects and relationships, not Struts-specific DTOs.
- R1 is read-only. It does not generate source diffs, apply changes, create pull requests, invoke runtimes, or run production validation.
- Every persisted semantic object must have provenance unless it is explicitly synthetic/system-generated.

## Goals / Non-Goals

**Goals:**
- Establish the canonical Semantic Prism metamodel and constrained relationship vocabulary as the stable product language.
- Implement a local R1 topology with UI, core backend, PostgreSQL, Struts adapter, and sample repository.
- Support login, roles, project assignment, project selection, adapter binding, snapshots, extraction jobs, semantic persistence, provenance, source trace, and backend-driven workbench views.
- Keep source repository handling snapshot-based so semantic results are tied to an analysed commit or repository state.
- Preserve the mock-up's surface composition while replacing mock state with backend APIs and command-routed UI actions.

**Non-Goals:**
- No source modification, generated technical diffs, apply operation, pull request creation, runtime invocation, real validation orchestration, approval workflow, or change-set lifecycle.
- No production IAM, multi-tenant SaaS hardening, real-time collaboration, full Java parser correctness, full SQL lineage, graph database, or generalized multi-adapter execution.
- No direct UI calls to adapter services.
- No promotion of Struts-only concepts into the canonical Tier 1 metamodel.

## Decisions

**Backend shape: TypeScript/Node modular monolith for the core.**
Use a TypeScript/Node core service with Fastify preferred, PostgreSQL, OpenAPI/JSON Schema contracts, runtime validation, JWT authentication, and asynchronous job orchestration. This follows ADR 0001 and keeps R1 implementation consistent with the existing frontend TypeScript direction. NestJS remains deferred rather than selected now because R1 needs clear service boundaries more than a framework-heavy module system.

**Adapter shape: independently deployable Struts adapter service.**
The Struts adapter exposes only `discoverArtefacts`, `readArtefact`, and `extractSemanticObjects` in R1. Keeping it out of the core prevents Struts concepts and parsing decisions from becoming core product logic. A TypeScript adapter is acceptable initially because R1 extraction is mostly XML/JSP/Java/properties scanning and deterministic normalization; Rust remains deferred for heavier parsing or large-scale analysis.

**Contracts: OpenAPI plus JSON Schema with generated DTOs where practical.**
The core validates all adapter output before persistence. Adapter output is never trusted blindly because malformed extraction can corrupt the semantic graph. Contracts also prevent the UI from depending on substrate-specific shapes.

**Persistence: PostgreSQL as the R1 system of record.**
Use relational tables for users, projects, memberships, adapter definitions, adapter bindings, repository snapshots, artefacts, semantic objects, relationships, provenance records, extraction jobs, and workspace layouts. A dedicated graph database is deferred until query patterns prove it is needed.

**Semantic model: canonical object kinds plus constrained relationship names.**
R1 stores canonical object kinds such as `Application`, `Module`, `Screen`, `UserAction`, `ApplicationAction`, `BusinessRule`, `ValidationRule`, `Entity`, `Field`, `DataAccessOperation`, `Message`, `Artefact`, and `ProvenanceRecord`. Relationship kinds are constrained to structural, interaction, execution, rule, implementation, and provenance vocabularies. New relationship kinds require review instead of ad hoc extractor invention.

**Extraction: snapshot first, adapter second, core validation third.**
The core creates or selects a repository snapshot, asks the adapter to discover artefacts, persists the artefact catalogue, runs extraction asynchronously, validates the adapter's canonical output, and then persists semantic objects, relationships, provenance, and diagnostics. This keeps R1 repeatable and protects against repository drift.

**Business rule extraction: conservative candidate model.**
Deterministic structural objects should be marked `extracted`. Business rules inferred from Java conditions, domain fields, business-facing messages, and error paths should be marked `derived` or `AI-inferred with deterministic evidence`. AI enrichment, if used, must add labelled/enriched metadata without overwriting extracted facts.

**Frontend integration: preserve surfaces, replace data path.**
The R1 UI carries forward the shell, object explorer, impact graph, source trace, text surface, and control panel composition from the mock-up. The mock `WorkspaceContext` and local `useState` shortcut are retired in favor of Zustand store slices and a command router. R1 commands are limited to selection, source trace, artefact opening, extraction, and workspace layout persistence.

**Security: project membership enforced at API boundaries.**
JWT identity, role, and project membership checks are enforced in the core for all project-scoped APIs. Viewers may inspect assigned projects but cannot trigger extraction. Project owners and admins may configure adapter bindings and run extraction. Admins may manage users, projects, memberships, and adapter definitions.

## Risks / Trade-offs

- **Struts extraction can overfit to one sample repository** -> Build adapter tests around multiple artefact patterns and preserve diagnostics/confidence instead of pretending uncertain mappings are facts.
- **Business rule extraction can create misleading semantic claims** -> Mark inferred rules with confidence, evidence, and extraction type; require provenance for every persisted claim.
- **Canonical metamodel may be too small for future substrates** -> Use explicit substrate mapping/provenance metadata in R1 and add new Tier 1 concepts only through later spec review.
- **Relational graph queries may become awkward** -> Start with PostgreSQL relationship tables and subgraph APIs; defer graph database until observed workloads justify it.
- **Docker Compose local topology can hide deployment issues** -> Treat Compose as R1 demo/development topology, not production architecture.
- **Replacing mock state with backend data can regress UI polish** -> Keep the visual shell stable while swapping the data layer underneath, and add end-to-end demo acceptance checks.

## Migration Plan

R1 is additive. The existing mock-up remains as reference/demo code while new services and backend-driven UI paths are introduced. Implementation should proceed in phases: core skeleton, auth/projects, adapter registry/binding, Struts discovery/read APIs, extraction/persistence, query APIs, frontend integration, and demo hardening. Rollback is scoped to disabling the new R1 topology; it does not require data migration from existing production systems because none exist yet.

## Open Questions

- Final Fastify versus NestJS selection.
- Exact migration and OpenAPI generation tooling.
- Git credential storage approach beyond local demo use.
- Full Java parser choice and whether a Rust engine is needed later.
- SSE, WebSocket, or polling for extraction progress after R1.
- AI enrichment implementation and provider choice.
- R2 change-set, validation, generation, and apply models.
