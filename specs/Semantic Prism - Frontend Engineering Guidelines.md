# Semantic Prism — Frontend Engineering Guidelines

Internal working name: Semantic Prism
Scope: implementation conventions for client-side code generation
Version: 0.1

## 1. Relationship to the other specs

This document does not re-derive the UI model or the state/backend architecture. It assumes:

* `Semantic Prism - Client-Side UI Specification.md` — surface types, workspace model, six conceptual layers.
* `Semantic Prism — State and Backend Architecture Specification.md` — store slices, command-only mutation path, generic-core/adapter split.

Those two documents answer *what* the system is and *why* it's structured that way. This document answers a narrower question: given a piece of that model to implement, what should the generated code actually look like — file layout, naming, styling, state wiring — so that code generated in one session is indistinguishable from code generated in another.

## 2. Stack

```text
React 19
TypeScript 5, strict mode
Vite 5 (build: tsc --noEmit && vite build)
React Router — shell-level navigation only (see §5)
Axios — HTTP client
Vitest + React Testing Library — test runner
D3 for force-directed/custom graph rendering
@dagrejs/dagre for directed graph layout
CodeMirror 6 for text/code/DSL surfaces
lucide-react for icons
Plain CSS with custom properties for theming (no CSS-in-JS, no Tailwind, no CSS modules, no component library such as MUI)
```

Plain CSS is a deliberate choice, not a placeholder: parent spec §18 wants Prism to read as a bespoke, premium engineering product rather than a generic admin tool, which is exactly the baseline a component library like MUI would impose unless heavily re-skinned. Do not introduce a component library, a second icon set, a CSS-in-JS library, or a second graph renderer without an explicit decision — see §9.

## 3. File and folder layout

```text
src/
  surfaces/
    text/          — Text Surface components (source-code-viewer, dsl-editor, ...)
    canvas/        — Canvas Surface components (impact-analysis-map, ...)
    control/        — Control Surface components (forms, panels, dashboards)
  components/       — Generic building blocks used across surface families (panel chrome, badges, status chips, icon buttons)
  registry/         — Surface Registry entries (parent spec §20), Language Registry entries
  state/            — Zustand store slices (backend spec §3.1): selection, workspace, changeBasket, validation, aiSession, objectCache
  commands/         — Command Router: dispatchCommand and typed command definitions (backend spec §3.5, §6.4)
  styles/           — one .css file per concern (theme, layout, per surface-family)
  App.tsx
  main.tsx
```

A component belongs in `surfaces/<family>/` once it's a registered surface type per the Surface Registry (parent spec §20), not before. Generic building blocks that many surfaces use stay in `components/`.

## 4. Component conventions

* Named function exports (`export function Panel(...)`), not `export default`, except `App.tsx`'s default export (Vite/React convention for the root component).
* One `<Component>Props` interface per component, declared just above the component, not exported unless another file needs it.
* `import type { ... }` for type-only imports — keep it separate from value imports.
* String union types for closed sets of values (e.g. `type BottomTab = "dsl" | "source" | "diff"`), not enums.
* Optional props get inline defaults in the destructure (`className = ""`), not `defaultProps`.
* Conditional rendering via `condition ? <X /> : null`, not `&&` (avoids `0`/empty-string leaking into JSX).
* Presentational subcomponents that only exist to keep one file readable can live unexported in the same file as their parent; promote to their own file only once a second file needs them.

## 5. State management, routing and auth

One Zustand store, split into the slices named in the backend spec (§3.1): `selection`, `workspace`, `changeBasket`, `validation`, `aiSession`, `objectCache`.

* Components read via selector hooks and subscribe only to the slices they declare — no component reaches into a slice it doesn't need.
* No component writes to `objectCache`, `changeBasket`, or `validation` directly. All mutation goes through `dispatchCommand(...)` (backend spec §3.5, §6.4).
* Local, ephemeral, non-semantic state (scroll position, expanded tree nodes, input drafts, transient view toggles) stays as ordinary component `useState` — never promoted to the shared store (backend spec §3.2).
* Don't leave a component half-migrated onto this model — reading from the store but mutating through a local setter, or vice versa.

React Context is reserved for narrow, rarely-changing cross-cutting concerns only: the authenticated session/user, the theme provider, dependency-injecting the command dispatcher or API client for tests. It never carries workspace or semantic state — that always lives in a Zustand slice. If a value changes on user interaction (selection, layout, change-basket contents), it belongs in the store, not in a Context provider.

React Router handles top-level, shell-level navigation only — project/application selection, settings, login/auth-gated routes (parent spec §6.1's global navigation). It must not become the mechanism that decides which surfaces are open inside a workspace: the parent spec is explicit that Semantic Prism is "workspaces over pages" (§5.3), and workspace/surface composition is owned by the Workspace Manager and `workspace` store slice, not by the router.

Authentication uses JWT tokens with a role-based access scheme. The role carried on the token drives the permission-aware UI already required by parent spec §24 (visibly disabled/restricted actions) and matches the backend spec's requirement that AI- and human-issued commands pass the same permission check (§6.7) — the frontend enforces nothing it can't also explain to the user (why a control is disabled), it doesn't invent a separate client-side authorization model.

Axios is the HTTP client underneath the query layer described in backend spec §3.3/§5.1 (`objectCache` as a read replica populated by queries). Whether a caching layer (React Query or similar) sits on top of Axios is still open — see §9.

## 6. Styling

Plain CSS files under `src/styles/`, one file per concern, loaded globally via `main.tsx`. Theming is done entirely through CSS custom properties scoped to `.theme-light` / `.theme-dark` on the root element, never through inline style objects or per-component theme branching in TSX.

* Class names are lowercase-hyphenated (`panel-header`, `dock-tabs`, `is-active` for state modifiers) — no CSS Modules, no styled-components, no Tailwind utility classes.
* A new surface family that needs its own visual language gets its own stylesheet (`styles/<surface-family>.css`) rather than growing a shared stylesheet indefinitely.
* Density modes and presentation mode (parent spec §18.4) are root-level class toggles, not per-component props threaded through the tree.

## 7. Graph and text surface implementation

* Canvas surfaces: D3 for force-directed/custom behavior, Dagre for directed/hierarchical layout — per parent spec §19.1. A canvas surface's renderer choice is a property of its Surface Registry entry (backend spec §6.10), not hardcoded in the component.
* Text surfaces: CodeMirror 6, one language-extension package per substrate, lazy-loaded per project (backend spec §6.11) rather than bundled globally. Substrate-specific language support is an extension passed into a shared text-surface component, not a fork of that component.

## 8. Naming

* Component files: `PascalCase.tsx`, filename matches the exported component name exactly.
* Non-component modules (state slices, commands, utilities): `camelCase.ts`.
* Command names match the typed envelope defined in both parent specs verbatim (e.g. `ProposeBusinessRuleChange`, `RunValidation`) — don't paraphrase or abbreviate a command name between the spec and the code.

## 9. Open decisions (not yet settled)

Don't silently decide these while generating code — surface the choice:

1. **Lint/format** — no ESLint or Prettier config is chosen yet.
2. **Caching layer over Axios** — whether a query/cache library (React Query or similar) sits between Axios and `objectCache`, or the command/query layer manages caching itself.
3. **Monorepo vs. single package** — once substrate-specific language grammars and generators exist server-side (backend spec §4.2), decide whether client and server code share a repo/workspace tooling setup.

## 10. Non-goals for this document

This document does not cover:

* the UI/UX model (parent spec) or the store/backend split (backend spec) — both are assumed, not repeated;
* the concrete backend implementation (transport, persistence, auth) — backend spec §7 already scopes that out;
* a design token / component library spec — parent spec §18 sets visual requirements; this document only says *how* those are currently expressed in code (plain CSS + custom properties), not new tokens or scales.
