import { RotateCcw, ShieldCheck, SplitSquareHorizontal } from "lucide-react";
import { Badge } from "./Badge";
import { Panel } from "./Panel";
import { StatusChip } from "./StatusChip";

export function ChangeBasketPanel() {
  return (
    <Panel
      title="Change Basket / Validation Summary"
      eyebrow="R1 command guardrail"
      action={<StatusChip tone="neutral">Read-only</StatusChip>}
    >
      <ul className="basket-list">
        <li className="is-active">
          <span>1</span>
          Selection, source trace, artefact open, extraction, and layout commands are allowed.
        </li>
        <li>
          <span>2</span>
          Change-set mutation, validation orchestration, apply, approval, rejection, and rollback are disabled.
        </li>
      </ul>
      <div className="basket-meta">
        <Badge tone="violet">R1</Badge>
        <span>No source mutation command is executable.</span>
      </div>
      <div className="action-row three">
        <button type="button" disabled>
          <SplitSquareHorizontal size={16} />
          Review diff
        </button>
        <button type="button" disabled>
          <ShieldCheck size={16} />
          Run validation
        </button>
        <button type="button" disabled>
          <RotateCcw size={16} />
          Rollback
        </button>
      </div>
    </Panel>
  );
}
