## 1. Project scaffold

- [ ] 1.1 Create `semantic-prism-mock/` as a new Vite + React + TypeScript project (`package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`)
- [ ] 1.2 Add dependencies: `d3`, `dagre` (or `@dagrejs/dagre`), `codemirror`/`@codemirror/*` packages
- [ ] 1.3 Create `src/styles/theme.css` with light and dark CSS variable sets (background, panel, border, primary/secondary text, editor-area, accent colors: blue/cyan/violet/amber/green/red/grey) and `layout.css`, `graph.css`, `code.css`
- [ ] 1.4 Verify `npm install && npm run dev` boots an empty shell with no console errors

## 2. Mock data modules

- [ ] 2.1 Create `src/data/mockGraph.ts`: node list (20+ nodes, all types from `impact-graph-canvas` spec) and typed edges
- [ ] 2.2 Create `src/data/mockText.ts`: Semantic DSL text, Original Source text, base and post-change Generated Diff text, Trace tab content
- [ ] 2.3 Create `src/data/mockChangeSet.ts`: change basket items, Change Proposal form field values, CS-1042 metadata
- [ ] 2.4 Create `src/data/mockValidation.ts`: available-checks list, passed-with-warnings checklist, warning text, summary text

## 3. Shared workspace state (mock-interaction-state)

- [ ] 3.1 Define the shared state shape (`selectedObject`, `activeGraphMode`, `activeBottomTab`, `theme`, `changeActive`, `validationStatus`) and its initial values in `ImpactChangeWorkspace.tsx`
- [ ] 3.2 Provide the state and its setters to descendant components (context or prop-drilling per design.md decision)
- [ ] 3.3 Implement bidirectional selection sync: explorer selection ↔ graph node selection both update `selectedObject`

## 4. Application shell (workspace-shell)

- [ ] 4.1 Build `AppShell.tsx` implementing the four-zone layout with the specified proportions (top bar 56px, left 260px, right 360px, bottom 260–320px, center remaining)
- [ ] 4.2 Build `TopBar.tsx`: logo/name, project selector ("Retail Order Platform"), workspace selector ("Impact & Change Workspace"), search input, AI status indicator, presentation-mode control
- [ ] 4.3 Build `ThemeToggle.tsx` wired to shared `theme` state; apply theme via CSS variable class on root element
- [ ] 4.4 Implement presentation mode: increased font sizes, hidden minor controls, forced light theme, right column stays visible
- [ ] 4.5 Verify default light theme on load and correct switching to dark theme

## 5. Object Explorer

- [ ] 5.1 Build `ObjectExplorer.tsx` rendering the full mock hierarchy (Application, Screens, Business Rules, Entities, Fields, Data Stores, Integrations, Validation, Change Sets) from static data
- [ ] 5.2 Wire item selection to shared `selectedObject` state
- [ ] 5.3 Verify minimum selectable items (CreditLimitValidation, Customer.creditLimit, OrderConfirmation, VIPExceptionPolicy, CS-1042 VIP Credit Exception) each update dependent panels correctly

## 6. Impact Graph Canvas

- [ ] 6.1 Build `ImpactGraph.tsx`: compute layout with Dagre from `mockGraph.ts`, render nodes/edges with D3 (SVG), one visual style per node type
- [ ] 6.2 Implement zoom, pan, fit-to-screen, reset-view
- [ ] 6.3 Build `GraphLegend.tsx` describing node/edge types
- [ ] 6.4 Implement graph-mode toggle (Impact View / Data View / Flow View) reusing the same dataset with different highlighted subsets
- [ ] 6.5 Implement node selection, hover tooltip, connected-path highlight, and dimming of unrelated nodes
- [ ] 6.6 Implement scripted highlight set for `selectedObject === "Customer.creditLimit"`
- [ ] 6.7 Implement scripted highlight set for `selectedObject === "CreditLimitValidation"`
- [ ] 6.8 Implement the violet-styled "Preview impact" overlay (VIPExceptionPolicy, SalesManager, Approval.role, VIPExceptionValidationTest, Generated Change Set CS-1042)
- [ ] 6.9 Verify graph node click updates `selectedObject` and Object Explorer selection (reverse sync)

## 7. Text Surface Dock

- [ ] 7.1 Build `CodeTabs.tsx` with the five tabs (Semantic DSL, Original Source, Generated Diff, Validation, Trace) wired to `activeBottomTab`
- [ ] 7.2 Build `CodeSurface.tsx` using CodeMirror (or styled `<pre>` fallback per design.md) with monospace typography
- [ ] 7.3 Implement Semantic DSL tab content and "proposed block" marking when `changeActive` is true
- [ ] 7.4 Implement Original Source tab content and patch-location annotation when `changeActive` is true
- [ ] 7.5 Implement Generated Diff tab: placeholder before activation, fixed unified diff after activation
- [ ] 7.6 Implement Validation tab across `not-run` / `running` / `passed-with-warnings` states
- [ ] 7.7 Implement Trace tab with fixed provenance content
- [ ] 7.8 Verify tab content stays consistent with `selectedObject` changes

## 8. AI / Control Panels

- [ ] 8.1 Build `AiAnalysisPanel.tsx`: default CreditLimitValidation content, updates on `selectedObject` change, four actions with "Preview impact" and "Show source trace" functional
- [ ] 8.2 Build `ChangeProposalPanel.tsx`: fixed form fields, "Create semantic change" (sets `changeActive = true`, switches bottom tab to Generated Diff, adds basket item) and "Generate change set" (activates CS-1042, sets `validationStatus = "not-run"`) actions
- [ ] 8.3 Build `ChangeBasketPanel.tsx`: fixed four-item basket list, status label, "Review diff" (switch to Diff tab), "Run mock validation" (not-run → running → passed-with-warnings with delay and warning text), "Clear" (reset `changeActive`/basket/`validationStatus`) actions
- [ ] 8.4 Verify the full scripted sequence end-to-end: select CreditLimitValidation → Preview impact → Create semantic change → Generated Diff appears → Run mock validation → passed-with-warnings with correct warning

## 9. Common components and polish

- [ ] 9.1 Build shared `Badge.tsx`, `StatusChip.tsx`, `Panel.tsx`, `IconButton.tsx` used across canvas, dock, and control panels
- [ ] 9.2 Pass over spacing/typography to match "compact professional", non-cramped visual density described in design.md
- [ ] 9.3 Cross-browser/viewport check: no horizontal scrolling on a standard laptop screen; layout still looks good on a large monitor

## 10. Acceptance verification

- [ ] 10.1 Confirm the app runs via `npm install && npm run dev` with no backend/auth/DB
- [ ] 10.2 Walk through all 14 acceptance criteria from the mock-up spec (§15) against the running app and fix any gaps
- [ ] 10.3 Confirm no console errors/warnings during the full scripted demo flow
