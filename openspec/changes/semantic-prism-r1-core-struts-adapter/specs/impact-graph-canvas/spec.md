## MODIFIED Requirements

### Requirement: Minimum graph dataset
The impact graph SHALL populate its nodes and edges from `GET /projects/:projectId/subgraph`, using canonical semantic objects and relationships returned by the Semantic Prism Core, laid out using Dagre's directed algorithm, rather than the fixed mock dataset.

#### Scenario: Graph renders canonical model from backend data
- **WHEN** the user opens the impact graph for a project
- **THEN** graph nodes and edges represent canonical semantic objects and relationships returned by the core's subgraph API rather than Struts-specific technical shapes or fixed mock content

## REMOVED Requirements

### Requirement: Scripted highlight on Customer.creditLimit selection
Removed for R1: this highlight set is specific to the fixed Retail Order Platform mock dataset, which R1 does not use.

### Requirement: Scripted highlight on CreditLimitValidation selection
Removed for R1: this highlight set is specific to the fixed Retail Order Platform mock dataset, which R1 does not use.

### Requirement: Preview-impact overlay
Removed for R1: R1's command model explicitly excludes `ProposeBusinessRuleChange` and change-basket commands, so there is no "Preview impact" action to trigger this overlay.
