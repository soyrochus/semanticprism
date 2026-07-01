# Semantic Prism — Local HTML Mock-Up Specification

Internal working name: Semantic Prism
Document type: implementation specification for AI code generation
Scope: client-side mock-up only
Version: 0.1

## 1. Relationship to parent specification

This document is a separate implementation specification for a local, HTML-based mock-up of Semantic Prism.

It must be read together with the parent document:

`Semantic Prism — Client-Side UI Specification v0.1`
(see: specs/Semantic Prism - Client-Side UI Specification.md)

The parent specification defines the broader UI concept: semantic workspaces, text surfaces, canvas surfaces, control surfaces, workspace composition, traceability, AI interaction and change-set governance.

This document defines one concrete executable mock-up that demonstrates those concepts visually. It is not intended to implement the complete product architecture.

## 2. Objective

Build a visually strong, locally runnable, client-side-only mock-up of Semantic Prism.

The mock-up must be suitable for presentation to internal stakeholders and clients. It should communicate the product idea immediately: Semantic Prism is a modern, AI-assisted semantic workbench that lets users understand and propose changes to complex software systems without working directly inside the underlying technical artefacts.

The mock-up must feel like a real product, not like a wireframe.

It should demonstrate:

* a semantic workspace;
* a visually powerful canvas graph;
* synchronized text/source views;
* control panels for AI analysis and change proposal;
* a change basket;
* traceability to original artefacts;
* a mock validation flow;
* light and dark themes;
* a modern, lean, Material-inspired visual style.

The mock-up does not need a backend. All data may be static and client-side.

## 3. Core demo narrative

The mock-up demonstrates one scenario:

> A user investigates and proposes a change to a customer credit-limit validation rule in a complex enterprise application.

Current behaviour:

> The system blocks order confirmation when the order total exceeds the customer’s credit limit.

Proposed change:

> VIP customers may exceed the credit limit if a Sales Manager approval exists. The exception must be recorded and validated.

The demo must make this story visible across all three surface types:

* Canvas Surface: impact graph showing affected entities, screens, rules, processes, tables, integrations and validation artefacts.
* Text Surface: semantic DSL, original source, generated diff, validation log and trace.
* Control Surface: AI analysis, proposed change form, change basket and validation panel.

## 4. Technical implementation constraints

Use the following baseline:

```text
React
TypeScript
Vite
HTML/CSS
D3.js
Dagre
CodeMirror
```

The mock-up must run locally with:

```bash
npm install
npm run dev
```

No backend is required.

No authentication is required.

No database is required.

No real AI integration is required.

No real validation engine is required.

No persistence is required, although local component state may be used for scripted interactions.

The mock-up should be easy to inspect and modify. Prefer clear code and static data over over-engineered abstractions.

## 5. Repository structure

Create a clean project structure:

```text
semantic-prism-mock/
  package.json
  vite.config.ts
  tsconfig.json
  index.html
  src/
    main.tsx
    App.tsx
    styles/
      theme.css
      layout.css
      graph.css
      code.css
    data/
      mockGraph.ts
      mockText.ts
      mockChangeSet.ts
      mockValidation.ts
    components/
      shell/
        AppShell.tsx
        TopBar.tsx
        ThemeToggle.tsx
      workspace/
        ImpactChangeWorkspace.tsx
        ObjectExplorer.tsx
        BottomDock.tsx
      canvas/
        ImpactGraph.tsx
        GraphLegend.tsx
      text/
        CodeTabs.tsx
        CodeSurface.tsx
      controls/
        AiAnalysisPanel.tsx
        ChangeProposalPanel.tsx
        ChangeBasketPanel.tsx
        ValidationPanel.tsx
      common/
        Badge.tsx
        StatusChip.tsx
        Panel.tsx
        IconButton.tsx
```

The exact file structure may be adjusted if needed, but keep separation between shell, workspace, canvas, text and controls.

## 6. Visual style

The visual style must be modern, sharp, minimalist and presentation-ready.

It should be inspired by Material Design / Material 3 but should not look like a generic admin dashboard.

### 6.1 General visual principles

The UI must feel:

* clean;
* premium;
* calm;
* technical;
* precise;
* high-density but readable;
* visually impactful in the graph area.

Avoid:

* childish colors;
* excessive gradients;
* heavy shadows;
* bulky cards;
* old-fashioned enterprise dashboard styling;
* Bootstrap-like defaults;
* IDE imitation as the dominant visual metaphor.

### 6.2 Themes

Implement light and dark theme using CSS variables.

Light theme is the default.

Dark theme must be available through a toggle in the top bar.

Light theme should use:

```text
background: near-white
panels: white
panel borders: cool grey
primary text: dark graphite
secondary text: slate grey
editor area: dark or near-black for code emphasis
```

Dark theme should use:

```text
background: deep graphite / blue-black
panels: dark slate
panel borders: muted slate
primary text: near-white
secondary text: cool grey
editor area: darker than the main panels
```

Use one strong accent color for selection and active context.

Suggested semantic colors:

```text
blue: selected semantic object
cyan: data/entity nodes
violet: AI inference and proposed changes
amber: risk/warning
green: validated/passed
red: failed/blocked
grey: original artefact / neutral infrastructure
```

### 6.3 Layout density

The mock-up should use compact professional spacing.

The UI should not look empty.

The center canvas must dominate visually.

Panels should feel docked and composed, not like independent floating cards.

### 6.4 Typography

Use a clean sans-serif for the interface.

Use a monospace font for code, DSL, diff, logs and trace views.

If external fonts are avoided, use system stacks:

```css
--font-ui: Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-code: "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace;
```

## 7. Main screen layout

Implement one main screen:

`Impact & Change Workspace`

The layout must have four major zones:

```text
┌──────────────────────────────────────────────────────────────┐
│ Top Bar                                                      │
├──────────────┬────────────────────────────────┬──────────────┤
│ Object       │ Canvas Surface                 │ AI / Control │
│ Explorer     │ Impact Graph                   │ Panels       │
├──────────────┴────────────────────────────────┴──────────────┤
│ Bottom Dock: DSL | Original Source | Diff | Validation | Trace│
└──────────────────────────────────────────────────────────────┘
```

Recommended proportions:

```text
Top bar: 56px
Left explorer: 260px
Right control column: 360px
Bottom dock: 260–320px
Center canvas: remaining space
```

The page must fit a standard laptop screen but also look good on a large monitor.

Horizontal scrolling should be avoided.

## 8. Top bar

The top bar must contain:

```text
Semantic Prism logo/name
Project selector: Retail Order Platform
Workspace selector: Impact & Change Workspace
Search input or command-style search
AI status indicator
Theme toggle
Presentation mode indicator or button
```

The logo may be purely typographic:

```text
◇ Semantic Prism
```

or

```text
Semantic Prism
AI-assisted semantic workbench
```

Keep it understated.

## 9. Object Explorer

The left panel must show a semantic object tree.

Use this mock hierarchy:

```text
Retail Order Platform

Application
  Order Entry
  Customer Management
  Approval Management

Screens
  OrderConfirmation
  CustomerProfile
  ApprovalQueue

Business Rules
  CreditLimitValidation
  VIPExceptionPolicy
  ApprovalRequiredRule
  OrderConfirmationRule

Entities
  Customer
  Order
  Approval
  CustomerCategory

Fields
  Customer.creditLimit
  Customer.category
  Order.total
  Approval.role
  Approval.status

Data Stores
  CUSTOMER
  ORDER_HEADER
  APPROVAL

Integrations
  Pricing Service
  CRM Customer Profile
  Notification Queue

Validation
  OrderCreditValidationTest
  VIPExceptionValidationTest

Change Sets
  CS-1042 VIP Credit Exception
```

Selecting an item must update:

* highlighted graph node;
* AI analysis panel;
* bottom text tab context;
* breadcrumb or selected-object label.

At minimum, implement selection for:

```text
CreditLimitValidation
Customer.creditLimit
OrderConfirmation
VIPExceptionPolicy
CS-1042 VIP Credit Exception
```

## 10. Canvas Surface: Impact Graph

The center panel is the main visual element.

It must render a graph with around 20–30 nodes.

Use Dagre to create a stable directed layout.

D3 may be used for rendering, transitions, zoom/pan and path highlighting.

The graph must be visually rich but clear.

### 10.1 Required node types

Implement these node types with distinct visual styles:

```text
screen
process
business-rule
field
entity
table
integration
role
policy
source-artifact
validation
change-set
ai-inference
```

Each node should show:

* icon or small type marker;
* label;
* optional status/risk badge;
* optional confidence/provenance indicator.

### 10.2 Required graph nodes

Use at least these nodes:

```text
OrderConfirmation
OK Button Handler
ConfirmOrder
CreditLimitValidation
VIPExceptionPolicy
ApprovalRequiredRule
Customer.creditLimit
Customer.category
Order.total
Approval.role
Approval.status
Customer
Order
Approval
CUSTOMER table
ORDER_HEADER table
APPROVAL table
Pricing Service
CRM Customer Profile
Notification Queue
SalesManager
OrderCreditValidationTest
VIPExceptionValidationTest
Original RDMLX Artefact
Semantic DSL Projection
Generated Change Set CS-1042
AI Impact Analysis
```

The mock may use “Original Artefact” instead of a real language-specific artefact. If using a language label, keep it generic enough to avoid locking the concept to LANSA.

### 10.3 Required edge types

Implement these relationships:

```text
triggers
validates
reads
writes
depends-on
implemented-by
projected-as
impacts
requires-approval
validated-by
notifies
proposes
```

Edges should have subtle labels or tooltips. Labels may be hidden by default if the graph becomes too busy, but the selected path should show relationship labels.

### 10.4 Graph interactions

The graph must support:

* node selection;
* hover tooltip;
* selected-node highlight;
* connected-path highlight;
* dimming unrelated nodes;
* zoom and pan;
* fit-to-screen button;
* reset-view button;
* legend;
* graph mode toggle:

  * Impact View;
  * Data View;
  * Flow View.

The mode toggle may reuse the same graph data with different highlighted subsets.

### 10.5 Scripted graph behaviour

When selecting `Customer.creditLimit`, highlight:

```text
Customer.creditLimit
Customer
CUSTOMER table
CreditLimitValidation
OrderConfirmation
ConfirmOrder
OrderCreditValidationTest
Generated Change Set CS-1042
```

When selecting `CreditLimitValidation`, highlight:

```text
CreditLimitValidation
Order.total
Customer.creditLimit
Customer.category
VIPExceptionPolicy
ApprovalRequiredRule
OrderConfirmation
Original RDMLX Artefact
Semantic DSL Projection
Generated Change Set CS-1042
```

When clicking `Preview impact` in the right panel, add or activate a proposed-change overlay:

```text
VIPExceptionPolicy
SalesManager
Approval.role
VIPExceptionValidationTest
Generated Change Set CS-1042
```

Proposed-change nodes or edges should use violet or blue-violet styling.

## 11. Right Control Column

The right column contains control surfaces.

It should include three stacked panels:

```text
AI Analysis
Change Proposal
Change Basket / Validation Summary
```

### 11.1 AI Analysis Panel

The AI Analysis Panel must update based on the selected object.

Default selected object:

```text
CreditLimitValidation
```

Panel content:

```text
Selected object
CreditLimitValidation

Interpretation
This rule prevents order confirmation when the order total exceeds the customer’s credit limit.

Evidence
3 source fragments
2 semantic entities
1 UI event handler
1 validation test

Provenance
Deterministically derived + AI explained

Suggested action
Preview the impact of allowing VIP customer exceptions with Sales Manager approval.
```

Actions:

```text
Preview impact
Show source trace
Generate validation checklist
Explain in business language
```

Only `Preview impact` and `Show source trace` need to do anything in the mock.

### 11.2 Change Proposal Panel

Show a compact form:

```text
Target rule:
CreditLimitValidation

Business change:
Allow exception for customer category VIP

Required approval:
SalesManager

Validation message:
Credit limit exceeded. Sales Manager approval required.

Risk level:
Medium

Actions:
Create semantic change
Generate change set
```

Clicking `Create semantic change` should add or mark a proposed change in the change basket and switch the bottom dock to the `Diff` tab.

Clicking `Generate change set` should show `CS-1042 VIP Credit Exception` as active and switch the validation state to `not run` or `ready`.

### 11.3 Change Basket / Validation Summary

Show:

```text
Current Change Basket

1. Modify CreditLimitValidation
2. Add VIPExceptionPolicy
3. Require SalesManager approval
4. Add VIPExceptionValidationTest

Status:
Draft semantic change

Actions:
Review diff
Run mock validation
Clear
```

Clicking `Review diff` selects the `Diff` tab.

Clicking `Run mock validation` changes validation status from:

```text
not-run
```

to:

```text
running
```

then after a short delay:

```text
passed-with-warnings
```

The warning should be:

```text
Warning: Approval.role is referenced by the proposed rule. Confirm role mapping in target platform.
```

## 12. Bottom Dock: Text Surfaces

The bottom dock must contain tabs:

```text
Semantic DSL
Original Source
Generated Diff
Validation
Trace
```

Use CodeMirror for at least the DSL, source and diff areas. If CodeMirror integration becomes too heavy for the first pass, implement a styled code block, but the preferred implementation is CodeMirror.

### 12.1 Semantic DSL tab

Use this content:

```text
rule CreditLimitValidation
  description "Block order confirmation when credit exposure exceeds the allowed limit"

  when Order.total > Customer.creditLimit
  and Customer.category is not "VIP"
    block confirmation
    show "Credit limit exceeded"

  when Order.total > Customer.creditLimit
  and Customer.category is "VIP"
  and Approval.role is "SalesManager"
  and Approval.status is "Approved"
    allow confirmation
    record exception
    notify "Notification Queue"
```

Highlight the second `when` block as proposed when the change is active.

### 12.2 Original Source tab

Use pseudo-original source. It should look like a real legacy or 4GL artefact but should not claim to be a valid implementation language.

Example:

```text
FUNCTION ConfirmOrder

FETCH FIELDS(#ORDER_TOTAL #CUSTOMER_ID #CUSTOMER_CATEGORY)
FETCH FIELDS(#CREDIT_LIMIT) WITH_KEY(#CUSTOMER_ID)

IF (#ORDER_TOTAL > #CREDIT_LIMIT)
   MESSAGE TEXT('Credit limit exceeded')
   SET #CONFIRM_ALLOWED = FALSE
ELSE
   SET #CONFIRM_ALLOWED = TRUE
ENDIF

IF (#CONFIRM_ALLOWED = TRUE)
   UPDATE FIELDS(#ORDER_STATUS)
   CALL PROCESS(NotifyOrderConfirmed)
ENDIF
```

When the proposed change is active, show an annotation or marker indicating where the generated patch would apply.

### 12.3 Generated Diff tab

Before change activation, show:

```text
No generated diff yet.
Create a semantic change to generate a candidate artefact diff.
```

After activation, show a before/after diff:

```diff
 IF (#ORDER_TOTAL > #CREDIT_LIMIT)
-   MESSAGE TEXT('Credit limit exceeded')
-   SET #CONFIRM_ALLOWED = FALSE
+   IF (#CUSTOMER_CATEGORY = 'VIP')
+      CALL PROCESS(CheckSalesManagerApproval)
+      IF (#APPROVAL_STATUS = 'Approved')
+         SET #CONFIRM_ALLOWED = TRUE
+         CALL PROCESS(RecordCreditException)
+      ELSE
+         MESSAGE TEXT('Credit limit exceeded. Sales Manager approval required.')
+         SET #CONFIRM_ALLOWED = FALSE
+      ENDIF
+   ELSE
+      MESSAGE TEXT('Credit limit exceeded')
+      SET #CONFIRM_ALLOWED = FALSE
+   ENDIF
 ELSE
    SET #CONFIRM_ALLOWED = TRUE
 ENDIF
```

### 12.4 Validation tab

Before running validation:

```text
Validation status: Not run

Available checks:
- Semantic consistency
- Source patch structure
- Referenced role mapping
- Validation test coverage
```

While running:

```text
Validation status: Running...
```

After completion:

```text
Validation status: Passed with warnings

Checks:
✓ Semantic consistency
✓ Source patch structure
✓ VIP exception path covered
✓ OrderCreditValidationTest updated
⚠ Approval.role mapping requires platform expert confirmation

Summary:
The proposed change is structurally consistent in the semantic model and produces a reviewable source-level diff. One mapping requires expert review before approval.
```

### 12.5 Trace tab

Show traceability:

```text
Semantic object:
CreditLimitValidation

Derived from:
- Original Artefact: ConfirmOrder
- UI Event: OrderConfirmation.OK
- Field: Customer.creditLimit
- Field: Order.total
- Entity: Customer
- Entity: Order

Projected as:
- Semantic DSL block: CreditLimitValidation
- Impact graph node: CreditLimitValidation
- Change-set item: Modify CreditLimitValidation

Evidence type:
- Deterministic extraction
- AI explanation
- Human review pending
```

## 13. Mock state and interactions

Implement simple client-side state:

```text
selectedObject
activeGraphMode
activeBottomTab
theme
changeActive
validationStatus
```

Required behaviours:

1. Selecting an object in the Object Explorer updates graph selection and right panel.
2. Selecting a graph node updates Object Explorer selected item and right panel.
3. Clicking `Preview impact` highlights the proposed impact path.
4. Clicking `Create semantic change` activates the proposed change and opens the `Generated Diff` tab.
5. Clicking `Run mock validation` changes status to `running`, then to `passed-with-warnings`.
6. Clicking `Show source trace` opens the `Trace` tab.
7. Theme toggle switches between light and dark mode.

No routing is required.

No URL state is required.

## 14. Presentation mode

Add a simple presentation mode toggle if feasible.

Presentation mode should:

* slightly increase font sizes;
* hide minor controls;
* make the graph more prominent;
* keep the right AI panel visible;
* use light theme by default.

This is optional for the first implementation, but the visual design should anticipate it.

## 15. Acceptance criteria

The mock-up is acceptable when:

1. It runs locally with `npm install && npm run dev`.
2. It displays a polished Semantic Prism workspace.
3. It clearly shows the three surface types:

   * canvas graph;
   * text/source/diff tabs;
   * control panels.
4. It uses a modern, sharp, Material-inspired visual style.
5. It supports light and dark theme.
6. The impact graph contains at least 20 semantic nodes and typed edges.
7. Selecting nodes updates the UI coherently.
8. The right panel explains the selected semantic object.
9. The user can activate a proposed VIP exception change.
10. A generated diff appears after activating the change.
11. A mock validation flow can be run.
12. The trace tab explains where the semantic rule came from.
13. The UI is suitable for a client-facing demo.
14. The implementation remains client-side only.

## 16. Non-goals

Do not implement:

* backend APIs;
* real AI calls;
* real parser or extractor;
* real validation engine;
* authentication;
* database persistence;
* real Git integration;
* complete window manager;
* dynamic schema-generated forms;
* full MVVM/state architecture;
* all workspace types from the parent specification;
* production accessibility completeness;
* mobile layout.

Do not spend effort on general infrastructure that is not visible in the demo.

This is a persuasive mock-up, not a platform prototype.

## 17. Design priority

The first priority is visual credibility.

The second priority is coherence of the demo narrative.

The third priority is clean, modifiable code.

Do not over-engineer.

The mock should make the product concept understandable in less than one minute:

> Semantic Prism lets users work through clean semantic views of complex systems, assisted by AI, while preserving source traceability, impact analysis, change review and validation.
