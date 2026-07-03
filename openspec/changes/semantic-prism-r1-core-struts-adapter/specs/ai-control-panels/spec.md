## MODIFIED Requirements

### Requirement: AI Analysis panel content
The AI Analysis panel SHALL display, for the currently selected object, its semantic kind, description, relationships, provenance summary, and confidence/evidence, sourced from the Semantic Prism Core rather than fixed mock content.

#### Scenario: Panel shows backend-provided object detail
- **WHEN** an object is selected
- **THEN** the AI Analysis panel shows that object's kind, description, relationships, provenance summary, and confidence/evidence from backend data

### Requirement: AI Analysis panel actions
The AI Analysis panel SHALL offer only the actions valid in R1's read-only command model: at minimum "Show source trace". Actions with no R1 backing (e.g. "Preview impact", "Generate validation checklist") SHALL be disabled or marked as not available.

#### Scenario: Show source trace action
- **WHEN** the user clicks "Show source trace"
- **THEN** the bottom dock's active tab switches to "Trace"

#### Scenario: Unavailable action is disabled
- **WHEN** the panel offers an action with no R1 backing
- **THEN** that action is disabled or visibly marked as not available, with a reason indicating it is planned for a later release

### Requirement: Change Proposal form
The Change Proposal panel SHALL be disabled or marked as not available in R1, since R1's command model excludes `ProposeBusinessRuleChange`.

#### Scenario: Change Proposal panel shows unavailable state
- **WHEN** the user views the right column in R1
- **THEN** the Change Proposal panel is disabled or visibly marked as not available, with a reason indicating change proposals are planned for a later release

### Requirement: Change Basket / Validation Summary panel
The Change Basket / Validation Summary panel SHALL be disabled or marked as not available in R1, since R1's command model excludes `CreateChangeBasket`, `CommitChangeSet`, and `RunValidation`.

#### Scenario: Change Basket panel shows unavailable state
- **WHEN** the user views the right column in R1
- **THEN** the Change Basket / Validation Summary panel is disabled or visibly marked as not available, with a reason indicating it is planned for a later release
