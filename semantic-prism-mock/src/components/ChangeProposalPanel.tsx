import { FilePlus2, PackagePlus } from "lucide-react";
import { Badge } from "./Badge";
import { Panel } from "./Panel";

export function ChangeProposalPanel() {
  return (
    <Panel title="Change Proposal" eyebrow="Later release" action={<Badge tone="grey">Unavailable in R1</Badge>}>
      <div className="form-grid">
        <label>
          Target rule
          <input readOnly value="Read-only R1 workbench" />
        </label>
        <label>
          Business change
          <textarea readOnly value="Semantic change proposals are disabled in R1." />
        </label>
      </div>
      <div className="action-row">
        <button type="button" disabled>
          <FilePlus2 size={16} />
          Create semantic change
        </button>
        <button type="button" disabled>
          <PackagePlus size={16} />
          Generate change set
        </button>
      </div>
    </Panel>
  );
}
