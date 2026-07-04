import { useR1Store } from "../store/r1Store";

export type GraphMode = "impact" | "data" | "flow";
export type BottomTab = "dsl" | "source" | "diff" | "validation" | "trace";
export type Theme = "light" | "dark";
export type ValidationStatus = "not-run" | "running" | "passed-with-warnings";

export interface WorkspaceState {
  selectedObject: string;
  activeGraphMode: GraphMode;
  activeBottomTab: BottomTab;
  theme: Theme;
  changeActive: boolean;
  validationStatus: ValidationStatus;
}

export function useWorkspace() {
  const store = useR1Store();
  return {
    state: {
      selectedObject: store.selectedObject,
      activeGraphMode: store.activeGraphMode,
      activeBottomTab: store.activeBottomTab,
      theme: store.theme,
      changeActive: store.changeActive,
      validationStatus: store.validationStatus
    },
    setSelectedObject: (selectedObject: string) => store.dispatchCommand({ type: "SelectObject", objectId: selectedObject }),
    setGraphMode: store.setGraphMode,
    setBottomTab: store.setBottomTab,
    setTheme: store.setTheme,
    setChangeActive: () => store.dispatchCommand({ type: "ProposeBusinessRuleChange" }),
    setValidationStatus: store.setValidationStatus
  };
}
