import { FilePlus2, PackagePlus } from "lucide-react";
import { proposalFields } from "../data/mockChangeSet";
import { Badge } from "./Badge";
import { Panel } from "./Panel";

interface ChangeProposalPanelProps {
  onCreateSemanticChange: () => void;
  onGenerateChangeSet: () => void;
}

export function ChangeProposalPanel({ onCreateSemanticChange, onGenerateChangeSet }: ChangeProposalPanelProps) {
  return (
    <Panel title="Change Proposal" eyebrow="Governed semantic edit" action={<Badge tone="amber">Risk Medium</Badge>}>
      <div className="form-grid">
        <label>
          Target rule
          <input readOnly value={proposalFields.targetRule} />
        </label>
        <label>
          Business change
          <textarea readOnly value={proposalFields.businessChange} />
        </label>
        <label>
          Required approval
          <input readOnly value={proposalFields.requiredApproval} />
        </label>
        <label>
          Validation message
          <textarea readOnly value={proposalFields.validationMessage} />
        </label>
        <label>
          Risk level
          <input readOnly value={proposalFields.riskLevel} />
        </label>
      </div>
      <div className="action-row">
        <button type="button" className="primary-action" onClick={onCreateSemanticChange}>
          <FilePlus2 size={16} />
          Create semantic change
        </button>
        <button type="button" onClick={onGenerateChangeSet}>
          <PackagePlus size={16} />
          Generate change set
        </button>
      </div>
    </Panel>
  );
}
