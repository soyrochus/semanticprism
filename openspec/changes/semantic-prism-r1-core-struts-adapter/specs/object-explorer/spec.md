## MODIFIED Requirements

### Requirement: Semantic object tree content
The Object Explorer SHALL populate its semantic object tree from `GET /projects/:projectId/objects`, grouping returned objects by canonical kind: Application, Modules, Screens, User Actions, Application Actions, Business Rules, Validation Rules, Entities, Fields, Data Access, Messages, and Artefacts.

#### Scenario: Tree renders backend-provided canonical hierarchy
- **WHEN** backend semantic objects are available for the open project
- **THEN** the Object Explorer groups them under canonical-kind headings instead of the fixed mock hierarchy

## REMOVED Requirements

### Requirement: Minimum selectable items
Removed for R1: this requirement names fixed items from the Retail Order Platform mock dataset (CreditLimitValidation, Customer.creditLimit, etc.). R1 operates against a real, arbitrary Git-hosted Struts project, so no fixed set of selectable object names can be guaranteed to exist.
