import { CircleDot, FileCode2, GitPullRequestArrow, ListChecks, Route } from "lucide-react";
import { useR1Store } from "../store/r1Store";
import { CodeSurface } from "./CodeSurface";
import { StatusChip } from "./StatusChip";
import { useWorkspace, type BottomTab } from "./WorkspaceContext";

const tabs: Array<{ id: BottomTab; label: string; icon: typeof FileCode2; unavailable?: boolean }> = [
  { id: "dsl", label: "Semantic DSL", icon: FileCode2, unavailable: true },
  { id: "source", label: "Original Source", icon: CircleDot },
  { id: "diff", label: "Generated Diff", icon: GitPullRequestArrow, unavailable: true },
  { id: "validation", label: "Validation", icon: ListChecks, unavailable: true },
  { id: "trace", label: "Trace", icon: Route }
];

export function CodeTabs() {
  const { state, setBottomTab } = useWorkspace();
  const selectedDetail = useR1Store((store) => store.selectedDetail);
  const sourceTrace = useR1Store((store) => store.sourceTrace);
  const artefactContent = useR1Store((store) => store.artefactContent);

  return (
    <div className="dock">
      <div className="dock-tabs" role="tablist" aria-label="Text surface tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              type="button"
              role="tab"
              key={tab.id}
              className={state.activeBottomTab === tab.id ? "is-active" : ""}
              onClick={() => setBottomTab(tab.id)}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="dock-content">{renderActiveTab(state.activeBottomTab, selectedDetail, sourceTrace, artefactContent)}</div>
    </div>
  );
}

function renderActiveTab(
  activeTab: BottomTab,
  selectedDetail: ReturnType<typeof useR1Store.getState>["selectedDetail"],
  sourceTrace: ReturnType<typeof useR1Store.getState>["sourceTrace"],
  artefactContent: ReturnType<typeof useR1Store.getState>["artefactContent"]
) {
  const heading = selectedDetail?.object.label ?? "No object selected";
  if (activeTab === "source") {
    return (
      <CodeSurface
        heading={artefactContent?.artefact.path ?? heading}
        content={artefactContent?.content ?? "Select an object with provenance and open its source trace."}
        highlightRange={sourceTrace?.traces[0]?.sourceRange}
      />
    );
  }
  if (activeTab === "trace") {
    const traceText =
      sourceTrace?.traces
        .map((trace) =>
          [
            `Object: ${sourceTrace.object.label}`,
            `Artefact: ${trace.artefact?.path ?? "unknown"}`,
            `Extraction: ${trace.extractionType}`,
            `Confidence: ${Math.round(trace.confidence * 100)}%`,
            `Evidence: ${trace.evidence.join(", ")}`
          ].join("\n")
        )
        .join("\n\n") ?? "No source trace loaded.";
    return <CodeSurface heading={heading} content={traceText} />;
  }
  return <UnavailableSurface tab={activeTab} />;
}

function UnavailableSurface({ tab }: { tab: BottomTab }) {
  const label = tab === "dsl" ? "Semantic DSL" : tab === "diff" ? "Generated Diff" : "Validation";
  return (
    <div className="validation-surface">
      <StatusChip tone="neutral">Unavailable in R1</StatusChip>
      <p>{label} is planned for a later release and is disabled in the read-only R1 workbench.</p>
    </div>
  );
}
