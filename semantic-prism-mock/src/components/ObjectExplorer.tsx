import { ChevronRight } from "lucide-react";
import { explorerTree } from "../data/mockExplorer";
import { Panel } from "./Panel";
import { useWorkspace } from "./WorkspaceContext";

export function ObjectExplorer() {
  const { state, setSelectedObject } = useWorkspace();

  return (
    <Panel title="Object Explorer" eyebrow="Retail Order Platform" className="explorer-panel">
      <div className="tree-root">
        {explorerTree.map((group) => (
          <div className="tree-group" key={group.title}>
            <div className="tree-group-title">
              <ChevronRight size={14} />
              {group.title}
            </div>
            <div className="tree-items">
              {group.items.map((item) => {
                const active = state.selectedObject === item;
                return (
                  <button
                    type="button"
                    key={item}
                    className={`tree-item ${active ? "is-selected" : ""}`}
                    onClick={() => setSelectedObject(item)}
                  >
                    <span className="tree-dot" />
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
