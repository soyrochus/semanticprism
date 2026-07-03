# Semantic Prism — State and Backend Architecture Specification

Internal working name: Semantic Prism
Scope: client-side state architecture and backend/client split
Version: 0.3

## 1. Relationship to parent specification

This document answers the open questions left in section 28 of:

`Semantic Prism — Client-Side UI Specification v0.1`
(see: specs/Semantic Prism - Client-Side UI Specification.md)

That document defines the UI surface model (Text / Canvas / Control), the workspace model, and the six conceptual layers (Shell, Workspace Manager, Surface Runtime, Context Bus, Command Router, Change-Set/Validation UI) but explicitly deferred state architecture and backend split.

This document makes those decisions. It does not re-derive the UI concepts already defined in the parent spec; it assumes them.

## 2. Guiding principle

Every synchronization problem in the parent spec (§5.4 multiple synchronized projections, §12.5 multi-panel synchronization, §21 context synchronization) has the same shape: several views render the same underlying semantic object.

The architecture in this document follows from one decision: **surfaces do not synchronize with each other. They independently render a shared store.** There is no explorer-to-canvas or canvas-to-explorer sync logic anywhere. There is one selection state and one normalized object cache; every surface is a controlled view of both.

This is the same reasoning applied at whatever scale is needed — it is what keeps the Object Explorer / Impact Graph relationship in the mock-up simple, and it is what keeps a ten-surface workspace simple.

## 3. Client-side state architecture

### 3.1 Store shape

A single reactive store (Zustand or equivalent — no Redux-style reducer tree, no MVVM class hierarchy), split into independent slices:

```text
selection        — selectedObjectId, selectedRange, hoveredId, pinnedSurfaceIds
workspace         — activeWorkspaceId, layout tree, open surfaces
changeBasket      — pending commands, active change-set id
validation        — validation run status per change-set
aiSession         — current AI context, last AI action, available actions
objectCache       — normalized semantic objects, keyed by id (read replica of backend)
```

Surfaces subscribe to only the slices they declare (parent spec §21.3). A surface that is pinned stops subscribing to `selection` until unpinned.

### 3.2 Why not MVVM

MVVM would require a ViewModel per surface instance, duplicating what the Surface Registry (parent spec §20) already declares (`contextSubscriptions`, `supportedModes`, `commands`). A plain store plus typed command functions covers the same ground without an extra class hierarchy. Local, ephemeral, non-semantic UI state (scroll position, expanded tree nodes, input drafts) stays as ordinary component state — it never belongs in the shared store.

### 3.3 The object cache is not authoritative

`objectCache` is a normalized client-side read replica of the backend semantic model, addressed by `id`. It is populated by queries and invalidated by command results and validation events. The client never treats it as the source of truth — the backend is. This matters once collaboration (§6.5) or long sessions are introduced: the client must be able to discover it is stale and refetch.

### 3.4 Layout state is a separate axis from semantic state

The Window Manager's layout tree (parent spec §6.3) is serialized and persisted independently of `selection`/`objectCache`. "Which panel is where" and "what is selected" must never be merged into one state object — conflating them is the most common way this kind of architecture becomes hard to reason about.

### 3.5 Commands are the only mutation path

No component writes to `objectCache`, `changeBasket`, or `validation` directly. Every mutation is a call through a Command Router function:

```text
dispatchCommand({
  command: "ProposeBusinessRuleChange",
  target: "rule.order.creditLimit",
  payload: { ... }
})
```

The router sends the command to the backend, and the backend's response (accepted command + resulting change-set delta) is what updates the store. This is what makes "review before mutation" (parent spec §5.6) structural rather than a convention a component author could forget.

## 4. Backend architecture: generic core, custom substrate adapters

The backend splits along one seam: concepts true for any target system, versus logic specific to a given legacy/technical substrate (LANSA, COBOL, RPG, generated Java, agentic runtime config, greenfield models, etc).

### 4.1 Generic core (reusable across projects and substrates)

```text
Semantic Object Store       — entity/relationship graph, query API, versioned
Command Router / Change-Set — state machine: draft → ready → approved → validated → applied
Validation Orchestrator     — runs pluggable validators, tracks status/evidence, generic to all substrates
Workspace/Layout Service    — persistence for layouts, templates, per-role/user defaults
AI Orchestration            — prompt/tool harness, evidence assembly, confidence handling
Surface & Command Schema    — registry enforcement, permission boundaries for AI- and human-issued actions
Provenance Store            — source-mapping records, independent of which extractor produced them
```

### 4.2 Custom, per-substrate plugins

```text
Extractors   — parse a given substrate (LANSA, COBOL, RPG, ...) into the generic semantic model
Generators   — turn an accepted semantic change back into a concrete artefact diff for that substrate
Validators   — substrate-specific checks (compiles, platform test runner, schema checks)
Language grammars — CodeMirror packages for that substrate's source view (client-side, loaded per project)
Curated panels     — hand-built control surfaces only where a substrate needs bespoke UX
```

### 4.3 The contract between the two halves

The generic core never references a specific substrate. It only knows three plugin interfaces:

```text
Extractor.extract(rawArtefact) -> SemanticObject[]
Generator.generate(semanticChange, targetArtefacts) -> ArtefactDiff[]
Validator.run(semanticChange, context) -> ValidationResult
```

Onboarding a new legacy platform means implementing these three interfaces against the existing semantic model schema — the core, Command Router, Change-Set state machine, and UI do not change. If the semantic model schema ever leaks a substrate-specific concept, every future adapter inherits that bias, so the schema must be validated against at least two dissimilar substrates before being treated as stable.

## 5. Data flow examples

### 5.1 Selection sync (explorer, graph, or any surface)

```text
User clicks any surface bound to object X
  -> selection.selectedObjectId = X
  -> objectCache.get(X) already present, or triggers a query
  -> every subscribed surface re-renders from selection + objectCache
  -> no surface-to-surface message is sent
```

### 5.2 Propose a change

```text
User submits Change Proposal form
  -> dispatchCommand(ProposeBusinessRuleChange, ...)
  -> Command Router -> backend Command handler
  -> backend validates permission, appends command to draft change-set
  -> response updates changeBasket + objectCache (affected objects marked "proposed")
  -> Bottom Dock's Diff tab derives its content from objectCache, not from a local edit buffer
```

### 5.3 Run validation

```text
User clicks "Run validation"
  -> dispatchCommand(RunValidation, { changeSetId })
  -> Validation Orchestrator dispatches to the relevant substrate Validator(s)
  -> status pushed to client (poll or SSE/WebSocket) into validation slice
  -> UI never talks to a substrate validator directly
```

## 6. Answers to the parent specification's open questions (§28)

### 6.1 What is the canonical client-side state architecture?

A single reactive store (Zustand-equivalent) split into independent slices (§3.1), read via selector hooks. No global reducer tree, no per-surface class hierarchy.

### 6.2 Do we use MVVM explicitly, or a React store/event model?

React store/event model. See §3.2 for why MVVM would duplicate the Surface Registry's job.

### 6.3 What is the exact semantic model contract exposed to the UI?

A normalized entity graph, one shape regardless of substrate:

```text
{
  id: string
  kind: string            // e.g. "BusinessRule", "Field", "Screen"
  label: string
  attributes: Record<string, unknown>
  relationships: { kind: string, targetId: string }[]
  provenance: ProvenanceRef[]
  validationRefs: string[]
}
```

Fetched through a generic query API: get-by-id, get-related, get-subgraph-by-traversal. The UI never receives a substrate-specific shape; extractors normalize into this contract server-side (§4.3).

### 6.4 How are semantic commands represented?

A typed envelope, matching the examples already in the parent spec (§9.6, §11.4):

```json
{
  "command": "ProposeBusinessRuleChange",
  "target": "rule.order.creditLimit",
  "payload": { "...": "..." },
  "issuedBy": "user | ai-agent",
  "timestamp": "..."
}
```

Commands are the only mutation path (§3.5).

### 6.5 How are changes persisted?

The generic Change-Set service (§4.1) stores an ordered, append-only list of accepted commands per change-set id, versioned, with the review states already defined in parent spec §17 (`draft`, `ready-for-review`, ... `merged/applied`). Append-only rather than overwrite-in-place, so audit history and provenance (parent spec §16, §17) fall out of the persistence model for free rather than needing a separate audit log.

### 6.6 How does the AI request surface creation?

The AI emits a Surface Descriptor (the JSON shape already defined in parent spec §8/§22.3). The Workspace Manager validates the descriptor against the Surface Registry (§20) before instantiating anything. The AI never gets a code-execution path — only a schema-validated descriptor path.

### 6.7 What is the security model for agentic UI?

AI-issued commands and AI-issued surface descriptors pass through the same permission check as human-issued ones, enforced at the Command Router and at Surface Registry validation — not inside the AI orchestration layer. There is no separate, weaker permission path for AI actions (parent spec §24, §14.5).

### 6.8 How are source mappings represented?

A Provenance Store record, kept in the generic core rather than inside any given extractor's output:

```text
{ semanticObjectId, sourceArtefactId, range, extractionType }
```

`extractionType` uses the vocabulary already defined in parent spec §16.1 (`extracted`, `derived`, `AI inferred`, ...). Keeping this in the generic core means provenance is queryable independent of which substrate extractor produced it.

### 6.9 How does validation status arrive at the UI?

A generic async job pattern, identical regardless of which substrate validator runs underneath: Validation Orchestrator creates a job, the client receives status via poll or push (SSE/WebSocket) into the `validation` store slice, and subscribed surfaces re-render. Substrate-specific validators are invoked by the Orchestrator, never directly by the client (§5.3).

### 6.10 Which graph renderer becomes canonical?

D3 + Dagre remains the canonical baseline (matches parent spec §19.1 and the mock-up spec), but the Surface Registry abstracts renderer choice per canvas subtype, so a future subtype (e.g. a timeline or radial layout needing a different engine) can swap renderers without the Context Bus or registry contract changing.

### 6.11 How are custom language grammars packaged?

As individual CodeMirror language-extension packages, one per substrate, registered in a client-side Language Registry (parallel in structure to the Surface Registry) keyed by artefact/content type, loaded lazily based on the project's declared substrate — not bundled globally.

### 6.12 How much of the workspace layout is user-specific versus task-specific?

Three-tier resolution at workspace-open time, in precedence order: task-type default layout (shipped) → role-level override → user-saved override. All three tiers are layout-only (§3.4) — none of them carry semantic state.

### 6.13 What belongs in the client and what must remain server-side?

See the table in §4.1/§4.2. Summary: the generic core (object store, command router, change-set state machine, validation orchestration, workspace persistence, AI orchestration, permission enforcement) is server-side and authoritative. The client owns rendering, ephemeral local UI state, and the normalized object cache as a read replica — never as the source of truth (§3.3). Substrate extractors, generators, and validators are server-side plugins; language grammars are the one substrate-specific artifact that legitimately ships to the client.

### 6.14 How is collaboration introduced later without redesigning the workspace model?

Because `selection` and `changeBasket` are already treated as server-observable state rather than private React state (they round-trip through the Command Router and query API), introducing collaboration means broadcasting changes to those same channels to other subscribed clients — it does not require redesigning the workspace or store model. The single-user version of this architecture and the collaborative version differ only in whether a given store slice has one subscriber or several.

## 7. Non-goals for this document

This document does not specify:

* the physical persistence technology (SQL/NoSQL/event store choice);
* the transport protocol details (REST vs GraphQL vs gRPC);
* authentication/authorization internals beyond "the same permission check for AI and humans";
* the concrete extractor/generator implementation for any specific substrate;
* deployment topology.

These remain open for an implementation-level architecture document.


## 8. Backend implementation language

Settled in [Semantic Prism - ADR 0001 - Backend Implementation Language.md](Semantic%20Prism%20-%20ADR%200001%20-%20Backend%20Implementation%20Language.md): the Semantic Prism core is a TypeScript/Node.js modular monolith; Rust is used selectively for independently deployable adapter services where parsing, performance, memory safety or concurrency materially justify it. That ADR is the single source of truth for the rationale, the core/adapter responsibility split, the architectural guardrails and the consequences of this choice — they are not repeated here.

The one implication specific to this document's scope: the Zustand store, Command Router and query API described in §3 run inside that TypeScript core, not in a separate service. `dispatchCommand` (§3.5) is a call into the core's HTTP API; `objectCache` (§3.3) is populated by the core's Graph Query API. Neither ever talks to a substrate adapter directly — adapters are reached only through the core (ADR 0001, "the UI may know only the semantic result").
