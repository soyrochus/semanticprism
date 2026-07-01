import { FileSearch, GitPullRequestArrow, ListChecks, Sparkles } from "lucide-react";
import { Badge } from "./Badge";
import { Panel } from "./Panel";
import { StatusChip } from "./StatusChip";
import { useWorkspace } from "./WorkspaceContext";

interface AiAnalysisPanelProps {
  onPreviewImpact: () => void;
}

export function AiAnalysisPanel({ onPreviewImpact }: AiAnalysisPanelProps) {
  const { state, setBottomTab } = useWorkspace();
  const analysis = getAnalysis(state.selectedObject);

  return (
    <Panel title="AI Analysis" eyebrow="Selected object">
      <div className="selected-object-row">
        <strong>{state.selectedObject}</strong>
        <StatusChip tone={analysis.tone}>{analysis.status}</StatusChip>
      </div>
      <p className="analysis-copy">{analysis.summary}</p>
      <div className="evidence-grid" aria-label="Evidence counts">
        <span>3 source fragments</span>
        <span>2 semantic entities</span>
        <span>1 UI event handler</span>
        <span>1 validation test</span>
      </div>
      <div className="provenance-row">
        <Badge tone="violet">Deterministically derived + AI explained</Badge>
      </div>
      <p className="suggested-action">{analysis.action}</p>
      <div className="action-stack">
        <button type="button" className="primary-action" onClick={onPreviewImpact}>
          <GitPullRequestArrow size={16} />
          Preview impact
        </button>
        <button type="button" onClick={() => setBottomTab("trace")}>
          <FileSearch size={16} />
          Show source trace
        </button>
        <button type="button" onClick={() => setBottomTab("validation")}>
          <ListChecks size={16} />
          Generate validation checklist
        </button>
        <button type="button" onClick={() => setBottomTab("dsl")}>
          <Sparkles size={16} />
          Explain in business language
        </button>
      </div>
    </Panel>
  );
}

function getAnalysis(selectedObject: string) {
  if (selectedObject === "Customer.creditLimit") {
    return {
      status: "Field",
      tone: "active" as const,
      summary:
        "Customer.creditLimit is the principal limit field read by CreditLimitValidation and persisted through the CUSTOMER table projection.",
      action: "Review downstream validation and generated change-set references before changing this field mapping."
    };
  }

  if (selectedObject === "CS-1042 VIP Credit Exception") {
    return {
      status: "Draft",
      tone: "warning" as const,
      summary:
        "CS-1042 collects the proposed VIP exception rule, SalesManager approval dependency, source patch, and validation test update.",
      action: "Run mock validation and review the role-mapping warning before presenting the change set."
    };
  }

  if (selectedObject === "VIPExceptionPolicy") {
    return {
      status: "Proposed",
      tone: "warning" as const,
      summary:
        "VIPExceptionPolicy narrows the existing blocking rule by requiring SalesManager approval when a VIP order exceeds credit limit.",
      action: "Preview impact to verify the proposed policy touches approval role, validation test, and generated change set only."
    };
  }

  return {
    status: "Rule",
    tone: "active" as const,
    summary:
      "CreditLimitValidation blocks orders whose total exceeds the customer credit limit. The semantic surface links the UI event, legacy source, involved fields, entities, and validation test.",
    action:
      "Suggested action: add a governed VIP exception requiring SalesManager approval, then generate a traceable source patch and validation checklist."
  };
}
