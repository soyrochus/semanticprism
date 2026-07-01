import { useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { AiAnalysisPanel } from "./components/AiAnalysisPanel";
import { ChangeBasketPanel } from "./components/ChangeBasketPanel";
import { ChangeProposalPanel } from "./components/ChangeProposalPanel";
import { CodeTabs } from "./components/CodeTabs";
import { ImpactGraph } from "./components/ImpactGraph";
import { ObjectExplorer } from "./components/ObjectExplorer";
import { TopBar } from "./components/TopBar";
import { WorkspaceContext } from "./components/WorkspaceContext";
import type { BottomTab, GraphMode, Theme, ValidationStatus, WorkspaceState } from "./components/WorkspaceContext";

const initialState: WorkspaceState = {
  selectedObject: "CreditLimitValidation",
  activeGraphMode: "impact",
  activeBottomTab: "dsl",
  theme: "light",
  changeActive: false,
  validationStatus: "not-run"
};

export default function App() {
  return <ImpactChangeWorkspace />;
}

function ImpactChangeWorkspace() {
  const [state, setState] = useState<WorkspaceState>(initialState);
  const [presentationMode, setPresentationMode] = useState(false);
  const [previewImpact, setPreviewImpact] = useState(false);

  const updateState = (patch: Partial<WorkspaceState>) => {
    setState((current) => ({ ...current, ...patch }));
  };

  const contextValue = useMemo(
    () => ({
      state,
      setSelectedObject: (selectedObject: string) => updateState({ selectedObject }),
      setGraphMode: (activeGraphMode: GraphMode) => updateState({ activeGraphMode }),
      setBottomTab: (activeBottomTab: BottomTab) => updateState({ activeBottomTab }),
      setTheme: (theme: Theme) => updateState({ theme }),
      setChangeActive: (changeActive: boolean) => updateState({ changeActive }),
      setValidationStatus: (validationStatus: ValidationStatus) => updateState({ validationStatus })
    }),
    [state]
  );

  const effectiveTheme = presentationMode ? "light" : state.theme;

  const togglePresentation = () => {
    setPresentationMode((current) => {
      const next = !current;
      if (next) {
        updateState({ theme: "light" });
      }
      return next;
    });
  };

  const clearChange = () => {
    updateState({
      changeActive: false,
      activeBottomTab: "dsl",
      validationStatus: "not-run",
      selectedObject: "CreditLimitValidation"
    });
    setPreviewImpact(false);
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      <div className={`app-root theme-${effectiveTheme} ${presentationMode ? "presentation-mode" : ""}`}>
        <AppShell
          topBar={
            <TopBar presentationMode={presentationMode} onTogglePresentation={togglePresentation} />
          }
          left={<ObjectExplorer />}
          center={<ImpactGraph previewImpact={previewImpact} />}
          right={
            <>
              <AiAnalysisPanel onPreviewImpact={() => setPreviewImpact(true)} />
              <ChangeProposalPanel
                onCreateSemanticChange={() => updateState({ changeActive: true, activeBottomTab: "diff" })}
                onGenerateChangeSet={() =>
                  updateState({
                    changeActive: true,
                    validationStatus: "not-run",
                    selectedObject: "CS-1042 VIP Credit Exception"
                  })
                }
              />
              <ChangeBasketPanel onClear={clearChange} />
            </>
          }
          bottom={<CodeTabs />}
        />
      </div>
    </WorkspaceContext.Provider>
  );
}
