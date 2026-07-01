import { createContext, useContext } from "react";

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

interface WorkspaceContextValue {
  state: WorkspaceState;
  setSelectedObject: (selectedObject: string) => void;
  setGraphMode: (activeGraphMode: GraphMode) => void;
  setBottomTab: (activeBottomTab: BottomTab) => void;
  setTheme: (theme: Theme) => void;
  setChangeActive: (changeActive: boolean) => void;
  setValidationStatus: (validationStatus: ValidationStatus) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceContext.Provider");
  }
  return context;
}
