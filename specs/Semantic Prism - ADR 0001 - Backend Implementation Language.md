# Semantic Prism — ADR 0001: Backend Implementation Language

Status: Accepted  
Date: 2026-07-03  
Scope: Semantic Prism backend implementation strategy

## Decision

The Semantic Prism core backend will be implemented as a **TypeScript / Node.js modular monolith**.

Rust will be used selectively for independently deployable adapter services and technical engines where performance, memory safety, parser correctness, concurrency or substrate-specific isolation materially matter.

In short:

```text
Semantic Core:        TypeScript / Node.js modular monolith
Adapter Fabric:       independently deployable services
Heavy adapters:       Rust preferred where technically justified
Light adapters:       TypeScript acceptable where orchestration dominates
Shared contracts:     OpenAPI / JSON Schema / generated DTOs
```

## Rationale

The Semantic Prism core is primarily an application-orchestration and semantic-governance layer. It owns project state, semantic model APIs, command handling, change baskets, immutable change sets, provenance, validation orchestration, AI orchestration, permissions, workspace persistence and the adapter registry.

Those responsibilities are schema-heavy and coordination-heavy. They will evolve rapidly while the product model is still being stabilized. TypeScript aligns with the React client, JSON-shaped semantic contracts, AI/tool orchestration, typed command envelopes, surface descriptors and schema-generated control surfaces.

Rust is better suited to substrate-heavy execution: parsing, extraction, validation, static analysis, graph processing, source scanning, binary/runtime integration and high-concurrency adapter workloads. Those are natural candidates for separate adapter services or technical engines.

The decision is therefore not “TypeScript over Rust” in general. The split is:

```text
TypeScript owns semantic product logic.
Rust owns substrate-heavy technical execution when justified.
```

## Main semantic monolith responsibilities

The TypeScript / Node.js core owns:

```text
Project Registry
User / Role / Permission Model
Semantic Object Store API
Graph Query API
Provenance Store API
Command Router
Change Basket Service
Immutable Change Set Service
Validation Orchestrator
AI Orchestration / Evidence Assembly
Workspace / Layout Persistence
Adapter Registry
Project Adapter Bindings
Event / Job Status API
```

The core is authoritative for semantic state. Adapters are never authoritative for the Semantic Prism model.

## Adapter service responsibilities

Adapter services are independently deployable capability providers. They connect Semantic Prism to concrete technical substrates.

Typical adapter capabilities:

```text
discoverArtefacts
readArtefact
extractSemanticObjects
generateArtefactDiff
runValidation
applyChangeSet
invokeRuntime
introspectSchema
```

A project may bind to multiple adapter services at once:

```text
Project: Retail Order Platform

Bindings:
  git-source:
    adapterType: git
    capabilities: discoverArtefacts, readArtefact, generateArtefactDiff, applyChangeSet

  mainframe-runtime:
    adapterType: mainframe
    capabilities: readArtefact, invokeRuntime, runValidation

  db-schema:
    adapterType: database
    capabilities: introspectSchema, readArtefact
```

The adapter may know the substrate. The semantic core may know adapter capabilities. The UI may know only the semantic result.

## Recommended implementation baseline

For the TypeScript core:

```text
Runtime:        Node.js LTS
Language:       TypeScript, strict mode
API style:      HTTP APIs with OpenAPI contracts
Validation:     runtime schema validation at every boundary
Persistence:    PostgreSQL as the initial transactional store
Events:         SSE or polling first; WebSocket only when needed
Jobs:           asynchronous job model for extraction, generation, validation and apply operations
```

Framework choice remains implementation-level. A lean Fastify-based modular monolith is the preferred default unless team structure requires a stronger enterprise framework such as NestJS.

For Rust services:

```text
Runtime:        Tokio
HTTP service:   axum or equivalent
Serialization:  serde
Observability:  tracing / OpenTelemetry
Contract style: OpenAPI / JSON Schema-compatible DTOs
```

## Required guardrails

The core must not rely on TypeScript compile-time types alone. Runtime validation is mandatory at system boundaries.

Architectural invariants:

```text
No semantic mutation without a command.
No command accepted without permission validation.
No change set mutated after commit.
No adapter result accepted without schema validation.
No AI action executed outside the command or surface-descriptor model.
No UI component talks directly to a substrate adapter.
No adapter-specific concept leaks into the canonical semantic model without explicit schema review.
```

Adapter calls that create, apply, invoke or otherwise affect target systems must be idempotent and auditable:

```text
jobId
projectId
adapterBindingId
inputSnapshotId
commandId / changeSetId
idempotencyKey
issuedBy
permissionDecisionRef
```

## Consequences

This decision optimizes for product velocity, schema evolution and architectural clarity in the semantic core, while preserving Rust for the parts where its strengths are material.

It also creates a clear service boundary:

```text
Semantic Prism Core
  owns semantic truth, commands, provenance, change sets and governance

Adapter Fabric
  owns substrate connectivity, extraction, generation, validation and runtime invocation
```

The core should initially be a modular monolith, not a distributed set of microservices. The adapters should be separately deployable from the beginning or at least designed so they can be extracted cleanly.

## Deferred decisions

The following are intentionally deferred to the implementation architecture guide:

```text
Exact TypeScript framework: Fastify vs NestJS
Exact database schema
Graph persistence strategy
Job runner implementation
Event transport: polling, SSE or WebSocket
Contract generation tooling
Adapter authentication model
Rust DTO generation approach
```
