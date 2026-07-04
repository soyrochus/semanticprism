import { ChevronRight } from "lucide-react";
import { useR1Store } from "../store/r1Store";
import { Panel } from "./Panel";
import { useWorkspace } from "./WorkspaceContext";

const groupLabels: Record<string, string> = {
  Application: "Applications",
  Module: "Modules",
  Screen: "Screens",
  UserAction: "User Actions",
  ApplicationAction: "Application Actions",
  BusinessRule: "Business Rules",
  ValidationRule: "Validation Rules",
  Entity: "Entities",
  Field: "Fields",
  DataAccessOperation: "Data Access",
  Message: "Messages",
  Artefact: "Artefacts"
};

export function ObjectExplorer() {
  const { state, setSelectedObject } = useWorkspace();
  const groups = useR1Store((store) => store.objectGroups);

  return (
    <Panel title="Object Explorer" eyebrow="Canonical objects" className="explorer-panel">
      <div className="tree-root">
        {Object.entries(groupLabels).map(([kind, label]) => {
          const items = groups[kind] ?? [];
          if (items.length === 0) return null;
          return (
            <div className="tree-group" key={kind}>
              <div className="tree-group-title">
                <ChevronRight size={14} />
                {label}
              </div>
              <div className="tree-items">
                {items.map((item) => {
                  const active = state.selectedObject === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`tree-item ${active ? "is-selected" : ""}`}
                      onClick={() => void setSelectedObject(item.id)}
                    >
                      <span className="tree-dot" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
