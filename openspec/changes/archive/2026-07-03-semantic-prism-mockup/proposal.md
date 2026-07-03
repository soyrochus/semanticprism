## Why

Semantic Prism currently exists only as prose specifications (`specs/Semantic Prism - Client-Side UI Specification.md` and `specs/Semantic Prism — Local HTML Mock-Up Specification.md`). Stakeholders and prospective clients cannot evaluate the product concept from documents alone. We need a locally runnable, visually credible, client-side-only mock-up that makes the core idea — clean semantic surfaces over complex systems, AI-assisted analysis, traceable and governed change — understandable in under a minute, without waiting for real backend, AI, or validation infrastructure to exist.

## What Changes

- Add a new Vite + React + TypeScript project (`semantic-prism-mock/`) runnable via `npm install && npm run dev`, with no backend, auth, database, real AI, or real validation engine.
- Add a single `Impact & Change Workspace` screen with four zones: top bar, left Object Explorer, center Canvas Surface (impact graph), right AI/Control column, and a bottom Text Surface dock.
- Add a scripted demo narrative: investigate the `CreditLimitValidation` business rule, preview the impact of a proposed VIP-customer credit-limit exception, create the semantic change, view a generated diff, and run a mock validation that resolves to `passed-with-warnings`.
- Add light/dark theming via CSS variables with a Material-inspired, non-generic-admin visual style.
- Add static mock datasets (graph nodes/edges, DSL/source/diff/trace text, change-set and validation content) — all client-side, no persistence.

## Capabilities

### New Capabilities
- `workspace-shell`: Top bar (logo, project/workspace selectors, search, AI status, theme toggle, presentation-mode toggle) and the overall four-zone application layout/chrome.
- `object-explorer`: Left-panel semantic object tree (mock `Retail Order Platform` hierarchy) and selection behavior that drives the rest of the workspace.
- `impact-graph-canvas`: Center Dagre/D3 impact graph — 20+ typed nodes, typed edges, zoom/pan/legend/mode toggle, and scripted highlight behavior on node selection and on "Preview impact".
- `text-surface-dock`: Bottom dock with Semantic DSL / Original Source / Generated Diff / Validation / Trace tabs, rendered via CodeMirror (or styled fallback), populated with the fixed mock content from the mock-up spec.
- `ai-control-panels`: Right-column stacked panels — AI Analysis, Change Proposal form, and Change Basket / Validation Summary.
- `mock-interaction-state`: Cross-cutting client-side state (`selectedObject`, `activeGraphMode`, `activeBottomTab`, `theme`, `changeActive`, `validationStatus`) that synchronizes Object Explorer, canvas, dock, and control panels into one coherent scripted demo.

### Modified Capabilities
- None — `openspec/specs/` currently has no existing capabilities.

## Impact

- New standalone project directory `semantic-prism-mock/` (React, TypeScript, Vite, D3.js, Dagre, CodeMirror); does not touch any existing code (repository currently has no application code, only specs and openspec tooling).
- No API, database, or auth surface introduced — everything is static, in-memory, client-side state.
- No changes to existing specs or other parts of the repo.
