# object-explorer Specification

## Purpose

Defines the left Object Explorer panel of the Impact & Change Workspace mock-up: the static semantic object tree it displays and how selecting items in it drives the shared `selectedObject` state consumed by the rest of the workspace.

## Requirements

### Requirement: Semantic object tree content
The Object Explorer SHALL display a static semantic object tree rooted at "Retail Order Platform" with the categories: Application (Order Entry, Customer Management, Approval Management), Screens (OrderConfirmation, CustomerProfile, ApprovalQueue), Business Rules (CreditLimitValidation, VIPExceptionPolicy, ApprovalRequiredRule, OrderConfirmationRule), Entities (Customer, Order, Approval, CustomerCategory), Fields (Customer.creditLimit, Customer.category, Order.total, Approval.role, Approval.status), Data Stores (CUSTOMER, ORDER_HEADER, APPROVAL), Integrations (Pricing Service, CRM Customer Profile, Notification Queue), Validation (OrderCreditValidationTest, VIPExceptionValidationTest), and Change Sets (CS-1042 VIP Credit Exception).

#### Scenario: Tree renders full mock hierarchy
- **WHEN** the Object Explorer panel is shown
- **THEN** all listed categories and their items are present in the tree, grouped under their category headings

### Requirement: Selecting an explorer item updates shared context
Selecting an item in the Object Explorer SHALL update the shared `selectedObject` state, which in turn updates the highlighted graph node, the AI Analysis panel content, and the bottom dock's text-tab context.

#### Scenario: Selecting a business rule
- **WHEN** the user selects "CreditLimitValidation" in the Object Explorer
- **THEN** `selectedObject` becomes "CreditLimitValidation", the corresponding graph node is highlighted, the AI Analysis panel updates to describe CreditLimitValidation, and the bottom dock text tabs reflect CreditLimitValidation's content

#### Scenario: Selecting a field
- **WHEN** the user selects "Customer.creditLimit" in the Object Explorer
- **THEN** `selectedObject` becomes "Customer.creditLimit" and the impact graph, AI panel, and bottom dock update accordingly

### Requirement: Minimum selectable items
At minimum, the Object Explorer SHALL support selection for: CreditLimitValidation, Customer.creditLimit, OrderConfirmation, VIPExceptionPolicy, and CS-1042 VIP Credit Exception, each producing a coherent update across the rest of the workspace.

#### Scenario: Selecting the active change set
- **WHEN** the user selects "CS-1042 VIP Credit Exception" in the Object Explorer
- **THEN** `selectedObject` becomes the CS-1042 change set and dependent panels update to reflect it without error
