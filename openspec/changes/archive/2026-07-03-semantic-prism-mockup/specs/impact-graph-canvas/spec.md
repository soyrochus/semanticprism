## ADDED Requirements

### Requirement: Minimum graph dataset
The impact graph SHALL render at least 20 nodes and typed edges, using a Dagre-computed directed layout, and SHALL include at minimum the nodes: OrderConfirmation, OK Button Handler, ConfirmOrder, CreditLimitValidation, VIPExceptionPolicy, ApprovalRequiredRule, Customer.creditLimit, Customer.category, Order.total, Approval.role, Approval.status, Customer, Order, Approval, CUSTOMER table, ORDER_HEADER table, APPROVAL table, Pricing Service, CRM Customer Profile, Notification Queue, SalesManager, OrderCreditValidationTest, VIPExceptionValidationTest, Original RDMLX Artefact (or a generically-labeled equivalent), Semantic DSL Projection, and Generated Change Set CS-1042.

#### Scenario: Graph meets minimum size on load
- **WHEN** the Canvas Surface renders
- **THEN** it displays at least 20 nodes and their typed edges, laid out using Dagre's directed algorithm

### Requirement: Typed node visual styles
Each graph node SHALL belong to one of the types: screen, process, business-rule, field, entity, table, integration, role, policy, source-artifact, validation, change-set, or ai-inference, and SHALL be rendered with a distinct visual style (icon or type marker) plus a label, an optional status/risk badge, and an optional confidence/provenance indicator.

#### Scenario: Distinct type styling
- **WHEN** the graph renders nodes of different types (e.g. a business-rule node and a field node)
- **THEN** each node's type is visually distinguishable via its icon/marker independent of its label text

### Requirement: Typed graph edges
Edges SHALL be typed using one of: triggers, validates, reads, writes, depends-on, implemented-by, projected-as, impacts, requires-approval, validated-by, notifies, or proposes, and SHALL be capable of showing a relationship label or tooltip, at minimum for the currently selected path.

#### Scenario: Selected path shows edge labels
- **WHEN** a node is selected and its connected path is highlighted
- **THEN** the edges along that highlighted path display their relationship-type label or tooltip

### Requirement: Graph navigation controls
The Canvas Surface SHALL support zoom, pan, a fit-to-screen button, a reset-view button, a legend describing node/edge types, and a graph-mode toggle among Impact View, Data View, and Flow View.

#### Scenario: Fit to screen
- **WHEN** the user activates "fit to screen"
- **THEN** the graph viewport rescales and recenters so all currently visible nodes fit within the canvas area

#### Scenario: Switching graph mode
- **WHEN** the user switches the graph-mode toggle to "Data View"
- **THEN** the canvas re-renders the same underlying graph data with the Data View's highlighted/emphasized subset, without reloading unrelated state

### Requirement: Node selection and hover interaction
The Canvas Surface SHALL support node selection with a visible selected-node highlight, hover tooltips, connected-path highlighting, and dimming of unrelated nodes when a node is selected.

#### Scenario: Selecting a node dims unrelated nodes
- **WHEN** the user selects a graph node
- **THEN** the selected node and its connected path are visually highlighted while unrelated nodes are visually dimmed

#### Scenario: Hovering a node shows a tooltip
- **WHEN** the user hovers over a graph node
- **THEN** a tooltip appears showing that node's label and type

### Requirement: Scripted highlight on Customer.creditLimit selection
When `selectedObject` is "Customer.creditLimit", the graph SHALL highlight exactly the node set: Customer.creditLimit, Customer, CUSTOMER table, CreditLimitValidation, OrderConfirmation, ConfirmOrder, OrderCreditValidationTest, and Generated Change Set CS-1042.

#### Scenario: Field selection highlights its impact set
- **WHEN** `selectedObject` becomes "Customer.creditLimit" (via Object Explorer or direct graph click)
- **THEN** the graph highlights Customer.creditLimit, Customer, CUSTOMER table, CreditLimitValidation, OrderConfirmation, ConfirmOrder, OrderCreditValidationTest, and Generated Change Set CS-1042, and dims all other nodes

### Requirement: Scripted highlight on CreditLimitValidation selection
When `selectedObject` is "CreditLimitValidation", the graph SHALL highlight exactly the node set: CreditLimitValidation, Order.total, Customer.creditLimit, Customer.category, VIPExceptionPolicy, ApprovalRequiredRule, OrderConfirmation, Original RDMLX Artefact (or generic equivalent), Semantic DSL Projection, and Generated Change Set CS-1042.

#### Scenario: Rule selection highlights its impact set
- **WHEN** `selectedObject` becomes "CreditLimitValidation"
- **THEN** the graph highlights CreditLimitValidation, Order.total, Customer.creditLimit, Customer.category, VIPExceptionPolicy, ApprovalRequiredRule, OrderConfirmation, the original-artefact node, the Semantic DSL Projection node, and Generated Change Set CS-1042, and dims all other nodes

### Requirement: Preview-impact overlay
When the "Preview impact" action is triggered from the AI Analysis panel, the graph SHALL activate a proposed-change overlay covering the node/edge set: VIPExceptionPolicy, SalesManager, Approval.role, VIPExceptionValidationTest, and Generated Change Set CS-1042, rendered in violet/blue-violet styling.

#### Scenario: Preview impact activates overlay
- **WHEN** the user clicks "Preview impact" in the AI Analysis panel
- **THEN** the graph adds or activates violet-styled overlay highlighting on VIPExceptionPolicy, SalesManager, Approval.role, VIPExceptionValidationTest, and Generated Change Set CS-1042
