## MODIFIED Requirements

### Requirement: Shared workspace state shape
The application SHALL maintain a Zustand store split into independent slices (`selection`, `workspace`, `changeBasket`, `validation`, `aiSession`, `objectCache`), with every mutation routed through `dispatchCommand` and the Command Router, replacing the mock's single shared client-side state object and local setters.

#### Scenario: State updates flow through commands
- **WHEN** any user or AI action changes selection, workspace layout, or backend-derived data
- **THEN** the change is dispatched as a command through the Command Router, and the relevant store slice updates from the backend's response rather than from a local setter

### Requirement: Bidirectional selection sync between explorer and graph
Selecting an object in the Object Explorer SHALL dispatch a `SelectObject` command that updates the `selection` slice's `selectedObjectId`; selecting a node in the graph SHALL dispatch the same command. Every surface subscribed to `selection` re-renders from the shared slice.

#### Scenario: Explorer selection propagates via command
- **WHEN** the user selects an item in the Object Explorer
- **THEN** a `SelectObject` command updates `selection.selectedObjectId`, and the graph, dock, and control panels re-render from that shared state

#### Scenario: Graph selection propagates via command
- **WHEN** the user clicks a node directly in the Canvas Surface
- **THEN** the same `SelectObject` command updates `selection.selectedObjectId`, and the Object Explorer's selected item updates to match

## ADDED Requirements

### Requirement: Read-only command allowlist
The Command Router SHALL execute only `SelectObject`, `OpenSourceTrace`, `OpenArtefact`, `RunExtraction`, `SaveWorkspaceLayout`, and `ResetWorkspaceLayout` in R1. Commands outside this allowlist (`ProposeBusinessRuleChange`, `CreateChangeBasket`, `CommitChangeSet`, `GenerateArtefactDiff`, `RunValidation`, `ApplyChangeSet`, `ApproveChangeSet`, `RejectChangeSet`, `RollbackChangeSet`) SHALL NOT execute even if a typed definition exists for forward compatibility.

#### Scenario: Forbidden command does not execute
- **WHEN** the UI or an AI agent attempts to dispatch a command outside the R1 allowlist
- **THEN** the Command Router does not execute it, and any UI control that would trigger it is disabled or marked unavailable

### Requirement: Adapter isolation from UI
The UI SHALL call only Semantic Prism Core APIs and SHALL NOT call Struts adapter service APIs directly.

#### Scenario: UI reads artefact content through the core
- **WHEN** the source viewer needs artefact content
- **THEN** it requests content through the core artefact API rather than the adapter service endpoint directly
