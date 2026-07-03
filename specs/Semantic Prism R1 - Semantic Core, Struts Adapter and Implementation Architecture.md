# Semantic Prism R1 — Semantic Core, Struts Adapter and Implementation Architecture

Status: Draft
Version: 0.1
Date: 2026-07-03
Scope: Semantic Prism R1 implementation architecture
Primary target substrate: Git-hosted Java Struts application

---

## Related documents

This document builds on the following specs (all in `specs/`), assumed rather than re-derived:

* [Semantic Prism - Client-Side UI Specification.md](Semantic%20Prism%20-%20Client-Side%20UI%20Specification.md) — surface types (Text/Canvas/Control), workspace model, six conceptual UI layers.
* [Semantic Prism - State and Backend Architecture Specification.md](Semantic%20Prism%20-%20State%20and%20Backend%20Architecture%20Specification.md) — client store slices, command-only mutation path, generic-core/substrate-adapter split.
* [Semantic Prism - Frontend Engineering Guidelines.md](Semantic%20Prism%20-%20Frontend%20Engineering%20Guidelines.md) — implementation conventions for client-side code (stack, file layout, state wiring, styling).
* [Semantic Prism - Local HTML Mock-Up Specification.md](Semantic%20Prism%20-%20Local%20HTML%20Mock-Up%20Specification.md) — the static mock-up that precedes this real implementation.
* [Semantic Prism - ADR 0001 - Backend Implementation Language.md](Semantic%20Prism%20-%20ADR%200001%20-%20Backend%20Implementation%20Language.md) — decision on backend implementation language, binding on this document's backend architecture.

## 1. Purpose

This document defines the first real implementation release of Semantic Prism.

Semantic Prism R1 is not another static mock-up. It is the first working product slice: an authenticated, multi-project, read-only semantic workbench over a Git-hosted Java Struts application.

R1 must prove four things at the same time:

1. The Semantic Prism UI can be backed by real backend data instead of mock data.
2. The Semantic Prism core can manage users, projects, adapter bindings, semantic objects and provenance.
3. A Struts application can be discovered, read and normalized into a substrate-independent semantic model.
4. The resulting semantic model can be explored visually and textually, with traceability back to source artefacts.

R1 does not attempt automated modernization, generated source modification, runtime invocation, validation execution or apply operations. It is a stable read-only release that establishes the product skeleton and the semantic language.

---

## 2. Product definition for R1

Semantic Prism R1 is:

```text
An authenticated, multi-project, read-only semantic workbench
for Git-hosted Java Struts applications.
```

The user logs in, sees assigned projects, opens a Struts project, views a discovered semantic model, selects objects in the explorer or graph, and traces those objects back to source artefacts.

The demonstrable core flow is:

```text
User login
  -> project selection
  -> Struts project opened
  -> repository snapshot available
  -> semantic extraction available
  -> object explorer populated
  -> impact graph populated
  -> source trace available
  -> original source readable
```

R1 should feel like a real application, not a prototype shell. User authentication, project assignment, project status, backend-driven object browsing and source trace must be working.

---

## 3. Architectural context

R1 inherits the previously defined Semantic Prism architecture.

The client is a visual semantic workbench built around three primitive surface families:

```text
Text Surface
Canvas Surface
Control Surface
```

These are composed into task-oriented workspaces. Surfaces do not synchronize with each other directly. They independently render shared semantic state.

The backend is split between:

```text
Semantic Core
  substrate-independent, authoritative, product-level model and governance

Adapter Fabric
  substrate-specific capability providers for discovery, extraction, validation,
  generation, invocation and apply operations
```

For R1, the adapter fabric contains only one real adapter service:

```text
Struts Adapter Service
```

This adapter is read-only and supports only:

```text
discoverArtefacts
readArtefact
extractSemanticObjects
```

The accepted implementation language decision remains:

```text
Semantic Core:      TypeScript / Node.js modular monolith
Adapter services:   independently deployable services
Heavy engines:      Rust only where technically justified
Shared contracts:   OpenAPI / JSON Schema / generated DTOs
```

The R1 Struts adapter may initially be implemented in TypeScript if its work is mostly XML parsing, file discovery, Java/JSP scanning and deterministic extraction. Rust remains available later for heavier parsing, static analysis or large-scale graph processing.

---

## 4. R1 scope

### 4.1 Included in R1

R1 includes:

```text
User login
Role-based access
Project assignment
Project selector
Project status
Adapter registry
Project adapter binding
Git repository snapshot
Struts artefact discovery
Read-only artefact access
Semantic extraction job
Semantic object persistence
Relationship persistence
Provenance persistence
Backend query API
Object explorer from backend data
Impact graph from backend data
Source trace from backend data
Read-only source viewer
Workspace layout persistence, basic version
```

### 4.2 Explicitly not included in R1

R1 does not include:

```text
Real source modification
Generated technical diff against real Struts code
Apply operation
Pull request creation
Runtime invocation
Production validation engine
Full Java static analysis
Full Struts modernization
Business process mining
Real-time collaborative editing
Approval workflow beyond placeholder UI
Change-set lifecycle beyond read-only placeholders
AI-generated code changes
Multi-adapter project execution
```

The existing UI may still show future controls in disabled or placeholder form, but R1 must not imply that those operations are implemented.

---

## 5. The missing foundation: Semantic Prism as a language

Semantic Prism is not only an application. It also defines a semantic language.

The preferred formal term is:

```text
Semantic Prism Metamodel
```

The metamodel is the canonical language of Semantic Prism. It defines the kinds of things the system understands and the relationships between them.

The textual DSL is not the metamodel. The DSL is only one possible projection of the metamodel.

The same semantic model may be projected as:

```text
Object Explorer
Impact Graph
Source Trace
Control Panel
Validation Panel
Generated DSL
Business-readable explanation
Technical source mapping
```

The graph, explorer, trace view and future DSL must all refer to the same canonical semantic objects.

---

## 6. Semantic language tiers

Semantic Prism uses three semantic tiers.

### 6.1 Tier 1 — Canonical Semantic Metamodel

This is the stable, substrate-independent vocabulary.

Examples:

```text
Application
Module
Screen
UserAction
ApplicationAction
BusinessRule
ValidationRule
Entity
Field
DataAccessOperation
Message
Artefact
ProvenanceRecord
```

Tier 1 concepts must be valid across multiple implementation substrates. If a concept only makes sense in Struts, Java, JSP, Spring, COBOL or Git, it does not belong in Tier 1.

### 6.2 Tier 2 — Semantic projections

Tier 2 contains the ways in which the metamodel is shown or edited.

Examples:

```text
Object explorer hierarchy
Impact graph
Source trace view
Semantic DSL
Rule form
Change review panel
AI explanation panel
```

A projection is not authoritative. It is a view over the semantic model.

### 6.3 Tier 3 — Substrate mappings

Tier 3 maps concrete implementation artefacts into the canonical language.

For R1:

```text
JSP                      -> Screen / ViewTemplate / Artefact
Submit button or link     -> UserAction
struts-config action path -> EntryPoint / route binding
Struts Action class       -> ApplicationAction
ActionForm property       -> Field
validate() method         -> ValidationRule
Java condition            -> candidate BusinessRule or ValidationRule
properties entry          -> Message
DAO method                -> DataAccessOperation
Java/XML/JSP file         -> Artefact
```

Tier 3 may know about Struts. Tier 1 may not depend on Struts.

---

## 7. Modelling rule

The most important modelling rule for R1:

```text
If a concept only makes sense inside Struts, Java, JSP, Git or another substrate,
it belongs in the substrate mapping or provenance layer, not in the canonical
semantic metamodel.
```

For example:

```text
StrutsAction
ActionForm
Forward
ActionMapping
JSP
struts-config.xml
MessageResources
```

These are useful extraction concepts, but they are not canonical semantic concepts.

The canonical equivalents are:

```text
ApplicationAction
InputModel / Field
NavigationOutcome
EntryPoint
Screen / ViewTemplate
Artefact
Message
```

---

## 8. Canonical semantic vocabulary

### 8.1 Application

Definition:

```text
A bounded software system being analysed as one project context.
```

Boundary test:

```text
Can the user reasonably select it as a project-level system?
```

Examples:

```text
Retail Order Platform
Claims Management System
Customer Portal
```

Common relationships:

```text
Application contains Module
Application contains Screen
Application contains Entity
Application implemented-by Artefact
```

Struts R1 mapping:

```text
A configured Git repository or repository root becomes the analysed Application.
```

---

### 8.2 Module

Definition:

```text
A coherent subdivision of an application, usually functional, technical or both.
```

Boundary test:

```text
Does it group related screens, actions, services, entities or artefacts?
```

Examples:

```text
Order Entry
Customer Management
Approval Management
```

Common relationships:

```text
Module part-of Application
Module contains Screen
Module contains ApplicationAction
Module contains Entity
```

Struts R1 mapping:

```text
May be inferred from package names, folder structure, URL path prefixes,
configuration grouping or explicit project metadata.
```

---

### 8.3 Screen

Definition:

```text
A user-facing interaction surface where information is shown, captured or acted upon.
```

Boundary test:

```text
Can a user see it or interact with it?
```

Examples:

```text
Order Confirmation
Customer Search
Approval Queue
```

Common relationships:

```text
Screen exposes Field
Screen exposes UserAction
Screen displays Message
Screen rendered-by Artefact
Screen submits-to ApplicationAction
```

Struts R1 mapping:

```text
A JSP page is mapped to Screen when it represents a user-facing page.
```

Notes:

A JSP file is an artefact. A Screen is the semantic user-facing concept represented by that artefact.

---

### 8.4 UserAction

Definition:

```text
An externally meaningful intent initiated by a user or actor through a screen,
menu, link, form submission or equivalent interaction channel.
```

Boundary test:

```text
Can a business or domain user name it without knowing the implementation?
```

Examples:

```text
Confirm order
Search customer
Submit approval
Cancel invoice
Save customer profile
```

Common relationships:

```text
UserAction exposed-by Screen
UserAction triggers ApplicationAction
UserAction requires Field
UserAction may-produce Message
```

Struts R1 mapping:

```text
Submit buttons, form actions, links and menu actions in JSPs may become UserAction
objects when they express visible user intent.
```

Important distinction:

```text
UserAction is user intent.
ApplicationAction is application handling.
```

A user action may be implemented by different technical mechanisms in different substrates. In Struts it may trigger a Struts Action. In Spring MVC it may call a controller method. In a mainframe system it may trigger a transaction. The UserAction remains stable across those implementations.

Example:

```text
UserAction:
  Confirm order

ApplicationAction:
  ConfirmOrderAction.execute(...)
```

---

### 8.5 ApplicationAction

Definition:

```text
An application-internal handling step that receives, coordinates or processes
a request, event or interaction.
```

Boundary test:

```text
Does it correspond to a callable handler, route target, endpoint, transaction,
controller method or equivalent processing step?
```

Examples:

```text
ConfirmOrderAction.execute
SearchCustomerAction.execute
POST /orders/{id}/confirm
CONFIRM_ORDER transaction
```

Common relationships:

```text
ApplicationAction triggered-by UserAction
ApplicationAction reads Field
ApplicationAction writes Field
ApplicationAction calls ApplicationAction
ApplicationAction evaluates BusinessRule
ApplicationAction evaluates ValidationRule
ApplicationAction emits Message
ApplicationAction navigates-to Screen
ApplicationAction implemented-by Artefact
```

Struts R1 mapping:

```text
A Struts Action class, usually its execute(...) method, maps to ApplicationAction.
```

Preferred term:

```text
ApplicationAction
```

Avoid using `ControllerAction` as the canonical term because it leaks MVC terminology into the semantic model. In Struts-specific views the UI may display `Struts Action`, but the canonical kind remains `ApplicationAction`.

---

### 8.6 BusinessRule

Definition:

```text
A domain-level policy, decision, obligation, calculation or constraint that
determines business behaviour.
```

Boundary test:

```text
Would changing it change what the business considers allowed, required,
calculated, classified or decided?
```

Examples:

```text
An order may not be confirmed if the customer credit limit is exceeded.
VIP customers may exceed the credit limit if Sales Manager approval exists.
A cancelled order must not be invoiced.
Gold customers receive a 10% discount.
```

Common relationships:

```text
BusinessRule evaluated-by ApplicationAction
BusinessRule reads Field
BusinessRule affects Screen
BusinessRule affects UserAction
BusinessRule enforced-by ValidationRule
BusinessRule emits Message
BusinessRule implemented-by Artefact
```

Struts R1 mapping:

```text
A BusinessRule may be inferred from Java conditions, branching logic, message
emission, validation failures, service calls or combinations of these.

R1 should mark such rules as candidate or derived unless there is strong
deterministic evidence.
```

Important distinction:

```text
BusinessRule governs domain behaviour.
ValidationRule checks admissibility, completeness, consistency or safety.
```

A validation rule may enforce a business rule, but not every validation rule is a business rule.

---

### 8.7 ValidationRule

Definition:

```text
A check that determines whether input, state, artefact or proposed change is
acceptable before processing continues.
```

Boundary test:

```text
Does it return pass, fail, warning or blocking feedback?
```

Examples:

```text
Customer ID is required.
Order total must be numeric and greater than zero.
Approval role must be one of the configured roles.
Order must contain at least one line item.
Generated change set must include test coverage.
```

Common relationships:

```text
ValidationRule validates Field
ValidationRule validates Entity
ValidationRule validates UserAction
ValidationRule enforces BusinessRule
ValidationRule emits Message
ValidationRule evaluated-by ApplicationAction
ValidationRule implemented-by Artefact
```

Struts R1 mapping:

```text
ActionForm.validate(...)
Validation framework XML
Explicit error collection
Required-field checks
Type/range checks
MessageResource keys associated with validation failures
```

Important distinction:

```text
ValidationRule checks whether something is acceptable.
BusinessRule defines what the business wants or permits.
```

Example:

```text
BusinessRule:
  VIP customers may exceed credit limit with Sales Manager approval.

ValidationRule:
  Approval.status must be Approved.
  Approval.role must be SalesManager.
```

The validation rules help enforce the business rule, but the business rule is the domain policy.

---

### 8.8 Entity

Definition:

```text
A domain-relevant object or record type about which the application stores,
retrieves or manipulates information.
```

Boundary test:

```text
Does it represent a business object, persistent record or relevant application
data structure?
```

Examples:

```text
Customer
Order
Approval
Invoice
Product
```

Common relationships:

```text
Entity has Field
Entity read-by DataAccessOperation
Entity written-by DataAccessOperation
Entity used-by BusinessRule
Entity displayed-on Screen
```

Struts R1 mapping:

```text
May be inferred from JavaBeans, domain classes, DTOs, DAO usage, SQL tables,
form models or naming conventions.
```

---

### 8.9 Field

Definition:

```text
A named data element belonging to an entity, form, message, record, source
structure or artefact.
```

Boundary test:

```text
Is it a named value that can be read, written, displayed, validated or mapped?
```

Examples:

```text
Customer.creditLimit
Customer.category
Order.total
Approval.status
Approval.role
```

Common relationships:

```text
Field belongs-to Entity
Field displayed-on Screen
Field required-by UserAction
Field read-by ApplicationAction
Field written-by ApplicationAction
Field validated-by ValidationRule
Field used-by BusinessRule
Field sourced-from DataAccessOperation
```

Struts R1 mapping:

```text
ActionForm properties
JavaBean properties
JSP form fields
request parameters
entity/DTO fields
SQL columns, where detectable
```

Note:

A form field and an entity field are not always the same. R1 should preserve enough metadata to distinguish source usage while still mapping both to the canonical `Field` concept where appropriate.

---

### 8.10 DataAccessOperation

Definition:

```text
A read or write operation against persistent, external or structured data.
```

Boundary test:

```text
Does it retrieve, store, update, delete or query data?
```

Examples:

```text
Find customer by ID
Load order header
Update order status
Insert approval record
```

Common relationships:

```text
DataAccessOperation reads Entity
DataAccessOperation writes Entity
DataAccessOperation reads Field
DataAccessOperation writes Field
DataAccessOperation called-by ApplicationAction
DataAccessOperation implemented-by Artefact
```

Struts R1 mapping:

```text
DAO method
Repository method
JDBC call
SQL statement
Hibernate/MyBatis access
Service method with clear data access semantics
```

---

### 8.11 Message

Definition:

```text
A user-facing, system-facing or validation-facing text emitted, displayed or
recorded by the application.
```

Boundary test:

```text
Is it visible as feedback, label, warning, error, instruction or system output?
```

Examples:

```text
Credit limit exceeded.
Customer ID is required.
Order saved successfully.
Sales Manager approval required.
```

Common relationships:

```text
Message displayed-on Screen
Message emitted-by ApplicationAction
Message emitted-by ValidationRule
Message explains BusinessRule
Message defined-in Artefact
```

Struts R1 mapping:

```text
ApplicationResources.properties
MessageResources
JSP labels
error keys
validation messages
hardcoded strings
```

---

### 8.12 Artefact

Definition:

```text
A concrete implementation object: file, configuration entry, source fragment,
template, schema, test, build object or repository object.
```

Boundary test:

```text
Can it be located, versioned, read or traced in a concrete implementation source?
```

Examples:

```text
struts-config.xml
confirmOrder.jsp
ConfirmOrderAction.java
OrderForm.java
ApplicationResources.properties
CustomerDAO.java
```

Common relationships:

```text
Artefact implements ApplicationAction
Artefact renders Screen
Artefact defines Message
Artefact contains source range
Artefact derived-into SemanticObject
```

Struts R1 mapping:

```text
All relevant files discovered from the Git repository become Artefacts.
```

Note:

Artefact is allowed to be substrate-specific. It is the bridge from canonical semantics back to source.

---

### 8.13 ProvenanceRecord

Definition:

```text
A trace record connecting a semantic object or relationship back to the artefact,
source range, extraction method and evidence that produced it.
```

Boundary test:

```text
Does it answer where this semantic claim came from?
```

Examples:

```text
BusinessRule CreditLimitValidation derived from ConfirmOrderAction.java lines 42-61.
Screen OrderConfirmation rendered by confirmOrder.jsp.
Message credit.limit.exceeded defined in ApplicationResources.properties.
```

Common relationships:

```text
ProvenanceRecord supports SemanticObject
ProvenanceRecord references Artefact
ProvenanceRecord references source range
ProvenanceRecord records extraction type
```

Extraction types:

```text
extracted
derived
AI-inferred
human-confirmed
validated
uncertain
```

R1 requirement:

```text
Every persisted semantic object must have at least one provenance record,
unless explicitly marked as synthetic/system-generated.
```

---

## 9. Canonical relationship vocabulary

R1 should use a constrained relationship vocabulary. This prevents the graph from becoming arbitrary and difficult to query.

### 9.1 Structural relationships

```text
contains
part-of
has
belongs-to
```

Examples:

```text
Application contains Module
Module contains Screen
Entity has Field
Field belongs-to Entity
```

### 9.2 Interaction relationships

```text
exposes
triggers
submits-to
handled-by
navigates-to
```

Examples:

```text
Screen exposes UserAction
UserAction triggers ApplicationAction
Screen submits-to ApplicationAction
ApplicationAction navigates-to Screen
```

### 9.3 Execution relationships

```text
calls
reads
writes
evaluates
emits
```

Examples:

```text
ApplicationAction calls DataAccessOperation
ApplicationAction reads Field
ApplicationAction writes Field
ApplicationAction evaluates BusinessRule
ApplicationAction emits Message
```

### 9.4 Rule relationships

```text
enforces
validates
affects
requires
```

Examples:

```text
ValidationRule enforces BusinessRule
ValidationRule validates Field
BusinessRule affects UserAction
BusinessRule requires Field
```

### 9.5 Implementation and provenance relationships

```text
implemented-by
rendered-by
defined-in
derived-from
supported-by
```

Examples:

```text
ApplicationAction implemented-by Artefact
Screen rendered-by Artefact
Message defined-in Artefact
BusinessRule supported-by ProvenanceRecord
```

### 9.6 R1 relationship guardrail

Do not create relationship names ad hoc during extraction.

If a new relationship appears necessary, it must be classified as one of:

```text
structural
interaction
execution
rule
implementation
provenance
```

and reviewed before being added to the canonical vocabulary.

---

## 10. Struts R1 substrate mapping

R1 uses Struts as the first real substrate because it is legacy enough to test the semantic extraction model, but simple enough to avoid runtime integration and mainframe-level complexity.

The Struts adapter maps concrete Struts artefacts to the canonical semantic metamodel.

### 10.1 Source artefacts

R1 should discover at least:

```text
struts-config.xml
web.xml
JSP files
Java Action classes
ActionForm classes
Java service classes
Java DAO classes
properties/message files
validation XML, where present
SQL files or embedded SQL, where detectable
test files, where present
```

### 10.2 Mapping table

| Struts / Java artefact          | Canonical semantic concept                    | Notes                                                      |
| ------------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| Git repository root             | Application                                   | Project-level analysed system                              |
| Folder/package grouping         | Module                                        | Heuristic; may be refined later                            |
| JSP page                        | Screen / Artefact                             | The JSP file is an artefact; the rendered page is a Screen |
| JSP form field                  | Field                                         | May be form-only or mapped to an Entity field              |
| JSP submit/link/menu item       | UserAction                                    | Only when it expresses meaningful user intent              |
| `struts-config.xml` action path | EntryPoint / route binding                    | Technical route into application handling                  |
| Struts Action class             | ApplicationAction                             | Usually mapped from `execute(...)`                         |
| ActionForm property             | Field                                         | Input model field                                          |
| ActionForm `validate(...)`      | ValidationRule                                | Deterministic if explicit checks found                     |
| validation XML                  | ValidationRule                                | Deterministic where rules are explicit                     |
| Java conditional branch         | candidate BusinessRule or ValidationRule      | Requires classification                                    |
| Error/message key               | Message                                       | Linked to rule or validation where possible                |
| Service method                  | ApplicationAction or ServiceOperation         | R1 may use ApplicationAction for simplicity                |
| DAO method                      | DataAccessOperation                           | If data access semantics are clear                         |
| SQL statement                   | DataAccessOperation / Field / Entity evidence | R1 may extract shallowly                                   |
| properties entry                | Message                                       | May also support label/business term extraction            |

### 10.3 BusinessRule extraction in Struts

Business rules are difficult to extract deterministically. R1 should handle them conservatively.

A Java condition may become a `BusinessRule` candidate if there is evidence such as:

```text
domain field references
business-facing message emission
branching that blocks/allows a user action
validation or error path
service/DAO calls tied to a domain decision
meaningful method or variable names
```

Example:

```java
if (orderTotal.compareTo(customer.getCreditLimit()) > 0) {
    errors.add("credit.limit.exceeded");
    return mapping.findForward("error");
}
```

Possible semantic extraction:

```text
BusinessRule:
  Credit limit validation

Reads:
  Order.total
  Customer.creditLimit

Affects:
  UserAction Confirm order

Emits:
  Message credit.limit.exceeded

Implemented by:
  ConfirmOrderAction.java lines 42-61
```

Confidence:

```text
derived
```

or:

```text
AI-inferred with deterministic evidence
```

depending on whether a naming/explanation step was used.

### 10.4 ValidationRule extraction in Struts

Validation rules are usually easier to extract.

Sources:

```text
ActionForm.validate(...)
validation XML
required field declarations
type checks
range checks
explicit errors.add(...)
input parsing failures
```

Example:

```text
ValidationRule:
  Order total is required

Validates:
  Field Order.total

Emits:
  Message order.total.required

Implemented by:
  OrderForm.java lines 22-29
```

### 10.5 UserAction versus ApplicationAction in Struts

Example mapping:

```text
confirmOrder.jsp submit button "Confirm"
  -> UserAction: Confirm order

struts-config.xml path="/confirmOrder"
  -> EntryPoint: /confirmOrder

ConfirmOrderAction.execute(...)
  -> ApplicationAction: ConfirmOrderAction.execute
```

Relationship chain:

```text
Screen OrderConfirmation
  exposes
UserAction Confirm order
  triggers
ApplicationAction ConfirmOrderAction.execute
  evaluates
BusinessRule CreditLimitValidation
```

This chain is central to R1. It demonstrates how Semantic Prism moves from UI intent to backend handling to business meaning and back to source.

---

## 11. R1 semantic object contract

The backend exposes a normalized semantic graph. The UI must not receive Struts-specific shapes by default.

Canonical shape:

```json
{
  "id": "project.retail.rule.credit-limit-validation",
  "projectId": "project.retail",
  "snapshotId": "snapshot.2026-07-03T150000Z",
  "kind": "BusinessRule",
  "label": "Credit limit validation",
  "attributes": {
    "description": "Blocks order confirmation when the order total exceeds the customer credit limit.",
    "confidence": "derived",
    "status": "active"
  },
  "relationships": [
    {
      "kind": "evaluated-by",
      "targetId": "project.retail.action.confirm-order"
    },
    {
      "kind": "reads",
      "targetId": "project.retail.field.customer.creditLimit"
    },
    {
      "kind": "reads",
      "targetId": "project.retail.field.order.total"
    },
    {
      "kind": "emits",
      "targetId": "project.retail.message.credit-limit-exceeded"
    }
  ],
  "provenance": [
    {
      "provenanceId": "prov.001",
      "sourceArtefactId": "artifact.src.web.ConfirmOrderAction.java",
      "range": {
        "startLine": 42,
        "endLine": 61
      },
      "extractionType": "derived"
    }
  ],
  "validationRefs": []
}
```

R1 may store relationships in a separate table, but the API may return them embedded for UI convenience.

---

## 12. Backend architecture for R1

The R1 backend consists of:

```text
Semantic Prism Core Monolith
PostgreSQL database
Struts Adapter Service
```

The core monolith is authoritative for Semantic Prism state. The adapter service is a capability provider.

### 12.1 Semantic Prism Core Monolith

Implementation baseline, per [ADR 0001](Semantic%20Prism%20-%20ADR%200001%20-%20Backend%20Implementation%20Language.md), with JWT authentication pinned as R1's concrete auth choice (ADR 0001 leaves the adapter/session auth model deferred; R1 settles it for the core):

```text
TypeScript
Node.js
Fastify preferred unless NestJS is explicitly selected later
PostgreSQL
OpenAPI
Runtime schema validation
JWT authentication
Asynchronous job model
```

Responsibilities:

```text
Authentication
Users and roles
Project registry
Project memberships
Adapter registry
Project adapter bindings
Repository snapshots
Artefact catalogue
Semantic object store
Relationship store
Provenance store
Extraction job orchestration
Workspace/layout persistence
Graph query API
Source trace API
Permission checks
```

The core must not contain Struts-specific parsing logic. It may know that a project has an adapter binding of type `java-struts`, but the extraction mechanics belong to the adapter.

### 12.2 Struts Adapter Service

Responsibilities:

```text
Discover Struts artefacts
Read source artefacts
Parse Struts XML configuration
Scan JSP files
Scan Java Action and ActionForm classes
Scan properties/message files
Emit canonical semantic objects
Emit relationships
Emit provenance records
Emit diagnostics
```

Supported R1 capabilities:

```text
discoverArtefacts
readArtefact
extractSemanticObjects
```

Unsupported in R1:

```text
generateArtefactDiff
runValidation
applyChangeSet
invokeRuntime
```

### 12.3 Database

R1 uses PostgreSQL as the primary transactional store.

Required logical tables:

```text
users
projects
project_memberships
adapter_definitions
project_adapter_bindings
repository_snapshots
artefacts
semantic_objects
semantic_relationships
provenance_records
extraction_jobs
workspace_layouts
```

Change baskets and change sets may exist as placeholder schema only if needed for UI compatibility, but they are not active R1 workflow features.

---

## 13. Authentication, roles and project assignment

R1 must include real login and project assignment.

### 13.1 User

```text
id
email
displayName
passwordHash or externalAuthSubject
status
createdAt
updatedAt
```

### 13.2 Project

```text
id
name
description
status
createdAt
updatedAt
```

### 13.3 ProjectMembership

```text
userId
projectId
role
assignedAt
assignedBy
```

### 13.4 Roles

R1 roles:

```text
admin
project-owner
analyst
viewer
```

Permissions:

| Role          | Permissions                                                         |
| ------------- | ------------------------------------------------------------------- |
| admin         | Manage users, projects, memberships, adapter definitions            |
| project-owner | Configure assigned projects, create snapshots, run extraction       |
| analyst       | Open assigned projects, browse semantic model, inspect source trace |
| viewer        | Read-only access to assigned projects                               |

### 13.5 Security rules

```text
Users only see assigned projects.
All project APIs require project membership.
Adapter binding configuration requires project-owner or admin.
Extraction execution requires project-owner or admin.
Semantic browsing requires analyst, project-owner or admin.
Viewer may inspect but not trigger extraction.
The UI must not call adapter services directly.
```

R1 uses JWT authentication. Role and project membership drive visible UI actions.

---

## 14. Adapter registry and project adapter binding

### 14.1 AdapterDefinition

Defines an available adapter type.

```text
id
adapterType
displayName
serviceEndpoint
supportedCapabilities
status
version
```

Example:

```json
{
  "id": "adapter.java-struts",
  "adapterType": "java-struts",
  "displayName": "Java Struts Adapter",
  "serviceEndpoint": "http://struts-adapter:4100",
  "supportedCapabilities": [
    "discoverArtefacts",
    "readArtefact",
    "extractSemanticObjects"
  ],
  "status": "active",
  "version": "0.1.0"
}
```

### 14.2 ProjectAdapterBinding

Binds a project to a concrete adapter configuration.

```text
id
projectId
adapterDefinitionId
bindingName
repositoryUrl or localRepositoryPath
branch
rootPath
credentialsRef
capabilityOverrides
status
createdAt
updatedAt
```

Example:

```json
{
  "id": "binding.retail.struts",
  "projectId": "project.retail",
  "adapterDefinitionId": "adapter.java-struts",
  "bindingName": "Retail Struts Source",
  "repositoryUrl": "https://git.example.com/retail/order-platform.git",
  "branch": "main",
  "rootPath": ".",
  "status": "active"
}
```

---

## 15. Repository snapshots

R1 must treat extraction as snapshot-based.

A snapshot records the repository state that was analysed.

```text
RepositorySnapshot
  id
  projectId
  adapterBindingId
  commitHash
  branch
  createdAt
  createdBy
  status
```

The semantic model must be tied to a snapshot.

This avoids ambiguity when the repository changes after extraction.

---

## 16. Artefact catalogue

The artefact catalogue stores discovered concrete artefacts.

```text
Artefact
  id
  projectId
  snapshotId
  adapterBindingId
  path
  artefactType
  language
  contentHash
  size
  metadata
```

Examples:

```text
src/main/webapp/WEB-INF/struts-config.xml
src/main/webapp/order/confirmOrder.jsp
src/main/java/com/acme/order/web/ConfirmOrderAction.java
src/main/java/com/acme/order/web/OrderForm.java
src/main/resources/ApplicationResources.properties
```

The artefact catalogue is not the semantic model. It is source inventory plus traceability substrate.

---

## 17. Provenance model

Every extracted semantic object must have provenance.

```text
ProvenanceRecord
  id
  projectId
  snapshotId
  semanticObjectId
  semanticRelationshipId, optional
  sourceArtefactId
  sourceRange
  extractionType
  extractorId
  confidence
  evidence
```

Example:

```json
{
  "id": "prov.credit-limit.001",
  "projectId": "project.retail",
  "snapshotId": "snapshot.001",
  "semanticObjectId": "project.retail.rule.credit-limit-validation",
  "sourceArtefactId": "artifact.ConfirmOrderAction.java",
  "sourceRange": {
    "startLine": 42,
    "endLine": 61
  },
  "extractionType": "derived",
  "extractorId": "java-struts-extractor@0.1.0",
  "confidence": "medium",
  "evidence": {
    "signals": [
      "condition uses orderTotal and creditLimit",
      "branch emits credit.limit.exceeded message",
      "branch returns error forward"
    ]
  }
}
```

Extraction types:

```text
extracted
derived
AI-inferred
human-confirmed
validated
uncertain
```

For R1, most structural objects should be `extracted`. Business rules are often `derived` or `AI-inferred with evidence`.

---

## 18. Extraction jobs

Extraction is asynchronous.

```text
ExtractionJob
  id
  projectId
  snapshotId
  adapterBindingId
  status
  startedAt
  completedAt
  createdBy
  diagnostics
  objectCount
  relationshipCount
  artefactCount
```

Statuses:

```text
queued
running
completed
completed-with-warnings
failed
cancelled
```

R1 may use polling for job status. SSE can be added later.

---

## 19. Struts extraction pipeline

### 19.1 Step 1 — Repository snapshot

The core creates or references a repository snapshot.

```text
Input:
  projectId
  adapterBindingId
  branch or commit

Output:
  snapshotId
  commitHash
```

### 19.2 Step 2 — Artefact discovery

The core calls the adapter:

```text
discoverArtefacts(projectBinding, snapshotRef)
```

The adapter returns:

```text
artefacts[]
diagnostics[]
```

The core persists the artefact catalogue.

### 19.3 Step 3 — Framework recognition

The adapter detects Struts framework structures:

```text
struts-config.xml
ActionServlet
Action mappings
ActionForm classes
Forwards
Validation configuration
JSP taglibs
Message resources
```

### 19.4 Step 4 — Structural extraction

The adapter builds a raw technical graph:

```text
file -> class -> method
struts-config action path -> Action class
Action -> forward -> JSP
JSP -> form fields
JSP -> submit actions
ActionForm -> properties
Action -> service calls
Service -> DAO calls
Properties -> messages
```

### 19.5 Step 5 — Semantic normalization

The adapter maps the raw technical graph into canonical semantic objects:

```text
Screen
UserAction
ApplicationAction
BusinessRule
ValidationRule
Entity
Field
DataAccessOperation
Message
Artefact
```

### 19.6 Step 6 — Provenance attachment

Every semantic object and important relationship receives provenance.

At minimum:

```text
sourceArtefactId
sourceRange where available
extractionType
extractorId
confidence
```

### 19.7 Step 7 — Optional AI enrichment

AI enrichment is optional in R1.

If used, AI may suggest:

```text
business-readable labels
rule descriptions
screen summaries
business term normalization
```

AI-enriched output must be marked as:

```text
AI-inferred
```

or:

```text
AI-inferred with deterministic evidence
```

AI enrichment must not overwrite deterministic extracted facts.

### 19.8 Step 8 — Persistence

The core validates adapter output against JSON Schema/OpenAPI contracts and persists:

```text
semantic_objects
semantic_relationships
provenance_records
extraction diagnostics
```

Adapter output is never trusted blindly.

---

## 20. Adapter service API

The Struts Adapter Service exposes a small HTTP API.

### 20.1 Discover artefacts

```http
POST /discover
```

Input:

```json
{
  "projectId": "project.retail",
  "snapshotId": "snapshot.001",
  "repository": {
    "type": "local-git",
    "path": "/repos/retail-order-platform",
    "branch": "main",
    "commitHash": "abc123"
  },
  "rootPath": "."
}
```

Output:

```json
{
  "artefacts": [
    {
      "externalId": "src/main/webapp/WEB-INF/struts-config.xml",
      "path": "src/main/webapp/WEB-INF/struts-config.xml",
      "artefactType": "struts-config",
      "language": "xml",
      "contentHash": "..."
    }
  ],
  "diagnostics": []
}
```

### 20.2 Read artefact

```http
POST /read-artefact
```

Input:

```json
{
  "projectId": "project.retail",
  "snapshotId": "snapshot.001",
  "artefactPath": "src/main/java/com/acme/order/web/ConfirmOrderAction.java"
}
```

Output:

```json
{
  "content": "...",
  "contentType": "text/plain",
  "language": "java",
  "encoding": "utf-8",
  "contentHash": "..."
}
```

### 20.3 Extract semantic objects

```http
POST /extract
```

Input:

```json
{
  "projectId": "project.retail",
  "snapshotId": "snapshot.001",
  "artefacts": [
    {
      "id": "artifact.struts-config",
      "path": "src/main/webapp/WEB-INF/struts-config.xml",
      "artefactType": "struts-config"
    }
  ],
  "extractionProfile": {
    "mode": "r1-readonly",
    "includeBusinessRuleCandidates": true,
    "includeAiEnrichment": false
  }
}
```

Output:

```json
{
  "semanticObjects": [],
  "relationships": [],
  "provenanceRecords": [],
  "diagnostics": []
}
```

---

## 21. Core backend API

### 21.1 Auth APIs

```http
POST /auth/login
POST /auth/logout
GET  /auth/me
```

### 21.2 Project APIs

```http
GET  /projects
GET  /projects/:projectId
GET  /projects/:projectId/status
```

`GET /projects` returns only projects assigned to the authenticated user.

### 21.3 Admin / project assignment APIs

```http
GET    /admin/users
POST   /admin/projects
POST   /admin/projects/:projectId/members
DELETE /admin/projects/:projectId/members/:userId
```

Admin APIs require `admin`.

### 21.4 Adapter binding APIs

```http
GET  /projects/:projectId/adapter-bindings
POST /projects/:projectId/adapter-bindings
```

Creation requires `project-owner` or `admin`.

### 21.5 Snapshot and extraction APIs

```http
POST /projects/:projectId/snapshots
GET  /projects/:projectId/snapshots

POST /projects/:projectId/extractions
GET  /projects/:projectId/extractions
GET  /projects/:projectId/extractions/:jobId
```

Extraction execution requires `project-owner` or `admin`.

### 21.6 Artefact APIs

```http
GET /projects/:projectId/artefacts
GET /projects/:projectId/artefacts/:artefactId
GET /projects/:projectId/artefacts/:artefactId/content
```

Artefact content is read-only.

### 21.7 Semantic model APIs

```http
GET /projects/:projectId/objects
GET /projects/:projectId/objects/:objectId
GET /projects/:projectId/objects/:objectId/related
GET /projects/:projectId/subgraph
GET /projects/:projectId/search
```

### 21.8 Provenance APIs

```http
GET /projects/:projectId/provenance/:objectId
GET /projects/:projectId/source-trace/:objectId
```

### 21.9 Workspace APIs

```http
GET /projects/:projectId/workspaces/default
PUT /projects/:projectId/workspaces/:workspaceId/layout
```

Workspace persistence is layout-only in R1. It must not carry semantic object state.

---

## 22. Frontend integration

R1 replaces the mock data layer with backend data. The visual layout and surface composition already prototyped in the mock-up (application shell, object explorer, impact graph, bottom dock) carry forward as-is — that part of the UI structure is preserved.

The state wiring underneath it is not preserved. R1 implements the real architecture defined in the Backend spec and the Frontend Engineering Guidelines: a Zustand store split into slices, with every action going through `dispatchCommand` and the Command Router — not the mock's `WorkspaceContext` + local `useState`, which was a mock-only shortcut and is retired in R1. §23 below assumes this: `SelectObject`, `RunExtraction` and the other allowed R1 commands are dispatched through the same Command Router that later change-basket commands will use, not through ad hoc setters. This also means the `objectCache`, `selection` and `workspace` slices (Backend spec §3.1) are real and backend-observable from R1 onward, even though no command in R1 mutates semantic state.

### 22.1 Application shell

Required:

```text
Login screen
Authenticated shell
Project selector
Workspace selector
User/session area
Project status indicator
Role/mode indicator
```

### 22.2 Object explorer

The object explorer is populated from:

```http
GET /projects/:projectId/objects
```

Objects should be grouped by canonical kind:

```text
Application
Modules
Screens
User Actions
Application Actions
Business Rules
Validation Rules
Entities
Fields
Data Access
Messages
Artefacts
```

### 22.3 Impact graph

The graph is populated from:

```http
GET /projects/:projectId/subgraph
```

The graph should show canonical semantic objects by default.

Artefacts may appear only when:

```text
source trace is active
technical mode is active
the selected object has direct provenance
```

### 22.4 Source trace

Source trace is populated from:

```http
GET /projects/:projectId/source-trace/:objectId
```

The trace panel must show:

```text
semantic object
source artefact
line range
extraction type
confidence
evidence signals
```

### 22.5 Text surface

The source viewer reads content from:

```http
GET /projects/:projectId/artefacts/:artefactId/content
```

R1 is read-only.

The text surface may highlight source ranges where provenance is available.

### 22.6 Control surfaces

R1 control panels should show:

```text
selected object
semantic kind
description
relationships
provenance summary
confidence/evidence
available actions
```

Future mutation actions should be disabled or visibly marked as not available in R1.

Example:

```text
Create semantic change
  disabled
  reason: R1 is read-only. Change proposal will be enabled in a later release.
```

---

## 23. Read-only command model in R1

The UI architecture is command-oriented, but R1 has no semantic mutation.

Allowed R1 commands:

```text
SelectObject
OpenSourceTrace
OpenArtefact
RunExtraction
SaveWorkspaceLayout
ResetWorkspaceLayout
```

Not allowed in R1:

```text
ProposeBusinessRuleChange
CreateChangeBasket
CommitChangeSet
GenerateArtefactDiff
RunValidation
ApplyChangeSet
ApproveChangeSet
RejectChangeSet
RollbackChangeSet
```

The forbidden commands may exist as typed definitions for future compatibility, but must not execute.

---

## 24. Local demo topology

Recommended local topology:

```text
semantic-prism-ui
  React / TypeScript / Vite

semantic-prism-core
  TypeScript / Node.js / Fastify

semantic-prism-db
  PostgreSQL

struts-adapter-service
  TypeScript initially

sample-struts-repository
  local Git repository or mounted folder
```

Docker Compose should be able to start:

```text
ui
core
db
struts-adapter
```

The sample repository can be mounted read-only for local demo stability.

---

## 25. Implementation sequence

### 25.1 Phase 1 — Core skeleton

Deliver:

```text
Core service bootstrapped
PostgreSQL connection
Migration setup
OpenAPI setup
Runtime schema validation setup
Health endpoint
Docker Compose
```

### 25.2 Phase 2 — Auth and projects

Deliver:

```text
User model
Login
JWT
Project model
Project memberships
Role checks
Project selector API
Basic admin seed data
```

### 25.3 Phase 3 — Adapter registry and binding

Deliver:

```text
Adapter definitions
Project adapter bindings
Struts adapter registration
Project status endpoint
```

### 25.4 Phase 4 — Struts adapter discovery

Deliver:

```text
Discover artefacts
Read artefact
Detect Struts config
Detect JSP files
Detect Action classes
Detect ActionForm classes
Detect properties files
Return diagnostics
```

### 25.5 Phase 5 — Semantic extraction

Deliver:

```text
Map JSPs to Screen
Map submit/link/form actions to UserAction
Map Struts Actions to ApplicationAction
Map ActionForm properties to Field
Map validation methods/config to ValidationRule
Map messages to Message
Map DAO/service usage to DataAccessOperation where feasible
Emit candidate BusinessRule objects where evidence exists
Emit provenance records
```

### 25.6 Phase 6 — Backend query API

Deliver:

```text
Object list
Object detail
Related objects
Subgraph query
Artefact content
Source trace
```

### 25.7 Phase 7 — Frontend integration

Deliver:

```text
Login screen
Project selector
Backend object explorer
Backend graph
Backend source trace
Backend source viewer
Read-only action states
Project status display
```

### 25.8 Phase 8 — Demo hardening

Deliver:

```text
Seed users
Seed project
Stable sample Struts repository
Extraction job repeatability
Error states
Empty states
Demo script
Acceptance test checklist
```

---

## 26. Testing strategy

### 26.1 Core tests

Required:

```text
Auth tests
Project membership tests
Permission tests
Adapter binding tests
Snapshot tests
Extraction job orchestration tests
Semantic object persistence tests
Provenance persistence tests
API contract tests
```

### 26.2 Adapter tests

Required:

```text
Struts config parsing tests
JSP discovery tests
Action class discovery tests
ActionForm discovery tests
Message properties parsing tests
Semantic mapping tests
Provenance range tests where feasible
Diagnostics tests
```

### 26.3 Integration tests

Required:

```text
Login -> project list
Project -> snapshot -> extraction
Extraction -> semantic objects
Semantic object -> provenance
Provenance -> artefact content
Object -> graph relationships
```

### 26.4 Demo acceptance tests

Required:

```text
User can log in.
User sees only assigned projects.
User opens Struts project.
Project status shows repository and extraction state.
User sees semantic object explorer.
User selects a Screen.
Graph highlights related UserAction and ApplicationAction.
User selects a BusinessRule candidate.
Trace panel shows source artefact and line range.
User opens original source read-only.
Viewer cannot run extraction.
Project owner can run extraction.
Future mutation actions are disabled.
```

---

## 27. R1 acceptance criteria

R1 is acceptable when:

```text
1. The application runs locally through Docker Compose.
2. The user can log in.
3. Project assignment works.
4. The user sees only assigned projects.
5. A Struts project can be configured with a Git/local repository binding.
6. A repository snapshot can be created or selected.
7. Artefact discovery runs successfully.
8. Semantic extraction runs successfully.
9. Semantic objects are persisted in the core backend.
10. Every semantic object has provenance or is explicitly marked synthetic.
11. The UI object explorer is populated from backend data.
12. The impact graph is populated from backend relationships.
13. Selecting an object updates the graph and detail panels.
14. Source trace shows artefact, range, extraction type and evidence.
15. Source files can be viewed read-only.
16. Role permissions affect visible and executable actions.
17. No UI component calls the adapter directly.
18. No source modification operation exists in R1.
19. The sample Struts demo can be repeated reliably.
```

---

## 28. Explicit non-goals

R1 does not implement:

```text
Real change proposals
Change basket lifecycle
Committed change sets
Generated technical diffs
Validation orchestration against real systems
Apply operations
Git branch creation
Pull request creation
Runtime invocation
AI autonomous actions
Full business glossary management
Full Java parser correctness
Full SQL/entity lineage
Production IAM integration
Multi-tenant SaaS hardening
Real-time collaboration
```

---

## 29. Deferred decisions

The following decisions are deferred:

```text
Fastify versus NestJS final framework decision
Exact migration tooling
OpenAPI generation tooling
Graph persistence optimization
Use of dedicated graph database
SSE versus polling versus WebSocket
AI enrichment implementation
Rust extraction engine need
Full Java parser selection
Substrate adapter authentication model
Git credential storage model
Change-set persistence model for R2
Validation job model for R2
DSL syntax and grammar
```

---

## 30. Architectural invariants

The following invariants apply from R1 onward:

```text
The core is authoritative for Semantic Prism semantic state.
Adapters are capability providers, not semantic truth owners.
The UI never talks directly to substrate adapters.
The UI receives canonical semantic objects, not Struts-specific shapes.
Every semantic object must be traceable to provenance unless synthetic.
Adapter output must be schema-validated before persistence.
Substrate-specific concepts must not leak into Tier 1 without review.
Semantic mutation must eventually go through commands.
Committed change sets, once implemented, must be immutable.
AI-inferred content must be marked as such.
```

---

## 31. R1 technical thesis

Semantic Prism R1 uses a Git-hosted Java Struts application as the first real substrate to validate the canonical semantic metamodel, provenance model, backend query path and frontend workspace integration without introducing runtime coupling or write operations.

The release proves the product loop:

```text
Source artefacts
  -> substrate discovery
  -> semantic extraction
  -> canonical model
  -> provenance
  -> graph/query API
  -> visual workbench
  -> source trace
```

The result is a working authenticated semantic workbench, not a modernization engine yet.

---

## 32. Glossary

### Semantic Prism Metamodel

The canonical semantic language used by Semantic Prism to describe applications independently of implementation substrate.

### Semantic Object

A persisted instance of a canonical semantic concept, such as Screen, BusinessRule, Field or ApplicationAction.

### Projection

A UI or textual representation of semantic objects, such as a graph, DSL, source trace or object explorer.

### Substrate

The concrete technical environment being analysed, such as Struts, Spring MVC, COBOL, LANSA, RPG, generated Java or an agentic runtime configuration.

### Adapter

A service or module that knows how to discover, read, extract, validate, generate or apply changes for a substrate.

### Artefact

A concrete source file, configuration file, template, schema, repository object or source fragment.

### Provenance

Traceability evidence linking semantic objects and relationships to concrete source artefacts and extraction methods.

### UserAction

A user-meaningful intent, such as Confirm order.

### ApplicationAction

An internal application handling step, such as ConfirmOrderAction.execute.

### BusinessRule

A domain-level rule that determines allowed, required, calculated or decided behaviour.

### ValidationRule

A check that determines whether input, state, artefact or proposed change is acceptable.

---

## 33. Summary

Semantic Prism R1 establishes the first working product foundation:

```text
Authenticated application
Multi-project access
Project assignment
Read-only Struts adapter
Repository discovery
Semantic extraction
Canonical semantic metamodel
Provenance-backed semantic graph
Backend-driven UI
Source trace
Stable demo topology
```

Its purpose is not to modernize Struts yet. Its purpose is to prove that Semantic Prism can turn a real legacy Java Struts codebase into a clean, navigable, traceable semantic workbench.

The critical product asset created in R1 is not the Struts adapter alone. It is the Semantic Prism metamodel: the language that lets future substrates be represented through the same concepts, relationships and workbench surfaces.
