# ai-control-panels Specification

## Purpose

Defines the right AI/Control column of the Impact & Change Workspace mock-up: the AI Analysis panel, the Change Proposal form, and the Change Basket / Validation Summary panel, including their fixed mock content and the actions they expose.

## Requirements

### Requirement: Right column panel stack
The right AI/Control column SHALL display three stacked panels in order: AI Analysis, Change Proposal, and Change Basket / Validation Summary.

#### Scenario: All three panels visible
- **WHEN** the workspace renders
- **THEN** the AI Analysis, Change Proposal, and Change Basket/Validation Summary panels are all visible in the right column, in that order

### Requirement: AI Analysis panel content
The AI Analysis panel SHALL display, for the currently selected object, an interpretation summary, evidence counts, a provenance label, and a suggested action; with `CreditLimitValidation` as the default selected object, it SHALL show the fixed interpretation, evidence (3 source fragments, 2 semantic entities, 1 UI event handler, 1 validation test), provenance ("Deterministically derived + AI explained"), and suggested action text from the mock-up spec.

#### Scenario: Default panel content on load
- **WHEN** the application loads with no prior selection
- **THEN** the AI Analysis panel shows the fixed CreditLimitValidation interpretation, evidence counts, provenance, and suggested action

#### Scenario: Panel updates on selection change
- **WHEN** `selectedObject` changes
- **THEN** the AI Analysis panel's "Selected object" heading updates to the new object

### Requirement: AI Analysis panel actions
The AI Analysis panel SHALL offer four actions: "Preview impact", "Show source trace", "Generate validation checklist", and "Explain in business language". At minimum, "Preview impact" and "Show source trace" SHALL be functional in the mock.

#### Scenario: Preview impact action
- **WHEN** the user clicks "Preview impact"
- **THEN** the impact-graph preview overlay is activated (per the impact-graph-canvas capability)

#### Scenario: Show source trace action
- **WHEN** the user clicks "Show source trace"
- **THEN** the bottom dock's active tab switches to "Trace"

### Requirement: Change Proposal form
The Change Proposal panel SHALL show a form with fields: Target rule (CreditLimitValidation), Business change ("Allow exception for customer category VIP"), Required approval (SalesManager), Validation message ("Credit limit exceeded. Sales Manager approval required."), and Risk level (Medium), plus two actions: "Create semantic change" and "Generate change set".

#### Scenario: Form renders fixed content
- **WHEN** the Change Proposal panel is shown
- **THEN** it displays the fixed target rule, business change, required approval, validation message, and risk level values

#### Scenario: Create semantic change action
- **WHEN** the user clicks "Create semantic change"
- **THEN** `changeActive` becomes true, a proposed change is marked/added in the Change Basket panel, and the bottom dock's active tab switches to "Generated Diff"

#### Scenario: Generate change set action
- **WHEN** the user clicks "Generate change set"
- **THEN** "CS-1042 VIP Credit Exception" becomes the active change set and `validationStatus` is set to `not-run` (or an equivalent "ready" state)

### Requirement: Change Basket / Validation Summary panel
The Change Basket panel SHALL display a fixed list of four basket items (Modify CreditLimitValidation; Add VIPExceptionPolicy; Require SalesManager approval; Add VIPExceptionValidationTest), a status label ("Draft semantic change"), and three actions: "Review diff", "Run mock validation", and "Clear".

#### Scenario: Basket renders fixed items
- **WHEN** the Change Basket panel is shown
- **THEN** it lists the four fixed basket items and the "Draft semantic change" status

#### Scenario: Review diff action
- **WHEN** the user clicks "Review diff"
- **THEN** the bottom dock's active tab switches to "Generated Diff"

#### Scenario: Run mock validation action
- **WHEN** the user clicks "Run mock validation"
- **THEN** `validationStatus` transitions from `not-run` to `running`, and then, after a short delay, to `passed-with-warnings`, with the fixed "Approval.role is referenced by the proposed rule..." warning shown once passed

#### Scenario: Clear action
- **WHEN** the user clicks "Clear"
- **THEN** the change basket, `changeActive`, and `validationStatus` reset to their initial (empty / false / not-run) state
