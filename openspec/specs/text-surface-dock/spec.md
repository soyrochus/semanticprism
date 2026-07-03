# text-surface-dock Specification

## Purpose

Defines the bottom Text Surface dock of the Impact & Change Workspace mock-up: its five tabs (Semantic DSL, Original Source, Generated Diff, Validation, Trace), their fixed mock content, how they respond to the change-activation and validation-status lifecycle, and how they stay in sync with the currently selected object.

## Requirements

### Requirement: Bottom dock tabs
The bottom dock SHALL provide five tabs: Semantic DSL, Original Source, Generated Diff, Validation, and Trace, rendered using CodeMirror (or a styled read-only code block as a fallback for at least the DSL, source, and diff tabs), with monospace typography.

#### Scenario: All tabs present
- **WHEN** the bottom dock renders
- **THEN** the Semantic DSL, Original Source, Generated Diff, Validation, and Trace tabs are all present and individually selectable

### Requirement: Semantic DSL tab content
The Semantic DSL tab SHALL display the fixed `CreditLimitValidation` DSL rule text (the standard-customer blocking `when` clause and the VIP/SalesManager-approval `when` clause), and SHALL visually mark the VIP/approval `when` block as "proposed" once the change is active.

#### Scenario: DSL tab shows base rule
- **WHEN** the Semantic DSL tab is opened before the change is activated
- **THEN** it shows both `when` blocks of the CreditLimitValidation rule, with neither marked as proposed

#### Scenario: DSL tab marks proposed block after change activation
- **WHEN** the change is activated (`changeActive` is true) and the Semantic DSL tab is open
- **THEN** the VIP/SalesManager-approval `when` block is visually marked as proposed

### Requirement: Original Source tab content
The Original Source tab SHALL display the fixed pseudo-legacy `ConfirmOrder` function source text, styled to resemble a real legacy/4GL artefact without claiming to be a valid implementation language, and SHALL show an annotation/marker at the location where the generated patch would apply once the change is active.

#### Scenario: Source tab shows patch marker after change activation
- **WHEN** the change is activated and the Original Source tab is open
- **THEN** an annotation or marker appears at the `IF (#ORDER_TOTAL > #CREDIT_LIMIT)` block indicating where the generated patch applies

### Requirement: Generated Diff tab content
The Generated Diff tab SHALL show a "no diff yet" placeholder message before the change is activated, and SHALL show the fixed before/after unified diff of the `ConfirmOrder` source once the change is activated.

#### Scenario: Diff tab before activation
- **WHEN** `changeActive` is false and the Generated Diff tab is open
- **THEN** the tab shows the message indicating no diff has been generated yet

#### Scenario: Diff tab after activation
- **WHEN** `changeActive` becomes true
- **THEN** the Generated Diff tab shows the fixed unified diff adding the VIP/SalesManager-approval branch to the `ConfirmOrder` source

### Requirement: Validation tab content and status transitions
The Validation tab SHALL display `validationStatus` (`not-run` | `running` | `passed-with-warnings`) with status-appropriate content: available-checks list when not-run, a running indicator while running, and a checklist plus the fixed "Approval.role mapping requires platform expert confirmation" warning and summary text when passed-with-warnings.

#### Scenario: Not-run state
- **WHEN** `validationStatus` is `not-run` and the Validation tab is open
- **THEN** the tab lists the available checks (semantic consistency, source patch structure, referenced role mapping, validation test coverage) and shows no results

#### Scenario: Running state
- **WHEN** `validationStatus` is `running`
- **THEN** the Validation tab shows a "Running..." status indicator

#### Scenario: Passed-with-warnings state
- **WHEN** `validationStatus` is `passed-with-warnings`
- **THEN** the Validation tab shows all four checks marked passed, the "Approval.role mapping requires platform expert confirmation" warning, and the fixed summary paragraph

### Requirement: Trace tab content
The Trace tab SHALL display the fixed traceability content for CreditLimitValidation: its derivation sources (Original Artefact ConfirmOrder, UI Event OrderConfirmation.OK, Field Customer.creditLimit, Field Order.total, Entity Customer, Entity Order), its projections (Semantic DSL block, impact graph node, change-set item), and its evidence types (deterministic extraction, AI explanation, human review pending).

#### Scenario: Trace tab shows full provenance chain
- **WHEN** the Trace tab is opened
- **THEN** it shows the derivation sources, projections, and evidence types listed above

### Requirement: Selection-driven tab context
Selecting an object elsewhere in the workspace SHALL update which object's content the bottom dock's tabs display, keeping all five tabs consistent with the currently selected object.

#### Scenario: Selecting a different object updates dock context
- **WHEN** `selectedObject` changes
- **THEN** the content shown in the currently active bottom-dock tab reflects the newly selected object
