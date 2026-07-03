# Semantic Prism — Client-Side UI Specification

Internal working name: Semantic Prism
Scope: user interface only
Version: 0.1

## 1. Purpose

Semantic Prism is a web-based visual workbench for understanding, navigating, shaping and evolving complex software systems through clean, traceable semantic projections.

The product is not a code editor, not a low-code tool in the classical sense, and not an IDE clone. It is a semantic workbench that presents complex implementation substrates — legacy systems, generated code, 4GL platforms, agentic runtimes, configuration-heavy systems, greenfield application models — through user-appropriate views.

The UI must let different users work at different levels of abstraction:

* business-readable descriptions;
* visual dependency maps;
* process and data diagrams;
* source-code and pseudo-code views;
* generated DSL representations;
* forms, dashboards and review panels;
* AI-created task views;
* validation and change-set views;
* original artefact inspection when needed.

The core thesis is that users should not have to work directly against raw implementation artefacts by default. They should work against semantic surfaces that remain traceable to the real underlying system.

Semantic Prism must therefore support both comprehension and controlled action. It is not only a visualization tool. It must allow users and AI agents to express intended changes, capture those changes as semantic commands, and present reviewable change sets before anything is applied to underlying artefacts.

## 2. Scope of this specification

This specification covers the client-side interface: visual structure, surface types, user interaction model, workspace/window management, AI interaction, editing modes, review flows and client-side component families.

It does not define:

* the backend architecture;
* the semantic model schema;
* the parser/extractor architecture;
* persistence strategy;
* MVVM, Redux, Zustand or other state architecture;
* authentication and authorization internals;
* validation engines;
* target-platform connectors;
* deployment model;
* pricing or product packaging.

Those topics must be specified separately.

This document may refer to concepts such as semantic model, commands, change sets, validation and source artefacts. In this specification, those are treated as UI-facing contracts, not as completed backend designs.

## 3. Product positioning from a UI perspective

Semantic Prism must feel like a modern visual engineering environment, but it should not visually collapse into “developer IDE”.

It must support expert technical workflows without forcing every user into a code-centric experience.

The default experience should be:

* visual;
* semantic;
* task-oriented;
* AI-assisted;
* traceable;
* governed.

The advanced experience should expose:

* original source artefacts;
* generated DSL;
* diffs;
* object metadata;
* dependency graphs;
* validation logs;
* change-set internals;
* platform-specific technical views.

The same system should therefore support a business analyst trying to understand a rule, an architect investigating impact, a developer reviewing generated changes, and an AI agent proposing a task-specific workspace.

## 4. Primary users

Semantic Prism should support at least the following user archetypes.

### 4.1 Business / domain user

This user understands the business process, rules, terminology and expected behaviour, but not necessarily the implementation technology.

Relevant UI needs:

* readable process views;
* business-rule summaries;
* controlled forms for change requests;
* explanation panels;
* comparison between current and proposed behaviour;
* approval or comment workflows;
* no default exposure to raw implementation code.

This user should be able to ask:

* “Where is this rule implemented?”
* “What happens when this field is empty?”
* “Which screens use this concept?”
* “What would change if we modify this threshold?”
* “Show this in business language.”

### 4.2 Application maintainer

This user may not be a deep expert in the original system but needs to maintain or extend it.

Relevant UI needs:

* semantic navigation;
* pseudo-code or DSL view;
* impact analysis;
* object dependency graph;
* synchronized source and semantic views;
* safe change proposal;
* validation feedback.

This user should be able to move between abstraction and implementation without losing traceability.

### 4.3 Legacy / platform expert

This user understands COBOL, LANSA, RPG, Jabol, PL/SQL, generated Java, agentic runtime configuration or another specialized substrate.

Relevant UI needs:

* original artefact views;
* repository/object-level metadata;
* precise diffs;
* generated patch inspection;
* mapping between semantic view and original implementation;
* validation logs;
* ability to reject incorrect abstractions.

This user should trust the system because it never hides the original truth irreversibly.

### 4.4 Architect

This user reasons about structure, dependency, risk, maintainability, integration and modernization strategy.

Relevant UI needs:

* application maps;
* dependency graphs;
* architecture overlays;
* data-flow diagrams;
* ownership and boundary views;
* risk and complexity heatmaps;
* traceability from high-level system to source artefact;
* comparative views across modules or applications.

### 4.5 Reviewer / governance user

This user evaluates whether a proposed change is safe, auditable and compliant.

Relevant UI needs:

* change-set overview;
* semantic diff;
* technical diff;
* validation evidence;
* approval workflow;
* comments and decisions;
* history and provenance.

### 4.6 AI agent as UI participant

The AI is not only a chat assistant. It must be able to participate in the UI by creating surfaces, composing workspaces, proposing views, highlighting evidence, generating forms and suggesting changes.

The AI should not be allowed to create arbitrary ungoverned UI. It must operate through typed UI descriptors, registered surface types and explicit permission boundaries.

## 5. Core UI principles

### 5.1 Semantic first, implementation traceable

The default interface should present semantic meaning before implementation detail.

However, the original implementation must always remain inspectable. No user should be forced to trust a generated abstraction without a path back to source, metadata, validation output or concrete diff.

### 5.2 Bidirectional surfaces

Every major surface must be designed as a possible interaction surface, not merely a viewer.

A text view may allow editing a DSL.
A graph may allow selecting or reorganizing semantic relationships.
A form may allow defining a validation rule.
A dashboard may allow launching a validation or creating a change request.

All meaningful actions must be translated into semantic commands. Direct uncontrolled mutation of underlying artefacts is out of scope for the UI.

### 5.3 Workspaces over pages

The user should not experience Semantic Prism as a collection of static pages. The core unit of interaction is a workspace: a composition of surfaces around a task, model object, change request or investigation.

Examples:

* Impact Analysis Workspace
* Business Rule Workspace
* Data Entity Workspace
* Change Review Workspace
* Agent Workflow Workspace
* Validation Workspace
* Source Trace Workspace
* Greenfield Design Workspace

### 5.4 Multiple synchronized projections

The same semantic object may appear simultaneously as:

* a node in a graph;
* a row in a table;
* a block in a DSL editor;
* a fragment in original code;
* a card in an explanation panel;
* a field in a form;
* an item in a change set.

Selection, highlighting and navigation must synchronize across these projections.

### 5.5 AI is constrained by surface contracts

The AI may suggest views, compose workspaces, generate diagrams and create control panels, but always through registered component types and declarative UI descriptors.

The AI should not produce arbitrary HTML/JavaScript that runs in the client. It should request a surface through a typed schema.

### 5.6 Review before mutation

The UI must treat every proposed modification as a reviewable change. Even when the user edits a semantic DSL directly, the result must become a tracked command or change set.

The user should always be able to distinguish:

* current state;
* derived view;
* proposed change;
* accepted change;
* validated change;
* rejected change.

### 5.7 Change-set immutability

The UI must distinguish two things that are easy to conflate:

* the **change basket** — a mutable, in-progress collection of semantic commands, not yet committed;
* the **change set** — an immutable, committed artefact produced from a change basket.

Once a change set is committed, the UI must not offer any action that edits it in place. Addressing feedback on a committed change set (for example a `changes-requested` decision) produces a new change set that supersedes it. Undoing an already-applied change set is a distinct, explicit action — rollback — which also produces a new change set (one that reverts the original), rather than mutating or erasing history.

How a change set maps to a backend mechanism (a git commit, an event-sourced record, or something else) is a backend concern and out of scope here. The UI only needs to guarantee the immutability contract above.

## 6. High-level UI architecture

The client-side UI is organized around six conceptual layers.

```text
Application Shell
  ↓
Semantic Workspace Manager
  ↓
Surface Runtime
  ↓
Context Bus
  ↓
Command Router
  ↓
Change-Set and Validation UI
```

### 6.1 Application Shell

The Application Shell provides the persistent outer frame of the product.

It contains:

* global navigation;
* project/application selector;
* workspace selector;
* command palette;
* search;
* user/session area;
* notifications;
* AI entry point;
* global status indicators;
* environment indicator;
* role/mode indicator.

The shell should remain visually calm. The complexity should live inside workspaces, not in the top-level navigation.

### 6.2 Semantic Workspace Manager

The Workspace Manager composes task-oriented workspaces from registered surface types.

It owns:

* active workspace;
* layout;
* open surfaces;
* selected semantic objects;
* workspace mode;
* user role context;
* AI-composed views;
* saved layout state;
* task-specific context;
* relationship between panels.

This layer is more than a window manager. It manages meaning, not only screen real estate.

### 6.3 Window Manager

The Window Manager is the mechanical layout system inside the Workspace Manager.

It must support:

* dockable panels;
* tabsets;
* split views;
* resizable panes;
* collapsible side panels;
* maximized panel mode;
* optional floating panels;
* optional pop-out panels for multi-monitor use;
* saved layouts;
* layout reset;
* task templates;
* role-specific default layouts.

The window manager must not be the conceptual center of the product. It is infrastructure for semantic workspaces.

### 6.4 Surface Runtime

The Surface Runtime renders the three primitive surface families:

* Text Surface;
* Canvas Surface;
* Control Surface.

Every visible working pane should be one of these surface types or a composition of them.

### 6.5 Context Bus

The Context Bus synchronizes:

* selected semantic object;
* active artefact;
* cursor/line selection;
* graph node selection;
* active change basket, including its undo/redo position;
* active change set;
* active validation result;
* AI references;
* annotations;
* search results;
* breadcrumbs;
* hover context;
* focus state.

The Context Bus is what makes multiple projections feel like one coherent workspace.

### 6.6 Command Router

The Command Router converts user and AI actions into semantic commands.

Examples:

* select object;
* open projection;
* explain rule;
* create impact analysis;
* propose change;
* edit DSL block;
* add validation condition;
* undo edit;
* redo edit;
* request validation;
* commit change set;
* approve change;
* reject change;
* roll back change set;
* create review comment;
* show original artefact;
* generate test proposal.

The Command Router is a UI concept here. The execution semantics will be defined in a later architecture specification.

### 6.7 Change-Set and Validation UI

This layer presents proposed modifications and their evidence.

It must show:

* semantic intent;
* affected semantic objects;
* affected source artefacts;
* generated diffs;
* validation status;
* test status;
* AI confidence/evidence;
* reviewer comments;
* approval state;
* final decision;
* commit state — mutable change basket versus immutable, committed change set;
* supersession relationship, where applicable (this change set replaces another);
* rollback relationship, where applicable (this change set reverts another).

## 7. The three primitive surface types

Semantic Prism uses three primary surface families.

```text
Text Surface
Canvas Surface
Control Surface
```

Together, these should cover nearly all required UI representations.

Each surface has:

* type;
* subtype;
* bound semantic object or query;
* display mode;
* edit capabilities;
* command capabilities;
* provenance;
* validation status;
* synchronization behaviour.

## 8. Common surface contract

All surfaces should conform conceptually to a common descriptor.

Example:

```json
{
  "surfaceId": "surface-123",
  "surfaceType": "text",
  "surfaceSubtype": "dsl-editor",
  "title": "Credit Limit Validation",
  "boundObject": {
    "kind": "BusinessRule",
    "id": "rule.credit-limit-validation"
  },
  "mode": "editable-proposal",
  "capabilities": [
    "select",
    "annotate",
    "edit",
    "explain",
    "showSource",
    "createChange"
  ],
  "provenance": {
    "derivedFrom": [
      "artifact.customer-form",
      "artifact.order-service"
    ],
    "confidence": "high"
  }
}
```

This descriptor is not necessarily the final implementation schema. It establishes the UI design principle: every surface must be typed, bound, traceable and command-capable.

## 9. Text Surface

Text surfaces represent linear, symbolic or language-like artefacts.

### 9.1 Text surface purpose

Text surfaces cover:

* original source code;
* generated DSL;
* pseudo-code;
* configuration;
* prompts;
* schemas;
* SQL;
* JSON;
* YAML;
* Markdown documentation;
* generated functional descriptions;
* diffs;
* logs;
* test cases;
* execution traces;
* AI-generated explanations.

The text surface is not merely a text editor. It is a semantic projection of textual artefacts.

### 9.2 Text surface subtypes

Required initial subtypes:

```text
source-code-viewer
source-code-editor
dsl-viewer
dsl-editor
pseudo-code-viewer
pseudo-code-editor
markdown-doc-viewer
markdown-doc-editor
json-viewer
yaml-viewer
sql-viewer
diff-viewer
log-viewer
trace-viewer
prompt-viewer
prompt-editor
```

Future subtypes may include:

```text
rdmlx-viewer
cobol-viewer
jabol-java-viewer
plsql-viewer
agent-instruction-editor
test-spec-editor
feature-spec-editor
```

### 9.3 Required features

Text surfaces should support:

* syntax highlighting;
* line numbers;
* code folding;
* search within surface;
* inline annotations;
* hover explanations;
* semantic block highlighting;
* read-only and editable modes;
* multi-cursor or block editing where appropriate;
* structured diff view;
* split original/semantic view;
* diagnostics gutter;
* provenance markers;
* AI comment markers;
* references to semantic objects;
* copy/export;
* keyboard navigation.

### 9.4 Semantic binding

A text range may map to a semantic object.

Examples:

```text
Lines 20–35 → BusinessRule: CreditLimitValidation
Lines 40–48 → UIEvent: OKButton.OnClick
Lines 60–80 → DataAccess: CustomerLookup
```

The UI must support:

* selecting a semantic block from text;
* showing all projections of that block;
* showing source provenance;
* asking AI to explain only the selected block;
* creating a change proposal from a selected block;
* highlighting corresponding graph nodes or form fields.

### 9.5 Text editing modes

Text surfaces must distinguish:

```text
read-only
editable-local
editable-proposal
generated-preview
diff-review
validated-output
```

The most important mode is `editable-proposal`.

In that mode, editing does not directly alter the authoritative artefact. It creates a semantic command or change proposal.

### 9.6 Example interactions

A user selects a DSL block and asks:

```text
Explain this in business language.
Show original source.
Show impacted objects.
Propose a safer version.
Create validation test.
Add this to current change set.
```

A user edits a pseudo-code condition:

```text
IF orderAmount > customerCreditLimit
```

The UI must show that this edit is a proposed semantic change, not yet an applied implementation change.

## 10. Canvas Surface

Canvas surfaces represent spatial, relational, graph-like or visual structures.

### 10.1 Canvas surface purpose

Canvas surfaces are used when meaning is better represented spatially than textually.

They cover:

* dependency graphs;
* application maps;
* entity-relationship diagrams;
* database diagrams;
* data-flow diagrams;
* business process flows;
* state machines;
* screen navigation maps;
* architecture diagrams;
* agent workflow diagrams;
* runtime trace maps;
* impact analysis maps;
* ownership boundaries;
* risk heatmaps;
* AI-generated semantic diagrams.

### 10.2 Canvas surface subtypes

Required initial subtypes:

```text
dependency-graph
directed-flow-graph
force-directed-graph
entity-relationship-diagram
data-flow-diagram
process-flow
state-machine
screen-flow
architecture-map
impact-analysis-map
agent-workflow-map
runtime-trace-map
freeform-semantic-canvas
```

The last subtype, `freeform-semantic-canvas`, is important. It allows AI to create useful ad-hoc diagrams, but still using typed semantic primitives.

### 10.3 Canvas primitives

The AI and UI should not paint arbitrary unstructured drawings by default. Canvas surfaces should be composed of semantic primitives:

```text
node
edge
group
lane
container
boundary
annotation
badge
warning
decision
event
state
action
data-object
system
actor
screen
rule
agent
tool
policy
validation-result
```

Every visual primitive should optionally bind to a semantic object.

### 10.4 Graph layout modes

Canvas surfaces should support multiple layout strategies:

```text
manual layout
force-directed layout
directed acyclic graph layout
hierarchical layout
radial layout
swimlane layout
grid layout
timeline layout
```

Force-directed layouts are useful for exploratory dependency maps. Directed layouts are useful for flows, pipelines, call chains and process logic. Manual layout is necessary for curated diagrams.

### 10.5 Required canvas features

Canvas surfaces should support:

* zoom;
* pan;
* fit to screen;
* minimap;
* node selection;
* edge selection;
* hover cards;
* expandable/collapsible nodes;
* grouping;
* filtering;
* search in graph;
* focus mode;
* path highlighting;
* dependency tracing;
* upstream/downstream traversal;
* impact radius;
* layout switching;
* annotations;
* export as image;
* snapshot;
* semantic edit actions;
* link to text/source/control surfaces.

### 10.6 Canvas editing

Canvas editing must distinguish layout edits from semantic edits.

Moving a node visually may only change layout.
Connecting two semantic objects may create a proposed relationship.
Moving a rule from one process step to another may create a semantic command.
Deleting a node from the view may only hide it unless explicitly treated as a semantic deletion.

The UI must make this distinction explicit.

### 10.7 AI-generated canvas

The AI may generate canvas views such as:

```text
"Show the payment flow as a business process."
"Create an impact map for this field change."
"Show only high-risk dependencies."
"Draw the agent workflow that produced this result."
"Show this legacy module as entities, screens and rules."
```

The result must be a structured canvas descriptor, not arbitrary drawing code.

Example:

```json
{
  "surfaceType": "canvas",
  "surfaceSubtype": "impact-analysis-map",
  "title": "Impact of Customer Credit Limit Change",
  "nodes": [
    {
      "id": "field.customer.creditLimit",
      "label": "Customer Credit Limit",
      "kind": "field",
      "risk": "high"
    },
    {
      "id": "rule.order.validateCredit",
      "label": "Validate Order Credit",
      "kind": "business-rule",
      "risk": "high"
    }
  ],
  "edges": [
    {
      "from": "field.customer.creditLimit",
      "to": "rule.order.validateCredit",
      "kind": "used-by"
    }
  ]
}
```

## 11. Control Surface

Control surfaces represent structured interaction.

They are used for:

* forms;
* dashboards;
* review panels;
* validation panels;
* parameter panels;
* configuration panels;
* wizards;
* approval flows;
* change-set controls;
* agent controls;
* execution controls.

Without control surfaces, Semantic Prism would remain mostly a visualization environment. Control surfaces make it a workbench.

### 11.1 Control surface subtypes

Required initial subtypes:

```text
property-panel
details-panel
business-rule-form
change-request-form
impact-analysis-control
change-set-review-panel
validation-panel
test-runner-panel
dashboard
agent-control-panel
approval-panel
comment-panel
configuration-panel
wizard
schema-generated-form
```

### 11.2 Curated versus generated control surfaces

There must be two classes of control surfaces.

#### Curated control surfaces

These are hand-designed React components for high-value product workflows.

Examples:

* Change Set Review;
* Validation Results;
* AI Evidence Panel;
* Application Overview;
* Rule Editor;
* Agent Execution Trace;
* Impact Analysis Controls.

Curated panels should provide the best user experience and should be used for stable workflows.

#### Schema-generated control surfaces

These are dynamically generated from schemas.

They are useful when the AI, backend or model needs structured input without a hand-built UI.

Examples:

* parameter collection;
* filter creation;
* rule configuration;
* validation settings;
* connector settings;
* agent task inputs.

Generated forms must still follow design-system rules and permission boundaries.

### 11.3 Control surface behaviours

Control surfaces must support:

* field validation;
* contextual help;
* AI explanation;
* default values;
* undo/revert;
* submit as semantic command;
* preview impact;
* show generated change;
* show provenance;
* permissions-aware controls;
* disabled/readonly states;
* validation feedback;
* audit trail.

### 11.4 Example control surface flow

A business user opens a rule form:

```text
Rule: Credit limit validation

Current condition:
  Order total must not exceed customer credit limit.

Editable business parameters:
  threshold
  exception category
  approval role
  warning message

Actions:
  Preview impact
  Ask AI for explanation
  Propose change
  Add to change set
```

The form does not directly update source artefacts. It emits a semantic command:

```json
{
  "command": "ProposeBusinessRuleChange",
  "target": "rule.order.creditLimit",
  "change": {
    "exceptionCategory": "VIP_CUSTOMER",
    "approvalRole": "SalesManager"
  }
}
```

## 12. Workspace and composition model

### 12.1 Workspace definition

A workspace is a task-oriented composition of surfaces.

A workspace contains:

* layout;
* open surfaces;
* bound semantic context;
* selected objects;
* active AI conversation;
* change-set context;
* validation context;
* role/mode configuration.

Examples:

```text
Business Rule Workspace
Application Map Workspace
Impact Analysis Workspace
Change Review Workspace
Source Trace Workspace
Agent Workflow Workspace
Greenfield Design Workspace
Validation Workspace
```

### 12.2 Workspace templates

Semantic Prism should ship with predefined workspace templates.

#### Application Overview Workspace

Default surfaces:

* application map canvas;
* object explorer;
* summary dashboard;
* AI explanation panel;
* recent changes panel.

#### Business Rule Workspace

Default surfaces:

* rule DSL/text view;
* business description panel;
* source trace panel;
* dependency graph;
* change proposal form.

#### Impact Analysis Workspace

Default surfaces:

* impact graph;
* affected objects table;
* AI explanation panel;
* risk dashboard;
* change-set panel.

#### Source Trace Workspace

Default surfaces:

* semantic DSL;
* original source code;
* mapping/diff viewer;
* provenance panel;
* validation logs.

#### Change Review Workspace

Default surfaces:

* semantic change summary;
* technical diff;
* affected objects graph;
* validation panel;
* approval/comments panel.

#### Agent Workflow Workspace

Default surfaces:

* agent workflow graph;
* prompt/tool text views;
* execution trace;
* policy/control panel;
* validation/evidence panel.

### 12.3 AI-created workspaces

The AI should be able to instantiate a workspace template.

Example user request:

```text
Create an impact-analysis workspace for changing Customer.creditLimit.
```

The AI should respond by opening a workspace containing the relevant surfaces, not merely by writing text in chat.

The AI may choose the surfaces, but only from registered templates and allowed surface descriptors.

### 12.4 Layout persistence

Users must be able to:

* save current layout;
* restore default layout;
* save layout per project;
* save layout per task type;
* save layout per role;
* share a workspace layout;
* reset broken layouts;
* open multiple workspaces.

### 12.5 Multi-panel synchronization

Workspaces must support synchronized projections.

When the user selects a node in a graph:

* the DSL view scrolls to the matching block;
* the source view highlights the original fragment;
* the detail panel shows metadata;
* the AI panel updates context;
* the change-set panel shows related changes.

When the user selects a source-code block:

* the graph highlights related nodes;
* the details panel shows semantic interpretation;
* the AI can explain that selection;
* any existing change proposal is shown.

## 13. Navigation model

Semantic Prism needs multiple navigation mechanisms because users will enter the system from different mental models.

### 13.1 Global navigation

Top-level navigation should be minimal:

```text
Projects / Applications
Workspaces
Search
Changes
Validation
Settings
```

The product should avoid many top-level menus. Most complexity should appear contextually inside workspaces.

### 13.2 Object explorer

A left-side object explorer should allow browsing:

```text
Applications
Modules
Screens
Processes
Rules
Entities
Fields
Files / Tables
Integrations
Agents
Tools
Policies
Tests
Artefacts
Change Sets
Validation Runs
```

The explorer must support filtering by object type, technology, risk, ownership and status.

### 13.3 Command palette

A command palette should support fast expert interaction.

Examples:

```text
Open object...
Create impact analysis...
Show original source...
Generate DSL view...
Create change set...
Run validation...
Ask AI about current selection...
Reset workspace layout...
```

### 13.4 Semantic search

Search should not be limited to filenames or text.

It should support:

* object name;
* business term;
* source fragment;
* screen label;
* field name;
* rule description;
* AI semantic search;
* change-set search;
* validation result search.

Search results should be grouped by semantic type.

### 13.5 Breadcrumbs

Every surface should show semantic breadcrumbs.

Example:

```text
Retail Billing > Order Entry > Confirm Order > Credit Limit Validation
```

Breadcrumbs should allow navigation across semantic hierarchy.

## 14. AI interaction design

### 14.1 AI entry points

The AI should be accessible through:

* global AI panel;
* surface-specific context menu;
* selection-specific quick actions;
* command palette;
* inline annotations;
* workspace creation prompt;
* change-set assistant;
* validation assistant.

### 14.2 AI panel

The AI panel should not be a generic chat box only. It should be context-aware and workspace-aware.

It must understand:

* current workspace;
* selected object;
* active surface;
* active change set;
* visible validation result;
* user role;
* available commands.

The AI panel should provide actions, not just prose.

Examples:

```text
Explain selected rule.
Show original source.
Create impact graph.
Generate business description.
Propose change.
Create validation checklist.
Open source trace workspace.
Add affected objects to change set.
```

### 14.3 AI-generated surfaces

The AI may create:

* text surfaces;
* canvas surfaces;
* control surfaces;
* complete workspaces.

But AI-generated UI must follow registered schemas.

The AI should never inject uncontrolled executable UI code.

### 14.4 AI confidence and evidence

AI outputs that interpret source or propose change must show evidence.

Evidence may include:

* source fragments;
* repository object references;
* dependency path;
* validation result;
* related tests;
* generated reasoning summary;
* confidence marker.

The UI should distinguish:

```text
directly extracted
deterministically derived
AI inferred
user confirmed
validated
```

This distinction is central to trust.

### 14.5 AI as analyst, not silent editor

The AI may propose changes, prepare diffs and generate commands, but the UI must avoid silent autonomous mutation.

Every AI-driven change must appear in:

* proposed change summary;
* semantic diff;
* affected object list;
* validation path;
* review/approval state.

## 15. Editing and change workflow

### 15.1 UI modes

Semantic Prism should support explicit modes:

```text
Explore
Explain
Propose
Edit
Review
Validate
Approve
```

Mode does not need to be a rigid global switch, but the user must always understand what kind of action is being performed.

### 15.2 Read-only exploration

Default mode for most users and surfaces.

Actions:

* navigate;
* inspect;
* explain;
* search;
* trace;
* annotate;
* create investigation workspace.

### 15.3 Proposed editing

When a user or AI modifies a semantic projection, the change enters proposed state.

The UI must show:

* what changed semantically;
* which objects are affected;
* whether concrete artefact changes exist;
* whether validation has run;
* who proposed it;
* why it was proposed.

### 15.4 Change basket

There should be a visible “change basket” panel, distinct from a change set.

The change basket is the mutable, in-progress collection of semantic commands before they are committed. The change set is what the basket becomes at the moment of commit — see [15.6](#156-change-set-immutability-and-rollback).

While a basket is open, edits within it must be undoable and redoable as semantic commands, not merely as local per-surface text edits. This undo/redo history spans every surface that contributed a command to the basket (text, canvas, control), and it must survive navigating away from and back to the workspace for the lifetime of the session. Whether it survives a reload, reconnect or logout is an open question, not a guarantee of this version — see [§28](#28-open-questions-for-the-next-specification-phase).

Example:

```text
Current Change Basket
  1. Modify Credit Limit Validation
  2. Update warning message on Order Confirmation
  3. Add validation test for VIP exception

Actions:
  Review
  Generate technical diff
  Validate
  Undo
  Redo
  Discard
  Commit as change set
```

### 15.5 Change-set review

A change set must show at least three levels.

#### Semantic change

What the user intended.

Example:

```text
Allow VIP customers to exceed credit limit if Sales Manager approval exists.
```

#### Object impact

What semantic objects are affected.

Example:

```text
BusinessRule: CreditLimitValidation
Screen: OrderConfirmation
Field: Customer.creditLimit
Role: SalesManager
Test: OrderCreditValidationTest
```

#### Artefact diff

Which underlying artefacts would change.

Example:

```text
order-confirmation.dsl
customer-validation.rdmlx
validation-rules.yaml
order-credit-test.json
```

The UI must allow reviewers to move between these levels easily.

### 15.6 Change-set immutability and rollback

Once a change basket is committed, it becomes a change set and is immutable. The UI must not offer edit, undo or redo on a committed change set.

There are two distinct ways a committed change set is superseded, and the UI must not blur them:

* **Revision.** A change set that received a `changes-requested` decision is not edited in place. The author reopens a change basket (seeded from the rejected change set's commands), edits it, and commits a new change set that supersedes the original. The original remains visible in history, marked `superseded`.
* **Rollback.** A change set that has already been applied (`merged/applied`) can be reverted. Rollback is an explicit, reviewable action, not a silent undo: it produces a new change set whose semantic intent is “revert change set X”, goes through the same validation and approval path as any other change set, and is linked to the original via a `reverts` / `reverted-by` relationship (see [§16](#16-traceability-and-provenance)).

Neither path deletes or rewrites a prior change set. History only grows forward.

### 15.7 Validation UI

Validation should be presented as a first-class surface.

It should show:

* validation status;
* validation type;
* target environment;
* triggered by;
* timestamp;
* logs;
* errors;
* warnings;
* affected objects;
* linked change set;
* suggested fixes;
* rerun action.

Statuses:

```text
not-run
queued
running
passed
passed-with-warnings
failed
blocked
cancelled
stale
```

The UI must make stale validation visible. A validation run performed before the latest change must not appear as current.

## 16. Traceability and provenance

Traceability is mandatory. It is not an optional enterprise feature.

Every semantic projection should be able to answer:

```text
Where did this come from?
How was it derived?
What original artefacts support it?
Is it deterministic or AI-inferred?
Has a human confirmed it?
Has it been validated?
What changes depend on it?
```

### 16.1 Provenance indicators

The UI should use small but visible indicators:

```text
Extracted
Derived
AI inferred
Human confirmed
Validated
Outdated
Uncertain
```

### 16.2 Source trace

Users must be able to open source trace from any derived view.

For example, from a business-rule card:

```text
Show DSL
Show original code
Show repository object
Show dependency graph
Show validation result
Show change history
```

### 16.3 Mapping view

For complex cases, the UI should provide a mapping view:

```text
Semantic rule
  ↔ DSL block
  ↔ original source fragment
  ↔ repository metadata
  ↔ generated artefact
  ↔ validation result
```

This is essential for expert trust.

### 16.4 Change-set lineage

Change sets are immutable (see [15.6](#156-change-set-immutability-and-rollback)), so relationships between them are themselves part of provenance:

```text
supersedes / superseded-by
reverts / reverted-by
```

For this version, it is sufficient to show these as links from within a change set's own review panel (for example, “this change set reverts change set #142”). A dedicated change-set lineage/history graph visualization is not required yet — see [§27](#27-non-goals-for-the-first-ui-version).

## 17. Collaboration and review

Semantic Prism should support collaborative analysis and change review.

Required UI capabilities:

* comments on semantic objects;
* comments on text ranges;
* comments on graph nodes;
* comments on change-set items;
* reviewer assignment;
* approval/rejection;
* decision history;
* unresolved comment indicators;
* mention support;
* activity timeline.

Review states:

```text
draft
ready-for-review
changes-requested
approved
validated
rejected
superseded
merged/applied
rolled-back
```

`changes-requested` does not put a committed change set back into an editable state; it results in a new change set that supersedes it (see [15.6](#156-change-set-immutability-and-rollback)). `rolled-back` marks a `merged/applied` change set that a later change set has reverted; the original stays in history, it is not removed or reopened.

The exact persistence model is out of scope, but the UI must be designed for this workflow.

## 18. Visual design requirements

Semantic Prism should look like a premium engineering product, not an internal admin tool.

### 18.1 General visual language

The UI should be:

* clean;
* high-density but not cramped;
* precise;
* visually calm;
* graphically rich where useful;
* not childish;
* not overly decorative;
* suitable for long work sessions.

A white/light theme should be the default for presentation and mixed business usage. A dark theme should be available for developer-heavy usage.

### 18.2 Visual hierarchy

The UI must distinguish:

* active workspace;
* active surface;
* selected semantic object;
* proposed change;
* validated result;
* warning/error;
* AI-inferred content;
* original source artefact.

Use color deliberately. Do not use color as the only signal.

### 18.3 Typography

The UI needs at least two typographic modes:

* interface typography for panels, cards, dashboards and forms;
* monospace typography for code, DSL, logs and diffs.

Code and DSL views must be comfortable for long reading.

### 18.4 Density modes

Support at least:

```text
comfortable
compact
presentation
```

Presentation mode is useful when showing Prism to clients. Compact mode is useful for expert users.

### 18.5 Accessibility

Minimum expectations:

* keyboard navigation;
* screen-reader-compatible controls where possible;
* visible focus states;
* high contrast mode;
* no color-only semantics;
* scalable text;
* accessible form labels;
* accessible error messages.

Graph-heavy areas are inherently difficult for accessibility, so each graph should have an alternate table or list representation.

## 19. Client-side component strategy

The recommended initial client stack is:

```text
React
TypeScript
HTML/CSS
D3.js for force-directed and custom graph visualization
Dagre for directed graph layout
CodeMirror for text/code/DSL surfaces
FlexLayout or equivalent for workspace/window management
Curated React components for key control panels
Schema-driven React forms for dynamic/agentic controls
```

This is not yet a final architecture decision. It is the UI component baseline.

### 19.1 Canvas implementation

The existing React/TypeScript/D3/Dagre approach is a valid foundation for the Canvas Surface.

Use D3 where custom visual behaviour, force-directed exploration, transitions and fine-grained SVG/Canvas control are needed.

Use Dagre where directed graph layout is needed, especially for flows, call chains, dependency direction, execution paths and process-style diagrams.

Do not assume all canvas types require the same renderer. A future architecture may include additional specialized renderers.

### 19.2 Text implementation

Use CodeMirror as the primary text surface engine.

Initial language support should include:

```text
JavaScript / TypeScript
Java
Python-like DSL
SQL
JSON
YAML
XML
Markdown
Plain text logs
Diffs
```

Custom language packages will be needed for:

```text
Prism DSL
pseudo-COBOL
RDML/RDMLX
Jabol-style reconstructed views
other target-specific representations
```

### 19.3 Control implementation

Use hand-built React components for stable product workflows.

Use schema-driven generated forms for dynamic or AI-created control surfaces.

The UI must clearly distinguish generated forms from curated product panels if quality, completeness or confidence differs.

### 19.4 Workspace implementation

Use a docking/window layout component capable of:

* tabs;
* split panes;
* moving panels;
* resizing;
* layout serialization;
* layout restore;
* optional popout windows;
* component factories;
* custom tab rendering.

The workspace layout must be serializable because workspaces are part of user productivity.

## 20. Surface registry

Semantic Prism should maintain a client-side registry of known surface types.

Each registered surface should declare:

```text
surface type
subtype
component
supported modes
required data
supported commands
selection behaviour
context subscriptions
permissions
default layout hints
AI-creation eligibility
```

Example conceptual registry entry:

```json
{
  "surfaceType": "canvas",
  "surfaceSubtype": "impact-analysis-map",
  "component": "ImpactGraphSurface",
  "supportedModes": ["read-only", "interactive", "review"],
  "commands": [
    "selectNode",
    "expandImpact",
    "openSourceTrace",
    "addToChangeSet"
  ],
  "aiCreatable": true
}
```

## 21. Context synchronization

The UI must treat selection and focus as semantic concepts.

### 21.1 Selection types

Selections may include:

```text
semantic object
text range
graph node
graph edge
form field
change-set item
validation error
AI evidence item
source artefact
workspace
```

### 21.2 Context propagation

When selection changes, interested surfaces receive the update.

Example:

```text
Selected: BusinessRule: CreditLimitValidation

DSL editor:
  highlights corresponding block

Graph:
  highlights rule node and direct dependencies

Details panel:
  displays properties

AI panel:
  updates available actions

Change set panel:
  shows pending changes for this rule

Source view:
  enables "show original fragment"
```

### 21.3 Avoiding context chaos

Not every surface should react to every event. Surfaces must declare their context subscriptions.

The workspace should also allow pinning a surface so it does not change when global selection changes.

## 22. Agentic UI generation

Semantic Prism should support agentic UI, but only under governed constraints.

### 22.1 Allowed AI-created UI

The AI may generate:

* workspace compositions;
* surface descriptors;
* graph descriptors;
* form schemas;
* dashboards from available widgets;
* explanation panels;
* review checklists;
* validation plans.

### 22.2 Disallowed AI-created UI

The AI should not generate:

* arbitrary executable JavaScript;
* arbitrary embedded HTML with unsafe behaviour;
* hidden network calls;
* destructive controls without permission mapping;
* untyped mutation actions;
* UI that bypasses review.

### 22.3 Agentic control panel example

The AI may request a control surface:

```json
{
  "surfaceType": "control",
  "surfaceSubtype": "schema-generated-form",
  "title": "Define Credit Limit Exception",
  "schema": {
    "type": "object",
    "properties": {
      "customerCategory": {
        "type": "string",
        "enum": ["Standard", "VIP", "Partner"]
      },
      "requiresApproval": {
        "type": "boolean"
      },
      "approvalRole": {
        "type": "string"
      }
    },
    "required": ["customerCategory", "requiresApproval"]
  },
  "onSubmitCommand": "ProposeBusinessRuleChange"
}
```

The UI renders the form, validates inputs and emits a semantic command. The AI does not receive direct authority to mutate the system.

## 23. Error, uncertainty and confidence UX

Semantic Prism must be honest about uncertainty.

### 23.1 Error categories

The UI should distinguish:

```text
extraction error
mapping error
AI interpretation error
validation error
source artefact unavailable
permission issue
stale data
conflicting model evidence
unsupported operation
```

### 23.2 Confidence display

AI-derived content should show confidence carefully, preferably with evidence rather than numerical theatre.

Better:

```text
High confidence — directly supported by 3 source fragments and 1 validation rule.
```

Avoid:

```text
Confidence: 87%
```

unless the number has a real calibrated meaning.

### 23.3 Empty and partial states

When data is missing, the UI must show what is missing and what can still be done.

Example:

```text
Repository metadata unavailable.
Available views: source-code view, text search, AI explanation.
Unavailable views: field lineage, full impact analysis, validation rule trace.
```

## 24. Security and permission UX

Even though backend authorization is out of scope, the UI must be designed around permissions.

Actions should be visibly permission-aware.

Examples:

```text
View source: allowed
Create proposal: allowed
Generate technical diff: restricted
Run validation: restricted
Approve change: restricted
Apply change: not available
```

Disabled controls should explain why they are disabled.

Sensitive artefacts should be visually marked when appropriate.

AI actions must respect the same permission model as human actions.

## 25. Performance expectations from the UI

Semantic Prism must handle large systems without becoming visually unusable.

### 25.1 Large graph handling

Canvas surfaces must support:

* progressive loading;
* node clustering;
* collapsed groups;
* filtering;
* focus mode;
* server-provided subgraphs;
* layout cancellation;
* layout recomputation;
* performance warnings;
* table fallback.

The UI should avoid rendering thousands of graph nodes by default.

### 25.2 Large text handling

Text surfaces must handle large files and logs through:

* virtualized rendering where necessary;
* incremental loading;
* search indexing;
* folding;
* diagnostics filtering;
* chunked log views.

### 25.3 Workspace performance

The workspace must avoid unnecessary re-rendering across unrelated surfaces.

Surfaces should be lazy-loaded where possible. Heavy graph surfaces should not block the entire application.

## 26. Initial MVP UI

The first credible MVP should demonstrate all three surface types and the workspace model.

### 26.1 MVP scenario

Pick one application slice, independent of target technology.

The slice should include:

* one domain entity;
* one screen or process;
* one business rule;
* one dependency path;
* one original artefact view;
* one proposed change;
* one validation placeholder.

### 26.2 MVP workspace

The MVP should include one task-oriented workspace:

```text
Impact and Change Workspace
```

Default layout:

```text
Left:
  Object Explorer

Center:
  Canvas Surface — application/impact graph

Right:
  Control Surface — AI explanation and change controls

Bottom:
  Text Surface — DSL/original source/diff tabs
```

### 26.3 MVP capabilities

The MVP should allow the user to:

* browse semantic objects;
* select an object in graph or explorer;
* see synchronized text/source view;
* ask AI for explanation;
* generate a business-readable summary;
* propose a simple semantic change;
* add it to a change basket;
* show a semantic diff;
* show a placeholder technical diff;
* show validation status;
* reset or save workspace layout.

The MVP does not need full backend mutation, but the UI must behave as if change governance exists.

## 27. Non-goals for the first UI version

The first UI version should not attempt to implement:

* a full IDE;
* arbitrary visual programming;
* full low-code app generation;
* unrestricted AI-generated UI;
* real-time collaborative editing;
* production-grade approval workflow;
* all possible diagram types;
* every legacy language;
* direct mutation of target systems;
* complete mobile support;
* undo/redo history that survives reload, reconnect or logout (session-scoped undo/redo is sufficient for now);
* a dedicated change-set lineage/history graph visualization (link-based lineage in the review panel is sufficient for now);
* rollback of already-applied change sets against real target systems (the UI flow may exist, but it does not need a working backend behind it).

It should prove the core interaction model:

```text
semantic object
  ↔ text projection
  ↔ canvas projection
  ↔ control projection
  ↔ AI explanation
  ↔ proposed change
  ↔ reviewable change set
```

## 28. Open questions for the next specification phase

Questions 1–14 below are answered in [Semantic Prism - State and Backend Architecture Specification.md](Semantic%20Prism%20-%20State%20and%20Backend%20Architecture%20Specification.md) §6. Questions 15–17 are not yet answered by that document, or by any other spec in this directory, as of this writing — treat them as still open.

The following decisions are intentionally left open:

1. What is the canonical client-side state architecture?
2. Do we use MVVM explicitly, or a React store/event model?
3. What is the exact semantic model contract exposed to the UI?
4. How are semantic commands represented?
5. How are changes persisted?
6. How does the AI request surface creation?
7. What is the security model for agentic UI?
8. How are source mappings represented?
9. How does validation status arrive at the UI?
10. Which graph renderer becomes canonical?
11. How are custom language grammars packaged?
12. How much of the workspace layout is user-specific versus task-specific?
13. What belongs in the client and what must remain server-side?
14. How is collaboration introduced later without redesigning the workspace model?
15. Should the change-basket undo/redo buffer persist across reload/reconnect, and if so, where (server-side operation log, local storage, something else)?
16. What backend mechanism does a committed change set map to (a git commit, an event-sourced record, or another representation), and does that choice constrain how rollback and supersession are implemented?
17. At what point does change-set lineage need a dedicated graph visualization rather than in-panel links?

## 29. Concise product definition

Semantic Prism is a client-side semantic workbench built around three bidirectional surface types: text, canvas and control.

Text surfaces represent symbolic artefacts such as source code, DSLs, pseudo-code, schemas, diffs and logs.

Canvas surfaces represent spatial and relational structures such as dependency graphs, process flows, data models, architecture maps and AI-generated semantic diagrams.

Control surfaces represent structured interaction such as forms, dashboards, validation panels, change reviews and agent controls.

A Semantic Workspace Manager composes these surfaces into synchronized task-oriented workspaces. A Context Bus keeps selections and projections aligned. A Command Router converts human and AI interactions into semantic commands. Change-set and validation surfaces make proposed modifications reviewable, traceable and governable.

The result is not an IDE replacement. It is a visual, AI-assisted semantic interface for understanding and evolving complex software systems while preserving traceability to the underlying artefacts.
