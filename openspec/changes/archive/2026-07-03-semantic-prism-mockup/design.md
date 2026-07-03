## Context

Semantic Prism's product concept is defined in `specs/Semantic Prism - Client-Side UI Specification.md` (semantic workspaces, text/canvas/control surfaces, traceability, change-set governance). This change implements the concrete mock-up defined in `specs/Semantic Prism — Local HTML Mock-Up Specification.md`: a single scripted, client-side-only demo that makes that concept tangible for stakeholder and client presentations. The mock-up spec is unusually prescriptive — it already fixes the tech stack, repository layout, mock datasets, layout proportions, color roles, and scripted interaction sequence. This design doc records the decisions implied by that spec plus the few genuinely open ones (primarily how to decompose the single spec document into openspec capabilities).

There is currently no application code in this repository — `semantic-prism-mock/` is a new, self-contained project.

## Goals / Non-Goals

**Goals:**
- Demonstrate all three surface types (text, canvas, control) and the workspace composition model from the parent spec, through one coherent scripted narrative (CreditLimitValidation → VIP exception → diff → mock validation).
- Be visually credible enough for a client-facing demo in under one minute of viewing.
- Run locally with zero backend/auth/DB dependencies (`npm install && npm run dev`).
- Keep code simple and inspectable: static mock data modules, no over-engineered state management.

**Non-Goals** (per parent mock-up spec §16):
- No backend APIs, real AI calls, real parser/extractor, real validation engine, authentication, database persistence, or Git integration.
- No full window/docking manager, no dynamic schema-generated forms, no full MVVM/state architecture.
- No other workspace templates from the parent spec beyond `Impact & Change Workspace`.
- No production-grade accessibility completeness or mobile layout.

## Decisions

**Capability decomposition.** The mock-up spec is one linear document; openspec requires discrete capabilities with their own requirement/scenario specs. Decomposition follows the mock-up spec's own component boundaries (§5 repository structure) rather than introducing new boundaries:
- `workspace-shell` (§7, §8, §14) — chrome and layout zones, theming toggle, presentation mode.
- `object-explorer` (§9) — tree data and selection.
- `impact-graph-canvas` (§10) — the visually dominant surface; kept separate because it has the largest, most detailed requirement set (node/edge types, layout, scripted highlighting).
- `text-surface-dock` (§12) — the five tabbed text surfaces, since they share one dock and one CodeMirror integration.
- `ai-control-panels` (§11) — the three right-column control surfaces, since they share the right column and act as one control cluster.
- `mock-interaction-state` (§13) — pulled out as its own capability because it is the cross-cutting contract (shared state shape and required behaviours) that the other five capabilities all depend on; keeping it separate avoids duplicating the same state-transition requirements inside multiple capability specs.

**Tech stack** — React + TypeScript + Vite, D3.js (rendering/zoom/pan/transitions) + Dagre (directed layout) for the canvas, CodeMirror for text surfaces. This is fixed by the mock-up spec §4/§19 of the parent spec and is not re-litigated here; it matches the parent spec's recommended client stack, so the mock-up stays representative of the real product's likely direction rather than a throwaway prototype.

**State management** — plain React state (useState/useReducer) at the top of `App.tsx` / `ImpactChangeWorkspace.tsx` holding the six fields listed in mock-up spec §13, passed down via props/context. No Redux/Zustand: the parent spec explicitly leaves state architecture as an open question (§28.2) and the mock-up spec says not to over-engineer (§16, §17). A single shared context object is sufficient for one screen with six state fields.

**CodeMirror fallback** — mock-up spec §12 allows a styled `<pre>`/code-block fallback if CodeMirror integration proves heavy. Decision: attempt CodeMirror first (per acceptance criteria intent of visual credibility); if it materially slows delivery, fall back to styled read-only blocks without renegotiating the requirement, since the *content and behavior* (tab switching, diff/annotation display) matter more than the editor widget itself.

**Graph rendering split** — Dagre computes node positions (directed layout, stable and reproducible for a scripted demo), D3 handles SVG rendering, zoom/pan, transitions, and path/dimming highlight effects. This mirrors parent spec §19.1 guidance and avoids reimplementing graph layout logic in D3.

**Scripted behavior, not general interactivity** — highlight sets for `Customer.creditLimit`, `CreditLimitValidation`, and the "Preview impact" overlay are hard-coded node-id lists from mock-up spec §10.5, not computed from generic graph traversal. This keeps the mock deterministic and matches the "persuasive mock-up, not platform prototype" priority (§17).

## Risks / Trade-offs

- **CodeMirror + Dagre + D3 integration weight** → Mitigation: scope each library's usage narrowly (Dagre for layout only, D3 for a fixed set of interactions, CodeMirror in read-mostly/annotated mode); fall back to styled blocks for text surfaces if needed without changing observable behavior.
- **Hard-coded scripted highlight/validation sequences are brittle if mock data changes later** → Mitigation: keep all mock data in `src/data/*.ts` modules referenced by id, so node lists and text content stay in one place per capability.
- **Six-field shared state object could become a dumping ground as more scripted behaviors are added** → Mitigation: constrained explicitly to the six fields named in mock-up spec §13; any addition should be treated as a spec change, not an ad-hoc addition.
- **Visual credibility is subjective and hard to verify automatically** → Mitigation: acceptance criteria (mock-up spec §15) are used as the task completion checklist, and the "Design priority" ordering (§17: visual credibility > narrative coherence > code cleanliness) governs trade-off calls during implementation.

## Open Questions

- None blocking implementation. The parent spec's broader open questions (§28) about backend/state architecture are explicitly out of scope for this mock-up.
