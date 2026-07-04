# Semantic Prism

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://choosealicense.com/licenses/mit/)
![Version](https://img.shields.io/badge/version-0.1-blue.svg)
![Status](https://img.shields.io/badge/status-R1%20local%20slice-blue.svg)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing--principles-of-participation)

![SemanticPrism logo ](./images/semantic-prism-logo-small.png)

> Semantic Prism is a personal research and prototype project for AI-native semantic engineering: an AI-native visual workbench that turns complex software systems into traceable text, canvas and control surfaces.


Semantic Prism is not a code editor, not a low-code tool, and not an IDE clone. It explores a semantic-workbench approach to complex implementation substrates — legacy systems, generated code, 4GL platforms, agentic runtimes, configuration-heavy systems, greenfield application models — through user-appropriate views: business-readable descriptions, visual dependency maps, process and data diagrams, source-code and pseudo-code views, generated DSL representations, forms, dashboards, review panels and more.

The core thesis: users should not have to work directly against raw implementation artefacts by default. They should work with AI-assisted semantic surfaces that remain traceable to the real underlying system, with every proposed change captured as a reviewable, governed change set — never a silent mutation.

## Core concepts

Semantic Prism is built around three bidirectional surface types, composed into task-oriented workspaces:

- **Text Surface** — source code, generated DSL, pseudo-code, configuration, diffs, logs and AI-generated explanations.
- **Canvas Surface** — dependency graphs, application maps, entity-relationship and data-flow diagrams, process flows, architecture maps and AI-generated semantic diagrams.
- **Control Surface** — forms, dashboards, review panels, validation panels, wizards and change-set/approval controls.

A **Semantic Workspace Manager** composes these surfaces into synchronized, task-oriented workspaces (e.g. *Impact Analysis Workspace*, *Business Rule Workspace*, *Change Review Workspace*). A **Context Bus** keeps selection and focus aligned across every projection of the same semantic object. A **Command Router** converts human and AI interaction into semantic commands, and every proposed modification passes through a **Change-Set and Validation** layer before anything is considered applied.

Guiding principles: semantic meaning first, implementation always traceable; every surface is a potential interaction surface, not just a viewer; the AI participates through typed, registered surface descriptors — never arbitrary generated UI; and every change is reviewable before it is treated as real.

## AI-native by design

AI is not treated as a side panel or isolated assistant in Semantic Prism. It is incorporated across the full interaction model.

AI helps analyse complex systems, explain semantic objects, reconstruct business rules, generate alternative projections, compose task-specific workspaces, create diagrams, prepare control panels, propose changes, generate validation checklists, summarize impact and support review.

The user does not interact only with raw code or static diagrams. The user works with AI-assisted semantic surfaces: text, canvas and control views that can be generated, enriched, explained and updated through governed AI interaction.

At the same time, AI does not silently mutate underlying systems. AI-created interpretations and changes remain traceable to source artefacts, evidence, semantic commands, change sets and validation results. The system is AI-native, but reviewable and governed.

## Primary users

- **Business / domain users** who need readable process and rule views without exposure to raw code.
- **Application maintainers** who move between semantic and implementation views without losing traceability.
- **Legacy / platform experts** (COBOL, LANSA, RPG, PL/SQL, generated Java, agentic runtimes, etc.) who need original-artefact truth and precise diffs.
- **Architects** reasoning about structure, dependency, risk and modernization strategy.
- **Reviewers / governance users** evaluating whether a proposed change is safe, auditable and compliant.
- **AI agents**, which participate in the UI as first-class citizens — composing workspaces and proposing changes, but only through governed, typed UI descriptors.

## This repository

This repository contains the project specification, the original local UI prototype, and the current R1 local product slice: an authenticated, read-only semantic workbench over a sample Java Struts application.

### R1 local semantic workbench

R1 adds a backend-backed local topology:

- React/Vite UI in `semantic-prism-mock/`
- Semantic Prism Core API in `packages/core/`
- shared contracts in `packages/shared-contracts/`
- read-only Struts adapter in `packages/struts-adapter/`
- PostgreSQL migrations and demo seeds under `packages/core/`
- stable sample Struts repository in `sample-struts-repo/`

Run the local stack with Podman:

```bash
podman compose up -d --build --force-recreate
```

Open:

- UI: `http://localhost:5173`
- Core health: `http://localhost:4000/health`
- Adapter health: `http://localhost:4100/health`

Seeded local login:

```text
owner@semantic-prism.local
semantic-prism
```

Other seeded users are `admin@semantic-prism.local`, `analyst@semantic-prism.local`, and `viewer@semantic-prism.local`; all use the same local password.

R1 is read-only. It supports login, project access, adapter binding, repository snapshots, Struts extraction, canonical semantic object queries, impact graph data, source trace, and read-only source viewing. It does not generate diffs, run validation, apply changes, create change sets, invoke runtimes, or modify source.

Implementation details:

- [`docs/r1-technical-implementation-guide.md`](./docs/r1-technical-implementation-guide.md)
- [`docs/r1-acceptance-checklist.md`](./docs/r1-acceptance-checklist.md)
- [`docs/r1-known-gaps.md`](./docs/r1-known-gaps.md)

### `semantic-prism-mock/` — React workbench UI

A React + TypeScript + Vite application that started as the client-side mock-up and now also serves as the R1 backend-driven workbench UI. The original visual composition remains: Canvas Surface, Text Surface, and Control Surfaces. In R1, the active data path uses Semantic Prism Core APIs instead of the old scripted narrative.

![Semantic Prism mock-up](images/mock-up.png)

Run it locally:

```bash
cd semantic-prism-mock
npm install
npm run dev
```

For the backend-driven R1 UI, run the full Podman stack from the repository root so the core and adapter services are available.

Tech stack: React, TypeScript, Vite, Zustand, D3.js (canvas rendering), Dagre (directed graph layout), CodeMirror (text surfaces).

### `packages/`

- `packages/shared-contracts/` — canonical R1 DTOs, semantic object kinds, relationship vocabulary, adapter capabilities, JSON Schema, and OpenAPI definitions.
- `packages/core/` — Semantic Prism Core API for auth, projects, adapter bindings, snapshots, extraction jobs, artefacts, semantic queries, provenance, source trace, and workspace layout.
- `packages/struts-adapter/` — read-only Java Struts adapter for discovery, artefact reading, and canonical semantic extraction.

Build and test:

```bash
npm install
npm run build
npm test
```

### `specs/`

- [`Semantic Prism - Client-Side UI Specification.md`](./specs/Semantic%20Prism%20-%20Client-Side%20UI%20Specification.md) — the parent UI specification: surface types, workspace composition, navigation, AI interaction, traceability, collaboration/review, visual design and performance requirements.
- [`Semantic Prism — Local HTML Mock-Up Specification.md`](./specs/Semantic%20Prism%20%E2%80%94%20Local%20HTML%20Mock-Up%20Specification.md) — the concrete implementation specification for the `semantic-prism-mock/` demo: tech stack, layout, mock data, scripted interactions and acceptance criteria.

### `openspec/`

Spec-driven change proposals (proposal, design, capability specs and tasks) tracked with [OpenSpec](https://github.com/Fission-AI/OpenSpec), including the change that produced the current mock-up.

## Project status

Version 0.1 / R1 — early-stage specification plus a local, read-only functional slice. The R1 stack has real auth, project-scoped APIs, adapter binding, snapshot and artefact handling, Struts extraction, semantic object persistence in the local demo store, provenance, source trace, and a backend-driven UI.

Important limits remain: no real AI integration, no governed change-set lifecycle, no source mutation, no production IAM, no production persistence wiring for HTTP routes, and no full Java parser. See [`docs/r1-known-gaps.md`](./docs/r1-known-gaps.md).

---

## Contributing & Principles of Participation

Pull requests are welcome. For major changes, open an issue first to discuss the approach.

There is an automated build and backend/adapter test suite:

```bash
npm run build
npm test
```

Browser-level frontend tests are still a known R1 gap.

Everyone is welcome to contribute: open issues, propose pull requests, share ideas, or improve documentation. Participation is open to all, regardless of background or viewpoint.

This project follows the [FOSS Pluralism Manifesto](./FOSS_PLURALISM_MANIFESTO.md), which affirms respect for people, freedom to critique ideas, and space for diverse perspectives.

---

## Copyright and License

Copyright © 2026 Iwan van der Kleijn

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/). See the [LICENSE file](./LICENSE) in the repository.
