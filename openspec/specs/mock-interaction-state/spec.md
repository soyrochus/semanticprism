# mock-interaction-state Specification

## Purpose

Defines the shared client-side state model that ties the Impact & Change Workspace mock-up's zones together, including the fields tracked, how selection and theme changes propagate across zones, and the constraint that the mock-up holds no routing/URL state and resets on reload.

## Requirements

### Requirement: Shared workspace state shape
The application SHALL maintain a single shared client-side state object containing exactly: `selectedObject`, `activeGraphMode`, `activeBottomTab`, `theme`, `changeActive`, and `validationStatus`, accessible to the Object Explorer, Canvas Surface, bottom dock, and right-column control panels.

#### Scenario: State accessible across zones
- **WHEN** any of the six state fields changes
- **THEN** every zone that depends on that field (per its own capability spec) re-renders to reflect the new value without requiring a page reload

### Requirement: Bidirectional selection sync between explorer and graph
Selecting an object in the Object Explorer SHALL update `selectedObject` and the graph's highlighted node; selecting a node in the graph SHALL likewise update `selectedObject` and the Object Explorer's selected item.

#### Scenario: Explorer selection propagates to graph
- **WHEN** the user selects an item in the Object Explorer
- **THEN** `selectedObject` updates and the corresponding graph node becomes selected/highlighted

#### Scenario: Graph selection propagates to explorer
- **WHEN** the user clicks a node directly in the Canvas Surface
- **THEN** `selectedObject` updates and the Object Explorer's selected item updates to match

### Requirement: No routing or URL state
The mock-up SHALL NOT implement client-side routing or reflect any of the six shared state fields in the URL; all state SHALL be held in-memory and reset on page reload.

#### Scenario: Reload resets state
- **WHEN** the browser page is reloaded
- **THEN** `selectedObject`, `activeGraphMode`, `activeBottomTab`, `changeActive`, and `validationStatus` return to their initial default values (theme MAY persist per browser/session storage only if explicitly implemented; no persistence is required)

### Requirement: Theme toggle updates shared state
Activating the theme toggle SHALL update the shared `theme` field between `light` and `dark`, and every zone SHALL re-render using the corresponding theme's CSS variables.

#### Scenario: Toggling theme updates all zones
- **WHEN** `theme` changes
- **THEN** the top bar, Object Explorer, Canvas Surface, bottom dock, and right column all re-render using the new theme's colors
