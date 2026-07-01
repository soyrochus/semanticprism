import { nodeTypeLabels, type NodeType } from "../data/mockGraph";

const legendTypes: NodeType[] = [
  "screen",
  "process",
  "business-rule",
  "field",
  "entity",
  "table",
  "integration",
  "role",
  "policy",
  "source-artifact",
  "validation",
  "change-set",
  "ai-inference"
];

export function GraphLegend() {
  return (
    <div className="graph-legend">
      {legendTypes.map((type) => (
        <span className="legend-item" key={type}>
          <span className={`legend-marker node-type-${type}`} />
          {nodeTypeLabels[type]}
        </span>
      ))}
    </div>
  );
}
