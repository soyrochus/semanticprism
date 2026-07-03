## MODIFIED Requirements

### Requirement: Top bar contents
The top bar SHALL display: the Semantic Prism logo/name, a project selector populated from the authenticated user's assigned projects, a workspace selector, a search input, an AI status indicator, a theme toggle control, a presentation-mode control, a user/session area, a project status indicator, and a role/mode indicator.

#### Scenario: Top bar renders all required elements
- **WHEN** an authenticated user has a project open
- **THEN** the top bar shows the logo/name, project selector scoped to assigned projects, workspace selector, search input, AI status indicator, theme toggle, presentation-mode control, user/session area, project status indicator, and role/mode indicator

#### Scenario: User opens an assigned project
- **WHEN** an authenticated user selects an assigned Struts project from the project selector
- **THEN** the workbench loads that project's status and workspace from the Semantic Prism Core APIs
