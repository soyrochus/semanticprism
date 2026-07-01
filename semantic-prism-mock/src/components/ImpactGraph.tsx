import dagre from "@dagrejs/dagre";
import * as d3 from "d3";
import { Maximize, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import {
  creditLimitValidationHighlight,
  customerCreditLimitHighlight,
  graphEdges,
  graphModeHighlights,
  graphNodes,
  nodeTypeLabels,
  previewImpactHighlight
} from "../data/mockGraph";
import { IconButton } from "./IconButton";
import { GraphLegend } from "./GraphLegend";
import { useWorkspace, type GraphMode } from "./WorkspaceContext";

interface PositionedNode {
  id: string;
  label: string;
  type: (typeof graphNodes)[number]["type"];
  status?: string;
  risk?: "low" | "medium" | "high";
  confidence?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImpactGraphProps {
  previewImpact: boolean;
}

const nodeWidth = 168;
const nodeHeight = 58;
const modeLabels: Record<GraphMode, string> = {
  impact: "Impact View",
  data: "Data View",
  flow: "Flow View"
};

export function ImpactGraph({ previewImpact }: ImpactGraphProps) {
  const { state, setSelectedObject, setGraphMode } = useWorkspace();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const graphLayerRef = useRef<SVGGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const layout = useMemo(() => {
    const graph = new dagre.graphlib.Graph();
    graph.setDefaultEdgeLabel(() => ({}));
    graph.setGraph({ rankdir: "LR", nodesep: 34, ranksep: 78, marginx: 40, marginy: 40 });

    graphNodes.forEach((node) => {
      graph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    graphEdges.forEach((edge) => graph.setEdge(edge.source, edge.target));
    dagre.layout(graph);

    const positionedNodes = graphNodes.map((node): PositionedNode => {
      const position = graph.node(node.id);
      return {
        ...node,
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2,
        width: nodeWidth,
        height: nodeHeight
      };
    });

    const byId = new Map(positionedNodes.map((node) => [node.id, node]));
    const positionedEdges = graphEdges.map((edge) => ({
      ...edge,
      sourceNode: byId.get(edge.source)!,
      targetNode: byId.get(edge.target)!
    }));

    const bounds = positionedNodes.reduce(
      (acc, node) => ({
        minX: Math.min(acc.minX, node.x),
        minY: Math.min(acc.minY, node.y),
        maxX: Math.max(acc.maxX, node.x + node.width),
        maxY: Math.max(acc.maxY, node.y + node.height)
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    return { positionedNodes, positionedEdges, bounds };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !graphLayerRef.current) return;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.35, 2.2])
      .on("zoom", (event) => {
        d3.select(graphLayerRef.current).attr("transform", event.transform.toString());
      });

    zoomRef.current = zoom;
    d3.select(svgRef.current).call(zoom);
    fitToScreen();

    return () => {
      if (svgRef.current) {
        d3.select(svgRef.current).on(".zoom", null);
      }
    };
  }, []);

  const scriptedHighlight = getScriptedHighlight(state.selectedObject);
  const selectedConnected = useMemo(() => getConnectedSet(state.selectedObject), [state.selectedObject]);
  const activeSet = new Set(scriptedHighlight ?? selectedConnected);
  const modeSet = new Set(graphModeHighlights[state.activeGraphMode]);
  const previewSet = new Set(previewImpact ? previewImpactHighlight : []);
  const hasPrimarySelection = activeSet.size > 0;

  function fitToScreen() {
    if (!svgRef.current || !zoomRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const padding = 72;
    const graphWidth = layout.bounds.maxX - layout.bounds.minX;
    const graphHeight = layout.bounds.maxY - layout.bounds.minY;
    const scale = Math.min((rect.width - padding) / graphWidth, (rect.height - padding) / graphHeight, 1.25);
    const tx = (rect.width - graphWidth * scale) / 2 - layout.bounds.minX * scale;
    const ty = (rect.height - graphHeight * scale) / 2 - layout.bounds.minY * scale;

    d3.select(svgRef.current)
      .transition()
      .duration(240)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }

  function resetView() {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(220)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(32, 32).scale(0.82));
  }

  return (
    <div className="graph-panel">
      <div className="graph-toolbar">
        <div className="segmented-control" role="tablist" aria-label="Graph mode">
          {(Object.keys(modeLabels) as GraphMode[]).map((mode) => (
            <button
              type="button"
              key={mode}
              className={state.activeGraphMode === mode ? "is-active" : ""}
              onClick={() => setGraphMode(mode)}
            >
              {modeLabels[mode]}
            </button>
          ))}
        </div>
        <div className="graph-actions">
          <IconButton label="Fit to screen" onClick={fitToScreen}>
            <Maximize size={17} />
          </IconButton>
          <IconButton label="Reset view" onClick={resetView}>
            <RotateCcw size={17} />
          </IconButton>
        </div>
      </div>
      <svg className="impact-graph" ref={svgRef} role="img" aria-label="Semantic impact graph">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <g ref={graphLayerRef}>
          {layout.positionedEdges.map((edge, index) => {
            const source = edge.sourceNode;
            const target = edge.targetNode;
            const highlighted = activeSet.has(edge.source) && activeSet.has(edge.target);
            const preview = previewSet.has(edge.source) && previewSet.has(edge.target);
            const dimmed = hasPrimarySelection && !highlighted && !preview;
            const sx = source.x + source.width;
            const sy = source.y + source.height / 2;
            const tx = target.x;
            const ty = target.y + target.height / 2;
            const midX = (sx + tx) / 2;
            const path = `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`;
            return (
              <g
                className={`graph-edge ${highlighted ? "is-highlighted" : ""} ${preview ? "is-preview" : ""} ${
                  dimmed ? "is-dimmed" : ""
                }`}
                key={`${edge.source}-${edge.target}-${index}`}
              >
                <path d={path} markerEnd="url(#arrow)" />
                {(highlighted || preview) && (
                  <text x={midX} y={(sy + ty) / 2 - 8}>
                    {edge.type}
                  </text>
                )}
              </g>
            );
          })}
          {layout.positionedNodes.map((node) => {
            const selected = state.selectedObject === node.id;
            const highlighted = activeSet.has(node.id);
            const preview = previewSet.has(node.id);
            const modeEmphasis = modeSet.has(node.id);
            const dimmed = hasPrimarySelection && !highlighted && !preview;
            return (
              <g
                key={node.id}
                className={`graph-node node-type-${node.type} ${selected ? "is-selected" : ""} ${
                  highlighted ? "is-highlighted" : ""
                } ${preview ? "is-preview" : ""} ${modeEmphasis ? "is-mode-emphasis" : ""} ${dimmed ? "is-dimmed" : ""}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedObject(node.id)}
                tabIndex={0}
                role="button"
                aria-label={`${node.label}, ${nodeTypeLabels[node.type]}`}
              >
                <title>{`${node.label} · ${nodeTypeLabels[node.type]}`}</title>
                <rect className="node-card" width={node.width} height={node.height} rx="8" />
                <rect className="node-accent" width="6" height={node.height} rx="3" />
                <circle className="node-marker" cx="20" cy="19" r="6" />
                <text className="node-label" x="34" y="22">
                  {node.label}
                </text>
                <text className="node-type-label" x="34" y="42">
                  {nodeTypeLabels[node.type]}
                </text>
                {node.status && (
                  <text className="node-badge" x={node.width - 10} y="20" textAnchor="end">
                    {node.status}
                  </text>
                )}
                {node.confidence && (
                  <text className="node-confidence" x={node.width - 10} y="43" textAnchor="end">
                    {node.confidence}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <GraphLegend />
    </div>
  );
}

function getScriptedHighlight(selectedObject: string): string[] | null {
  if (selectedObject === "Customer.creditLimit") return customerCreditLimitHighlight;
  if (selectedObject === "CreditLimitValidation") return creditLimitValidationHighlight;
  return null;
}

function getConnectedSet(selectedObject: string): string[] {
  const connected = new Set<string>([selectedObject]);
  graphEdges.forEach((edge) => {
    if (edge.source === selectedObject) connected.add(edge.target);
    if (edge.target === selectedObject) connected.add(edge.source);
  });
  return [...connected];
}
