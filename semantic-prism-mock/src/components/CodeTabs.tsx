import { CheckCircle2, CircleDot, FileCode2, GitPullRequestArrow, ListChecks, Route } from "lucide-react";
import { availableChecks, passedChecklist, validationSummary, validationWarning } from "../data/mockValidation";
import { generatedDiffText, getContextHeading, noDiffText, originalSourceText, semanticDslText, traceText } from "../data/mockText";
import { CodeSurface } from "./CodeSurface";
import { StatusChip } from "./StatusChip";
import { useWorkspace, type BottomTab } from "./WorkspaceContext";

const tabs: Array<{ id: BottomTab; label: string; icon: typeof FileCode2 }> = [
  { id: "dsl", label: "Semantic DSL", icon: FileCode2 },
  { id: "source", label: "Original Source", icon: CircleDot },
  { id: "diff", label: "Generated Diff", icon: GitPullRequestArrow },
  { id: "validation", label: "Validation", icon: ListChecks },
  { id: "trace", label: "Trace", icon: Route }
];

export function CodeTabs() {
  const { state, setBottomTab } = useWorkspace();
  const heading = getContextHeading(state.selectedObject);

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
      <div className="dock-content">{renderActiveTab(state.activeBottomTab, heading, state.changeActive, state.validationStatus)}</div>
    </div>
  );
}

function renderActiveTab(
  activeTab: BottomTab,
  heading: string,
  changeActive: boolean,
  validationStatus: "not-run" | "running" | "passed-with-warnings"
) {
  if (activeTab === "dsl") {
    return (
      <CodeSurface
        heading={heading}
        content={semanticDslText}
        annotate={changeActive ? "proposed" : undefined}
      />
    );
  }
  if (activeTab === "source") {
    return (
      <CodeSurface
        heading={heading}
        content={originalSourceText}
        annotate={changeActive ? "patch" : undefined}
      />
    );
  }
  if (activeTab === "diff") {
    return (
      <CodeSurface
        heading={heading}
        content={changeActive ? generatedDiffText : noDiffText}
        annotate={changeActive ? "proposed" : undefined}
      />
    );
  }
  if (activeTab === "validation") {
    return <ValidationSurface validationStatus={validationStatus} />;
  }
  return <CodeSurface heading={heading} content={traceText} />;
}

function ValidationSurface({ validationStatus }: { validationStatus: "not-run" | "running" | "passed-with-warnings" }) {
  if (validationStatus === "running") {
    return (
      <div className="validation-surface">
        <StatusChip tone="active">Running...</StatusChip>
        <div className="progress-line" />
      </div>
    );
  }

  if (validationStatus === "passed-with-warnings") {
    return (
      <div className="validation-surface">
        <StatusChip tone="warning">Passed with warnings</StatusChip>
        <ul className="check-list">
          {passedChecklist.map((item) => (
            <li key={item}>
              <CheckCircle2 size={16} />
              {item}
            </li>
          ))}
        </ul>
        <div className="warning-callout">{validationWarning}</div>
        <p>{validationSummary}</p>
      </div>
    );
  }

  return (
    <div className="validation-surface">
      <StatusChip>Not run</StatusChip>
      <ul className="check-list">
        {availableChecks.map((check) => (
          <li key={check}>
            <CircleDot size={16} />
            {check}
          </li>
        ))}
      </ul>
    </div>
  );
}
