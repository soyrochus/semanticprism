## ADDED Requirements

### Requirement: Four-zone workspace layout
The application SHALL render a single `Impact & Change Workspace` screen composed of exactly four layout zones: a top bar, a left Object Explorer panel, a center Canvas Surface, a right AI/Control column, and a bottom Text Surface dock, arranged as top bar (56px) / left panel (260px) / right column (360px) / bottom dock (260–320px) / center canvas (remaining space).

#### Scenario: Initial layout on load
- **WHEN** the application loads
- **THEN** the top bar, left Object Explorer, center Canvas Surface, right AI/Control column, and bottom Text Surface dock are all visible simultaneously without horizontal scrolling on a standard laptop viewport

#### Scenario: Center canvas dominates visually
- **WHEN** the workspace is rendered at any supported viewport width
- **THEN** the center Canvas Surface occupies the remaining space after the fixed-width left panel, right column, top bar, and bottom dock are laid out, making it the visually largest zone

### Requirement: Top bar contents
The top bar SHALL display: the Semantic Prism logo/name, a project selector showing "Retail Order Platform", a workspace selector showing "Impact & Change Workspace", a search input, an AI status indicator, a theme toggle control, and a presentation-mode control.

#### Scenario: Top bar renders all required elements
- **WHEN** the application loads
- **THEN** the top bar shows the logo/name, project selector, workspace selector, search input, AI status indicator, theme toggle, and presentation-mode control

### Requirement: Light and dark theming
The application SHALL support a light theme (default) and a dark theme, switchable via the top bar theme toggle, implemented with CSS variables covering background, panel, border, primary text, secondary text, and editor-area colors for each theme.

#### Scenario: Default theme on load
- **WHEN** the application loads with no prior theme selection
- **THEN** the light theme is active

#### Scenario: Toggling theme
- **WHEN** the user activates the theme toggle
- **THEN** the application switches between light and dark theme, updating background, panel, border, and text colors across all zones

### Requirement: Semantic accent colors
The application SHALL use a consistent accent color mapping across surfaces: blue for a selected semantic object, cyan for data/entity nodes, violet for AI inference and proposed changes, amber for risk/warning, green for validated/passed, red for failed/blocked, and grey for original artefact/neutral infrastructure.

#### Scenario: Proposed-change elements use violet styling
- **WHEN** a proposed change (e.g. an impact-preview overlay or a diff addition) is displayed anywhere in the UI
- **THEN** it is styled using the violet/blue-violet accent color, distinct from selection (blue), risk (amber), and validated (green) colors

### Requirement: Presentation mode
The application SHALL provide a presentation-mode toggle in the top bar that, when activated, increases interface font sizes, hides minor/secondary controls, keeps the right AI/Control column visible, and forces the light theme.

#### Scenario: Activating presentation mode
- **WHEN** the user activates the presentation-mode control
- **THEN** interface font sizes increase, minor controls are hidden, the right AI/Control column remains visible, and the theme switches to light if it was dark
