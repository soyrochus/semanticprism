import { FileSearch, GitPullRequestArrow, ListChecks } from "lucide-react";
import { useR1Store } from "../store/r1Store";
import { Badge } from "./Badge";
import { Panel } from "./Panel";
import { StatusChip } from "./StatusChip";

export function AiAnalysisPanel() {
  const selectedDetail = useR1Store((store) => store.selectedDetail);
  const dispatchCommand = useR1Store((store) => store.dispatchCommand);
  const object = selectedDetail?.object;

  return (
    <Panel title="AI Analysis" eyebrow="Selected object">
      <div className="selected-object-row">
        <strong>{object?.label ?? "No object selected"}</strong>
        <StatusChip tone="active">{object?.kind ?? "R1"}</StatusChip>
      </div>
      <p className="analysis-copy">{object?.description ?? "Select a backend semantic object to inspect relationships and provenance."}</p>
      <div className="evidence-grid" aria-label="Evidence counts">
        <span>{selectedDetail?.provenance.length ?? 0} provenance records</span>
        <span>{selectedDetail?.relationships.length ?? 0} relationships</span>
        <span>{object?.provenanceIds.length ?? 0} trace refs</span>
        <span>{object ? "canonical" : "empty"} kind</span>
      </div>
      <div className="provenance-row">
        <Badge tone="violet">Backend canonical model</Badge>
      </div>
      <p className="suggested-action">R1 allows inspection, source trace, extraction, and layout changes only.</p>
      <div className="action-stack">
        <button type="button" disabled>
          <GitPullRequestArrow size={16} />
          Preview impact unavailable
        </button>
        <button type="button" onClick={() => object && void dispatchCommand({ type: "OpenSourceTrace", objectId: object.id })}>
          <FileSearch size={16} />
          Show source trace
        </button>
        <button type="button" disabled>
          <ListChecks size={16} />
          Validation unavailable
        </button>
      </div>
    </Panel>
  );
}
