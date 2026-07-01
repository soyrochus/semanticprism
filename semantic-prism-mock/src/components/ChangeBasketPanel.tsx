import { RotateCcw, ShieldCheck, SplitSquareHorizontal } from "lucide-react";
import { changeBasketItems, changeSetMeta } from "../data/mockChangeSet";
import { validationWarning } from "../data/mockValidation";
import { Badge } from "./Badge";
import { Panel } from "./Panel";
import { StatusChip } from "./StatusChip";
import { useWorkspace } from "./WorkspaceContext";

interface ChangeBasketPanelProps {
  onClear: () => void;
}

export function ChangeBasketPanel({ onClear }: ChangeBasketPanelProps) {
  const { state, setBottomTab, setValidationStatus } = useWorkspace();

  const runValidation = () => {
    setBottomTab("validation");
    setValidationStatus("running");
    window.setTimeout(() => {
      setValidationStatus("passed-with-warnings");
    }, 900);
  };

  return (
    <Panel
      title="Change Basket / Validation Summary"
      eyebrow={changeSetMeta.label}
      action={<StatusChip tone={state.changeActive ? "warning" : "neutral"}>Draft semantic change</StatusChip>}
    >
      <ul className="basket-list">
        {changeBasketItems.map((item, index) => (
          <li key={item} className={state.changeActive || index === 0 ? "is-active" : ""}>
            <span>{index + 1}</span>
            {item}
          </li>
        ))}
      </ul>
      <div className="basket-meta">
        <Badge tone="violet">{changeSetMeta.id}</Badge>
        <span>{changeSetMeta.provenance}</span>
      </div>
      {state.validationStatus === "passed-with-warnings" ? <div className="warning-callout compact">{validationWarning}</div> : null}
      <div className="action-row three">
        <button type="button" onClick={() => setBottomTab("diff")}>
          <SplitSquareHorizontal size={16} />
          Review diff
        </button>
        <button type="button" className="primary-action" onClick={runValidation}>
          <ShieldCheck size={16} />
          Run mock validation
        </button>
        <button type="button" onClick={onClear}>
          <RotateCcw size={16} />
          Clear
        </button>
      </div>
    </Panel>
  );
}
